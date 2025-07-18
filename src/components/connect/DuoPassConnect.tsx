import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Crown,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CulturalAffinityQuiz } from './CulturalAffinityQuiz';
import { CommunityDirectory } from './CommunityDirectory';
import { MemberChat } from './MemberChat';
import { ConnectPaywall } from './ConnectPaywall';
import { supabase } from '../../lib/supabaseConfig';

type ConnectTab = 'directory' | 'quiz' | 'chat';

interface UserAffinity {
  id: string;
  user_id: string;
  preferred_time: string;
  cultural_frequency: string;
  budget_range: string;
  group_size_preference: string;
  discovery_style: string;
  primary_interests: string[];
  preferred_location: string;
  available_days: string[];
  social_style: string;
  experience_level: string;
  created_at: string;
  updated_at: string;
}

export function DuoPassConnect() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ConnectTab>('directory');
  const [hasAffinity, setHasAffinity] = useState(false);
  const [userAffinity, setUserAffinity] = useState<UserAffinity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const checkSubscriptionAndAffinity = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Verificar se é usuário demo (sempre tem acesso)
      if (user.id === 'demo-user-id') {
        setIsSubscribed(true);
        // Criar afinidade mock para demo
        const mockAffinity: UserAffinity = {
          id: 'demo-affinity',
          user_id: 'demo-user-id',
          preferred_time: 'evening',
          cultural_frequency: 'weekly',
          budget_range: 'medium',
          group_size_preference: 'couple',
          discovery_style: 'mixed',
          primary_interests: ['arte', 'gastronomia', 'musica'],
          preferred_location: 'São Paulo - SP',
          available_days: ['friday', 'saturday', 'sunday'],
          social_style: 'ambivert',
          experience_level: 'intermediate',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setUserAffinity(mockAffinity);
        setHasAffinity(true);
        setLoading(false);
        return;
      }
      
      // TODO: Verificar subscription real do usuário
      // Por enquanto, vamos simular que usuários autenticados têm acesso
      setIsSubscribed(true);
      
      // Verificar se usuário já preencheu questionário de afinidades
      const { data: affinityData, error } = await supabase
        .from('cultural_affinities')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar afinidades:', error);
      }
      
      if (affinityData) {
        setUserAffinity(affinityData);
        setHasAffinity(true);
      }
    } catch (error) {
      console.error('Erro ao verificar subscription e afinidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionAndAffinityCallback = React.useCallback(checkSubscriptionAndAffinity, [user]);

  useEffect(() => {
    if (user) {
      checkSubscriptionAndAffinityCallback();
    }
  }, [user, checkSubscriptionAndAffinityCallback]);

  const handleQuizComplete = (affinity: UserAffinity) => {
    setUserAffinity(affinity);
    setHasAffinity(true);
    setShowQuiz(false);
    setActiveTab('directory');
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C91F1F] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando DUO PASS Connect...</p>
        </div>
      </div>
    );
  }

  // Mostrar paywall se não for assinante
  if (!isSubscribed) {
    return <ConnectPaywall />;
  }

  // Mostrar questionário se ainda não preencheu
  if (!hasAffinity || showQuiz) {
    return (
      <CulturalAffinityQuiz 
        onComplete={handleQuizComplete}
        existingAffinity={userAffinity}
        onCancel={() => setShowQuiz(false)}
      />
    );
  }

  const tabs = [
    {
      id: 'directory' as ConnectTab,
      name: 'Comunidades',
      icon: Users,
      description: 'Explore e participe',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'chat' as ConnectTab,
      name: 'Conexões',
      icon: MessageCircle,
      description: 'Suas conversas',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'directory':
        return <CommunityDirectory userAffinity={userAffinity} />;
      case 'chat':
        return <MemberChat />;
      default:
        return <CommunityDirectory userAffinity={userAffinity} />;
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Header Integrado */}
      <div className="bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white rounded-lg mb-6">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold flex items-center">
                  DUO PASS Connect
                  <Sparkles className="w-5 h-5 ml-2" />
                </h2>
                <p className="text-white text-opacity-90 text-sm">
                  Conecte-se com pessoas que compartilham suas paixões culturais
                </p>
              </div>
            </div>
            
            {/* Badge de Membro */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1.5 flex items-center space-x-2">
                <Crown className="w-4 h-4" />
                <span className="font-medium text-sm">Premium</span>
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-1.5 transition-colors text-sm"
              >
                Atualizar Perfil
              </button>
            </div>
          </div>
          
          {/* Resumo do Perfil */}
          {userAffinity && (
            <div className="mt-4 bg-white bg-opacity-10 rounded-lg p-3">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Interesses: {userAffinity.primary_interests.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Prefere: {userAffinity.group_size_preference}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Estilo: {userAffinity.social_style}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? `border-[#C91F1F] text-[#C91F1F]`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${
                    isActive ? tab.bgColor : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      isActive ? tab.color : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{tab.name}</div>
                    <div className="text-xs text-gray-400">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
}