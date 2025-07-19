import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personalizado para autenticação com Google
 * Facilita o uso do Google OAuth em toda a aplicação
 */
export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * Inicia o fluxo de autenticação com Google
   * Redireciona para o Google OAuth e depois retorna para a aplicação
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔐 Iniciando autenticação com Google...');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('❌ Erro na autenticação Google:', error);
        throw error;
      }

      console.log('✅ Redirecionamento para Google iniciado');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('💥 Erro no Google Auth:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verifica se o usuário atual foi autenticado via Google
   */
  const isGoogleUser = useCallback(() => {
    return user?.app_metadata?.provider === 'google';
  }, [user]);

  /**
   * Obtém informações específicas do Google do usuário atual
   */
  const getGoogleUserInfo = useCallback(() => {
    if (!isGoogleUser()) return null;

    return {
      name: user?.user_metadata?.full_name || user?.user_metadata?.name,
      email: user?.email,
      picture: user?.user_metadata?.avatar_url || user?.user_metadata?.picture,
      provider: 'google',
      providerId: user?.user_metadata?.sub,
    };
  }, [user, isGoogleUser]);

  /**
   * Limpa erros de autenticação
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    signInWithGoogle,
    isGoogleUser,
    getGoogleUserInfo,
    loading,
    error,
    clearError,
  };
};

export default useGoogleAuth;