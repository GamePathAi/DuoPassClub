import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Star, Target, TrendingUp, Award, Users, Zap } from 'lucide-react';
import { GamificationService } from '../services/gamificationService';
import { GamificationStats } from '../types/gamification';
import { useAuth } from '../contexts/AuthContext';

interface GamificationPanelProps {
  compact?: boolean;
}

export default function GamificationPanel({ compact = false }: GamificationPanelProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ id: string; name: string; points: number; level: number; rank: number }[]>([]);

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user, loadGamificationData]);

  const loadGamificationData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [userStats, topUsers] = await Promise.all([
        GamificationService.getUserGamificationStats(user.id),
        GamificationService.getLeaderboard(5)
      ]);
      
      setStats(userStats);
      setLeaderboard(topUsers);
    } catch (error) {
      console.error('Erro ao carregar dados de gamificação:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
        <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Dados de gamificação não disponíveis</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{stats.current_level.badge_icon}</span>
              <span className="font-bold">{stats.current_level.name}</span>
            </div>
            <p className="text-sm opacity-90">{stats.total_points} pontos</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">{stats.streak_days} dias</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span className="text-sm">{stats.achievements_count}</span>
            </div>
          </div>
        </div>
        
        {stats.next_level && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Próximo nível: {stats.next_level.name}</span>
              <span>{stats.progress_percentage}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${stats.progress_percentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com nível atual */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{stats.current_level.badge_icon}</div>
            <div>
              <h2 className="text-2xl font-bold">{stats.current_level.name}</h2>
              <p className="opacity-90">{stats.total_points} pontos totais</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Este mês</div>
            <div className="text-xl font-bold">+{stats.points_this_month}</div>
          </div>
        </div>
        
        {stats.next_level && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso para {stats.next_level.name}</span>
              <span>{stats.progress_percentage}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${stats.progress_percentage}%` }}
              ></div>
            </div>
            <p className="text-xs mt-2 opacity-75">
              Faltam {stats.next_level.min_points - stats.total_points} pontos
            </p>
          </div>
        )}
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Sequência</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.streak_days}</div>
          <div className="text-xs text-gray-500">dias consecutivos</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">Conquistas</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.achievements_count}</div>
          <div className="text-xs text-gray-500">desbloqueadas</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Este mês</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.points_this_month}</div>
          <div className="text-xs text-gray-500">pontos ganhos</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Nível</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.current_level.name}</div>
          <div className="text-xs text-gray-500">atual</div>
        </div>
      </div>

      {/* Benefícios do nível atual */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Benefícios do Nível {stats.current_level.name}
        </h3>
        <div className="grid gap-2">
          {stats.current_level.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conquistas recentes */}
      {stats.recent_achievements.length > 0 && (
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Conquistas Recentes
            </h3>
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showAchievements ? 'Ocultar' : 'Ver todas'}
            </button>
          </div>
          
          <div className="space-y-3">
            {stats.recent_achievements.slice(0, showAchievements ? undefined : 3).map((userAchievement) => (
              <div key={userAchievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{userAchievement.achievement?.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{userAchievement.achievement?.name}</h4>
                  <p className="text-sm text-gray-600">{userAchievement.achievement?.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Conquistado em {new Date(userAchievement.earned_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-yellow-600">
                    +{userAchievement.achievement?.points_reward} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ranking */}
      {leaderboard.length > 0 && (
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Top 5 Usuários
          </h3>
          
          <div className="space-y-3">
            {leaderboard.map((userRank, index) => {
              const isCurrentUser = userRank.user_id === user?.id;
              return (
                <div 
                  key={userRank.user_id} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {isCurrentUser ? 'Você' : userRank.user?.full_name || 'Usuário'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Nível {userRank.current_level}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{userRank.total_points}</div>
                    <div className="text-xs text-gray-500">pontos</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}