import React, { useState } from 'react';
import { 
  ArrowRight,
  CheckCircle,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DuoPassConnect } from './connect/DuoPassConnect';
import { CommunityChat } from './connect/CommunityChat';
import { Community } from '../types/community';

interface ConnectTabProps {
  userMembership: {
    tier: string;
    status: string;
  };
}

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  online: number;
  lastMessage: string;
  lastTime: string;
  requiredTier: string;
  category: string;
}

// Função para obter badge do tier
const getTierBadge = (tier: string) => {
  switch (tier) {
    case 'starter':
      return { emoji: '🌟', name: 'Starter', color: 'text-yellow-500' };
    case 'explorer':
      return { emoji: '💎', name: 'Explorer', color: 'text-blue-500' };
    case 'ambassador':
      return { emoji: '👑', name: 'Ambassador', color: 'text-purple-500' };
    default:
      return { emoji: '🌟', name: 'Starter', color: 'text-yellow-500' };
  }
};

interface CommunityCardProps {
  community: LocalCommunity;
  isLocked?: boolean;
  onOpenChat?: (community: LocalCommunity) => void;
}

function CommunityCard({ community, isLocked = false, onOpenChat }: CommunityCardProps) {
  const navigate = useNavigate();

  const tierColors = {
    'starter': 'bg-green-100 text-green-700',
    'explorer': 'bg-blue-100 text-blue-700',
    'ambassador': 'bg-purple-100 text-purple-700'
  };

  const handleEnterCommunity = () => {
    if (isLocked) {
      navigate('/memberships');
      return;
    }
    // Abrir modal de chat ao invés de navegar
    if (onOpenChat) {
      onOpenChat(community);
    } else {
      navigate(`/community/${community.id}`);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow relative">
      {isLocked && (
        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Upgrade necessário</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{community.name}</h3>
        <div className="flex items-center gap-2">
          {!isLocked && community.requiredTier !== 'ambassador' && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Aberto para todos
            </span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${tierColors[community.requiredTier as keyof typeof tierColors]}`}>
            {community.requiredTier}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{community.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>👥 {community.members} membros</span>
        <span>🟢 {community.online} online</span>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-600 italic">"{community.lastMessage}"</p>
        <p className="text-xs text-gray-500 mt-1">{community.lastTime}</p>
      </div>
      
      <button
        onClick={handleEnterCommunity}
        disabled={isLocked}
        className={`w-full py-2 rounded-lg font-medium transition-all ${
          isLocked 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:shadow-lg'
        }`}
      >
        {isLocked ? 'Bloqueado 🔒' : 'Entrar na Conversa 💬'}
      </button>
    </div>
  );
}

function UpgradePrompt({ currentTier }: { currentTier: string }) {
  const navigate = useNavigate();
  
  const getUpgradeMessage = () => {
    switch (currentTier) {
      case 'starter':
        return {
          title: 'Desbloqueie Mais Comunidades',
          description: 'Upgrade para Explorer e acesse Cultural Explorers + comunidades exclusivas',
          communities: ['Cultural Explorers', 'Art Enthusiasts'],
          targetPlan: 'Explorer'
        };
      case 'explorer':
        return {
          title: 'Acesso VIP Exclusivo',
          description: 'Torne-se Ambassador e participe de experiências VIP exclusivas',
          communities: ['VIP Experiences', 'Private Events'],
          targetPlan: 'Ambassador'
        };
      default:
        return null;
    }
  };

  const upgradeInfo = getUpgradeMessage();
  if (!upgradeInfo) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{upgradeInfo.title}</h3>
          <p className="text-gray-600 mb-3">{upgradeInfo.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {upgradeInfo.communities.map((community) => (
              <span key={community} className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border">
                🔒 {community}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => navigate('/memberships')}
          className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <span>Upgrade para {upgradeInfo.targetPlan}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ConnectTab({ userMembership }: ConnectTabProps) {
  const [showFullConnect, setShowFullConnect] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<LocalCommunity | null>(null);
  const userBadge = getTierBadge(userMembership.tier);

  const handleOpenChat = (community: LocalCommunity) => {
    setSelectedCommunity(community);
    setShowChatModal(true);
  };

  // Converter LocalCommunity para Community para o CommunityChat
  const convertToFullCommunity = (localCommunity: LocalCommunity): Community => {
    // Mock members baseado na comunidade
    const getMockMembers = (communityId: string) => {
      const baseMembersData = [
        {
          id: 'member-1',
          name: 'Ana Silva',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          interests: ['Arte', 'Cultura'],
          joinedAt: '2024-01-15',
          isOnline: true,
          user_id: 'user-1',
          bio: 'Apaixonada por arte contemporânea'
        },
        {
          id: 'member-2',
          name: 'Carlos Mendes',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          interests: ['Gastronomia', 'Vinhos'],
          joinedAt: '2024-01-20',
          isOnline: false,
          user_id: 'user-2',
          bio: 'Chef e sommelier'
        },
        {
          id: 'member-3',
          name: 'Maria Santos',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          interests: ['Bem-estar', 'Yoga'],
          joinedAt: '2024-02-01',
          isOnline: true,
          user_id: 'user-3',
          bio: 'Instrutora de yoga e mindfulness'
        },
        {
          id: 'member-4',
          name: 'João Costa',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          interests: ['Música', 'Teatro'],
          joinedAt: '2024-02-10',
          isOnline: true,
          user_id: 'user-4',
          bio: 'Músico e produtor cultural'
        }
      ];
      
      // Personalizar interesses baseado na comunidade
      switch (communityId) {
        case 'cultural-explorers':
          return baseMembersData.map(m => ({ ...m, interests: ['Cultura', 'História', 'Saraus'] }));
        case 'food-lovers':
          return baseMembersData.map(m => ({ ...m, interests: ['Gastronomia', 'Vinhos', 'Restaurantes'] }));
        case 'art-enthusiasts':
          return baseMembersData.map(m => ({ ...m, interests: ['Arte', 'Exposições', 'Oficinas'] }));
        case 'wellness-mindful':
          return baseMembersData.map(m => ({ ...m, interests: ['Bem-estar', 'Yoga', 'Spas'] }));
        case 'ambassador-lounge':
          return baseMembersData.slice(0, 2).map(m => ({ ...m, interests: ['VIP', 'Experiências Exclusivas'] }));
        default:
          return baseMembersData;
      }
    };

    return {
      ...localCommunity,
      memberCount: localCommunity.members,
      coverImage: '',
      members: getMockMembers(localCommunity.id),
      activities: []
    };
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedCommunity(null);
  };
  
  // Comunidades liberadas para todos os tiers (exceto Ambassador Lounge)
  const availableCommunities = {
    'starter': ['cultural-explorers', 'food-lovers', 'art-enthusiasts', 'wellness-mindful'],
    'explorer': ['cultural-explorers', 'food-lovers', 'art-enthusiasts', 'wellness-mindful'],
    'ambassador': ['cultural-explorers', 'food-lovers', 'art-enthusiasts', 'wellness-mindful', 'ambassador-lounge']
  };

  // Definindo interface local para compatibilidade com o ConnectTab
  interface LocalCommunity extends Omit<Community, 'memberCount' | 'coverImage' | 'members' | 'activities'> {
    members: number;
    online: number;
    lastMessage: string;
    lastTime: string;
    requiredTier: string;
  }

  const communities: LocalCommunity[] = [
    {
      id: 'cultural-explorers',
      name: 'Cultural Explorers',
      description: 'Membros apaixonados por experiências culturais autênticas',
      members: 347,
      online: 24,
      lastMessage: 'Alguém foi no sarau literário ontem? Como foi? 📚',
      lastTime: '2h atrás',
      requiredTier: 'starter',
      category: 'cultura',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'food-lovers',
      name: 'Food & Wine Lovers',
      description: 'Experiências gastronômicas e vinícolas em dupla',
      members: 289,
      online: 18,
      lastMessage: 'Dicas de restaurantes românticos para um primeiro encontro? 🍷',
      lastTime: '1h atrás',
      requiredTier: 'starter',
      category: 'gastronomia',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'art-enthusiasts',
      name: 'Art Enthusiasts',
      description: 'Arte, música e experiências criativas para todos',
      members: 256,
      online: 15,
      lastMessage: 'A oficina de cerâmica foi transformadora! 🎨',
      lastTime: '3h atrás',
      requiredTier: 'starter',
      category: 'arte',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'wellness-mindful',
      name: 'Wellness & Mindful',
      description: 'Bem-estar, mindfulness e experiências de autocuidado',
      members: 198,
      online: 12,
      lastMessage: 'Sessão de yoga no parque foi revigorante! 🧘‍♀️',
      lastTime: '5h atrás',
      requiredTier: 'starter',
      category: 'bem-estar',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'ambassador-lounge',
      name: 'Ambassador Lounge',
      description: 'Lounge exclusivo para Ambassadors com experiências VIP',
      members: 89,
      online: 8,
      lastMessage: 'Jantar privativo na vinícola foi incrível! 🥂',
      lastTime: '2h atrás',
      requiredTier: 'ambassador',
      category: 'cultura',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const userCommunities = communities.filter(community => 
    availableCommunities[userMembership.tier as keyof typeof availableCommunities]?.includes(community.id)
  );

  const lockedCommunities = communities.filter(community => 
    !availableCommunities[userMembership.tier as keyof typeof availableCommunities]?.includes(community.id)
  );

  if (showFullConnect) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFullConnect(false)}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-2"
          >
            <span>← Voltar ao Dashboard</span>
          </button>
        </div>
        <DuoPassConnect />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Connect */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold">💬 DUO PASS Connect</h2>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
            <span>{userBadge.emoji}</span>
            <span>{userBadge.name}</span>
          </div>
        </div>
        <div className="bg-white/10 rounded-lg p-3 mb-3">
          <p className="text-sm font-medium mb-1">🎉 Bem-vindo ao DUO PASS Connect!</p>
          <p className="text-sm opacity-90">
            <strong>Novidade:</strong> Agora todas as comunidades principais estão abertas para todos os membros! 
            Conecte-se, compartilhe experiências e descubra novas oportunidades culturais.
            {userMembership.tier !== 'ambassador' && ' Ambassadors têm acesso exclusivo ao Ambassador Lounge!'}
          </p>
        </div>
        <p className="opacity-90">Conecte-se com outros membros e compartilhe experiências culturais autênticas</p>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <span>🎭 {userCommunities.length} comunidades disponíveis</span>
          <span>👥 {userCommunities.reduce((acc, c) => acc + c.online, 0)} membros online</span>
        </div>
        <button
          onClick={() => setShowFullConnect(true)}
          className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
        >
          <span>Explorar Connect Completo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userCommunities.map(community => (
          <CommunityCard 
            key={community.id} 
            community={community}
            onOpenChat={handleOpenChat}
          />
        ))}
        {lockedCommunities.slice(0, 2).map(community => (
          <CommunityCard 
            key={community.id} 
            community={community}
            isLocked={true}
          />
        ))}
      </div>

      {/* Upgrade Prompt for Missing Communities */}
      {userMembership.tier !== 'ambassador' && (
        <UpgradePrompt currentTier={userMembership.tier} />
      )}

      {/* Chat Modal */}
      {showChatModal && selectedCommunity && (
        <CommunityChat 
          community={convertToFullCommunity(selectedCommunity)}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}