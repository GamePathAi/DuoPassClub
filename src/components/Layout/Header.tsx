import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserDropdown from './UserDropdown';
import MobileMenu from './MobileMenu';
import ChatNotifications from '../connect/ChatNotifications';

export default function Header() {
  const { user, userProfile, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Debug logs para identificar problemas de renderização
  console.log('🎭 Header render:', {
    hasUser: !!user,
    hasUserProfile: !!userProfile,
    loading,
    userEmail: user?.email
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              🎭 DUO PASS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/customer-dashboard?tab=experiences"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Experiências
            </Link>
            <Link
              to="/memberships"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Memberships
            </Link>
            <Link
              to="/empresas"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Para Empresas
            </Link>
            {!user && (
              <Link
                to="/login"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                Login
              </Link>
            )}
            {!user && (
              <Link
                to="/trial"
                className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Comece Grátis
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Carregando...</span>
              </div>
            )}
            
            {/* Chat Notifications */}
            {!loading && user && <ChatNotifications />}

            {/* User Dropdown for logged users */}
            {!loading && user && userProfile && <UserDropdown />}

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
}