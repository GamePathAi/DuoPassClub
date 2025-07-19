import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Database, Lock, Download, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PoliticaPrivacidade() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Política de Privacidade</h1>
            <p className="text-lg text-gray-600">Proteção de Dados - GDPR Compliance</p>
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
            
            {/* GDPR Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-800 m-0">🇪🇺 Compliance GDPR</h2>
              </div>
              <p className="text-blue-700 mb-3">
                Esta política está em total conformidade com o Regulamento Geral de Proteção de Dados (GDPR) 
                e a Lei Federal Suíça de Proteção de Dados (FADP).
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded">
                  <strong className="text-blue-800">Seus Direitos:</strong>
                  <ul className="mt-1 space-y-1 text-blue-700">
                    <li>• Acesso aos dados</li>
                    <li>• Correção</li>
                    <li>• Exclusão</li>
                    <li>• Portabilidade</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong className="text-blue-800">Base Legal:</strong>
                  <ul className="mt-1 space-y-1 text-blue-700">
                    <li>• Consentimento</li>
                    <li>• Execução contratual</li>
                    <li>• Interesse legítimo</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded">
                  <strong className="text-blue-800">Proteção:</strong>
                  <ul className="mt-1 space-y-1 text-blue-700">
                    <li>• Criptografia SSL</li>
                    <li>• Servidores seguros</li>
                    <li>• Acesso restrito</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Seção 1: Dados Coletados */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-800 m-0">1. Dados Que Coletamos</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">📝 Dados Fornecidos por Você</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Cadastro:</strong> Nome, email, telefone</li>
                    <li><strong>Perfil:</strong> Preferências culturais, foto</li>
                    <li><strong>Pagamento:</strong> Dados do cartão (criptografados)</li>
                    <li><strong>Comunicação:</strong> Mensagens de suporte</li>
                    <li><strong>Reservas:</strong> Histórico de experiências</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">🔍 Dados Coletados Automaticamente</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Navegação:</strong> Páginas visitadas, tempo</li>
                    <li><strong>Dispositivo:</strong> IP, navegador, OS</li>
                    <li><strong>Localização:</strong> Cidade (com consentimento)</li>
                    <li><strong>Cookies:</strong> Preferências, sessão</li>
                    <li><strong>Analytics:</strong> Uso da plataforma</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Seção 2: Como Usamos */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800 m-0">2. Como Usamos Seus Dados</h2>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-800">🎯 Finalidades Principais</h3>
                  <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <h4 className="font-medium text-purple-700">Serviços Essenciais:</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Processar membership e pagamentos</li>
                        <li>Gerenciar reservas de experiências</li>
                        <li>Comunicação sobre sua conta</li>
                        <li>Suporte técnico e atendimento</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-700">Melhorias:</h4>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Personalizar recomendações</li>
                        <li>Melhorar a plataforma</li>
                        <li>Curadoria de novos parceiros</li>
                        <li>Analytics de uso (anonimizados)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">📧 Marketing (Apenas com Consentimento)</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Newsletter com novas experiências culturais</li>
                    <li>Ofertas especiais personalizadas</li>
                    <li>Convites para eventos exclusivos</li>
                    <li>Pesquisas de satisfação</li>
                  </ul>
                  <p className="text-xs text-yellow-700 mt-2">
                    ✅ Você pode cancelar a qualquer momento clicando em "descadastrar" nos emails.
                  </p>
                </div>
              </div>
            </section>

            {/* Seção 3: Base Legal GDPR */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Base Legal para Processamento (GDPR Art. 6)</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Consentimento</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Marketing por email</li>
                    <li>• Cookies não essenciais</li>
                    <li>• Localização precisa</li>
                    <li>• Compartilhamento com parceiros</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">📋 Execução Contratual</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Processamento de pagamentos</li>
                    <li>• Gestão de membership</li>
                    <li>• Reservas de experiências</li>
                    <li>• Suporte ao cliente</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">⚖️ Interesse Legítimo</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Segurança da plataforma</li>
                    <li>• Prevenção de fraudes</li>
                    <li>• Analytics anonimizados</li>
                    <li>• Melhorias do serviço</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Seção 4: Compartilhamento */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Compartilhamento de Dados</h2>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">🚫 Nunca Vendemos Seus Dados</h3>
                  <p className="text-red-700 text-sm">
                    Seus dados pessoais nunca são vendidos para terceiros. Compartilhamos apenas quando necessário 
                    para fornecer nossos serviços ou quando exigido por lei.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">🤝 Parceiros Necessários</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>Stripe:</strong> Processamento de pagamentos</li>
                      <li>• <strong>Supabase:</strong> Hospedagem de dados</li>
                      <li>• <strong>EmailJS:</strong> Envio de emails</li>
                      <li>• <strong>Parceiros Culturais:</strong> Dados de reserva</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">⚖️ Obrigações Legais</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Autoridades fiscais suíças</li>
                      <li>• Órgãos de proteção de dados</li>
                      <li>• Tribunais (quando ordenado)</li>
                      <li>• Prevenção de crimes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Seção 5: Seus Direitos GDPR */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-800 m-0">5. Seus Direitos (GDPR)</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-indigo-800">Direito de Acesso</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      Solicite uma cópia de todos os dados que temos sobre você.
                    </p>
                    <button className="mt-2 text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded">
                      Solicitar Dados
                    </button>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Download className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Portabilidade</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      Exporte seus dados em formato legível por máquina.
                    </p>
                    <button className="mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded">
                      Exportar Dados
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold text-yellow-800">Correção</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      Corrija dados incorretos ou desatualizados.
                    </p>
                    <button className="mt-2 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
                      Corrigir Dados
                    </button>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-red-800">Exclusão</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      Solicite a exclusão completa de seus dados.
                    </p>
                    <button className="mt-2 text-xs bg-red-100 text-red-700 px-3 py-1 rounded">
                      Excluir Conta
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">📧 Como Exercer Seus Direitos</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Para exercer qualquer destes direitos, entre em contato conosco:
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Email:</strong> privacidade@duopassclub.ch</li>
                  <li>• <strong>Formulário:</strong> Configurações → Privacidade → Gerenciar Dados</li>
                  <li>• <strong>Prazo:</strong> Responderemos em até 30 dias</li>
                </ul>
              </div>
            </section>

            {/* Seção 6: Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies e Tecnologias Similares</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Essenciais</h3>
                  <p className="text-xs text-gray-700 mb-2">Necessários para funcionamento</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Sessão de login</li>
                    <li>• Carrinho de compras</li>
                    <li>• Preferências de idioma</li>
                    <li>• Segurança</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">📊 Analytics</h3>
                  <p className="text-xs text-gray-700 mb-2">Com seu consentimento</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Google Analytics</li>
                    <li>• Métricas de uso</li>
                    <li>• Performance</li>
                    <li>• Anonimizados</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">🎯 Marketing</h3>
                  <p className="text-xs text-gray-700 mb-2">Opcional</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Personalização</li>
                    <li>• Remarketing</li>
                    <li>• Redes sociais</li>
                    <li>• Pode desativar</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Seção 7: Segurança */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Segurança dos Dados</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">🔒 Medidas Técnicas</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Criptografia SSL/TLS</li>
                      <li>• Servidores seguros na Europa</li>
                      <li>• Backup automático</li>
                      <li>• Monitoramento 24/7</li>
                      <li>• Firewall avançado</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">👥 Medidas Organizacionais</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Acesso restrito por função</li>
                      <li>• Treinamento da equipe</li>
                      <li>• Auditoria regular</li>
                      <li>• Políticas internas</li>
                      <li>• Contratos com fornecedores</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Seção 8: Retenção */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Retenção de Dados</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-800">Dados de conta ativa</span>
                  <span className="text-sm text-gray-600">Enquanto membership ativo</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-800">Dados após cancelamento</span>
                  <span className="text-sm text-gray-600">30 dias (backup/suporte)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-800">Dados financeiros</span>
                  <span className="text-sm text-gray-600">7 anos (obrigação legal)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-800">Analytics anonimizados</span>
                  <span className="text-sm text-gray-600">Indefinidamente</span>
                </div>
              </div>
            </section>

            {/* Contato DPO */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Contato - Encarregado de Proteção de Dados</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">📧 Contato Direto</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li><strong>Email:</strong> dpo@duopassclub.ch</li>
                      <li><strong>Privacidade:</strong> privacidade@duopassclub.ch</li>
                      <li><strong>Suporte:</strong> suporte@duopassclub.ch</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">🏛️ Autoridade Supervisora</h3>
                    <p className="text-sm text-gray-700">
                      Se não estivermos resolvendo sua questão adequadamente, 
                      você pode contatar o Comissário Federal Suíço de Proteção de Dados (FDPIC).
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}