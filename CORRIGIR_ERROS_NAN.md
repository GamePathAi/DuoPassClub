# 🔧 CORREÇÃO DOS ERROS "NaN" NO CONSOLE

## ❌ Problema Identificado
**Erros:** Múltiplos "The specified value 'NaN' cannot be parsed, or is out of range."

**Causa:** Campos numéricos (input type="number") recebendo valores NaN ou inválidos.

## 🎯 Localização dos Problemas

### 1. PartnerSignup.tsx - Campo Preço Normal
**Arquivo:** `src/pages/partners/PartnerSignup.tsx` (linhas 408-412)

**Problema:**
```typescript
const num = value ? parseFloat(value) : 0;
handleInputChange('proposedExperience.normalPrice', isNaN(num) ? 0 : num);
```

**Solução:** Melhorar validação e tratamento de valores numéricos.

### 2. Outros Campos Numéricos Potenciais
- PaymentMethodModal.tsx (campos de cartão)
- Checkout.tsx (valores monetários)
- BusinessPage.tsx (campo employees)

## ⚡ CORREÇÃO IMEDIATA

### Passo 1: Corrigir PartnerSignup.tsx
Substituir o tratamento do campo `normalPrice` por:

```typescript
// ANTES (problemático):
const num = value ? parseFloat(value) : 0;
handleInputChange('proposedExperience.normalPrice', isNaN(num) ? 0 : num);

// DEPOIS (corrigido):
const numericValue = value === '' ? '' : value;
if (numericValue === '' || (!isNaN(parseFloat(numericValue)) && parseFloat(numericValue) >= 0)) {
  handleInputChange('proposedExperience.normalPrice', numericValue === '' ? 0 : parseFloat(numericValue));
}
```

### Passo 2: Adicionar Validação Global
Criar função utilitária para campos numéricos:

```typescript
// utils/numberValidation.ts
export const validateNumericInput = (value: string, min: number = 0, max?: number): number | null => {
  if (value === '') return null;
  
  const num = parseFloat(value);
  if (isNaN(num)) return null;
  if (num < min) return null;
  if (max !== undefined && num > max) return null;
  
  return num;
};

export const formatNumericInput = (value: string): string => {
  // Remove caracteres não numéricos exceto ponto e vírgula
  return value.replace(/[^0-9.,]/g, '').replace(',', '.');
};
```

## 🔍 Outros Locais para Verificar

### PaymentMethodModal.tsx
- Campos: expiryMonth, expiryYear, cvv
- Verificar se há validação adequada

### Checkout.tsx
- Campos monetários
- Validação de cartão de crédito

### BusinessPage.tsx
- Campo "employees" (número de funcionários)

## 🚀 IMPLEMENTAÇÃO RÁPIDA

### Correção Temporária (5 minutos)
1. Abrir `src/pages/partners/PartnerSignup.tsx`
2. Localizar linhas 408-412
3. Substituir o código problemático
4. Testar o formulário de cadastro

### Correção Completa (15 minutos)
1. Criar arquivo `src/utils/numberValidation.ts`
2. Implementar funções de validação
3. Aplicar em todos os formulários
4. Testar todos os campos numéricos

## 🧪 TESTE DE VERIFICAÇÃO

### Após a Correção:
1. Acesse: http://localhost:5175/partner-signup
2. Preencha o formulário até o campo "Preço Normal"
3. Digite valores como:
   - "" (vazio)
   - "abc" (texto)
   - "25.50" (válido)
   - "-10" (negativo)
4. Verifique se não há mais erros "NaN" no console

## 📋 CHECKLIST DE CORREÇÃO

- [ ] PartnerSignup.tsx - campo normalPrice corrigido
- [ ] PaymentMethodModal.tsx - campos numéricos verificados
- [ ] Checkout.tsx - validações monetárias verificadas
- [ ] BusinessPage.tsx - campo employees verificado
- [ ] Função utilitária numberValidation.ts criada
- [ ] Testes realizados em todos os formulários
- [ ] Console limpo de erros "NaN"

## ⏰ Tempo Estimado
- **Correção temporária**: 5 minutos
- **Correção completa**: 15 minutos
- **Testes**: 10 minutos
- **Total**: 30 minutos

---

**Status:** 🔧 Pronto para implementação
**Prioridade:** 🟡 Média (não bloqueia funcionalidade, mas melhora UX)