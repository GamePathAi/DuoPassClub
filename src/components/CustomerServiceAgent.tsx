import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Loader2
} from 'lucide-react';
import { useCustomerServiceAgent } from '../hooks/useCustomerServiceAgent';
import { useAuth } from '../contexts/AuthContext';

export default function CustomerServiceAgent() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages
  } = useCustomerServiceAgent();

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focar input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Não renderizar se usuário não logado
  if (!user) return null;

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;
    
    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case 'complaint': return 'text-red-600';
      case 'cancellation': return 'text-orange-600';
      case 'technical': return 'text-blue-600';
      case 'booking': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Badge de notificação (opcional) */}
        {messages.length === 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="text-xs text-white font-bold">!</span>
          </motion.div>
        )}
      </motion.button>

      {/* Modal do Chat */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal */}
            <motion.div
              className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden"
              initial={{ scale: 0, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#F6C100] to-[#C91F1F] p-4 flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Sofia - Assistente DUO PASS</h3>
                    <p className="text-xs opacity-90">Online agora</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Área de Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {/* Mensagem de boas-vindas */}
                {messages.length === 0 && (
                  <motion.div
                    className="flex items-start space-x-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                      <p className="text-sm text-gray-800">
                        Olá! Sou a Sofia, sua assistente virtual do DUO PASS Club. 
                        Como posso ajudar você hoje? 😊
                      </p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {formatTime(new Date())}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Mensagens do chat */}
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-[#F6C100] to-[#C91F1F]'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 shadow-sm max-w-xs ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </span>
                        {message.type && message.sender === 'agent' && (
                          <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${
                            getMessageTypeColor(message.type)
                          }`}>
                            {message.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <motion.div
                    className="flex items-start space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-500">Sofia está digitando...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error message */}
                {error && (
                  <motion.div
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || loading}
                    className="p-2 bg-gradient-to-r from-[#F6C100] to-[#C91F1F] text-white rounded-lg hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Actions */}
                {messages.length > 0 && (
                  <div className="mt-2 flex justify-center">
                    <button
                      onClick={clearMessages}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Limpar conversa
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}