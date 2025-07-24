# 🔧 GUIA DE CORREÇÃO - EmailJS Status 400

## 📋 RESUMO DO PROBLEMA

**Problema:** EmailJS retornando Status 400 (Bad Request) ao enviar emails  
**Causa Raiz:** Inicialização dupla do EmailJS + payload com campos undefined/null  
**Solução:** Correções implementadas nos arquivos criados

---

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. **INICIALIZAÇÃO DUPLA DO EMAILJS**
```typescript
// ❌ PROBLEMA: emailService.ts linha ~15
emailjs.init(EMAILJS_CONFIG.publicKey);

// ❌ PROBLEMA: contactService.ts linha ~165 e ~185
const response = await emailjs.send(
  serviceId,
  templateId,
  templateParams,
  publicKey  // ← ERRO: Passando publicKey novamente!
);
```

### 2. **PAYLOAD COM CAMPOS UNDEFINED/NULL**
```typescript
// ❌ PROBLEMA: Campos podem ser undefined
contact_description: contactData.description, // pode ser undefined
contact_id: contactData.id, // pode ser undefined
```

### 3. **INCONSISTÊNCIA NOS TEMPLATE IDS**
```typescript
// ❌ PROBLEMA: Templates diferentes para mesma função
VITE_EMAILJS_PARTNER_TEMPLATE_ID = 'template_d63ebza'
VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION = 'template_d63ebza'
// Ambos apontam para o mesmo template!
```

---

## ✅ SOLUÇÕES IMPLEMENTADAS

### **ARQUIVO 1: `diagnostico-emailjs-400.js`**
- 🔍 Script de diagnóstico completo
- 🧪 Testes de configuração e payload
- 📊 Validação de dados antes do envio
- 🛠️ Funções corrigidas para teste

### **ARQUIVO 2: `emailService-CORRIGIDO.ts`**
- ✅ Inicialização única do EmailJS
- ✅ Validação completa de payloads
- ✅ Sanitização de strings
- ✅ Logs detalhados para debugging
- ✅ Fallbacks para campos obrigatórios

### **ARQUIVO 3: `teste-emailjs-corrigido.html`**
- 🌐 Interface web para testes
- 🧪 Testes mínimos e completos
- 📋 Logs em tempo real
- 🔧 Configuração visual

---

## 🚀 IMPLEMENTAÇÃO PASSO A PASSO

### **ETAPA 1: TESTE INICIAL**

1. **Abra o arquivo de teste:**
   ```bash
   # Navegue até a pasta do projeto
   cd project
   
   # Abra o arquivo de teste no navegador
   start teste-emailjs-corrigido.html
   ```

2. **Configure as credenciais:**
   - Service ID: `service_nj1x65i`
   - Public Key: `jwnAl9bi3b1X98hdq`
   - Template ID: `template_d63ebza`

3. **Execute o teste mínimo:**
   - Clique em "🧪 Enviar Teste Mínimo"
   - Verifique os logs para identificar problemas

### **ETAPA 2: APLICAR CORREÇÕES**

#### **2.1 Corrigir ContactModal.tsx**

```typescript
// ❌ ANTES: src/components/ContactModal.tsx
import { sendContactEmails } from '../services/contactService';

// ✅ DEPOIS: Substituir por:
import { sendContactEmails } from '../services/emailService-CORRIGIDO';
```

#### **2.2 Corrigir PartnerSignup.tsx**

```typescript
// ❌ ANTES: src/pages/partners/PartnerSignup.tsx
import { sendPartnerRegistrationEmails } from '../../services/emailService';

// ✅ DEPOIS: Substituir por:
import { sendPartnerRegistrationEmails } from '../../services/emailService-CORRIGIDO';
```

#### **2.3 Corrigir outros arquivos que usam emailService**

Procure por todas as importações:
```bash
# Buscar todas as importações do emailService
grep -r "from.*emailService" src/
grep -r "import.*emailService" src/
```

Substitua todas por:
```typescript
import { ... } from './services/emailService-CORRIGIDO';
```

### **ETAPA 3: VERIFICAR VARIÁVEIS DE AMBIENTE**

1. **Verifique o arquivo `.env.production`:**
   ```bash
   # Confirme que estas variáveis estão definidas:
   VITE_EMAILJS_SERVICE_ID=service_nj1x65i
   VITE_EMAILJS_PUBLIC_KEY=jwnAl9bi3b1X98hdq
   VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_r3t7pti
   VITE_EMAILJS_PARTNER_TEMPLATE_ID=template_d63ebza
   VITE_EMAILJS_TEMPLATE_ID_CONTACT_ADMIN=template_r3t7pti
   VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION=template_d63ebza
   ```

2. **Verifique se há arquivo `.env.local`:**
   ```bash
   # Se existir, deve ter as mesmas variáveis
   cat .env.local
   ```

### **ETAPA 4: TESTE EM DESENVOLVIMENTO**

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   cd project
   npm run dev
   ```

2. **Teste o formulário de contato:**
   - Acesse a página de contato
   - Preencha o formulário
   - Monitore o console do navegador
   - Verifique se os emails chegam

3. **Teste o registro de parceiro:**
   - Acesse a página de parceiros
   - Complete o formulário de registro
   - Monitore o console do navegador
   - Verifique se os emails chegam

### **ETAPA 5: MONITORAMENTO E LOGS**

#### **5.1 Console do Navegador**
```javascript
// Logs que indicam sucesso:
✅ EmailJS inicializado corretamente
✅ Email admin enviado com sucesso: 200
✅ Email confirmação enviado com sucesso: 200

// Logs que indicam problema:
❌ Erro ao enviar emails de contato: ...
❌ Erro no payload: ...
⚠️ Campo X era null/undefined, substituído por 'N/A'
```

#### **5.2 Verificação no EmailJS Dashboard**
1. Acesse [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Vá em "Email Services" → "service_nj1x65i"
3. Verifique os logs de envio
4. Confirme se os templates estão ativos

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### **Se ainda houver Status 400:**

1. **Verifique Template IDs:**
   ```javascript
   // No console do navegador:
   console.log('Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
   console.log('Templates:', {
     admin: import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
     partner: import.meta.env.VITE_EMAILJS_PARTNER_TEMPLATE_ID,
     contactAdmin: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT_ADMIN,
     contactConfirmation: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION
   });
   ```

2. **Verifique Payload:**
   ```javascript
   // Adicione antes do emailjs.send():
   console.log('Payload enviado:', JSON.stringify(templateParams, null, 2));
   ```

3. **Teste com dados estáticos:**
   ```javascript
   // Use o arquivo teste-emailjs-corrigido.html
   // Teste com dados simples primeiro
   ```

### **Se houver erro de CORS:**
```javascript
// Verifique se está usando HTTPS em produção
// EmailJS requer HTTPS para funcionar corretamente
```

### **Se houver erro de Rate Limiting:**
```javascript
// Verifique no dashboard do EmailJS
// Pode ter atingido o limite de emails por mês
```

---

## 📊 CHECKLIST DE VERIFICAÇÃO

### **✅ Antes de Implementar:**
- [ ] Backup do código atual
- [ ] Verificar variáveis de ambiente
- [ ] Confirmar templates no EmailJS Dashboard
- [ ] Testar com arquivo HTML standalone

### **✅ Durante a Implementação:**
- [ ] Substituir importações do emailService
- [ ] Verificar console para erros
- [ ] Testar formulário de contato
- [ ] Testar registro de parceiro
- [ ] Verificar emails recebidos

### **✅ Após Implementação:**
- [ ] Emails de contato funcionando
- [ ] Emails de parceiro funcionando
- [ ] Logs limpos no console
- [ ] Confirmação no EmailJS Dashboard
- [ ] Teste em produção

---

## 🚨 PONTOS CRÍTICOS

### **1. NÃO PASSAR PUBLIC KEY NO 4º PARÂMETRO**
```typescript
// ❌ ERRADO:
await emailjs.send(serviceId, templateId, params, publicKey);

// ✅ CORRETO:
emailjs.init(publicKey); // Uma vez só
await emailjs.send(serviceId, templateId, params); // Sem publicKey
```

### **2. SEMPRE VALIDAR PAYLOAD**
```typescript
// ✅ SEMPRE fazer:
Object.keys(params).forEach(key => {
  if (params[key] === undefined || params[key] === null) {
    params[key] = 'N/A';
  }
});
```

### **3. LOGS DETALHADOS**
```typescript
// ✅ SEMPRE adicionar:
console.log('Enviando email...', { serviceId, templateId, params });
```

---

## 📞 SUPORTE

Se os problemas persistirem:

1. **Verifique os logs do arquivo de teste HTML**
2. **Compare com o emailService-CORRIGIDO.ts**
3. **Confirme as variáveis de ambiente**
4. **Teste com dados mínimos primeiro**
5. **Verifique o dashboard do EmailJS**

**🎯 Objetivo:** Ter emails funcionando 100% sem Status 400

---

## 📝 RESUMO DAS CORREÇÕES

| Problema | Solução | Arquivo |
|----------|---------|----------|
| Inicialização dupla | `emailjs.init()` uma vez só | `emailService-CORRIGIDO.ts` |
| Campos undefined | Validação + fallback para 'N/A' | `emailService-CORRIGIDO.ts` |
| Payload inconsistente | Sanitização de strings | `emailService-CORRIGIDO.ts` |
| Falta de logs | Console.log detalhado | `emailService-CORRIGIDO.ts` |
| Difícil de testar | Interface HTML de teste | `teste-emailjs-corrigido.html` |
| Diagnóstico manual | Script automatizado | `diagnostico-emailjs-400.js` |

**🚀 Resultado esperado:** Status 200 em todos os envios de email!