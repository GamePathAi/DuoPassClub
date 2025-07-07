import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  // Calendar,
  MapPin,
  Star,
  Eye,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  Edit,
  Pause,
  Play,
  Trash2,
  Download,
  // Filter,
  Search,
  Clock,
  Target,
  DollarSign
  // Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// import { supabase } from '../lib/supabaseConfig';

interface PartnerStats {
  total_offers: number;
  active_offers: number;
  total_redemptions: number;
  total_views: number;
  conversion_rate: number;
  revenue_generated: number;
  avg_rating: number;
  total_reviews: number;
  monthly_growth: number;
}

interface OfferAnalytics {
  id: string;
  title: string;
  views: number;
  redemptions: number;
  conversion_rate: number;
  revenue: number;
  status: 'active' | 'paused' | 'expired';
  created_at: string;
  expires_at: string;
}

interface CustomerInsight {
  age_group: string;
  gender: string;
  location: string;
  visit_frequency: string;
  avg_spending: number;
  preferred_time: string;
  count: number;
}

export const PartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'offers' | 'analytics' | 'customers' | 'settings'>('overview');
  const [stats, setStats] = useState<PartnerStats>({
    total_offers: 0,
    active_offers: 0,
    total_redemptions: 0,
    total_views: 0,
    conversion_rate: 0,
    revenue_generated: 0,
    avg_rating: 0,
    total_reviews: 0,
    monthly_growth: 0
  });
  const [offers, setOffers] = useState<OfferAnalytics[]>([]);
  const [customerInsights] = useState<CustomerInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simular dados do dashboard
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        total_offers: 12,
        active_offers: 8,
        total_redemptions: 245,
        total_views: 3420,
        conversion_rate: 7.2,
        revenue_generated: 15680.50,
        avg_rating: 4.6,
        total_reviews: 89,
        monthly_growth: 23.5
      });

      setOffers([
        {
          id: '1',
          title: 'Pizza Margherita 50% OFF',
          views: 890,
          redemptions: 67,
          conversion_rate: 7.5,
          revenue: 2340.00,
          status: 'active',
          created_at: '2024-01-15',
          expires_at: '2024-02-15'
        },
        {
          id: '2',
          title: 'Combo Hambúrguer + Batata',
          views: 654,
          redemptions: 43,
          conversion_rate: 6.6,
          revenue: 1720.00,
          status: 'active',
          created_at: '2024-01-10',
          expires_at: '2024-02-10'
        },
        {
          id: '3',
          title: 'Sobremesa Grátis',
          views: 432,
          redemptions: 89,
          conversion_rate: 20.6,
          revenue: 890.00,
          status: 'paused',
          created_at: '2024-01-05',
          expires_at: '2024-02-05'
        }
      ]);

      setCustomerInsights([
        { age_group: '18-25', gender: 'M', location: 'Centro', visit_frequency: 'Semanal', avg_spending: 45.50, preferred_time: '19:00-21:00', count: 34 },
        { age_group: '26-35', gender: 'F', location: 'Zona Sul', visit_frequency: 'Quinzenal', avg_spending: 62.30, preferred_time: '12:00-14:00', count: 28 },
        { age_group: '36-45', gender: 'M', location: 'Zona Norte', visit_frequency: 'Mensal', avg_spending: 78.90, preferred_time: '20:00-22:00', count: 19 }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; change?: number; icon: React.ReactNode; color: string }> = ({
    title,
    value,
    change,
    icon,
    color
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${change < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(change)}% vs mês anterior
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ofertas Ativas"
          value={stats.active_offers}
          change={12}
          icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total de Resgates"
          value={stats.total_redemptions}
          change={stats.monthly_growth}
          icon={<Target className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${stats.conversion_rate}%`}
          change={2.3}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Receita Gerada"
          value={`CHF ${(stats.revenue_generated * 0.18).toLocaleString('de-CH', { minimumFractionDigits: 2 })}`}
          change={18.7}
          icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-100"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance das Ofertas</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Gráfico de Performance</p>
              <p className="text-sm">Visualização em desenvolvimento</p>
            </div>
          </div>
        </div>

        {/* Top Offers */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Ofertas com Melhor Performance</h3>
          <div className="space-y-4">
            {offers.slice(0, 3).map((offer, index) => (
              <div key={offer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">{offer.title}</p>
                    <p className="text-xs text-gray-500">{offer.redemptions} resgates</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    {offer.conversion_rate}%
                  </p>
                  <p className="text-xs text-gray-500">conversão</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-800">Nova Oferta</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-800">Relatórios</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-800">Mensagens</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Settings className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-800">Configurações</span>
          </button>
        </div>
      </div>
    </div>
  );

  const OffersTab = () => (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Ofertas</h2>
          <p className="text-gray-600">Controle suas promoções e campanhas</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Nova Oferta
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar ofertas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">Todas as ofertas</option>
            <option value="active">Ativas</option>
            <option value="paused">Pausadas</option>
            <option value="expired">Expiradas</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">Todas as categorias</option>
            <option value="food">Alimentação</option>
            <option value="retail">Varejo</option>
            <option value="services">Serviços</option>
          </select>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oferta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visualizações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resgates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                      <div className="text-sm text-gray-500">
                        Expira em {new Date(offer.expires_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      offer.status === 'active' ? 'bg-green-100 text-green-800' :
                      offer.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {offer.status === 'active' ? 'Ativa' :
                       offer.status === 'paused' ? 'Pausada' : 'Expirada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-gray-400 mr-1" />
                      {offer.views.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-gray-400 mr-1" />
                      {offer.redemptions}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`font-medium ${
                      offer.conversion_rate >= 10 ? 'text-green-600' :
                      offer.conversion_rate >= 5 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {offer.conversion_rate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    CHF {(offer.revenue * 0.18).toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        {offer.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Avançado</h2>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Horários de Pico</h3>
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">12:00 - 14:00</span>
              <span className="text-sm font-semibold">34%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">19:00 - 21:00</span>
              <span className="text-sm font-semibold">28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">15:00 - 17:00</span>
              <span className="text-sm font-semibold">22%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Localização dos Clientes</h3>
            <MapPin className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Centro</span>
              <span className="text-sm font-semibold">42%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Zona Sul</span>
              <span className="text-sm font-semibold">31%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Zona Norte</span>
              <span className="text-sm font-semibold">27%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Avaliações</h3>
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.avg_rating}</div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.floor(stats.avg_rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">{stats.total_reviews} avaliações</div>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Perfil dos Clientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Faixa Etária</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Gênero</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Localização</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Frequência</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Gasto Médio</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Horário Preferido</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Clientes</th>
              </tr>
            </thead>
            <tbody>
              {customerInsights.map((insight, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">{insight.age_group}</td>
                  <td className="py-3 px-4 text-sm">{insight.gender}</td>
                  <td className="py-3 px-4 text-sm">{insight.location}</td>
                  <td className="py-3 px-4 text-sm">{insight.visit_frequency}</td>
                  <td className="py-3 px-4 text-sm font-medium">
                    R$ {insight.avg_spending.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm">{insight.preferred_time}</td>
                  <td className="py-3 px-4 text-sm font-semibold">{insight.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Parceiro</h1>
              <p className="text-gray-600">Gerencie suas ofertas e acompanhe o desempenho</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'offers', label: 'Ofertas', icon: ShoppingBag },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'customers', label: 'Clientes', icon: Users },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'offers' | 'analytics' | 'customers' | 'settings')}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'offers' && <OffersTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'customers' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestão de Clientes</h3>
            <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Configurações</h3>
            <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
          </div>
        )}
      </div>
    </div>
  );
};