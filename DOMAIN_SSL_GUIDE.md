# Guia de Configuração de Domínio e SSL - DuoPass

## 📋 Visão Geral

Este guia fornece instruções detalhadas para configurar o domínio `duopassclub.ch` e certificado SSL para o DuoPass.

## 🌐 Domínio: duopassclub.ch

### 1. Registro do Domínio .ch

#### Registradores Recomendados para .ch
- **Switch.ch** (registrador oficial)
- **Hostpoint** (popular na Suíça)
- **Infomaniak** (suíço, ecológico)
- **Namecheap** (internacional)
- **Cloudflare** (com DNS gratuito)

#### Processo de Registro
1. **Verificar disponibilidade:**
   ```bash
   # Verificar se duopassclub.ch está disponível
   whois duopassclub.ch
   ```

2. **Requisitos para .ch:**
   - Não há restrições geográficas
   - Período mínimo: 1 ano
   - Renovação automática recomendada
   - Custo aproximado: CHF 15-25/ano

3. **Informações necessárias:**
   - Dados do proprietário
   - Dados administrativos
   - Dados técnicos
   - Nameservers (DNS)

### 2. Configuração de DNS

#### Records DNS Necessários

```dns
; Configuração básica para duopassclub.ch

; A Records (IPv4)
duopassclub.ch.        IN  A     YOUR_SERVER_IP
www.duopassclub.ch.    IN  A     YOUR_SERVER_IP

; AAAA Records (IPv6) - Opcional
duopassclub.ch.        IN  AAAA  YOUR_SERVER_IPv6
www.duopassclub.ch.    IN  AAAA  YOUR_SERVER_IPv6

; CNAME Records
api.duopassclub.ch.    IN  CNAME duopassclub.ch.
cdn.duopassclub.ch.    IN  CNAME duopassclub.ch.

; MX Records (Email) - Opcional
duopassclub.ch.        IN  MX    10 mail.duopassclub.ch.

; TXT Records
duopassclub.ch.        IN  TXT   "v=spf1 include:_spf.google.com ~all"
_dmarc.duopassclub.ch. IN  TXT   "v=DMARC1; p=quarantine; rua=mailto:dmarc@duopassclub.ch"

; CAA Records (Certificate Authority Authorization)
duopassclub.ch.        IN  CAA   0 issue "letsencrypt.org"
duopassclub.ch.        IN  CAA   0 issuewild "letsencrypt.org"
```

#### Configuração no Cloudflare (Recomendado)

1. **Adicionar site ao Cloudflare:**
   ```bash
   # 1. Criar conta no Cloudflare
   # 2. Adicionar duopassclub.ch
   # 3. Alterar nameservers no registrador
   ```

2. **DNS Records no Cloudflare:**
   ```
   Type    Name                Value               Proxy
   A       duopassclub.ch      YOUR_SERVER_IP      ✅ Proxied
   A       www                 YOUR_SERVER_IP      ✅ Proxied
   CNAME   api                 duopassclub.ch      ✅ Proxied
   CNAME   cdn                 duopassclub.ch      ✅ Proxied
   ```

3. **Configurações de Segurança:**
   - SSL/TLS: Full (strict)
   - Always Use HTTPS: On
   - HSTS: Enabled
   - Minimum TLS Version: 1.2

### 3. Configuração do Servidor

#### Atualizar nginx.conf

```nginx
# Atualizar o arquivo nginx.conf existente
server {
    listen 80;
    server_name duopassclub.ch www.duopassclub.ch;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name duopassclub.ch www.duopassclub.ch;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/duopassclub.ch/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/duopassclub.ch/privkey.pem;
    
    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Root directory
    root /var/www/duopass;
    index index.html;
    
    # Rest of configuration...
}
```

### 4. Certificado SSL com Let's Encrypt

#### Instalação do Certbot

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

#### Obter Certificado SSL

```bash
# Método 1: Automático com Nginx
sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch

# Método 2: Manual (se Cloudflare proxy estiver ativo)
sudo certbot certonly --manual --preferred-challenges dns \
  -d duopassclub.ch -d www.duopassclub.ch

# Método 3: Webroot (se servidor já estiver rodando)
sudo certbot certonly --webroot -w /var/www/duopass \
  -d duopassclub.ch -d www.duopassclub.ch
```

#### Renovação Automática

```bash
# Testar renovação
sudo certbot renew --dry-run

# Configurar cron para renovação automática
sudo crontab -e

# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 5. Verificação e Testes

#### Verificar DNS

```bash
# Verificar propagação DNS
nslookup duopassclub.ch
dig duopassclub.ch

# Verificar de diferentes locais
# https://www.whatsmydns.net/
```

#### Verificar SSL

```bash
# Testar certificado SSL
openssl s_client -connect duopassclub.ch:443 -servername duopassclub.ch

# Verificar online
# https://www.ssllabs.com/ssltest/
```

#### Verificar Configuração

```bash
# Testar Nginx
sudo nginx -t

# Recarregar configuração
sudo systemctl reload nginx

# Verificar status
sudo systemctl status nginx
```

### 6. Atualizar Variáveis de Ambiente

#### Atualizar .env.production

```bash
# Atualizar URLs no arquivo .env.production
VITE_APP_URL=https://duopassclub.ch
VITE_EMAIL_CONFIRM_URL=https://duopassclub.ch/auth/confirm
VITE_EMAIL_RESET_URL=https://duopassclub.ch/auth/reset
```

#### Atualizar Supabase

```sql
-- Atualizar URLs no Supabase
UPDATE auth.config SET 
  site_url = 'https://duopassclub.ch',
  redirect_urls = 'https://duopassclub.ch/auth/callback,https://www.duopassclub.ch/auth/callback';
```

### 7. Configurações Adicionais

#### Google Analytics

```javascript
// Atualizar domínio no Google Analytics
// Property Settings > Data Streams > Web
// Website URL: https://duopassclub.ch
```

#### Search Console

```bash
# Adicionar propriedades no Google Search Console:
# - https://duopassclub.ch
# - https://www.duopassclub.ch
```

#### Sitemap

```xml
<!-- Atualizar sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://duopassclub.ch/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <!-- Adicionar outras páginas -->
</urlset>
```

### 8. Monitoramento

#### Uptime Monitoring

```bash
# Configurar monitoramento em:
# - UptimeRobot (gratuito)
# - Pingdom
# - StatusCake
# - Cloudflare (se usando proxy)
```

#### SSL Monitoring

```bash
# Monitorar expiração do certificado:
# - SSL Labs
# - Certificate Transparency logs
# - Alertas automáticos do Let's Encrypt
```

### 9. Checklist de Deploy

- [ ] **Domínio registrado:** duopassclub.ch
- [ ] **DNS configurado:** A, AAAA, CNAME records
- [ ] **Nameservers atualizados:** Cloudflare ou registrador
- [ ] **Propagação DNS:** Verificada globalmente
- [ ] **Servidor configurado:** Nginx com domínio correto
- [ ] **Certificado SSL:** Let's Encrypt instalado
- [ ] **HTTPS funcionando:** Redirecionamento automático
- [ ] **Renovação automática:** Cron configurado
- [ ] **Variáveis atualizadas:** .env.production
- [ ] **Supabase atualizado:** URLs de callback
- [ ] **Analytics configurado:** Google Analytics
- [ ] **Search Console:** Propriedades adicionadas
- [ ] **Monitoramento ativo:** Uptime e SSL

### 10. Comandos Úteis

```bash
# Verificar status do certificado
sudo certbot certificates

# Renovar certificado manualmente
sudo certbot renew

# Verificar configuração Nginx
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx

# Verificar logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Verificar DNS
dig duopassclub.ch
nslookup duopassclub.ch

# Testar SSL
curl -I https://duopassclub.ch
```

### 11. Troubleshooting

#### Problemas Comuns

**DNS não propaga:**
```bash
# Verificar TTL dos records
# Aguardar até 48h para propagação global
# Usar diferentes DNS servers para teste
```

**Certificado SSL falha:**
```bash
# Verificar se domínio aponta para servidor
# Verificar se porta 80 está acessível
# Verificar logs do certbot
sudo journalctl -u certbot
```

**Nginx não inicia:**
```bash
# Verificar sintaxe
sudo nginx -t

# Verificar logs
sudo journalctl -u nginx
```

---

## 🎯 Resumo

**Domínio:** duopassclub.ch  
**SSL:** Let's Encrypt (gratuito)  
**DNS:** Cloudflare (recomendado)  
**Renovação:** Automática via cron  
**Monitoramento:** Uptime + SSL alerts

**Custo estimado:** CHF 15-25/ano (apenas domínio)