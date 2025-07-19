import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star, Crown, Trophy, ArrowRight, Sparkles, Gift, Users, Zap, Shield, Clock, Heart } from 'lucide-react';
import { MEMBERSHIP_PLANS, MembershipPlan } from '../types/membership';
import { useAuth } from '../contexts/AuthContext';

export default function Memberships() {
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
      {/* Hero Section Golden Week */}
      <div className="bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 border-2 border-orange-200 rounded-2xl p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200 to-transparent rounded-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200 to-transparent rounded-full opacity-50"></div>
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              7 Dias de Experiências
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Culturais Premium
            </span>
          </h1>
          <p className="text-2xl text-gray-700 mb-2 font-semibold">
            Depois, continue com <strong className="text-green-600">1 experiência/mês para sempre</strong>
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Sem cartão de crédito • Sem compromisso • Qualidade Michelin garantida
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-white/70 rounded-xl border border-orange-100">
              <Gift className="w-10 h-10 text-orange-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">4 Vouchers Premium</h3>
              <p className="text-gray-600 text-sm">Experiências top-tier Michelin</p>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-xl border border-purple-100">
              <Users className="w-10 h-10 text-purple-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Connect Completo</h3>
              <p className="text-gray-600 text-sm">Todas as 5 comunidades VIP</p>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-xl border border-yellow-100">
              <Star className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Curadoria Personal</h3>
              <p className="text-gray-600 text-sm">Baseada em suas preferências</p>
            </div>
            <div className="text-center p-4 bg-white/70 rounded-xl border border-blue-100">
              <Zap className="w-10 h-10 text-blue-500 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Suporte Priority</h3>
              <p className="text-gray-600 text-sm">Resposta garantida em 2h</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 text-white font-bold py-5 px-10 rounded-2xl text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-4 mx-auto mb-4">
            <Crown className="w-7 h-7" />
            <span>Começar Golden Week Grátis</span>
            <ArrowRight className="w-7 h-7" />
          </button>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-500" />
              <span>Sem compromisso</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span>Ativação imediata</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              <span>1000+ casais satisfeitos</span>
            </div>
          </div>
        </div>
      </div>

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
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quer mais experiências? Faça upgrade quando quiser
            </h2>
            <p className="text-gray-600">
              Todos os planos incluem tudo do Freemium + benefícios exclusivos
            </p>
          </div>

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

        {/* Freemium Card */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cultural Freemium</h3>
            <p className="text-green-600 font-bold text-lg mb-4">SEMPRE GRATUITO</p>
            <p className="text-gray-600 text-sm mb-4">Disponível automaticamente após Golden Week</p>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                <span>1 Voucher Cultural/Mês</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                <span>Experiências Selecionadas</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-3" />
                <span>Connect Básico</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-xs text-green-700">
                ✨ <strong>Nenhuma pegadinha:</strong> Após 7 dias, continue grátis para sempre
              </p>
            </div>
          </div>
        </div>

        {/* Header for paid plans */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quer mais experiências? Faça upgrade quando quiser
          </h2>
          <p className="text-gray-600">
            Todos os planos incluem tudo do Freemium + benefícios exclusivos
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">


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
                    {plan.name === 'Cultural Starter' && <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full mb-4 inline-block">POPULAR PARA CASAIS</span>}
                    {plan.name === 'Cultural Ambassador' && <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full mb-4 inline-block">EXPERIÊNCIA PREMIUM</span>}
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 h-10">{plan.name === 'Cultural Explorer' ? 'O plano mais popular para exploradores culturais ativos' : plan.description}</p>
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
                        <span className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: plan.name === 'Cultural Starter' && featureIndex === 0 ? '<strong>Tudo do Freemium</strong> + benefícios abaixo' : feature }}></span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg"
                  >
                    Começar Golden Week → Upgrade
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    7 dias premium grátis, depois {plan.name} ou continue no Freemium
                  </p>
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

        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold mb-2">❓ O que acontece após os 7 dias?</h3>
              <p className="text-gray-600 text-sm">Você continua com 1 experiência/mês <strong>PARA SEMPRE</strong>, sem custos.</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold mb-2">❓ Preciso cancelar algo?</h3>
              <p className="text-gray-600 text-sm"><strong>Não!</strong> O freemium é permanente. Upgrade opcional.</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold mb-2">❓ Por que é grátis?</h3>
              <p className="text-gray-600 text-sm">Somos confiantes na qualidade. 7 dias são suficientes para você perceber o valor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}