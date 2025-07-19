import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  Send,
  // Users,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Play,
  // Pause,
  // Calendar,
  Target,
  TrendingUp,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  CheckCircle,
  AlertCircle,
  // Filter,
  Download
} from 'lucide-react';
import { NotificationService } from '../services/notificationService';
import DashboardLayout from './Layout/DashboardLayout';


interface CommunicationDashboardProps {
  className?: string;
}

type TabType = 'overview' | 'campaigns' | 'templates' | 'analytics' | 'preferences';

export default function CommunicationDashboard({ className = '' }: CommunicationDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [campaigns, setCampaigns] = useState<{ id: string; name: string; status: string; type: string; created_at: string }[]>([]);
  const [templates, setTemplates] = useState<{ id: string; name: string; type: string; content: string }[]>([]);
  const [analytics, setAnalytics] = useState<{ sent: number; opened: number; clicked: number; converted: number } | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [activeTab, loadData]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'campaigns': {
          const campaignsData = await NotificationService.getCampaigns();
          setCampaigns(campaignsData);
          break;
        }
        case 'templates': {
          const templatesData = await NotificationService.getTemplates();
          setTemplates(templatesData);
          break;
        }
        case 'analytics': {
          const analyticsData = await NotificationService.getCampaignAnalytics('campaign_1');
          setAnalytics(analyticsData);
          break;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const handleSendCampaign = async (campaignId: string) => {
    try {
      setLoading(true);
      const result = await NotificationService.sendCampaign(campaignId);
      console.log('Campanha enviada:', result);
      await loadData();
    } catch (error) {
      console.error('Erro ao enviar campanha:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const report = await NotificationService.generateReport({
        type: 'campaign_performance',
        date_range: {
          start: _dateRange.start || new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
          end: _dateRange.end || new Date().toISOString()
        }
      });
      console.log('Relatório gerado:', report);
      // Aqui você pode implementar download do relatório
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Campanhas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+15% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Abertura</p>
              <p className="text-2xl font-bold text-gray-900">62.5%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+3.2% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Clique</p>
              <p className="text-2xl font-bold text-gray-900">28.7%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+1.8% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversões</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+8.5% vs mês anterior</span>
          </div>
        </div>
      </div>

      {/* Campanhas Recentes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Campanhas Recentes</h3>
            <button
              onClick={() => setActiveTab('campaigns')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Ver todas
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {campaigns.slice(0, 3).map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    campaign.status === 'sent' ? 'bg-green-100' :
                    campaign.status === 'scheduled' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {campaign.status === 'sent' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : campaign.status === 'scheduled' ? (
                      <Clock className="h-5 w-5 text-blue-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <p className="text-sm text-gray-500">{campaign.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {campaign.metrics?.sent || 0} enviadas
                  </p>
                  <p className="text-sm text-gray-500">
                    {campaign.status === 'sent' ? 'Enviada' :
                     campaign.status === 'scheduled' ? 'Agendada' : 'Rascunho'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Campanhas de Comunicação</h2>
          <button
            onClick={() => _setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Campanha</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos os Status</option>
            <option value="draft">Rascunho</option>
            <option value="scheduled">Agendada</option>
            <option value="sent">Enviada</option>
            <option value="paused">Pausada</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos os Tipos</option>
            <option value="email">Email</option>
            <option value="push">Push</option>
            <option value="sms">SMS</option>
          </select>

          <button
            onClick={generateReport}
            disabled={loading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Lista de Campanhas */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campanha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alcance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {campaign.template_id?.includes('email') && <Mail className="h-4 w-4 text-blue-600" />}
                      {campaign.template_id?.includes('push') && <Smartphone className="h-4 w-4 text-green-600" />}
                      {campaign.template_id?.includes('sms') && <MessageSquare className="h-4 w-4 text-purple-600" />}
                      <span className="text-sm text-gray-900 capitalize">
                        {campaign.template_id?.includes('email') ? 'Email' :
                         campaign.template_id?.includes('push') ? 'Push' : 'SMS'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status === 'sent' ? 'Enviada' :
                       campaign.status === 'scheduled' ? 'Agendada' :
                       campaign.status === 'draft' ? 'Rascunho' : 'Pausada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.target_audience?.estimated_reach?.toLocaleString() || 0} usuários
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {campaign.metrics?.sent > 0 ? (
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {((campaign.metrics.opened / campaign.metrics.sent) * 100).toFixed(1)}% abertura
                        </div>
                        <div className="text-gray-500">
                          {((campaign.metrics.clicked / campaign.metrics.opened) * 100).toFixed(1)}% clique
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700">
                        <Edit className="h-4 w-4" />
                      </button>
                      {campaign.status === 'scheduled' && (
                        <button
                          onClick={() => handleSendCampaign(campaign.id)}
                          className="text-green-600 hover:text-green-700"
                          disabled={loading}
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
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

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics de Comunicação</h2>
        
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Métricas Principais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Métricas Principais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Taxa de Entrega</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.metrics.delivery_rate}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Taxa de Abertura</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.metrics.open_rate}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Taxa de Clique</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.metrics.click_rate}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics.metrics.conversion_rate}%</p>
                </div>
              </div>
            </div>

            {/* Performance por Dispositivo */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Performance por Dispositivo</h3>
              <div className="space-y-3">
                {Object.entries(analytics.device_breakdown).map(([device, percentage]) => (
                  <div key={device} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{device}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance por Localização */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Performance por Localização</h3>
              <div className="space-y-3">
                {Object.entries(analytics.location_breakdown).map(([location, percentage]) => (
                  <div key={location} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{location}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receita Atribuída */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Impacto Financeiro</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-600">Receita Atribuída</p>
                <p className="text-3xl font-bold text-green-700">
                  CHF {(analytics.revenue_attribution * 0.18)?.toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-600 mt-1">Últimos 30 dias</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'campaigns', label: 'Campanhas', icon: Send },
    { id: 'templates', label: 'Templates', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'preferences', label: 'Configurações', icon: Settings }
  ];

  return (
    <DashboardLayout title="Central de Comunicação" className={className}>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'campaigns' && renderCampaigns()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'templates' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Templates de Notificação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">{template.type}</span>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'preferences' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configurações de Comunicação</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Preferências de Envio</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Otimização de Horário</p>
                        <p className="text-sm text-gray-500">Enviar nos melhores horários para cada usuário</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Personalização Automática</p>
                        <p className="text-sm text-gray-500">Personalizar conteúdo baseado no comportamento</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Teste A/B Automático</p>
                        <p className="text-sm text-gray-500">Testar automaticamente variações de conteúdo</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};