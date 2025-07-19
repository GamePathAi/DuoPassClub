import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DebugInfo {
  user: object | null;
  session: object | null;
  profile: object | null;
  vouchers: object[];
  offers: object[];
  errors: string[];
}

export default function DebugPanel() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    user: null,
    session: null,
    profile: null,
    vouchers: [],
    offers: [],
    errors: []
  });
  const [isVisible, setIsVisible] = useState(false);

  const runDebug = async () => {
    const errors: string[] = [];
    const info: Partial<DebugInfo> = { errors };

    try {
      // 1. Verificar usuário
      const userResult = await supabase.auth.getUser();
      info.user = userResult.data.user;
      
      // 2. Verificar sessão
      const sessionResult = await supabase.auth.getSession();
      info.session = sessionResult.data.session;

      // 3. Verificar profile
      if (info.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', info.user.id);
        
        info.profile = profile?.[0] || null;
        if (profileError) errors.push(`Profile Error: ${profileError.message}`);
      }

      // 4. Verificar vouchers
      const { data: vouchers, error: vouchersError } = await supabase
        .from('vouchers')
        .select('*');
      
      info.vouchers = vouchers || [];
      if (vouchersError) errors.push(`Vouchers Error: ${vouchersError.message}`);

      // 5. Verificar ofertas
      const { data: offers, error: offersError } = await supabase
        .from('offers')
        .select('*');
      
      info.offers = offers || [];
      if (offersError) errors.push(`Offers Error: ${offersError.message}`);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Critical Error: ${errorMessage}`);
    }

    setDebugInfo(info as DebugInfo);
  };

  useEffect(() => {
    if (user) {
      runDebug();
    }
  }, [user]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🐛 Debug Panel - Botões Inativos</h2>
          <div className="flex gap-2">
            <button
              onClick={runDebug}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              ✕ Fechar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Errors */}
          {debugInfo.errors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <h3 className="font-bold">❌ Erros Encontrados:</h3>
              <ul className="list-disc list-inside">
                {debugInfo.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* User Info */}
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-bold mb-2">👤 Usuário:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify({
                id: debugInfo.user?.id,
                email: debugInfo.user?.email,
                hasSession: !!debugInfo.session
              }, null, 2)}
            </pre>
          </div>

          {/* Profile Info */}
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-bold mb-2">👤 Profile:</h3>
            <pre className="text-sm overflow-auto">
              {debugInfo.profile ? JSON.stringify(debugInfo.profile, null, 2) : 'NULL - Profile não encontrado!'}
            </pre>
          </div>

          {/* Vouchers */}
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="font-bold mb-2">🎫 Vouchers ({debugInfo.vouchers.length}):</h3>
            <pre className="text-sm overflow-auto max-h-32">
              {debugInfo.vouchers.length > 0 ? JSON.stringify(debugInfo.vouchers, null, 2) : 'VAZIO - Nenhum voucher encontrado!'}
            </pre>
          </div>

          {/* Offers */}
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-bold mb-2">🎯 Ofertas ({debugInfo.offers.length}):</h3>
            <pre className="text-sm overflow-auto max-h-32">
              {debugInfo.offers.length > 0 ? JSON.stringify(debugInfo.offers, null, 2) : 'VAZIO - Nenhuma oferta encontrada!'}
            </pre>
          </div>

          {/* Diagnóstico */}
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">🔍 Diagnóstico:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li className={debugInfo.user ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.user ? '✅ Usuário autenticado' : '❌ Usuário não autenticado'}
              </li>
              <li className={debugInfo.profile ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.profile ? '✅ Profile encontrado' : '❌ Profile não encontrado - POSSÍVEL CAUSA!'}
              </li>
              <li className={debugInfo.vouchers.length > 0 ? 'text-green-600' : 'text-yellow-600'}>
                {debugInfo.vouchers.length > 0 ? '✅ Vouchers disponíveis' : '⚠️ Nenhum voucher - Dados vazios'}
              </li>
              <li className={debugInfo.offers.length > 0 ? 'text-green-600' : 'text-yellow-600'}>
                {debugInfo.offers.length > 0 ? '✅ Ofertas disponíveis' : '⚠️ Nenhuma oferta - Dados vazios'}
              </li>
            </ul>
          </div>

          {/* Soluções */}
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-bold mb-2">🔧 Soluções Sugeridas:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {!debugInfo.profile && (
                <li className="text-red-600">🚨 CRIAR PROFILE: Usuário sem profile - botões podem estar desabilitados</li>
              )}
              {debugInfo.vouchers.length === 0 && (
                <li className="text-yellow-600">📝 ADICIONAR VOUCHERS DE TESTE</li>
              )}
              {debugInfo.offers.length === 0 && (
                <li className="text-yellow-600">📝 ADICIONAR OFERTAS DE TESTE</li>
              )}
              {debugInfo.errors.length > 0 && (
                <li className="text-red-600">🔒 VERIFICAR RLS POLICIES NO SUPABASE</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}