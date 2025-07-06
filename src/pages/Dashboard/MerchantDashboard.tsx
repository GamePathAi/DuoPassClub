import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Eye, QrCode, BarChart3, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Offer, Voucher, UsageReport } from '../../types';
import { supabase } from '../../lib/supabase';
import { ReactComponent as DuoPassLogo } from '../../assets/duopass_logo.svg';
import { QRScanner } from '../../components/QRScanner';
import { VoucherService } from '../../lib/voucherService';

export function MerchantDashboard() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'offers' | 'vouchers' | 'reports'>('offers');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [recentVouchers, setRecentVouchers] = useState<Voucher[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<UsageReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<UsageReport | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    original_value: '',
    category: '',
    location: '',
    expires_at: '',
    terms_conditions: '',
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  const loadDashboardData = useCallback(async () => {
    await Promise.all([
      fetchOffers(),
      loadRecentVouchers(),
      loadReports()
    ]);
  }, [fetchOffers, loadRecentVouchers, loadReports]);

  const loadRecentVouchers = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select(`
          *,
          user:users(full_name, email)
        `)
        .eq('merchant_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentVouchers(data || []);
    } catch (error: unknown) {
      console.error('Erro ao carregar vouchers:', error);
    }
  }, [user]);

  const loadReports = useCallback(async () => {
    if (!user) return;
    try {
      const [weekly, monthly] = await Promise.all([
        VoucherService.generateUsageReport('weekly'),
        VoucherService.generateUsageReport('monthly')
      ]);
      setWeeklyReport(weekly);
      setMonthlyReport(monthly);
    } catch (error: unknown) {
      console.error('Erro ao carregar relatórios:', error);
    }
  }, [user]);

  const handleVoucherValidated = (voucher: Voucher) => {
    // Atualizar lista de vouchers recentes
    setRecentVouchers(prev => [voucher, ...prev.slice(0, 9)]);
    // Recarregar relatórios
    loadReports();
  };

  const fetchOffers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('merchant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error: unknown) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from('offers').insert([
        {
          merchant_id: user?.id,
          title: formData.title,
          description: formData.description,
          original_value: parseFloat(formData.original_value),
          category: formData.category,
          location: formData.location,
          expires_at: formData.expires_at,
          terms_conditions: formData.terms_conditions,
          is_active: true,
        },
      ]);

      if (error) throw error;

      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        original_value: '',
        category: '',
        location: '',
        expires_at: '',
        terms_conditions: '',
      });
      fetchOffers();
    } catch (error: unknown) {
      console.error('Error creating offer:', error);
      alert('Erro ao criar oferta. Tente novamente.');
    }
  };

  const toggleOfferStatus = async (offerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ is_active: !currentStatus })
        .eq('id', offerId);

      if (error) throw error;
      fetchOffers();
    } catch (error: unknown) {
      console.error('Error updating offer:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="flex items-center justify-center mx-auto mb-4 animate-pulse">
            <DuoPassLogo className="h-16 w-auto" fill="currentColor" />
          </div>
          <p className="text-[#333333] font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#333333]">Dashboard do Comerciante</h1>
            <p className="text-gray-600 mt-2 text-lg">Gerencie ofertas, valide vouchers e visualize relatórios</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowQRScanner(true)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all"
            >
              <QrCode className="w-5 h-5" />
              <span>Escanear QR</span>
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Oferta</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'offers', label: 'Ofertas', icon: Eye },
            { id: 'vouchers', label: 'Vouchers', icon: QrCode },
            { id: 'reports', label: 'Relatórios', icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'offers' | 'vouchers' | 'reports')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-[#333333] shadow-sm'
                  : 'text-gray-600 hover:text-[#333333] hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-[#F5F3EF]">
            <h3 className="text-lg font-bold text-[#333333] mb-2">Total de Ofertas</h3>
            <p className="text-3xl font-bold text-[#F6C100]">{offers.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-[#F5F3EF]">
            <h3 className="text-lg font-bold text-[#333333] mb-2">Ofertas Ativas</h3>
            <p className="text-3xl font-bold text-[#C91F1F]">
              {offers.filter(o => o.is_active).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-[#F5F3EF]">
            <h3 className="text-lg font-bold text-[#333333] mb-2">Vouchers Ativos</h3>
            <p className="text-3xl font-bold text-blue-600">
              {recentVouchers.filter(v => v.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-[#F5F3EF]">
            <h3 className="text-lg font-bold text-[#333333] mb-2">Vouchers Usados</h3>
            <p className="text-3xl font-bold text-green-600">
              {recentVouchers.filter(v => v.status === 'used').length}
            </p>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'offers' && (
          <OffersTab 
            offers={offers} 
            setShowCreateForm={setShowCreateForm}
            toggleOfferStatus={toggleOfferStatus}
          />
        )}

        {activeTab === 'vouchers' && (
          <VouchersTab 
            recentVouchers={recentVouchers}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab 
            weeklyReport={weeklyReport}
            monthlyReport={monthlyReport}
          />
        )}

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <QRScanner
            merchantId={user?.id || ''}
            onClose={() => setShowQRScanner(false)}
            onVoucherValidated={handleVoucherValidated}
          />
        )}

        {/* Create Offer Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <h3 className="text-2xl font-bold text-[#333333] mb-8">Criar Nova Oferta</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#333333] mb-2">
                    Título da Oferta
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] transition-all"
                    placeholder="Ex: Almoço executivo - Pague 1, Leve 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#333333] mb-2">
                    Descrição
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] transition-all"
                    placeholder="Descreva os detalhes da oferta..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Valor Original (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.original_value}
                      onChange={(e) => setFormData({ ...formData, original_value: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] transition-all"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Categoria
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] transition-all"
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="gastronomy">Gastronomia</option>
                      <option value="beauty">Beleza</option>
                      <option value="leisure">Lazer</option>
                      <option value="fitness">Fitness</option>
                      <option value="shopping">Compras</option>
                      <option value="services">Serviços</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Localização
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] transition-all"
                      placeholder="Ex: Centro, São Paulo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      Data de Expiração
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#333333] mb-2">
                    Termos e Condições
                  </label>
                  <textarea
                    required
                    value={formData.terms_conditions}
                    onChange={(e) => setFormData({ ...formData, terms_conditions: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] transition-all"
                    placeholder="Descreva os termos e condições da oferta..."
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-[#333333] font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Criar Oferta
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Tab Components
const OffersTab = ({ offers, setShowCreateForm, toggleOfferStatus }: {
  offers: Offer[];
  setShowCreateForm: (show: boolean) => void;
  toggleOfferStatus: (id: string, isActive: boolean) => void;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border-2 border-[#F5F3EF]">
    <div className="p-8 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-[#333333]">Suas Ofertas</h2>
    </div>
    
    {offers.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F5F3EF]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Oferta
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Expira em
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-[#F5F3EF] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-[#333333]">{offer.title}</div>
                    <div className="text-sm text-gray-500">{offer.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white">
                    {offer.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333333]">
                  R$ {offer.original_value.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    offer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {offer.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                  {new Date(offer.expires_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button className="text-[#F6C100] hover:text-[#C91F1F] transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-[#C91F1F] hover:text-[#333333] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleOfferStatus(offer.id, offer.is_active)}
                      className="text-green-600 hover:text-green-800 transition-colors font-medium"
                    >
                      {offer.is_active ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="p-16 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center mx-auto mb-6">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <p className="text-[#333333] text-xl font-medium mb-4">Você ainda não criou nenhuma oferta.</p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="text-[#C91F1F] hover:text-[#F6C100] font-semibold transition-colors"
        >
          Criar sua primeira oferta
        </button>
      </div>
    )}
  </div>
);

const VouchersTab = ({ recentVouchers }: { recentVouchers: Voucher[] }) => (
  <div className="bg-white rounded-2xl shadow-sm border-2 border-[#F5F3EF]">
    <div className="p-8 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-[#333333]">Vouchers Recentes</h2>
    </div>
    
    {recentVouchers.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F5F3EF]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Data de Uso
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#333333] uppercase tracking-wider">
                Validade
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentVouchers.map((voucher) => (
              <tr key={voucher.id} className="hover:bg-[#F5F3EF] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-[#333333]">{voucher.customer_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-[#333333]">{voucher.unique_code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    voucher.is_used ? 'bg-green-100 text-green-800' : 
                    new Date(voucher.expires_at) < new Date() ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {voucher.is_used ? 'Usado' : 
                     new Date(voucher.expires_at) < new Date() ? 'Expirado' : 'Ativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                  {voucher.used_at ? new Date(voucher.used_at).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                  {new Date(voucher.expires_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="p-16 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center mx-auto mb-6">
          <QrCode className="w-8 h-8 text-white" />
        </div>
        <p className="text-[#333333] text-xl font-medium mb-4">Nenhum voucher foi usado ainda.</p>
        <p className="text-gray-500">Os vouchers validados aparecerão aqui.</p>
      </div>
    )}
  </div>
);

const ReportsTab = ({ weeklyReport, monthlyReport }: {
  weeklyReport: UsageReport | null;
  monthlyReport: UsageReport | null;
}) => (
  <div className="space-y-8">
    {/* Weekly Report */}
    <div className="bg-white rounded-2xl shadow-sm border-2 border-[#F5F3EF]">
      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-[#333333]">Relatório Semanal</h2>
      </div>
      
      {weeklyReport ? (
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total de Usos</p>
                  <p className="text-3xl font-bold">{weeklyReport.total_usage}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-white/80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Clientes Únicos</p>
                  <p className="text-3xl font-bold">{weeklyReport.unique_customers}</p>
                </div>
                <Users className="w-8 h-8 text-white/80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Período</p>
                  <p className="text-lg font-bold">
                    {new Date(weeklyReport.start_date).toLocaleDateString()} - {new Date(weeklyReport.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {weeklyReport.top_customers.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-[#333333] mb-4">Top Clientes</h3>
              <div className="space-y-3">
                {weeklyReport.top_customers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#F5F3EF] rounded-lg">
                    <span className="font-medium text-[#333333]">{customer.customer_name}</span>
                    <span className="text-[#C91F1F] font-bold">{customer.usage_count} usos</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-16 text-center">
          <p className="text-[#333333] text-xl font-medium">Carregando relatório semanal...</p>
        </div>
      )}
    </div>
    
    {/* Monthly Report */}
    <div className="bg-white rounded-2xl shadow-sm border-2 border-[#F5F3EF]">
      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-[#333333]">Relatório Mensal</h2>
      </div>
      
      {monthlyReport ? (
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Total de Usos</p>
                  <p className="text-3xl font-bold">{monthlyReport.total_usage}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-white/80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Clientes Únicos</p>
                  <p className="text-3xl font-bold">{monthlyReport.unique_customers}</p>
                </div>
                <Users className="w-8 h-8 text-white/80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Período</p>
                  <p className="text-lg font-bold">
                    {new Date(monthlyReport.start_date).toLocaleDateString()} - {new Date(monthlyReport.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {monthlyReport.top_customers.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-[#333333] mb-4">Top Clientes</h3>
              <div className="space-y-3">
                {monthlyReport.top_customers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#F5F3EF] rounded-lg">
                    <span className="font-medium text-[#333333]">{customer.customer_name}</span>
                    <span className="text-[#C91F1F] font-bold">{customer.usage_count} usos</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-16 text-center">
          <p className="text-[#333333] text-xl font-medium">Carregando relatório mensal...</p>
        </div>
      )}
    </div>
  </div>
);