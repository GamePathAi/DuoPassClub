# 🔧 CORREÇÃO: INCONSISTÊNCIAS ENTRE DESENVOLVIMENTO E PRODUÇÃO

## 🚨 PROBLEMA IDENTIFICADO

### **Situação Atual:**
- **Produção (duopassclub.ch):** Mostra dados reais do Supabase
- **Desenvolvimento (localhost):** Mostra dados mock/demo quando há erro de conexão
- **Resultado:** Experiências diferentes entre ambientes

### **Causa Raiz:**
O componente `Offers.tsx` tem um sistema de fallback que carrega dados mock quando:
1. Há erro na conexão com Supabase
2. Não há dados retornados do Supabase
3. Timeout na query (10 segundos)

## 📍 ARQUIVOS AFETADOS

### **1. `/src/pages/Offers.tsx` (Linhas 50-260)**
```typescript
// PROBLEMA: Fallback automático para dados demo
if (error || !data || data.length === 0) {
  const demoOffers: Offer[] = [
    // ... dados mock hardcoded
  ];
  setOffers(demoOffers);
}
```

### **2. `/src/components/CulturalExperiences.tsx`**
- Usa `useExperiences` hook que busca dados reais do Supabase
- Não tem fallback para dados mock
- Funciona corretamente em ambos ambientes

### **3. `/src/hooks/useExperiences.ts`**
- Hook limpo que só busca dados do Supabase
- Não tem dados mock de fallback

## 🎯 SOLUÇÕES PROPOSTAS

### **SOLUÇÃO 1: REMOVER DADOS MOCK (RECOMENDADA)**
```typescript
// EM: /src/pages/Offers.tsx
// REMOVER: Todo o bloco de demoOffers e mockOffers
// MANTER: Apenas dados do Supabase com tratamento de erro adequado

if (error) {
  console.error('❌ Erro ao carregar ofertas:', error);
  setError(error);
  setOffers([]); // Array vazio em vez de dados mock
}
```

### **SOLUÇÃO 2: UNIFICAR COMPONENTES**
- Usar apenas `CulturalExperiences` em toda aplicação
- Remover ou refatorar `Offers.tsx` para não ter dados mock
- Garantir consistência entre ambientes

### **SOLUÇÃO 3: CONFIGURAÇÃO POR AMBIENTE**
```typescript
// Só usar dados mock em desenvolvimento E quando explicitamente configurado
const USE_MOCK_DATA = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === 'true';

if (error && USE_MOCK_DATA) {
  // Carregar dados mock apenas se configurado
}
```

## 🔧 IMPLEMENTAÇÃO IMEDIATA

### **Passo 1: Verificar Conexão Supabase**
```bash
# Verificar se as credenciais estão corretas
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

### **Passo 2: Remover Dados Mock**
- Editar `/src/pages/Offers.tsx`
- Remover arrays `demoOffers` e `mockOffers`
- Implementar tratamento de erro sem fallback

### **Passo 3: Testar Ambos Ambientes**
- Desenvolvimento: `npm run dev`
- Produção: Verificar `duopassclub.ch`
- Garantir comportamento idêntico

## 🚨 PROBLEMAS ADICIONAIS IDENTIFICADOS

### **1. Duplicação de Componentes**
- `CulturalExperiences.tsx` ✅ (Correto)
- `Offers.tsx` ❌ (Com dados mock)
- `OfferCard.tsx` (Usado em múltiplos lugares)

### **2. Inconsistência de Rotas**
- `/ofertas` → Usa `OfertasPage.tsx`
- `/experiencias` → Usa `ExperienciasPage.tsx`
- Landing page → Usa `CulturalExperiences.tsx`

### **3. Configuração de Ambiente**
- Arquivo `.env` local pode ter configurações diferentes
- Produção pode ter variáveis de ambiente diferentes

## ✅ CHECKLIST DE CORREÇÃO

- [ ] Remover dados mock de `Offers.tsx`
- [ ] Verificar conexão Supabase em desenvolvimento
- [ ] Unificar componentes de exibição de ofertas
- [ ] Testar comportamento em ambos ambientes
- [ ] Documentar configurações de ambiente
- [ ] Implementar logs de debug para identificar problemas

## 🎯 RESULTADO ESPERADO

**Após correção:**
- Desenvolvimento e produção mostram os mesmos dados
- Não há mais fallback para dados mock
- Experiência consistente entre ambientes
- Fácil identificação de problemas de conexão

---

**Status:** 🔴 Problema identificado - Aguardando implementação
**Prioridade:** 🔥 Alta - Afeta experiência do usuário
**Tempo estimado:** 2-3 horas para correção completa