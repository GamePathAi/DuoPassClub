import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      try {
        const decoded = atob(adminToken);
        const [email] = decoded.split(':');
        const allowedAdmins = ['admin@duopass.com', 'igor@duopass.com', 'silvia@duopass.com'];
        
        if (allowedAdmins.includes(email)) {
          setIsAdminAuthenticated(true);
          setAdminEmail(email);
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch {
        localStorage.removeItem('admin_token');
      }
    }
  }, []);

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    // Simulando verificação de credenciais de admin
    const allowedAdmins = ['admin@duopass.com', 'igor@duopass.com', 'silvia@duopass.com'];
    const adminPasswords = {
      'admin@duopass.com': 'admin123',
      'igor@duopass.com': 'igor123',
      'silvia@duopass.com': 'silvia123'
    };

    if (allowedAdmins.includes(email) && adminPasswords[email as keyof typeof adminPasswords] === password) {
      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('admin_token', token);
      setIsAdminAuthenticated(true);
      setAdminEmail(email);
      return true;
    }

    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdminAuthenticated(false);
    setAdminEmail(null);
    window.location.href = '/admin/login';
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated,
        adminEmail,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};