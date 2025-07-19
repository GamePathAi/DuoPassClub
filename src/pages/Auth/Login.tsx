import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import DuoPassLogo from '../../components/ui/DuoPassLogo';
import GoogleSignInButton from '../../components/Auth/GoogleSignInButton';

export default function Login() {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    try {
      console.log('📧 Tentando fazer login com:', formData.email);
      const result = await signIn(formData.email, formData.password);
      console.log('✅ Login bem-sucedido:', result);
      
      const from = location.state?.from || '/';
      console.log('🚀 Redirecionando para:', from);
      navigate(from, { replace: true });
    } catch (error: unknown) {
      console.error('❌ Erro no login:', error);
      if (error instanceof Error) {
        if (error.message.includes('Email não verificado')) {
          console.log('📨 Redirecionando para verificação de email');
          navigate(`/email-verification?email=${encodeURIComponent(formData.email)}`);
        } else if (error.message.includes('Timeout')) {
          alert('A conexão demorou muito para responder. Verifique sua internet e tente novamente.');
        } else if (error.message.includes('invalid_credentials')) {
          alert('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
        } else {
          alert(error.message);
        }
      } else {
        alert('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
      console.log('🏁 Processo de login finalizado');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6C100] via-[#C91F1F] to-[#333333] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <DuoPassLogo height={80} className="w-auto" />
            </div>
            <h2 className="text-3xl font-bold text-[#333333]">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              Entre na sua conta para continuar
            </p>
          </div>

          {/* Login Social */}
          <div className="space-y-3">
            <GoogleSignInButton />
          </div>

          {/* Divisor */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C91F1F] w-5 h-5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C91F1F] w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#C91F1F] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-4 px-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
            >
              {loading ? 'Entrando...' : t('auth.signin')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link
                to="/signup"
                className="text-[#C91F1F] hover:text-[#F6C100] font-semibold transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}