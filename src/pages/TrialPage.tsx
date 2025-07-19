import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  Gift,
  Users,
  Heart,
  Star,
  Clock,
  Shield
} from 'lucide-react';

export default function TrialPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (formData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🎁 Iniciando trial gratuito:', formData);
      
      // Simular criação de conta trial
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Salvar dados do trial no localStorage
      localStorage.setItem('trialUser', JSON.stringify({
        name: formData.name,
        email: formData.email,
        trialStartDate: new Date().toISOString(),
        trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        experiencesUsed: 0,
        subscription: {
          type: 'trial',
          status: 'active',
          plan: 'Cultural Starter',
          experiencesIncluded: 3
        }
      }));
      
      // Redirecionar para dashboard
      navigate('/customer-dashboard');
      
    } catch (error) {
      console.error('❌ Erro ao criar trial:', error);
      alert('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="text-white">
              <div className="mb-8">
                <div className="inline-flex items-center bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Gift className="w-4 h-4 mr-2" />
                  Oferta Especial - Trial Gratuito
                </div>
                <h1 className="text-5xl font-bold mb-6 leading-tight">
                  <span className="text-orange-300">7 Dias</span> de Experiências Culturais <span className="text-orange-300">Grátis</span>
                </h1>
                <p className="text-xl text-purple-100 mb-8">
                  Descubra o poder das experiências culturais em dupla. Sem compromisso, sem cartão de crédito.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-lg">3 experiências culturais incluídas</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-lg">Acesso completo à plataforma</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-lg">Curadoria emocional personalizada</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-lg">Cancele a qualquer momento</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-white font-semibold">4.9/5</span>
                </div>
                <p className="text-purple-100 italic">
                  "O DUO PASS transformou nossa forma de viver a cultura. As experiências em dupla criaram memórias inesquecíveis!"
                </p>
                <p className="text-orange-300 font-medium mt-2">- Ana & Carlos, membros desde 2023</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Comece Seu Trial Gratuito
                </h2>
                <p className="text-gray-600">
                  Crie sua conta em menos de 2 minutos
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Confirme sua senha"
                  />
                </div>

                {/* Trial Info */}
                <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-900">Seu Trial Inclui:</span>
                  </div>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• 7 dias de acesso completo</li>
                    <li>• 3 experiências culturais</li>
                    <li>• Curadoria personalizada</li>
                    <li>• Suporte prioritário</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Criando sua conta...
                    </div>
                  ) : (
                    <>
                      Iniciar Trial Gratuito
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                {/* Security & Terms */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>Seus dados estão seguros conosco</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Ao criar sua conta, você concorda com nossos{' '}
                    <Link to="/terms" className="text-purple-600 hover:underline">
                      Termos de Uso
                    </Link>{' '}
                    e{' '}
                    <Link to="/privacy" className="text-purple-600 hover:underline">
                      Política de Privacidade
                    </Link>
                  </p>
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center border-t border-gray-200 pt-6">
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                    Faça login
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <Users className="w-12 h-12 text-orange-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Experiências em Dupla</h3>
              <p className="text-purple-200">
                Todas as experiências são pensadas para serem vividas em dupla, criando conexões autênticas.
              </p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-orange-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Curadoria Emocional</h3>
              <p className="text-purple-200">
                Cada experiência é cuidadosamente selecionada para tocar sua alma e criar memórias especiais.
              </p>
            </div>
            <div className="text-center">
              <Calendar className="w-12 h-12 text-orange-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flexibilidade Total</h3>
              <p className="text-purple-200">
                Agende suas experiências quando quiser, cancele sem taxas durante o trial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}