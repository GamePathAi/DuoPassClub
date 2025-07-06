import React, { useState } from 'react';
import { Bell, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NotificationService } from '../services/notificationService';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationDemo() {
  const { user, userProfile } = useAuth();
  const { notifications, unreadCount, clearAllNotifications } = useNotifications();
  const [generating, setGenerating] = useState(false);

  const generateDemoNotifications = async () => {
    if (!user || !userProfile) return;
    
    setGenerating(true);
    try {
      await NotificationService.generateDemoNotifications(
        user.id, 
        userProfile.user_type as 'client' | 'merchant'
      );
    } catch (error) {
      console.error('Error generating demo notifications:', error);
    } finally {
      setGenerating(false);
    }
  };

  const generateSpecificNotification = async (type: string) => {
    if (!user) return;

    try {
      switch (type) {
        case 'offer':
          await NotificationService.notifyNewOffer(
            user.id,
            'Pizza Margherita',
            '50% OFF'
          );
          break;
        case 'voucher':
          await NotificationService.notifyOfferRedeemed(
            user.id,
            'Hambúrguer Gourmet',
            35.00
          );
          break;
        case 'achievement':
          await NotificationService.notifyAchievementUnlocked(
            user.id,
            'Primeiro Resgate',
            'Você fez seu primeiro resgate no DuoPass Club!'
          );
          break;
        case 'level':
          await NotificationService.notifyLevelUp(user.id, 'Bronze');
          break;
      }
    } catch (error) {
      console.error('Error generating specific notification:', error);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Faça login para testar as notificações</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#C91F1F]" />
            Sistema de Notificações
          </h2>
          <p className="text-gray-600 mt-1">
            Teste o sistema inteligente de notificações do DuoPass Club
          </p>
        </div>
        
        {unreadCount > 0 && (
          <div className="bg-[#C91F1F] text-white px-3 py-1 rounded-full text-sm font-medium">
            {unreadCount} não lidas
          </div>
        )}
      </div>

      {/* User Type Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">
          Tipo de Usuário: {userProfile?.user_type === 'client' ? '👤 Cliente' : '🏪 Comerciante'}
        </h3>
        <p className="text-sm text-gray-600">
          {userProfile?.user_type === 'client' 
            ? 'Como cliente, você receberá notificações sobre ofertas, vouchers, conquistas e atualizações do sistema.'
            : 'Como comerciante, você receberá notificações sobre performance do negócio, gestão de ofertas e oportunidades.'
          }
        </p>
      </div>

      {/* Demo Controls */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-gray-900">Testar Notificações</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Generate Demo Notifications */}
          <button
            onClick={generateDemoNotifications}
            disabled={generating}
            className="flex items-center justify-center gap-2 bg-[#C91F1F] text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {generating ? 'Gerando...' : 'Gerar Notificações Demo'}
          </button>

          {/* Clear All */}
          <button
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Todas
          </button>
        </div>

        {/* Specific Notification Types */}
        {userProfile?.user_type === 'client' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => generateSpecificNotification('offer')}
              className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors"
            >
              🎁 Nova Oferta
            </button>
            <button
              onClick={() => generateSpecificNotification('voucher')}
              className="bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors"
            >
              💰 Voucher
            </button>
            <button
              onClick={() => generateSpecificNotification('achievement')}
              className="bg-purple-100 text-purple-700 px-3 py-2 rounded text-sm hover:bg-purple-200 transition-colors"
            >
              🏆 Conquista
            </button>
            <button
              onClick={() => generateSpecificNotification('level')}
              className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded text-sm hover:bg-yellow-200 transition-colors"
            >
              ⭐ Level Up
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Estatísticas</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#C91F1F]">{notifications.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">Não Lidas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</div>
            <div className="text-sm text-gray-600">Lidas</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Como testar:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Clique no sininho no header para ver as notificações</li>
          <li>• Use "Gerar Notificações Demo" para criar exemplos baseados no seu tipo de usuário</li>
          <li>• Teste os botões específicos para diferentes tipos de notificação</li>
          <li>• As notificações aparecem em tempo real</li>
          <li>• Marque como lidas individualmente ou todas de uma vez</li>
        </ul>
      </div>
    </div>
  );
}