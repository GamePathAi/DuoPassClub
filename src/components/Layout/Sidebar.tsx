import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Sparkles, 
  CreditCard, 
  History, 
  Users, 
  User, 
  Settings, 
  LogOut,
  TrendingUp,
  Store
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, userProfile, signOut } = useAuth();
  const location = useLocation();

  if (!user || !userProfile) return null;

  const isMerchant = userProfile.user_type === 'merchant';
  const isAdmin = userProfile.user_type === 'admin';
  const dashboardPath = isMerchant ? '/merchant/dashboard' : '/customer-dashboard';

  const handleSignOut = async () => {
    try {
      console.log('👤 Usuário clicou em Sair (Sidebar)');
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('❌ Erro no logout:', error);
    }
  };

  const isActiveRoute = (itemPath: string) => {
    if (itemPath.includes('?')) {
      const [basePath, query] = itemPath.split('?');
      if (location.pathname !== basePath) return false;
      const params = new URLSearchParams(query);
      const currentParams = new URLSearchParams(location.search);
      for (const [key, value] of params) {
        if (currentParams.get(key) !== value) return false;
      }
      return true;
    }
    return location.pathname === itemPath;
  };

  const menuItems = [
    {
      label: 'Dashboard',
      path: dashboardPath,
      icon: isMerchant ? Store : BarChart3,
      show: true
    },
    {
      label: 'Recomendações IA',
      path: '/recomendacoes-ia',
      icon: Sparkles,
      show: !isMerchant,
      iconColor: 'text-orange-500'
    },
    {
      label: 'Vouchers',
      path: '/meus-vouchers',
      icon: CreditCard,
      show: !isMerchant
    },
    {
      label: 'Histórico',
      path: '/historico',
      icon: History,
      show: !isMerchant
    },
    {
      label: 'Connect',
      path: '/connect',
      icon: Users,
      show: !isMerchant
    },
    {
      label: 'Insights Pessoais',
      path: '/customer-dashboard?tab=insights',
      icon: TrendingUp,
      show: !isMerchant,
      iconColor: 'text-purple-500'
    },
    {
      label: 'Minhas Ofertas',
      path: '/merchant/offers',
      icon: CreditCard,
      show: isMerchant
    },
    {
      label: 'Analytics Merchant',
      path: '/merchant/analytics',
      icon: BarChart3,
      show: isMerchant
    },
    {
      label: 'Perfil',
      path: '/profile',
      icon: User,
      show: true
    },
    {
      label: 'Configurações',
      path: '/settings',
      icon: Settings,
      show: true
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              🎭 DUO PASS
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-[#333333] text-sm">{userProfile.full_name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  userProfile.subscription_status === 'active' 
                    ? 'bg-green-500' 
                    : 'bg-yellow-500'
                }`} />
                <span className="text-xs text-gray-500 capitalize">
                  {userProfile.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              if (item.disabled) {
                return (
                  <div
                    key={item.path}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 cursor-not-allowed"
                  >
                    <Icon className={`w-5 h-5 ${item.iconColor || 'text-gray-600'}`} />
                    <span className="font-medium">{item.label}</span>
                    <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                      Em breve
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${
                    isActive 
                      ? 'text-white' 
                      : item.iconColor || 'text-gray-600'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer - Logout */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
}