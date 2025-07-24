# 📧 GUIA COMPLETO DE CONFIGURAÇÃO DO EMAILJS

## 🎯 VISÃO GERAL

**EmailJS** é o serviço utilizado pelo DuoPass Club para enviar emails transacionais, incluindo:

- ✅ Confirmação de cadastro para parceiros
- ✅ Notificações para administradores
- ✅ Confirmação de contatos
- ✅ Comunicações gerais

---

## 🔧 CONFIGURAÇÃO PASSO A PASSO

### **1. Criar Conta no EmailJS**

1. Acesse [EmailJS.com](https://www.emailjs.com/)
2. Crie uma conta ou faça login
3. Confirme seu email

### **2. Criar Serviço de Email**

1. No dashboard, vá para **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor (Gmail, Outlook, etc.)
4. Configure as credenciais
5. Anote o **Service ID** (ex: `service_nj1x65i`)

### **3. Criar Templates**

1. Vá para **Email Templates**
2. Clique em **Create New Template**
3. Crie os seguintes templates:
   - `template_admin_complete` - Para administradores (todos os dados)
   - `template_partner_basic` - Para parceiros (dados básicos)
   - `template_r3t7pti` - Template universal (fallback)

4. Em cada template, use as variáveis conforme documentado em `emailService.ts`:
   ```
   {{contact_name}} - Nome do contato
   {{business_name}} - Nome do negócio
   {{contact_email}} - Email
   ...
   ```

### **4. Obter Chave Pública**

1. Vá para **Account** > **API Keys**
2. Copie sua **Public Key**

### **5. Configurar Variáveis de Ambiente**

Atualize o arquivo `.env.production` com os valores corretos:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID_PARTNER=seu_template_id_parceiro
VITE_EMAILJS_TEMPLATE_ID_ADMIN=seu_template_id_admin
VITE_EMAILJS_TEMPLATE_ID_CONTACT_ADMIN=seu_template_id_contato_admin
VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION=seu_template_id_confirmacao
VITE_EMAILJS_PUBLIC_KEY=sua_chave_publica
```

---

## 🧪 TESTANDO A CONFIGURAÇÃO

### **Opção 1: Teste via Navegador**

1. Abra o arquivo `teste-emailjs-browser.html` em seu navegador
2. Preencha os campos de configuração
3. Clique em "Enviar Email de Teste"

### **Opção 2: Teste via Aplicação**

1. Execute o servidor de desenvolvimento:
   ```bash
   cd project
   npm run dev
   ```

2. Acesse http://localhost:5175/
3. Preencha o formulário de parceiro
4. Verifique se os emails são enviados corretamente

### **Opção 3: Teste via Script**

1. Atualize o arquivo `teste-emailjs-config.js` com suas credenciais
2. Execute o script:
   ```bash
   cd project
   node teste-emailjs-config.js
   ```

---

## 🔍 SOLUÇÃO DE PROBLEMAS

### **Erro: "The Public Key is invalid"**

**Solução:**
1. Verifique se a chave pública está correta
2. Obtenha a chave atualizada em: https://dashboard.emailjs.com/admin/account
3. Atualize o arquivo `.env.production`

### **Erro: "Template not found"**

**Solução:**
1. Verifique se o template ID está correto
2. Confirme se o template existe em sua conta EmailJS
3. Atualize o arquivo `.env.production`

### **Erro: "Service not found"**

**Solução:**
1. Verifique se o service ID está correto
2. Confirme se o serviço existe em sua conta EmailJS
3. Atualize o arquivo `.env.production`

---

## 📋 CAMPOS DISPONÍVEIS NOS TEMPLATES

### **Template Admin (Completo)**

```
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

### **Template Parceiro (Básico)**

```
{{contact_name}} - Nome do contato
{{business_name}} - Nome do negócio
{{contact_date}} - Data do contato
```

---

## 🔒 SEGURANÇA

Segundo a [documentação oficial do EmailJS](https://www.emailjs.com/docs/faq/is-it-okay-to-expose-my-public-key/), é seguro expor a chave pública, pois ela só permite enviar templates predefinidos em sua conta, não emails arbitrários.

---

## 🚀 MELHORES PRÁTICAS

1. **Templates Responsivos:** Garanta que seus templates funcionem em dispositivos móveis
2. **Testes Regulares:** Verifique periodicamente se os emails estão sendo enviados
3. **Monitoramento:** Acompanhe os logs para identificar problemas
4. **Backup:** Mantenha um backup das configurações e templates
5. **Limites:** Fique atento aos limites de envio do seu plano EmailJS

---

**Status:** ✅ Documentação Completa  
**Data:** Janeiro 2025  
**Versão:** 1.0