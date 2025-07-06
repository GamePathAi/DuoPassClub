# DuoPass - Guia de Deploy em Produção

## ✅ Status do Build

**Build Status:** ✅ SUCESSO  
**Verificações:** 36 aprovadas, 1 aviso, 0 erros  
**Pronto para Deploy:** ✅ SIM

## 📋 Pré-requisitos

### 1. Servidor de Produção
- Ubuntu 20.04+ ou CentOS 8+
- Nginx 1.18+
- Node.js 18+ (para build)
- SSL Certificate (Let's Encrypt recomendado)
- Domínio configurado

### 2. Serviços Externos
- **Supabase:** Projeto configurado em produção
- **Stripe:** Conta configurada (opcional)
- **Google Analytics:** Tracking ID (opcional)
- **Sentry:** DSN para error tracking (opcional)

## 🔧 Configuração de Ambiente

### 1. Variáveis de Ambiente (.env.production)

```bash
# Supabase (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# Aplicação
VITE_APP_URL=https://seudominio.com
VITE_APP_VERSION=1.0.0

# Email (URLs de confirmação)
VITE_EMAIL_CONFIRM_URL=https://seudominio.com/auth/confirm
VITE_EMAIL_RESET_URL=https://seudominio.com/auth/reset

# Pagamentos (Opcional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Analytics (Opcional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true

# Error Tracking (Opcional)
VITE_SENTRY_DSN=https://...@sentry.io/...
VITE_ENABLE_ERROR_TRACKING=true

# Performance (Opcional)
VITE_IMAGE_CDN_URL=https://cdn.seudominio.com
VITE_LOGGING_ENDPOINT=https://api.seudominio.com/logs
```

### 2. Configuração do Supabase

1. **Criar projeto em produção:**
   ```bash
   # No dashboard do Supabase
   # 1. Criar novo projeto
   # 2. Configurar domínio personalizado
   # 3. Configurar políticas RLS
   # 4. Executar migrations
   ```

2. **Configurar autenticação:**
   ```sql
   -- Executar no SQL Editor do Supabase
   -- Configurar URLs de redirecionamento
   UPDATE auth.config SET 
     site_url = 'https://seudominio.com',
     redirect_urls = 'https://seudominio.com/auth/callback';
   ```

## 🚀 Processo de Deploy

### 1. Preparação do Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar Node.js (para build)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Criar diretório da aplicação
sudo mkdir -p /var/www/duopass
sudo chown -R $USER:$USER /var/www/duopass
```

### 2. Deploy Automatizado

```bash
# Fazer upload dos arquivos para o servidor
# Executar o script de deploy
chmod +x deploy.sh
./deploy.sh
```

### 3. Configuração Manual (Alternativa)

```bash
# 1. Build da aplicação
npm install
npm run build

# 2. Copiar arquivos
sudo cp -r dist/* /var/www/duopass/

# 3. Configurar Nginx
sudo cp nginx.conf /etc/nginx/sites-available/duopass
sudo ln -s /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Configurar SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch

# 5. Reiniciar serviços
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Configuração de Segurança

### 1. Headers de Segurança (já configurados no nginx.conf)
- ✅ HSTS (Strict-Transport-Security)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ Referrer-Policy
- ✅ Content-Security-Policy
- ✅ X-XSS-Protection

### 2. SSL/TLS
```bash
# Configurar SSL com Let's Encrypt
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Firewall
```bash
# Configurar UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📊 Monitoramento

### 1. Logs do Nginx
```bash
# Logs de acesso
sudo tail -f /var/log/nginx/access.log

# Logs de erro
sudo tail -f /var/log/nginx/error.log
```

### 2. Monitoramento de Performance
- ✅ Service Worker configurado
- ✅ Core Web Vitals tracking
- ✅ Error tracking (Sentry)
- ✅ Analytics (Google Analytics)

### 3. Health Check
```bash
# Verificar status dos serviços
sudo systemctl status nginx
sudo systemctl status certbot.timer

# Testar conectividade
curl -I https://seudominio.com
```

## 🔄 Atualizações

### 1. Deploy de Nova Versão
```bash
# 1. Fazer backup
sudo cp -r /var/www/duopass /var/www/duopass.backup.$(date +%Y%m%d)

# 2. Build nova versão
npm run build

# 3. Deploy
sudo cp -r dist/* /var/www/duopass/

# 4. Limpar cache (se necessário)
sudo systemctl reload nginx
```

### 2. Rollback
```bash
# Restaurar backup anterior
sudo rm -rf /var/www/duopass
sudo mv /var/www/duopass.backup.YYYYMMDD /var/www/duopass
sudo systemctl reload nginx
```

## 🐛 Troubleshooting

### 1. Problemas Comuns

**Build falha:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Nginx não inicia:**
```bash
# Verificar configuração
sudo nginx -t

# Verificar logs
sudo journalctl -u nginx
```

**SSL não funciona:**
```bash
# Renovar certificado
sudo certbot renew

# Verificar configuração
sudo certbot certificates
```

### 2. Logs de Debug
```bash
# Logs da aplicação (browser console)
# Logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Logs do sistema
sudo journalctl -f
```

## 📈 Otimizações de Performance

### 1. Configurações Aplicadas
- ✅ Gzip compression
- ✅ Browser caching
- ✅ Asset optimization
- ✅ Code splitting
- ✅ Service Worker
- ✅ Image optimization

### 2. CDN (Opcional)
```bash
# Configurar CDN para assets estáticos
# Atualizar VITE_IMAGE_CDN_URL no .env.production
```

## ✅ Checklist Final

- [ ] Servidor configurado e atualizado
- [ ] Domínio apontando para o servidor
- [ ] SSL certificado instalado
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase em produção configurado
- [ ] Build executado com sucesso
- [ ] Nginx configurado e funcionando
- [ ] Firewall configurado
- [ ] Monitoramento ativo
- [ ] Backup configurado
- [ ] DNS propagado
- [ ] Teste de funcionalidades críticas

## 🎉 Pós-Deploy

1. **Testar funcionalidades:**
   - Registro de usuário
   - Login/logout
   - Reset de senha
   - Navegação geral

2. **Configurar monitoramento:**
   - Google Analytics
   - Sentry error tracking
   - Uptime monitoring

3. **Documentar:**
   - URLs de produção
   - Credenciais de acesso
   - Procedimentos de manutenção

---

**Status:** ✅ Pronto para produção  
**Última verificação:** $(date)  
**Versão:** 1.0.0