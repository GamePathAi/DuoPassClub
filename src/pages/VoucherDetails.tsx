import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Share2, Heart, ArrowLeft, QrCode, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface VoucherData {
  id: string;
  user_id: string;
  code: string;
  title: string;
  business_name: string;
  original_price: number;
  discounted_price: number;
  image_url?: string;
  status: 'active' | 'used' | 'expired';
  created_at: string;
  expires_at: string;
  used_at?: string;
  terms_conditions?: string;
  offer_id?: string;
}

export function VoucherDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [voucher, setVoucher] = useState<VoucherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // ✅ FUNÇÃO PARA CARREGAR VOUCHER DO SUPABASE
  const loadVoucherDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        setError('Usuário não autenticado');
        return;
      }

      if (!id) {
        setError('ID do voucher não fornecido');
        return;
      }

      console.log('🔍 Carregando detalhes do voucher:', id);

      // Tentar buscar por ID primeiro
      const { data: initialVoucherData, error: voucherError } = await supabase
        .from('vouchers')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
      
      let voucherData = initialVoucherData;

      // Se não encontrou por ID, tentar por código
      if (voucherError && voucherError.code === 'PGRST116') {
        const { data: voucherByCode, error: codeError } = await supabase
          .from('vouchers')
          .select('*')
          .eq('code', id)
          .eq('user_id', user.id)
          .single();

        if (codeError) {
          console.error('❌ Voucher não encontrado:', codeError);
          setError('Voucher não encontrado');
          return;
        }

        voucherData = voucherByCode;
      } else if (voucherError) {
        console.error('❌ Erro ao carregar voucher:', voucherError);
        setError('Erro ao carregar voucher');
        return;
      }

      console.log('✅ Voucher carregado:', voucherData);
      setVoucher(voucherData);

    } catch (error) {
      console.error('❌ Erro inesperado:', error);
      setError('Erro inesperado ao carregar voucher');
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    loadVoucherDetails();
  }, [loadVoucherDetails]);

  // ✅ FUNÇÃO PARA RESGATAR VOUCHER
  const handleRedeem = async () => {
    if (!voucher || !user) return;

    try {
      setIsRedeeming(true);
      
      console.log('🎯 Resgatando voucher:', voucher.id);

      // Verificar se o voucher ainda está disponível
      if (voucher.status !== 'active') {
        alert('Este voucher não está mais disponível para resgate.');
        return;
      }

      // Verificar se não expirou
      if (new Date(voucher.expires_at) <= new Date()) {
        alert('Este voucher expirou e não pode mais ser resgatado.');
        return;
      }

      // Atualizar status para "ativo" (pronto para usar)
      const { error } = await supabase
        .from('vouchers')
        .update({ 
          status: 'active',
          // Não marcar como usado ainda - isso será feito quando apresentar no estabelecimento
        })
        .eq('id', voucher.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erro ao resgatar voucher:', error);
        alert('Erro ao resgatar voucher. Tente novamente.');
        return;
      }

      console.log('✅ Voucher resgatado com sucesso');

      // Redirecionar para página do voucher ativo com parâmetro de sucesso
      navigate(`/voucher/${voucher.code}/active?redeemed=true`);
      
    } catch (error) {
      console.error('❌ Erro inesperado ao resgatar:', error);
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setIsRedeeming(false);
      setShowRedeemModal(false);
    }
  };

  // ✅ FUNÇÃO PARA SALVAR PARA MAIS TARDE
  const handleSaveForLater = async () => {
    if (!voucher || !user) return;

    try {
      // Aqui você pode implementar uma tabela de vouchers salvos
      // Por enquanto, vamos apenas simular
      console.log('💾 Salvando voucher para mais tarde:', voucher.id);
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsSaved(true);
      
      // Opcional: Mostrar notificação de sucesso
      alert('Voucher salvo com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao salvar voucher:', error);
      alert('Erro ao salvar voucher. Tente novamente.');
    }
  };

  // ✅ FUNÇÃO PARA NAVEGAR PARA VOUCHER ATIVO
  const handleViewActive = () => {
    if (voucher) {
      navigate(`/voucher/${voucher.code}/active`);
    }
  };

  // ✅ FUNÇÕES UTILITÁRIAS
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

  const getDiscountPercentage = () => {
    if (!voucher) return 0;
    return Math.round((1 - voucher.discounted_price / voucher.original_price) * 100);
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C91F1F] mx-auto mb-4"></div>
          <p className="text-[#333333] font-medium">Carregando detalhes do voucher...</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (error || !voucher) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#333333] mb-2">
            {error || 'Voucher não encontrado'}
          </h1>
          <p className="text-gray-600 mb-4">
            Verifique se o link está correto ou se você tem permissão para acessar este voucher.
          </p>
          <button
            onClick={() => navigate('/meus-vouchers')}
            className="text-[#C91F1F] hover:underline font-medium"
          >
            Ver meus vouchers
          </button>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = getDaysUntilExpiry(voucher.expires_at);
  const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry <= 0;
  const isUsed = voucher.status === 'used';
  const discountPercentage = getDiscountPercentage();

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
            {voucher.image_url ? (
              <img
                src={voucher.image_url}
                alt={voucher.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <QrCode className="w-16 h-16 text-white opacity-50" />
              </div>
            )}
            
            {/* Status Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {isUsed && (
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Usado
                </div>
              )}
              {isExpired && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ⚠️ Expirado
                </div>
              )}
              {isExpiringSoon && !isUsed && !isExpired && (
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ⚠️ Expira em {daysUntilExpiry} dia{daysUntilExpiry !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Title and Actions */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#333333] mb-2">
                  {voucher.title}
                </h1>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    CHF {voucher.discounted_price.toFixed(2)}
                  </span>
                  {voucher.original_price > voucher.discounted_price && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        CHF {voucher.original_price.toFixed(2)}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                        -{discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-lg text-[#C91F1F] font-semibold">
                  {voucher.business_name}
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
                  title={isSaved ? 'Salvo' : 'Salvar para depois'}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button 
                  className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                  title="Compartilhar"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status Info */}
            {(isUsed || isExpired) && (
              <div className={`p-4 rounded-lg mb-6 ${
                isUsed ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {isUsed ? (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${
                    isUsed ? 'text-blue-800' : 'text-red-800'
                  }`}>
                    {isUsed 
                      ? `Voucher usado em ${formatDate(voucher.used_at!)}` 
                      : 'Este voucher expirou e não pode mais ser usado'
                    }
                  </span>
                </div>
              </div>
            )}

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
                <p className={`text-sm mt-1 ${
                  isExpired ? 'text-red-500' : isExpiringSoon ? 'text-orange-500' : 'text-gray-500'
                }`}>
                  {isExpired 
                    ? 'Expirado' 
                    : daysUntilExpiry > 0 
                    ? `${daysUntilExpiry} dia${daysUntilExpiry !== 1 ? 's' : ''} restante${daysUntilExpiry !== 1 ? 's' : ''}`
                    : 'Expira hoje'
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
                  {voucher.business_name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Apresente o código no estabelecimento
                </p>
              </div>
            </div>

            {/* Terms and Conditions */}
            {voucher.terms_conditions && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#333333] mb-3">Termos e Condições</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {voucher.terms_conditions}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isUsed || isExpired ? (
                // Se usado ou expirado, mostrar apenas botão para ver detalhes
                <button
                  onClick={handleViewActive}
                  className="flex-1 bg-gray-500 text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-gray-600 transition-all"
                >
                  👁️ VER DETALHES
                </button>
              ) : voucher.status === 'active' ? (
                // Se já está ativo, ir direto para a página de uso
                <button
                  onClick={handleViewActive}
                  className="flex-1 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-4 px-8 rounded-full font-bold text-lg hover:shadow-lg transition-all"
                >
                  🎫 USAR VOUCHER
                </button>
              ) : (
                // Se ainda não foi resgatado, mostrar botão de resgate
                <button
                  onClick={() => setShowRedeemModal(true)}
                  className="flex-1 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-4 px-8 rounded-full font-bold text-lg hover:shadow-lg transition-all"
                >
                  🎯 RESGATAR VOUCHER
                </button>
              )}
              
              {!isSaved && !isUsed && !isExpired && (
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
              <h3 className="font-semibold text-[#333333] mb-2">{voucher.title}</h3>
              <p className="text-[#C91F1F] font-semibold mb-2">
                CHF {voucher.discounted_price.toFixed(2)}
                {voucher.original_price > voucher.discounted_price && (
                  <span className="text-gray-500 line-through ml-2">
                    CHF {voucher.original_price.toFixed(2)}
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600">
                Válido até {formatDate(voucher.expires_at)}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Atenção:</strong> Após o resgate, você receberá um código único para apresentar no estabelecimento.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowRedeemModal(false)}
                disabled={isRedeeming}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleRedeem}
                disabled={isRedeeming}
                className="flex-1 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-3 px-6 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isRedeeming ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Resgatando...
                  </span>
                ) : (
                  'Confirmar Resgate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}