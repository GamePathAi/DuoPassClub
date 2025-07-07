import React, { useState, useEffect, useCallback } from 'react';

export function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ DECLARAÇÃO CORRETA - loadHistory PRIMEIRO
  const loadHistory = useCallback(async () => {
    console.log('🔄 Iniciando loadHistory...');
    setLoading(true);
    
    try {
      console.log('📦 Criando histórico demo...');
      
      // HISTÓRICO DEMO
      const demoHistory = [
        {
          id: 'hist-1',
          type: 'voucher_used',
          title: 'Voucher Utilizado',
          description: 'Você usou o voucher WELCOME50 e economizou CHF 8.10',
          amount_saved: 45.00,
          voucher_code: 'WELCOME50',
          merchant_name: 'Restaurante Demo',
          merchant_logo: '🍕',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
          status: 'completed'
        },
        {
          id: 'hist-2',
          type: 'voucher_received',
          title: 'Novo Voucher Recebido',
          description: 'Você ganhou um voucher de 20% de desconto na Loja Fashion',
          amount_saved: 0,
          voucher_code: 'FASHION20',
          merchant_name: 'Loja Fashion',
          merchant_logo: '👕',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
          status: 'received'
        },
        {
          id: 'hist-3',
          type: 'voucher_used',
          title: 'Voucher Utilizado',
          description: 'Você usou o voucher SAVE20 e economizou CHF 3.60',
          amount_saved: 20.00,
          voucher_code: 'SAVE20',
          merchant_name: 'Café Gourmet',
          merchant_logo: '☕',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
          status: 'completed'
        },
        {
          id: 'hist-4',
          type: 'voucher_expired',
          title: 'Voucher Expirado',
          description: 'O voucher EXPIRED99 expirou sem ser utilizado',
          amount_saved: 0,
          voucher_code: 'EXPIRED99',
          merchant_name: 'Supermercado Local',
          merchant_logo: '🛒',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias atrás
          status: 'expired'
        },
        {
          id: 'hist-5',
          type: 'voucher_used',
          title: 'Voucher Utilizado',
          description: 'Você usou o voucher FIRST30 e economizou CHF 6.30',
          amount_saved: 35.00,
          voucher_code: 'FIRST30',
          merchant_name: 'Farmácia Central',
          merchant_logo: '💊',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias atrás
          status: 'completed'
        },
        {
          id: 'hist-6',
          type: 'account_created',
          title: 'Conta Criada',
          description: 'Bem-vindo ao DuoPass Club! Sua conta foi criada com sucesso',
          amount_saved: 0,
          voucher_code: null,
          merchant_name: 'DuoPass Club',
          merchant_logo: '🎉',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias atrás
          status: 'completed'
        }
      ];
      
      console.log('⏳ Simulando delay...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log('✅ Setando histórico:', demoHistory.length);
      setHistory(demoHistory);
      
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
    <div className="min-h-screen bg-gray-50 p-4 pt-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Histórico</h1>
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
    </div>
  );
}