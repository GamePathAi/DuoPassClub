import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, QrCode, MapPin, Clock, Share2, ArrowLeft, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseConfig';

interface VoucherDetails {
  id: string;
  voucher_code: string;
  qr_code_data: string;
  status: string;
  expires_at: string;
  created_at: string;
  cultural_partners: {
    business_name: string;
    contact_name: string;
    email: string;
    address: Record<string, string>;
  };
  cultural_experiences: {
    experience_name: string;
    duo_benefit: string;
    original_price: number;
    duo_price: number;
  };
}

export function ActiveVoucherSuccess() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  // 1. Estados primeiro
  const [voucher, setVoucher] = useState<VoucherDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // 2. Função getMockVoucher primeiro (dependência)
  const getMockVoucher = useCallback((voucherId: string): VoucherDetails => {
    const voucherCode = searchParams.get('code') || 'DUO' + Math.random().toString(36).substr(2, 8).toUpperCase();
    
    return {
      id: voucherId,
      voucher_code: voucherCode,
      qr_code_data: `DUO_PASS_${voucherCode}`,
      status: 'active',
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      created_at: new Date().toISOString(),
      cultural_partners: {
        business_name: 'Café das Letras',
        contact_name: 'Maria Silva',
        email: 'contato@cafedasletras.com',
        address: {
          street: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipcode: '01234-567'
        }
      },
      cultural_experiences: {
        experience_name: 'Sarau Íntimo com Degustação',
        duo_benefit: 'Duas pessoas vivem uma experiência cultural única com degustação completa.',
        original_price: 120.00,
        duo_price: 60.00
      }
    };
  }, [searchParams]);

  // 3. Função loadVoucherDetails ANTES de ser usada
  const loadVoucherDetails = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      const { data } = await supabase
        .from('vouchers')
        .select(`
          *,
          cultural_partners:users!merchant_id (
            business_name,
            contact_name,
            email,
            address
          ),
          cultural_experiences (
            experience_name,
            duo_benefit,
            original_price,
            duo_price
          )
        `)
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setVoucher(data);
      } else {
        // Fallback para dados mock se não encontrar
        setVoucher(getMockVoucher(id));
      }
    } catch (err) {
      console.error('Erro ao carregar voucher:', err);
      // Fallback para dados mock
      setVoucher(getMockVoucher(id));
    } finally {
      setLoading(false);
    }
  }, [id, user?.id, getMockVoucher]);

  // 4. AGORA useEffect pode usar loadVoucherDetails (linha 41 corrigida)
  useEffect(() => {
    loadVoucherDetails();
  }, [loadVoucherDetails]);

  const copyVoucherCode = async () => {
    if (!voucher) return;
    
    try {
      await navigator.clipboard.writeText(voucher.voucher_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar código:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = () => {
    if (!voucher) return 0;
    const expiryDate = new Date(voucher.expires_at);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Voucher não encontrado</h1>
          <button
            onClick={() => navigate('/meus-vouchers')}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Ver meus vouchers
          </button>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysUntilExpiry();

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Success Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="bg-white bg-opacity-20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            DUO PASS Ativo! 🎉
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Seu voucher foi gerado com sucesso! Agora você pode desfrutar da experiência cultural.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar ao início</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voucher Card */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Voucher Header */}
            <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">DUO PASS</h2>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                  Ativo
                </span>
              </div>
              <h3 className="text-lg font-semibold">{voucher.cultural_experiences.experience_name}</h3>
            </div>

            {/* Voucher Code */}
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-2">Código do Voucher</p>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-2xl font-mono font-bold text-gray-800">
                      {voucher.voucher_code}
                    </span>
                    <button
                      onClick={copyVoucherCode}
                      className="p-2 text-gray-500 hover:text-amber-600 transition-colors"
                      title="Copiar código"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-green-600 text-sm mt-2">Código copiado!</p>
                  )}
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center mb-6">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center space-x-2 mx-auto text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                  <span>{showQR ? 'Ocultar' : 'Mostrar'} QR Code</span>
                </button>
                
                {showQR && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">QR Code para apresentar no local</p>
                  </motion.div>
                )}
              </div>

              {/* Expiry Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-amber-700">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Válido até: {formatDate(voucher.expires_at)}</p>
                    <p className="text-sm">
                      {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Expira hoje'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Experience Details */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Experience Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Detalhes da Experiência</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-2">🎁 Benefício DUO:</p>
                  <p className="text-gray-800">{voucher.cultural_experiences.duo_benefit}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-gray-600">Valor economizado:</span>
                  <span className="text-green-600 font-bold">
                    CHF {((voucher.cultural_experiences.original_price - voucher.cultural_experiences.duo_price) * 0.18).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Partner Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Local da Experiência</h3>
              <div className="space-y-3">
                <h4 className="font-semibold text-amber-600">{voucher.cultural_partners.business_name}</h4>
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{voucher.cultural_partners.address.street}</p>
                    <p>{voucher.cultural_partners.address.city}, {voucher.cultural_partners.address.state}</p>
                    <p>CEP: {voucher.cultural_partners.address.zipcode}</p>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Contato: {voucher.cultural_partners.contact_name}</p>
                  <p className="text-sm text-gray-600">{voucher.cultural_partners.email}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-3">📋 Como usar seu voucher</h3>
              <ol className="text-sm text-blue-700 space-y-2">
                <li>1. Entre em contato com o parceiro para agendar</li>
                <li>2. Apresente o código do voucher ou QR Code</li>
                <li>3. Aproveite sua experiência cultural!</li>
                <li>4. Lembre-se: válido para 2 pessoas</li>
              </ol>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/meus-vouchers')}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Ver Todos os Vouchers
          </button>
          
          <button
            onClick={() => navigate('/experiencias')}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Descobrir Mais Experiências
          </button>
          
          <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}