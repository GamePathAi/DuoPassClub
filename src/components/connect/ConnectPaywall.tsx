import React, { useState } from 'react';
import { 
  Crown, 
  Lock, 
  Users, 
  MessageCircle, 
  Heart, 
  Star, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Gift,
  Zap,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Mensal',
    price: 29.90,
    period: 'mês',
    description: 'Perfeito para começar',
    features: [
      'Acesso completo ao DUO PASS Connect',
      'Participação em todas as 5 comunidades',
      'Chat ilimitado com outros membros',
      'Questionário de afinidades culturais',
      'Recomendações personalizadas',
      'Suporte prioritário'
    ]
  },
  {
    id: 'quarterly',
    name: 'Trimestral',
    price: 24.90,
    period: 'mês',
    description: 'Mais popular',
    features: [
      'Tudo do plano mensal',
      'Desconto de 17% no valor total',
      'Acesso antecipado a novas funcionalidades',
      'Badge exclusivo de membro trimestral',
      'Convites para eventos especiais',
      'Consultoria cultural personalizada'
    ],
    popular: true,
    savings: 'Economize CHF 2.50 por trimestre'
  },
  {
    id: 'annual',
    name: 'Anual',
    price: 19.90,
    period: 'mês',
    description: 'Melhor valor',
    features: [
      'Tudo dos planos anteriores',
      'Desconto de 33% no valor total',
      'Acesso vitalício a funcionalidades básicas',
      'Badge exclusivo de membro anual',
      'Mentoria cultural mensal',
      'Acesso a comunidades premium futuras'
    ],
    savings: 'Economize CHF 22.- por ano'
  }
];

const connectFeatures = [
  {
    icon: Users,
    title: 'Comunidades Exclusivas',
    description: 'Participe de 5 comunidades culturais cuidadosamente curadas: Arte & Design, Gastronomia Gourmet, Música & Concertos, Bem-estar & Mindfulness, e Cultura & Patrimônio.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: MessageCircle,
    title: 'Chat Direto',
    description: 'Converse diretamente com outros membros que compartilham suas paixões culturais. Organize experiências, troque dicas e faça conexões reais.',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Heart,
    title: 'Matching Inteligente',
    description: 'Nosso questionário de afinidades culturais conecta você com pessoas que realmente combinam com seus interesses e estilo de vida.',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    icon: Star,
    title: 'Experiências Premium',
    description: 'Acesso a experiências culturais exclusivas, eventos especiais e oportunidades únicas disponíveis apenas para membros.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  }
];

export function ConnectPaywall() {
  const [selectedPlan, setSelectedPlan] = useState('quarterly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    
    // Simular processamento
    setTimeout(() => {
      alert(`Redirecionando para pagamento do plano ${pricingPlans.find(p => p.id === planId)?.name}...`);
      setIsProcessing(false);
    }, 2000);
  };

  const selectedPlanData = pricingPlans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mr-4">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold flex items-center">
                  DUO PASS Connect
                  <Sparkles className="w-8 h-8 ml-3" />
                </h1>
                <p className="text-xl text-white text-opacity-90 mt-2">
                  Conecte-se com pessoas que compartilham suas paixões culturais
                </p>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-white text-opacity-90 mb-8">
                Descubra uma nova forma de vivenciar a cultura. Conecte-se com pessoas que realmente 
                entendem suas paixões, participe de comunidades exclusivas e transforme cada experiência 
                cultural em uma memória compartilhada.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Membros verificados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Matching inteligente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gift className="w-5 h-5" />
                  <span>Experiências exclusivas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Por que o DUO PASS Connect é especial?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Não é apenas mais uma rede social. É uma comunidade exclusiva para pessoas que 
            valorizam experiências culturais autênticas e conexões significativas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {connectFeatures.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Escolha seu plano de acesso
            </h2>
            <p className="text-lg text-gray-600">
              Torne-se membro e desbloqueie todas as funcionalidades do DUO PASS Connect
            </p>
          </div>
          
          {/* Plan Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex space-x-1">
              {pricingPlans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-white text-[#C91F1F] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {plan.name}
                  {plan.popular && (
                    <span className="ml-2 bg-[#C91F1F] text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Selected Plan Details */}
          {selectedPlanData && (
            <div className="max-w-md mx-auto">
              <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 text-center ${
                selectedPlanData.popular ? 'border-[#F6C100]' : 'border-gray-200'
              }`}>
                {selectedPlanData.popular && (
                  <div className="bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white text-sm font-medium px-4 py-1 rounded-full inline-block mb-4">
                    Mais Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPlanData.name}</h3>
                <p className="text-gray-600 mb-6">{selectedPlanData.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">CHF {selectedPlanData.price.toFixed(2)}</span>
                    <span className="text-gray-600 ml-2">/{selectedPlanData.period}</span>
                  </div>
                  {selectedPlanData.savings && (
                    <p className="text-green-600 text-sm font-medium mt-2">{selectedPlanData.savings}</p>
                  )}
                </div>
                
                <button
                  onClick={() => handleSubscribe(selectedPlanData.id)}
                  disabled={isProcessing}
                  className={`w-full bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Crown className="w-5 h-5" />
                      <span>Tornar-se Membro</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                
                <div className="mt-6 space-y-3">
                  {selectedPlanData.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Pronto para transformar suas experiências culturais?
            </h2>
            <p className="text-lg text-white text-opacity-90 mb-6">
              Junte-se a centenas de pessoas que já descobriram uma nova forma de vivenciar a cultura.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Voltar ao Início</span>
              </Link>
              
              <button
                onClick={() => handleSubscribe(selectedPlan)}
                disabled={isProcessing}
                className="bg-white text-[#C91F1F] font-bold px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Crown className="w-5 h-5" />
                <span>Começar Agora</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center pointer-events-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Conteúdo Exclusivo para Membros
          </h3>
          <p className="text-gray-600 mb-6">
            O DUO PASS Connect é uma funcionalidade premium. Torne-se membro para acessar.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full bg-gradient-to-r from-[#C91F1F] to-[#F6C100] text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Ver Planos
          </button>
        </div>
      </div>
    </div>
  );
}