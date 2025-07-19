import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ DECLARAÇÃO CORRETA - loadHistory PRIMEIRO
  const loadHistory = useCallback(async () => {
    console.log('🔄 Iniciando loadHistory...');
    setLoading(true);
    
    try {
      console.log('📦 Criando histórico demo...');
      
      // TODO: Implementar a busca do histórico do Supabase
      // Por enquanto, retornamos um array vazio para garantir que não haja dados mock.
      console.log('✅ Histórico mock removido. Setando array vazio.');
      setHistory([]);
      
    } catch (error) {
      console.error('❌ Erro no loadHistory:', error);
      setHistory([]);
    } finally {
      console.log('🏁 Finalizando loadHistory, setLoading(false)');
      setLoading(false);
    }
  }, []);

  // ✅ useEffect DEPOIS da declaração do loadHistory 
  useEffect(() => {
    console.log('🚀 useEffect executando, chamando loadHistory...');
    loadHistory();
  }, [loadHistory]);

  // Helper function para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} semanas atrás`;
    return `${Math.ceil(diffDays / 30)} meses atrás`;
  };

  // Helper function para cor do status
  const getStatusColor = (type, status) => {
    if (type === 'voucher_used' && status === 'completed') return 'bg-green-100 text-green-800';
    if (type === 'voucher_received') return 'bg-blue-100 text-blue-800';
    if (type === 'voucher_expired') return 'bg-red-100 text-red-800';
    if (type === 'account_created') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Helper function para ícone do tipo
  const getTypeIcon = (type) => {
    switch(type) {
      case 'voucher_used': return '✅';
      case 'voucher_received': return '🎁';
      case 'voucher_expired': return '⏰';
      case 'account_created': return '🎉';
      default: return '📋';
    }
  };

  console.log('🖥️ Renderizando. Loading:', loading, 'History:', history.length);

  const totalSaved = history.reduce((total, item) => total + (item.amount_saved || 0), 0);

  return (
    <DashboardLayout title="Histórico">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-600">Acompanhe todas as suas atividades no DuoPass Club</p>
        </div>
        


        {/* STATS CARD */}
        {!loading && history.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md border mb-6">
            <h2 className="text-lg font-semibold mb-4">Resumo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">CHF {(totalSaved * 0.18).toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Economizado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {history.filter(h => h.type === 'voucher_used').length}
                </div>
                <div className="text-sm text-gray-600">Vouchers Usados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{history.length}</div>
                <div className="text-sm text-gray-600">Total de Atividades</div>
              </div>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Carregando histórico...</div>
          </div>
        )}
        
        {!loading && history.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhuma atividade encontrada</p>
          </div>
        )}
        
        {!loading && history.length > 0 && (
          <div className="space-y-4">
            {history.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(item.type, item.status)}`}>
                    {item.status === 'completed' ? 'Concluído' :
                     item.status === 'received' ? 'Recebido' :
                     item.status === 'expired' ? 'Expirado' : item.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {item.merchant_name && (
                      <span>{item.merchant_logo} {item.merchant_name}</span>
                    )}
                    {item.voucher_code && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {item.voucher_code}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    {item.amount_saved > 0 && (
                      <span className="text-green-600 font-semibold">
                        +CHF {(item.amount_saved * 0.18).toFixed(2)} economizado
                      </span>
                    )}
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}