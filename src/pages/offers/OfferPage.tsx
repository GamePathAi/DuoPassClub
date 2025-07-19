import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
 
  Star, 
  Users, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Shield,
  Zap,

  MessageCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { MembershipService } from '../../services/membershipService';
import { supabase } from '../../lib/supabaseConfig';
import { Offer } from '../../types';



interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Gallery {
  id: string;
  image_url: string;
  caption?: string;
}

export default function OfferPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState<{
    isActive: boolean;
    canRedeem: boolean;
    redeemCount: number;
    plan?: {
      max_offers_per_month: number;
      cashback_percentage: number;
    };
  } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // Mapear slugs para IDs de ofertas (em produção, isso viria do banco)
  const offerSlugs: Record<string, string> = {
    'desconto-pizza': '1',
    'massagem-relaxante': '2', 
    'corte-barba': '3',
    'aula-yoga': '4'
  };

  useEffect(() => {
    if (slug && user) {
      loadOfferData();
      checkMembershipStatus();
      checkIfFavorited();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, user?.id]);

  const loadOfferData = async () => {
    try {
      setLoading(true);
      const offerId = offerSlugs[slug || ''];
      
      if (!offerId) {
        navigate('/ofertas');
        return;
      }

      // Buscar dados da oferta
      const { data: offerData } = await supabase
        .from('offers')
        .select(`
          *,
          merchant:merchants(*)
        `)
        .eq('id', offerId)
        .single();

      if (!offerData) {
        navigate('/ofertas');
        return;
      }

      setOffer(offerData);

      // Buscar avaliações
      const { data: reviewsData } = await supabase
        .from('offer_reviews')
        .select('*')
        .eq('offer_id', offerId)
        .order('created_at', { ascending: false })
        .limit(10);

      setReviews(reviewsData || []);

      // Buscar galeria de fotos
      const { data: galleryData } = await supabase
        .from('offer_gallery')
        .select('*')
        .eq('offer_id', offerId)
        .order('created_at', { ascending: false });

      setGallery(galleryData || []);
    } catch (err) {
      console.error('Erro ao carregar dados da oferta:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkMembershipStatus = async () => {
    if (!user) return;
    
    try {
      const status = await MembershipService.checkMembershipStatus(user.id);
      setMembershipStatus(status);
    } catch (err) {
      console.error('Erro ao verificar membership:', err);
    }
  };

  const checkIfFavorited = async () => {
    if (!user || !offer) return;

    try {
      const { data } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('offer_id', offer.id)
        .single();

      setIsFavorited(!!data);
    } catch {
        // Não é favorito
        setIsFavorited(false);
      }
  };

  const handleRedeem = async () => {
    if (!user || !offer) return;

    // Verificar se tem assinatura ativa
    if (!membershipStatus?.isActive) {
      setShowPaywall(true);
      return;
    }

    // Verificar limite de resgates
    if (!membershipStatus?.canRedeem) {
      setShowPaywall(true);
      return;
    }

    try {
      setIsRedeeming(true);
      const result = await MembershipService.redeemOffer(user.id, offer.id);
      
      if (result.success) {
        navigate(`/voucher/${result.voucherId}`);
      } else if (result.requiresUpgrade) {
        setShowPaywall(true);
      } else {
        alert(result.error || 'Erro ao resgatar oferta');
      }
    } catch (err) {
      console.error('Erro ao resgatar:', err);
      alert('Erro ao resgatar oferta');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleFavorite = async () => {
    if (!user || !offer) return;

    try {
      if (isFavorited) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('offer_id', offer.id);
        setIsFavorited(false);
      } else {
        await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            offer_id: offer.id,
            created_at: new Date().toISOString()
          });
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Erro ao favoritar:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: offer?.title,
          text: offer?.description,
          url: window.location.href
        });
      } catch {
          console.log('Compartilhamento cancelado');
        }
    } else {
      // Fallback para copiar URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const submitReview = async () => {
    if (!user || !offer || !newReview.comment.trim()) return;

    try {
      const { error } = await supabase
        .from('offer_reviews')
        .insert({
          offer_id: offer.id,
          user_id: user.id,
          user_name: user.email?.split('@')[0] || 'Usuário',
          rating: newReview.rating,
          comment: newReview.comment,
          created_at: new Date().toISOString()
        });

      if (!error) {
        setShowReviewModal(false);
        setNewReview({ rating: 5, comment: '' });
        loadOfferData(); // Recarregar avaliações
      }
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C91F1F]"></div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oferta não encontrada</h1>
          <button
            onClick={() => navigate('/ofertas')}
            className="text-[#C91F1F] hover:underline"
          >
            Voltar às ofertas
          </button>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full ${
                  isFavorited 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galeria de Imagens */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                {gallery.length > 0 ? (
                  <img
                    src={gallery[activeImageIndex]?.image_url || offer.image_url}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {gallery.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                      {gallery.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {gallery.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {gallery.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          index === activeImageIndex ? 'border-[#C91F1F]' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.image_url}
                          alt={image.caption || `Imagem ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Informações da Oferta */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{averageRating.toFixed(1)} ({reviews.length} avaliações)</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{offer.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#C91F1F] mb-1">
                    CHF {((offer.original_value * 0.18) / 2).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    CHF {(offer.original_value * 0.18).toFixed(2)}
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    50% OFF
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{offer.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Válido até {new Date(offer.expires_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Para 2 pessoas</span>
                </div>
              </div>

              {/* Termos e Condições */}
              {offer.terms_conditions && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Termos e Condições</h3>
                  <p className="text-sm text-gray-600">{offer.terms_conditions}</p>
                </div>
              )}
            </div>

            {/* Localização */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Localização
              </h3>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Mapa interativo</p>
                  <p className="text-sm">{offer.location}</p>
                </div>
              </div>
            </div>

            {/* Avaliações */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Avaliações ({reviews.length})
                </h3>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="text-[#C91F1F] hover:underline text-sm"
                >
                  Escrever avaliação
                </button>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-[#C91F1F] rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {review.user_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="ml-3 font-medium text-gray-900">{review.user_name}</span>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Ainda não há avaliações para esta oferta.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de Resgate */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-[#C91F1F] mb-2">
                  CHF {((offer.original_value * 0.18) / 2).toFixed(2)}
                </div>
                <div className="text-lg text-gray-500 line-through mb-1">
                  CHF {(offer.original_value * 0.18).toFixed(2)}
                </div>
                <div className="text-green-600 font-semibold">50% de desconto</div>
              </div>

              {membershipStatus?.isActive ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Resgates este mês:</span>
                    <span>{membershipStatus.redeemCount}/{membershipStatus.plan?.max_offers_per_month === -1 ? '∞' : membershipStatus.plan?.max_offers_per_month}</span>
                  </div>
                  {membershipStatus.canRedeem ? (
                    <div className="flex items-center text-green-600 text-sm mb-4">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Você pode resgatar esta oferta</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-orange-600 text-sm mb-4">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span>Limite de resgates atingido</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center text-orange-800 text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>Assinatura necessária para resgatar</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleRedeem}
                disabled={isRedeeming}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                  isRedeeming
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#C91F1F] to-[#8B1538] hover:from-[#B01B1B] hover:to-[#7A1230]'
                }`}
              >
                {isRedeeming ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Resgatando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Resgatar Oferta
                  </div>
                )}
              </button>

              {membershipStatus?.plan && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <Zap className="h-4 w-4 mr-1 text-[#C91F1F]" />
                    <span>Cashback: {membershipStatus.plan.cashback_percentage}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Informações do Estabelecimento */}
            {offer.merchant && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Sobre o estabelecimento</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{offer.merchant.business_name}</h4>
                    <p className="text-sm text-gray-600">{offer.merchant.description}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{offer.merchant.address}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Paywall */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#C91F1F] to-[#8B1538] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Torne-se Membro</h3>
              <p className="text-gray-600 mb-6">
                Para resgatar ofertas exclusivas, você precisa de uma assinatura ativa.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/customer-dashboard?tab=subscription')}
                  className="w-full bg-gradient-to-r from-[#C91F1F] to-[#8B1538] text-white py-3 rounded-lg font-semibold hover:from-[#B01B1B] hover:to-[#7A1230] transition-colors"
                >
                  Ver Planos
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full text-gray-600 py-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Avaliação */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Escrever Avaliação</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nota</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setNewReview({ ...newReview, rating })}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= newReview.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comentário</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent"
                rows={4}
                placeholder="Conte sobre sua experiência..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={submitReview}
                disabled={!newReview.comment.trim()}
                className="flex-1 py-2 px-4 bg-[#C91F1F] text-white rounded-lg hover:bg-[#B01B1B] disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}