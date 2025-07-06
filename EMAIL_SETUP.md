# 📧 Configuração do Sistema de Emails - DuoPass

## Visão Geral
O sistema de emails utiliza **EmailJS** para dois fluxos principais:

### 📝 Cadastro de Parceiros
1. **Email de confirmação** para o parceiro
2. **Email de notificação** para o admin (`contact@dupassclub.ch`)

### 💬 Modal "Falar com Nossa Equipe"
1. **Email de confirmação** para o prospect
2. **Email de notificação** para o admin com dados do lead

## 🚀 Configuração do EmailJS

### 1. Criar Conta no EmailJS
1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Faça login no dashboard

### 2. Configurar Serviço de Email
1. Vá para **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor (Gmail, Outlook, etc.)
4. Configure com o email `contact@dupassclub.ch`
5. Anote o **Service ID**

### 3. Criar Templates de Email

#### Template para Parceiro (Confirmação)
```html
<h2>🎉 Bem-vindo ao DuoPass Club!</h2>
<p>Olá {{partner_name}},</p>
<p>Recebemos seu cadastro para <strong>{{business_name}}</strong> e estamos animados para conhecer mais sobre sua proposta cultural!</p>

<h3>📋 Próximos Passos:</h3>
<ul>
  <li><strong>Análise (24-48h):</strong> Nossa equipe vai avaliar sua proposta</li>
  <li><strong>Entrevista:</strong> Se aprovado, agendaremos uma conversa</li>
  <li><strong>Curadoria:</strong> Criaremos juntos sua experiência perfeita</li>
  <li><strong>Ativação:</strong> Seu espaço entra na plataforma</li>
</ul>

<h3>📞 Contato:</h3>
<p>Email: contact@dupassclub.ch</p>
<p>WhatsApp: (11) 99999-9999</p>

<p>Obrigado por querer fazer parte da nossa comunidade cultural!</p>
<p><strong>Equipe DuoPass Club</strong></p>
```

#### Template para Admin (Notificação)
```html
<h2>🔔 Novo Cadastro de Parceiro</h2>
<p><strong>Parceiro:</strong> {{partner_name}}</p>
<p><strong>Email:</strong> {{partner_email}}</p>
<p><strong>Telefone:</strong> {{partner_phone}}</p>
<p><strong>Empresa:</strong> {{business_name}}</p>
<p><strong>Tipo:</strong> {{business_type}}</p>
<p><strong>Localização:</strong> {{business_location}}</p>

<h3>📝 Detalhes:</h3>
<p><strong>História do Fundador:</strong></p>
<p>{{founder_story}}</p>

<p><strong>Missão Cultural:</strong></p>
<p>{{cultural_mission}}</p>

<p><strong>Experiência Proposta:</strong></p>
<p><strong>Título:</strong> {{experience_title}}</p>
<p><strong>Descrição:</strong> {{experience_description}}</p>
<p><strong>Preço Normal:</strong> {{normal_price}}</p>
<p><strong>Valor DUO:</strong> {{duo_value}}</p>

<p><strong>ID do Cadastro:</strong> {{registration_id}}</p>
<p><strong>Data:</strong> {{submission_date}}</p>
```

#### Template para Contato - Confirmação (Prospect)
```html
<h2>📞 Mensagem Recebida - DuoPass Club</h2>
<p>Olá {{to_name}},</p>
<p>Obrigado por entrar em contato conosco sobre <strong>{{business_name}}</strong>!</p>

<h3>✅ Confirmação:</h3>
<p><strong>Negócio:</strong> {{business_name}}</p>
<p><strong>Tipo:</strong> {{business_type}}</p>
<p><strong>ID da Mensagem:</strong> {{contact_id}}</p>

<h3>⏰ Próximos Passos:</h3>
<p>Nossa equipe analisará sua mensagem e entrará em contato em até <strong>24 horas</strong>.</p>

<h3>📞 Contato Direto:</h3>
<p>Email: contact@dupassclub.ch</p>
<p>Se preferir, pode responder diretamente este email.</p>

<p>Obrigado pelo interesse em fazer parte da nossa comunidade cultural!</p>
<p><strong>Equipe DuoPass Club</strong></p>
```

#### Template para Contato - Admin (Notificação)
```html
<h2>💬 Nova Mensagem de Contato</h2>
<p><strong>Nome:</strong> {{contact_name}}</p>
<p><strong>Email:</strong> {{contact_email}}</p>
<p><strong>Negócio:</strong> {{contact_business}}</p>
<p><strong>Tipo:</strong> {{contact_type}}</p>

<h3>📝 Mensagem:</h3>
<p>{{contact_description}}</p>

<h3>📊 Detalhes:</h3>
<p><strong>ID:</strong> {{contact_id}}</p>
<p><strong>Data:</strong> {{contact_date}}</p>

<p><strong>⚡ Ação:</strong> Responder em até 24h</p>
```

### 4. Configurar Variáveis de Ambiente
1. Copie `.env.example` para `.env`
2. Preencha as variáveis do EmailJS:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID_PARTNER=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID_ADMIN=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID_CONTACT_ADMIN=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID_CONTACT_CONFIRMATION=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx

# Email Configuration
VITE_ADMIN_EMAIL=contact@dupassclub.ch
VITE_REPLY_TO_EMAIL=contact@dupassclub.ch
```

## 🔧 Como Funciona

### Fluxo de Cadastro de Parceiros
1. **Parceiro preenche** o formulário de cadastro
2. **Sistema salva** os dados no Supabase
3. **Sistema envia** email de confirmação para o parceiro
4. **Sistema envia** email de notificação para o admin
5. **Parceiro é redirecionado** para página de sucesso

### Fluxo do Modal "Falar com Nossa Equipe"
1. **Usuário clica** no botão "Falar com Nossa Equipe"
2. **Modal abre** com formulário de contato
3. **Usuário preenche** nome, email, negócio, tipo e descrição
4. **Sistema salva** na tabela `contact_messages` no Supabase
5. **Sistema envia** email de confirmação para o prospect
6. **Sistema envia** email de notificação para o admin
7. **Modal mostra** mensagem de sucesso e fecha automaticamente

### Estados Visuais
- ⏳ **Salvando dados...**
- 📧 **Enviando emails...**
- ✅ **Sucesso!**
- ❌ **Erro** (com opção de tentar novamente)

## 🛠️ Troubleshooting

### Emails não estão sendo enviados
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se o serviço EmailJS está ativo
3. Verifique se os templates existem e estão publicados
4. Confira o console do navegador para erros

### Emails indo para spam
1. Configure SPF/DKIM no domínio `dupassclub.ch`
2. Use um serviço de email profissional (não Gmail pessoal)
3. Evite palavras que ativam filtros de spam

### Limite de emails atingido
1. EmailJS tem limite gratuito de 200 emails/mês
2. Considere upgrade para plano pago se necessário
3. Monitore uso no dashboard do EmailJS

## 📊 Monitoramento

### Dashboard EmailJS
- Acesse estatísticas de envio
- Monitore taxa de sucesso
- Verifique logs de erro

### Console do Navegador
- Logs detalhados do processo
- Erros de configuração
- Status de cada etapa

## 🔒 Segurança

### Boas Práticas
- ✅ Variáveis de ambiente nunca commitadas
- ✅ Public Key do EmailJS é segura para frontend
- ✅ Templates validam dados de entrada
- ✅ Rate limiting no EmailJS previne spam

### Dados Sensíveis
- ❌ Nunca exponha Service ID privado
- ❌ Não inclua credenciais no código
- ❌ Não logge dados pessoais em produção

---

**📞 Suporte:** contact@dupassclub.ch
**🌐 Documentação EmailJS:** https://www.emailjs.com/docs/