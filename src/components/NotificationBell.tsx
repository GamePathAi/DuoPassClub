import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock notifications para consumidor cultural
const mockNotifications = [
  {
    id: 1,
    type: 'experience_invite',
    title: '🤝 Convite para experiência',
    message: 'Ana Silva te convidou para "Arte Contemporânea"',
    time: '2h atrás',
    read: false,
    priority: 'high',
    cta: 'Ver Convite',
    action: '/dashboard?tab=connect'
  },
  {
    id: 2,
    type: 'voucher_expiring',
    title: '⏰ Voucher expirando',
    message: 'Seu voucher "Teatro Experimental" expira em 24h',
    time: '5h atrás',
    read: false,
    priority: 'high',
    cta: 'Usar Voucher',
    action: '/vouchers'
  },
  {
    id: 3,
    type: 'new_experience',
    title: '🎭 Nova experiência disponível',
    message: 'Concerto de Piano clássico agora disponível',
    time: '1 dia atrás',
    read: true,
    priority: 'medium',
    cta: 'Ver Experiência',
    action: '/ofertas'
  }
];

const getNotificationIcon = (type: string) => {
  const iconMap: { [key: string]: string } = {
    'experience_invite': '🤝',
    'voucher_expiring': '⏰',
    'new_experience': '🎭',
    'connection_invitation': '🤝',
    'curated_experience': '🎭',
    'local_partner': '☕',
    'shared_memory': '✨',
    'community_building': '👥',
    'presence_reminder': '🌟',
    'offer_new': '🎁',
    'offer_expiring': '⏰',
    'voucher_redeemed': '💰',
    'voucher_available': '🎫',
    'achievement_unlocked': '🏆',
    'level_up': '⭐',
    'goal_reached': '🎯',
    'system_update': '📱',
    'profile_reminder': '👤',
    'business_performance': '📊',
    'offer_management': '💼',
    'business_opportunity': '🎯',
    'system_merchant': '⚙️',
    'payment_processed': '💳'
  };
  return iconMap[type] || '📢';
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'border-l-orange-500 bg-orange-50';
    case 'medium': return 'border-l-purple-500 bg-purple-50';
    case 'low': return 'border-l-gray-400 bg-gray-50';
    default: return 'border-l-gray-400 bg-gray-50';
  }
};



export function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calcular notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Filtrar notificações
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'experiences') return ['experience_invite', 'new_experience'].includes(notification.type);
    if (filter === 'community') return ['community_building', 'shared_memory'].includes(notification.type);
    if (filter === 'reminders') return ['voucher_expiring', 'presence_reminder'].includes(notification.type);
    return true;
  });

  // Marcar como lida
  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Navegar para ação
  const handleAction = (notification: typeof mockNotifications[0]) => {
    markAsRead(notification.id);
    navigate(notification.action);
    setIsOpen(false);
  };

  // Convidar alguém (para notificações de experiência)
  const handleInvite = (notification: typeof mockNotifications[0]) => {
    // Lógica para convidar alguém
    console.log('Convidando alguém para:', notification.title);
    markAsRead(notification.id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-all duration-200 ${
          unreadCount > 0 
            ? 'text-orange-500 hover:bg-orange-50' 
            : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
        }`}
        title="Notificações"
      >
        <Bell className={`w-6 h-6 transition-transform ${
          isOpen ? 'scale-110' : 'scale-100'
        }`} />
        
        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-purple-50">
            <h3 className="font-semibold text-gray-900">DUO PASS Notificações</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1"
                  title="Marcar todas como lidas"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Marcar todas</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-2 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  filter === 'all' 
                    ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('experiences')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  filter === 'experiences' 
                    ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                🎭 Experiências
              </button>
              <button
                onClick={() => setFilter('community')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  filter === 'community' 
                    ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                👥 Comunidade
              </button>
              <button
                onClick={() => setFilter('reminders')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  filter === 'reminders' 
                    ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                🌟 Lembretes
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Nenhuma notificação {filter !== 'all' ? 'nesta categoria' : ''}</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? `border-l-4 ${getPriorityColor(notification.priority)}` : 'bg-white'
                  }`}
                  onClick={() => handleAction(notification)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-medium text-gray-900 ${
                          !notification.read ? 'font-semibold' : ''
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          {/* Botão CTA principal */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(notification);
                            }}
                            className="text-xs bg-gradient-to-r from-orange-500 to-purple-600 text-white px-3 py-1 rounded-full hover:from-orange-600 hover:to-purple-700 transition-all font-medium shadow-sm"
                          >
                            {notification.cta}
                          </button>
                          
                          {/* Botão Convidar para experiências */}
                          {['experience_invite'].includes(notification.type) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInvite(notification);
                              }}
                              className="text-xs bg-white border border-orange-300 text-orange-600 px-2 py-1 rounded-full hover:bg-orange-50 transition-all flex items-center space-x-1"
                              title="Responder convite"
                            >
                              <Users className="w-3 h-3" />
                              <span>Responder</span>
                            </button>
                          )}
                          
                          {/* Botão marcar como lida */}
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-xs text-gray-400 hover:text-gray-600 p-1"
                              title="Marcar como lida"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-orange-50 to-purple-50 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
              </div>
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1"
              >
                <span>Ver todas</span>
                <span>→</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}