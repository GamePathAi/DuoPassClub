import React from 'react';
import { ArrowRight, Heart, Users, Star, CheckCircle, Coffee, Palette, Leaf, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactModal from '../../components/ContactModal';
import ContactButton from '../../components/ContactButton';
import { useContactModal } from '../../hooks/useContactModal';

export default function HowItWorksPartners() {
  const { isOpen, openModal, closeModal } = useContactModal();
  
  const pillars = [
    {
      icon: Heart,
      title: "Autenticidade Cultural",
      description: "Valorizamos experiências genuínas que refletem a verdadeira essência cultural do seu espaço"
    },
    {
      icon: Users,
      title: "Comunidade Engajada",
      description: "Conectamos você com pessoas que realmente valorizam cultura, não apenas buscam descontos"
    },
    {
      icon: Star,
      title: "Curadoria de Qualidade",
      description: "Cada parceiro passa por um processo cuidadoso para garantir experiências excepcionais"
    }
  ];

  const process = [
    {
      number: "01",
      title: "Cadastro",
      description: "Conte sua história, missão cultural e a experiência que deseja oferecer",
      timeframe: "5 minutos"
    },
    {
      number: "02",
      title: "Análise",
      description: "Nossa equipe avalia o alinhamento com nossos valores culturais",
      timeframe: "24-48h"
    },
    {
      number: "03",
      title: "Curadoria",
      description: "Trabalhamos juntos para criar a descrição perfeita da sua experiência",
      timeframe: "1 semana"
    },
    {
      number: "04",
      title: "Ativação",
      description: "Seu espaço entra na plataforma e começa a receber visitantes engajados",
      timeframe: "2 semanas"
    }
  ];

  const practicalBenefits = [
    "Aumento de 40% no fluxo de clientes",
    "Redução de 60% em custos de marketing",
    "Dashboard com métricas de impacto cultural",
    "Suporte dedicado para otimização",
    "Pagamentos automáticos e seguros",
    "Flexibilidade total de horários e ofertas"
  ];

  const culturalBenefits = [
    "Conexão com pessoas que valorizam cultura",
    "Fortalecimento da identidade do seu espaço",
    "Rede de parceiros culturais colaborativos",
    "Visibilidade para audiência qualificada",
    "Impacto social mensurável",
    "Preservação e difusão cultural"
  ];

  const partnerTypes = [
    {
      icon: Coffee,
      title: "Gastronomia Cultural",
      description: "Restaurantes, cafés e bistrôs com identidade cultural forte",
      examples: ["Culinária regional autêntica", "Ambientes com história", "Experiências gastronômicas únicas"]
    },
    {
      icon: Palette,
      title: "Arte & Criatividade",
      description: "Galerias, ateliês e espaços de expressão artística",
      examples: ["Galerias independentes", "Ateliês de artistas", "Centros culturais"]
    },
    {
      icon: Leaf,
      title: "Bem-estar Consciente",
      description: "Espaços de wellness com propósito e conexão humana",
      examples: ["Yoga e meditação", "Terapias holísticas", "Retiros urbanos"]
    }
  ];

  const testimonials = [
    {
      name: "Maria Santos",
      business: "Café Cultural Raízes",
      location: "São Paulo, SP",
      quote: "O DuoPass trouxe pessoas que realmente se conectam com nossa proposta. Não são apenas clientes, são amigos que voltam sempre.",
      impact: "+65% de frequência",
      avatar: "👩🏽‍🦱"
    },
    {
      name: "João Oliveira",
      business: "Ateliê Mãos Criativas",
      location: "Rio de Janeiro, RJ",
      quote: "Finalmente encontrei uma plataforma que entende que arte não é commodity. Aqui, nossa história é valorizada.",
      impact: "+80% de workshops",
      avatar: "👨🏻‍🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-rose-50 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-orange-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Como Funciona para
              <span className="bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent block">
                Parceiros Culturais
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Não somos apenas uma plataforma de cupons. Somos um movimento que conecta espaços culturais autênticos com pessoas que valorizam experiências genuínas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/cadastro-parceiro"
                className="bg-gradient-to-r from-purple-600 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Quero Ser Parceiro</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <ContactButton
                onClick={openModal}
                variant="secondary"
                size="lg"
              />
            </div>
          </div>

          {/* Benefícios Visuais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Audiência Qualificada</h3>
              <p className="text-gray-600">Pessoas que buscam cultura, não apenas preço</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">💝</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Zero Custo Inicial</h3>
              <p className="text-gray-600">Sem taxas de adesão ou mensalidades</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Crescimento Sustentável</h3>
              <p className="text-gray-600">Impacto cultural mensurável</p>
            </div>
          </div>
        </div>
      </section>

      {/* O que é - 3 Pilares */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              🌟 Nossos 3 Pilares Culturais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mais que uma plataforma, somos um movimento que acredita na força transformadora da cultura autêntica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-xl p-8 text-center">
                  <div className="bg-gradient-to-br from-purple-600 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{pillar.title}</h3>
                  <p className="text-gray-600">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Processo - 4 Passos */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              📋 Do Cadastro à Ativação
            </h2>
            <p className="text-xl text-gray-600">
              Um processo cuidadoso que garante qualidade e autenticidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 h-full shadow-lg">
                  <div className="bg-gradient-to-br from-purple-600 to-orange-600 text-white text-2xl font-bold w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <div className="text-sm font-medium text-purple-600">
                    ⏱️ {step.timeframe}
                  </div>
                </div>
                {index < process.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-400 absolute top-1/2 -right-3 transform -translate-y-1/2 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios - 2 Colunas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              🎁 Benefícios que Fazem a Diferença
            </h2>
            <p className="text-xl text-gray-600">
              Resultados práticos e impacto cultural genuíno
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Benefícios Práticos */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">💼</span>
                Benefícios Práticos
              </h3>
              <div className="space-y-4">
                {practicalBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefícios Culturais */}
            <div className="bg-gradient-to-br from-purple-50 to-rose-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">🎨</span>
                Impacto Cultural
              </h3>
              <div className="space-y-4">
                {culturalBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Parceiros */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              🏛️ Tipos de Parceiros Culturais
            </h2>
            <p className="text-xl text-gray-600">
              Espaços diversos unidos pela paixão por cultura autêntica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="bg-gradient-to-br from-orange-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{type.title}</h3>
                  <p className="text-gray-600 mb-6 text-center">{type.description}</p>
                  <div className="space-y-2">
                    {type.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              💬 Cases de Sucesso
            </h2>
            <p className="text-xl text-gray-600">
              Histórias reais de parceiros que transformaram seus negócios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-xl p-8">
                <Quote className="w-8 h-8 text-purple-600 mb-4" />
                <p className="text-lg text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.business}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-gradient-to-r from-purple-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {testimonial.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            🚀 Pronto para Fazer Parte?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Junte-se a centenas de parceiros que já estão transformando cultura em conexão
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/cadastro-parceiro"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <ContactButton
              onClick={openModal}
              variant="outline"
              size="lg"
            >Falar Conosco</ContactButton>
          </div>
          
          <div className="mt-8 text-purple-100">
            <p className="text-sm">
              📞 Dúvidas? Entre em contato: <a href="mailto:contact@dupassclub.ch" className="underline hover:no-underline">contact@dupassclub.ch</a>
            </p>
          </div>
        </div>
      </section>
      
      {/* Modal de Contato */}
      <ContactModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
};