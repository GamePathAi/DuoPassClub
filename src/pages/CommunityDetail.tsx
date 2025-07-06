import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  ArrowLeft,
  UserMinus,
  MessageCircle,
  Heart,
  Share2,
  Send,
  Image as ImageIcon,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Community, CommunityMember, CommunityActivity } from '../types/community';
import { CommunityChat } from '../components/connect/CommunityChat';

// Mock data para demonstração
const createMockCommunity = (id: string): Community => ({
  id: id || 'arte-design',
  name: 'Arte & Design',
  description: 'Explore museus, galerias e exposições com pessoas que compartilham sua paixão pela arte visual e design contemporâneo.',
  category: 'arte',
  memberCount: 1247,
  coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=400&fit=crop',
  members: [
    {
      id: '1',
      name: 'Ana Silva',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      interests: ['Arte Contemporânea', 'Fotografia', 'Design'],
      joinedAt: '2024-01-15',
      isOnline: true,
      user_id: 'user-1',
      bio: 'Apaixonada por arte contemporânea e fotografia urbana.'
    },
    {
      id: '2',
      name: 'Carlos Mendes',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      interests: ['Pintura', 'Escultura', 'História da Arte'],
      joinedAt: '2024-02-03',
      isOnline: false,
      user_id: 'user-2',
      bio: 'Artista plástico e professor de história da arte.'
    },
    {
      id: '3',
      name: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      interests: ['Design Gráfico', 'Ilustração', 'Arte Digital'],
      joinedAt: '2024-01-28',
      isOnline: true,
      user_id: 'user-3',
      bio: 'Designer gráfica especializada em identidade visual.'
    }
  ],
  activities: [
    {
      id: '1',
      type: 'experience_share',
      author: {
        id: '1',
        name: 'Ana Silva',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        interests: ['Arte Contemporânea'],
        joinedAt: '2024-01-15',
        isOnline: true,
        user_id: 'user-1'
      },
      content: 'Acabei de visitar a exposição "Vanguardas Contemporâneas" no Museu de Arte Moderna. Simplesmente incrível! As obras de Beatriz Milhazes estão espetaculares. Quem mais foi ou pretende ir?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 12,
      comments: 5,
      community_id: id || 'arte-design',
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop']
    },
    {
      id: '2',
      type: 'event',
      author: {
        id: '2',
        name: 'Carlos Mendes',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        interests: ['Pintura'],
        joinedAt: '2024-02-03',
        isOnline: false,
        user_id: 'user-2'
      },
      content: '🎨 Workshop de Pintura em Aquarela - Sábado, 14h às 17h na Galeria Central. Vagas limitadas! Quem tem interesse em participar? Vamos formar um grupo da comunidade!',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      comments: 3,
      community_id: id || 'arte-design'
    },
    {
      id: '3',
      type: 'discussion',
      author: {
        id: '3',
        name: 'Maria Santos',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        interests: ['Design Gráfico'],
        joinedAt: '2024-01-28',
        isOnline: true,
        user_id: 'user-3'
      },
      content: 'O que vocês acham da influência da arte digital na arte tradicional? Tenho notado uma convergência interessante entre as duas formas de expressão...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      likes: 15,
      comments: 8,
      community_id: id || 'arte-design'
    }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

export function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activities' | 'members'>('activities');
  const [newPost, setNewPost] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatType, setChatType] = useState<'group' | 'direct'>('group');
  const [selectedChatMember, setSelectedChatMember] = useState<CommunityMember | null>(null);


  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      const mockCommunity = createMockCommunity(id || 'arte-design');
      setCommunity(mockCommunity);
      setIsMember(true); // Simular que o usuário é membro
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleLeaveCommunity = async () => {
    if (!community) return;
    
    // Simular saída da comunidade
    setIsMember(false);
    setCommunity(prev => prev ? {
      ...prev,
      memberCount: prev.memberCount - 1
    } : null);
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !community || !user) return;
    
    setIsPosting(true);
    
    // Simular criação de post
    const newActivity: CommunityActivity = {
      id: Date.now().toString(),
      type: 'post',
      author: {
        id: user.id,
        name: user.email?.split('@')[0] || 'Usuário',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        interests: ['Arte'],
        joinedAt: new Date().toISOString(),
        isOnline: true,
        user_id: user.id
      },
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      community_id: community.id
    };
    
    setCommunity(prev => prev ? {
      ...prev,
      activities: [newActivity, ...prev.activities]
    } : null);
    
    setNewPost('');
    setIsPosting(false);
  };

  const handleOpenGroupChat = () => {
    setChatType('group');
    setSelectedChatMember(null);
    setShowChat(true);
  };

  const handleOpenDirectChat = (member: CommunityMember) => {
    setChatType('direct');
    setSelectedChatMember(member);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedChatMember(null);
  };

  const handleStartChat = (member: CommunityMember) => {
    // Navegar para o chat com o membro
    navigate('/dashboard?tab=connect&chat=' + member.user_id);
  };

  const getActivityIcon = (type: CommunityActivity['type']) => {
    switch (type) {
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'experience_share': return <Share2 className="w-4 h-4" />;
      case 'discussion': return <MessageCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getActivityTypeLabel = (type: CommunityActivity['type']) => {
    switch (type) {
      case 'event': return 'Evento';
      case 'experience_share': return 'Experiência';
      case 'discussion': return 'Discussão';
      default: return 'Post';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C91F1F]"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Comunidade não encontrada</h1>
          <button
            onClick={() => navigate('/dashboard?tab=connect')}
            className="text-[#C91F1F] hover:underline"
          >
            Voltar às comunidades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header da Comunidade */}
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${community.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate('/dashboard?tab=connect')}
            className="flex items-center space-x-2 bg-white bg-opacity-90 text-gray-900 px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{community.name}</h1>
                <p className="text-lg opacity-90 mb-4">{community.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{community.memberCount.toLocaleString()} membros</span>
                  </div>
                </div>
              </div>
              
              {isMember && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleOpenGroupChat}
                    className="flex items-center space-x-2 bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat da Comunidade</span>
                  </button>
                  
                  <button
                    onClick={handleLeaveCommunity}
                    className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>Sair da Comunidade</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('activities')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'activities'
                        ? 'border-[#C91F1F] text-[#C91F1F]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Atividades
                  </button>
                  <button
                    onClick={() => setActiveTab('members')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'members'
                        ? 'border-[#C91F1F] text-[#C91F1F]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Membros
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'activities' && (
                  <div className="space-y-6">
                    {/* Criar Post */}
                    {isMember && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <textarea
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          placeholder="Compartilhe algo com a comunidade..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent resize-none"
                          rows={3}
                        />
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                              <ImageIcon className="w-4 h-4" />
                              <span className="text-sm">Foto</span>
                            </button>
                          </div>
                          <button
                            onClick={handleCreatePost}
                            disabled={!newPost.trim() || isPosting}
                            className="flex items-center space-x-2 bg-[#C91F1F] text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isPosting ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            <span>Publicar</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Feed de Atividades */}
                    <div className="space-y-4">
                      {community.activities.map((activity) => (
                        <div key={activity.id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start space-x-3">
                            <img
                              src={activity.author.avatar}
                              alt={activity.author.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-gray-900">{activity.author.name}</h4>
                                <span className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {getActivityIcon(activity.type)}
                                  <span>{getActivityTypeLabel(activity.type)}</span>
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(activity.timestamp).toLocaleString('pt-BR')}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 mb-3">{activity.content}</p>
                              
                              {activity.images && activity.images.length > 0 && (
                                <div className="mb-3">
                                  <img
                                    src={activity.images[0]}
                                    alt="Post image"
                                    className="rounded-lg max-w-md w-full h-48 object-cover"
                                  />
                                </div>
                              )}
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <button className="flex items-center space-x-1 hover:text-red-600">
                                  <Heart className="w-4 h-4" />
                                  <span>{activity.likes}</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-blue-600">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{activity.comments}</span>
                                </button>
                                <button className="flex items-center space-x-1 hover:text-green-600">
                                  <Share2 className="w-4 h-4" />
                                  <span>Compartilhar</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'members' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {community.members.map((member) => (
                      <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-12 h-12 rounded-full"
                            />
                            {member.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{member.name}</h4>
                            <p className="text-sm text-gray-600 mb-2">{member.bio}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {member.interests.slice(0, 2).map((interest, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                            {isMember && member.user_id !== user?.id && (
                              <button
                                onClick={() => handleOpenDirectChat(member)}
                                className="flex items-center space-x-1 text-[#C91F1F] hover:text-red-700 text-sm font-medium"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>Conversar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Membros</span>
                  <span className="font-medium">{community.memberCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posts hoje</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Membros online</span>
                  <span className="font-medium text-green-600">89</span>
                </div>
              </div>
            </div>

            {/* Membros Online */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Membros Online</h3>
              <div className="space-y-3">
                {community.members.filter(m => m.isOnline).slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    </div>
                    <button
                      onClick={() => handleStartChat(member)}
                      className="text-[#C91F1F] hover:text-red-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Modal */}
      {showChat && community && (
        <CommunityChat
          community={community}
          onClose={handleCloseChat}
          initialChatType={chatType}
          initialMember={selectedChatMember}
        />
      )}
    </div>
  );
}