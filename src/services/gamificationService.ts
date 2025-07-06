import { supabase } from '../lib/supabaseConfig';
import {
  // UserPoints,
  UserLevel,
  Achievement,
  // UserAchievement,
  PointsTransaction,
  GamificationStats,
  USER_LEVELS,
  PREDEFINED_ACHIEVEMENTS
} from '../types/gamification';
import { NotificationService } from './notificationService';

export class GamificationService {
  // Inicializar sistema de gamificação para novo usuário
  static async initializeUserGamification(userId: string): Promise<void> {
    try {
      // Criar registro de pontos inicial
      const { error: pointsError } = await supabase
        .from('user_points')
        .insert({
          user_id: userId,
          total_points: 0,
          current_level: 'bronze',
          points_to_next_level: 500,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (pointsError) {
        console.error('Erro ao inicializar pontos:', pointsError);
      }

      // Dar pontos de boas-vindas
      await this.addPoints(userId, 100, 'bonus', 'Bônus de boas-vindas! 🎉');
    } catch (error) {
      console.error('Erro ao inicializar gamificação:', error);
    }
  }

  // Adicionar pontos ao usuário
  static async addPoints(
    userId: string,
    points: number,
    source: PointsTransaction['source'],
    description: string,
    metadata?: Record<string, unknown>
  ): Promise<{ levelUp: boolean; newLevel?: UserLevel }> {
    try {
      // Buscar pontos atuais
      const { data: currentPoints } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!currentPoints) {
        await this.initializeUserGamification(userId);
        return { levelUp: false };
      }

      const newTotalPoints = currentPoints.total_points + points;
      const currentLevel = USER_LEVELS.find(l => l.id === currentPoints.current_level);
      const newLevel = this.calculateLevel(newTotalPoints);
      const levelUp = currentLevel?.id !== newLevel.id;

      // Atualizar pontos
      const { error: updateError } = await supabase
        .from('user_points')
        .update({
          total_points: newTotalPoints,
          current_level: newLevel.id,
          points_to_next_level: this.calculatePointsToNextLevel(newTotalPoints),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Erro ao atualizar pontos:', updateError);
        return { levelUp: false };
      }

      // Registrar transação
      await supabase
        .from('points_transactions')
        .insert({
          user_id: userId,
          points,
          type: 'earned',
          source,
          description,
          metadata,
          created_at: new Date().toISOString()
        });

      // Verificar conquistas
      await this.checkAchievements(userId, source, metadata);

      // Notificar level up
      if (levelUp) {
        await NotificationService.notifyLevelUp(userId, newLevel.name);
      }

      return { levelUp, newLevel: levelUp ? newLevel : undefined };
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      return { levelUp: false };
    }
  }

  // Calcular nível baseado nos pontos
  static calculateLevel(points: number): UserLevel {
    for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
      const level = USER_LEVELS[i];
      if (points >= level.min_points) {
        return level;
      }
    }
    return USER_LEVELS[0]; // Bronze como padrão
  }

  // Calcular pontos necessários para próximo nível
  static calculatePointsToNextLevel(currentPoints: number): number {
    const currentLevel = this.calculateLevel(currentPoints);
    const currentLevelIndex = USER_LEVELS.findIndex(l => l.id === currentLevel.id);
    
    if (currentLevelIndex === USER_LEVELS.length - 1) {
      return 0; // Já está no nível máximo
    }
    
    const nextLevel = USER_LEVELS[currentLevelIndex + 1];
    return nextLevel.min_points - currentPoints;
  }

  // Verificar e conceder conquistas
  static async checkAchievements(
    userId: string,
    action: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      // Buscar conquistas já obtidas
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      const earnedAchievementIds = userAchievements?.map(ua => ua.achievement_id) || [];

      // Buscar todas as conquistas ativas
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .not('id', 'in', `(${earnedAchievementIds.join(',') || 'null'})`);

      if (!achievements) return;

      for (const achievement of achievements) {
        const earned = await this.checkSingleAchievement(userId, achievement, action, metadata);
        if (earned) {
          await this.grantAchievement(userId, achievement);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar conquistas:', error);
    }
  }

  // Verificar uma conquista específica
  static async checkSingleAchievement(
    userId: string,
    achievement: Achievement,
    action: string,
    metadata?: Record<string, unknown>
  ): Promise<boolean> {
    const { requirements } = achievement;
    
    // Verificar se a ação corresponde
    if (requirements.action !== action) return false;

    try {
      switch (requirements.type) {
        case 'count':
          return await this.checkCountRequirement(userId, requirements.action, requirements.target);
        
        case 'streak':
          return await this.checkStreakRequirement(userId, requirements.action, requirements.target);
        
        case 'value':
          return await this.checkValueRequirement(userId, requirements.action, requirements.target);
        
        case 'date':
          return this.checkDateRequirement(requirements.target, metadata);
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Erro ao verificar conquista:', error);
      return false;
    }
  }

  // Verificar requisito de contagem
  static async checkCountRequirement(userId: string, action: string, target: number): Promise<boolean> {
    const { count } = await supabase
      .from('points_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('source', action);

    return (count || 0) >= target;
  }

  // Verificar requisito de sequência
  static async checkStreakRequirement(userId: string, action: string, target: number): Promise<boolean> {
    // Implementação simplificada - verificar últimos N dias
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - target);

    const { data } = await supabase
      .from('points_transactions')
      .select('created_at')
      .eq('user_id', userId)
      .eq('source', action)
      .gte('created_at', daysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (!data || data.length < target) return false;

    // Verificar se há atividade em dias consecutivos
    const dates = data.map(t => new Date(t.created_at).toDateString());
    const uniqueDates = [...new Set(dates)];
    
    return uniqueDates.length >= target;
  }

  // Verificar requisito de valor
  static async checkValueRequirement(userId: string, action: string, target: number): Promise<boolean> {
    const { data } = await supabase
      .from('points_transactions')
      .select('metadata')
      .eq('user_id', userId)
      .eq('source', action);

    if (!data) return false;

    const totalValue = data.reduce((sum, transaction) => {
      const value = transaction.metadata?.value || 0;
      return sum + value;
    }, 0);

    return totalValue >= target;
  }

  // Verificar requisito de data/hora
  static checkDateRequirement(target: number, metadata?: Record<string, unknown>): boolean {
    if (!metadata?.timestamp) return false;
    
    const hour = new Date(metadata.timestamp).getHours();
    return hour < target; // Para conquista "Madrugador"
  }

  // Conceder conquista
  static async grantAchievement(userId: string, achievement: Achievement): Promise<void> {
    try {
      // Registrar conquista
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
          earned_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao conceder conquista:', error);
        return;
      }

      // Adicionar pontos da conquista
      await this.addPoints(
        userId,
        achievement.points_reward,
        'achievement',
        `Conquista desbloqueada: ${achievement.name}`,
        { achievement_id: achievement.id }
      );

      // Notificar usuário
      await NotificationService.notifyAchievement(userId, achievement.name, achievement.icon);
    } catch (error) {
      console.error('Erro ao conceder conquista:', error);
    }
  }

  // Buscar estatísticas de gamificação do usuário
  static async getUserGamificationStats(userId: string): Promise<GamificationStats | null> {
    try {
      // Buscar pontos atuais
      const { data: userPoints } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!userPoints) return null;

      const currentLevel = USER_LEVELS.find(l => l.id === userPoints.current_level)!;
      const currentLevelIndex = USER_LEVELS.findIndex(l => l.id === currentLevel.id);
      const nextLevel = currentLevelIndex < USER_LEVELS.length - 1 ? USER_LEVELS[currentLevelIndex + 1] : undefined;
      
      const progressPercentage = nextLevel 
        ? ((userPoints.total_points - currentLevel.min_points) / (nextLevel.min_points - currentLevel.min_points)) * 100
        : 100;

      // Buscar conquistas
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
        .limit(5);

      // Pontos deste mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyTransactions } = await supabase
        .from('points_transactions')
        .select('points')
        .eq('user_id', userId)
        .eq('type', 'earned')
        .gte('created_at', startOfMonth.toISOString());

      const pointsThisMonth = monthlyTransactions?.reduce((sum, t) => sum + t.points, 0) || 0;

      // Calcular streak (simplificado)
      const streakDays = await this.calculateUserStreak(userId);

      return {
        total_points: userPoints.total_points,
        current_level: currentLevel,
        next_level: nextLevel,
        progress_percentage: Math.round(progressPercentage),
        achievements_count: achievements?.length || 0,
        recent_achievements: achievements || [],
        points_this_month: pointsThisMonth,
        streak_days: streakDays
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return null;
    }
  }

  // Calcular streak do usuário
  static async calculateUserStreak(userId: string): Promise<number> {
    try {
      const { data } = await supabase
        .from('points_transactions')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!data || data.length === 0) return 0;

      const dates = data.map(t => new Date(t.created_at).toDateString());
      const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

      let streak = 0;
      const currentDate = new Date();

      for (const dateStr of uniqueDates) {
        const checkDate = currentDate.toDateString();
        if (dateStr === checkDate) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Erro ao calcular streak:', error);
      return 0;
    }
  }

  // Buscar ranking de usuários
  static async getLeaderboard(limit: number = 10): Promise<{ user_id: string; total_points: number; level: number; full_name?: string }[]> {
    try {
      const { data } = await supabase
        .from('user_points')
        .select(`
          *,
          user:users(full_name)
        `)
        .order('total_points', { ascending: false })
        .limit(limit);

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      return [];
    }
  }

  // Inicializar conquistas predefinidas no banco
  static async initializePredefinedAchievements(): Promise<void> {
    try {
      for (const achievement of PREDEFINED_ACHIEVEMENTS) {
        const { error } = await supabase
          .from('achievements')
          .upsert({
            ...achievement,
            id: achievement.name.toLowerCase().replace(/\s+/g, '_'),
            created_at: new Date().toISOString()
          }, {
            onConflict: 'name'
          });

        if (error) {
          console.error('Erro ao inserir conquista:', achievement.name, error);
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar conquistas:', error);
    }
  }
}