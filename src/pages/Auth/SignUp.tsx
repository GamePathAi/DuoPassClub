import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import DuoPassLogo from '../../assets/duopass_logo.svg';

export function SignUp() {
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'customer' as 'customer' | 'merchant',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {

      
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        user_type: formData.userType,
      });
      // Redirect to email verification page with email parameter
      navigate(`/email-verification?email=${encodeURIComponent(formData.email)}`);
    } catch (error: unknown) {
      console.error('Erro no cadastro:', error);
      
      // Mensagens de erro mais específicas e amigáveis
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (error instanceof Error) {
        if (error.message.includes('já está cadastrado')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido. Verifique o formato do email.';
        } else if (error.message.includes('Password')) {
          errorMessage = 'Senha deve ter pelo menos 6 caracteres.';
        } else if (error.message.includes('duplicate key')) {
          errorMessage = 'Este email já está em uso. Tente fazer login.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6C100] via-[#C91F1F] to-[#333333] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <DuoPassLogo className="h-20 w-auto" fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-[#333333]">
              Criar Conta
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              Cadastre-se para começar a economizar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-2">
                {t('auth.fullname')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C91F1F] w-5 h-5" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F6C100] focus:border-[#F6C100] transition-all"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-2">
                {t('auth.usertype')}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'customer' })}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    formData.userType === 'customer'
                      ? 'border-[#F6C100] bg-gradient-to-br from-[#F6C100] to-[#C91F1F] text-white'
                      : 'border-gray-300 text-[#333333] hover:border-[#F6C100]'
                  }`}
                >
                  <div className="font-semibold">{t('auth.customer')}</div>
                  <div className="text-sm opacity-80">Usar cupons</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'merchant' })}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    formData.userType === 'merchant'
                      ? 'border-[#C91F1F] bg-gradient-to-br from-[#C91F1F] to-[#333333] text-white'
                      : 'border-gray-300 text-[#333333] hover:border-[#C91F1F]'
                  }`}
                >
                  <div className="font-semibold">{t('auth.merchant')}</div>
                  <div className="text-sm opacity-80">Criar ofertas</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white py-4 px-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
            >
              {loading ? 'Criando conta...' : t('auth.signup')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-[#C91F1F] hover:text-[#F6C100] font-semibold transition-colors"
              >
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}