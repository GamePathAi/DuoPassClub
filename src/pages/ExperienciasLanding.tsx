import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import CulturalExperiences from '../components/CulturalExperiences';

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

export default function ExperienciasLanding() {
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

          <CulturalExperiences limit={9} showHeader={false} isLandingPage={true} />
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