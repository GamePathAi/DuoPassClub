import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Callback() {
  const { syncGoogleUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session after Google login:', error);
        navigate('/login?error=auth_failed');
        return;
      }

      if (data.session?.user) {
        try {
          await syncGoogleUser(data.session.user);
          navigate('/dashboard');
        } catch (syncError) {
          console.error('Error syncing Google user:', syncError);
          navigate('/login?error=sync_failed');
        }
      } else {
        navigate('/login?error=no_session');
      }
    };

    handleAuthCallback();
  }, [syncGoogleUser, navigate]);

  return (
    <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#333333]">Autenticando...</h1>
        <p className="text-gray-600">Aguarde um momento, estamos preparando tudo para você.</p>
      </div>
    </div>
  );
}