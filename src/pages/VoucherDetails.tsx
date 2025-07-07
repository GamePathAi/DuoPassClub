import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Share2, Heart, ArrowLeft, QrCode } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { VoucherWithOffer } from '../types/voucher';
import { supabase } from '../lib/supabaseConfig';

export function VoucherDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [voucher, setVoucher] = useState<VoucherWithOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const loadVoucherDetails = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Buscar detalhes do voucher e oferta
      const { data: voucherData, error: voucherError } = await supabase
        .from('vouchers')
        .select(`
          *,
          offer:offers(*)
        `)
        .eq('id', id)
        .single();

      if (voucherError) {
        console.error('Erro ao carregar voucher:', voucherError);
        return;
      }

      setVoucher(voucherData);
    } catch (error) {
      console.error('Erro ao carregar detalhes do voucher:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVoucherDetails();
  }, [loadVoucherDetails]);



  const handleRedeem = async () => {
    if (!voucher || !user) return;

    try {
      setIsRedeeming(true);
      
      // Gerar código único para o voucher
      const redeemCode = `DUO${Date.now().toString().slice(-6)}`;
      
      // Atualizar status do voucher para 'redeemed'
      const { error } = await supabase
        .from('vouchers')
        .update({
          status: 'redeemed',
          redeem_code: redeemCode,
          redeemed_at: new Date().toISOString()
        })
        .eq('id', voucher.id);

      if (error) {
        console.error('Erro ao resgatar voucher:', error);
        return;
      }

      // Redirecionar para página do voucher ativo
      navigate(`/voucher/${voucher.id}/active`);
    } catch (error) {
      console.error('Erro ao resgatar voucher:', error);
    } finally {
      setIsRedeeming(false);
      setShowRedeemModal(false);
    }
  };

  const handleSaveForLater = async () => {
    if (!voucher || !user) return;

    try {
      // Adicionar à lista de salvos do usuário
      const { error } = await supabase
        .from('saved_vouchers')
        .insert({
          user_id: user.id,
          voucher_id: voucher.id
        });

      if (error && error.code !== '23505') { // Ignorar erro de duplicata
        console.error('Erro ao salvar voucher:', error);
        return;
      }

      setIsSaved(true);
    } catch (error) {
      console.error('Erro ao salvar voucher:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C91F1F]"></div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#333333] mb-4">Voucher não encontrado</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#C91F1F] hover:underline"
          >
            Voltar ao dashboard
          </button>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = getDaysUntilExpiry(voucher.expires_at);
  const isExpiringSoon = daysUntilExpiry <= 3;

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#333333] hover:text-[#C91F1F] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 bg-gradient-to-r from-[#F6C100] to-[#C91F1F]">
            {voucher.offer.image_url ? (
              <img
                src={voucher.offer.image_url}
                alt={voucher.offer.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <QrCode className="w-16 h-16 text-white opacity-50" />
              </div>
            )}
            
            {/* Urgency Badge */}
            {isExpiringSoon && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ⚠️ Expira em {daysUntilExpiry} dia{daysUntilExpiry !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title and Actions */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#333333] mb-2">
                  {voucher.offer.title}
                </h1>
                <p className="text-lg text-[#C91F1F] font-semibold">
                  {voucher.offer.discount_type === 'percentage' 
                    ? `${voucher.offer.discount_value}% OFF`
                    : `CHF ${(voucher.offer.discount_value * 0.18).toFixed(2)} OFF`
                  }
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveForLater}
                  className={`p-2 rounded-full transition-colors ${
                    isSaved 
                      ? 'bg-[#C91F1F] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#333333] mb-3">Descrição</h2>
              <p className="text-gray-600 leading-relaxed">
                {voucher.offer.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Validity */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-[#C91F1F] mr-2" />
                  <h3 className="font-semibold text-[#333333]">Validade</h3>
                </div>
                <p className="text-gray-600">
                  Válido até {formatDate(voucher.expires_at)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {daysUntilExpiry > 0 
                    ? `${daysUntilExpiry} dia${daysUntilExpiry !== 1 ? 's' : ''} restante${daysUntilExpiry !== 1 ? 's' : ''}`
                    : 'Expirado'
                  }
                </p>
              </div>

              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-[#C91F1F] mr-2" />
                  <h3 className="font-semibold text-[#333333]">Local de uso</h3>
                </div>
                <p className="text-gray-600">
                  {voucher.offer.merchant_name || 'Estabelecimento parceiro'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Apresente o código no estabelecimento
                </p>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#333333] mb-3">Termos e Condições</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Válido apenas para o titular do voucher</li>
                  <li>• Não cumulativo com outras promoções</li>
                  <li>• Válido até a data de expiração</li>
                  <li>• Sujeito à disponibilidade do estabelecimento</li>
                  {voucher.offer.terms && (
                    <li>• {voucher.offer.terms}</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowRedeemModal(true)}
                disabled={voucher.status !== 'available' || daysUntilExpiry <= 0}
                className="flex-1 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-4 px-8 rounded-full font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🎯 RESGATAR VOUCHER
              </button>
              
              {!isSaved && (
                <button
                  onClick={handleSaveForLater}
                  className="sm:w-auto bg-white border-2 border-[#C91F1F] text-[#C91F1F] py-4 px-8 rounded-full font-semibold hover:bg-[#C91F1F] hover:text-white transition-all"
                >
                  💾 SALVAR PARA DEPOIS
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Confirmation Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#333333] mb-4 text-center">
              Confirmar Resgate
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-[#333333] mb-2">{voucher.offer.title}</h3>
              <p className="text-[#C91F1F] font-semibold mb-2">
                {voucher.offer.discount_type === 'percentage' 
                  ? `${voucher.offer.discount_value}% OFF`
                  : `CHF ${(voucher.offer.discount_value * 0.18).toFixed(2)} OFF`
                }
              </p>
              <p className="text-sm text-gray-600">
                Válido até {formatDate(voucher.expires_at)}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Atenção:</strong> Esta ação é irreversível. Após o resgate, você receberá um código único para usar no estabelecimento.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRedeem}
                disabled={isRedeeming}
                className="flex-1 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isRedeeming ? 'Resgatando...' : 'Confirmar Resgate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}