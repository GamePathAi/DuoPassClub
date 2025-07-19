import React, { useState } from 'react';
import { Heart, Users, Sparkles, MapPin, ArrowRight, CheckCircle, Star, Coffee, Palette, Music } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CulturalPartnerLanding() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui integraria com sistema de leads
    setSubmitted(true);
  };

  const partnerMessage = {
    hero: "Sua história merece ser vivida por pessoas que valorizam o autêntico",
    diferencial: "Não somos apenas cupons - somos cultura em movimento",
    beneficios: [
      "Clientes conscientes que buscam experiências com alma",
      "Visibilidade em uma comunidade de valores compartilhados",
      "Apoio na construção de relacionamentos, não apenas vendas",
      "Parceria de longo prazo baseada em propósito comum"
    ],
    cta: "FAÇA PARTE DESTE MOVIMENTO CULTURAL"
  };

  const testimonials = [
    {
      name: "Maria Silva",
      business: "Café das Letras",
      quote: "O DUO PASS trouxe pessoas que realmente valorizam nossa proposta cultural. Não são apenas clientes, são parte da nossa comunidade.",
      impact: "300% aumento em conexões genuínas"
    },
    {
      name: "João Santos",
      business: "Ateliê Criativo",
      quote: "Finalmente uma plataforma que entende que vendemos experiências, não produtos. Nossos valores se alinham perfeitamente.",
      impact: "85% dos visitantes retornam"
    },
    {
      name: "Ana Costa",
      business: "Restaurante da Vovó",
      quote: "Cada pessoa que chega através do DUO PASS já vem com o coração aberto para nossa história familiar.",
      impact: "4.9 estrelas em experiência cultural"
    }
  ];

  const culturalValues = [
    {
      icon: Heart,
      title: "Autenticidade",
      description: "Celebramos o que torna seu espaço único e especial"
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Construímos relacionamentos duradouros, não transações"
    },
    {
      icon: Sparkles,
      title: "Propósito",
      description: "Cada parceria tem um impacto cultural mensurável"
    },
    {
      icon: MapPin,
      title: "Local",
      description: "Fortalecemos a economia criativa da sua região"
    }
  ];

  const partnerTypes = [
    {
      icon: Coffee,
      title: "Cafés Culturais",
      description: "Espaços onde conversas fluem e ideias nascem",
      examples: ["Café com saraus", "Livrarias-café", "Espaços de coworking criativo"]
    },
    {
      icon: Palette,
      title: "Ateliês & Galerias",
      description: "Onde a arte local ganha vida e se conecta com pessoas",
      examples: ["Ateliês abertos", "Galerias independentes", "Oficinas criativas"]
    },
    {
      icon: Music,
      title: "Espaços Gastronômicos",
      description: "Restaurantes que contam histórias através dos sabores",
      examples: ["Restaurantes familiares", "Gastronomia autoral", "Experiências culinárias"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-rose-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Heart className="w-12 h-12 text-rose-500" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">
                DUO PASS
              </h1>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              {partnerMessage.hero}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {partnerMessage.diferencial}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => navigate('/cadastro-parceiro')}
                className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Começar Agora
              </button>
              <button 
                onClick={() => navigate('/como-funciona-parceiros')}
                className="text-gray-700 font-medium hover:text-gray-900 transition-colors"
              >
                Ver Como Funciona
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">150+</div>
              <div className="text-gray-600">Parceiros Culturais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600 mb-2">12k+</div>
              <div className="text-gray-600">Conexões Criadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8★</div>
              <div className="text-gray-600">Impacto Cultural</div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores Culturais */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Nossos Valores Compartilhados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mais que uma plataforma, somos um movimento cultural que conecta pessoas através de experiências autênticas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {culturalValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-gradient-to-br from-amber-100 to-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                Por que escolher o DUO PASS?
              </h2>
              <div className="space-y-6">
                {partnerMessage.beneficios.map((beneficio, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-lg text-gray-700">{beneficio}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Diferencial Cultural</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Plataformas tradicionais</span>
                  <span className="text-red-500 font-medium">Foco em vendas</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">DUO PASS</span>
                  <span className="text-green-500 font-medium">Foco em conexões</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Métricas tradicionais</span>
                  <span className="text-red-500 font-medium">ROI, conversão</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Nossas métricas</span>
                  <span className="text-green-500 font-medium">Impacto cultural</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Relacionamento</span>
                  <span className="text-green-500 font-medium">Longo prazo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Parceiros */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Parceiros que Respiram Cultura
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada tipo de espaço tem sua magia única. Qual é a sua?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-br from-amber-500 to-rose-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{type.title}</h3>
                  <p className="text-gray-600 mb-6">{type.description}</p>
                  <div className="space-y-2">
                    {type.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
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
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Histórias de Sucesso Cultural
            </h2>
            <p className="text-xl text-gray-600">
              Parceiros que transformaram suas experiências em conexões genuínas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm mb-2">{testimonial.business}</div>
                  <div className="text-green-600 font-medium text-sm">{testimonial.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-rose-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {partnerMessage.cta}
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Junte-se a uma comunidade que valoriza autenticidade, propósito e conexões genuínas
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu email para começar"
                  className="flex-1 px-6 py-4 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Começar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white/20 rounded-lg p-8 max-w-md mx-auto">
              <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Obrigado!</h3>
              <p className="text-amber-100">Em breve entraremos em contato para conhecer sua história.</p>
            </div>
          )}

          <div className="mt-8 text-amber-100 text-sm">
            Ou acesse diretamente o{' '}
            <Link to="/cultural-partner-portal" className="text-white font-semibold hover:underline">
              Portal do Parceiro Cultural
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}