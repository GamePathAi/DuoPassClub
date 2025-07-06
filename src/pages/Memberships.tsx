import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { MEMBERSHIP_PLANS, MembershipPlan } from '../types/membership';
import { useAuth } from '../contexts/AuthContext';

export function Memberships() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate('/login?redirect=/memberships');
      return;
    }
    setSelectedPlan(planId);
    navigate(`/checkout?plan=${planId}&billing=${billingCycle}`);
  };

  const getPlanIcon = (tier: string) => {
    switch (tier) {
      case 'starter': return <Star className="w-8 h-8" />;
      case 'explorer': return <Crown className="w-8 h-8" />;
      case 'ambassador': return <Trophy className="w-8 h-8" />;
      default: return <Star className="w-8 h-8" />;
    }
  };

  const getPrice = (plan: MembershipPlan) => {
    return billingCycle === 'monthly' ? plan.price_monthly : Math.round(plan.price_yearly / 12);
  };

  const getSavings = (plan: MembershipPlan) => {
    if (billingCycle === 'yearly') {
      const monthlyCost = plan.price_monthly * 12;
      const savings = monthlyCost - plan.price_yearly;
      return savings;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white py-20"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Exclusividade Cultural Suíça</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Torne-se Membro do
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                DUO PASS Club
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Experiências culturais autênticas, sempre em dupla, com curadoria emocional exclusiva na Suíça
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-white/80">Membros Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">150+</div>
              <div className="text-white/80">Experiências Únicas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-white/80">Satisfação</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Escolha Seu Plano Cultural</h2>
          <p className="text-xl text-gray-600 mb-8">Experiências autênticas que conectam pessoas através da cultura</p>
          
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-full font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {MEMBERSHIP_PLANS.map((plan, index) => {
            const isPopular = plan.popular;
            const savings = getSavings(plan);
            
            return (
              <motion.div
                key={plan.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                  isPopular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-2 font-bold text-sm">
                    ⭐ MAIS POPULAR
                  </div>
                )}

                <div className={`p-8 ${isPopular ? 'pt-12' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color_scheme.gradient} text-white mb-4`}>
                      {getPlanIcon(plan.tier)}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-bold text-gray-800">CHF {getPrice(plan)}</span>
                      <span className="text-gray-500 ml-2">/mês</span>
                    </div>
                    {billingCycle === 'yearly' && savings > 0 && (
                      <div className="text-green-600 font-medium text-sm">
                        Economize CHF {savings}/ano
                      </div>
                    )}
                    {billingCycle === 'yearly' && (
                      <div className="text-gray-500 text-sm">
                        Cobrado CHF {plan.price_yearly} anualmente
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                        : `bg-gradient-to-r ${plan.color_scheme.gradient} text-white hover:shadow-lg`
                    }`}
                  >
                    <span>Começar Agora</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Trial Info */}
                  <div className="text-center mt-4">
                    <span className="text-sm text-gray-500">7 dias grátis • Cancele a qualquer momento</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-20"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">O que nossos membros dizem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-800">Maria Santos</div>
                  <div className="text-sm text-gray-500">Cultural Explorer</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "O DUO PASS transformou minha vida social. Descobri lugares incríveis e fiz amizades genuínas através da cultura."
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  J
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-800">João Silva</div>
                  <div className="text-sm text-gray-500">Cultural Ambassador</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "A curadoria é excepcional. Cada experiência é única e autêntica. Vale cada franco investido!"
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-800">Ana Costa</div>
                  <div className="text-sm text-gray-500">Cultural Starter</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Perfeito para quem está começando. As experiências são sempre em dupla, criando conexões reais."
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-20 bg-white rounded-2xl p-8 shadow-lg"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Perguntas Frequentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Como funciona o modelo "2 por 1"?</h4>
              <p className="text-gray-600 text-sm">Todas as experiências são pensadas para duas pessoas. Você paga por uma experiência e duas pessoas participam, promovendo conexões autênticas.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-gray-600 text-sm">Sim! Não há compromisso de longo prazo. Você pode cancelar sua assinatura a qualquer momento através do seu dashboard.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">O que acontece se eu não usar todas as experiências do mês?</h4>
              <p className="text-gray-600 text-sm">Membros Ambassador podem transferir experiências entre meses. Outros planos renovam mensalmente.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Como é feita a curadoria das experiências?</h4>
              <p className="text-gray-600 text-sm">Nossa equipe seleciona cuidadosamente cada parceiro cultural, priorizando autenticidade, qualidade e potencial de conexão humana.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}