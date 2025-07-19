import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Gift, 
  Star, 
  Crown, 
  Trophy, 
  ArrowRight,
  Heart,
  MapPin,
  Clock,
  Users,
  MessageCircle,
  Shield,
  FileText,
  Eye,
  Trash2
} from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../types/membership';
import { useAuth } from '../contexts/AuthContext';
import ConnectTab from '../components/ConnectTab';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { PaymentMethodModal } from '../components/PaymentMethodModal';
import { PaymentMethodService, PaymentMethod, PaymentMethodData } from '../services/paymentMethodService';
import TrialCountdown from '../components/TrialCountdown';
import GoldenWeekSection from '../components/GoldenWeekSection';
import FreemiumTransition from '../components/FreemiumTransition';
import UpgradeCTA from '../components/UpgradeCTA';
import UserTierStatus from '../components/UserTierStatus';

interface UserSubscription {
  id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: Date;
  current_period_end: Date;
  experiences_used_this_month: number;
  created_at: Date;
}

interface ExperienceHistory {
  id: string;
  title: string;
  partner: string;
  date: Date;
  status: 'completed' | 'upcoming' | 'canceled';
  voucher_code: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, trialStatus } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  
  // Mock subscription data
  const [subscription] = useState<UserSubscription>({
    id: 'sub_123',
    plan_id: searchParams.get('plan') || 'cultural-explorer',
    status: 'active',
    current_period_start: new Date(),
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    experiences_used_this_month: 2,
    created_at: new Date()
  });

  // Mock experience history
  const [experienceHistory] = useState<ExperienceHistory[]>([
    {
      id: '1',
      title: 'Sarau Literário no Café Central',
      partner: 'Café Central Zurich',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'completed',
      voucher_code: 'DUO123'
    },
    {
      id: '2',
      title: 'Jantar à Luz de Velas',
      partner: 'Restaurant Romantique',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      voucher_code: 'DUO456'
    },
    {
      id: '3',
      title: 'Oficina de Cerâmica & Chá',
      partner: 'Atelier Keramik',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'upcoming',
      voucher_code: 'DUO789'
    }
  ]);

  const currentPlan = MEMBERSHIP_PLANS.find(plan => plan.id === subscription.plan_id) || MEMBERSHIP_PLANS[1];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Verificar se a rota é /connect
    if (location.pathname === '/connect') {
      setActiveTab('connect');
    }

    // Verificar parâmetro tab na URL
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'connect') {
      setActiveTab('connect');
    }

    if (searchParams.get('welcome') === 'true') {
      setShowWelcome(true);
      // Remove welcome parameter from URL
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('welcome');
      navigate({ search: newSearchParams.toString() }, { replace: true });
    }

    // Carregar método de pagamento atual
    loadCurrentPaymentMethod();
  }, [user, navigate, searchParams, location]);

  const loadCurrentPaymentMethod = async () => {
    try {
      const paymentMethod = await PaymentMethodService.getCurrentPaymentMethod();
      setCurrentPaymentMethod(paymentMethod);
    } catch (error) {
      console.error('Erro ao carregar método de pagamento:', error);
    }
  };

  const handleUpdatePaymentMethod = async (paymentData: PaymentMethodData) => {
    setIsLoadingPayment(true);
    try {
      const updatedPaymentMethod = await PaymentMethodService.updatePaymentMethod(paymentData);
      setCurrentPaymentMethod(updatedPaymentMethod);
      console.log('Método de pagamento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar método de pagamento:', error);
      throw error; // Re-throw para o modal tratar
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'starter': return <Star className="w-6 h-6" />;
      case 'explorer': return <Crown className="w-6 h-6" />;
      case 'ambassador': return <Trophy className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      case 'past_due': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getExperienceStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUsagePercentage = () => {
    if (currentPlan.experiences_per_month === -1) return 0; // Unlimited
    return (subscription.experiences_used_this_month / currentPlan.experiences_per_month) * 100;
  };

  const handleCancelSubscription = () => {
    if (confirm('Tem certeza que deseja cancelar sua assinatura? Você ainda terá acesso até o final do período atual.')) {
      alert('Assinatura cancelada com sucesso. Você ainda pode usar o serviço até ' + subscription.current_period_end.toLocaleDateString());
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <GoldenWeekSection />
        <FreemiumTransition />
        <TrialCountdown />
        <div className="p-4 sm:p-6 lg:p-8">
          <UserTierStatus />
          <UpgradeCTA />
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWelcome(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
          >
            <div className="bg-gradient-to-r from-amber-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo ao DUO PASS!</h2>
            <p className="text-gray-600 mb-6">
              Sua assinatura {currentPlan.name} está ativa! Aproveite seus 7 dias grátis e descubra experiências culturais incríveis.
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="w-full bg-gradient-to-r from-amber-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Começar a Explorar
            </button>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
            { id: 'experiences', label: 'Experiências', icon: Heart },
            { id: 'connect', label: 'Connect', icon: MessageCircle },
            { id: 'billing', label: 'Cobrança & Transparência', icon: CreditCard },
            { id: 'privacy', label: 'Dados Pessoais', icon: Shield },
            { id: 'settings', label: 'Configurações', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700">Experiências Este Mês</h3>
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {subscription.experiences_used_this_month}
                  {currentPlan.experiences_per_month !== -1 && (
                    <span className="text-lg text-gray-500">/{currentPlan.experiences_per_month}</span>
                  )}
                </div>
                {currentPlan.experiences_per_month !== -1 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                    />
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700">Próxima Cobrança</h3>
                  <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {subscription.current_period_end.getDate()}
                </div>
                <div className="text-sm text-gray-500">
                  {subscription.current_period_end.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700">Status da Conta</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                    {subscription.status === 'active' ? 'Ativa' : subscription.status}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  CHF {currentPlan.price_monthly}
                </div>
                <div className="text-sm text-gray-500">por mês</div>
              </motion.div>
            </div>

            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Seu Plano Atual</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`rounded-full p-3 ${
                    currentPlan.tier === 'starter' ? 'bg-amber-100 text-amber-600' :
                    currentPlan.tier === 'explorer' ? 'bg-purple-100 text-purple-600' :
                    'bg-rose-100 text-rose-600'
                  }`}>
                    {getPlanIcon(currentPlan.tier)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{currentPlan.name}</h4>
                    <p className="text-gray-600">{currentPlan.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/memberships')}
                  className="bg-gradient-to-r from-amber-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Alterar Plano
                </button>
              </div>
            </motion.div>

            {/* Recent Experiences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Experiências Recentes</h3>
                <button
                  onClick={() => setActiveTab('experiences')}
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
                >
                  <span>Ver Todas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {experienceHistory.slice(0, 3).map((experience) => (
                  <div key={experience.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 rounded-full p-2">
                        <Heart className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{experience.title}</h4>
                        <p className="text-sm text-gray-600">{experience.partner}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceStatusColor(experience.status)}`}>
                        {experience.status === 'completed' ? 'Concluída' : 
                         experience.status === 'upcoming' ? 'Agendada' : 'Cancelada'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {experience.date.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Experiences Tab */}
        {activeTab === 'experiences' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Histórico de Experiências</h3>
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-amber-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Explorar Experiências
              </button>
            </div>
            <div className="space-y-4">
              {experienceHistory.map((experience) => (
                <div key={experience.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-800">{experience.title}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceStatusColor(experience.status)}`}>
                          {experience.status === 'completed' ? 'Concluída' : 
                           experience.status === 'upcoming' ? 'Agendada' : 'Cancelada'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{experience.partner}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{experience.date.toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>2 pessoas</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Código do voucher: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{experience.voucher_code}</span>
                      </div>
                    </div>
                    {experience.status === 'upcoming' && (
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                        Ver Detalhes
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Connect Tab */}
        {activeTab === 'connect' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ConnectTab userMembership={{ tier: currentPlan.tier, status: subscription.status }} />
          </motion.div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Transparência de Cobrança */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">⚖️ Transparência Total de Cobrança</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg border border-purple-100">
                  <div className="text-sm font-medium text-purple-700 mb-1">Próxima Cobrança</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {subscription.current_period_end.toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-sm text-gray-600">CHF {(currentPlan.price_monthly * 1.077).toFixed(2)} (com IVA 7.7%)</div>
                  <div className="text-xs text-purple-600 mt-2">
                    {Math.ceil((subscription.current_period_end.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias restantes
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-green-100">
                  <div className="text-sm font-medium text-green-700 mb-1">Plano Atual</div>
                  <div className="text-xl font-bold text-gray-800 mb-1">{currentPlan.name}</div>
                  <div className="text-sm text-gray-600">CHF {currentPlan.price_monthly}/mês</div>
                  <div className="text-xs text-green-600 mt-2">Renovação automática ativa</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-amber-100">
                  <div className="text-sm font-medium text-amber-700 mb-1">Status da Conta</div>
                  <div className="text-xl font-bold text-gray-800 mb-1">Ativa</div>
                  <div className="text-sm text-gray-600">Desde {subscription.created_at.toLocaleDateString('pt-BR')}</div>
                  <div className="text-xs text-amber-600 mt-2">Pode cancelar a qualquer momento</div>
                </div>
              </div>
              
              {/* Botão de Cancelamento Visível */}
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Cancelar Assinatura</h4>
                    <p className="text-sm text-red-600">
                      Você pode cancelar a qualquer momento. Manterá acesso até {subscription.current_period_end.toLocaleDateString('pt-BR')}.
                    </p>
                  </div>
                  <button
                    onClick={handleCancelSubscription}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancelar Assinatura
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Informações de Cobrança Detalhadas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Detalhes de Cobrança</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Valor base da assinatura</span>
                  <span className="font-medium">CHF {currentPlan.price_monthly}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">IVA Suíço (7.7%)</span>
                  <span className="font-medium">CHF {(currentPlan.price_monthly * 0.077).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="font-medium text-purple-800">Total mensal</span>
                  <span className="font-bold text-purple-800">CHF {(currentPlan.price_monthly * 1.077).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🇨🇭 Direitos do Consumidor Suíço</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Direito de arrependimento de 14 dias</li>
                  <li>• Cancelamento a qualquer momento sem multa</li>
                  <li>• Reembolso proporcional em caso de cancelamento</li>
                  <li>• Transparência total de preços e taxas</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Método de Pagamento</h3>
              {currentPaymentMethod ? (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {currentPaymentMethod.card.brand.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      •••• •••• •••• {currentPaymentMethod.card.last4}
                    </div>
                    <div className="text-sm text-gray-600">
                      Expira em {currentPaymentMethod.card.exp_month.toString().padStart(2, '0')}/{currentPaymentMethod.card.exp_year}
                    </div>
                  </div>
                  <button 
                    onClick={handleOpenPaymentModal}
                    disabled={isLoadingPayment}
                    className="ml-auto text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    {isLoadingPayment ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
                    ) : (
                      <span>Alterar</span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-gray-600">
                    <div className="font-medium">Nenhum método de pagamento</div>
                    <div className="text-sm">Adicione um cartão para continuar</div>
                  </div>
                  <button 
                    onClick={handleOpenPaymentModal}
                    className="bg-gradient-to-r from-amber-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Adicionar Cartão
                  </button>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Pagamento Seguro SSL</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Seus dados de pagamento são criptografados e protegidos conforme padrões PCI DSS.
                </p>
              </div>
            </motion.div>

            {/* Histórico Completo de Pagamentos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">📊 Histórico Completo de Pagamentos</h3>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>Exportar Relatório</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { date: '15 Jan 2024', amount: 32.31, status: 'Pago', invoice: 'INV-2024-001', period: 'Jan 2024 - Fev 2024' },
                  { date: '15 Dez 2023', amount: 32.31, status: 'Pago', invoice: 'INV-2023-012', period: 'Dez 2023 - Jan 2024' },
                  { date: '15 Nov 2023', amount: 32.31, status: 'Pago', invoice: 'INV-2023-011', period: 'Nov 2023 - Dez 2023' },
                  { date: '15 Out 2023', amount: 0.00, status: 'Teste Grátis', invoice: 'FREE-TRIAL', period: 'Período de Teste' }
                ].map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium text-gray-800">DUO PASS Premium</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'Pago' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'Teste Grátis' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{payment.period}</div>
                      <div className="text-xs text-gray-500">{payment.date} • Fatura: {payment.invoice}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">
                        {payment.amount === 0 ? 'Gratuito' : `CHF ${payment.amount.toFixed(2)}`}
                      </div>
                      {payment.status === 'Pago' && (
                        <button className="text-purple-600 hover:text-purple-700 text-sm flex items-center space-x-1 mt-1">
                          <FileText className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total pago em 2024:</span>
                  <span className="font-bold text-gray-800">CHF 64.62</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Próximo pagamento:</span>
                  <span className="font-medium text-purple-600">
                    CHF 32.31 em {subscription.current_period_end.toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Dados Pessoais</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-800">Visualizar Dados Coletados</div>
                      <div className="text-sm text-gray-600">Veja todos os dados que coletamos sobre você</div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Visualizar
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-800">Exportar Dados</div>
                      <div className="text-sm text-gray-600">Baixe uma cópia de todos os seus dados</div>
                    </div>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-medium">
                    Exportar
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-medium text-red-800">Excluir Conta</div>
                      <div className="text-sm text-red-600">Remova permanentemente sua conta e todos os dados</div>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-700 font-medium">
                    Excluir
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Consentimentos</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">Cookies Essenciais</div>
                    <div className="text-sm text-gray-600">Necessários para o funcionamento do site</div>
                  </div>
                  <input type="checkbox" checked disabled className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">Cookies de Analytics</div>
                    <div className="text-sm text-gray-600">Nos ajudam a melhorar a experiência</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">Cookies de Marketing</div>
                    <div className="text-sm text-gray-600">Para personalizar anúncios e conteúdo</div>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Transparência de Dados</h3>
              <div className="space-y-3 text-sm text-blue-700">
                <p>• Coletamos apenas os dados necessários para fornecer nossos serviços</p>
                <p>• Seus dados nunca são vendidos para terceiros</p>
                <p>• Você pode solicitar a exclusão de seus dados a qualquer momento</p>
                <p>• Utilizamos criptografia para proteger suas informações</p>
              </div>
              <div className="mt-4">
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
                  Leia nossa Política de Privacidade completa
                </a>
              </div>
            </motion.div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Informações da Conta</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Preferências</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">Notificações por Email</div>
                    <div className="text-sm text-gray-600">Receber atualizações sobre novas experiências</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">Newsletter Cultural</div>
                    <div className="text-sm text-gray-600">Curadoria semanal de experiências</div>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-red-800 mb-4">Zona de Perigo</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Cancelar Assinatura</h4>
                  <p className="text-sm text-red-600 mb-4">
                    Você ainda terá acesso até o final do período atual ({subscription.current_period_end.toLocaleDateString('pt-BR')}).
                  </p>
                  <button
                    onClick={handleCancelSubscription}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Cancelar Assinatura
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
</div>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSave={handleUpdatePaymentMethod}
        currentCard={currentPaymentMethod ? {
          last4: currentPaymentMethod.card.last4,
          brand: currentPaymentMethod.card.brand.toUpperCase(),
          expMonth: currentPaymentMethod.card.exp_month,
          expYear: currentPaymentMethod.card.exp_year
        } : undefined}
      />
    </DashboardLayout>
  );
}