import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Building2,
  Heart,
  Star,
  Phone,
  Mail
} from 'lucide-react';

export function BusinessPage() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    employees: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📋 Formulário B2B enviado:', formData);
    // Aqui seria integrado com o backend
    alert('Obrigado! Entraremos em contato em breve.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Experiências Culturais para Sua <span className="text-orange-300">Equipe</span>
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                Fortaleça vínculos, inspire criatividade e construa uma cultura corporativa única através de experiências culturais autênticas em dupla.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Agende uma Demonstração
                </button>
                <Link 
                  to="/experiencias"
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 text-center"
                >
                  Ver Experiências
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg">Team Building</h3>
                    <p className="text-purple-200 text-sm">Experiências em dupla</p>
                  </div>
                  <div className="text-center">
                    <Heart className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg">Cultura</h3>
                    <p className="text-purple-200 text-sm">Valores autênticos</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg">Engajamento</h3>
                    <p className="text-purple-200 text-sm">Equipes motivadas</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-lg">Resultados</h3>
                    <p className="text-purple-200 text-sm">ROI mensurável</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que Escolher DUO PASS para Sua Empresa?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforme sua cultura corporativa com experiências que conectam pessoas e fortalecem equipes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <Building2 className="w-12 h-12 text-purple-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cultura Corporativa</h3>
              <p className="text-gray-600 mb-6">
                Fortaleça os valores da sua empresa através de experiências culturais que refletem autenticidade e conexão humana.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Valores compartilhados
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Identidade corporativa
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Engajamento autêntico
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <Users className="w-12 h-12 text-orange-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Building Único</h3>
              <p className="text-gray-600 mb-6">
                Experiências sempre em dupla que criam vínculos genuínos e melhoram a colaboração entre equipes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Conexões em dupla
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Colaboração natural
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Vínculos duradouros
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-green-500 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">ROI Mensurável</h3>
              <p className="text-gray-600 mb-6">
                Acompanhe o impacto das experiências na produtividade, satisfação e retenção de talentos.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Métricas de engajamento
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Retenção de talentos
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Produtividade elevada
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que Nossos Parceiros Corporativos Dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6 italic">
                "As experiências culturais do DUO PASS transformaram nossa cultura corporativa. 
                Nossos colaboradores estão mais conectados e engajados do que nunca."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MC
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Maria Clara Santos</p>
                  <p className="text-gray-600">Diretora de RH, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl p-8">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6 italic">
                "O conceito de experiências em dupla é genial. Criou vínculos genuínos entre 
                equipes que antes mal se falavam. ROI comprovado!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  RS
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Roberto Silva</p>
                  <p className="text-gray-600">CEO, Inovação & Cia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Pronto para Transformar Sua Equipe?
            </h2>
            <p className="text-xl text-purple-200">
              Agende uma demonstração personalizada e descubra como o DUO PASS pode revolucionar sua cultura corporativa.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-gray-900">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Sua empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Corporativo *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="seu.email@empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Funcionários
                </label>
                <select
                  name="employees"
                  value={formData.employees}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="1-10">1-10 funcionários</option>
                  <option value="11-50">11-50 funcionários</option>
                  <option value="51-200">51-200 funcionários</option>
                  <option value="201-500">201-500 funcionários</option>
                  <option value="500+">500+ funcionários</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Conte-nos sobre seus objetivos e desafios de team building..."
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
                >
                  Agendar Demonstração
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-12 grid md:grid-cols-2 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Phone className="w-6 h-6 text-orange-300" />
              <div>
                <p className="font-semibold">Telefone</p>
                <p className="text-purple-200">+41 (0) 21 123 4567</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Mail className="w-6 h-6 text-orange-300" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-purple-200">empresas@duopass.ch</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}