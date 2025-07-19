/**
 * Hook useRecommendationAgent
 * Gerencia estado e lógica para gerar recomendações personalizadas de IA
 */

import { useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  openaiProxy,
  generateRecommendationPrompt,
  parseRecommendationResponse,
  getFallbackRecommendations,
  RecommendationContext,
  UserData,
  VoucherHistory,
  AvailableOffer
} from '../services/openai-proxy';

export interface Recommendation {
  offer_id: string;
  title: string;
  reason: string;
  perfect_timing: string;
  special_tip: string;
  confidence: number;
  offer?: AvailableOffer; // Dados completos da oferta
}

export interface UseRecommendationAgentReturn {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  generateRecommendations: (context: RecommendationContext) => Promise<void>;
  clearError: () => void;
  lastContext: RecommendationContext | null;
}

export const useRecommendationAgent = (): UseRecommendationAgentReturn => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastContext, setLastContext] = useState<RecommendationContext | null>(null);

  // UUIDs fixos para usuários demo/admin
  const DEMO_USER_UUID = '550e8400-e29b-41d4-a716-446655440000';
  const ADMIN_USER_UUID = '550e8400-e29b-41d4-a716-446655440001';

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUserData = async (): Promise<UserData> => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    // Retornar dados mock para usuários demo/admin
    if (user.id === 'demo-user-id' || user.id === 'admin-user-id') {
      return {
        id: user.id === 'admin-user-id' ? ADMIN_USER_UUID : DEMO_USER_UUID,
        full_name: user.id === 'admin-user-id' ? 'Administrador DuoPass' : 'Usuário Demo',
        preferences: {}
      };
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar dados do usuário: ${error.message}`);
    }

    return userData;
  };

  const fetchVoucherHistory = async (): Promise<VoucherHistory[]> => {
    if (!user?.id) {
      return [];
    }

    // Retornar histórico vazio para usuários demo/admin
    if (user.id === 'demo-user-id' || user.id === 'admin-user-id') {
      return [];
    }

    const { data: history, error } = await supabase
      .from('vouchers')
      .select(`
        id,
        offers (
          title,
          category,
          merchant_name
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'used')
      .order('updated_at', { ascending: false })
      .limit(8);

    if (error) {
      console.warn('Erro ao buscar histórico de vouchers:', error.message);
      return [];
    }

    return history || [];
  };

  const fetchAvailableOffers = async (): Promise<AvailableOffer[]> => {
    const { data: offers, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .limit(15);

    if (error) {
      throw new Error(`Erro ao buscar ofertas disponíveis: ${error.message}`);
    }

    return offers || [];
  };

  const saveRecommendations = async (
    context: RecommendationContext,
    recommendations: Recommendation[]
  ) => {
    if (!user?.id) return;

    // Não salvar recomendações de usuários demo/admin no banco
    if (user.id === 'demo-user-id' || user.id === 'admin-user-id') {
      console.log('Recomendações demo não salvas no banco:', { context, recommendations });
      return;
    }

    try {
      // Usar UUID válido para usuários reais
      const userIdToSave = user.id === 'demo-user-id' ? DEMO_USER_UUID : 
                          user.id === 'admin-user-id' ? ADMIN_USER_UUID : 
                          user.id;

      const { error } = await supabase
        .from('ai_recommendations')
        .insert({
          user_id: userIdToSave,
          context,
          recommendations
        });

      if (error) {
        console.warn('Erro ao salvar recomendações:', error.message);
      }
    } catch (error) {
      console.warn('Erro ao salvar recomendações:', error);
    }
  };

  const enrichRecommendationsWithOffers = async (
    recommendations: Recommendation[],
    availableOffers: AvailableOffer[]
  ): Promise<Recommendation[]> => {
    return recommendations.map(rec => {
      const offer = availableOffers.find(o => o.id === rec.offer_id);
      return {
        ...rec,
        offer
      };
    });
  };

  const generateRecommendationsInternal = useCallback(async (context: RecommendationContext) => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }

    // Previne cliques múltiplos
    if (loading) {
      console.log('Geração já em andamento, ignorando nova solicitação');
      return;
    }

    setLoading(true);
    setError(null);
    setLastContext(context);

    try {
      // 1. Buscar dados do usuário
      const userData = await fetchUserData();

      // 2. Buscar histórico de vouchers
      const voucherHistory = await fetchVoucherHistory();

      // 3. Buscar ofertas disponíveis
      const availableOffers = await fetchAvailableOffers();

      if (availableOffers.length === 0) {
        console.warn('Nenhuma oferta disponível, usando fallback');
        const fallbackRecommendations = getFallbackRecommendations(context);
        setRecommendations(fallbackRecommendations);
        return;
      }

      // 4. Gerar prompt para OpenAI
      const prompt = generateRecommendationPrompt(
        userData,
        voucherHistory,
        availableOffers,
        context
      );

      // 5. Chamar Gemini com timeout
      const response = await openaiProxy(prompt);
      
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('Resposta inválida da IA');
      }

      // 6. Parsear resposta
      const aiRecommendations = parseRecommendationResponse(
        response.candidates[0].content.parts[0].text
      );

      if (!Array.isArray(aiRecommendations) || aiRecommendations.length === 0) {
        throw new Error('Nenhuma recomendação gerada');
      }

      // 7. Enriquecer com dados das ofertas
      const enrichedRecommendations = await enrichRecommendationsWithOffers(
        aiRecommendations,
        availableOffers
      );

      // 8. Filtrar apenas recomendações com ofertas válidas
      const validRecommendations = enrichedRecommendations.filter(rec => rec.offer);

      if (validRecommendations.length === 0) {
        console.warn('Nenhuma recomendação válida, usando fallback');
        const fallbackRecommendations = getFallbackRecommendations(context);
        setRecommendations(fallbackRecommendations);
        return;
      }

      // 9. Salvar no banco
      await saveRecommendations(context, validRecommendations);

      // 10. Atualizar estado
      setRecommendations(validRecommendations);

    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      
      // Fallback para demo em caso de erro
      const fallbackRecommendations = getFallbackRecommendations(context);
      setRecommendations(fallbackRecommendations);
      
      // Mostrar erro mas não bloquear a demo
      const errorMessage = error instanceof Error ? error.message : 'Erro inesperado';
      if (errorMessage.includes('Timeout') || errorMessage.includes('Gemini')) {
        setError('Usando recomendações de demonstração (API temporariamente indisponível)');
      } else {
        setError(`${errorMessage} - Exibindo recomendações de demonstração`);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, setLoading, setError, setLastContext, setRecommendations, loading]);

  // Debounce para evitar múltiplas chamadas
  const debouncedGenerateRecommendations = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (context: RecommendationContext) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        generateRecommendationsInternal(context);
      }, 300);
    };
  }, [generateRecommendationsInternal]);

  const generateRecommendations = useCallback((context: RecommendationContext) => {
    debouncedGenerateRecommendations(context);
  }, [debouncedGenerateRecommendations]);

  return {
    recommendations,
    loading,
    error,
    generateRecommendations,
    clearError,
    lastContext
  };
};