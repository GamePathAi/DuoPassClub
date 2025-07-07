# 🚀 Configuração Completa do Domínio DUO PASS Club

## 📊 Status Atual

✅ **DNS Propagado:** duopassclub.ch → 54.229.77.39  
✅ **E-mail Configurado:** Zoho Mail funcionando  
🔴 **Aplicação:** Nginx padrão (precisa deploy)  
🔴 **SSL:** Não configurado  
🔴 **Variáveis:** Produção não configuradas  

---

## 🎯 Plano de Ação Completo

### **FASE 1: Preparação do Ambiente** ⚙️

#### 1.1 Configurar Variáveis de Produção
```bash
# No servidor EC2, editar .env.production
sudo nano /var/www/duopass/.env.production
```

**Configurações obrigatórias:**
```env
# Supabase Produção (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://sua-url-producao.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_producao

# Aplicação
VITE_APP_URL=https://duopassclub.ch
VITE_APP_VERSION=1.0.0

# Email
VITE_EMAIL_CONFIRM_URL=https://duopassclub.ch/auth/confirm
VITE_EMAIL_RESET_URL=https://duopassclub.ch/auth/reset

# Stripe (quando ativar pagamentos)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_sua_chave_stripe

# Analytics (opcional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_ENABLE_ANALYTICS=true
```

#### 1.2 Preparar Servidor
```bash
# Conectar no servidor EC2
ssh ubuntu@54.229.77.39

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install nginx nodejs npm git certbot python3-certbot-nginx -y

# Criar diretório da aplicação
sudo mkdir -p /var/www/duopass
sudo chown -R ubuntu:ubuntu /var/www/duopass
```

---

### **FASE 2: Deploy da Aplicação** 📦

#### 2.1 Upload dos Arquivos
```bash
# No seu PC, fazer build de produção
cd c:\Users\igor_\Desktop\DuoPass\project
npm run build

# Comprimir arquivos para upload
tar -czf duopass-build.tar.gz dist/
```

#### 2.2 Transferir para Servidor
```bash
# Upload via SCP (do seu PC)
scp duopass-build.tar.gz ubuntu@54.229.77.39:/home/ubuntu/

# No servidor, extrair arquivos
ssh ubuntu@54.229.77.39
cd /home/ubuntu
tar -xzf duopass-build.tar.gz
sudo cp -r dist/* /var/www/duopass/
sudo chown -R www-data:www-data /var/www/duopass
sudo chmod -R 755 /var/www/duopass
```

#### 2.3 Configurar Nginx
```bash
# Copiar configuração do Nginx
sudo cp /path/to/nginx.conf /etc/nginx/sites-available/duopass
sudo ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t
```

---

### **FASE 3: Configuração SSL** 🔒

#### 3.1 Instalar Certificado SSL
```bash
# Parar Nginx temporariamente
sudo systemctl stop nginx

# Obter certificado Let's Encrypt
sudo certbot certonly \
  --standalone \
  --non-interactive \
  --agree-tos \
  --email admin@duopassclub.ch \
  --domains duopassclub.ch,www.duopassclub.ch

# Reiniciar Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 3.2 Configurar Renovação Automática
```bash
# Criar script de renovação
sudo tee /etc/cron.daily/certbot-renew << 'EOF'
#!/bin/bash
/usr/bin/certbot renew --quiet --nginx
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "$(date): Certificado renovado" >> /var/log/ssl-renewal.log
fi
EOF

# Tornar executável
sudo chmod +x /etc/cron.daily/certbot-renew

# Testar renovação
sudo certbot renew --dry-run
```

---

### **FASE 4: Configuração do Supabase** 🗄️

#### 4.1 Criar Projeto de Produção
1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto para produção
3. Configure domínio personalizado
4. Anote URL e chave anônima

#### 4.2 Configurar Autenticação
```sql
-- No SQL Editor do Supabase
UPDATE auth.config SET 
  site_url = 'https://duopassclub.ch',
  redirect_urls = 'https://duopassclub.ch/auth/callback';
```

#### 4.3 Executar Migrações
```bash
# Executar scripts SQL de criação das tabelas
# (usar os arquivos .sql do projeto)
```

---

### **FASE 5: Configuração de Segurança** 🛡️

#### 5.1 Configurar Firewall
```bash
# Configurar UFW
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

#### 5.2 Headers de Segurança
```nginx
# Já configurados no nginx.conf:
# - HSTS
# - X-Frame-Options
# - Content-Security-Policy
# - X-Content-Type-Options
```

---

### **FASE 6: Monitoramento e Logs** 📊

#### 6.1 Configurar Logs
```bash
# Verificar logs do Nginx
sudo tail -f /var/log/nginx/duopass_access.log
sudo tail -f /var/log/nginx/duopass_error.log

# Logs SSL
sudo tail -f /var/log/ssl-renewal.log
```

#### 6.2 Health Check
```bash
# Verificar status dos serviços
sudo systemctl status nginx
sudo systemctl status certbot.timer

# Testar conectividade
curl -I https://duopassclub.ch
```

---

## 🔧 Scripts Automatizados

### Script de Deploy Completo
```bash
# Executar no servidor
chmod +x deploy.sh
./deploy.sh
```

### Script de Configuração SSL
```bash
# Executar no servidor
sudo chmod +x setup-ssl.sh
sudo ./setup-ssl.sh
```

---

## ✅ Checklist Final

### Antes do Deploy:
- [ ] Variáveis de produção configuradas
- [ ] Supabase de produção criado
- [ ] Build da aplicação gerado
- [ ] Servidor EC2 preparado

### Durante o Deploy:
- [ ] Arquivos transferidos para servidor
- [ ] Nginx configurado
- [ ] SSL instalado e funcionando
- [ ] Firewall configurado

### Após o Deploy:
- [ ] Site acessível via HTTPS
- [ ] Autenticação funcionando
- [ ] Formulários enviando dados
- [ ] Logs sendo gerados
- [ ] Renovação SSL configurada

---

## 🚨 Comandos de Emergência

### Reverter Deploy
```bash
# Restaurar backup
sudo cp -r /var/backups/duopass/backup-YYYYMMDD/* /var/www/duopass/
sudo systemctl reload nginx
```

### Verificar Problemas
```bash
# Logs de erro
sudo tail -f /var/log/nginx/error.log

# Status dos serviços
sudo systemctl status nginx

# Testar configuração
sudo nginx -t
```

### Renovar SSL Manualmente
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

---

## 📞 Próximos Passos

1. **Configurar Analytics:** Google Analytics, Sentry
2. **Configurar Backups:** Automáticos diários
3. **Monitoramento:** Uptime, performance
4. **CDN:** CloudFlare para performance
5. **Testes:** Load testing, security scan

---

**🎯 Meta:** Site DUO PASS Club 100% funcional em https://duopassclub.ch**