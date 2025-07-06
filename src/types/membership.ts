// Tipos para sistema de memberships DUO PASS

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  experiences_per_month: number | 'unlimited';
  features: string[];
  popular: boolean;
  tier: 'starter' | 'explorer' | 'ambassador';
  color_scheme: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  icon: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: Date;
  current_period_end: Date;
  experiences_used_this_month: number;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  trial_end?: Date;
  cancel_at_period_end: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  stripe_payment_method_id: string;
  type: 'card';
  card_brand: string;
  card_last4: string;
  card_exp_month: number;
  card_exp_year: number;
  is_default: boolean;
  created_at: Date;
}

export interface UsageLimit {
  user_id: string;
  month: string; // YYYY-MM format
  experiences_used: number;
  plan_limit: number | 'unlimited';
  reset_date: Date;
}

// Dados dos planos DUO PASS
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'cultural-starter',
    name: 'Cultural Starter',
    description: 'Perfeito para começar sua jornada cultural',
    price_monthly: 9,
    price_yearly: 90, // 2 meses grátis
    experiences_per_month: 2,
    features: [
      '2 experiências culturais por mês (2 por 1)',
      'Acesso a cafés e experiências básicas',
      'Newsletter cultural semanal',
      'Comunidade DUO PASS Connect',
      'Suporte por email'
    ],
    popular: false,
    tier: 'starter',
    color_scheme: {
      primary: '#F59E0B',
      secondary: '#FEF3C7',
      gradient: 'from-amber-400 to-orange-500'
    },
    icon: '🌟'
  },
  {
    id: 'cultural-explorer',
    name: 'Cultural Explorer',
    description: 'O plano mais popular para exploradores culturais',
    price_monthly: 12,
    price_yearly: 120, // 2 meses grátis
    experiences_per_month: 4,
    features: [
      '4 experiências culturais por mês (2 por 1)',
      'Acesso completo: restaurantes, spas, arte',
      'Eventos exclusivos mensais',
      'Curadoria personalizada',
      'Prioridade no atendimento',
      'Acesso antecipado a novas experiências'
    ],
    popular: true,
    tier: 'explorer',
    color_scheme: {
      primary: '#8B5CF6',
      secondary: '#EDE9FE',
      gradient: 'from-purple-500 to-pink-500'
    },
    icon: '👑'
  },
  {
    id: 'cultural-ambassador',
    name: 'Cultural Ambassador',
    description: 'Experiência VIP completa para verdadeiros embaixadores',
    price_monthly: 18,
    price_yearly: 180, // 2 meses grátis
    experiences_per_month: 'unlimited',
    features: [
      'Experiências ilimitadas (2 por 1)',
      'Acesso VIP a eventos especiais',
      'Convidados extras (+2 pessoas ocasionalmente)',
      'Concierge cultural personalizado',
      'Acesso beta a novas experiências',
      'Suporte prioritário 24/7',
      'Transferência de experiências entre meses'
    ],
    popular: false,
    tier: 'ambassador',
    color_scheme: {
      primary: '#EF4444',
      secondary: '#FEE2E2',
      gradient: 'from-red-500 to-pink-600'
    },
    icon: '🏆'
  }
];

// Configurações do paywall
export const PAYWALL_CONFIG = {
  FREE_EXPERIENCES_LIMIT: 2,
  TRIAL_DAYS: 7,
  SHOW_PAYWALL_AFTER: 3 // Mostra paywall na 3ª tentativa
};

// Status de assinatura para UI
export const SUBSCRIPTION_STATUS_LABELS = {
  active: 'Ativo',
  canceled: 'Cancelado',
  past_due: 'Pagamento em atraso',
  trialing: 'Período de teste'
} as const;

// Benefícios por tier
export const TIER_BENEFITS = {
  starter: {
    badge_color: 'bg-amber-100 text-amber-800',
    priority_level: 1,
    community_access: ['general']
  },
  explorer: {
    badge_color: 'bg-purple-100 text-purple-800',
    priority_level: 2,
    community_access: ['general', 'explorer']
  },
  ambassador: {
    badge_color: 'bg-red-100 text-red-800',
    priority_level: 3,
    community_access: ['general', 'explorer', 'ambassador']
  }
} as const;