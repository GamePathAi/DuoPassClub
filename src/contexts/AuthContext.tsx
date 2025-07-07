import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
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
  signUp: (email: string, password: string, userData: SignUpData) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<void>;
  canResendEmail: (email: string) => Promise<boolean>;
  getResendCooldown: (email: string) => Promise<number>;
  loginDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔒 Configurações de segurança
const _0x3e4f = !import.meta.env.PROD;
const _0x5g6h = import.meta.env.DEV;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  
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
    await fetchUserProfile('demo-user-id');
    setLoading(false);
    
    // Salvar sessão demo no localStorage
    localStorage.setItem('duopass_demo_session', 'active');
    
    // Log apenas em desenvolvimento
    if (import.meta.env.DEV) {
      console.log('✅ Login demo realizado com sucesso!');
    }
  }, []);

  useEffect(() => {
    // Check for demo session first
    const demoSession = localStorage.getItem('duopass_demo_session');
    if (demoSession) {
      // Log apenas em desenvolvimento
      if (_0x5g6h) {
        console.log('🎭 Restaurando sessão demo...');
      }
      loginDemo();
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [loginDemo]);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Handle demo user
      if (userId === 'demo-user-id') {
        const demoProfile: AppUser = {
          id: 'demo-user-id',
          email: 'demo@duopass.com',
          full_name: 'Usuário Demo',
          user_type: 'customer',
          subscription_status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUserProfile(demoProfile);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error: unknown) {
      // Log de erro apenas em desenvolvimento
      if (_0x5g6h) {
        console.error('Error fetching user profile:', error);
      }
    }
  };

  const signUp = async (email: string, password: string, userData: SignUpData) => {
    // 🔍 Verificar se email já existe antes de tentar criar
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = "The result contains 0 rows" (email não existe, ok para continuar)
      if (_0x5g6h) {
        console.error('Erro ao verificar email existente:', checkError);
      }
      throw new Error('Erro ao verificar disponibilidade do email');
    }

    if (existingUser) {
      throw new Error('Este email já está cadastrado. Tente fazer login ou use outro email.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm-email`
      }
    });

    if (error) throw error;

    if (data.user) {
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

      if (profileError) {
        if (_0x5g6h) {
          console.error('Erro ao criar perfil do usuário:', profileError);
        }
        throw new Error('Erro ao criar perfil do usuário. Tente novamente.');
      }
    }

    return data;
  };

  const signIn = async (email: string, password: string) => {
    if (_0x5g6h) {
      console.log('🔐 AuthContext: Iniciando signIn com email:', email);
    }
    
    // SOLUÇÃO TEMPORÁRIA: Credenciais de teste para demonstração
    if (email === 'demo@duopass.com' && password === '123456') {
      if (_0x5g6h) {
        console.log('✅ AuthContext: Login de demonstração bem-sucedido!');
      }
      
      // Simular dados de usuário para demonstração
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
      await fetchUserProfile('demo-user-id');
      
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

      if (_0x5g6h) {
        console.log('⏳ AuthContext: Aguardando resposta do Supabase...');
      }
      const { data, error } = await Promise.race([authPromise, timeoutPromise]) as { data: unknown; error: unknown };

      if (_0x5g6h) {
        console.log('📊 AuthContext: Resposta do Supabase:', { data, error });
      }

      if (error) {
        if (_0x5g6h) {
          console.error('❌ AuthContext: Erro na autenticação:', error);
        }
        throw error;
      }

      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        if (_0x5g6h) {
          console.log('📧 AuthContext: Email não verificado, fazendo logout');
        }
        // Sign out the user immediately
        await supabase.auth.signOut();
        throw new Error('Email não verificado. Verifique sua caixa de entrada e clique no link de confirmação.');
      }

      if (_0x5g6h) {
        console.log('✅ AuthContext: Login bem-sucedido, retornando dados');
      }
      return data;
    } catch (error: unknown) {
      if (_0x5g6h) {
        console.error('💥 AuthContext: Erro capturado:', error);
      }
      throw error;
    }
  };

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
      if (_0x5g6h) {
        console.error('Error checking resend cooldown:', error);
      }
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
      if (_0x5g6h) {
        console.error('Error getting resend cooldown:', error);
      }
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

    if (_0x5g6h) {
      console.log('resend_email_attempted', { email, timestamp: new Date().toISOString() });
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm-email`
      }
    });

    if (error) {
      if (_0x5g6h) {
        console.log('resend_email_failed', { email, error: error.message, timestamp: new Date().toISOString() });
      }
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

  const signOut = async () => {
    try {
      if (_0x5g6h) {
        console.log('🚪 Fazendo logout...');
      }
      
      // Limpar Supabase session
      const { error } = await supabase.auth.signOut();
      if (error && _0x5g6h) {
        console.error('Erro Supabase logout:', error);
      }
      
      // Limpar estado local
      setUser(null);
      setUserProfile(null);
      setLoading(false);
      
      // Limpar localStorage se houver
      localStorage.removeItem('duopass_user');
      localStorage.removeItem('sb-token');
      localStorage.removeItem('duopass_demo_session');
      
      if (_0x5g6h) {
        console.log('✅ Logout realizado com sucesso');
      }
      
    } catch (error) {
      if (_0x5g6h) {
        console.error('❌ Erro no logout:', error);
      }
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    resendConfirmation,
    canResendEmail,
    getResendCooldown,
    loginDemo,
  };

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