# 🚀 SETUP CUSTOMER SERVICE AGENT

## 📋 CONFIGURAÇÃO RÁPIDA

### 1. CONFIGURAR OPENAI API

#### Obter Chave API
1. Acesse https://platform.openai.com/api-keys
2. Faça login na sua conta OpenAI
3. Clique em "Create new secret key"
4. Copie a chave gerada

#### Configurar Variável de Ambiente
```bash
# No arquivo .env
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. EXECUTAR SCHEMA SUPABASE

#### Via SQL Editor (Recomendado)
1. Acesse o Supabase Dashboard
2. Vá em "SQL Editor"
3. Execute o conteúdo do arquivo `customer-service-schema.sql`

#### Via CLI
```bash
# Se tiver Supabase CLI configurado
supabase db reset
# ou
psql -h your-host -U postgres -d postgres -f customer-service-schema.sql
```

### 3. TESTAR IMPLEMENTAÇÃO

#### Verificar Componente
1. Inicie o servidor: `npm run dev`
2. Acesse http://localhost:5174
3. Faça login com usuário válido
4. Procure o botão flutuante no canto inferior direito

#### Testar Chat
1. Clique no botão do chat
2. Digite uma mensagem de teste
3. Verifique se a resposta é gerada
4. Confirme se a interação foi salva no banco

## 🧪 CENÁRIOS DE TESTE

### Teste 1: Pergunta Simples
```
Mensagem: "Como funciona o DUO PASS?"
Esperado: Resposta explicativa personalizada
Tipo: question
```

### Teste 2: Cancelamento
```
Mensagem: "Quero cancelar minha reserva de hoje"
Esperado: Cancelamento automático (se houver voucher para hoje)
Tipo: cancellation
Ação: Update status voucher
```

### Teste 3: Problema Técnico
```
Mensagem: "Meu QR code não funciona"
Esperado: Regeneração automática do QR
Tipo: technical
Ação: Update qr_code_data
```

### Teste 4: Reclamação
```
Mensagem: "O restaurante estava fechado"
Esperado: Pedido de desculpas + solução
Tipo: complaint
```

## 🔍 VERIFICAÇÕES

### Banco de Dados
```sql
-- Verificar tabela criada
SELECT * FROM customer_interactions LIMIT 5;

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'customer_interactions';

-- Verificar índices
SELECT * FROM pg_indexes WHERE tablename = 'customer_interactions';
```

### Logs de Desenvolvimento
```bash
# Console do navegador
# Verificar se não há erros de importação
# Confirmar chamadas para OpenAI API
# Validar salvamento no Supabase
```

### Interface
- [ ] Botão flutuante visível
- [ ] Modal abre/fecha corretamente
- [ ] Mensagens aparecem em tempo real
- [ ] Loading states funcionam
- [ ] Animações suaves
- [ ] Responsivo em mobile

## ⚠️ TROUBLESHOOTING

### Erro: "OpenAI API Key not found"
**Solução:**
```bash
# Verificar se a variável está no .env
echo $VITE_OPENAI_API_KEY

# Reiniciar servidor após adicionar
npm run dev
```

### Erro: "Table doesn't exist"
**Solução:**
```sql
-- Executar schema novamente
-- Verificar conexão Supabase
SELECT current_database();
```

### Erro: "RLS Policy violation"
**Solução:**
```sql
-- Verificar se usuário está autenticado
SELECT auth.uid();

-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'customer_interactions';
```

### Chat não aparece
**Verificações:**
1. Usuário está logado?
2. Componente está no Layout?
3. Não há erros no console?
4. Z-index correto?

## 📊 MONITORAMENTO

### Métricas Importantes
```sql
-- Total de interações por tipo
SELECT 
  interaction_type,
  COUNT(*) as total,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
FROM customer_interactions 
GROUP BY interaction_type;

-- Interações por usuário
SELECT 
  user_id,
  COUNT(*) as interactions,
  MAX(created_at) as last_interaction
FROM customer_interactions 
GROUP BY user_id
ORDER BY interactions DESC;

-- Atividade por hora
SELECT 
  EXTRACT(hour FROM created_at) as hour,
  COUNT(*) as interactions
FROM customer_interactions 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour;
```

### Logs de Performance
```javascript
// No hook useCustomerServiceAgent
console.time('message-processing');
// ... processamento
console.timeEnd('message-processing');

// Métricas esperadas:
// - Classificação: < 1s
// - Resposta: < 2s
// - Total: < 3s
```

## 🔧 CONFIGURAÇÕES AVANÇADAS

### Rate Limiting
```typescript
// Implementar debounce no input
const debouncedSend = useMemo(
  () => debounce(sendMessage, 1000),
  [sendMessage]
);
```

### Cache de Respostas
```typescript
// Cache respostas comuns
const responseCache = new Map();
const cacheKey = `${messageType}-${userContext.userData.user_type}`;
```

### Fallback Offline
```typescript
// Respostas estáticas quando API falha
const fallbackResponses = {
  question: "Obrigada pela sua pergunta! Nossa equipe responderá em breve.",
  technical: "Detectamos um problema técnico. Estamos trabalhando na solução."
};
```

## 📱 DEPLOY CHECKLIST

### Pré-Deploy
- [ ] OpenAI API Key configurada
- [ ] Schema Supabase executado
- [ ] Testes locais passando
- [ ] Performance validada
- [ ] Logs configurados

### Pós-Deploy
- [ ] Monitoramento ativo
- [ ] Métricas coletadas
- [ ] Feedback dos usuários
- [ ] Ajustes de prompts

---

## 🎯 PRÓXIMOS PASSOS

1. **Configurar OpenAI API Key**
2. **Executar schema no Supabase**
3. **Testar todos os cenários**
4. **Monitorar métricas iniciais**
5. **Coletar feedback dos usuários**
6. **Otimizar prompts baseado nos dados**

**Sofia está pronta para revolucionar o atendimento! 🚀**