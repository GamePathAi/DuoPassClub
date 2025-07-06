import React from 'react';
import { ArrowRight, CheckCircle, TrendingUp, Users, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HowItWorks() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "40% aumento em novos clientes",
      description: "Clientes qualificados que valorizam experiências culturais autênticas"
    },
    {
      icon: Users,
      title: "85% taxa de retorno",
      description: "Usuários DUO PASS criam vínculos duradouros com parceiros"
    },
    {
      icon: Heart,
      title: "12k+ pessoas engajadas",
      description: "Exposição em rede de pessoas culturalmente conscientes"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Cadastro",
      description: "Conte sua história e propósito cultural"
    },
    {
      step: "2",
      title: "Curadoria",
      description: "Nossa equipe ajuda a criar sua experiência perfeita"
    },
    {
      step: "3",
      title: "Aprovação",
      description: "Análise baseada em valores culturais compartilhados"
    },
    {
      step: "4",
      title: "Ativação",
      description: "Seu espaço entra na plataforma e recebe visitantes"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      business: "Café das Letras",
      quote: "O DUO PASS transformou nosso café em um ponto de encontro cultural. Recebemos pessoas que realmente valorizam nossa proposta.",
      impact: "300% aumento em conexões genuínas"
    },
    {
      name: "João Santos",
      business: "Ateliê Criativo",
      quote: "Finalmente uma plataforma que entende que vendemos experiências, não produtos. Nossos valores se alinham perfeitamente.",
      impact: "85% dos visitantes retornam"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-rose-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-6">
              Como Funciona o DUO PASS para Parceiros
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforme seu espaço em um destino cultural para pessoas que valorizam autenticidade e propósito
            </p>
          </div>
        </div>
      </section>

      {/* Para Estabelecimentos Culturais */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              🎭 Para Estabelecimentos Culturais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sem custo inicial - só ganha quando vende. Dashboard com analytics de impacto cultural.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-100 to-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cadastre suas experiências autênticas</h3>
              <p className="text-gray-600">Conte sua história e o que torna seu espaço especial</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-100 to-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Receba clientes qualificados</h3>
              <p className="text-gray-600">Pessoas que valorizam cultura e experiências genuínas</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-100 to-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sem custo inicial</h3>
              <p className="text-gray-600">Só ganha quando vende - parceria de sucesso mútuo</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-100 to-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Dashboard com analytics</h3>
              <p className="text-gray-600">Acompanhe o impacto cultural do seu espaço</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Comprovados */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              📊 Benefícios Comprovados
            </h2>
            <p className="text-xl text-gray-600">
              Resultados reais de parceiros que já fazem parte do movimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="bg-gradient-to-br from-amber-500 to-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Processo Simples */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              🔄 Processo Simples
            </h2>
            <p className="text-xl text-gray-600">
              Do cadastro à ativação em 4 passos simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-gradient-to-br from-amber-500 to-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < process.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-400 absolute top-8 -right-3 hidden md:block" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Detalhes do Processo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Upload de experiências com nossa ajuda</h4>
                <p className="text-gray-600 mb-4">Nossa equipe de curadoria trabalha com você para criar descrições autênticas e atrativas das suas experiências.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Receba reservas e acompanhe métricas</h4>
                <p className="text-gray-600 mb-4">Dashboard completo com analytics de impacto cultural, não apenas vendas.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Pagamento automático das comissões</h4>
                <p className="text-gray-600 mb-4">Sistema transparente e automático de repasse dos valores.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Suporte contínuo</h4>
                <p className="text-gray-600 mb-4">Equipe dedicada para ajudar no crescimento do seu impacto cultural.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exemplos de Sucesso */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              💡 Exemplos de Sucesso
            </h2>
            <p className="text-xl text-gray-600">
              Depoimentos de parceiros que já fazem parte do movimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6 text-lg">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-800 text-lg">{testimonial.name}</div>
                  <div className="text-gray-600 mb-2">{testimonial.business}</div>
                  <div className="text-green-600 font-medium">{testimonial.impact}</div>
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
            Pronto para fazer parte do movimento?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Junte-se a uma comunidade que valoriza autenticidade, propósito e conexões genuínas
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/cadastro-parceiro"
              className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <span>Começar Cadastro</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/cultural-partner-landing"
              className="text-white font-medium hover:text-amber-100 transition-colors"
            >
              Voltar à página inicial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}