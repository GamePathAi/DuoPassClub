# 🚨 CORREÇÃO DEFINITIVA - EmailJS Status 400

## 📊 DIAGNÓSTICO DOS LOGS

Baseado nos logs do console:
```
api.emailjs.com/api/v1.0/email/send:1  Failed to load resource: the server responded with a status of 400 ()
hook.js:608 ❌ Erro ao enviar email de confirmação: Os
hook.js:608 ❌ Erro ao enviar notificação admin: Os
```

## 🔍 PROBLEMAS IDENTIFICADOS

1. **Múltiplos arquivos emailService conflitantes:**
   - `src/services/emailService.ts` (principal)
   - `src/services/emailService-CORRIGIDO.ts` (correção)
   - `emailService-CORRIGIDO.ts` (raiz do projeto)

2. **Importações inconsistentes:**
   - `PartnerSignup.tsx` → `emailService-CORRIGIDO`
   - `ContactModal.tsx` → `emailService` (antigo)

3. **Templates EmailJS com campos incompatíveis**

## ✅ SOLUÇÃO DEFINITIVA

### ETAPA 1: Unificar o EmailService

**Arquivo único:** `src/services/emailService.ts`

```typescript
import emailjs from '@emailjs/browser';

// ========================================
// 🔧 CONFIGURAÇÃO UNIFICADA E CORRIGIDA
// ========================================

const EMAILJS_CONFIG = {
  serviceId: 'service_nj1x65i',
  templateIds: {
    // USAR APENAS template_r3t7pti que funciona
    universal: 'template_r3t7pti'
  },
  publicKey: 'jwnAl9bi3b1X98hdq'
};

let emailjsInitialized = false;

function initializeEmailJS() {
  if (!emailjsInitialized) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    emailjsInitialized = true;
    console.log('✅ EmailJS inicializado');
  }
}

// Inicializar automaticamente
initializeEmailJS();

function sanitizeString(str) {
  if (str === null || str === undefined) return 'N/A';
  return String(str).trim().substring(0, 1000);
}

// ========================================
// 📧 FUNÇÃO UNIVERSAL PARA PARCEIROS
// ========================================

export async function sendPartnerRegistrationEmails(partnerData) {
  console.log('📧 Enviando emails de parceiro - VERSÃO UNIFICADA');
  
  try {
    initializeEmailJS();
    
    // 1. EMAIL PARA ADMIN
    const adminParams = {
      to_email: 'silviabonafe@duopassclub.ch',
      contact_name: sanitizeString(partnerData.contactName),
      contact_email: sanitizeString(partnerData.email),
      contact_business: sanitizeString(partnerData.businessName),
      contact_type: sanitizeString(partnerData.businessType),
      contact_description: `NOVO PARCEIRO REGISTRADO\n\nNegócio: ${partnerData.businessName}\nContato: ${partnerData.contactName}\nEmail: ${partnerData.email}\nTelefone: ${partnerData.phone}\nTipo: ${partnerData.businessType}\n\nEndereço:\n${partnerData.address?.street}\n${partnerData.address?.city}, ${partnerData.address?.postalCode}\n${partnerData.address?.country}\n\nHistória: ${partnerData.founderStory}\n\nMissão Cultural: ${partnerData.culturalMission}\n\nExperiência Proposta:\nTítulo: ${partnerData.proposedExperience?.title}\nDescrição: ${partnerData.proposedExperience?.description}\nPreço Normal: CHF ${partnerData.proposedExperience?.normalPrice}\nValor DUO: ${partnerData.proposedExperience?.duoValue}`,
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: 'contact@duopassclub.ch'
    };
    
    console.log('📤 Enviando para admin:', adminParams);
    
    const adminResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.universal,
      adminParams
    );
    
    console.log('✅ Email admin enviado:', adminResponse.status);
    
    // 2. EMAIL DE CONFIRMAÇÃO PARA PARCEIRO
    const partnerParams = {
      to_email: sanitizeString(partnerData.email),
      contact_name: sanitizeString(partnerData.contactName),
      contact_business: sanitizeString(partnerData.businessName),
      contact_type: 'Confirmação de Cadastro',
      contact_description: `Olá ${partnerData.contactName}!\n\nObrigado por se registrar como parceiro do DUO PASS Club!\n\nRecebemos os dados do ${partnerData.businessName} e nossa equipe analisará sua proposta.\n\nEntraremos em contato em até 48 horas para os próximos passos.\n\nBem-vindo à família DUO PASS!`,
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: 'contact@duopassclub.ch'
    };
    
    console.log('📤 Enviando confirmação para parceiro:', partnerParams);
    
    const partnerResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.universal,
      partnerParams
    );
    
    console.log('✅ Email parceiro enviado:', partnerResponse.status);
    
    return {
      success: true,
      adminResponse,
      partnerResponse,
      errors: []
    };
    
  } catch (error) {
    console.error('❌ Erro ao enviar emails de parceiro:', error);
    
    return {
      success: false,
      errors: [`Erro ao enviar emails: ${error.message}`]
    };
  }
}

// ========================================
// 📧 FUNÇÃO UNIVERSAL PARA CONTATOS
// ========================================

export async function sendContactEmails(contactData) {
  console.log('📧 Enviando emails de contato - VERSÃO UNIFICADA');
  
  try {
    initializeEmailJS();
    
    // Email para admin
    const adminParams = {
      to_email: 'silviabonafe@duopassclub.ch',
      contact_name: sanitizeString(contactData.name),
      contact_email: sanitizeString(contactData.email),
      contact_business: sanitizeString(contactData.business),
      contact_type: sanitizeString(contactData.type),
      contact_description: sanitizeString(contactData.description),
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: 'contact@duopassclub.ch'
    };
    
    const adminResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.universal,
      adminParams
    );
    
    console.log('✅ Email admin enviado:', adminResponse.status);
    
    // Email de confirmação para cliente
    const confirmationParams = {
      to_email: sanitizeString(contactData.email),
      contact_name: sanitizeString(contactData.name),
      contact_business: sanitizeString(contactData.business),
      contact_type: 'Confirmação de Contato',
      contact_description: `Olá ${contactData.name}!\n\nObrigado pelo seu interesse no DUO PASS Club!\n\nRecebemos seu contato sobre ${contactData.business} e nossa equipe responderá em breve.\n\nAguarde nosso retorno!`,
      contact_date: new Date().toLocaleString('pt-BR'),
      reply_to: 'contact@duopassclub.ch'
    };
    
    const confirmationResponse = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.universal,
      confirmationParams
    );
    
    console.log('✅ Email confirmação enviado:', confirmationResponse.status);
    
    return {
      success: true,
      adminResponse,
      confirmationResponse
    };
    
  } catch (error) {
    console.error('❌ Erro ao enviar emails de contato:', error);
    throw error;
  }
}

export default {
  sendPartnerRegistrationEmails,
  sendContactEmails
};
```

### ETAPA 2: Corrigir Importações

**PartnerSignup.tsx:**
```typescript
// ALTERAR linha 5:
// DE: import { sendPartnerRegistrationEmails } from '../../services/emailService-CORRIGIDO';
// PARA:
import { sendPartnerRegistrationEmails } from '../../services/emailService';
```

**ContactModal.tsx:**
```typescript
// Manter linha 4 (já está correta):
import { sendContactEmails } from '../services/emailService';
```

### ETAPA 3: Remover Arquivos Duplicados

**Arquivos para deletar:**
- `src/services/emailService-CORRIGIDO.ts`
- `emailService-CORRIGIDO.ts` (raiz)

## 🚀 COMANDOS DE IMPLEMENTAÇÃO

```bash
# 1. Navegar para pasta correta
cd project

# 2. Fazer backup
cp src/services/emailService.ts src/services/emailService.backup.ts

# 3. Aplicar correções (será feito via script)
# 4. Testar
npm run dev
```

## 🔍 VALIDAÇÃO

Após implementar:
1. ✅ Abrir console do navegador
2. ✅ Testar cadastro de parceiro
3. ✅ Verificar se não há mais erros 400
4. ✅ Confirmar recebimento de emails

## 📋 CHECKLIST DE CORREÇÃO

- [ ] Substituir `src/services/emailService.ts`
- [ ] Corrigir importação em `PartnerSignup.tsx`
- [ ] Deletar arquivos duplicados
- [ ] Testar em produção
- [ ] Verificar logs do console
- [ ] Confirmar recebimento de emails

---

**🎯 RESULTADO ESPERADO:**
- ❌ Eliminar erros 400 do EmailJS
- ✅ Emails funcionando 100%
- ✅ Logs limpos no console
- ✅ Experiência do usuário perfeita