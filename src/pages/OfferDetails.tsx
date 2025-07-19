import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Star, Users, Zap, ArrowLeft, Share2, Heart, Shield, AlertTriangle } from 'lucide-react';
import { Offer } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function OfferDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOfferDetails = useCallback(async () => {
    if (!id) {
      setError("ID da oferta não encontrado.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar detalhes da oferta:', error);
        setError('Não foi possível carregar os detalhes da oferta. Tente novamente mais tarde.');
        setOffer(null);
      } else {
        setOffer(data);
      }
    } catch (err) {
      console.error('💥 Erro crítico ao buscar detalhes da oferta:', err);
      setError('Ocorreu um erro inesperado. Por favor, contate o suporte.');
      setOffer(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOfferDetails();
  }, [fetchOfferDetails]);



  const handleRedeemVoucher = async () => {
    if (!user || !offer) {
      alert('Você precisa estar logado para resgatar uma oferta.');
      navigate('/login');
      return;
    }

    setIsRedeeming(true);
    setError(null);

    try {
      // 1. Gerar um código de voucher único
      const voucherCode = `DUO${Date.now().toString().slice(-6)}`;

      // 2. Preparar os dados para inserção na tabela 'vouchers'
      const newVoucherData = {
        user_id: user.id,
        offer_id: offer.id,
        code: voucherCode,
        status: 'active',
        expires_at: offer.expires_at, 
        title: offer.title,
        description: offer.description,
        image_url: offer.image_url,
        terms_conditions: offer.terms_conditions,
        original_price: offer.original_value,
        // O nome do negócio pode vir da oferta ou de uma tabela de merchants relacionada
        business_name: offer.merchant?.business_name || 'Parceiro DuoPass',
      };

      // 3. Inserir o novo voucher no Supabase
      const { data, error } = await supabase
        .from('vouchers')
        .insert(newVoucherData)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar voucher no Supabase:', error);
        setError('Não foi possível resgatar o voucher. Tente novamente.');
        setIsRedeeming(false);
        return;
      }

      console.log('✅ Voucher criado com sucesso:', data);

      // 4. Redirecionar para o dashboard do cliente, na aba de vouchers
      alert('Voucher resgatado com sucesso! Você será redirecionado para seus vouchers.');
      navigate('/dashboard/customer?tab=vouchers');

    } catch (err) {
      console.error('💥 Erro crítico ao resgatar voucher:', err);
      setError('Ocorreu um erro inesperado. Por favor, contate o suporte.');
    } finally {
      setIsRedeeming(false);
      setShowRedeemModal(false);
    }
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
            onClick={() => navigate('/ofertas')}
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