import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseConfig';

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

export function SupabaseConnectivityTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const updateResult = (index: number, updates: Partial<TestResult>) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, ...updates } : r));
  };

  const runConnectivityTests = useCallback(async () => {
    setIsRunning(true);
    setResults([]);

    // Teste 1: Verificar variáveis de ambiente
    const envTest: TestResult = {
      test: 'Variáveis de Ambiente',
      status: 'pending',
      message: 'Verificando configuração...'
    };
    addResult(envTest);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      updateResult(0, {
        status: 'error',
        message: `URL: ${supabaseUrl ? '✓' : '✗'}, Key: ${supabaseKey ? '✓' : '✗'}`
      });
    } else {
      updateResult(0, {
        status: 'success',
        message: `URL: ${supabaseUrl}, Key: ${supabaseKey.substring(0, 20)}...`
      });
    }

    // Teste 2: Conectividade básica
    const connectTest: TestResult = {
      test: 'Conectividade Básica',
      status: 'pending',
      message: 'Testando conexão...'
    };
    addResult(connectTest);

    const startTime = Date.now();
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout de 5 segundos')), 5000)
      );
      
      const connectPromise = supabase.from('offers').select('count', { count: 'exact', head: true });
      
      await Promise.race([connectPromise, timeoutPromise]);
      
      const duration = Date.now() - startTime;
      updateResult(1, {
        status: 'success',
        message: `Conexão estabelecida em ${duration}ms`,
        duration
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      updateResult(1, {
        status: 'error',
        message: `Falha: ${error instanceof Error ? error.message : 'Erro desconhecido'} (${duration}ms)`,
        duration
      });
    }

    // Teste 3: Acesso à tabela offers (sem RLS)
    const offersTest: TestResult = {
      test: 'Tabela Offers',
      status: 'pending',
      message: 'Testando acesso...'
    };
    addResult(offersTest);

    try {
      const startTime3 = Date.now();
      const { data, error } = await supabase
        .from('offers')
        .select('id, title')
        .limit(1);
      
      const duration3 = Date.now() - startTime3;
      
      if (error) {
        updateResult(2, {
          status: 'error',
          message: `Erro: ${error.message} (${duration3}ms)`,
          duration: duration3
        });
      } else {
        updateResult(2, {
          status: 'success',
          message: `${data?.length || 0} registros encontrados (${duration3}ms)`,
          duration: duration3
        });
      }
    } catch (error) {
      updateResult(2, {
        status: 'error',
        message: `Exceção: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    }

    // Teste 4: Acesso à tabela cultural_experiences (com RLS)
    const culturalTest: TestResult = {
      test: 'Tabela Cultural Experiences',
      status: 'pending',
      message: 'Testando acesso...'
    };
    addResult(culturalTest);

    try {
      const startTime4 = Date.now();
      const { data, error } = await supabase
        .from('cultural_experiences')
        .select('id, experience_name')
        .limit(1);
      
      const duration4 = Date.now() - startTime4;
      
      if (error) {
        updateResult(3, {
          status: 'error',
          message: `Erro: ${error.message} (${duration4}ms)`,
          duration: duration4
        });
      } else {
        updateResult(3, {
          status: 'success',
          message: `${data?.length || 0} registros encontrados (${duration4}ms)`,
          duration: duration4
        });
      }
    } catch (error) {
      updateResult(3, {
        status: 'error',
        message: `Exceção: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    }

    // Teste 5: Teste direto de URL
    const urlTest: TestResult = {
      test: 'Teste HTTP Direto',
      status: 'pending',
      message: 'Testando URL diretamente...'
    };
    addResult(urlTest);

    try {
      const startTime5 = Date.now();
      const response = await fetch(`${supabaseUrl}/rest/v1/offers?select=count&limit=1`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const duration5 = Date.now() - startTime5;
      
      if (response.ok) {
        updateResult(4, {
          status: 'success',
          message: `HTTP ${response.status} - OK (${duration5}ms)`,
          duration: duration5
        });
      } else {
        updateResult(4, {
          status: 'error',
          message: `HTTP ${response.status} - ${response.statusText} (${duration5}ms)`,
          duration: duration5
        });
      }
    } catch (error) {
      updateResult(4, {
        status: 'error',
        message: `Falha na requisição: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
    }

    setIsRunning(false);
  }, []);

  useEffect(() => {
    runConnectivityTests();
  }, [runConnectivityTests]);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">🔍 Teste de Conectividade Supabase</h3>
        <button
          onClick={runConnectivityTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Testando...' : 'Executar Testes'}
        </button>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-xl">{getStatusIcon(result.status)}</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">{result.test}</div>
              <div className={`text-sm ${getStatusColor(result.status)}`}>
                {result.message}
              </div>
              {result.duration && (
                <div className="text-xs text-gray-500 mt-1">
                  Duração: {result.duration}ms
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !isRunning && (
        <div className="text-center text-gray-500 py-8">
          Clique em "Executar Testes" para verificar a conectividade
        </div>
      )}
    </div>
  );
}