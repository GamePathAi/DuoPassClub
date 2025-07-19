import React from 'react';
import { Notification } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

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

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onNotificationClick }) => {
  if (notifications.length === 0) {
    return <div className="p-4 text-center text-gray-500">Nenhuma notificação nova.</div>;
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification, index) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onNotificationClick(notification)}
          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${notification.is_read ? 'opacity-60' : ''}`}>
          <div className="flex items-start">
            <div className="text-2xl mr-4">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{notification.title}</p>
              <p className="text-sm text-gray-600">{notification.message}</p>
              {notification.action_url && (
                <Link to={notification.action_url} className="text-sm text-blue-500 hover:underline mt-1 inline-block">
                  {notification.action_text || 'Ver mais'}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NotificationList;