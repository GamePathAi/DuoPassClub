import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  MapPin, 
  Clock, 
  Share2, 
  ArrowLeft, 
  Copy, 
  CheckCircle,
  Star,
  Phone,
  Globe,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode';

interface VoucherDetails {
  id: string;
  voucher_code: string;
  qr_code_data: string;
  status: string;
  expires_at: string;
  created_at: string;
  offer: {
    id: string;
    title: string;
    description: string;
    original_value: number;
    image_url: string;
    location: string;
    terms_conditions: string;
    merchant: {
      business_name: string;
      address: string;
      phone?: string;
      website?: string;
      description: string;
    };
  };
}

export function VoucherActive() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [voucher, setVoucher] = useState<VoucherDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (id && user) {
      loadVoucherDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  useEffect(() => {
    if (voucher?.expires_at) {
      const interval = setInterval(() => {
        updateTimeRemaining();
      }, 1000);
      
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucher?.expires_at]);

  // ✅ CARREGAMENTO REAL VIA SUPABASE - CORREÇÃO CRÍTICA
  const loadVoucherDetails = async () => {
    if (!id || !user) {
      console.error('ID do voucher ou usuário não encontrado');
      navigate('/meus-vouchers');
      return;
    }

    try {
      setLoading(true);
      
      console.log('🔍 Carregando voucher ativo:', id);

      // ✅ Carregar voucher real do Supabase
      const { data: voucherData, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('❌ Erro ao carregar voucher:', error);
        navigate('/meus-vouchers');
        return;
      }

      if (!voucherData) {
        console.error('❌ Voucher não encontrado');
        navigate('/meus-vouchers');
        return;
      }

      // ✅ Transformar dados do Supabase para interface VoucherDetails
      const transformedVoucher: VoucherDetails = {
        id: voucherData.id,
        voucher_code: voucherData.code,
        qr_code_data: `DUO-${voucherData.id}-${voucherData.code}`,
        status: voucherData.status,
        expires_at: voucherData.expires_at,
        created_at: voucherData.created_at,
        offer: {
          id: voucherData.offer_id || 'default-offer',
          title: voucherData.title,
          description: voucherData.terms_conditions || 'Experiência cultural exclusiva DUO PASS',
          original_value: voucherData.original_price,
          image_url: voucherData.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          location: 'Suíça',
          terms_conditions: voucherData.terms_conditions || 'Válido conforme termos e condições.',
          merchant: {
            business_name: voucherData.business_name,
            address: 'Endereço disponível no estabelecimento',
            phone: '+41 XX XXX XXXX',
            website: 'https://duopassclub.ch',
            description: `Parceiro cultural DUO PASS - ${voucherData.business_name}`
          }
        }
      };

      setVoucher(transformedVoucher);
      
      // ✅ Gerar QR Code com dados reais
      if (transformedVoucher.qr_code_data) {
        const qrUrl = await QRCode.toDataURL(transformedVoucher.qr_code_data, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrUrl);
      }

      console.log('✅ Voucher ativo carregado com sucesso');
      
    } catch (err) {
      console.error('❌ Erro inesperado ao carregar voucher:', err);
      navigate('/meus-vouchers');
    } finally {
      setLoading(false);
    }
  };

  const updateTimeRemaining = () => {
    if (!voucher?.expires_at) return;
    
    const now = new Date().getTime();
    const expiry = new Date(voucher.expires_at).getTime();
    const difference = expiry - now;
    
    if (difference <= 0) {
      setTimeRemaining('Expirado');
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    if (days > 0) {
      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    } else if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeRemaining(`${minutes}m ${seconds}s`);
    }
  };

  const handleCopyCode = async () => {
    if (voucher?.voucher_code) {
      try {
        await navigator.clipboard.writeText(voucher.voucher_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        console.error('Erro ao copiar código');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share && voucher) {
      try {
        await navigator.share({
          title: `Voucher: ${voucher.offer.title}`,
          text: `Confira meu voucher ativo no DuoPass!`,
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

  const openMaps = () => {
    if (voucher?.offer.merchant.address) {
      const address = encodeURIComponent(voucher.offer.merchant.address);
      window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
    }
  };

  const callMerchant = () => {
    if (voucher?.offer.merchant.phone) {
      window.open(`tel:${voucher.offer.merchant.phone}`);
    }
  };

  const visitWebsite = () => {
    if (voucher?.offer.merchant.website) {
      window.open(voucher.offer.merchant.website, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C91F1F]"></div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Voucher não encontrado</h1>
          <button
            onClick={() => navigate('/vouchers')}
            className="text-[#C91F1F] hover:underline"
          >
            Voltar aos meus vouchers
          </button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(voucher.expires_at) < new Date();
  const isUsed = voucher.status === 'used';

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/vouchers')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Meus Vouchers
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {(isExpired || isUsed) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg border ${
              isUsed 
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {isUsed ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span className="font-medium">
                {isUsed ? 'Voucher utilizado com sucesso!' : 'Este voucher expirou'}
              </span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Principal do Voucher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Header do Card */}
              <div className="bg-gradient-to-r from-[#C91F1F] to-[#8B1538] p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{voucher.offer.title}</h1>
                    <div className="flex items-center text-white/90">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{voucher.offer.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      CHF {((voucher.offer.original_value * 0.18) / 2).toFixed(2)}
                    </div>
                    <div className="text-white/80 line-through text-sm">
                      CHF {(voucher.offer.original_value * 0.18).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Imagem da Oferta */}
              <div className="aspect-video bg-gray-200">
                <img
                  src={voucher.offer.image_url}
                  alt={voucher.offer.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <p className="text-gray-700 mb-6">{voucher.offer.description}</p>

                {/* Código do Voucher */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código do Voucher
                      </label>
                      <div className="text-2xl font-mono font-bold text-[#C91F1F]">
                        {voucher.voucher_code}
                      </div>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className={`p-3 rounded-lg transition-colors ${
                        copied 
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center mb-6">
                  <button
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="inline-flex items-center px-6 py-3 bg-[#C91F1F] text-white rounded-lg hover:bg-[#B01B1B] transition-colors"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    {showQRCode ? 'Ocultar QR Code' : 'Mostrar QR Code'}
                  </button>
                </div>

                {showQRCode && qrCodeUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-6"
                  >
                    <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                      <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Apresente este QR Code no estabelecimento
                    </p>
                  </motion.div>
                )}

                {/* Termos e Condições */}
                {voucher.offer.terms_conditions && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Termos e Condições</h3>
                    <p className="text-sm text-gray-600">{voucher.offer.terms_conditions}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Informações do Estabelecimento */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Sobre o estabelecimento</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 text-lg">{voucher.offer.merchant.business_name}</h4>
                  <p className="text-gray-600 mt-1">{voucher.offer.merchant.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Endereço</p>
                      <p className="text-sm text-gray-600">{voucher.offer.merchant.address}</p>
                    </div>
                  </div>

                  {voucher.offer.merchant.phone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Telefone</p>
                        <p className="text-sm text-gray-600">{voucher.offer.merchant.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <button
                    onClick={openMaps}
                    className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Ver no Mapa
                  </button>

                  {voucher.offer.merchant.phone && (
                    <button
                      onClick={callMerchant}
                      className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </button>
                  )}

                  {voucher.offer.merchant.website && (
                    <button
                      onClick={visitWebsite}
                      className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Site
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status do Voucher */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 sticky top-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Status do Voucher</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isUsed 
                      ? 'bg-green-100 text-green-800'
                      : isExpired
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {isUsed ? 'Utilizado' : isExpired ? 'Expirado' : 'Ativo'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Criado em:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(voucher.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Válido até:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(voucher.expires_at).toLocaleDateString()}
                  </span>
                </div>

                {!isExpired && !isUsed && timeRemaining && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center text-orange-800">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Expira em: {timeRemaining}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Instruções de Uso */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Como usar</h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#C91F1F] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    1
                  </div>
                  <p>Vá até o estabelecimento no endereço indicado</p>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#C91F1F] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    2
                  </div>
                  <p>Apresente o QR Code ou código do voucher</p>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-[#C91F1F] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                    3
                  </div>
                  <p>Aproveite sua oferta exclusiva!</p>
                </div>
              </div>
            </motion.div>

            {/* Avaliação */}
            {isUsed && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Avalie sua experiência</h3>
                
                <div className="text-center">
                  <div className="flex justify-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className="h-6 w-6 text-gray-300 hover:text-yellow-400" />
                      </button>
                    ))}
                  </div>
                  
                  <button className="w-full bg-[#C91F1F] text-white py-2 rounded-lg hover:bg-[#B01B1B] transition-colors">
                    Enviar Avaliação
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}