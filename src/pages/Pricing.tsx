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
    id: 'freemium',
    name: 'Freemium',
    icon: <Star className="w-6 h-6 text-gray-500" />,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Continue a descobrir após sua Golden Week.',
    features: [
      '1 Experiência Freemium por mês',
      'Acesso a parceiros selecionados',
      'Newsletter com destaques culturais',
      'Funcionalidades básicas do app'
    ],
    cta: 'Continue Grátis'
  },
  {
    id: 'golden_yearly',
    name: 'Golden Member',
    icon: <Crown className="w-8 h-8 text-yellow-400" />,
    badge: 'Economize 2 meses',
    badgeColor: 'bg-gradient-to-r from-orange-500 to-purple-600 text-white',
    monthlyPrice: 12,
    yearlyPrice: 120, // Exemplo: 10 * 12
    description: 'Acesso total. A melhor experiência cultural.',
    features: [
      'Inicia com 7 dias de Golden Week Trial',
      '4 Golden Vouchers por mês',
      'Acesso a TODAS as experiências (Golden & Premium)',
      'Eventos exclusivos para membros',
      'Curadoria de IA personalizada',
      'Suporte prioritário'
    ],
    popular: true,
    cta: 'Começar minha Golden Week'
  },
  {
    id: 'golden_monthly',
    name: 'Golden Member',
    icon: <Crown className="w-6 h-6 text-yellow-400" />,
    monthlyPrice: 15,
    yearlyPrice: 180,
    description: 'Flexibilidade total para o explorador moderno.',
    features: [
      'Todos os benefícios do plano Golden',
      'Pague mês a mês',
      'Cancele quando quiser'
    ],
    cta: 'Assinar Plano Mensal'
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

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePlanSelect = (planId: string) => {
    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }

    if (planId === 'free') {
      // Lógica para ativar o plano gratuito diretamente
      // Aqui você chamaria uma função para atualizar o status do usuário no backend
      alert('Plano gratuito ativado com sucesso!');
      navigate('/customer-dashboard');
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
    <>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center py-24 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            7 Dias de Acesso Golden Grátis.
            <span className="block text-yellow-300">Depois, continue no Freemium para sempre.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto">
            Experimente o melhor do DuoPass com a Golden Week: acesso ilimitado a todas as experiências. Após o trial, continue descobrindo a cultura local com nosso plano Freemium.
          </p>
            
            <div className="mt-8 flex justify-center">
              <button onClick={() => handlePlanSelect('golden_yearly')} className="bg-white text-orange-600 font-bold py-4 px-10 rounded-full text-xl hover:bg-orange-50 transition-transform transform hover:scale-105 shadow-lg">
                Começar minha Golden Week
              </button>
            </div>
          </div>
        </div>

      
      <div id="pricing-table" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 font-semibold ${!isYearly ? 'text-purple-700' : 'text-gray-500'}`}>Faturamento Mensal</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isYearly ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
              <span className={`ml-3 font-semibold ${isYearly ? 'text-purple-700' : 'text-gray-500'}`}>Faturamento Anual</span>
              {isYearly && (
                <span className="ml-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  Economize 2 meses!
                </span>
              )}
            </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-start">
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
                  <div className="text-center mb-6 h-24">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.id === 'freemium' ? 'Grátis' : `CHF ${isYearly && plan.id === 'golden_yearly' ? (plan.yearlyPrice / 12).toFixed(0) : plan.monthlyPrice}`}
                      </span>
                      <span className="text-gray-500 ml-1">
                        {plan.id !== 'freemium' ? '/mês' : ''}
                      </span>
                    </div>
                    {plan.id === 'golden_yearly' && isYearly && (
                      <p className="text-green-600 text-sm mt-1">
                        Total: CHF {plan.yearlyPrice}/ano
                      </p>
                    )}
                     {plan.id === 'golden_monthly' && (
                      <p className="text-sm mt-1 text-gray-500">
                        Plano flexível
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
                    onClick={() => handlePlanSelect(plan.id === 'golden_monthly' ? 'golden_monthly' : 'golden_yearly')}
                    disabled={plan.id === 'freemium'}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${ 
                      plan.popular
                        ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:from-orange-600 hover:to-purple-700 shadow-lg'
                        : plan.id === 'freemium'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50'
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
    </>
  );
};