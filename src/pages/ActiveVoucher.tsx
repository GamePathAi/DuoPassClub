import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, MapPin, Share2, CheckCircle, AlertCircle, ArrowLeft, Copy, Download } from 'lucide-react';
import { Offer, Voucher } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function ActiveVoucher() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const voucherCode = searchParams.get('code');

  // ✅ FUNÇÃO DECLARADA PRIMEIRO - CORRIGE ERRO "Cannot access before initialization"
  const updateTimeRemaining = useCallback(() => {
    if (!voucher) return;
    
    const now = new Date();
    const expiry = new Date(voucher.expires_at);
    const diffTime = expiry.getTime() - now.getTime();
    
    if (diffTime <= 0) {
      setTimeRemaining('EXPIRADO');
      return;
    }
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    
    if (days > 0) {
      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    } else if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeRemaining(`${minutes}m ${seconds}s`);
    }
  }, [voucher]);

  useEffect(() => {
    if (voucherCode) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    
    // Carregar dados do voucher diretamente no useEffect
    if (!id) return;
    
    setLoading(true);
    
    // Mock voucher data baseado no ID da URL
    const voucherCode = 'DUO-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const mockVoucher: Voucher = {
      id: id,
      user_id: user?.id || 'demo-user',
      offer_id: 'demo-5',
      voucher_code: voucherCode,
      qr_code_data: voucherCode, // Usar o código diretamente para o QR
      status: 'active',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      used_at: null
    };
    
    // Mock offer data
    const mockOffer: Offer = {
      id: 'demo-5',
      merchant_id: 'demo-merchant-5',
      title: '🧘‍♀️ Aula de Yoga',
      description: 'Aula de yoga relaxante para iniciantes e avançados.',
      original_value: 160.00,
      category: 'wellness',
      location: 'Estúdio Zen',
      city: 'Zürich',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
      terms_conditions: 'Apresente este código no estúdio. Válido para 2 pessoas.',
      created_at: new Date().toISOString(),
      merchant: {
        business_name: 'Estúdio Zen',
        contact_info: '(11) 77777-7777'
      }
    };
    
    setVoucher(mockVoucher);
    setOffer(mockOffer);
    setLoading(false);
  }, [id, voucherCode, user]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (voucher) {
        updateTimeRemaining();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [voucher, updateTimeRemaining]);

  const copyVoucherCode = async () => {
    if (voucher?.voucher_code) {
      await navigator.clipboard.writeText(voucher.voucher_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareVoucher = () => {
    if (navigator.share && voucher && offer) {
      navigator.share({
        title: `Voucher: ${offer.title}`,
        text: `Confira meu voucher ativo no DuoPass! Código: ${voucher.voucher_code}`,
        url: window.location.href,
      });
    } else if (voucher) {
      navigator.clipboard.writeText(`Voucher: ${voucher.voucher_code} - ${window.location.href}`);
      alert('Informações do voucher copiadas!');
    }
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `voucher-${voucher?.voucher_code}.png`;
      a.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C91F1F] mx-auto mb-4"></div>
          <p className="text-[#333333] font-medium">Carregando seu voucher...</p>
        </div>
      </div>
    );
  }

  if (!voucher || !offer) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#333333] mb-2">Voucher não encontrado</h1>
          <p className="text-gray-600 mb-4">Este voucher pode ter expirado ou não existe.</p>
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

  const isExpired = new Date(voucher.expires_at) <= new Date();
  const discountedPrice = offer.original_value * 0.5; // 50% de desconto simulado

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16">
      {/* Animação de sucesso */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Voucher resgatado com sucesso! 🎉</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/meus-vouchers')}
            className="flex items-center gap-2 text-[#333333] hover:text-[#C91F1F] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Meus Vouchers</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={shareVoucher}
              className="p-2 rounded-full bg-white border-2 border-gray-200 hover:border-[#F6C100] transition-colors"
            >
              <Share2 className="w-5 h-5 text-[#333333]" />
            </button>
          </div>
        </div>

        {/* Status do voucher */}
        <div className={`p-4 rounded-xl mb-6 border-2 ${
          isExpired 
            ? 'bg-red-50 border-red-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isExpired ? (
                <AlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
              <div>
                <h2 className={`font-bold ${
                  isExpired ? 'text-red-800' : 'text-green-800'
                }`}>
                  {isExpired ? 'Voucher Expirado' : 'Voucher Ativo'}
                </h2>
                <p className={`text-sm ${
                  isExpired ? 'text-red-600' : 'text-green-600'
                }`}>
                  {isExpired ? 'Este voucher não pode mais ser usado' : 'Pronto para usar!'}
                </p>
              </div>
            </div>
            
            {!isExpired && (
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Expira em:</span>
                </div>
                <div className="font-bold text-lg text-[#C91F1F]">
                  {timeRemaining}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code e código */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 text-center">
              <h3 className="text-xl font-bold text-[#333333] mb-6">
                {isExpired ? 'Código Expirado' : 'Apresente este código'}
              </h3>
              
              {/* QR Code */}
              <div className={`inline-block p-6 bg-white rounded-2xl border-4 mb-6 ${
                isExpired ? 'border-gray-300 opacity-50' : 'border-[#F6C100]'
              }`}>
                <div id="qr-code">
                  <QRCodeSVG
                    value={voucher.qr_code_data}
                    size={200}
                    level="M"
                    includeMargin={false}
                    fgColor={isExpired ? '#9CA3AF' : '#000000'}
                  />
                </div>
              </div>
              
              {/* Código do voucher */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Código do voucher:</p>
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl border-2 ${
                  isExpired 
                    ? 'bg-gray-50 border-gray-200 text-gray-500' 
                    : 'bg-[#F6C100] border-[#F6C100] text-[#333333]'
                }`}>
                  <span className="font-mono text-xl font-bold">
                    {voucher.voucher_code}
                  </span>
                  {!isExpired && (
                    <button
                      onClick={copyVoucherCode}
                      className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                      title="Copiar código"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {copied && (
                  <p className="text-green-600 text-sm mt-2 font-medium">
                    ✓ Código copiado!
                  </p>
                )}
              </div>
              
              {/* Botões de ação */}
              {!isExpired && (
                <div className="space-y-3">
                  <button
                    onClick={downloadQRCode}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#333333] text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Baixar QR Code
                  </button>
                  
                  <button
                    onClick={shareVoucher}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#F6C100] text-[#C91F1F] rounded-xl font-semibold hover:bg-[#F6C100] hover:text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Detalhes da oferta */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
              {/* Imagem da oferta */}
              {offer.image_url && (
                <div className="h-48 bg-gray-200 rounded-xl overflow-hidden mb-6">
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Título e preço */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#333333] mb-3">
                  {offer.title}
                </h1>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    CHF {discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    CHF {offer.original_value.toFixed(2)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                    -50%
                  </span>
                </div>
              </div>

              {/* Informações do estabelecimento */}
              {offer.merchant && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-[#333333] mb-2">
                    {offer.merchant.business_name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C91F1F]" />
                      <span>{offer.merchant.contact_info}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Instruções de uso */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#333333] mb-3">Como usar:</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="bg-[#F6C100] text-[#333333] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Vá até o estabelecimento durante o horário de funcionamento</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-[#F6C100] text-[#333333] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Apresente o QR Code ou informe o código do voucher</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-[#F6C100] text-[#333333] rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Aproveite sua oferta especial!</span>
                  </div>
                </div>
              </div>

              {/* Termos e condições */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Importante:</h4>
                <p className="text-yellow-700 text-sm">
                  {offer.terms_conditions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-800 mb-2">💡 Dica</h3>
            <p className="text-blue-700 text-sm">
              Salve uma captura de tela do QR Code como backup, caso não tenha internet no local.
            </p>
          </div>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-800 mb-2">🛡️ Garantia</h3>
            <p className="text-green-700 text-sm">
              Se houver algum problema, entre em contato conosco pelo app para suporte imediato.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}