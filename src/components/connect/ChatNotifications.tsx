import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Users, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatNotification {
  id: string;
  type: 'community' | 'direct';
  title: string;
  message: string;
  avatar?: string;
  timestamp: string;
  communityId?: string;
  senderId?: string;
  isRead: boolean;
}

interface ChatNotificationsProps {
  onNotificationClick?: (notification: ChatNotification) => void;
}

// Mock notifications para demonstração
const mockNotifications: ChatNotification[] = [
  {
    id: 'notif-1',
    type: 'community',
    title: 'Arte & Design',
    message: 'Ana Silva: Pessoal, alguém foi na exposição do MASP hoje?',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutos atrás
    communityId: 'arte-design',
    senderId: 'user-1',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'direct',
    title: 'Carlos Mendes',
    message: 'Oi! Vi que você também está interessado na exposição...',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutos atrás
    senderId: 'user-2',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'community',
    title: 'Gastronomia Premium',
    message: 'Maria Santos: Que tal formarmos um grupo para jantar no D.O.M.?',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutos atrás
    communityId: 'gastronomia',
    senderId: 'user-3',
    isRead: true
  }
];

export function ChatNotifications({ onNotificationClick }: ChatNotificationsProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simular carregamento de notificações
    if (user?.id === 'demo-user-id') {
      setNotifications(mockNotifications);
    }
  }, [user]);

  // Simular chegada de novas notificações
  useEffect(() => {
    if (user?.id !== 'demo-user-id') return;

    const interval = setInterval(() => {
      // Simular nova notificação ocasionalmente
      if (Math.random() > 0.8) {
        const newNotification: ChatNotification = {
          id: `notif-${Date.now()}`,
          type: Math.random() > 0.5 ? 'community' : 'direct',
          title: Math.random() > 0.5 ? 'Arte & Design' : 'Pedro Santos',
          message: 'Nova mensagem recebida...',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          timestamp: new Date().toISOString(),
          isRead: false
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Manter apenas 10 notificações
      }
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: ChatNotification) => {
    // Marcar como lida
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
    
    // Callback para abrir o chat
    onNotificationClick?.(notification);
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotification = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) {
      return 'Agora';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  return (
    <div className="relative">
      {/* Botão de Notificações */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Mensagens</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#C91F1F] hover:text-red-700 font-medium"
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Nenhuma mensagem nova</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      {notification.type === 'community' ? (
                        <div className="w-10 h-10 bg-[#C91F1F] rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <img
                          src={notification.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.title)}&background=C91F1F&color=fff`}
                          alt={notification.title}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                      {!notification.isRead && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium truncate ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          <button
                            onClick={(e) => clearNotification(notification.id, e)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className={`text-sm truncate mt-1 ${
                        !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center mt-1">
                        {notification.type === 'community' ? (
                          <span className="inline-flex items-center space-x-1 text-xs text-[#C91F1F]">
                            <Users className="w-3 h-3" />
                            <span>Chat da Comunidade</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs text-blue-600">
                            <User className="w-3 h-3" />
                            <span>Mensagem Direta</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button className="text-sm text-[#C91F1F] hover:text-red-700 font-medium">
                Ver todas as mensagens
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay para fechar dropdown */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        ></div>
      )}
    </div>
  );
}