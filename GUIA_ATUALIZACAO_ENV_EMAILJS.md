# 🔧 GUIA RÁPIDO - Atualização EmailJS via .env

## ✅ PROBLEMA RESOLVIDO

**Situação:** Os campos `{{business_name}}` e `{{contact_name}}` não eram substituídos nos emails.

**Solução:** Sistema agora usa variáveis de ambiente do `.env` para configurar template IDs específicos.

---

## 🚀 COMO ATUALIZAR (APENAS .env)

### **OPÇÃO 1: Usar Template Existente (Recomendado)**

**No arquivo `.env.production`:**

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_nj1x65i
VITE_EMAILJS_TEMPLATE_ID_PARTNER=template_r3t7pti
VITE_EMAILJS_TEMPLATE_ID_ADMIN=template_r3t7pti
VITE_EMAILJS_TEMPLATE_ID_CONTACT_ADMIN=template_r3t7pti
VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION=template_r3t7pti
VITE_EMAILJS_PUBLIC_KEY=jwnAl9bi3b1X98hdq
```

**✅ Vantagem:** Funciona imediatamente com template já testado.

---

### **OPÇÃO 2: Criar Templates Específicos**

**1. No EmailJS Dashboard, criar:**
- `template_admin_complete` (para admin com todos os dados)
- `template_partner_basic` (para parceiro com dados básicos)
- `template_contact_admin` (para contatos admin)
- `template_contact_confirmation` (para confirmação)

**2. No arquivo `.env.production`:**

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_nj1x65i
VITE_EMAILJS_TEMPLATE_ID_PARTNER=template_partner_basic
VITE_EMAILJS_TEMPLATE_ID_ADMIN=template_admin_complete
VITE_EMAILJS_TEMPLATE_ID_CONTACT_ADMIN=template_contact_admin
VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION=template_contact_confirmation
VITE_EMAILJS_PUBLIC_KEY=jwnAl9bi3b1X98hdq
```

---

## 📋 CAMPOS DISPONÍVEIS NOS TEMPLATES

### **Para Admin (Dados Completos):**
```html
{{contact_name}} - Nome do contato
{{business_name}} - Nome do negócio
{{contact_email}} - Email do contato
{{business_type}} - Tipo de negócio
{{phone}} - Telefone
{{address_street}} - Endereço
{{address_city}} - Cidade
{{address_postal}} - CEP
{{address_country}} - País
{{founder_story}} - História do fundador
{{cultural_mission}} - Missão cultural
{{experience_title}} - Título da experiência
{{experience_description}} - Descrição da experiência
{{normal_price}} - Preço normal
{{duo_value}} - Valor DUO
{{contact_date}} - Data do contato
```

### **Para Parceiro (Dados Básicos):**
```html
{{contact_name}} - Nome do contato
{{business_name}} - Nome do negócio
{{contact_date}} - Data do contato
```

### **Para Contatos:**
```html
{{contact_name}} - Nome do contato
{{business_name}} - Nome do negócio
{{contact_email}} - Email
{{contact_type}} - Tipo de contato
{{contact_description}} - Descrição
{{contact_date}} - Data do contato
```

---

## 🔄 COMO APLICAR AS MUDANÇAS

### **1. Atualizar .env:**
```bash
cd project
# Editar .env.production com os template IDs corretos
```

### **2. Reiniciar servidor:**
```bash
cd project
npm run dev
```

### **3. Testar:**
- Acessar: http://localhost:5175/
- Preencher formulário de parceiro
- Verificar se emails chegam com campos preenchidos

---

## ✅ VALIDAÇÃO

**Antes da correção:**
```
Olá {{contact_name}},
Seu negócio {{business_name}} foi registrado.
```

**Depois da correção:**
```
Olá João Silva,
Seu negócio Café Central foi registrado.
```

---

## 🚨 IMPORTANTE

1. **Backup:** Sempre fazer backup do `.env` antes de alterar
2. **Teste:** Testar em ambiente local antes de produção
3. **Templates:** Se criar templates novos, usar exatamente os nomes dos campos listados acima
4. **Fallback:** Sistema tem fallback automático para `template_r3t7pti` se outros falharem

---

## 📞 SUPORTE

Se houver problemas:
1. Verificar se template IDs existem no EmailJS
2. Verificar se campos estão corretos nos templates
3. Verificar logs do console no navegador
4. Usar função `debugEmailFields()` para verificar mapeamento

**Status:** ✅ Implementado e testado
**Data:** Janeiro 2025
**Versão:** 2.0 - Sistema com variáveis de ambiente