import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Mail,
  Settings,
  Download,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Target,
  Zap,
  Database,
  Activity,
  PieChart
} from 'lucide-react';
// useAuth import removed as it's not used
import DashboardLayout from './Layout/DashboardLayout';
// import { CRMService } from '../services/crmService';
// import { PaymentService } from '../services/paymentService';
// import { GamificationService } from '../services/gamificationService';

interface AdminStats {
  total_users: number;
  active_users: number;
  total_merchants: number;
  active_merchants: number;
  total_offers: number;
  active_offers: number;
  total_revenue: number;
  monthly_revenue: number;
  total_transactions: number;
  conversion_rate: number;
  user_growth_rate: number;
  merchant_growth_rate: number;
  avg_session_duration: number;
  support_tickets: number;
  pending_approvals: number;
}

interface SystemHealth {
  api_status: 'healthy' | 'warning' | 'critical';
  database_status: 'healthy' | 'warning' | 'critical';
  payment_gateway_status: 'healthy' | 'warning' | 'critical';
  notification_service_status: 'healthy' | 'warning' | 'critical';
  response_time: number;
  uptime_percentage: number;
  error_rate: number;
  active_sessions: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'merchant_signup' | 'offer_created' | 'transaction' | 'support_ticket' | 'system_alert';
  title: string;
  description: string;
  user?: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export default function AdminDashboard() {
  // Auth context not needed in this component
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'merchants' | 'offers' | 'analytics' | 'crm' | 'system' | 'settings'>('overview');
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    active_users: 0,
    total_merchants: 0,
    active_merchants: 0,
    total_offers: 0,
    active_offers: 0,
    total_revenue: 0,
    monthly_revenue: 0,
    total_transactions: 0,
    conversion_rate: 0,
    user_growth_rate: 0,
    merchant_growth_rate: 0,
    avg_session_duration: 0,
    support_tickets: 0,
    pending_approvals: 0
  });
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    api_status: 'healthy',
    database_status: 'healthy',
    payment_gateway_status: 'healthy',
    notification_service_status: 'healthy',
    response_time: 0,
    uptime_percentage: 0,
    error_rate: 0,
    active_sessions: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Atualizar a cada 30 segundos
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        total_users: 15420,
        active_users: 12340,
        total_merchants: 890,
        active_merchants: 756,
        total_offers: 2340,
        active_offers: 1890,
        total_revenue: 485670.50,
        monthly_revenue: 89450.30,
        total_transactions: 45670,
        conversion_rate: 7.8,
        user_growth_rate: 23.5,
        merchant_growth_rate: 18.2,
        avg_session_duration: 8.5,
        support_tickets: 23,
        pending_approvals: 12
      });

      setSystemHealth({
        api_status: 'healthy',
        database_status: 'healthy',
        payment_gateway_status: 'warning',
        notification_service_status: 'healthy',
        response_time: 245,
        uptime_percentage: 99.8,
        error_rate: 0.02,
        active_sessions: 1234
      });

      setRecentActivity([
        {
          id: '1',
          type: 'user_registration',
          title: 'Novo usuário registrado',
          description: 'João Silva se cadastrou na plataforma',
          user: 'joao.silva@email.com',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          id: '2',
          type: 'merchant_signup',
          title: 'Novo parceiro',
          description: 'Restaurante Bella Vista solicitou parceria',
          user: 'contato@bellavista.com',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          status: 'info'
        },
        {
          id: '3',
          type: 'system_alert',
          title: 'Gateway de pagamento lento',
          description: 'Tempo de resposta acima do normal',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'warning'
        },
        {
          id: '4',
          type: 'offer_created',
          title: 'Nova oferta criada',
          description: 'Pizza 50% OFF - Pizzaria do Centro',
          user: 'pizzaria@centro.com',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          id: '5',
          type: 'support_ticket',
          title: 'Ticket de suporte',
          description: 'Usuário relatou problema no QR Code',
          user: 'usuario@email.com',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'warning'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
  }> = ({ title, value, change, icon, color, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' :
              trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(change)}% vs período anterior
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const StatusIndicator: React.FC<{ status: 'healthy' | 'warning' | 'critical'; label: string }> = ({ status, label }) => (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${
        status === 'healthy' ? 'bg-green-500' :
        status === 'warning' ? 'bg-yellow-500' :
        'bg-red-500'
      }`} />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Usuários Ativos"
          value={stats.active_users.toLocaleString()}
          change={stats.user_growth_rate}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
          trend="up"
        />
        <StatCard
          title="Parceiros Ativos"
          value={stats.active_merchants.toLocaleString()}
          change={stats.merchant_growth_rate}
          icon={<ShoppingBag className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
          trend="up"
        />
        <StatCard
          title="Receita Mensal"
          value={`CHF ${(stats.monthly_revenue * 0.18).toLocaleString('de-CH', { minimumFractionDigits: 2 })}`}
          change={15.3}
          icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
          color="bg-yellow-100"
          trend="up"
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${stats.conversion_rate}%`}
          change={2.1}
          icon={<Target className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
          trend="up"
        />
      </div>

      {/* Status do Sistema e Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status do Sistema */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Status do Sistema</h3>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <StatusIndicator status={systemHealth.api_status} label="API" />
            <StatusIndicator status={systemHealth.database_status} label="Banco de Dados" />
            <StatusIndicator status={systemHealth.payment_gateway_status} label="Gateway de Pagamento" />
            <StatusIndicator status={systemHealth.notification_service_status} label="Notificações" />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Uptime:</span>
                <span className="ml-2 font-semibold">{systemHealth.uptime_percentage}%</span>
              </div>
              <div>
                <span className="text-gray-600">Resp. Time:</span>
                <span className="ml-2 font-semibold">{systemHealth.response_time}ms</span>
              </div>
              <div>
                <span className="text-gray-600">Sessões:</span>
                <span className="ml-2 font-semibold">{systemHealth.active_sessions}</span>
              </div>
              <div>
                <span className="text-gray-600">Erro Rate:</span>
                <span className="ml-2 font-semibold">{systemHealth.error_rate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' :
                  activity.status === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  {activity.user && (
                    <p className="text-xs text-gray-500">{activity.user}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas Operacionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pendências</h3>
            <AlertTriangle className="w-6 h-6 text-orange-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Aprovações de Parceiros</span>
              <span className="text-sm font-semibold text-orange-600">{stats.pending_approvals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tickets de Suporte</span>
              <span className="text-sm font-semibold text-red-600">{stats.support_tickets}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ofertas para Revisão</span>
              <span className="text-sm font-semibold text-yellow-600">8</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance</h3>
            <Activity className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sessão Média</span>
              <span className="text-sm font-semibold">{stats.avg_session_duration} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ofertas Ativas</span>
              <span className="text-sm font-semibold text-green-600">{stats.active_offers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Transações Hoje</span>
              <span className="text-sm font-semibold text-blue-600">1,234</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Ações Rápidas</h3>
            <Zap className="w-6 h-6 text-purple-500" />
          </div>
          <div className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm">
              📊 Gerar Relatório Mensal
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm">
              📧 Enviar Newsletter
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm">
              🔄 Sincronizar Dados
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-sm">
              ⚙️ Configurar Automações
            </button>
          </div>
        </div>
      </div>

      {/* Gráficos de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Crescimento de Usuários</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '24h' | '7d' | '30d' | '90d')}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Gráfico de Crescimento</p>
              <p className="text-sm">Visualização em desenvolvimento</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Distribuição de Receita</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Ver detalhes
            </button>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <PieChart className="w-12 h-12 mx-auto mb-2" />
              <p>Gráfico de Pizza</p>
              <p className="text-sm">Visualização em desenvolvimento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h2>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuários..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="blocked">Bloqueados</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">Todos os planos</option>
            <option value="free">Gratuito</option>
            <option value="basic">Básico</option>
            <option value="premium">Premium</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>

      {/* Estatísticas dos Usuários */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total de Usuários"
          value={stats.total_users.toLocaleString()}
          change={stats.user_growth_rate}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
          trend="up"
        />
        <StatCard
          title="Usuários Ativos"
          value={stats.active_users.toLocaleString()}
          change={5.2}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
          trend="up"
        />
        <StatCard
          title="Novos Este Mês"
          value="2,340"
          change={18.7}
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
          trend="up"
        />
        <StatCard
          title="Taxa de Retenção"
          value="87.5%"
          change={3.1}
          icon={<Target className="w-6 h-6 text-orange-600" />}
          color="bg-orange-100"
          trend="up"
        />
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Lista de Usuários</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pontos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acesso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Dados simulados */}
              {[
                { id: 1, name: 'João Silva', email: 'joao@email.com', status: 'active', plan: 'Premium', points: 1250, lastAccess: '2024-01-15 14:30' },
                { id: 2, name: 'Maria Santos', email: 'maria@email.com', status: 'active', plan: 'Básico', points: 890, lastAccess: '2024-01-15 12:15' },
                { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', status: 'inactive', plan: 'VIP', points: 2340, lastAccess: '2024-01-10 09:45' }
              ].map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.plan}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.points.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.lastAccess}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
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

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard Administrativo">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard administrativo...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard Administrativo">
      <div className="space-y-6">
        <div className="mb-6">
          <p className="text-gray-600">Controle total da plataforma DuoPass Club</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'merchants', label: 'Parceiros', icon: ShoppingBag },
              { id: 'offers', label: 'Ofertas', icon: Target },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'crm', label: 'CRM', icon: Mail },
              { id: 'system', label: 'Sistema', icon: Database },
              { id: 'settings', label: 'Configurações', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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

        {/* Content */}
        <div>
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'merchants' && (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestão de Parceiros</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'offers' && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestão de Ofertas</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Avançado</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'crm' && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">CRM Integrado</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'system' && (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Monitoramento do Sistema</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Configurações do Sistema</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;