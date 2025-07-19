# 🤖 AGENTE DE RECOMENDAÇÃO IA - DUO PASS CLUB

## 📋 VISÃO GERAL

O Agente de Recomendação IA é um sistema inteligente que gera recomendações personalizadas de experiências para casais baseado no histórico do usuário, contexto atual e preferências.

## 🏗️ ARQUITETURA IMPLEMENTADA

### 1. BANCO DE DADOS

**Tabela: `ai_recommendations`**
```sql
CREATE TABLE ai_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  context jsonb,
  recommendations jsonb,
  created_at timestamp DEFAULT now()
);
```

**Políticas RLS:**
- Usuários só podem ver suas próprias recomendações
- Controle total de CRUD por usuário

### 2. SERVIÇOS

**OpenAI Proxy (`src/services/openai-proxy.ts`)**
- Integração com GPT-4o
- Geração de prompts contextuais
- Parsing de respostas JSON
- Tratamento de erros

### 3. HOOKS

**useRecommendationAgent (`src/hooks/useRecommendationAgent.ts`)**
- Busca dados do usuário
- Coleta histórico de vouchers
- Obtém ofertas disponíveis
- Gera recomendações via IA
- Salva no banco de dados
- Enriquece com dados das ofertas

### 4. COMPONENTES

**RecommendationAgent (`src/components/RecommendationAgent.tsx`)**
- Interface de controles de contexto
- Cards de recomendação animados
- Estados de loading e erro
- Navegação para ofertas

**Página Recommendations (`src/pages/Recommendations.tsx`)**
- Rota protegida `/recommendations`
- SEO otimizado
- Layout responsivo

## 🎯 FUNCIONALIDADES

### Controles de Contexto
- **Localização:** Zurich, Geneva, Basel, Bern, Lausanne
- **Clima:** Ensolarado, Nublado, Chuvoso, Nevando
- **Ocasião:** Aniversário, Date Night, Fim de Semana, Especial
- **Orçamento:** CHF 50-500+

### Cards de Recomendação
- Score de confiança
- Título e localização
- Razão personalizada
- Timing perfeito
- Dica especial
- Botão "Quero!" → navegação direta

### Animações
- Framer Motion
- Transições suaves
- Loading states
- Hover effects

## 🔧 CONFIGURAÇÃO

### Variáveis de Ambiente
```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Dependências
- OpenAI API
- Supabase (banco + auth)
- Framer Motion (animações)
- Lucide React (ícones)

## 🚀 COMO USAR

### 1. Configurar OpenAI
1. Obter chave API em https://platform.openai.com/api-keys
2. Adicionar `VITE_OPENAI_API_KEY` no `.env`

### 2. Executar Schema SQL
```bash
# Executar no Supabase SQL Editor
psql -f ai-recommendations-schema.sql
```

### 3. Acessar Interface
1. Login no app
2. Navegar para `/recommendations`
3. Ou usar menu: "Recomendações IA"

## 📊 FLUXO DE DADOS

```
Usuário → Contexto → Hook → [
  Buscar dados usuário
  Buscar histórico vouchers
  Buscar ofertas ativas
] → OpenAI → Parse → Salvar → Enriquecer → UI
```

## 🎨 DESIGN SYSTEM

### Cores
- Gradiente brand: `from-[#F6C100] to-[#C91F1F]`
- Ícone IA: `text-orange-500`
- Cards: `bg-white` com `shadow-lg`
- Dicas: `bg-yellow-50` com `border-yellow-200`

### Responsividade
- Mobile-first
- Grid adaptativo
- Controles empilhados

## 🧪 TESTES

### Critérios de Sucesso
- [x] Gera 3 recomendações < 5s
- [x] Interface responsiva
- [x] Navegação funcional
- [x] Dados salvos no banco
- [ ] Recomendações relevantes (requer dados reais)

### Métricas Esperadas
- Click-through rate > 15%
- Conversão voucher +25%
- Satisfação > 4.5/5

## 🔗 NAVEGAÇÃO

### Links Adicionados
- **Mobile Menu:** "Recomendações IA" com ícone Sparkles
- **User Dropdown:** "Recomendações IA" (apenas clientes)
- **Rota:** `/recommendations` (protegida)

## 📝 PROMPT TEMPLATE

```typescript
const prompt = `
Você é Sofia, especialista em experiências para casais do DUO PASS Club (Suíça).

USUÁRIO: ${userData.full_name}
HISTÓRICO: ${voucherHistory.map(v => `${v.offers.title} (${v.offers.category})`).join(', ')}
CONTEXTO: ${context.location}, ${context.weather}, ${context.occasion}, CHF ${context.budget}
OFERTAS: ${availableOffers.map(o => `ID:${o.id} ${o.title} ${o.category} CHF${o.price}`).join(' | ')}

Recomende 3 experiências. Responda JSON:
{
  "recommendations": [
    {
      "offer_id": "id",
      "title": "título",
      "reason": "por que é perfeita baseado no histórico",
      "perfect_timing": "melhor horário",
      "special_tip": "dica especial",
      "confidence": 85
    }
  ]
}
`;
```

## 🚨 LIMITAÇÕES ATUAIS

1. **Dados Mock:** Requer dados reais para testes completos
2. **Rate Limiting:** OpenAI API tem limites de uso
3. **Custo:** Cada recomendação consome tokens
4. **Idioma:** Prompts em português (pode ser multilíngue)

## 🔮 PRÓXIMOS PASSOS

1. **Testes com Dados Reais**
   - Criar usuários de teste
   - Adicionar ofertas reais
   - Testar histórico de vouchers

2. **Otimizações**
   - Cache de recomendações
   - Rate limiting local
   - Fallback para recomendações estáticas

3. **Analytics**
   - Tracking de cliques
   - Métricas de conversão
   - A/B testing de prompts

4. **Melhorias UX**
   - Feedback de qualidade
   - Favoritar recomendações
   - Histórico de recomendações

---

✅ **STATUS:** Implementação completa e funcional
🎯 **FOCO:** Desenvolvimento local primeiro, deploy futuro
🚀 **PRONTO PARA:** Testes com dados reais e refinamentos