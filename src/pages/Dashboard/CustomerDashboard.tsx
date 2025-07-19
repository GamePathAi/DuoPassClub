import React, { useState, useEffect, useCallback, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Gift, Users, QrCode, Eye, Settings, CreditCard, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Voucher, Offer } from '../../types';
import { supabase } from '../../lib/supabase';
import DuoPassLogo from '../../components/ui/DuoPassLogo';
import ETicket from '../../components/ETicket';
import DuoPassConnect from '../../components/connect/DuoPassConnect';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import DebugPanel from '../../components/DebugPanel';
import { VoucherQRCode } from '../../components/VoucherQRCode';
import TermsModal from '../../components/modals/TermsModal';
import TutorialModal from '../../components/modals/TutorialModal';
import TrialOnboardingModal from '../../components/modals/TrialOnboardingModal';
import SettingsPage from '../Settings'; // Renomeado para evitar conflito
import AIAnalyticsContainer from '../../components/AIAnalytics/AIAnalyticsContainer';

const TrialTimer: React.FC<{ expiresAt: string }> = ({ expiresAt }) => {
  const calculateRemainingTime = () => {
    const now = new Date();
    const expiration = new Date(expiresAt);
    const difference = expiration.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="bg-yellow-400 text-black p-2 text-center text-sm font-semibold">
      Sua Golden Week termina em: {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m {remainingTime.seconds}s
    </div>
  );
};

const CustomerDashboard = memo(() => {
  const { user, trialStatus, trialExpiresAt } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'experiences' | 'connect' | 'billing' | 'settings' | 'insights'>('overview');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showETicket, setShowETicket] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedVoucherForQR, setSelectedVoucherForQR] = useState<Voucher | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showTrialOnboarding, setShowTrialOnboarding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // LOG: Estado inicial do dashboard
  console.log('🏠 CustomerDashboard: Componente renderizado', {
    hasUser: !!user,
    userEmail: user?.email,
    userId: user?.id,
    loading,
    vouchersCount: vouchers.length,
    offersCount: offers.length,
    activeTab
  });

  // Handle query parameters for tab selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'experiences', 'connect', 'billing', 'settings', 'insights'].includes(tabParam)) {
      setActiveTab(tabParam as 'overview' | 'experiences' | 'connect' | 'billing' | 'settings' | 'insights');
    }
  }, [location.search]);

  useEffect(() => {
    const checkFirstVisit = () => {
      const hasAcceptedTerms = localStorage.getItem('hasAcceptedTerms');
      if (!hasAcceptedTerms) {
        setShowTermsModal(true);
      } else {
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
          // setShowTutorialModal(true); // Opcional
        }
      }

      const shouldShowTrialOnboarding = localStorage.getItem('showTrialOnboarding');
      if (shouldShowTrialOnboarding) {
        setShowTrialOnboarding(true);
      }
    };
    checkFirstVisit();
  }, []);

  const handleTrialOnboardingComplete = async (interests: string[]) => {
    try {
      // Salvar interesses do usuário
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          cultural_interests: interests,
          updated_at: new Date().toISOString()
        });

      // Remover flag do localStorage
      localStorage.removeItem('showTrialOnboarding');
      setShowTrialOnboarding(false);
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    }
  };

  const loadUserVouchers = useCallback(async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        console.log('❌ User ID não disponível');
        return;
      }

      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erro Supabase:', error.message);
        setError(error.message);
        return;
      }

      setVouchers(data || []);
      console.log('✅ Vouchers carregados:', data?.length);

    } catch (err) {
      console.error('❌ Erro de rede:', err);
      setError('Falha na conexão');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadAvailableOffers = useCallback(async () => {
    console.log('🎯 CustomerDashboard: loadAvailableOffers iniciado');

    console.log('🔍 CustomerDashboard: Buscando ofertas no Supabase');
    
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('📊 CustomerDashboard: Resultado da busca de ofertas:', { data, error, count: data?.length });

      if (error) {
        console.error('❌ CustomerDashboard: Erro ao carregar ofertas:', error);
        setOffers([]);
        return;
      }

      setOffers(data || []);
      console.log('✅ CustomerDashboard: Ofertas carregadas:', data?.length || 0);
    } catch (error: unknown) {
      console.error('💥 CustomerDashboard: Erro crítico ao carregar ofertas:', error);
       setOffers([]);
    }
  }, [user?.id]);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      console.log('⏸️ Pulando carregamento - user:', !!user?.id);
      return;
    }

    try {
      setLoading(true);
      
      const [vouchersResult, offersResult] = await Promise.allSettled([
        loadUserVouchers(),
        loadAvailableOffers()
      ]);
  
      if (vouchersResult.status === 'rejected') {
        console.error('❌ Falha vouchers:', vouchersResult.reason);
      }
      
      if (offersResult.status === 'rejected') {
        console.error('❌ Falha offers:', offersResult.reason);
      }
  
    } finally {
      setLoading(false);
    }
  }, [user?.id, loadUserVouchers, loadAvailableOffers]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Monitor loading state changes
  useEffect(() => {
    console.log('⏳ CustomerDashboard: Estado de loading mudou para:', loading);
  }, [loading]);

  useEffect(() => {
    console.log('🔍 DASHBOARD STATE:', { 
      userLoaded: !!user?.id, 
      vouchersCount: vouchers.length, 
      offersCount: offers.length, 
      loading 
    });
  }, [user?.id, vouchers.length, offers.length, loading]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const shouldShowOnboarding = searchParams.get('onboarding') === 'true';
    if (shouldShowOnboarding) {
      setShowTrialOnboarding(true);
      navigate('/customer-dashboard', { replace: true });
    }
  }, [location.search, navigate]);

  // 🔍 DEBUG: Monitorar renderização de botões
  useEffect(() => {
    setTimeout(() => {
      const buttons = document.querySelectorAll('button');
      const verDetalhesButtons = Array.from(buttons).filter(btn => 
        btn.textContent?.includes('Ver Detalhes')
      );
      const resgatarButtons = Array.from(buttons).filter(btn => 
        btn.textContent?.includes('RESGATAR')
      );
      
      console.log('🔘 BOTÕES NO DOM:', {
        totalButtons: buttons.length,
        verDetalhesButtons: verDetalhesButtons.length,
        resgatarButtons: resgatarButtons.length,
        offersRendered: offers.length
      });
    }, 1000);
  }, [offers, vouchers]);

  // handleSignOut function removed as it was unused

  const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('de-CH', {
        style: 'currency',
        currency: 'CHF'
      }).format(value * 0.18);
    };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-CH');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'used':
        return 'Usado';
      case 'expired':
        return 'Expirado';
      default:
        return 'Desconhecido';
    }
  };

  const handleAcceptTerms = () => {
    localStorage.setItem('hasAcceptedTerms', 'true');
    setShowTermsModal(false);
    setShowTutorialModal(true);
  };

  const handleFinishTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorialModal(false);
  };

  const handleShowQRCode = (voucher: Voucher) => {
    setSelectedVoucherForQR(voucher);
    setShowQRCode(true);
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
    setSelectedVoucherForQR(null);
  };

  const handleViewETicket = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowETicket(true);
  };

  const handleCloseETicket = () => {
    setShowETicket(false);
    setSelectedVoucher(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <DuoPassLogo height={64} className="mx-auto mb-4 w-auto" />
          <p className="text-[#333333] font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (activeTab === 'settings') {
    return <SettingsPage />;
  }

  return (
    <DashboardLayout title="Meu Dashboard">
      {trialStatus === 'active' && trialExpiresAt && <TrialTimer expiresAt={trialExpiresAt} />}
      {showTermsModal && <TermsModal onAccept={handleAcceptTerms} />}
      {showTutorialModal && <TutorialModal onFinish={handleFinishTutorial} />}
      {showTrialOnboarding && <TrialOnboardingModal onComplete={handleTrialOnboardingComplete} />}

      <div className="space-y-8">
        {/* Debug Panel */}
        <DebugPanel />
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  navigate(`${location.pathname}?tab=overview`, { replace: true });
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart2 className="h-5 w-5 inline mr-2" />
                Visão Geral
              </button>
              <button
                onClick={() => {
                  setActiveTab('experiences');
                  navigate(`${location.pathname}?tab=experiences`, { replace: true });
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'experiences'
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Gift className="h-5 w-5 inline mr-2" />
                Experiências
              </button>
              <button
                onClick={() => {
                  setActiveTab('connect');
                  navigate(`${location.pathname}?tab=connect`, { replace: true });
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'connect'
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                Connect
              </button>
              <button
                onClick={() => {
                  setActiveTab('billing');
                  navigate(`${location.pathname}?tab=billing`, { replace: true });
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'billing'
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-5 w-5 inline mr-2" />
                Cobrança
              </button>
              <button
                onClick={() => {
                  setActiveTab('settings');
                  navigate(`${location.pathname}?tab=settings`, { replace: true });
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="h-5 w-5 inline mr-2" />
                Configurações
              </button>
              <button
                onClick={() => {
                  setActiveTab('insights');
                  navigate(`${location.pathname}?tab=insights`, { replace: true });
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'insights'
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart2 className="h-5 w-5 inline mr-2" />
                💡 Insights Pessoais
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-6">Visão Geral</h2>
            <p>Conteúdo da Visão Geral...</p>
          </div>
        )}

        {activeTab === 'experiences' && (
          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-6">Minhas Experiências (Vouchers)</h2>
            {vouchers.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Você ainda não possui vouchers</p>
                <p className="text-gray-400 text-sm">Explore as ofertas disponíveis para adquirir seus primeiros vouchers</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vouchers.map((voucher) => (
                  <div key={voucher.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-[#333333]">
                        Voucher #{voucher.voucher_code}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                        {getStatusText(voucher.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Voucher válido para uso no estabelecimento parceiro
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Código:</span>
                        <span className="font-medium font-mono">
                          {voucher.voucher_code}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Criado em:</span>
                        <span>{formatDate(voucher.created_at)}</span>
                      </div>
                      {voucher.used_at && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Usado em:</span>
                          <span>{formatDate(voucher.used_at)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewETicket(voucher)}
                        className="flex-1 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>Ver E-Ticket</span>
                      </button>
                      {voucher.status === 'active' && (
                        <button 
                          onClick={() => handleShowQRCode(voucher)}
                          className="px-3 py-2 border border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35] hover:text-white transition-colors"
                          title="Mostrar QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                      )}
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'connect' && (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            <DuoPassConnect />
          </div>
        )}

        {activeTab === 'billing' && (
          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-6">Cobrança</h2>

            {/* Seção Plano Atual */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="font-semibold text-lg mb-4">Plano Atual</h3>
              <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-800">DuoPass Gratuito</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside mt-2">
                    <li>Acesso a experiências selecionadas</li>
                    <li>1 voucher por mês</li>
                  </ul>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">GRATUITO</span>
              </div>
            </div>

            {/* Seção Upgrade */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="font-semibold text-lg mb-2">Desbloqueie Mais Experiências</h3>
              <p className="text-sm text-gray-500 mb-6">Faça o upgrade para aproveitar ao máximo o DuoPass.</p>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Plano Starter */}
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <h4 className="font-bold">Starter</h4>
                  <p className="text-2xl font-bold my-2">CHF 9<span className="text-sm font-normal">/mês</span></p>
                  <button onClick={() => navigate('/memberships')} className="w-full bg-[#FF6B35] text-white py-2 rounded-lg hover:bg-[#E55A2B]">Fazer Upgrade</button>
                </div>
                {/* Plano Explorer */}
                <div className="border-2 border-[#FF6B35] rounded-lg p-4 text-center relative">
                  <span className="absolute top-0 -translate-y-1/2 bg-[#FF6B35] text-white text-xs px-2 py-0.5 rounded-full">POPULAR</span>
                  <h4 className="font-bold">Explorer</h4>
                  <p className="text-2xl font-bold my-2">CHF 12<span className="text-sm font-normal">/mês</span></p>
                  <button onClick={() => navigate('/memberships')} className="w-full bg-[#FF6B35] text-white py-2 rounded-lg hover:bg-[#E55A2B]">Fazer Upgrade</button>
                </div>
                {/* Plano Ambassador */}
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <h4 className="font-bold">Ambassador</h4>
                  <p className="text-2xl font-bold my-2">CHF 18<span className="text-sm font-normal">/mês</span></p>
                  <button onClick={() => navigate('/memberships')} className="w-full bg-[#FF6B35] text-white py-2 rounded-lg hover:bg-[#E55A2B]">Fazer Upgrade</button>
                </div>
              </div>
               <div className="text-center mt-4">
                <a href="/memberships" className="text-sm text-[#FF6B35] hover:underline">Ver todos os detalhes dos planos</a>
              </div>
            </div>

            {/* Histórico de Pagamentos */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4">Histórico de Pagamentos</h3>
              <p className="text-gray-500">Nenhum pagamento registrado.</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsPage />
        )}
        {activeTab === 'insights' && (
          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-6">Insights Pessoais</h2>
            <AIAnalyticsContainer userId={user.id} />
          </div>
        )}
      </div>

      {/* E-Ticket Modal */}
      {showETicket && selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#333333]">Seu E-Ticket</h3>
              <button
                onClick={handleCloseETicket}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center">
              <ETicket voucher={selectedVoucher} />
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Apresente este e-ticket no estabelecimento para utilizar seu voucher
              </p>
              <button
                onClick={handleCloseETicket}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && selectedVoucherForQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#333333]">QR Code do Voucher</h3>
              <button
                onClick={handleCloseQRCode}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center">
              <VoucherQRCode voucher={selectedVoucherForQR} />
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Apresente este QR code no estabelecimento para validação
              </p>
              <button
                onClick={handleCloseQRCode}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧪 BOTÕES DE TESTE - SEMPRE VISÍVEIS EM DEV */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          <button
            onClick={() => {
              console.log('🧪 TESTE: Navegando para /ofertas');
              navigate('/ofertas');
            }}
            className="block w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
          >
            🧪 Teste /ofertas
          </button>
          <button
            onClick={() => {
              console.log('🧪 TESTE: Navegando para /meus-vouchers');
              navigate('/meus-vouchers');
            }}
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
          >
            🧪 Teste /meus-vouchers
          </button>
          <button
            onClick={() => {
              console.log('🧪 TESTE: Estado atual:', {
                loading,
                offersCount: offers.length,
                vouchersCount: vouchers.length,
                hasUser: !!user,
                userEmail: user?.email,
                activeTab
              });
            }}
            className="block w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
          >
            🔍 Debug Estado
          </button>
        </div>
      )}
    </DashboardLayout>
  );
});
export default CustomerDashboard;