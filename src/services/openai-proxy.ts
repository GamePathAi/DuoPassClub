/**
 * Gemini Proxy Service para DUO PASS Club
 * Integração com Gemini 2.0 Flash para gerar recomendações personalizadas
 */

export interface GeminiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface RecommendationContext {
  location?: string;
  weather?: string;
  occasion?: string;
  budget?: number;
  timeOfDay?: string;
  season?: string;
}

export interface UserData {
  id: string;
  full_name: string;
  preferences?: Record<string, unknown>;
}

export interface VoucherHistory {
  id: string;
  offers: {
    title: string;
    category: string;
    merchant_name: string;
  };
}

export interface AvailableOffer {
  id: string;
  title: string;
  category: string;
  price: number;
  merchant_name: string;
  location: string;
  description: string;
}

export const openaiProxy = async (prompt: string): Promise<GeminiResponse> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key não configurada. Adicione VITE_GEMINI_API_KEY no arquivo .env');
  }

  // Timeout para evitar travamento
  const timeoutPromise = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Timeout: Chamada Gemini demorou mais que 10 segundos')), 10000)
  );

  try {
    const fetchPromise = fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    // Race entre fetch e timeout
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na chamada Gemini:', error);
    throw error;
  }
};

export const generateRecommendationPrompt = (
  userData: UserData,
  voucherHistory: VoucherHistory[],
  availableOffers: AvailableOffer[],
  context: RecommendationContext
): string => {
  const historyText = voucherHistory.length > 0 
    ? voucherHistory.map(v => `${v.offers.title} (${v.offers.category})`).join(', ')
    : 'Nenhum histórico anterior';

  const offersText = availableOffers
    .map(o => `ID:${o.id} ${o.title} ${o.category} CHF${o.price} ${o.merchant_name} ${o.location}`)
    .join(' | ');

  return `
Você é Sofia, especialista em experiências para casais do DUO PASS Club na Suíça.

USUÁRIO: ${userData.full_name}
HISTÓRICO: ${historyText}
CONTEXTO: ${context.location || 'Suíça'}, ${context.weather || 'tempo agradável'}, ${context.occasion || 'momento especial'}, CHF ${context.budget || '100'}
OFERTAS DISPONÍVEIS: ${offersText}

Com base no histórico e contexto do usuário, recomende 3 experiências perfeitas para este casal.

Responda APENAS em formato JSON válido:
{
  "recommendations": [
    {
      "offer_id": "id_da_oferta",
      "title": "título_da_experiência",
      "reason": "por que é perfeita baseado no histórico e preferências",
      "perfect_timing": "melhor horário para aproveitar",
      "special_tip": "dica especial personalizada",
      "confidence": 85
    }
  ]
}

Critérios importantes:
- Baseie-se no histórico de experiências anteriores
- Considere o contexto atual (localização, clima, ocasião, orçamento)
- Confidence score de 1-100 baseado na relevância
- Dicas especiais que agreguem valor
- Timing otimizado para a experiência
`;
};

export const parseRecommendationResponse = (response: string) => {
  try {
    // Limpar markdown e caracteres extras da resposta
    let cleanResponse = response.trim();
    
    // Remover blocos de código markdown
    cleanResponse = cleanResponse.replace(/```json\s*/g, '');
    cleanResponse = cleanResponse.replace(/```\s*/g, '');
    
    // Remover quebras de linha extras e espaços
    cleanResponse = cleanResponse.trim();
    
    // Tentar encontrar o JSON válido na resposta
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanResponse);
    return parsed.recommendations || [];
  } catch (error) {
    console.error('Erro ao parsear resposta da Gemini:', error);
    console.error('Resposta original:', response);
    throw new Error('Resposta da IA inválida');
  }
};

// Fallback de recomendações para demo
export const getFallbackRecommendations = (context: RecommendationContext) => {
  return [
    {
      offer_id: "demo-1",
      title: "Experiência Romântica Demo",
      reason: `Perfeita para ${context.occasion || 'momento especial'} em ${context.location || 'Zurich'} com orçamento de CHF ${context.budget || '150'}`,
      perfect_timing: "Final da tarde",
      special_tip: "Reserve com antecedência para garantir a melhor mesa",
      confidence: 75
    },
    {
      offer_id: "demo-2",
      title: "Aventura Cultural Demo",
      reason: "Baseado no seu perfil, esta experiência combina cultura e diversão",
      perfect_timing: "Manhã ou início da tarde",
      special_tip: `Aproveite o clima ${context.weather || 'agradável'} para uma experiência única`,
      confidence: 80
    },
    {
      offer_id: "demo-3",
      title: "Relaxamento Premium Demo",
      reason: "Ideal para casais que buscam momentos de tranquilidade e conexão",
      perfect_timing: "Qualquer horário",
      special_tip: "Combine com um jantar especial para completar o dia",
      confidence: 70
    }
  ];
};