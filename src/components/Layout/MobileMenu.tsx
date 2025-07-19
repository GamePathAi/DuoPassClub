import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, 
  Tag, 
  CreditCard, 
  History, 
  User, 
  Settings, 
  LogOut,
  Store,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, userProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      console.log('👤 Usuário clicou em Sair (Mobile)');
      await signOut();
      
      // Redirecionar para login
      navigate('/login');
      
    } catch (error) {
      console.error('❌ Erro no logout:', error);
    } finally {
      onClose();
    }
  };

  const handleLinkClick = () => {
    onClose();
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isMerchant = userProfile?.user_type === 'merchant';
  const dashboardPath = isMerchant ? '/merchant/dashboard' : '/dashboard';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#333333]">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        {user && userProfile && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
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
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {/* Public Links */}
            <Link
              to="/experiencias"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Tag className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-[#333333]">Experiências</span>
            </Link>

            <Link
              to="/memberships"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-[#333333]">Memberships</span>
            </Link>

            <Link
              to="/empresas"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Store className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-[#333333]">Para Empresas</span>
            </Link>

            {!user && (
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-[#333333]">Login</span>
              </Link>
            )}

            {!user && (
              <Link
                to="/trial"
                onClick={handleLinkClick}
                className="mx-3 my-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold text-center block"
              >
                Comece Grátis
              </Link>
            )}

            {/* Authenticated User Links */}
            {user && userProfile && (
              <>
                <div className="border-t border-gray-200 my-4 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {isMerchant ? 'Área do Comerciante' : 'Minha Conta'}
                  </p>
                  
                  <Link
                    to={dashboardPath}
                    onClick={handleLinkClick}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {isMerchant ? <Store className="w-5 h-5 text-gray-600" /> : <BarChart3 className="w-5 h-5 text-gray-600" />}
                    <span className="font-medium text-[#333333]">Dashboard</span>
                  </Link>

                  {isMerchant ? (
                    <>
                      <Link
                        to="/merchant/offers"
                        onClick={handleLinkClick}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Tag className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-[#333333]">Minhas Ofertas</span>
                      </Link>
                      <Link
                        to="/merchant/analytics"
                        onClick={handleLinkClick}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <BarChart3 className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-[#333333]">Analytics</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/recommendations"
                        onClick={handleLinkClick}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        <span className="font-medium text-[#333333]">Recomendações IA</span>
                      </Link>
                      <Link
                        to="/meus-vouchers"
                        onClick={handleLinkClick}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-[#333333]">Meus Vouchers</span>
                      </Link>
                      <Link
                        to="/history"
                        onClick={handleLinkClick}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <History className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-[#333333]">Histórico</span>
                      </Link>
                    </>
                  )}
                </div>

                <div className="border-t border-gray-200 my-4 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Configurações
                  </p>
                  
                  <Link
                    to="/profile"
                    onClick={handleLinkClick}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-[#333333]">Perfil</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={handleLinkClick}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-[#333333]">Configurações</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('nav.logout')}</span>
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="block w-full p-3 text-center border border-[#C91F1F] text-[#C91F1F] rounded-lg font-medium hover:bg-[#C91F1F] hover:text-white transition-colors"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/signup"
                onClick={handleLinkClick}
                className="block w-full p-3 text-center bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                {t('nav.signup')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}