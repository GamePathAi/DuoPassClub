# 🎭 DUO PASS Club - Marketplace Cultural Suíço

🌐 **Website:** [duopassclub.ch](https://duopassclub.ch)

## 📋 Sobre o Projeto

DUO PASS Club é uma plataforma cultural suíça que conecta pessoas através de experiências autênticas, sempre em dupla. Focamos em curadoria emocional e conexões reais, diferenciando-nos de apps de cupons genéricos.

### ✨ Características Principais

- 🎭 **Experiências Culturais:** Curadoria de estabelecimentos culturais autênticos
- 👥 **Sempre em Dupla:** Modelo único 2 por 1 para conexões reais
- 📱 **QR Codes:** Resgate fácil e seguro das experiências
- 🔐 **Autenticação Segura:** Sistema completo de login e registro
- 💳 **Pagamentos Integrados:** Processamento seguro via Stripe
- 📊 **Dashboard Completo:** Gestão transparente com compliance legal
- ⚖️ **Compliance Total:** GDPR, FADP e legislação suíça

## 🚀 Status do Projeto

✅ **PRONTO PARA PRODUÇÃO**

- ✅ Build otimizado (71.7% compressão)
- ✅ 36 verificações de produção aprovadas
- ✅ SSL configurado (Let's Encrypt)
- ✅ Domínio configurado: duopassclub.ch
- ✅ Analytics e monitoramento implementados
- ✅ Service Worker para performance
- ✅ SEO otimizado

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Vite** - Build tool otimizado
- **React Router** - Roteamento

### Backend & Serviços
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados
- **EmailJS** - Sistema de emails transacionais
- **Stripe** - Processamento de pagamentos
- **Google Analytics** - Analytics
- **Sentry** - Monitoramento de erros

### Infraestrutura
- **Nginx** - Servidor web
- **Let's Encrypt** - Certificados SSL
- **Cloudflare** - CDN e DNS (recomendado)

## 🌐 Domínio e SSL

### Configuração Atual
- **Domínio Principal:** duopassclub.ch
- **Subdomínio:** www.duopassclub.ch
- **SSL:** Let's Encrypt (renovação automática)
- **Redirecionamento:** HTTP → HTTPS

### Arquivos de Configuração
- `nginx.conf` - Configuração do servidor web
- `DNS_CONFIG.md` - Guia de configuração DNS
- `setup-ssl.sh` - Script automático de SSL

## 📦 Instalação e Deploy

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Servidor Ubuntu/Debian
- Domínio configurado

### Instalação Local

```bash
# Clonar o repositório
git clone <repository-url>
cd duopass

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas configurações

# Executar em desenvolvimento
npm run dev
```

### Deploy em Produção

```bash
# 1. Preparar servidor
sudo apt update && sudo apt upgrade -y
sudo apt install nginx nodejs npm git -y

# 2. Clonar e configurar projeto
git clone <repository-url> /var/www/duopass
cd /var/www/duopass
npm install
npm run build

# 3. Configurar Nginx
sudo cp nginx.conf /etc/nginx/sites-available/duopass
sudo ln -s /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# 4. Configurar SSL
sudo chmod +x setup-ssl.sh
sudo ./setup-ssl.sh

# 5. Iniciar serviços
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Deploy Automático

```bash
# Usar script de deploy
chmod +x deploy.sh
./deploy.sh
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=sua_chave_publica_stripe

# Aplicação
VITE_APP_URL=https://duopassclub.ch
VITE_APP_VERSION=1.0.0

# Email
VITE_EMAIL_CONFIRM_URL=https://duopassclub.ch/auth/confirm
VITE_EMAIL_RESET_URL=https://duopassclub.ch/auth/reset

# Analytics (opcional)
VITE_GA_TRACKING_ID=seu_id_google_analytics
VITE_SENTRY_DSN=seu_dsn_sentry
```

### Configuração do Supabase

1. **Criar projeto no Supabase**
2. **Configurar autenticação:**
   - Email/Password habilitado
   - URLs de redirecionamento configuradas
3. **Executar migrações SQL** (ver `database/`)
4. **Configurar RLS (Row Level Security)**

## 📊 Monitoramento

### Analytics Implementados
- **Google Analytics 4** - Métricas de usuário
- **Core Web Vitals** - Performance
- **Error Tracking** - Sentry
- **Custom Events** - Conversões e engajamento

### Logs e Monitoramento

```bash
# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs SSL
sudo tail -f /var/log/ssl-renewal.log

# Status dos serviços
sudo systemctl status nginx
sudo systemctl status certbot.timer
```

## 🔒 Segurança

### Implementações de Segurança
- ✅ HTTPS obrigatório
- ✅ Headers de segurança (HSTS, CSP, etc.)
- ✅ Rate limiting
- ✅ Sanitização de inputs
- ✅ Autenticação JWT
- ✅ RLS no banco de dados

### Certificados SSL
- **Provedor:** Let's Encrypt
- **Renovação:** Automática (cron daily)
- **Algoritmo:** RSA 2048
- **Validade:** 90 dias

## 📱 Performance

### Otimizações Implementadas
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Service Worker
- ✅ Compressão Gzip/Brotli
- ✅ Cache otimizado
- ✅ Minificação CSS/JS
- ✅ Otimização de imagens

### Métricas de Build
- **Tamanho do bundle:** ~500KB (comprimido)
- **Tempo de build:** ~12 segundos
- **Compressão:** 71.7%
- **Lighthouse Score:** 95+

## 🧪 Testes

### Verificações Automáticas
- ✅ Lint (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Build validation
- ✅ Security headers
- ✅ SSL configuration
- ✅ Performance metrics

### Executar Testes

```bash
# Lint
npm run lint

# Build
npm run build

# Preview
npm run preview

# Checklist de produção
npm run check:production
```

## 📚 Documentação

- `DEPLOYMENT_GUIDE.md` - Guia completo de deploy
- `DOMAIN_SSL_GUIDE.md` - Configuração de domínio e SSL
- `DNS_CONFIG.md` - Configuração DNS detalhada
- `PRODUCTION_SUMMARY.md` - Resumo da configuração de produção

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Email:** admin@duopassclub.ch
- **Website:** [duopassclub.ch](https://duopassclub.ch)
- **Documentação:** [docs.duopassclub.ch](https://docs.duopassclub.ch)

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] App mobile (React Native)
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade
- [ ] Integração com redes sociais
- [ ] Notificações push
- [ ] Geolocalização avançada

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Monitoramento avançado
- [ ] Cache Redis
- [ ] CDN para assets

---

**Desenvolvido com ❤️ para a comunidade suíça**

🌐 [duopassclub.ch](https://duopassclub.ch) | 📧 admin@duopassclub.ch
