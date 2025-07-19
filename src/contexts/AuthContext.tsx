import React, { createContext, useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User as AppUser } from '../types';

interface SignUpData {
  full_name: string;
  user_type: 'customer' | 'merchant';
  business_name?: string;
  contact_info?: Record<string, unknown>;
}

interface AuthResponse {
  user?: User;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: AppUser | null;
  loading: boolean;
  trialStatus: 'active' | 'expired' | 'none';
  trialExpiresAt: string | null;
  onboarding_completed: boolean | null;
  signUp: (email: string, password: string, userData: SignUpData) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  canResendEmail: (email: string) => Promise<boolean>;
  getResendCooldown: (email: string) => Promise<number>;
  loginDemo: () => Promise<void>;
  syncGoogleUser: (user: User) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔒 Configurações de segurança
const _0x5g6h = import.meta.env.DEV;

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [trialStatus, setTrialStatus] = useState<'active' | 'expired' | 'none'>('none');
  const [trialExpiresAt, setTrialExpiresAt] = useState<string | null>(null);
  
  // ✅ CORREÇÃO: Flag para evitar loop infinito
  const isFetchingProfile = useRef(false);

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (isFetchingProfile.current) return;
    isFetchingProfile.current = true;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    } finally {
      isFetchingProfile.current = false;
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile]);

  const checkTrialStatus = useCallback((userCreatedAt: string | undefined) => {
    if (!userCreatedAt) {
      setTrialStatus('none');
      setTrialExpiresAt(null);
      return;
    }

    const createdAt = new Date(userCreatedAt);
    const now = new Date();
    const trialDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const safeToISO = (date: Date | null | undefined) => {
      if (!date) return null;
      const d = new Date(date);
      return isNaN(d.getTime()) ? null : d.toISOString();
    };

    const expiresAt = new Date(createdAt.getTime() + trialDuration);

    if (now < expiresAt) {
      setTrialStatus('active');
      setTrialExpiresAt(safeToISO(expiresAt));
    } else {
      setTrialStatus('expired');
      setTrialExpiresAt(safeToISO(expiresAt)); // Keep expiration date for reference
    }
  }, []);

  useEffect(() => {
    if (user && userProfile) {
      checkTrialStatus(userProfile.created_at);

      const currentPath = window.location.pathname;

      if (currentPath.includes('/admin')) {
        window.location.href = '/customer-dashboard';
        return;
      }

      if (currentPath === '/' || currentPath === '/login') {
        window.location.href = '/customer-dashboard';
      }
    }
  }, [user, userProfile, checkTrialStatus]);
  
  // LOG IMEDIATO: Verificar estado inicial
  if (_0x5g6h) {
    console.log('🔍 AuthProvider renderizado:', { loading, hasUser: !!user, hasProfile: !!userProfile });
  }
  
  // FORÇA: Reset loading após 2 segundos SEMPRE

  
  // LOG: Monitorar mudanças no loading
  useEffect(() => {
    if (_0x5g6h) {
      console.log('📊 Loading state changed:', loading);
    }
  }, [loading]);
  
  const loginDemo = useCallback(async () => {
    // Logs removidos em produção
    if (import.meta.env.DEV) {
      console.log('🎭 Fazendo login demo automático...');
    }
    
    const mockUser = {
      id: 'demo-user-id',
      email: 'demo@duopass.com',
      email_confirmed_at: new Date().toISOString(),
      user_metadata: {
        full_name: 'Usuário Demo',
        user_type: 'customer'
      }
    } as User;
    
    // Definir user e userProfile imediatamente
    setUser(mockUser);
    fetchUserProfile('demo-user-id');
    setLoading(false);
    
    // Salvar sessão demo no localStorage
    localStorage.setItem('duopass_demo_session', 'active');
    
    // Log apenas em desenvolvimento
    if (import.meta.env.DEV) {
      console.log('✅ Login demo realizado com sucesso!');
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    let mounted = true;
    
    // TIMEOUT DE SEGURANÇA: Força loading=false após 3 segundos
    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        setLoading(false);
        if (_0x5g6h) {
          console.log('🚨 TIMEOUT DE SEGURANÇA: Forçando loading=false após 3s');
        }
      }
    }, 3000);
    
    const initializeAuth = async () => {
      try {
        // Check for demo session first
        const demoSession = localStorage.getItem('duopass_demo_session');
        if (demoSession) {
          // Log apenas em desenvolvimento
          if (_0x5g6h) {
            console.log('🎭 Restaurando sessão demo...');
          }
          loginDemo();
          clearTimeout(safetyTimeout);
          return;
        }

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setUser(session?.user ?? null);
          // CRÍTICO: Sempre definir loading como false após inicialização
          setLoading(false);
          clearTimeout(safetyTimeout);
          
          if (session?.user) {
            fetchUserProfile(session.user.id);
            checkTrialStatus(session.user.id);
          }
          
          if (_0x5g6h) {
            console.log('🔄 AuthContext: Inicialização completa', {
              hasUser: !!session?.user,
              loading: false
            });
          }
        }
      } catch (error) {
        if (_0x5g6h) {
          console.error('❌ Erro na inicialização da autenticação:', error);
        }
        if (mounted) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
    };
  }, [loginDemo, fetchUserProfile]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);



  const signUp = useCallback(async (email: string, password: string, userData: SignUpData) => {
    console.log('🔧 AUTH CONTEXT: Iniciando signUp para:', email);
    
    // 🔍 Verificar se email já existe antes de tentar criar
    console.log('🔍 AUTH CONTEXT: Verificando se email já existe...');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    console.log('📊 AUTH CONTEXT: Resultado da verificação:', { existingUser, checkError });

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = "The result contains 0 rows" (email não existe, ok para continuar)
      console.error('❌ AUTH CONTEXT: Erro ao verificar email existente:', checkError);
      throw new Error('Erro ao verificar disponibilidade do email');
    }

    if (existingUser) {
      console.log('⚠️ AUTH CONTEXT: Email já existe no banco!');
      throw new Error('Este email já está cadastrado. Tente fazer login ou use outro email.');
    }

    console.log('✅ AUTH CONTEXT: Email disponível, criando usuário no Supabase Auth...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm-email`
      }
    });

    console.log('📊 AUTH CONTEXT: Resultado do signUp:', { data, error });

    if (error) {
      console.error('❌ AUTH CONTEXT: Erro no Supabase Auth signUp:', error);
      throw error;
    }

    if (data.user) {
      console.log('👤 AUTH CONTEXT: Usuário criado, inserindo perfil na tabela users...');
      // 🛠️ Usar upsert para evitar conflitos de chave duplicada
      const { error: profileError } = await supabase.from('users').upsert(
        {
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name,
          user_type: userData.user_type,
          email_verified: false,
          email_verification_sent_at: new Date().toISOString(),
          subscription_status: userData.user_type === 'customer' ? 'trial' : null,
        },
        {
          onConflict: 'email'
        }
      );

    console.log('📊 AUTH CONTEXT: Resultado do upsert do perfil:', { profileError });

      if (profileError) {
        console.error('❌ AUTH CONTEXT: Erro ao criar perfil do usuário:', profileError);
        throw new Error('Erro ao criar perfil do usuário. Tente novamente.');
      }
    }

    console.log('✅ AUTH CONTEXT: SignUp concluído com sucesso!');
    return data;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('🔐 AuthContext: Iniciando signIn com email:', email);
    
    // SOLUÇÃO TEMPORÁRIA: Credenciais de teste para demonstração
    if ((email === 'demo@duopass.com' && password === '123456') || 
        (email === 'admin@duopass.com' && password === 'admin123')) {
      console.log('✅ AuthContext: Login de demonstração bem-sucedido!');
      
      // Determinar tipo de usuário baseado no email
      const isAdmin = email === 'admin@duopass.com';
      
      // Simular dados de usuário para demonstração
      const mockUser = {
        id: isAdmin ? 'admin-user-id' : 'demo-user-id',
        email: email,
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          full_name: isAdmin ? 'Administrador DuoPass' : 'Usuário Demo',
          user_type: isAdmin ? 'admin' : 'customer'
        }
      } as User;
      
      // Definir user e userProfile imediatamente
      setUser(mockUser);
      await fetchUserProfile(isAdmin ? 'admin-user-id' : 'demo-user-id');
      
      // CRÍTICO: Resetar loading para false após login demo
      setLoading(false);
      
      // Simular sessão
      const mockSession = {
        access_token: 'demo-token',
        refresh_token: 'demo-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      };
      
      return {
        user: mockUser,
        session: mockSession
      };
    }
    
    try {
      // Adicionar timeout de 10 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Login demorou mais de 10 segundos')), 10000);
      });

      const authPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('⏳ AuthContext: Aguardando resposta do Supabase...');
      const { data, error } = await Promise.race([authPromise, timeoutPromise]) as { data: { user: User | null; session: object | null } | null; error: Error | null };

      console.log('📊 AuthContext: Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ AuthContext: Erro na autenticação:', error);
        throw error;
      }

      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        console.log('📧 AuthContext: Email não verificado, fazendo logout');
        // Sign out the user immediately
        await supabase.auth.signOut();
        throw new Error('Email não verificado. Verifique sua caixa de entrada e clique no link de confirmação.');
      }

      console.log('✅ AuthContext: Login bem-sucedido, retornando dados');
      return data;
    } catch (error: unknown) {
      console.error('💥 AuthContext: Erro capturado:', error);
      throw error;
    }
  }, []);

  const canResendEmail = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email_verification_sent_at')
        .eq('email', email)
        .single();

      if (error || !data?.email_verification_sent_at) return true;

      const lastSent = new Date(data.email_verification_sent_at);
      const now = new Date();
      const diffInSeconds = (now.getTime() - lastSent.getTime()) / 1000;
      
      return diffInSeconds >= 60; // 60 seconds cooldown
    } catch (error: unknown) {
      console.error('Error checking resend cooldown:', error);
      return true;
    }
  };

  const getResendCooldown = async (email: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email_verification_sent_at')
        .eq('email', email)
        .single();

      if (error || !data?.email_verification_sent_at) return 0;

      const lastSent = new Date(data.email_verification_sent_at);
      const now = new Date();
      const diffInSeconds = (now.getTime() - lastSent.getTime()) / 1000;
      const remaining = Math.max(0, 60 - diffInSeconds);
      
      return Math.ceil(remaining);
    } catch (error: unknown) {
      console.error('Error getting resend cooldown:', error);
      return 0;
    }
  };

  const resendConfirmation = async (email: string) => {
    // Check rate limiting
    const canResend = await canResendEmail(email);
    if (!canResend) {
      const cooldown = await getResendCooldown(email);
      throw new Error(`Aguarde ${cooldown} segundos antes de reenviar o email.`);
    }

    console.log('resend_email_attempted', { email, timestamp: new Date().toISOString() });

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm-email`
      }
    });

    if (error) {
      console.log('resend_email_failed', { email, error: error.message, timestamp: new Date().toISOString() });
      throw error;
    }

    // Update the resend timestamp in the database
    await supabase
      .from('users')
      .update({ email_verification_sent_at: new Date().toISOString() })
      .eq('email', email);

    if (_0x5g6h) {
      console.log('email_verification_sent', { email, timestamp: new Date().toISOString() });
    }
  };

  const signOut = useCallback(async () => {
    try {
      if (_0x5g6h) {
        console.log('🚪 Fazendo logout...');
      }
      
      // Definir loading temporariamente para mostrar feedback
      setLoading(true);
      
      // Limpar Supabase session
      const { error } = await supabase.auth.signOut();
      if (error && _0x5g6h) {
        console.error('Erro Supabase logout:', error);
      }
      
      // Limpar estado local IMEDIATAMENTE
      setUser(null);
      setUserProfile(null);
      
      // Limpar localStorage se houver
      localStorage.removeItem('duopass_user');
      localStorage.removeItem('sb-token');
      localStorage.removeItem('duopass_demo_session');
      
      // CRÍTICO: Resetar loading após limpeza
      setLoading(false);
      
      if (_0x5g6h) {
        console.log('✅ Logout realizado com sucesso', {
          user: null,
          userProfile: null,
          loading: false
        });
      }
      
      // Forçar atualização da página para garantir limpeza completa
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      if (_0x5g6h) {
        console.error('❌ Erro no logout:', error);
      }
      // Mesmo com erro, limpar estado local
      setUser(null);
      setUserProfile(null);
      setLoading(false);
    }
  }, []);

  /**
   * Inicia autenticação com Google OAuth
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      console.log('🔐 Iniciando autenticação com Google...');
      
      const { error } = await supabase.auth.signInWithOAuth({
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
      // O redirecionamento acontece automaticamente
    } catch (error) {
      console.error('💥 Erro no Google Auth:', error);
      throw error;
    }
  }, []);

  /**
   * Sincroniza dados do usuário Google com a tabela users
   */
  const syncGoogleUser = useCallback(async (googleUser: User) => {
    try {
      console.log('🔄 Sincronizando usuário Google com banco de dados...');
      
      if (!googleUser.email) {
        throw new Error('Email do usuário Google não encontrado');
      }

      // Verificar se já estamos processando este usuário para evitar duplicação
      if (user && user.id === googleUser.id && userProfile) {
        console.log('⚠️ Usuário Google já está sincronizado e perfil carregado, pulando...');
        return;
      }

      // Extrair dados do Google
      const userData = {
        id: googleUser.id,
        email: googleUser.email,
        full_name: googleUser.user_metadata?.full_name || googleUser.user_metadata?.name || 'Usuário Google',
        avatar_url: googleUser.user_metadata?.avatar_url || googleUser.user_metadata?.picture,
        provider: 'google',
        provider_id: googleUser.user_metadata?.sub,
        user_type: 'customer' as const, // Usuários Google são clientes por padrão
        email_verified: true, // Google já verifica o email
        subscription_status: 'trial' as const,
      };

      // Verificar se usuário já existe
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userData.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Erro ao verificar usuário existente:', checkError);
        throw checkError;
      }

      if (existingUser) {
        // Atualizar usuário existente com dados do Google
        console.log('👤 Atualizando usuário existente com dados do Google...');
        
        // ✅ CORREÇÃO: Usar apenas campos que existem na tabela users
        const updateData = {
          subscription_status: 'active', // Ativar usuário Google automaticamente
          email_verified: true,
          updated_at: new Date().toISOString(),
        };
        
        console.log('📊 Dados para atualização:', updateData);
        
        const { error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', existingUser.id);

        if (updateError) {
          console.error('❌ Erro ao atualizar usuário:', {
            message: updateError.message,
            details: updateError.details,
            hint: updateError.hint,
            code: updateError.code,
            updateData: updateData,
            userId: existingUser.id
          });
          throw updateError;
        }
        
        console.log('✅ Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        console.log('👤 Criando novo usuário Google...');
        
        // ✅ CORREÇÃO: Usar apenas campos que existem na tabela users
        const newUserData = {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          user_type: 'customer',
          subscription_status: 'active', // Ativar usuário Google automaticamente
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        console.log('📊 Dados para criação:', newUserData);
        
        const { error: insertError } = await supabase
          .from('users')
          .insert(newUserData);

        if (insertError) {
          console.error('❌ Erro ao criar usuário Google:', {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code,
            newUserData: newUserData
          });
          throw insertError;
        }
        
        console.log('✅ Novo usuário Google criado com sucesso!');
      }

      console.log('✅ Usuário Google sincronizado com sucesso!');
      
      // Atualizar perfil local apenas se necessário
      if (!userProfile || userProfile.id !== googleUser.id) {
        await fetchUserProfile(googleUser.id);
      }
      
    } catch (error: any) {
      console.error('💥 Erro na sincronização do usuário Google:', {
        message: error?.message || 'Erro desconhecido',
        details: error?.details || 'Sem detalhes',
        hint: error?.hint || 'Sem dicas',
        code: error?.code || 'Sem código',
        stack: error?.stack || 'Sem stack trace',
        fullError: error
      });
      throw error;
    }
  }, [user, userProfile, fetchUserProfile]);

  const value = useMemo(() => ({
    user,
    userProfile,
    loading,
    trialStatus,
    trialExpiresAt,
    onboarding_completed: userProfile?.onboarding_completed ?? null,
    signUp,
    signIn,
    signOut,
    resendConfirmation,
    canResendEmail,
    getResendCooldown,
    loginDemo,
    signInWithGoogle,
    syncGoogleUser,
    refreshUserProfile,
  }), [user, userProfile, loading, trialStatus, trialExpiresAt, signUp, signIn, signOut, resendConfirmation, canResendEmail, getResendCooldown, loginDemo, signInWithGoogle, syncGoogleUser, refreshUserProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Exportar o AuthProvider
export { AuthProvider };