import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface TestResult {
  table: string;
  count: number;
  error?: string;
  sampleData?: Record<string, unknown>[];
}

export const SupabaseTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    console.log('🔍 [TEST] Iniciando teste de conexão com Supabase...');
    
    // Verificar variáveis de ambiente primeiro
    console.log('🔍 [TEST] Verificando variáveis de ambiente...');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('🔍 [TEST] VITE_SUPABASE_URL:', supabaseUrl ? '✅ Definida' : '❌ Não definida');
    console.log('🔍 [TEST] VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Definida' : '❌ Não definida');
    console.log('🔍 [TEST] URL completa:', supabaseUrl);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ [TEST] Variáveis de ambiente não configuradas!');
      setResults([{
        table: 'ENV_CHECK',
        count: 0,
        error: 'Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidas'
      }]);
      setLoading(false);
      return;
    }
    
    const testResults: TestResult[] = [];

    // Teste básico de conectividade com timeout
    console.log('🔍 [TEST] Testando conectividade básica...');
    try {
      const connectivityTest = Promise.race([
        supabase.from('offers').select('count').limit(1),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de conectividade básica (5s)')), 5000)
        )
      ]);
      
      const basicTest = await connectivityTest;
      console.log('✅ [TEST] Conectividade básica OK:', basicTest);
      
      testResults.push({
        table: 'CONNECTIVITY_TEST',
        count: 1,
        sampleData: [{ status: 'OK', latency: '< 5s' }]
      });
    } catch (connectError) {
      console.error('❌ [TEST] Falha na conectividade básica:', connectError);
      testResults.push({
        table: 'CONNECTIVITY_TEST',
        count: 0,
        error: connectError instanceof Error ? connectError.message : 'Erro de conectividade'
      });
      
      // Se a conectividade básica falha, não adianta testar as tabelas
      setResults(testResults);
      setLoading(false);
      return;
    }

    // Testar tabelas principais
    const tables = ['offers', 'cultural_experiences', 'categories', 'users'];

    for (const table of tables) {
      try {
        console.log(`🔍 [TEST] Testando tabela: ${table}`);
        
        // Contar registros com timeout
        const countPromise = supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        const countTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout ao contar ${table} (8s)`)), 8000)
        );
        
        const { count, error: countError } = await Promise.race([countPromise, countTimeout]);

        if (countError) {
          console.error(`❌ [TEST] Erro ao contar ${table}:`, countError);
          testResults.push({
            table,
            count: 0,
            error: countError.message
          });
          continue;
        }

        // Buscar dados de exemplo com timeout
        const dataPromise = supabase
          .from(table)
          .select('*')
          .limit(3);
        
        const dataTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout ao buscar dados de ${table} (8s)`)), 8000)
        );
        
        const { data, error: dataError } = await Promise.race([dataPromise, dataTimeout]);

        if (dataError) {
          console.error(`❌ [TEST] Erro ao buscar dados de ${table}:`, dataError);
          testResults.push({
            table,
            count: count || 0,
            error: dataError.message
          });
        } else {
          console.log(`✅ [TEST] ${table}: ${count} registros, dados:`, data);
          testResults.push({
            table,
            count: count || 0,
            sampleData: data
          });
        }
      } catch (err) {
        console.error(`❌ [TEST] Erro inesperado em ${table}:`, err);
        testResults.push({
          table,
          count: 0,
          error: err instanceof Error ? err.message : 'Erro desconhecido'
        });
      }
    }

    setResults(testResults);
    setLoading(false);
    console.log('🔍 [TEST] Teste de conexão finalizado:', testResults);
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 m-4">
        <h3 className="text-lg font-bold text-blue-800 mb-4">🔍 Testando Conexão Supabase...</h3>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 m-4">
      <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 Resultado do Teste Supabase</h3>
      
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.table} className={`p-4 rounded-lg border ${
            result.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">
                {result.error ? '❌' : '✅'} Tabela: {result.table}
              </h4>
              <span className="text-sm font-mono">
                {result.count} registros
              </span>
            </div>
            
            {result.error && (
              <p className="text-red-600 text-sm mb-2">
                Erro: {result.error}
              </p>
            )}
            
            {result.sampleData && result.sampleData.length > 0 && (
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  Ver dados de exemplo
                </summary>
                <pre className="mt-2 bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(result.sampleData[0], null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          💡 <strong>Dica:</strong> Abra o console do navegador (F12) para ver logs detalhados.
        </p>
      </div>
    </div>
  );
};

export default SupabaseTest;