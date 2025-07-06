import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Settings, 
  History, 
  CreditCard, 
  BarChart3,
  ChevronDown,
  Store,
  Users
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export function UserDropdown() {
  const { user, userProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      console.log('👤 Usuário clicou em Sair');
      await signOut();
      
      // Redirecionar para login
      navigate('/login');
      
    } catch (error) {
      console.error('❌ Erro no logout:', error);
    } finally {
      setLoggingOut(false);
      setIsOpen(false);
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

  if (!user || !userProfile) return null;

  const isMerchant = userProfile.user_type === 'merchant';
  const dashboardPath = isMerchant ? '/merchant/dashboard' : '/dashboard';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-[#333333] truncate max-w-32">
            {userProfile.full_name}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {userProfile.user_type === 'merchant' ? 'Comerciante' : 'Cliente'}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-medium text-[#333333]">{userProfile.full_name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
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

          {/* Navigation Links */}
          <div className="py-2">
            <Link
              to={dashboardPath}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {isMerchant ? <Store className="w-4 h-4 mr-3" /> : <BarChart3 className="w-4 h-4 mr-3" />}
              Dashboard
            </Link>

            {isMerchant ? (
              <>
                <Link
                  to="/merchant/offers"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  Minhas Ofertas
                </Link>
                <Link
                  to="/merchant/analytics"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Analytics
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/meus-vouchers"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  Meus Vouchers
                </Link>
                <Link
                  to="/history"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <History className="w-4 h-4 mr-3" />
                  Histórico
                </Link>
                <Link
                  to="/dashboard?tab=connect"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-4 h-4 mr-3" />
                  🤝 Connect
                </Link>
              </>
            )}

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4 mr-3" />
              Perfil
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3" />
              Configurações
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {loggingOut ? (
                <div className="w-4 h-4 mr-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-3" />
              )}
              <span>{loggingOut ? 'Saindo...' : t('nav.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}