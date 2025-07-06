import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, Star, Crown, Trophy, Users, Heart, Shield, Clock } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Cultural Starter',
    icon: <Star className="w-6 h-6" />,
    badge: 'Ideal para iniciantes',
    badgeColor: 'bg-blue-100 text-blue-800',
    monthlyPrice: 9,
    yearlyPrice: 86,
    description: 'Perfeito para descobrir a cultura suíça',
    features: [
      '2 experiências culturais/mês',
      'Acesso a cafés e experiências básicas',
      'Newsletter cultural semanal',
      'Comunidade DUO PASS Connect',
      'Suporte por email'
    ],
    cta: 'Experimentar grátis'
  },
  {
    id: 'explorer',
    name: 'Cultural Explorer',
    icon: <Crown className="w-6 h-6" />,
    badge: 'Mais popular',
    badgeColor: 'bg-gradient-to-r from-orange-500 to-purple-600 text-white',
    monthlyPrice: 12,
    yearlyPrice: 115,
    description: 'A escolha ideal para exploradores culturais',
    features: [
      '4 experiências culturais/mês',
      'Acesso completo: restaurantes, spas, arte',
      'Eventos exclusivos mensais',
      'Curadoria personalizada',
      'Prioridade no atendimento',
      'Comunidades premium'
    ],
    popular: true,
    cta: 'Escolher plano'
  },
  {
    id: 'ambassador',
    name: 'Cultural Ambassador',
    icon: <Trophy className="w-6 h-6" />,
    badge: 'Para especialistas',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    monthlyPrice: 18,
    yearlyPrice: 173,
    description: 'Experiência cultural completa e exclusiva',
    features: [
      'Experiências ilimitadas',
      'Acesso VIP a eventos especiais',
      'Convidados extras (+2 pessoas)',
      'Concierge cultural personalizado',
      'Acesso beta a novas experiências',
      'Mentoria cultural'
    ],
    cta: 'Escolher plano'
  }
];

const benefits = [
  {
    icon: <Users className="w-8 h-8 text-orange-500" />,
    title: 'Sempre 2 por 1',
    description: 'Todas as experiências são pensadas para duplas'
  },
  {
    icon: <Heart className="w-8 h-8 text-purple-500" />,
    title: 'Curadoria Cultural',
    description: 'Seleção de estabelecimentos autênticos e únicos'
  },
  {
    icon: <Shield className="w-8 h-8 text-green-500" />,
    title: 'Sem Compromisso',
    description: 'Cancele quando quiser, sem taxas ou multas'
  },
  {
    icon: <Clock className="w-8 h-8 text-blue-500" />,
    title: 'Garantia 30 dias',
    description: 'Satisfação garantida ou seu dinheiro de volta'
  }
];

const testimonials = [
  {
    name: 'Ana',
    age: 29,
    text: 'Descobri lugares incríveis que nunca encontraria sozinha',
    rating: 5
  },
  {
    name: 'Pedro',
    age: 35,
    text: 'Cada experiência é uma nova conexão cultural',
    rating: 5
  },
  {
    name: 'Clara',
    age: 42,
    text: 'Melhor investimento que fiz em qualidade de vida',
    rating: 5
  }
];

const faqs = [
  {
    question: 'Como funciona o modelo 2 por 1?',
    answer: 'Todas as nossas experiências são pensadas para duplas. Você paga por uma experiência e pode levar um acompanhante gratuitamente.'
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim! Não há compromisso de permanência. Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.'
  },
  {
    question: 'Que tipos de experiências estão incluídas?',
    answer: 'Oferecemos experiências em restaurantes, spas, atividades artísticas, eventos culturais, workshops e muito mais, todos cuidadosamente selecionados.'
  },
  {
    question: 'Os parceiros são verificados?',
    answer: 'Absolutamente! Todos os nossos parceiros passam por um rigoroso processo de curadoria para garantir qualidade e autenticidade.'
  },
  {
    question: 'Funciona para turistas?',
    answer: 'Sim! Nossas experiências são perfeitas tanto para residentes quanto para turistas que querem conhecer a verdadeira cultura suíça.'
  }
];

export const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanSelect = (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    navigate('/checkout', { 
      state: { 
        planId, 
        billing: isYearly ? 'yearly' : 'monthly' 
      } 
    });
  };

  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - yearly;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Experiências Culturais Autênticas
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Conecte-se com a cultura suíça através de experiências únicas para viver em dupla
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${!isYearly ? 'text-white' : 'text-white/70'}`}>Mensal</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${isYearly ? 'text-white' : 'text-white/70'}`}>Anual</span>
              {isYearly && (
                <span className="ml-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-semibold">
                  Economize 20%
                </span>
              )}
            </div>
            
            <p className="text-lg opacity-90">
              🎭 Mais de 500 experiências culturais curadas
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const savings = isYearly ? calculateSavings(plan.monthlyPrice, plan.yearlyPrice) : null;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-orange-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                    ⭐ MAIS POPULAR
                  </div>
                )}
                
                <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full text-white mb-4">
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${plan.badgeColor}`}>
                      {plan.badge}
                    </span>
                  </div>
                  
                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">CHF {price}</span>
                      <span className="text-gray-500 ml-1">/{isYearly ? 'ano' : 'mês'}</span>
                    </div>
                    {isYearly && savings && (
                      <p className="text-green-600 text-sm mt-1">
                        Economize CHF {savings.savings}/ano ({savings.percentage}%)
                      </p>
                    )}
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:from-orange-600 hover:to-purple-700 shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher DUO PASS?
            </h2>
            <p className="text-xl text-gray-600">
              Mais que um clube de benefícios, uma porta para a cultura autêntica
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-orange-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos membros dizem
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="text-sm text-gray-500">
                  {testimonial.name}, {testimonial.age} anos
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <span className="text-gray-500">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Comece sua jornada cultural hoje
          </h2>
          <p className="text-xl mb-8 opacity-90">
            7 dias grátis • Sem cartão de crédito necessário • Cancele quando quiser
          </p>
          <button
            onClick={() => handlePlanSelect('explorer')}
            className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Experimentar grátis por 7 dias
          </button>
        </div>
      </div>
    </div>
  );
};