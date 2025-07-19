import React from 'react';
import { CheckCircle, Mail, MessageCircle, ArrowRight, Heart, Clock, Users, FileCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function PartnerSuccess() {
  const location = useLocation();
  const contactName = location.state?.contactName || 'Parceiro';
  const businessName = location.state?.businessName;
  const registrationId = location.state?.registrationId;

  const nextSteps = [
    {
      icon: FileCheck,
      title: "Análise (24-48h)",
      description: "Nossa equipe vai avaliar sua proposta e verificar o alinhamento com nossos valores culturais",
      timeframe: "1-2 dias"
    },
    {
      icon: Users,
      title: "Entrevista",
      description: "Se aprovado, agendaremos uma conversa para conhecer melhor sua história e propósito",
      timeframe: "3-5 dias"
    },
    {
      icon: Heart,
      title: "Curadoria",
      description: "Ajudamos a criar sua experiência perfeita, com descrições autênticas e atrativas",
      timeframe: "1 semana"
    },
    {
      icon: CheckCircle,
      title: "Ativação",
      description: "Seu espaço entra na plataforma e começa a receber visitantes culturalmente engajados",
      timeframe: "2 semanas"
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@dupassclub.ch",
      description: "Para dúvidas sobre o processo"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "(11) 99999-9999",
      description: "Suporte direto e rápido"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 pt-16">
      {/* Hero Success Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-rose-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="bg-gradient-to-r from-green-400 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              🎉 Cadastro Recebido com Sucesso!
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              Olá <span className="font-semibold text-amber-600">{contactName}</span>, recebemos seu interesse em fazer parte do DUO PASS Club.
            </p>
            
            {businessName && (
              <p className="text-lg text-gray-600 mb-6">
                Estamos animados para conhecer mais sobre <span className="font-semibold text-rose-600">{businessName}</span>!
              </p>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-center space-x-2 text-blue-700">
                <Mail className="w-5 h-5" />
                <span className="font-semibold">📧 Emails de Confirmação Enviados</span>
              </div>
              <p className="text-blue-600 mt-2 text-sm">
                Enviamos um email de confirmação para você e notificamos nossa equipe. Verifique sua caixa de entrada (e spam) para mais detalhes.
              </p>
              {registrationId && (
                <p className="text-blue-500 mt-2 text-xs font-mono">
                  ID do Cadastro: {registrationId}
                </p>
              )}
            </div>
            
            <div className="bg-gradient-to-r from-amber-100 to-rose-100 rounded-lg p-6 mb-8">
              <p className="text-lg text-gray-700">
                <Heart className="w-5 h-5 inline text-rose-500 mr-2" />
                <strong>Sua história merece ser vivida!</strong> Estamos ansiosos para conhecer mais sobre seu espaço e como podemos juntos criar experiências culturais autênticas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Passos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              📋 Próximos Passos
            </h2>
            <p className="text-xl text-gray-600">
              Aqui está o que acontece agora e quando você pode esperar cada etapa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl p-6 h-full">
                    <div className="bg-gradient-to-br from-amber-500 to-rose-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{step.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-600">{step.timeframe}</span>
                    </div>
                  </div>
                  
                  {index < nextSteps.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-gray-400 absolute top-1/2 -right-3 transform -translate-y-1/2 hidden lg:block" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-16 bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">O que esperar durante o processo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">📞 Entrevista Personalizada</h4>
                <p className="text-gray-600 mb-4">
                  Nossa conversa será focada em entender sua história, valores e como podemos criar uma parceria autêntica que beneficie tanto seu negócio quanto nossa comunidade.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">🎨 Curadoria Colaborativa</h4>
                <p className="text-gray-600 mb-4">
                  Trabalharemos juntos para criar descrições que capturem a essência do seu espaço e atraiam pessoas que realmente valorizam experiências culturais.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">📊 Dashboard Exclusivo</h4>
                <p className="text-gray-600 mb-4">
                  Após a ativação, você terá acesso a métricas de impacto cultural, não apenas vendas - porque medimos conexões genuínas.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">🤝 Suporte Contínuo</h4>
                <p className="text-gray-600 mb-4">
                  Nossa equipe estará sempre disponível para ajudar no crescimento do seu impacto cultural e otimização da experiência.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-rose-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              📧 Mantenha Contato
            </h2>
            <p className="text-xl text-gray-600">
              Tem alguma dúvida ou quer saber mais sobre o processo? Estamos aqui para ajudar!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="bg-gradient-to-br from-amber-500 to-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{contact.title}</h3>
                  <p className="text-lg font-medium text-amber-600 mb-2">{contact.value}</p>
                  <p className="text-gray-600">{contact.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Enquanto isso...</h3>
              <p className="text-gray-600 mb-6">
                Que tal conhecer mais sobre nossa comunidade e ver como outros parceiros estão criando impacto cultural?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  to="/cultural-partner-landing"
                  className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Voltar à Página de Parceiros
                </Link>
                <Link
                  to="/"
                  className="text-gray-600 font-medium hover:text-gray-800 transition-colors"
                >
                  Conhecer o DUO PASS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Message */}
      <section className="py-12 bg-gradient-to-r from-amber-600 to-rose-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Sua história merece ser vivida! 💜
          </h2>
          <p className="text-xl text-amber-100">
            Obrigado por querer fazer parte do movimento que valoriza autenticidade, propósito e conexões genuínas.
          </p>
        </div>
      </section>
    </div>
  );
}