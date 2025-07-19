import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Search, 
  Check, 
  CheckCheck,
  Plus,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { supabase } from '../../lib/supabaseConfig';
import { useAuth } from '../../contexts/AuthContext';

interface Connection {
  id: string;
  user1_id: string;
  user2_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'system';
  read_at?: string;
  created_at: string;
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  lastSeen?: string;
  isOnline?: boolean;
}

interface Conversation {
  connection: Connection;
  otherUser: ChatUser;
  lastMessage?: Message;
  unreadCount: number;
}

export default function MemberChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função para scroll automático
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Função para carregar mensagens
  const loadMessages = async (connectionId: string) => {
    if (!user) return;

    try {
      // Para usuário demo, usar mensagens mock
      if (user.id === 'demo-user-id') {
        const mockMessages: Record<string, Message[]> = {
          'conn-1': [
            {
              id: 'msg-1-1',
              connection_id: 'conn-1',
              sender_id: 'user-2',
              content: 'Oi! Vi que você também adora arte moderna. Que coincidência!',
              message_type: 'text',
              created_at: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: 'msg-1-2',
              connection_id: 'conn-1',
              sender_id: 'demo-user-id',
              content: 'Oi Ana! Sim, é uma paixão mesmo. Você foi na exposição do MASP recentemente?',
              message_type: 'text',
              read_at: new Date(Date.now() - 82800000).toISOString(),
              created_at: new Date(Date.now() - 82800000).toISOString()
            },
            {
              id: 'msg-1-3',
              connection_id: 'conn-1',
              sender_id: 'user-2',
              content: 'Fui sim! Adorei a curadoria. Você tem alguma galeria favorita na cidade?',
              message_type: 'text',
              created_at: new Date(Date.now() - 79200000).toISOString()
            },
            {
              id: 'msg-1-4',
              connection_id: 'conn-1',
              sender_id: 'demo-user-id',
              content: 'Tenho várias! A Galeria Vermelho e a Nara Roesler são incríveis. Que tal irmos juntos na próxima exposição?',
              message_type: 'text',
              read_at: new Date(Date.now() - 75600000).toISOString(),
              created_at: new Date(Date.now() - 75600000).toISOString()
            },
            {
              id: 'msg-1-5',
              connection_id: 'conn-1',
              sender_id: 'user-2',
              content: 'Adorei a exposição de arte moderna! Quando podemos ir juntos na próxima?',
              message_type: 'text',
              created_at: new Date(Date.now() - 3600000).toISOString()
            }
          ],
          'conn-2': [
            {
              id: 'msg-2-1',
              connection_id: 'conn-2',
              sender_id: 'user-3',
              content: 'E aí! Vi que você curte gastronomia também. Conhece algum lugar bom para um jantar especial?',
              message_type: 'text',
              created_at: new Date(Date.now() - 172800000).toISOString()
            },
            {
              id: 'msg-2-2',
              connection_id: 'conn-2',
              sender_id: 'demo-user-id',
              content: 'Oi Carlos! Conheço sim. O D.O.M. e o Maní são fantásticos. Que tipo de culinária você prefere?',
              message_type: 'text',
              read_at: new Date(Date.now() - 169200000).toISOString(),
              created_at: new Date(Date.now() - 169200000).toISOString()
            },
            {
              id: 'msg-2-3',
              connection_id: 'conn-2',
              sender_id: 'user-3',
              content: 'Gosto muito de culinária contemporânea brasileira. O D.O.M. está na minha lista há tempos!',
              message_type: 'text',
              created_at: new Date(Date.now() - 165600000).toISOString()
            },
            {
              id: 'msg-2-4',
              connection_id: 'conn-2',
              sender_id: 'demo-user-id',
              content: 'Perfeito! Vamos marcar para sábado então.',
              message_type: 'text',
              read_at: new Date(Date.now() - 1800000).toISOString(),
              created_at: new Date(Date.now() - 7200000).toISOString()
            }
          ],
          'conn-3': [
            {
              id: 'msg-3-1',
              connection_id: 'conn-3',
              sender_id: 'user-4',
              content: 'Oi! Que bom encontrar alguém que também valoriza o bem-estar. Você tem algum spa favorito?',
              message_type: 'text',
              created_at: new Date(Date.now() - 259200000).toISOString()
            },
            {
              id: 'msg-3-2',
              connection_id: 'conn-3',
              sender_id: 'demo-user-id',
              content: 'Oi Marina! Sim, adoro cuidar do bem-estar. O Spa L\'Occitane e o Kurotel são incríveis.',
              message_type: 'text',
              read_at: new Date(Date.now() - 255600000).toISOString(),
              created_at: new Date(Date.now() - 255600000).toISOString()
            },
            {
              id: 'msg-3-3',
              connection_id: 'conn-3',
              sender_id: 'user-4',
              content: 'Que experiência incrível no spa! Obrigada pela companhia 🧘‍♀️',
              message_type: 'text',
              created_at: new Date(Date.now() - 86400000).toISOString()
            }
          ]
        };
        
        setMessages(mockMessages[connectionId] || []);
        return;
      }

      // Carregar mensagens reais do banco
      const { data, error } = await supabase
        .from('member_messages')
        .select('*')
        .eq('connection_id', connectionId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  // useCallback para loadMessages
  const loadMessagesCallback = React.useCallback(loadMessages, [user]);

  // useEffect para carregar conversas iniciais
  useEffect(() => {
    console.log('🤝 Carregando conversas...');
    
    // Mock conversations conectadas com as mensagens
    const mockConversations: Conversation[] = [
      {
        connection: {
          id: 'conn-1',
          user1_id: 'demo-user-id',
          user2_id: 'user-2',
          status: 'accepted',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString()
        },
        otherUser: {
          id: 'user-2',
          name: 'Ana Silva',
          avatar: '🎭',
          isOnline: true,
          lastSeen: new Date(Date.now() - 1800000).toISOString()
        },
        lastMessage: {
          id: 'msg-1-5',
          connection_id: 'conn-1',
          sender_id: 'user-2',
          content: 'Adorei a exposição de arte moderna! Quando podemos ir juntos na próxima?',
          message_type: 'text',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        unreadCount: 2
      },
      {
        connection: {
          id: 'conn-2',
          user1_id: 'demo-user-id',
          user2_id: 'user-3',
          status: 'accepted',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 7200000).toISOString()
        },
        otherUser: {
          id: 'user-3',
          name: 'Pedro Santos',
          avatar: '🎵',
          isOnline: false,
          lastSeen: new Date(Date.now() - 18000000).toISOString()
        },
        lastMessage: {
          id: 'msg-2-4',
          connection_id: 'conn-2',
          sender_id: 'demo-user-id',
          content: 'Perfeito! Vamos marcar para sábado então.',
          message_type: 'text',
          read_at: new Date(Date.now() - 1800000).toISOString(),
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        unreadCount: 0
      },
      {
        connection: {
          id: 'conn-3',
          user1_id: 'demo-user-id',
          user2_id: 'user-4',
          status: 'accepted',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        otherUser: {
          id: 'user-4',
          name: 'Clara Oliveira',
          avatar: '🍷',
          isOnline: false,
          lastSeen: new Date(Date.now() - 86400000).toISOString()
        },
        lastMessage: {
          id: 'msg-3-3',
          connection_id: 'conn-3',
          sender_id: 'user-4',
          content: 'Que experiência incrível no spa! Obrigada pela companhia 🧘‍♀️',
          message_type: 'text',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        unreadCount: 1
      }
    ];
    
    setConversations(mockConversations);
    setLoading(false);
    console.log('✅ Conversas carregadas:', mockConversations.length);
  }, []);

  // useEffect para carregar mensagens quando conversa é selecionada
  useEffect(() => {
    if (selectedConversation) {
      console.log('📨 Carregando mensagens para:', selectedConversation.connection.id);
      loadMessagesCallback(selectedConversation.connection.id);
    }
  }, [selectedConversation, loadMessagesCallback]);

  // useEffect para scroll automático
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup effect para typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user || sendingMessage) return;

    setSendingMessage(true);
    try {
      const messageContent = newMessage.trim();
      setNewMessage('');

      // Para usuário demo, simular envio
      if (user.id === 'demo-user-id') {
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          connection_id: selectedConversation.connection.id,
          sender_id: user.id,
          content: messageContent,
          message_type: 'text',
          created_at: new Date().toISOString()
        };
        
        // Adicionar mensagem à lista
        setMessages(prev => [...prev, newMsg]);
        
        // Atualizar última mensagem na conversa
        setConversations(prev => prev.map(conv => 
          conv.connection.id === selectedConversation.connection.id
            ? {
                ...conv,
                lastMessage: newMsg,
                unreadCount: 0 // Reset unread count for current user
              }
            : conv
        ));
        
        console.log('✅ Mensagem enviada:', messageContent);
        setSendingMessage(false);
        return;
      }

      // Enviar mensagem real
      const { error } = await supabase
        .from('member_messages')
        .insert({
          connection_id: selectedConversation.connection.id,
          sender_id: user.id,
          content: messageContent,
          message_type: 'text'
        });

      if (error) {
        throw error;
      }

      // Recarregar mensagens
      await loadMessages(selectedConversation.connection.id);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Função para simular indicador de digitação
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      console.log('👤 Usuário começou a digitar...');
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      console.log('👤 Usuário parou de digitar');
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      sendMessage();
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    handleTyping();
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

  const filteredConversations = conversations.filter(conv => 
    conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C91F1F] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex">
      {/* Sidebar - Lista de Conversas */}
      <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-80 border-r border-gray-200`}>
        {/* Header da Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Conversas</h2>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Lista de Conversas */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conversa ainda</h3>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Nenhuma conversa encontrada' : 'Conecte-se com outros membros para começar a conversar'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.connection.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                  selectedConversation?.connection.id === conversation.connection.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={conversation.otherUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.otherUser.name)}&background=C91F1F&color=fff`}
                      alt={conversation.otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.otherUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{conversation.otherUser.name}</h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessage.created_at)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage?.content || 'Nenhuma mensagem ainda'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-[#C91F1F] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Header do Chat */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <img
                    src={selectedConversation.otherUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.otherUser.name)}&background=C91F1F&color=fff`}
                    alt={selectedConversation.otherUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedConversation.otherUser.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">{selectedConversation.otherUser.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.otherUser.isOnline 
                      ? 'Online agora' 
                      : selectedConversation.otherUser.lastSeen 
                      ? `Visto por último ${formatTime(selectedConversation.otherUser.lastSeen)}`
                      : 'Offline'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              
              return (
                <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isOwn 
                      ? 'bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end mt-1 space-x-1 ${
                      isOwn ? 'text-white text-opacity-70' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{formatTime(message.created_at)}</span>
                      {isOwn && (
                        message.read_at ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Indicador de digitação */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl max-w-xs">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Digitando</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Mensagem */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={handleMessageChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
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
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
            <p className="text-gray-500">Escolha uma conversa da lista para começar a trocar mensagens</p>
          </div>
        </div>
      )}
    </div>
  );
}