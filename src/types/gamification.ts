export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  current_level: UserLevel;
  points_to_next_level: number;
  created_at: string;
  updated_at: string;
}

export interface UserLevel {
  id: string;
  name: string;
  min_points: number;
  max_points: number;
  benefits: string[];
  badge_color: string;
  badge_icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_reward: number;
  category: 'usage' | 'social' | 'loyalty' | 'special';
  requirements: {
    type: 'count' | 'streak' | 'value' | 'date';
    target: number;
    action: string;
  };
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'earned' | 'spent' | 'bonus';
  source: 'offer_activation' | 'voucher_use' | 'review' | 'referral' | 'achievement' | 'cashback';
  description: string;
  metadata?: Record<string, string | number | boolean>;
  created_at: string;
}

export interface GamificationStats {
  total_points: number;
  current_level: UserLevel;
  next_level?: UserLevel;
  progress_percentage: number;
  achievements_count: number;
  recent_achievements: UserAchievement[];
  points_this_month: number;
  streak_days: number;
}

// Níveis predefinidos
export const USER_LEVELS: UserLevel[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    min_points: 0,
    max_points: 499,
    benefits: ['Acesso a ofertas básicas', 'Suporte por email'],
    badge_color: 'bg-amber-600',
    badge_icon: '🥉'
  },
  {
    id: 'silver',
    name: 'Prata',
    min_points: 500,
    max_points: 1499,
    benefits: ['Ofertas exclusivas', 'Suporte prioritário', '5% cashback extra'],
    badge_color: 'bg-gray-400',
    badge_icon: '🥈'
  },
  {
    id: 'gold',
    name: 'Ouro',
    min_points: 1500,
    max_points: 4999,
    benefits: ['Ofertas VIP', 'Suporte 24/7', '10% cashback extra', 'Acesso antecipado'],
    badge_color: 'bg-yellow-500',
    badge_icon: '🥇'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    min_points: 5000,
    max_points: 999999,
    benefits: ['Ofertas exclusivas Platinum', 'Gerente de conta dedicado', '15% cashback extra', 'Eventos exclusivos'],
    badge_color: 'bg-purple-600',
    badge_icon: '💎'
  }
];

// Conquistas predefinidas
export const PREDEFINED_ACHIEVEMENTS: Omit<Achievement, 'id' | 'created_at'>[] = [
  {
    name: 'Primeiro Passo',
    description: 'Ativou sua primeira oferta',
    icon: '🎯',
    points_reward: 50,
    category: 'usage',
    requirements: {
      type: 'count',
      target: 1,
      action: 'offer_activation'
    },
    is_active: true
  },
  {
    name: 'Explorador',
    description: 'Ativou 10 ofertas',
    icon: '🗺️',
    points_reward: 200,
    category: 'usage',
    requirements: {
      type: 'count',
      target: 10,
      action: 'offer_activation'
    },
    is_active: true
  },
  {
    name: 'Veterano',
    description: 'Ativou 50 ofertas',
    icon: '🏆',
    points_reward: 500,
    category: 'usage',
    requirements: {
      type: 'count',
      target: 50,
      action: 'offer_activation'
    },
    is_active: true
  },
  {
    name: 'Sequência de Fogo',
    description: 'Usou ofertas por 7 dias consecutivos',
    icon: '🔥',
    points_reward: 300,
    category: 'loyalty',
    requirements: {
      type: 'streak',
      target: 7,
      action: 'daily_usage'
    },
    is_active: true
  },
  {
    name: 'Crítico Construtivo',
    description: 'Avaliou 5 estabelecimentos',
    icon: '⭐',
    points_reward: 150,
    category: 'social',
    requirements: {
      type: 'count',
      target: 5,
      action: 'review_submission'
    },
    is_active: true
  },
  {
    name: 'Embaixador',
    description: 'Indicou 3 amigos que se cadastraram',
    icon: '👥',
    points_reward: 400,
    category: 'social',
    requirements: {
      type: 'count',
      target: 3,
      action: 'successful_referral'
    },
    is_active: true
  },
  {
    name: 'Madrugador',
    description: 'Ativou uma oferta antes das 8h',
    icon: '🌅',
    points_reward: 100,
    category: 'special',
    requirements: {
      type: 'date',
      target: 8,
      action: 'early_activation'
    },
    is_active: true
  },
  {
    name: 'Gastador VIP',
    description: 'Gastou mais de CHF 180.- em ofertas',
    icon: '💰',
    points_reward: 600,
    category: 'loyalty',
    requirements: {
      type: 'value',
      target: 1000,
      action: 'total_spent'
    },
    is_active: true
  }
];