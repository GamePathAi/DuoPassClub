#!/bin/bash

# Script de Configuração SSL para DuoPass
# Domínio: duopassclub.ch

set -e

echo "🔒 Configurando SSL para duopassclub.ch..."

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Este script deve ser executado como root (sudo)"
    exit 1
fi

# Verificar se o Nginx está instalado
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx não está instalado. Instale primeiro:"
    echo "sudo apt update && sudo apt install nginx -y"
    exit 1
fi

# Verificar se o domínio está apontando para o servidor
echo "🌐 Verificando DNS do domínio..."
SERVER_IP=$(curl -s ifconfig.me)
DOMAIN_IP=$(dig +short duopassclub.ch)
WWW_DOMAIN_IP=$(dig +short www.duopassclub.ch)

echo "IP do servidor: $SERVER_IP"
echo "IP do domínio duopassclub.ch: $DOMAIN_IP"
echo "IP do domínio www.duopassclub.ch: $WWW_DOMAIN_IP"

if [ "$SERVER_IP" != "$DOMAIN_IP" ] && [ "$SERVER_IP" != "$WWW_DOMAIN_IP" ]; then
    echo "⚠️  AVISO: O DNS pode não estar configurado corretamente."
    echo "Certifique-se de que duopassclub.ch e www.duopassclub.ch apontam para $SERVER_IP"
    read -p "Deseja continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Instalar Certbot se não estiver instalado
if ! command -v certbot &> /dev/null; then
    echo "📦 Instalando Certbot..."
    apt update
    apt install certbot python3-certbot-nginx -y
else
    echo "✅ Certbot já está instalado"
fi

# Verificar se a configuração do Nginx está correta
echo "🔧 Verificando configuração do Nginx..."
if ! nginx -t; then
    echo "❌ Configuração do Nginx inválida. Corrija os erros antes de continuar."
    exit 1
fi

# Parar o Nginx temporariamente para o Certbot
echo "⏸️  Parando Nginx temporariamente..."
systemctl stop nginx

# Obter certificado SSL
echo "🔐 Obtendo certificado SSL..."
certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email admin@duopassclub.ch \
    --domains duopassclub.ch,www.duopassclub.ch

if [ $? -eq 0 ]; then
    echo "✅ Certificado SSL obtido com sucesso!"
else
    echo "❌ Falha ao obter certificado SSL"
    systemctl start nginx
    exit 1
fi

# Reiniciar o Nginx
echo "🔄 Reiniciando Nginx..."
systemctl start nginx
systemctl enable nginx

# Verificar se o SSL está funcionando
echo "🧪 Testando configuração SSL..."
if nginx -t; then
    echo "✅ Configuração do Nginx válida"
else
    echo "❌ Erro na configuração do Nginx"
    exit 1
fi

# Configurar renovação automática
echo "🔄 Configurando renovação automática..."

# Criar script de renovação
cat > /etc/cron.daily/certbot-renew << 'EOF'
#!/bin/bash
# Renovação automática do certificado SSL

/usr/bin/certbot renew --quiet --nginx

# Verificar se a renovação foi bem-sucedida
if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo "$(date): Certificado renovado com sucesso" >> /var/log/ssl-renewal.log
else
    echo "$(date): Falha na renovação do certificado" >> /var/log/ssl-renewal.log
fi
EOF

# Tornar o script executável
chmod +x /etc/cron.daily/certbot-renew

# Testar renovação
echo "🧪 Testando renovação automática..."
certbot renew --dry-run

if [ $? -eq 0 ]; then
    echo "✅ Renovação automática configurada com sucesso!"
else
    echo "⚠️  Aviso: Pode haver problemas com a renovação automática"
fi

# Verificar status do certificado
echo "📋 Status do certificado:"
certbot certificates

# Testar HTTPS
echo "🌐 Testando HTTPS..."
if curl -s -I https://duopassclub.ch | grep -q "200 OK"; then
    echo "✅ HTTPS funcionando para duopassclub.ch"
else
    echo "⚠️  Problema com HTTPS em duopassclub.ch"
fi

if curl -s -I https://www.duopassclub.ch | grep -q "200 OK"; then
    echo "✅ HTTPS funcionando para www.duopassclub.ch"
else
    echo "⚠️  Problema com HTTPS em www.duopassclub.ch"
fi

echo ""
echo "🎉 Configuração SSL concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Teste o site: https://duopassclub.ch"
echo "2. Verifique o SSL: https://www.ssllabs.com/ssltest/"
echo "3. Configure o firewall se necessário"
echo "4. Monitore os logs: tail -f /var/log/ssl-renewal.log"
echo ""
echo "🔄 Renovação automática configurada em /etc/cron.daily/certbot-renew"
echo "📅 Certificados expiram em 90 dias e serão renovados automaticamente"