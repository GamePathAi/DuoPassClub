import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Calendar, AlertCircle, CheckCircle, Clock, Euro } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cancelamento() {
  const navigate = useNavigate();
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Cancelamento e Reembolso</h1>
            <p className="text-lg text-gray-600">Direitos do Consumidor Suíço - Processo Transparente</p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          
          {/* Direitos do Consumidor */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">🇨🇭 Seus Direitos como Consumidor Suíço</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-green-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  14 Dias de Arrependimento
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Cancele sem justificativa em até 14 dias</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Reembolso integral garantido</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Baseado na legislação suíça (CO Art. 40a)</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Reembolso Proporcional
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Valor não utilizado será devolvido</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Cálculo transparente por dia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Processamento em até 14 dias úteis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Como Cancelar */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Como Cancelar Sua Assinatura</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Dashboard</h3>
                <p className="text-sm text-gray-600">
                  Acesse Configurações → Assinatura → Cancelar
                </p>
                <button className="mt-3 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm hover:bg-purple-200 transition-colors">
                  Ir para Dashboard
                </button>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                <p className="text-sm text-gray-600">
                  Envie um email para cancelamento@duopassclub.ch
                </p>
                <button className="mt-3 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg text-sm hover:bg-orange-200 transition-colors">
                  Enviar Email
                </button>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Formulário</h3>
                <p className="text-sm text-gray-600">
                  Preencha o formulário de cancelamento abaixo
                </p>
                <button 
                  onClick={() => setShowCancelForm(true)}
                  className="mt-3 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-200 transition-colors"
                >
                  Abrir Formulário
                </button>
              </div>
            </div>
          </div>

          {/* Calculadora de Reembolso */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Euro className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-800">Calculadora de Reembolso</h2>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-4">Exemplo de Cálculo</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Plano:</span>
                    <span className="font-medium">Cultural Explorer (CHF 39/mês)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Data de cobrança:</span>
                    <span className="font-medium">1º de Janeiro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Data de cancelamento:</span>
                    <span className="font-medium">15 de Janeiro</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Dias utilizados:</span>
                    <span className="font-medium">14 dias</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Valor pago:</span>
                    <span className="font-medium">CHF 39.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Valor por dia:</span>
                    <span className="font-medium">CHF 1.26</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Valor utilizado:</span>
                    <span className="font-medium">CHF 17.64</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-green-700 font-bold">Reembolso:</span>
                    <span className="font-bold text-green-700">CHF 21.36</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline do Processo */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Timeline do Cancelamento</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500 w-4 h-4 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Solicitação Recebida</h3>
                  <p className="text-sm text-gray-600">Confirmação imediata por email</p>
                </div>
                <span className="text-sm text-gray-500">Imediato</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 w-4 h-4 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Processamento</h3>
                  <p className="text-sm text-gray-600">Cálculo do reembolso e cancelamento da renovação</p>
                </div>
                <span className="text-sm text-gray-500">1-2 dias úteis</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-purple-500 w-4 h-4 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Reembolso Iniciado</h3>
                  <p className="text-sm text-gray-600">Valor devolvido para o cartão original</p>
                </div>
                <span className="text-sm text-gray-500">3-5 dias úteis</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-amber-500 w-4 h-4 rounded-full"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">Reembolso Concluído</h3>
                  <p className="text-sm text-gray-600">Valor aparece na sua fatura do cartão</p>
                </div>
                <span className="text-sm text-gray-500">5-14 dias úteis</span>
              </div>
            </div>
          </div>

          {/* Perguntas Frequentes */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Perguntas Frequentes</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">❓ Posso cancelar durante o teste grátis?</h3>
                <p className="text-gray-600 text-sm">
                  Sim! Durante os 7 dias de teste grátis, você pode cancelar sem nenhuma cobrança. 
                  Basta acessar seu dashboard ou enviar um email.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">❓ E se eu já usei algumas experiências?</h3>
                <p className="text-gray-600 text-sm">
                  Você ainda tem direito ao reembolso proporcional. Calculamos o valor baseado nos dias 
                  não utilizados do seu período de assinatura.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">❓ Posso reativar minha conta depois?</h3>
                <p className="text-gray-600 text-sm">
                  Claro! Você pode reativar sua conta a qualquer momento. Seus dados e preferências 
                  ficam salvos por 30 dias após o cancelamento.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">❓ O reembolso demora quanto tempo?</h3>
                <p className="text-gray-600 text-sm">
                  O processamento leva de 5 a 14 dias úteis. O prazo pode variar dependendo do seu banco. 
                  Você receberá atualizações por email sobre o status.
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de Cancelamento */}
          {showCancelForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Formulário de Cancelamento</h2>
                <button
                  onClick={() => setShowCancelForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email da conta
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo do cancelamento (opcional)
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Selecione um motivo</option>
                    <option value="preco">Preço muito alto</option>
                    <option value="uso">Não uso o suficiente</option>
                    <option value="experiencias">Poucas experiências na minha região</option>
                    <option value="qualidade">Qualidade das experiências</option>
                    <option value="tecnico">Problemas técnicos</option>
                    <option value="temporario">Pausa temporária</option>
                    <option value="outro">Outro motivo</option>
                  </select>
                </div>
                
                {cancelReason === 'outro' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descreva o motivo
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                      placeholder="Conte-nos o que podemos melhorar..."
                    ></textarea>
                  </div>
                )}
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-1">Confirmação de Cancelamento</h3>
                      <p className="text-sm text-red-700">
                        Ao confirmar, sua assinatura será cancelada e você receberá um reembolso 
                        proporcional conforme nossa política. Esta ação não pode ser desfeita.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCancelForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Confirmar Cancelamento
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Contato */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Precisa de Ajuda?</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600">📧</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                <p className="text-sm text-gray-600">cancelamento@duopassclub.ch</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600">💬</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Chat</h3>
                <p className="text-sm text-gray-600">Suporte online 9h-18h</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600">📞</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Telefone</h3>
                <p className="text-sm text-gray-600">+41 XX XXX XX XX</p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}