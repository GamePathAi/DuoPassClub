#!/bin/bash

# 🚀 Script de Configuração Completa do Domínio DUO PASS Club
# Execute no servidor EC2: chmod +x setup-completo-dominio.sh && sudo ./setup-completo-dominio.sh

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função para logs coloridos
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo "🎭 Configuração Completa do DUO PASS Club"
echo "==========================================="
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    log_error "Este script deve ser executado como root (sudo)"
    exit 1
fi

# Verificar conectividade
log_step "1. Verificando conectividade e DNS..."
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short duopassclub.ch)

log_info "IP do servidor: $SERVER_IP"
log_info "IP do domínio: $DOMAIN_IP"

if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
    log_warn "DNS pode não estar propagado completamente"
else
    log_info "✅ DNS configurado corretamente"
fi

# Atualizar sistema
log_step "2. Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências
log_step "3. Instalando dependências..."
apt install -y nginx nodejs npm git certbot python3-certbot-nginx ufw curl wget

# Configurar Node.js (versão LTS)
log_step "4. Configurando Node.js..."
if ! node --version | grep -q "v18\|v20"; then
    log_info "Instalando Node.js LTS..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    apt-get install -y nodejs
fi

log_info "Node.js versão: $(node --version)"
log_info "NPM versão: $(npm --version)"

# Criar estrutura de diretórios
log_step "5. Criando estrutura de diretórios..."
mkdir -p /var/www/duopass
mkdir -p /var/backups/duopass
mkdir -p /var/log/duopass

# Configurar permissões
chown -R www-data:www-data /var/www/duopass
chmod -R 755 /var/www/duopass

# Configurar firewall
log_step "6. Configurando firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw --force enable

log_info "✅ Firewall configurado"

# Parar Nginx padrão
log_step "7. Configurando Nginx..."
systemctl stop nginx 2>/dev/null || true

# Remover configuração padrão
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-available/default

# Criar configuração temporária para SSL
cat > /etc/nginx/sites-available/duopass-temp << 'EOF'
server {
    listen 80;
    server_name duopassclub.ch www.duopassclub.ch;
    
    root /var/www/duopass;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Permitir acesso do Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/duopass;
    }
}
EOF

# Ativar configuração temporária
ln -sf /etc/nginx/sites-available/duopass-temp /etc/nginx/sites-enabled/
nginx -t && systemctl start nginx

log_info "✅ Nginx configurado temporariamente"

# Criar página temporária
log_step "8. Criando página temporária..."
cat > /var/www/duopass/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>DUO PASS Club - Em Configuração</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        .logo { font-size: 2em; color: #6366f1; margin-bottom: 20px; }
        .status { color: #10b981; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🎭 DUO PASS Club</div>
        <h1>Site em Configuração</h1>
        <p class="status">✅ Servidor configurado com sucesso!</p>
        <p>O site estará disponível em breve.</p>
        <hr>
        <small>Configuração automática em andamento...</small>
    </div>
</body>
</html>
EOF

chown www-data:www-data /var/www/duopass/index.html

# Configurar SSL
log_step "9. Configurando SSL com Let's Encrypt..."

# Obter certificado SSL
log_info "Obtendo certificado SSL..."
certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email admin@duopassclub.ch \
    --domains duopassclub.ch,www.duopassclub.ch \
    --redirect

if [ $? -eq 0 ]; then
    log_info "✅ Certificado SSL obtido com sucesso!"
else
    log_error "❌ Falha ao obter certificado SSL"
    exit 1
fi

# Configurar renovação automática
log_step "10. Configurando renovação automática do SSL..."
cat > /etc/cron.daily/certbot-renew << 'EOF'
#!/bin/bash
/usr/bin/certbot renew --quiet --nginx
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "$(date): Certificado renovado com sucesso" >> /var/log/ssl-renewal.log
else
    echo "$(date): Falha na renovação do certificado" >> /var/log/ssl-renewal.log
fi
EOF

chmod +x /etc/cron.daily/certbot-renew

# Testar renovação
log_info "Testando renovação automática..."
certbot renew --dry-run

# Configurar logs
log_step "11. Configurando logs..."
touch /var/log/ssl-renewal.log
chown www-data:www-data /var/log/ssl-renewal.log

# Configurar logrotate
cat > /etc/logrotate.d/duopass << 'EOF'
/var/log/nginx/duopass_*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
EOF

# Criar script de monitoramento
log_step "12. Criando scripts de monitoramento..."
cat > /usr/local/bin/duopass-status << 'EOF'
#!/bin/bash
echo "🎭 DUO PASS Club - Status do Sistema"
echo "==================================="
echo ""
echo "📊 Serviços:"
systemctl is-active nginx && echo "✅ Nginx: Ativo" || echo "❌ Nginx: Inativo"
systemctl is-active certbot.timer && echo "✅ Certbot: Ativo" || echo "❌ Certbot: Inativo"
echo ""
echo "🔒 Certificado SSL:"
certbot certificates | grep -A 5 duopassclub.ch
echo ""
echo "🌐 Conectividade:"
curl -s -I https://duopassclub.ch | head -1
echo ""
echo "📈 Uso do disco:"
df -h /var/www/duopass
echo ""
echo "📝 Últimos logs (5 linhas):"
tail -5 /var/log/nginx/access.log 2>/dev/null || echo "Logs ainda não disponíveis"
EOF

chmod +x /usr/local/bin/duopass-status

# Criar script de backup
cat > /usr/local/bin/duopass-backup << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/duopass/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r /var/www/duopass/* "$BACKUP_DIR/" 2>/dev/null || true
cp /etc/nginx/sites-available/duopass* "$BACKUP_DIR/" 2>/dev/null || true
echo "Backup criado em: $BACKUP_DIR"
# Manter apenas os últimos 7 backups
find /var/backups/duopass -type d -name "backup-*" | sort | head -n -7 | xargs rm -rf
EOF

chmod +x /usr/local/bin/duopass-backup

# Configurar backup automático
echo "0 2 * * * /usr/local/bin/duopass-backup" | crontab -

# Otimizar Nginx
log_step "13. Otimizando configuração do Nginx..."

# Backup da configuração atual
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Otimizar configuração principal
cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;
    
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Logging Settings
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;
    
    # Virtual Host Configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF

# Testar e recarregar Nginx
nginx -t && systemctl reload nginx

# Verificações finais
log_step "14. Executando verificações finais..."

# Verificar se o site está respondendo
log_info "Testando conectividade HTTPS..."
if curl -s -I https://duopassclub.ch | grep -q "200 OK"; then
    log_info "✅ HTTPS funcionando!"
else
    log_warn "⚠️  HTTPS pode ter problemas"
fi

# Verificar certificado
log_info "Verificando certificado SSL..."
SSL_EXPIRY=$(echo | openssl s_client -servername duopassclub.ch -connect duopassclub.ch:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
log_info "Certificado expira em: $SSL_EXPIRY"

# Criar relatório final
log_step "15. Gerando relatório final..."
cat > /var/log/duopass/setup-report.txt << EOF
DUO PASS Club - Relatório de Configuração
==========================================
Data: $(date)
Servidor: $SERVER_IP
Domínio: duopassclub.ch

Serviços Configurados:
✅ Nginx
✅ SSL/TLS (Let's Encrypt)
✅ Firewall (UFW)
✅ Logs e Monitoramento
✅ Backups Automáticos
✅ Renovação SSL Automática

Próximos Passos:
1. Fazer deploy da aplicação DUO PASS
2. Configurar Supabase de produção
3. Configurar variáveis de ambiente
4. Testar todas as funcionalidades

Comandos Úteis:
- Status: duopass-status
- Backup: duopass-backup
- Logs: tail -f /var/log/nginx/access.log

EOF

echo ""
echo "🎉 Configuração Completa Finalizada!"
echo "===================================="
echo ""
log_info "✅ Servidor configurado com sucesso!"
log_info "🌐 Site disponível em: https://duopassclub.ch"
log_info "📊 Status: duopass-status"
log_info "💾 Backup: duopass-backup"
log_info "📋 Relatório: /var/log/duopass/setup-report.txt"
echo ""
log_warn "📝 Próximos passos:"
echo "   1. Fazer deploy da aplicação DUO PASS"
echo "   2. Configurar Supabase de produção"
echo "   3. Configurar variáveis de ambiente"
echo "   4. Testar funcionalidades"
echo ""
log_info "🚀 DUO PASS Club pronto para deploy!"

# Executar status final
/usr/local/bin/duopass-status