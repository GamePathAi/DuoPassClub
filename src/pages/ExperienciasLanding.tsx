import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star } from 'lucide-react';

const mockExperiences = [
  {
    id: 1,
    title: 'Jantar Romântico no Restaurante Gourmet',
    category: 'Gastronomia',
    location: 'Centro, Zurique',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    rating: 4.8,
    description: 'Experiência gastronômica única para duas pessoas'
  },
  {
    id: 2,
    title: 'Concerto de Música Clássica',
    category: 'Música',
    location: 'Opera House, Zurique',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    rating: 4.9,
    description: 'Noite inesquecível de música clássica'
  },
  {
    id: 3,
    title: 'Workshop de Arte Contemporânea',
    category: 'Arte',
    location: 'Galeria Central, Zurique',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    rating: 4.7,
    description: 'Aprenda técnicas de arte moderna em dupla'
  },
  {
    id: 4,
    title: 'Tour Cultural pela Cidade Antiga',
    category: 'Cultura',
    location: 'Centro Histórico, Zurique',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.6,
    description: 'Descubra a história suíça em uma caminhada guiada'
  },
  {
    id: 5,
    title: 'Degustação de Vinhos Suíços',
    category: 'Gastronomia',
    location: 'Wine Bar Premium, Zurique',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
    rating: 4.8,
    description: 'Explore os melhores vinhos locais'
  },
  {
    id: 6,
    title: 'Espetáculo de Teatro Contemporâneo',
    category: 'Teatro',
    location: 'Teatro Municipal, Zurique',
    image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400&h=300&fit=crop',
    rating: 4.7,
    description: 'Performance teatral inovadora e envolvente'
  }
];

const howItWorksSteps = [
  {
    step: '1',
    title: 'Escolha sua Experiência',
    description: 'Navegue por nossa curadoria de experiências culturais autênticas',
    icon: '🎭'
  },
  {
    step: '2',
    title: 'Sempre em Dupla',
    description: 'Todas as experiências são para duas pessoas - conecte-se!',
    icon: '👥'
  },
  {
    step: '3',
    title: 'Resgate e Aproveite',
    description: 'Use seu voucher e viva momentos únicos na cultura suíça',
    icon: '✨'
  }
];

export function ExperienciasLanding() {
  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-purple-600 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Descubra Experiências
            <br />
            <span className="text-yellow-300">Culturais Autênticas</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Conecte-se com a cultura suíça através de experiências únicas, sempre em dupla.
            Cada momento é uma oportunidade de criar memórias inesquecíveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Faça Login para Ver Ofertas
            </Link>
            <Link
              to="/signup"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </section>

      {/* Preview de Experiências */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#333333] mb-4">
              Experiências em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma prévia das experiências culturais que aguardam por você
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockExperiences.map((experience) => (
              <div key={experience.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {experience.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {experience.rating}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#333333] mb-2">
                    {experience.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {experience.description}
                  </p>
                  <div className="flex items-center text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{experience.location}</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white p-4 rounded-lg text-center">
                    <p className="font-semibold mb-2">🔒 Faça login para ver preços e resgatar</p>
                    <Link
                      to="/login"
                      className="inline-flex items-center text-yellow-300 hover:text-yellow-200 font-medium"
                    >
                      Acessar agora
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#333333] mb-4">
              Como Funciona o DUO PASS
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simples, cultural e sempre em dupla
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">
                  {step.icon}
                </div>
                <div className="bg-white text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 border-2 border-purple-600">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Viver Experiências Únicas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se ao DUO PASS e descubra a cultura suíça de uma forma completamente nova.
            Sempre em dupla, sempre autêntico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Começar Gratuitamente
            </Link>
            <Link
              to="/memberships"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-200"
            >
              Ver Planos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}