import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type ConfirmationStatus = 'loading' | 'success' | 'error';

export function ConfirmEmail() {
  const [status, setStatus] = useState<ConfirmationStatus>('loading');

  const [userType, setUserType] = useState<'customer' | 'merchant' | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const tokenHash = searchParams.get('token_hash');
        
        console.log('URL params:', { accessToken, refreshToken, type, tokenHash });
        
        if (!accessToken || !refreshToken) {
          console.error('Missing tokens in URL');
          setStatus('error');
  
          return;
        }

        // Check if user is already verified
        if (user?.email_confirmed_at) {
          console.log('User already verified, redirecting...');
          setStatus('success');
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
          return;
        }

        // Set the session with the tokens from URL
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('error');
          setError('Link inválido ou expirado');
          return;
        }

        console.log('Session set successfully:', sessionData);

        // Verify the email using OTP
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash || '',
          type: 'email'
        });

        if (verifyError) {
          console.error('Verify error:', verifyError);
          setStatus('error');
          setError('Link inválido ou expirado');
          return;
        }

        console.log('Email verified successfully:', verifyData);

        // Update user profile in our users table
        if (verifyData.user) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ 
              email_verified: true,
              email_verification_sent_at: null
            })
            .eq('id', verifyData.user.id);

          if (updateError) {
            console.error('Error updating user profile:', updateError);
            setStatus('error');
            setError('Link inválido ou expirado');
            return;
          }

          // Get user type for redirect
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_type')
            .eq('id', verifyData.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
          } else {
            setUserType(userData.user_type);
          }
        }

        setStatus('success');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          const redirectPath = userType === 'merchant' ? '/merchant/dashboard' : '/dashboard';
          navigate(redirectPath);
        }, 3000);

      } catch (error) {
        console.error('Unexpected error:', error);
        setStatus('error');
        setError('Link inválido ou expirado');
      }
    };

    // Add a small delay to show loading state
    const timer = setTimeout(() => {
      confirmEmail();
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate, user, userType]);

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Logo circular laranja com "D" branca
  const CircularLogo = () => (
    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
      <span className="text-white text-2xl font-bold">D</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="w-full max-w-sm mx-auto">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CircularLogo />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Duo Pass Club</h1>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            {status === 'loading' && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Confirmando seu email...
                  </h2>
                  <p className="text-gray-600">
                    Por favor, aguarde enquanto verificamos seu email.
                  </p>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Email Confirmado!
                  </h2>
                  <p className="text-gray-600">
                    Redirecionando para dashboard...
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-center">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Erro na confirmação
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Link inválido ou expirado
                  </p>
                  <button
                    onClick={handleBackToLogin}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    Voltar ao Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}