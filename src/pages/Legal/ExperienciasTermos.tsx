import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Store, Users, Shield, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExperienciasTermos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Termos de Experiências</h1>
            <p className="text-lg text-gray-600">Responsabilidades dos Estabelecimentos Parceiros</p>
            <p className="text-sm text-gray-500 mt-2">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          
          {/* Conceito DUO PASS */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Star className="w-8 h-8 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-800">🎭 Conceito DUO PASS Cultural</h2>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-amber-800 mb-3">Diferencial Cultural</h3>
              <p className="text-gray-700 mb-4">
                O DUO PASS não é um marketplace de cupons comum. Somos uma plataforma cultural que conecta 
                pessoas através de experiências autênticas, sempre em dupla (2 por 1).
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">✨ O que Valorizamos:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Histórias e propósito dos estabelecimentos</li>
                    <li>• Experiências que conectam pessoas</li>
                    <li>• Curadoria emocional vs algoritmos frios</li>
                    <li>• Cultura local e autenticidade</li>
                    <li>• Relacionamentos duradouros</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">🚫 Não Somos:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• App de cupons genéricos</li>
                    <li>• Plataforma de desconto massivo</li>
                    <li>• Marketplace transacional</li>
                    <li>• Sistema de ofertas temporárias</li>
                    <li>• Concorrência por menor preço</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Responsabilidades dos Parceiros */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Store className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Responsabilidades dos Parceiros Culturais</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="font-bold text-green-800 mb-3">🎯 Qualidade da Experiência</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Obrigatório:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>✓ Manter padrão de qualidade consistente</li>
                      <li>✓ Honrar todas as reservas confirmadas</li>
                      <li>✓ Tratar clientes DUO PASS como VIPs</li>
                      <li>✓ Explicar o conceito cultural aos funcionários</li>
                      <li>✓ Disponibilidade conforme acordado</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Recomendado:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Personalizar experiência para casais/duplas</li>
                      <li>• Compartilhar história do estabelecimento</li>
                      <li>• Criar momentos memoráveis</li>
                      <li>• Feedback ativo sobre a experiência</li>
                      <li>• Flexibilidade para necessidades especiais</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-bold text-blue-800 mb-3">📅 Gestão de Reservas</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">Confirmação:</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li>• Resposta em até 24h</li>
                        <li>• Confirmação via plataforma</li>
                        <li>• Detalhes claros da experiência</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">Cancelamento:</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li>• Aviso com 48h de antecedência</li>
                        <li>• Reagendamento quando possível</li>
                        <li>• Justificativa clara</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">No-show:</h4>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li>• Aguardar 15 minutos</li>
                        <li>• Reportar na plataforma</li>
                        <li>• Oferecer reagendamento</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Responsabilidades dos Usuários */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Responsabilidades dos Usuários</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-bold text-purple-800 mb-4">✅ Comportamento Esperado</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-sm">Comparecer no horário agendado</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-sm">Tratar funcionários com respeito</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-sm">Seguir regras do estabelecimento</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-sm">Cancelar com antecedência se necessário</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-sm">Deixar feedback construtivo</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-bold text-red-800 mb-4">❌ Comportamentos Inaceitáveis</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                    <span className="text-sm">No-show sem aviso prévio</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                    <span className="text-sm">Comportamento desrespeitoso</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                    <span className="text-sm">Tentar revender a experiência</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                    <span className="text-sm">Usar mais pessoas que o permitido</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                    <span className="text-sm">Feedback malicioso ou falso</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resolução de Conflitos */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">Resolução de Conflitos</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="font-bold text-indigo-800 mb-4">🤝 Processo de Mediação</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-indigo-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-indigo-800 mb-2">Comunicação Direta</h4>
                    <p className="text-sm text-gray-700">
                      Encorajamos parceiros e usuários a resolverem questões diretamente, 
                      com respeito e boa fé.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-indigo-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-indigo-800 mb-2">Mediação DUO PASS</h4>
                    <p className="text-sm text-gray-700">
                      Se necessário, nossa equipe atua como mediadora neutra 
                      para encontrar uma solução justa.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-indigo-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-indigo-800 mb-2">Decisão Final</h4>
                    <p className="text-sm text-gray-700">
                      Em casos extremos, o DUO PASS toma decisão final 
                      baseada em evidências e políticas.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">🏆 Soluções Positivas</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Reagendamento de experiências</li>
                    <li>• Compensação por inconvenientes</li>
                    <li>• Experiência adicional como cortesia</li>
                    <li>• Treinamento adicional da equipe</li>
                    <li>• Melhoria de processos</li>
                  </ul>
                </div>
                
                <div className="border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-3">⚠️ Medidas Disciplinares</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Advertência formal</li>
                    <li>• Suspensão temporária</li>
                    <li>• Revisão de parceria</li>
                    <li>• Cancelamento de conta (usuário)</li>
                    <li>• Encerramento de parceria</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Padrões de Qualidade */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Padrões de Qualidade DUO PASS</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-4">🌟 Critérios de Avaliação</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-800">Qualidade da experiência</span>
                    <span className="text-sm text-gray-600">Peso: 30%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-800">Atendimento ao cliente</span>
                    <span className="text-sm text-gray-600">Peso: 25%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-800">Pontualidade e confiabilidade</span>
                    <span className="text-sm text-gray-600">Peso: 20%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-800">Ambiente e atmosfera</span>
                    <span className="text-sm text-gray-600">Peso: 15%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium text-gray-800">Valor cultural agregado</span>
                    <span className="text-sm text-gray-600">Peso: 10%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-gray-800 mb-4">📊 Sistema de Avaliação</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">⭐ 4.5+ Estrelas</h4>
                    <p className="text-sm text-gray-700">Parceiro Exemplar - Destaque na plataforma</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">⭐ 4.0-4.4 Estrelas</h4>
                    <p className="text-sm text-gray-700">Parceiro Aprovado - Padrão esperado</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">⭐ 3.5-3.9 Estrelas</h4>
                    <p className="text-sm text-gray-700">Atenção - Plano de melhoria necessário</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">⭐ Abaixo de 3.5</h4>
                    <p className="text-sm text-gray-700">Revisão de parceria - Ação imediata</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legislação e Compliance */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Legislação e Compliance</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-4">🇨🇭 Legislação Suíça Aplicável</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Estabelecimentos:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Código das Obrigações (CO)</li>
                    <li>• Lei de Proteção ao Consumidor</li>
                    <li>• Regulamentações sanitárias</li>
                    <li>• Normas de segurança</li>
                    <li>• Licenças operacionais</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Plataforma:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• GDPR e FADP (proteção de dados)</li>
                    <li>• Lei de Comércio Eletrônico</li>
                    <li>• Regulamentações de pagamento</li>
                    <li>• Direitos do consumidor</li>
                    <li>• Responsabilidade civil</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Contato e Suporte */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contato e Suporte</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Parceiros</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Suporte dedicado para estabelecimentos
                </p>
                <p className="text-sm text-blue-600">parceiros@duopassclub.ch</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Usuários</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Atendimento para membros da comunidade
                </p>
                <p className="text-sm text-blue-600">suporte@duopassclub.ch</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Questões Legais</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Assuntos jurídicos e compliance
                </p>
                <p className="text-sm text-blue-600">legal@duopassclub.ch</p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}