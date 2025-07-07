import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Star, Users, Zap, ArrowLeft, Share2, Heart, Shield } from 'lucide-react';
import { Offer } from '../types';
import { useAuth } from '../contexts/AuthContext';


export function OfferDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loginDemo } = useAuth();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    // Mock offer details direto aqui - SINCRONIZADO COM OFFERS.TSX
    const offerDetails = {
      'demo-1': {
        id: 'demo-1',
        merchant_id: 'demo-merchant-1',
        title: '🍕 Pizza Margherita + Bebida GRÁTIS',
        description: 'Deliciosa pizza artesanal com molho especial da casa, mussarela fresca e manjericão. Acompanha refrigerante ou suco natural à sua escolha!',
        original_value: 45.90,
        category: 'gastronomy',
        location: 'Zürich',
        city: 'Zürich',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
        terms_conditions: 'Válido de segunda a quinta-feira. Não cumulativo com outras promoções.',
        created_at: new Date().toISOString(),
        merchant: {
          business_name: 'Pizzaria Bella Vista',
          contact_info: '+41 44 123 4567'
        }
      },
      'demo-2': {
        id: 'demo-2',
        merchant_id: 'demo-merchant-2',
        title: '💄 Maquiagem Completa - 50% OFF',
        description: 'Transformação completa com maquiagem profissional para qualquer ocasião. Inclui limpeza de pele, base, contorno, olhos e batom de longa duração.',
        original_value: 120.00,
        category: 'beauty',
        location: 'Genève',
        city: 'Genève',
        expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop',
        terms_conditions: 'Agendamento obrigatório. Válido até o final do mês.',
        created_at: new Date().toISOString(),
        merchant: {
          business_name: 'Studio Glamour',
          contact_info: '+41 22 987 6543'
        }
      },
      'demo-3': {
        id: 'demo-3',
        merchant_id: 'demo-merchant-3',
        title: '🎬 Cinema 2x1 + Pipoca Gigante',
        description: 'Ingresso duplo para qualquer sessão + pipoca gigante doce ou salgada para compartilhar. Válido para todos os filmes em cartaz!',
        original_value: 38.00,
        category: 'leisure',
        location: 'Basel',
        city: 'Basel',
        expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1489185078254-c3365d6e359f?w=800&h=600&fit=crop',
        terms_conditions: 'Não válido para pré-estreias e sessões especiais.',
        created_at: new Date().toISOString(),
        merchant: {
          business_name: 'CineMax Basel',
          contact_info: '+41 61 456 7890'
        }
      },
      'demo-4': {
        id: 'demo-4',
        merchant_id: 'demo-merchant-4',
        title: '💪 1 Mês de Academia + Personal',
        description: 'Acesso completo à academia por 30 dias + 2 sessões de personal trainer. Inclui avaliação física e plano de treino personalizado.',
        original_value: 180.00,
        category: 'fitness',
        location: 'Bern',
        city: 'Bern',
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        terms_conditions: 'Válido apenas para novos alunos. Documentos obrigatórios.',
        created_at: new Date().toISOString(),
        merchant: {
          business_name: 'FitZone Bern',
          contact_info: '+41 31 234 5678'
        }
      },
      'demo-5': {
        id: 'demo-5',
        merchant_id: 'demo-merchant-5',
        title: '📱 iPhone 15 - Cashback CHF 36.-',
        description: 'iPhone 15 128GB com cashback exclusivo de CHF 36.- + película de vidro e capinha premium inclusos. Parcelamento em até 12x sem juros!',
        original_value: 1299.00,
        category: 'shopping',
        location: 'Lausanne',
        city: 'Lausanne',
        expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
        terms_conditions: 'Cashback creditado em até 30 dias. Estoque limitado.',
        created_at: new Date().toISOString(),
        merchant: {
          business_name: 'TechStore Lausanne',
          contact_info: '+41 21 345 6789'
        }
      },
      'demo-6': {
        id: 'demo-6',
        merchant_id: 'demo-merchant-6',
        title: '🏠 Limpeza Residencial Completa',
        description: 'Limpeza profunda de casa ou apartamento até 100m². Inclui todos os cômodos, janelas, eletrodomésticos e organização básica.',
        original_value: 150.00,
        category: 'services',
        location: 'Winterthur',
        city: 'Winterthur',
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        terms_conditions: 'Agendamento com 48h de antecedência. Produtos inclusos.',
        created_at: new Date().toISOString(),
        merchant: {
          business_name: 'CleanPro Services',
          contact_info: '+41 52 678 9012'
        }
      }
    };
    
    const selectedOffer = offerDetails[id as keyof typeof offerDetails];
    setOffer(selectedOffer || null);
    setLoading(false);
  }, [id]);



  const handleRedeemVoucher = async () => {
    // Check if user is logged in, if not, do demo login
    if (!user) {
      console.log('🎭 Usuário não logado, fazendo login demo...');
      await loginDemo();
      // Wait a bit for the auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRedeeming(true);
    
    try {
      // Sistema mock para demo - criar voucher único
      const voucherId = `voucher-${Date.now()}`;
      const voucherCode = `DUO${Date.now().toString().slice(-6)}`;
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Criar dados do voucher mock
      const newVoucher = {
        id: voucherId,
        offer_id: offer?.id,
        status: 'active',
        code: voucherCode,
        qr_code: `{"voucher_id":"${voucherId}","code":"${voucherCode}","offer_id":"${offer?.id}"}`,
        redeemed_at: new Date().toISOString(),
        expires_at: offer?.expires_at,
        offer_details: {
          title: offer?.title,
          business_name: offer?.merchant?.business_name,
          original_price: offer?.original_value,
          duo_price: offer?.original_value ? offer.original_value * 0.5 : 0
        }
      };
      
      // Salvar no localStorage para demo
      localStorage.setItem(`voucher-${voucherId}`, JSON.stringify(newVoucher));
      
      // Redirecionar para página do voucher ativo
      navigate(`/voucher/${voucherId}/active?code=${voucherCode}`);
    } catch (error) {
      console.error('Erro ao resgatar voucher:', error);
      alert('Erro ao resgatar voucher. Tente novamente.');
    }
    
    setIsRedeeming(false);
    setShowRedeemModal(false);
  };

  const toggleSaveOffer = () => {
    setIsSaved(!isSaved);
    // Aqui você implementaria a lógica para salvar/remover da lista de favoritos
  };

  const shareOffer = () => {
    if (navigator.share) {
      navigator.share({
        title: offer?.title,
        text: offer?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const getDaysRemaining = () => {
    if (!offer) return 0;
    const now = new Date();
    const expiry = new Date(offer.expires_at);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDiscountPercentage = () => {
    return 50; // Simulado
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C91F1F] mx-auto mb-4"></div>
          <p className="text-[#333333] font-medium">Carregando detalhes da oferta...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#333333] mb-4">404</h1>
          <p className="text-gray-600 mb-4">Oferta não encontrada</p>
          <button
            onClick={() => navigate('/offers')}
            className="text-[#C91F1F] hover:underline"
          >
            Voltar às ofertas
          </button>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining();
  const discountPercentage = getDiscountPercentage();
  const discountedPrice = offer.original_value * (1 - discountPercentage / 100);

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com navegação */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#333333] hover:text-[#C91F1F] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={shareOffer}
              className="p-2 rounded-full bg-white border-2 border-gray-200 hover:border-[#F6C100] transition-colors"
            >
              <Share2 className="w-5 h-5 text-[#333333]" />
            </button>
            <button
              onClick={toggleSaveOffer}
              className={`p-2 rounded-full border-2 transition-colors ${
                isSaved 
                  ? 'bg-red-50 border-red-200 text-red-500' 
                  : 'bg-white border-gray-200 hover:border-[#F6C100] text-[#333333]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Imagem principal */}
        <div className="relative mb-8">
          <div className="h-80 bg-gray-200 rounded-2xl overflow-hidden">
            {offer.image_url && (
              <img
                src={offer.image_url}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Badges sobrepostos */}
          <div className="absolute top-4 left-4 flex gap-2">
            {daysRemaining <= 3 && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 animate-pulse">
                <Clock className="w-4 h-4" />
                {daysRemaining <= 1 ? 'ÚLTIMAS HORAS' : `${daysRemaining} DIAS`}
              </div>
            )}
          </div>
          
          <div className="absolute top-4 right-4">
            <div className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-bold">
              -{discountPercentage}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2">
            {/* Título e categoria */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-3xl font-bold text-[#333333] flex-1">
                  {offer.title}
                </h1>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white ml-4">
                  {offer.category}
                </span>
              </div>
              
              {/* Social proof */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">4.8</span>
                  <span>(127 avaliações)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-[#C91F1F]" />
                  <span>342+ pessoas resgataram</span>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#333333] mb-3">Sobre esta oferta</h2>
              <p className="text-gray-700 leading-relaxed">
                {offer.description}
              </p>
            </div>

            {/* Informações do estabelecimento */}
            {offer.merchant && (
              <div className="mb-8 p-6 bg-white rounded-2xl border-2 border-gray-100">
                <h3 className="text-lg font-bold text-[#333333] mb-3">Estabelecimento</h3>
                <div className="space-y-2">
                  <p className="font-semibold text-[#333333]">{offer.merchant.business_name}</p>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-[#C91F1F]" />
                    <span>{offer.merchant.contact_info}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Termos e condições */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#333333] mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C91F1F]" />
                Termos e Condições
              </h2>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {offer.terms_conditions}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar com ação */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Card de preço */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-green-600">
                      CHF {discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      CHF {offer.original_value.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-green-600 font-medium">
                    Economize CHF {(offer.original_value - discountedPrice).toFixed(2)}
                  </div>
                </div>

                {/* Informações importantes */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-3 text-[#C91F1F]" />
                    <span className="text-gray-700">
                      Válido até: {new Date(offer.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-[#C91F1F]" />
                    <span className="text-gray-700">{offer.city}</span>
                  </div>
                  {daysRemaining <= 7 && (
                    <div className="flex items-center text-sm text-red-600">
                      <Clock className="w-4 h-4 mr-3" />
                      <span className="font-medium">
                        {daysRemaining <= 1 ? 'Expira hoje!' : `Expira em ${daysRemaining} dias`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Botões de ação */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowRedeemModal(true)}
                    disabled={isRedeeming}
                    className="w-full bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-4 px-6 rounded-full font-bold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRedeeming ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        RESGATANDO...
                      </span>
                    ) : (
                      '🎯 RESGATAR VOUCHER'
                    )}
                  </button>
                  
                  <button
                    onClick={toggleSaveOffer}
                    className={`w-full py-3 px-6 rounded-full font-semibold border-2 transition-all ${
                      isSaved
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white border-[#F6C100] text-[#C91F1F] hover:bg-[#F6C100] hover:text-white'
                    }`}
                  >
                    {isSaved ? '❤️ SALVO' : '🔖 SALVAR PARA DEPOIS'}
                  </button>
                </div>
              </div>

              {/* Garantia */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Garantia DuoPass</span>
                </div>
                <p className="text-green-700 text-sm">
                  Reembolso total se o estabelecimento não honrar a oferta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmação de resgate */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-2">
                Confirmar Resgate
              </h3>
              <p className="text-gray-600">
                Você está prestes a resgatar este voucher. Esta ação não pode ser desfeita.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-[#333333] mb-2">{offer.title}</h4>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Valor original:</span>
                <span className="line-through">CHF {offer.original_value.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-green-600">
                <span>Seu preço:</span>
                <span>CHF {discountedPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-[#333333] font-medium hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleRedeemVoucher}
                disabled={isRedeeming}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isRedeeming ? 'Resgatando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}