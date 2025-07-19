import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Eye, Trash2, Filter, Search, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
// Removed unused imports
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AnalyticsService } from '../services/analyticsService';

import { VoucherWithOffer } from '../types/voucher';

type VoucherStatus = 'active' | 'used' | 'expired' | 'all';

import DashboardLayout from '../components/Layout/DashboardLayout';

export default function MyVouchers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // 1. Estados primeiro
  const [vouchers, setVouchers] = useState<VoucherWithOffer[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<VoucherWithOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<VoucherStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');



  const loadVouchers = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: vouchersData, error } = await supabase
        .from('vouchers')
        .select(`
          *,
          offer:offers (*, merchant:users!merchant_id(business_name, contact_info))
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar vouchers:', error);
        setVouchers([]);
        return;
      }

      if (vouchersData) {
        // The data should already be in the correct VoucherWithOffer structure
        setVouchers(vouchersData as VoucherWithOffer[]);
      } else {
        setVouchers([]);
      }
    } catch (err) {
      console.error('Erro crítico ao carregar vouchers:', err);
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const filterVouchers = useCallback(() => {
    let filtered = vouchers;

    // Filtrar por status
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'expired') {
        filtered = filtered.filter(v => {
          const isExpired = new Date(v.expires_at) <= new Date();
          return isExpired && v.status !== 'used';
        });
      } else {
        filtered = filtered.filter(v => {
          if (selectedStatus === 'active') {
            const isExpired = new Date(v.expires_at) <= new Date();
            return v.status === 'active' && !isExpired;
          }
          return v.status === selectedStatus;
        });
      }
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.offer?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.offer?.merchant?.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.voucher_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredVouchers(filtered);
  }, [vouchers, selectedStatus, searchTerm]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  useEffect(() => {
    filterVouchers();
  }, [filterVouchers]);



  const getVoucherStatus = (voucher: VoucherWithOffer) => {
    if (voucher.status === 'used') return 'used';
    if (new Date(voucher.expires_at) <= new Date()) return 'expired';
    return 'active';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'used':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'used':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewVoucher = (voucher: VoucherWithOffer) => {
    const status = getVoucherStatus(voucher);
    if (status === 'active') {
      navigate(`/voucher/${voucher.id}/active`);
    } else {
      // Para vouchers disponíveis, usados ou expirados, mostrar página de detalhes
      navigate(`/voucher/${voucher.id}`);
    }
  };

  const deleteVoucher = async (voucherId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este voucher?')) {
      try {
        const { error } = await supabase
          .from('vouchers')
          .delete()
          .eq('id', voucherId);

        if (!error) {
          setVouchers(vouchers.filter(v => v.id !== voucherId));
        }
      } catch (error) {
        console.error('Erro ao excluir voucher:', error);
        // Para demo, apenas remove da lista local
        setVouchers(vouchers.filter(v => v.id !== voucherId));
      }
    }
  };

  const getVoucherCounts = () => {
    const active = vouchers.filter(v => {
      const isExpired = new Date(v.expires_at) <= new Date();
      return v.status === 'active' && !isExpired;
    }).length;
    
    const used = vouchers.filter(v => v.status === 'used').length;
    
    const expired = vouchers.filter(v => {
      const isExpired = new Date(v.expires_at) <= new Date();
      return isExpired && v.status !== 'used';
    }).length;

    return { active, used, expired, total: vouchers.length };
  };

  if (loading) {
    return (
      <DashboardLayout title="Meus Vouchers">
        <div className="flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C91F1F] mx-auto mb-4"></div>
            <p className="text-[#333333] font-medium">Carregando seus vouchers...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const counts = getVoucherCounts();

  return (
    <DashboardLayout title="Meus Vouchers" subtitle="Gerencie todos os seus vouchers em um só lugar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <div className="text-2xl font-bold text-[#333333]">{counts.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
            <div className="text-2xl font-bold text-green-600">{counts.active}</div>
            <div className="text-sm text-green-700">Ativos</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{counts.used}</div>
            <div className="text-sm text-blue-700">Usados</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
            <div className="text-2xl font-bold text-red-600">{counts.expired}</div>
            <div className="text-sm text-red-700">Expirados</div>
          </div>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white rounded-xl border-2 border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por título, estabelecimento ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F6C100] focus:outline-none"
                />
              </div>
            </div>
            
            {/* Filtro por status */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as VoucherStatus)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F6C100] focus:outline-none bg-white"
              >
                <option value="all">Todos ({counts.total})</option>
                <option value="active">Ativos ({counts.active})</option>
                <option value="used">Usados ({counts.used})</option>
                <option value="expired">Expirados ({counts.expired})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de vouchers */}
        {filteredVouchers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#333333] mb-2">
              {searchTerm || selectedStatus !== 'all' ? 'Nenhum voucher encontrado' : 'Você ainda não tem vouchers'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Explore nossas ofertas e resgate seu primeiro voucher!'}
            </p>
            {!searchTerm && selectedStatus === 'all' && (
              <button
                onClick={() => {
                  AnalyticsService.trackFunnelStep('offer_conversion', 'visualization');
                  navigate('/experiencias');
                }}
                className="bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Ver Ofertas
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVouchers.map((voucher) => {
              const status = getVoucherStatus(voucher);
              const discountedPrice = (voucher.offer?.original_value || 0) * 0.5;
              
              return (
                <div
                  key={voucher.id}
                  className={`bg-white rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                    status === 'active' 
                      ? 'border-green-200 hover:border-green-300' 
                      : status === 'used'
                      ? 'border-blue-200 hover:border-blue-300'
                      : 'border-red-200 hover:border-red-300'
                  }`}
                >
                  {/* Imagem */}
                  {voucher.offer?.image_url && (
                    <div className="h-48 bg-gray-200 overflow-hidden relative">
                      <img
                        src={voucher.offer.image_url}
                        alt={voucher.offer.title}
                        className={`w-full h-full object-cover ${
                          status !== 'active' ? 'opacity-60' : ''
                        }`}
                      />
                      <div className="absolute top-3 left-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${
                          getStatusColor(status)
                        }`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(status)}
                            {getStatusText(status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Conteúdo */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-[#333333] mb-2 line-clamp-2">
                        {voucher.offer?.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {voucher.offer?.merchant?.business_name}
                      </p>
                      
                      {/* Preço */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-green-600">
                          CHF {discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          CHF {voucher.offer?.original_value.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Informações do voucher */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                          {voucher.voucher_code}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {status === 'used' && voucher.used_at
                            ? `Usado em ${new Date(voucher.used_at).toLocaleDateString()}`
                            : `Expira em ${new Date(voucher.expires_at).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                      
                      {voucher.offer?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{voucher.offer.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Ações */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewVoucher(voucher)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                          status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        {status === 'active' ? 'Usar' : 'Ver'}
                      </button>
                      
                      {status !== 'active' && (
                        <button
                          onClick={() => deleteVoucher(voucher.id)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Excluir voucher"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}