import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Users, BarChart2, Settings } from 'lucide-react';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: Home },
  { to: '/admin/ofertas', label: 'Ofertas', icon: ShoppingBag },
  { to: '/admin/usuarios', label: 'Usuários', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">DuoPass</div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <Icon className="mr-3 h-6 w-6" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default AdminSidebar;