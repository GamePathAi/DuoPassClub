import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { openaiProxy } from '../services/openai-proxy';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: string;
}

export interface UserContext {
  userData: {
    id: string;
    full_name: string;
    email: string;
    subscription_status: string;
    user_type: string;
  };
  activeVouchers: Array<{
    id: string;
    code: string;
    status: string;
    qr_code_data?: string;
    offers: {
      title: string;
      merchant_name: string;
      valid_until: string;
    };
  }>;
}

export function useCustomerServiceAgent() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UUIDs fixos para usuários demo/admin
  const DEMO_USER_UUID = '550e8400-e29b-41d4-a716-446655440000';
  const ADMIN_USER_UUID = '550e8400-e29b-41d4-a716-446655440001';

  // Buscar contexto do usuário
  const getUserContext = useCallback(async (): Promise<UserContext | null> => {
    if (!user) return null;

    try {
      // Tratar usuários demo/admin que não existem no banco
      if (user.id === 'demo-user-id' || user.id === 'admin-user-id') {
        const mockUserData = {
          id: user.id === 'admin-user-id' ? ADMIN_USER_UUID : DEMO_USER_UUID,
          full_name: user.id === 'admin-user-id' ? 'Administrador DuoPass' : 'Usuário Demo',
          email: user.email || (user.id === 'admin-user-id' ? 'admin@duopass.com' : 'demo@duopass.com'),
          subscription_status: 'active',
          user_type: user.id === 'admin-user-id' ? 'admin' : 'customer'
        };

        return {
          userData: mockUserData,
          activeVouchers: [] // Usuários demo não têm vouchers reais
        };
      }

      // Buscar dados do usuário real no banco
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, full_name, email, subscription_status, user_type')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Buscar vouchers ativos
      const { data: activeVouchers, error: vouchersError } = await supabase
        .from('vouchers')
        .select(`
          id,
          code,
          status,
          qr_code_data,
          offers (
            title,
            merchant_name,
            valid_until
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (vouchersError) throw vouchersError;

      return {
        userData,
        activeVouchers: activeVouchers || []
      };
    } catch (err) {
      console.error('Erro ao buscar contexto do usuário:', err);
      return null;
    }
  }, [user]);

  // Classificar tipo de mensagem
  const classifyMessage = async (message: string): Promise<string> => {
    try {
      const classifyPrompt = `
Classifique esta mensagem de atendimento ao cliente em uma das categorias:
- question: pergunta geral
- complaint: reclamação ou problema
- booking: reserva ou agendamento
- cancellation: cancelamento
- technical: problema técnico

Mensagem: "${message}"

Responda apenas com o tipo (question, complaint, booking, cancellation ou technical):
`;

      const response = await openaiProxy(classifyPrompt);
      
      if (!response.candidates || response.candidates.length === 0) {
        return 'question';
      }

      const type = response.candidates[0].content.parts[0].text.trim().toLowerCase();
      const validTypes = ['question', 'complaint', 'booking', 'cancellation', 'technical'];
      
      return validTypes.includes(type) ? type : 'question';
    } catch (err) {
      console.error('Erro na classificação:', err);
      return 'question';
    }
  };

  // Gerar resposta contextualizada
  const generateResponse = async (
    userMessage: string,
    messageType: string,
    userContext: UserContext
  ): Promise<string> => {
    try {
      const responsePrompt = `
Você é Sofia, assistente virtual do DUO PASS Club. Seja prestativa, empática e profissional.

INFORMAÇÕES DO USUÁRIO:
- Nome: ${userContext.userData.full_name}
- Email: ${userContext.userData.email}
- Status: ${userContext.userData.subscription_status}
- Tipo: ${userContext.userData.user_type}

VOUCHERS ATIVOS:
${userContext.activeVouchers.length > 0 
  ? userContext.activeVouchers.map(v => `- ${v.offers.title} (Código: ${v.code}) - Válido até: ${v.offers.valid_until}`).join('\n')
  : '- Nenhum voucher ativo no momento'
}

TIPO DA SOLICITAÇÃO: ${messageType}
MENSAGEM DO USUÁRIO: "${userMessage}"

INSTRUÇÕES:
1. Use o nome do usuário na resposta
2. Seja específica baseada nos vouchers dele
3. Ofereça soluções práticas
4. Se for cancelamento e houver voucher para hoje, mencione que pode cancelar automaticamente
5. Se for problema técnico com QR code, mencione que pode regenerar
6. Mantenha tom amigável e profissional
7. Responda em português
8. Seja concisa mas completa

Resposta:
`;

      const response = await openaiProxy(responsePrompt);
      
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('Resposta inválida da IA');
      }

      return response.candidates[0].content.parts[0].text;
    } catch (err) {
      console.error('Erro na geração de resposta:', err);
      return `Olá ${userContext.userData.full_name}! Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em alguns instantes ou entre em contato conosco pelo email contact@dupassclub.ch`;
    }
  };

  // Executar ações automáticas
  const executeAutomaticActions = async (
    message: string,
    messageType: string,
    userContext: UserContext
  ): Promise<string | null> => {
    try {
      // Não executar ações automáticas para usuários demo/admin
      if (userContext.userData.id === DEMO_USER_UUID || userContext.userData.id === ADMIN_USER_UUID) {
        // Simular resposta para demonstração
        if (messageType === 'cancellation' && message.toLowerCase().includes('cancelar')) {
          return `✅ [DEMO] Cancelamento simulado! Esta é uma demonstração do sistema.`;
        }
        if (messageType === 'technical' && 
            (message.toLowerCase().includes('qr') || message.toLowerCase().includes('código'))) {
          return `✅ [DEMO] QR Code regenerado! Esta é uma demonstração do sistema.`;
        }
        return null;
      }

      // Cancelamento automático para usuários reais
      if (messageType === 'cancellation' && message.toLowerCase().includes('cancelar')) {
        const today = new Date().toISOString().split('T')[0];
        const todayVouchers = userContext.activeVouchers.filter(v => 
          v.offers.valid_until.startsWith(today)
        );

        if (todayVouchers.length === 1) {
          const { error } = await supabase
            .from('vouchers')
            .update({ 
              status: 'cancelled', 
              cancelled_at: new Date().toISOString() 
            })
            .eq('id', todayVouchers[0].id);

          if (!error) {
            return `✅ Cancelamento realizado! Seu voucher "${todayVouchers[0].offers.title}" foi cancelado automaticamente.`;
          }
        }
      }

      // Regenerar QR Code para usuários reais
      if (messageType === 'technical' && 
          (message.toLowerCase().includes('qr') || message.toLowerCase().includes('código'))) {
        const vouchersToFix = userContext.activeVouchers.filter(v => !v.qr_code_data);
        
        if (vouchersToFix.length > 0) {
          for (const voucher of vouchersToFix) {
            await supabase
              .from('vouchers')
              .update({ 
                qr_code_data: `DUO-${voucher.code}-${userContext.userData.id}` 
              })
              .eq('id', voucher.id);
          }
          
          return `✅ QR Codes regenerados! ${vouchersToFix.length} voucher(s) foram corrigidos.`;
        }
      }

      return null;
    } catch (err) {
      console.error('Erro nas ações automáticas:', err);
      return null;
    }
  };

  // Salvar interação no banco
  const saveInteraction = async (
    userMessage: string,
    aiResponse: string,
    interactionType: string
  ) => {
    if (!user) return;

    // Não salvar interações de usuários demo/admin no banco
    if (user.id === 'demo-user-id' || user.id === 'admin-user-id') {
      console.log('Interação demo não salva no banco:', { userMessage, aiResponse, interactionType });
      return;
    }

    try {
      // Usar UUID válido para usuários reais
      const userIdToSave = user.id === 'demo-user-id' ? DEMO_USER_UUID : 
                          user.id === 'admin-user-id' ? ADMIN_USER_UUID : 
                          user.id;
      
      await supabase
        .from('customer_interactions')
        .insert({
          user_id: userIdToSave,
          user_message: userMessage,
          ai_response: aiResponse,
          interaction_type: interactionType,
          channel: 'app'
        });
    } catch (err) {
      console.error('Erro ao salvar interação:', err);
    }
  };

  // Enviar mensagem
  const sendMessage = async (text: string) => {
    if (!text.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      // 1. Buscar contexto do usuário
      const userContext = await getUserContext();
      if (!userContext) {
        throw new Error('Não foi possível obter informações do usuário');
      }

      // 2. Classificar mensagem
      const messageType = await classifyMessage(text);

      // 3. Executar ações automáticas
      const automaticAction = await executeAutomaticActions(text, messageType, userContext);

      // 4. Gerar resposta
      let aiResponse = await generateResponse(text, messageType, userContext);
      
      // 5. Adicionar resultado da ação automática se houver
      if (automaticAction) {
        aiResponse = `${automaticAction}\n\n${aiResponse}`;
      }

      // 6. Salvar interação
      await saveInteraction(text, aiResponse, messageType);

      // 7. Adicionar resposta ao chat
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'agent',
        timestamp: new Date(),
        type: messageType
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (err) {
      console.error('Erro ao processar mensagem:', err);
      setError('Desculpe, ocorreu um erro. Tente novamente.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente ou entre em contato conosco pelo email contact@dupassclub.ch',
        sender: 'agent',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Limpar mensagens
  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    getUserContext
  };
}