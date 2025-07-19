import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../lib/notificationService';
import { Notification } from '../types';
import NotificationList from './NotificationList';



export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Fetch every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

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
    setIsOpen(false);
  };

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
      await notificationService.markAllAsRead(user.id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
    }
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
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-purple-50">
            <h3 className="font-semibold text-gray-900">Notificações</h3>
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

          {/* Lista de Notificações */}
          <NotificationList notifications={notifications} onNotificationClick={handleNotificationClick} />

        </div>
      )}
    </div>
  );
}