import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
// Removed unused imports

/**
 * Página de callback OAuth para processar retorno do Google
 * Gerencia a autenticação e redirecionamento após login social
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, syncGoogleUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processando autenticação...');
  
  // Flags para evitar reprocessamento
  const hasProcessedCallback = useRef(false);
  const hasRedirectedUser = useRef(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Evitar reprocessamento
      if (hasProcessedCallback.current) {
        console.log('🔄 Callback já processado, ignorando...');
        return;
      }
      
      hasProcessedCallback.current = true;
      
      try {
        console.log('🔄 Processando callback do Google OAuth...');
        
        // Verificar se há parâmetros de erro na URL
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('❌ Erro no callback OAuth:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || 'Erro na autenticação com Google');
          
          // Limpar URL e redirecionar
          window.history.replaceState({}, '', '/login');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }

        // Obter sessão do callback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Erro ao obter sessão:', sessionError);
          throw sessionError;
        }

        if (!session || !session.user) {
          console.log('⚠️ Nenhuma sessão encontrada, tentando processar hash...');
          
          // Tentar processar hash da URL (fallback)
          const { data: hashData, error: hashError } = await supabase.auth.getSessionFromUrl();
          
          if (hashError) {
            console.error('❌ Erro ao processar hash:', hashError);
            throw hashError;
          }
          
          if (!hashData.session) {
            throw new Error('Falha na autenticação com Google');
          }
        }

        console.log('✅ Sessão Google obtida:', {
          userId: session.user.id,
          email: session.user.email,
          provider: session.user.app_metadata?.provider
        });

        // Verificar se é login via Google
        if (session.user.app_metadata?.provider !== 'google') {
          console.warn('⚠️ Provider não é Google:', session.user.app_metadata?.provider);
        }

        // Sincronizar dados do usuário Google com a tabela users
        await syncGoogleUser(session.user);
        
        // Verificar se precisa de onboarding
        const checkFirstTimeUser = async (userId) => {
          const { data } = await supabase
            .from('user_profiles')
            .select('onboarding_completed')
            .eq('id', userId)
            .single();
          return !data?.onboarding_completed;
        };
        
        const needsOnboarding = await checkFirstTimeUser(session.user.id);
        const redirectPath = needsOnboarding ? '/customer-dashboard?onboarding=true' : '/customer-dashboard';
        
        setStatus('success');
        setMessage('Login realizado com sucesso!');
        
        // Limpar URL dos parâmetros OAuth
        window.history.replaceState({}, '', redirectPath);
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 2000);

      } catch (error) {
        console.error('💥 Erro no callback OAuth:', error);
        setStatus('error');
        setMessage(
          error instanceof Error 
            ? error.message 
            : 'Erro inesperado na autenticação'
        );
        
        // Limpar URL e redirecionar para login
        window.history.replaceState({}, '', '/login');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    // Só executar se ainda estiver em loading e não tiver processado ainda
    if (status === 'loading' && !hasProcessedCallback.current) {
      handleAuthCallback();
    }
  }, [navigate, searchParams, status, syncGoogleUser]); // Dependências adicionadas

  // Se o usuário já está logado, redirecionar imediatamente
  useEffect(() => {
    if (user && status === 'loading' && !hasRedirectedUser.current) {
      console.log('👤 Usuário já autenticado, redirecionando...');
      hasRedirectedUser.current = true;
      setStatus('success');
      setMessage('Usuário já autenticado!');
      
      // Limpar URL dos parâmetros OAuth
      window.history.replaceState({}, '', '/customer-dashboard');
      
      setTimeout(() => {
        navigate('/customer-dashboard', { replace: true });
      }, 1000);
    }
  }, [user, status, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="mb-6">
          <img
            src="/duopass_logo.svg"
            alt="DuoPass"
            className="h-12 w-auto mx-auto"
          />
        </div>

        {/* Status Loading */}
        {status === 'loading' && (
          <>
            <div className="mb-4">
              <svg
                className="animate-spin h-12 w-12 text-blue-600 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processando Login
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {/* Status Success */}
        {status === 'success' && (
          <>
            <div className="mb-4">
              <svg
                className="h-12 w-12 text-green-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-900 mb-2">
              Login Realizado!
            </h2>
            <p className="text-green-700">{message}</p>
          </>
        )}

        {/* Status Error */}
        {status === 'error' && (
          <>
            <div className="mb-4">
              <svg
                className="h-12 w-12 text-red-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Erro na Autenticação
            </h2>
            <p className="text-red-700 mb-4">{message}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Voltar ao Login
            </button>
          </>
        )}

        {/* Informação adicional */}
        <div className="mt-6 text-xs text-gray-500">
          Aguarde enquanto processamos sua autenticação...
        </div>
      </div>
    </div>
  );
};