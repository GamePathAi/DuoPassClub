import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserDropdown } from './UserDropdown';
import { MobileMenu } from './MobileMenu';
import { ChatNotifications } from '../connect/ChatNotifications';

export function Header() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              to="/experiencias"
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
            <Link
              to="/trial"
              className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Comece Grátis
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Chat Notifications */}
            {user && <ChatNotifications />}

            {/* User Dropdown for logged users */}
            {user && <UserDropdown />}

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