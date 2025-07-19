import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';

export default function Vouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ DECLARAÇÃO CORRETA - loadData PRIMEIRO
  const loadData = useCallback(async () => {
    console.log('🔄 Iniciando loadData...');
    setLoading(true);
    
    try {
      console.log('📦 Criando vouchers demo...');
      
      // VOUCHERS DEMO
      const demoVouchers = [
        {
          id: 'demo-1',
          code: 'WELCOME50',
          title: '50% de Desconto - Bem-vindo!',
          description: 'Desconto especial para novos usuários',
          discount_type: 'percentage',
          discount_value: 50,
          min_purchase_amount: 25.00,
          max_discount_amount: 100.00,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
          used_at: null,
          merchant: {
            name: 'Restaurante Demo',
            logo: '🍕'
          }
        },
        {
          id: 'demo-2',
          code: 'SAVE20',
          title: 'CHF 3.60 de Desconto',
    description: 'Válido em compras acima de CHF 14.50',
          discount_type: 'fixed',
          discount_value: 20,
          min_purchase_amount: 80.00,
          max_discount_amount: 20.00,
          expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
          used_at: null,
          merchant: {
            name: 'Loja Fashion',
            logo: '👕'
          }
        },
        {
          id: 'demo-3',
          code: 'USADO123',
          title: 'Voucher Já Usado',
          description: 'Este voucher já foi utilizado',
          discount_type: 'percentage',
          discount_value: 30,
          min_purchase_amount: 50.00,
          max_discount_amount: 75.00,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: false,
          used_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          merchant: {
            name: 'Café Gourmet',
            logo: '☕'
          }
        }
      ];
      
      console.log('⏳ Simulando delay...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Setando vouchers:', demoVouchers.length);
      setVouchers(demoVouchers);
      
    } catch (error) {
      console.error('❌ Erro no loadData:', error);
      setVouchers([]);
    } finally {
      console.log('🏁 Finalizando loadData, setLoading(false)');
      setLoading(false);
    }
  }, []);

  // ✅ useEffect DEPOIS da declaração do loadData 
  useEffect(() => {
    console.log('🚀 useEffect executando, chamando loadData...');
    loadData();
  }, [loadData]);

  console.log('🖥️ Renderizando. Loading:', loading, 'Vouchers:', vouchers.length);

  return (
    <DashboardLayout title="Meus Vouchers">
      <div className="max-w-4xl mx-auto">
        

        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Carregando vouchers...</div>
          </div>
        )}
        
        {!loading && vouchers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum voucher encontrado</p>
          </div>
        )}
        
        {!loading && vouchers.length > 0 && (
          <div className="grid gap-4">
            {vouchers.map(voucher => (
              <div key={voucher.id} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{voucher.title}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {voucher.code}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-2">{voucher.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {voucher.merchant.logo} {voucher.merchant.name}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    voucher.used_at
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {voucher.used_at ? '✅ Usado' : '🟢 Disponível'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}