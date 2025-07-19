import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Users, CreditCard, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermosDeUso() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Termos de Uso</h1>
            <p className="text-lg text-gray-600">DUO PASS Club - Experiências Culturais na Suíça</p>
            <p className="text-sm text-gray-500 mt-2">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="prose prose-lg max-w-none">
            
            {/* Seção 1: Definições */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800 m-0">1. Definições e Conceito DUO PASS</h2>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">🎭 O que é o DUO PASS Club?</h3>
                <p className="text-gray-700 mb-3">
                  O DUO PASS Club é uma plataforma cultural suíça que conecta pessoas através de experiências autênticas, 
                  sempre em dupla (2 por 1). Não somos um app de cupons - somos uma comunidade cultural.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>"Experiência DUO":</strong> Atividades culturais para 2 pessoas pelo preço de 1</li>
                  <li><strong>"Parceiro Cultural":</strong> Estabelecimentos curados que oferecem experiências autênticas</li>
                  <li><strong>"Membership":</strong> Assinatura mensal/anual que dá acesso às experiências</li>
                  <li><strong>"Curadoria Emocional":</strong> Seleção baseada em histórias e propósito cultural</li>
                </ul>
              </div>
            </section>

            {/* Seção 2: Membership */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-800 m-0">2. Condições de Membership</h2>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-amber-500 pl-4">
                  <h3 className="font-semibold text-gray-800">2.1 Tipos de Planos</h3>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li><strong>Cultural Starter:</strong> CHF 9/mês (ou CHF 8/mês anual) - 2 experiências por mês</li>
                    <li><strong>Cultural Explorer:</strong> CHF 12/mês (ou CHF 10/mês anual) - 4 experiências por mês</li>
                    <li><strong>Cultural Ambassador:</strong> CHF 18/mês (ou CHF 15/mês anual) - Experiências ilimitadas</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-amber-500 pl-4">
                  <h3 className="font-semibold text-gray-800">2.2 Renovação Automática</h3>
                  <p className="text-gray-700 mt-2">
                    Sua assinatura renova automaticamente no mesmo período (mensal/anual) até o cancelamento. 
                    Você será notificado 7 dias antes de cada cobrança.
                  </p>
                </div>
                
                <div className="border-l-4 border-amber-500 pl-4">
                  <h3 className="font-semibold text-gray-800">2.3 Teste Grátis</h3>
                  <p className="text-gray-700 mt-2">
                    Novos usuários têm direito a 7 dias de teste grátis. Você pode cancelar durante este período 
                    sem nenhuma cobrança.
                  </p>
                </div>
              </div>
            </section>

            {/* Seção 3: Uso das Experiências */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800 m-0">3. Uso das Experiências</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Regras de Uso</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Experiências são sempre para 2 pessoas (conceito DUO)</li>
                    <li>Válidas apenas durante o período de membership ativo</li>
                    <li>Sujeitas à disponibilidade do parceiro cultural</li>
                    <li>Não podem ser transferidas ou vendidas</li>
                    <li>Reservas devem ser feitas através da plataforma</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">❌ Uso Indevido</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Revenda ou transferência de experiências</li>
                    <li>Uso comercial das experiências</li>
                    <li>Comportamento inadequado nos estabelecimentos</li>
                    <li>Falsificação de informações de reserva</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Seção 4: Responsabilidades */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800 m-0">4. Responsabilidades</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">DUO PASS Club</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Manter a plataforma funcionando</li>
                    <li>Curadoria de parceiros culturais</li>
                    <li>Suporte ao cliente</li>
                    <li>Proteção de dados pessoais</li>
                    <li>Processamento de pagamentos</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Usuário</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Uso respeitoso da plataforma</li>
                    <li>Informações verdadeiras</li>
                    <li>Pagamento em dia</li>
                    <li>Respeito aos parceiros culturais</li>
                    <li>Cumprimento destes termos</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Seção 5: Cancelamento */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cancelamento e Reembolso</h2>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-3">🇨🇭 Direitos do Consumidor Suíço</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>14 dias de arrependimento:</strong> Direito de cancelar sem justificativa</li>
                  <li><strong>Cancelamento fácil:</strong> Um clique no dashboard ou email para suporte</li>
                  <li><strong>Reembolso proporcional:</strong> Valor não utilizado será reembolsado</li>
                  <li><strong>Processamento:</strong> Reembolsos processados em até 14 dias úteis</li>
                </ul>
              </div>
            </section>

            {/* Seção 6: Legislação */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Legislação Aplicável</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Estes termos são regidos pela legislação suíça, especificamente:
                </p>
                <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                  <li>Código das Obrigações Suíço (CO)</li>
                  <li>Lei Federal de Proteção de Dados (FADP)</li>
                  <li>Regulamento Geral de Proteção de Dados (GDPR)</li>
                  <li>Diretiva EU 2011/83 sobre direitos do consumidor</li>
                </ul>
              </div>
            </section>

            {/* Contato */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Contato</h2>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>DUO PASS Club</strong><br />
                  Email: legal@duopassclub.ch<br />
                  Suporte: suporte@duopassclub.ch<br />
                  Website: duopassclub.ch
                </p>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}