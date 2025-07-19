import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Star, 
  Palette,
  Utensils,
  Music,
  Heart,
  BookOpen,
  Crown,
  UserPlus,
  UserMinus,
  Search
} from 'lucide-react';
import { supabase } from '../../lib/supabaseConfig';
import { useAuth } from '../../contexts/AuthContext';

interface UserPreferences {
  id: string;
  user_id: string;
  culture_level: string;
  interests: string[];
  location: string;
  created_at: string;
  updated_at: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  created_at: string;
  updated_at: string;
}



interface CommunityDirectoryProps {
  userPreferences: UserPreferences | null;
}

const communityIcons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  'arte': Palette,
  'gastronomia': Utensils,
  'musica': Music,
  'bem-estar': Heart,
  'cultura': BookOpen
};

const communityColors: Record<string, { bg: string; text: string; border: string }> = {
  'arte': { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  'gastronomia': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  'musica': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  'bem-estar': { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  'cultura': { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' }
};

export default function CommunityDirectory({ userPreferences }: CommunityDirectoryProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userMemberships, setUserMemberships] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyParticipating, setShowOnlyParticipating] = useState(false);
  const [joiningCommunity, setJoiningCommunity] = useState<string | null>(null);

  const loadCommunities = async () => {
    try {
      // Para usuários demo, usar dados mock
      if (user?.id === 'demo-user-id') {
        const mockCommunities: Community[] = [
          {
            id: 'arte-design',
            name: 'Arte & Design',
            description: 'Explore museus, galerias e exposições com pessoas que compartilham sua paixão pela arte visual e design contemporâneo.',
            category: 'arte',
            member_count: 1247,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'gastronomia-gourmet',
            name: 'Gastronomia Gourmet',
            description: 'Descubra novos sabores, restaurantes exclusivos e experiências culinárias únicas com outros food lovers.',
            category: 'gastronomia',
            member_count: 892,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'musica-concertos',
            name: 'Música & Concertos',
            description: 'Compartilhe shows, concertos e festivais musicais com melômanos que adoram descobrir novos artistas.',
            category: 'musica',
            member_count: 1534,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'bem-estar-mindful',
            name: 'Bem-estar & Mindfulness',
            description: 'Conecte-se com pessoas que valorizam o autocuidado, spas, retiros e práticas de bem-estar.',
            category: 'bem-estar',
            member_count: 678,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'cultura-patrimonio',
            name: 'Cultura & Patrimônio',
            description: 'Explore a história local, tradições culturais e patrimônio histórico com outros entusiastas da cultura.',
            category: 'cultura',
            member_count: 945,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setCommunities(mockCommunities);
        setLoading(false);
        return;
      }

      // Using mock data directly to avoid DB call
      const mockCommunities: Community[] = [
        {
          id: 'arte-design',
          name: 'Arte & Design',
          description: 'Explore museus, galerias e exposições com pessoas que compartilham sua paixão pela arte visual e design contemporâneo.',
          category: 'arte',
          member_count: 1247,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'gastronomia-gourmet',
          name: 'Gastronomia Gourmet',
          description: 'Descubra novos sabores, restaurantes exclusivos e experiências culinárias únicas com outros food lovers.',
          category: 'gastronomia',
          member_count: 892,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'musica-concertos',
          name: 'Música & Concertos',
          description: 'Compartilhe shows, concertos e festivais musicais com melômanos que adoram descobrir novos artistas.',
          category: 'musica',
          member_count: 1534,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'bem-estar-mindful',
          name: 'Bem-estar & Mindfulness',
          description: 'Conecte-se com pessoas que valorizam o autocuidado, spas, retiros e práticas de bem-estar.',
          category: 'bem-estar',
          member_count: 678,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'cultura-patrimonio',
          name: 'Cultura & Patrimônio',
          description: 'Explore a história local, tradições culturais e patrimônio histórico com outros entusiastas da cultura.',
          category: 'cultura',
          member_count: 945,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setCommunities(mockCommunities);
    } catch (error) {
      console.error('Erro ao carregar comunidades:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserMemberships = async () => {
    if (!user) return;

    try {
      // Para usuário demo, simular algumas memberships
      if (user.id === 'demo-user-id') {
        setUserMemberships(['arte-design', 'gastronomia-gourmet']);
        return;
      }

      const { data, error } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setUserMemberships(data?.map(m => m.community_id) || []);
    } catch (error) {
      console.error('Erro ao carregar memberships:', error);
    }
  };

  const loadCommunitiesCallback = React.useCallback(loadCommunities, [user]);
  const loadUserMembershipsCallback = React.useCallback(loadUserMemberships, [user]);

  useEffect(() => {
    loadCommunitiesCallback();
    if (user) {
      loadUserMembershipsCallback();
    }
  }, [user, loadCommunitiesCallback, loadUserMembershipsCallback]);

  const handleJoinCommunity = async (communityId: string) => {
    if (!user || joiningCommunity) return;

    setJoiningCommunity(communityId);
    try {
      // Para usuário demo, simular join
      if (user.id === 'demo-user-id') {
        setUserMemberships(prev => [...prev, communityId]);
        setCommunities(prev => prev.map(c => 
          c.id === communityId 
            ? { ...c, member_count: c.member_count + 1 }
            : c
        ));
        setJoiningCommunity(null);
        // Navegar para a página da comunidade
        navigate(`/comunidade/${communityId}`);
        return;
      }

      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: user.id
        });

      if (error) {
        throw error;
      }

      setUserMemberships(prev => [...prev, communityId]);
      await loadCommunities(); // Recarregar para atualizar contadores
      // Navegar para a página da comunidade
      navigate(`/comunidade/${communityId}`);
    } catch (error) {
      console.error('Erro ao entrar na comunidade:', error);
      alert('Erro ao entrar na comunidade. Tente novamente.');
    } finally {
      setJoiningCommunity(null);
    }
  };

  const handleLeaveCommunity = async (communityId: string) => {
    if (!user || joiningCommunity) return;

    setJoiningCommunity(communityId);
    try {
      // Para usuário demo, simular leave
      if (user.id === 'demo-user-id') {
        setUserMemberships(prev => prev.filter(id => id !== communityId));
        setCommunities(prev => prev.map(c => 
          c.id === communityId 
            ? { ...c, member_count: Math.max(0, c.member_count - 1) }
            : c
        ));
        setJoiningCommunity(null);
        return;
      }

      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setUserMemberships(prev => prev.filter(id => id !== communityId));
      await loadCommunities(); // Recarregar para atualizar contadores
    } catch (error) {
      console.error('Erro ao sair da comunidade:', error);
      alert('Erro ao sair da comunidade. Tente novamente.');
    } finally {
      setJoiningCommunity(null);
    }
  };

  const handleViewCommunity = (communityId: string) => {
    navigate(`/comunidade/${communityId}`);
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
    const matchesParticipation = !showOnlyParticipating || userMemberships.includes(community.id);
    return matchesSearch && matchesCategory && matchesParticipation;
  });

  const getRecommendedCommunities = () => {
    if (!userPreferences?.interests) return [];

    return filteredCommunities.filter(community => 
      userPreferences.interests.includes(community.category)
    );
  };

  const categories = [
    { value: 'all', label: 'Todas', icon: Users },
    { value: 'arte', label: 'Arte', icon: Palette },
    { value: 'gastronomia', label: 'Gastronomia', icon: Utensils },
    { value: 'musica', label: 'Música', icon: Music },
    { value: 'bem-estar', label: 'Bem-estar', icon: Heart },
    { value: 'cultura', label: 'Cultura', icon: BookOpen }
  ];

  const recommendedCommunities = getRecommendedCommunities();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C91F1F] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando comunidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col space-y-4">
          {/* Search and Participation Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar comunidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent"
              />
            </div>

            {/* Participation Filter */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowOnlyParticipating(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !showOnlyParticipating
                    ? 'bg-[#C91F1F] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setShowOnlyParticipating(true)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showOnlyParticipating
                    ? 'bg-[#C91F1F] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Participando ({userMemberships.length})
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.value;
              
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#C91F1F] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Communities */}
      {recommendedCommunities.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Star className="w-5 h-5 text-[#F6C100]" />
            <h2 className="text-xl font-bold text-gray-900">Recomendadas para Você</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCommunities.map((community) => {
              const Icon = communityIcons[community.category] || Users;
              const colors = communityColors[community.category] || communityColors['cultura'];
              const isMember = userMemberships.includes(community.id);
              const isJoining = joiningCommunity === community.id;
              
              return (
                <div key={community.id} className="bg-white rounded-xl shadow-sm border-2 border-[#F6C100] p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <div className="flex items-center space-x-1 text-[#F6C100]">
                      <Crown className="w-4 h-4" />
                      <span className="text-xs font-medium">Recomendada</span>
                    </div>
                  </div>
                  
                  <h3 
                    className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-[#C91F1F] transition-colors"
                    onClick={() => handleViewCommunity(community.id)}
                  >
                    {community.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{community.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{community.member_count.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => isMember ? handleLeaveCommunity(community.id) : handleJoinCommunity(community.id)}
                      disabled={isJoining}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        isMember
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white hover:shadow-lg'
                      } ${isJoining ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isJoining ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      ) : isMember ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          <span>Sair</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Participar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Communities */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedCategory === 'all' ? 'Todas as Comunidades' : `Comunidades de ${categories.find(c => c.value === selectedCategory)?.label}`}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredCommunities.length} {filteredCommunities.length === 1 ? 'comunidade' : 'comunidades'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => {
            const Icon = communityIcons[community.category] || Users;
            const colors = communityColors[community.category] || communityColors['cultura'];
            const isMember = userMemberships.includes(community.id);
            const isJoining = joiningCommunity === community.id;
            const isRecommended = recommendedCommunities.some(rc => rc.id === community.id);
            
            return (
              <div key={community.id} className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow ${
                isRecommended ? 'border-2 border-[#F6C100]' : 'border border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  {isMember && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium">Membro</span>
                    </div>
                  )}
                </div>
                
                <h3 
                  className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-[#C91F1F] transition-colors"
                  onClick={() => handleViewCommunity(community.id)}
                >
                  {community.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{community.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{community.member_count.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => isMember ? handleLeaveCommunity(community.id) : handleJoinCommunity(community.id)}
                    disabled={isJoining}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isMember
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white hover:shadow-lg'
                    } ${isJoining ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isJoining ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    ) : isMember ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        <span>Sair</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Participar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma comunidade encontrada</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Tente ajustar sua busca' : 'Não há comunidades nesta categoria'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}