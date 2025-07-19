import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'customer' | 'merchant' | 'admin' | 'partner';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  console.log('--- ProtectedRoute Check ---');
  console.log('Location:', location.pathname);
  console.log('Loading:', loading);
  console.log('User:', user ? user.email : 'No User');
  console.log('User Profile:', userProfile);
  console.log('Required Role:', requiredRole);


  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F3EF]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#C91F1F]" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('Redirecting to login: User not found.');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect to email verification if email not confirmed
  // if (!user.email_confirmed_at) {
  //   console.log('Redirecting to email verification: Email not confirmed.');
  //   return <Navigate to="/email-verification" replace />;
  // }

  // Check role-based access
  // if (requiredRole && userProfile?.user_type !== requiredRole) {
  //   console.log(`Redirecting: Role mismatch. Required: ${requiredRole}, User has: ${userProfile?.user_type}`);
  //   // Redirecionar para o dashboard apropriado baseado no tipo de usuário
  //   // NUNCA redirecionar para rotas admin através do ProtectedRoute
  //   let dashboardPath = '/customer-dashboard'; // Default para customer
  //   if (userProfile?.user_type === 'merchant') {
  //     dashboardPath = '/merchant/dashboard';
  //   } else if (userProfile?.user_type === 'partner') {
  //     dashboardPath = '/dashboard-parceiro';
  //   }
  //   // Removida a verificação de admin para evitar redirecionamento para rotas administrativas
  //   return <Navigate to={dashboardPath} replace />;
  // }


  return <>{children}</>;
}

// Higher-order component for role-based routes
// eslint-disable-next-line react-refresh/only-export-components
export function withRoleProtection(requiredRole: 'customer' | 'merchant' | 'admin' | 'partner') {
  return function ProtectedComponent({ children }: { children: ReactNode }) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        {children}
      </ProtectedRoute>
    );
  };
}

// Specific role components
export const CustomerRoute = withRoleProtection('customer');
export const MerchantRoute = withRoleProtection('merchant');
export const AdminRoute = withRoleProtection('admin');
export const PartnerRoute = withRoleProtection('partner');