// Configuração avançada do Supabase para DuoPass
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = 'https://rnzvbrlbcnknyhrgubqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuenZicmxiY25rbnlocmd1YnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMTc0ODksImV4cCI6MjA2NjU5MzQ4OX0.fjMnzy1PCCqkGucrGp-1jkaJtwBuo9qNB1rk6OOw3zk';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Configurações do cliente Supabase
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
  },
  global: {
    headers: {
      'X-Client-Info': 'duopass-web',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
};

// Cliente principal do Supabase
export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey,
  supabaseConfig
);

// Função para verificar conexão com o Supabase
export const checkSupabaseConnection = async (): Promise<{
  connected: boolean;
  error?: string;
  latency?: number;
}> => {
  try {
    const startTime = Date.now();
    
    // Teste simples de conexão
    const { error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    const latency = Date.now() - startTime;
    
    if (error) {
      return {
        connected: false,
        error: error.message,
        latency,
      };
    }
    
    return {
      connected: true,
      latency,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Função para verificar status da autenticação
export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth check error:', error);
      return { authenticated: false, error: error.message };
    }
    
    return {
      authenticated: !!session,
      user: session?.user || null,
      expiresAt: session?.expires_at || null,
    };
  } catch (error) {
    console.error('Auth status check failed:', error);
    return {
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Função para obter estatísticas do sistema
export const getSystemStats = async () => {
  try {
    const { data, error } = await supabase.rpc('get_system_stats');
    
    if (error) {
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching system stats:', error);
    throw error;
  }
};

// Função para obter relatório mensal
export const getMonthlyReport = async (targetMonth?: string) => {
  try {
    const { data, error } = await supabase.rpc('get_monthly_usage_report', {
      target_month: targetMonth || new Date().toISOString().split('T')[0],
    });
    
    if (error) {
      throw error;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    throw error;
  }
};

// Configurações de desenvolvimento
if (import.meta.env.DEV) {
  // Log de conexão em desenvolvimento
  checkSupabaseConnection().then((result) => {
    if (result.connected) {
      console.log(`✅ Supabase connected (${result.latency}ms)`);
    } else {
      console.error('❌ Supabase connection failed:', result.error);
    }
  });
  
  // Adicionar cliente ao window para debug
  (window as Record<string, unknown>).supabase = supabase;
}

// Tipos para TypeScript
export type SupabaseResponse<T> = {
  data: T | null;
  error: unknown;
};

export type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

// Constantes úteis
export const SUPABASE_CONSTANTS = {
  TABLES: {
    USERS: 'users',
    CATEGORIES: 'categories',
    OFFERS: 'offers',
    ACTIVATED_COUPONS: 'activated_coupons',
    VOUCHERS: 'vouchers',
    VOUCHER_USAGE: 'voucher_usage',
  },
  USER_TYPES: {
    CUSTOMER: 'customer',
    MERCHANT: 'merchant',
  },
  SUBSCRIPTION_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    TRIAL: 'trial',
  },
  VOUCHER_STATUS: {
    ACTIVE: 'active',
    USED: 'used',
    EXPIRED: 'expired',
  },
} as const;

export default supabase;