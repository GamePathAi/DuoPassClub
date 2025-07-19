import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import DuoPassLogo from '../../components/ui/DuoPassLogo';
import { useAuth } from '../../contexts/AuthContext';
import { Toast } from '../../components/Toast';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const { resendConfirmation, getResendCooldown } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({ 
    message: '', 
    type: 'info', 
    isVisible: false 
  });

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      // Check initial cooldown
      checkCooldown(emailParam);
    }
  }, [searchParams, checkCooldown]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const checkCooldown = useCallback(async (emailAddress: string) => {
    try {
      const remaining = await getResendCooldown(emailAddress);
      setCountdown(remaining);
    } catch (error: unknown) {
      console.error('Error checking cooldown:', error);
    }
  }, [getResendCooldown]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleResendEmail = async () => {
    if (!email || countdown > 0) return;
    
    setIsResending(true);

    try {
      await resendConfirmation(email);
      showToast('Email reenviado com sucesso!', 'success');
      setCountdown(60); // Start 60 second countdown
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Aguarde')) {
        showToast(errorMessage, 'error');
        await checkCooldown(email); // Refresh countdown
      } else {
        showToast('Erro ao reenviar. Tente novamente.', 'error');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-scale-in hover-lift">
          <div className="flex justify-center mb-6">
            <DuoPassLogo height={80} className="w-auto" />
          </div>
          
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center mb-6 animate-glow">
              <Mail className="w-10 h-10 text-white animate-bounce" />
            </div>
            
            <h2 className="text-3xl font-bold text-[#333333] mb-4 animate-fade-in">
                Verifique seu email
              </h2>
              <p className="text-gray-600 text-lg mb-2 animate-fade-in">
                Enviamos um link de confirmação para:
              </p>
              <p className="text-[#F6C100] font-semibold text-lg mb-6 break-all animate-fade-in">
                {email}
              </p>
            
            <div className="bg-gradient-to-r from-[#F6C100]/10 to-[#C91F1F]/10 border border-[#F6C100]/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Importante:</strong> Verifique também sua caixa de spam ou lixo eletrônico.
                O email pode levar alguns minutos para chegar.
              </p>
            </div>
          </div>



          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              disabled={isResending || countdown > 0}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform min-h-[44px] ${
                isResending || countdown > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white hover:shadow-lg hover:-translate-y-0.5 hover:scale-105 active:scale-95'
              }`}
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  Enviando...
                </>
              ) : countdown > 0 ? (
                `Reenviar em ${countdown}s`
              ) : (
                'Reenviar email de confirmação'
              )}
            </button>
            
            <Link
              to="/login"
              className="block w-full bg-gray-100 text-[#333333] py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 text-center transform hover:-translate-y-1 active:scale-95 min-h-[48px] flex items-center justify-center"
            >
              Voltar ao login
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Não recebeu o email? Verifique se o endereço está correto ou{' '}
              <Link to="/signup" className="text-[#C91F1F] hover:text-[#F6C100] font-medium">
                tente cadastrar novamente
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}