import React, { useEffect } from 'react';

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');

    if (!adminToken) {
      window.location.href = '/admin/login';
      return;
    }

    try {
      const decoded = atob(adminToken);
      const [email] = decoded.split(':');

      const allowedAdmins = [
        'admin@duopass.com',
        'igor@duopass.com',
        'silvia@duopass.com'
      ];

      if (!allowedAdmins.includes(email)) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
        return;
      }
    } catch (e) {
        console.error('Error decoding admin token:', e);
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
  }, []);

  return <>{children}</>;
};

export default AdminProtectedRoute;