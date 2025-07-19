import { supabase } from '../lib/supabase';

type SpendingData = {
  total: number;
  avgTicket: number;
  topCategory: string;
  trend: number;
};

type SavingsInsight = {
  description: string;
  amount: number;
};

type PatternData = {
  peakTime: string;
  avgTicket: number;
  frequency: number;
  bestTime: string;
};

type SocialInsight = {
  friendName: string;
  activity: string;
};

type TimingData = {
  bestTime: string;
  busyDays: string;
  availability: number;
};

type OptimizationTip = {
  tip: string;
};

export const aiAnalyticsService = {
  async getMonthlySpending(userId: string): Promise<SpendingData> {
    // Simulated data for MVP
    return {
      total: 245,
      avgTicket: 85,
      topCategory: 'Gastronomia',
      trend: 15
    };
  },

  async getSavingsOpportunities(userId: string): Promise<SavingsInsight[]> {
    // Simulated data
    return [
      { description: 'Comprando 3+ vouchers você economiza', amount: 67 },
      { description: 'Experiências aos finais de semana custam 20% menos', amount: 0 },
      { description: 'Assinatura Golden economizaria R$120/mês', amount: 120 }
    ];
  },

  async getSpendingPatterns(userId: string): Promise<PatternData> {
    // Simulated data
    return {
      peakTime: 'Sábados às 14h',
      avgTicket: 85,
      frequency: 2.3,
      bestTime: 'Final do mês'
    };
  },

  async getFriendActivity(userId: string): Promise<SocialInsight[]> {
    // Simulated data
    return [
      { friendName: 'João', activity: 'foi ao mesmo restaurante semana passada' },
      { friendName: 'Maria', activity: 'curtiu esta experiência' }
    ];
  },

  async getOptimalTiming(offerId: string): Promise<TimingData> {
    // Simulated data
    return {
      bestTime: 'Terça 19h',
      busyDays: 'Sexta-Domingo',
      availability: 85
    };
  },

  async getExperienceOptimization(offerId: string): Promise<OptimizationTip[]> {
    // Simulated data
    return [
      { tip: 'Reserve com 2 dias de antecedência para melhor mesa' },
      { tip: 'Usuários avaliam melhor quando vão em dupla' },
      { tip: 'Dica: Peça mesa perto da janela (avaliação +0.8⭐)' },
      { tip: 'Combine com outras experiências próximas' }
    ];
  }
};