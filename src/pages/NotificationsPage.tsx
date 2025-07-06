import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, /* Filter, */ Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// import { useNotifications } from '../hooks/useNotifications';

import { NotificationDemo } from '../components/NotificationDemo';
// import { Notification } from '../types/notification';

const getNotificationIcon = (type: string) => {
  const iconMap: { [key: string]: string } = {
    'experience_invite': '🤝',
    'voucher_expiring': '⏰',
    'new_experience': '🎭',
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



// Mock data para consumidor cultural
const mockNotifications = [
  {
    id: '1',
    type: 'experience_invite',
    title: '🤝 Convite para experiência',
    message: 'Ana Silva te convidou para "Arte Contemporânea"',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h atrás
    is_read: false,
    action_url: '/dashboard?tab=connect',
    action_text: 'Ver Convite'
  },
  {
    id: '2',
    type: 'voucher_expiring',
    title: '⏰ Voucher expirando',
    message: 'Teatro Experimental expira em 24h',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h atrás
    is_read: false,
    action_url: '/vouchers',
    action_text: 'Usar Voucher'
  },
  {
    id: '3',
    type: 'new_experience',
    title: '🎭 Nova experiência',
    message: 'Concerto de Piano disponível',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
    is_read: true,
    action_url: '/ofertas',
    action_text: 'Ver Experiência'
  }
];

export function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calcular notificações não lidas
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  // Marcar como lida
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };
  
  // Marcar todas como lidas
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };
  
  // Limpar todas as notificações
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Carregar dados mock
  useEffect(() => {
    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Acesso negado</h3>
          <p className="mt-1 text-sm text-gray-500">Você precisa estar logado para ver as notificações.</p>
        </div>
      </div>
    );
  }

  // Filter notifications based on current filter and search term
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !notification.is_read) ||
      (filter === 'read' && notification.is_read);
    
    const matchesSearch = 
      searchTerm === '' ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-8 h-8 text-[#C91F1F]" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
              <p className="text-gray-600">
                {notifications.length === 0 
                  ? 'Nenhuma notificação encontrada'
                  : `${unreadCount} não lidas de ${notifications.length} total`
                }
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar notificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C91F1F] focus:border-transparent"
              >
                <option value="all">Todas</option>
                <option value="unread">Não lidas</option>
                <option value="read">Lidas</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Marcar todas como lidas
              </button>
              
              <button
                onClick={clearAllNotifications}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Limpar todas
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C91F1F] mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando notificações...</p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && (
          <div className="space-y-4 mb-8">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filter !== 'all' ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filter !== 'all' 
                    ? 'Tente ajustar os filtros ou termo de busca.'
                    : 'Você não tem notificações no momento.'
                  }
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all ${
                    notification.is_read
                      ? 'bg-white border-gray-200'
                      : 'bg-blue-50 border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium ${
                            notification.is_read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`mt-1 text-sm ${
                            notification.is_read ? 'text-gray-600' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            {new Date(notification.created_at).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title="Marcar como lida"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {notification.action_url && notification.action_text && (
                        <div className="mt-3">
                          <a
                            href={notification.action_url}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-[#C91F1F] bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                          >
                            {notification.action_text}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Demo Section */}
        <div className="border-t pt-8">
          <NotificationDemo />
        </div>
      </div>
    </div>
  );
}