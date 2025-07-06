import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Notification } from '../types/notification';

export interface NotificationInput {
  user_id: string;
  type: string;
  title: string;
  message: string;
  icon?: string;
  action_url?: string;
  action_text?: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Mock data para usuário demo
      if (user.id === 'demo-user-id') {
        const mockNotifications = [
          {
            id: '1',
            type: 'experience_invite',
            title: '🤝 Convite para experiência',
            message: 'Ana Silva te convidou para "Arte Contemporânea"',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            is_read: false,
            user_id: user.id,
            action_url: '/dashboard?tab=connect',
            action_text: 'Ver Convite',
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            type: 'voucher_expiring',
            title: '⏰ Voucher expirando',
            message: 'Teatro Experimental expira em 24h',
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            is_read: false,
            user_id: user.id,
            action_url: '/vouchers',
            action_text: 'Usar Voucher',
            updated_at: new Date().toISOString()
          }
        ];
        
        setNotifications(mockNotifications);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create notification
  const createNotification = useCallback(async (notificationData: NotificationInput) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notificationData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating notification:', err);
      throw err;
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Mock behavior para usuário demo
      if (user?.id === 'demo-user-id') {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
        return;
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Erro ao marcar notificação como lida');
    }
  }, [user]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    
    try {
      // Mock behavior para usuário demo
      if (user.id === 'demo-user-id') {
        setNotifications(prev => 
          prev.map(n => ({ ...n, is_read: true }))
        );
        return;
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Erro ao marcar todas as notificações como lidas');
    }
  }, [user]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Erro ao excluir notificação');
    }
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    if (!user) return;
    
    try {
      // Mock behavior para usuário demo
      if (user.id === 'demo-user-id') {
        setNotifications([]);
        return;
      }
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications:', err);
      setError('Erro ao limpar notificações');
    }
  }, [user]);

  // Load notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user, fetchNotifications]);

  // Real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;
    
    // Skip real-time subscription para usuário demo
    if (user.id === 'demo-user-id') return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const deletedNotification = payload.old as Notification;
          setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };
}