import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { notificationService } from '../lib/notificationService';
import { Notification } from '../types';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import NotificationList from '@/components/NotificationList';

export default function NotificationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotifications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(user.id, 50);
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar as notificações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await notificationService.markAsRead(notification.id);
        fetchNotifications(); // Refresh list
      } catch (error) {
        console.error('Failed to mark notification as read', error);
      }
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
      await notificationService.markAllAsRead(user.id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleDeleteAll = async () => {
    // Implementar a exclusão no service se necessário, por enquanto limpa localmente
    setNotifications([]);
  };

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

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'unread') {
        return !notification.is_read;
      }
      return true; // 'all'
    })
    .filter(notification => {
      const search = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(search) ||
        notification.message.toLowerCase().includes(search)
      );
    });

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className='flex items-center gap-3'>
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold text-gray-800">Notificações</h1>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Marcar todas como lidas
                </Button>
                <Button variant="destructive" onClick={handleDeleteAll} disabled={notifications.length === 0}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar Todas
                </Button>
            </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Buscar por título ou mensagem..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
            </div>
            <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-1">
                <Button variant={filter === 'all' ? 'primary' : 'ghost'} onClick={() => setFilter('all')} className='flex-1 justify-center'>Todas</Button>
                <Button variant={filter === 'unread' ? 'primary' : 'ghost'} onClick={() => setFilter('unread')} className='flex-1 justify-center'>Não Lidas</Button>
            </div>
        </div>

        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <NotificationList 
                    notifications={filteredNotifications} 
                    onNotificationClick={handleNotificationClick} 
                />
            </div>
        )}
      </div>
    </DashboardLayout>
  );
}