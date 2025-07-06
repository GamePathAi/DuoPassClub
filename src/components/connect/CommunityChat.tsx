import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  ArrowLeft,
  Users,
  User,
  MoreVertical,
  Phone,
  Video,
  Hash
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Community, CommunityMember } from '../../types/community';

interface CommunityMessage {
  id: string;
  community_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  message_type: 'text' | 'image' | 'system';
  created_at: string;
}

interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image';
  read_at?: string;
  created_at: string;
}

interface CommunityChatProps {
  community: Community;
  onClose: () => void;
  initialChatType?: 'group' | 'direct';
  initialMember?: CommunityMember;
}

// Mock data para demonstração - movido para fora do componente
const createMockGroupMessages = (communityId: string): CommunityMessage[] => [
    {
      id: 'group-msg-1',
      community_id: communityId,
      sender_id: 'user-1',
      sender_name: 'Ana Silva',
      sender_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      content: 'Pessoal, alguém foi na exposição do MASP hoje? Estava pensando em ir amanhã!',
      message_type: 'text',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'group-msg-2',
      community_id: communityId,
      sender_id: 'user-2',
      sender_name: 'Carlos Mendes',
      sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'Eu fui ontem! A curadoria está incrível. Recomendo muito!',
      message_type: 'text',
      created_at: new Date(Date.now() - 3000000).toISOString()
    },
    {
      id: 'group-msg-3',
      community_id: communityId,
      sender_id: 'user-3',
      sender_name: 'Maria Santos',
      sender_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'Que tal formarmos um grupo para ir juntos no fim de semana? 🎨',
      message_type: 'text',
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'group-msg-4',
      community_id: communityId,
      sender_id: 'demo-user-id',
      sender_name: 'Você',
      sender_avatar: 'https://ui-avatars.com/api/?name=Demo&background=C91F1F&color=fff',
      content: 'Adorei a ideia! Podemos nos encontrar lá sábado às 14h?',
      message_type: 'text',
      created_at: new Date(Date.now() - 900000).toISOString()
    }
];

const createMockDirectMessages = (memberId: string): DirectMessage[] => [
    {
      id: 'direct-msg-1',
      sender_id: memberId,
      receiver_id: 'demo-user-id',
      content: 'Oi! Vi que você também está interessado na exposição. Que bom!',
      message_type: 'text',
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'direct-msg-2',
      sender_id: 'demo-user-id',
      receiver_id: memberId,
      content: 'Sim! Adoro arte contemporânea. Você já foi em outras exposições recentes?',
      message_type: 'text',
      read_at: new Date(Date.now() - 1500000).toISOString(),
      created_at: new Date(Date.now() - 1500000).toISOString()
    },
    {
      id: 'direct-msg-3',
      sender_id: memberId,
      receiver_id: 'demo-user-id',
      content: 'Fui na Pinacoteca semana passada. Tem uma exposição de fotografia incrível lá!',
      message_type: 'text',
      created_at: new Date(Date.now() - 600000).toISOString()
    }
];

export function CommunityChat({ community, onClose, initialChatType = 'group', initialMember }: CommunityChatProps) {
  const { user } = useAuth();
  const [chatType, setChatType] = useState<'group' | 'direct'>(initialChatType);
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(initialMember || null);
  const [groupMessages, setGroupMessages] = useState<CommunityMessage[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setGroupMessages(createMockGroupMessages(community.id));
      if (selectedMember) {
        setDirectMessages(createMockDirectMessages(selectedMember.user_id));
      }
      setLoading(false);
    }, 1000);
  }, [community.id, selectedMember]);

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages, directMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || sendingMessage) return;

    setSendingMessage(true);
    try {
      const messageContent = newMessage.trim();
      setNewMessage('');

      if (chatType === 'group') {
        const newMsg: CommunityMessage = {
          id: `group-msg-${Date.now()}`,
          community_id: community.id,
          sender_id: user.id,
          sender_name: 'Você',
          sender_avatar: 'https://ui-avatars.com/api/?name=Demo&background=C91F1F&color=fff',
          content: messageContent,
          message_type: 'text',
          created_at: new Date().toISOString()
        };
        setGroupMessages(prev => [...prev, newMsg]);
      } else if (selectedMember) {
        const newMsg: DirectMessage = {
          id: `direct-msg-${Date.now()}`,
          sender_id: user.id,
          receiver_id: selectedMember.user_id,
          content: messageContent,
          message_type: 'text',
          created_at: new Date().toISOString()
        };
        setDirectMessages(prev => [...prev, newMsg]);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const startDirectChat = (member: CommunityMember) => {
    setSelectedMember(member);
    setChatType('direct');
    setDirectMessages(createMockDirectMessages(member.user_id));
  };

  const currentMessages = chatType === 'group' ? groupMessages : directMessages;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C91F1F]"></div>
            <span className="ml-3 text-gray-600">Carregando chat...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                {chatType === 'group' ? (
                  <>
                    <Hash className="w-5 h-5 text-[#C91F1F]" />
                    <div>
                      <h3 className="font-medium text-gray-900">{community.name}</h3>
                      <p className="text-sm text-gray-500">Chat da Comunidade • {community.memberCount} membros</p>
                    </div>
                  </>
                ) : selectedMember ? (
                  <>
                    <img
                      src={selectedMember.avatar}
                      alt={selectedMember.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedMember.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedMember.isOnline ? 'Online agora' : 'Offline'}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Toggle entre chat em grupo e lista de membros */}
              <button
                onClick={() => {
                  if (chatType === 'group') {
                    setChatType('direct');
                    setSelectedMember(null);
                  } else {
                    setChatType('group');
                    setSelectedMember(null);
                  }
                }}
                className={`p-2 rounded-lg transition-colors ${
                  chatType === 'group' 
                    ? 'bg-[#C91F1F] text-white' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
              </button>
              
              {chatType === 'direct' && selectedMember && (
                <>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Video className="w-5 h-5" />
                  </button>
                </>
              )}
              
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Lista de Membros (quando em modo direct sem membro selecionado) */}
          {chatType === 'direct' && !selectedMember && (
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Membros da Comunidade</h4>
                <p className="text-sm text-gray-500">Clique em um membro para iniciar uma conversa</p>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {community.members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => startDirectChat(member)}
                    className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                        {member.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 truncate">{member.name}</h5>
                        <p className="text-sm text-gray-500 truncate">
                          {member.interests.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Área de Chat */}
          {(chatType === 'group' || (chatType === 'direct' && selectedMember)) && (
            <div className="flex-1 flex flex-col">
              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((message) => {
                  const isOwn = chatType === 'group' 
                    ? message.sender_id === user?.id
                    : (message as DirectMessage).sender_id === user?.id;
                  
                  return (
                    <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${isOwn ? '' : 'flex items-start space-x-2'}`}>
                        {!isOwn && chatType === 'group' && (
                          <img
                            src={(message as CommunityMessage).sender_avatar}
                            alt={(message as CommunityMessage).sender_name}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                        )}
                        
                        <div className={`px-4 py-2 rounded-2xl ${
                          isOwn 
                            ? 'bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          {!isOwn && chatType === 'group' && (
                            <p className="text-xs font-medium mb-1 opacity-70">
                              {(message as CommunityMessage).sender_name}
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end mt-1 ${
                            isOwn ? 'text-white text-opacity-70' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">{formatTime(message.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input de Mensagem */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Mensagem para ${chatType === 'group' ? community.name : selectedMember?.name}...`}
                      rows={1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent resize-none"
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className={`p-2 rounded-lg transition-colors ${
                      newMessage.trim() && !sendingMessage
                        ? 'bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Estado vazio quando em modo direct sem membro selecionado */}
          {chatType === 'direct' && !selectedMember && community.members.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum membro disponível</h3>
                <p className="text-gray-500">Esta comunidade ainda não possui outros membros para conversar.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}