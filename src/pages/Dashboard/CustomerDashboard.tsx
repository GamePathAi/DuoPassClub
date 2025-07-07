import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Gift, ShoppingBag, Users, QrCode, Eye, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Voucher, Offer } from '../../types';
import { supabase } from '../../lib/supabase';
import DuoPassLogo from '../../assets/duopass_logo.svg';
import { ETicket } from '../../components/ETicket';
import { DuoPassConnect } from '../../components/connect/DuoPassConnect';

export function CustomerDashboard() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vouchers' | 'offers' | 'connect'>('vouchers');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showETicket, setShowETicket] = useState(false);

  // Handle query parameters for tab selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['vouchers', 'offers', 'connect'].includes(tabParam)) {
      setActiveTab(tabParam as 'vouchers' | 'offers' | 'connect');
    }
  }, [location.search]);

  const loadUserVouchers = useCallback(async () => {
    if (!user) {
      return;
    }
    
    // Se for usuário demo, usar dados mock
    if (user.id === 'demo-user-id') {
      const mockVouchers = [
        {
          id: 'voucher-1',
          user_id: 'demo-user-id',
          voucher_code: 'DEMO001',
          status: 'active',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias no futuro
          used_at: null
        },
        {
          id: 'voucher-2',
          user_id: 'demo-user-id',
          voucher_code: 'DEMO002',
          status: 'used',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
          expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          used_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // usado 1 dia atrás
        },
        {
          id: 'voucher-3',
          user_id: 'demo-user-id',
          voucher_code: 'DEMO003',
          status: 'expired',
          created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 dias atrás
          expires_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // expirou 5 dias atrás
          used_at: null
        }
      ];
      setVouchers(mockVouchers);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar vouchers:', error);
        return;
      }

      setVouchers(data || []);
    } catch (error: unknown) {
      console.error('Erro ao carregar vouchers:', error);
    }
  }, [user]);

  const loadAvailableOffers = useCallback(async () => {
    // Se for usuário demo, usar dados mock
    if (user?.id === 'demo-user-id') {
      const mockOffers = [
        {
          id: 'offer-1',
          title: 'Desconto 50% em Pizza',
          description: 'Aproveite 50% de desconto em qualquer pizza grande da nossa pizzaria. Válido de segunda a quinta-feira.',
          original_value: 45.90,
          category: 'Alimentação',
          is_active: true,
          expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias no futuro
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'offer-2',
          title: 'Massagem Relaxante',
          description: 'Sessão de massagem relaxante de 60 minutos com desconto especial para novos clientes.',
          original_value: 120.00,
          category: 'Bem-estar',
          is_active: true,
          expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'offer-3',
          title: 'Corte + Barba',
          description: 'Corte de cabelo masculino + barba feita com navalha. Inclui lavagem e finalização.',
          original_value: 35.00,
          category: 'Beleza',
          is_active: true,
          expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'offer-4',
          title: 'Aula de Yoga',
          description: 'Pacote com 4 aulas de yoga para iniciantes. Inclui tapete e acompanhamento personalizado.',
          original_value: 80.00,
          category: 'Fitness',
          is_active: true,
          expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setOffers(mockOffers);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erro ao carregar ofertas:', error);
        return;
      }

      setOffers(data || []);
    } catch (error: unknown) {
      console.error('Erro ao carregar ofertas:', error);
    }
  }, [user]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUserVouchers(),
        loadAvailableOffers()
      ]);
    } catch (error: unknown) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [loadUserVouchers, loadAvailableOffers]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: unknown) {
      console.error('Erro ao fazer logout:', error);
    }
  };

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
        return status;
    }
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
          <DuoPassLogo className="mx-auto mb-4 h-16 w-auto" fill="currentColor" />
          <p className="text-[#333333] font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <DuoPassLogo className="h-12 w-auto" fill="currentColor" />
              <div>
                <h1 className="text-2xl font-bold text-[#333333]">Meu Dashboard</h1>
                <p className="text-gray-600">Bem-vindo, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('vouchers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vouchers'
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Gift className="h-5 w-5 inline mr-2" />
                Meus Vouchers
              </button>
              <button
                onClick={() => setActiveTab('offers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'offers'
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ShoppingBag className="h-5 w-5 inline mr-2" />
                Ofertas Disponíveis
              </button>
              <button
                onClick={() => setActiveTab('connect')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'connect'
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                DUO PASS Connect
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'vouchers' && (
          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-6">Meus Vouchers</h2>
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

        {activeTab === 'offers' && (
          <div>
            <h2 className="text-xl font-semibold text-[#333333] mb-6">Ofertas Disponíveis</h2>
            {offers.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma oferta disponível no momento</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-[#333333] mb-2">{offer.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Valor:</span>
                        <span className="font-medium text-[#FF6B35]">
                          {formatCurrency(offer.original_value)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Categoria:</span>
                        <span>{offer.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Expira em:</span>
                        <span>{formatDate(offer.expires_at)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/offer/${offer.id}`)}
                      className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Ver Detalhes
                    </button>
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
    </div>
  );
}