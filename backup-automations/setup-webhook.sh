#!/bin/bash

# Script para configurar webhook para deploy automático do DuoPass
# Este script configura um webhook que pode ser acionado pelo GitHub para atualizar o site

set -e  # Para em caso de erro

echo "🚀 Configurando webhook para deploy automático do DuoPass..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    log_error "Este script deve ser executado como root (sudo)"
    exit 1
fi

# Instalar webhook se não estiver instalado
if ! command -v webhook &> /dev/null; then
    log_info "Instalando webhook..."
    apt-get update
    apt-get install -y webhook
fi

# Criar diretório para scripts e hooks
log_info "Criando diretórios para webhook..."
mkdir -p /opt/webhook/scripts

# Criar script de deploy que será executado pelo webhook
log_info "Criando script de deploy..."
cat > /opt/webhook/scripts/deploy-duopass.sh << 'EOF'
#!/bin/bash

set -e

LOG_FILE="/var/log/webhook/deploy-duopass.log"
mkdir -p /var/log/webhook
touch $LOG_FILE

echo "[$(date)] Iniciando deploy automático via webhook" >> $LOG_FILE

# Diretório temporário para clone
TMP_DIR=$(mktemp -d)
echo "[$(date)] Usando diretório temporário: $TMP_DIR" >> $LOG_FILE

# Clone do repositório
echo "[$(date)] Clonando repositório..." >> $LOG_FILE
git clone --depth 1 https://github.com/seu-usuario/duopass.git $TMP_DIR
cd $TMP_DIR/project

# Instalar dependências e fazer build
echo "[$(date)] Instalando dependências..." >> $LOG_FILE
npm ci >> $LOG_FILE 2>&1

echo "[$(date)] Fazendo build..." >> $LOG_FILE
cp .env.production .env
npm run build >> $LOG_FILE 2>&1

# Backup da versão atual
echo "[$(date)] Criando backup..." >> $LOG_FILE
mkdir -p /var/www/duopass/backup/$(date +%Y%m%d_%H%M%S)
cp -r /var/www/duopass/dist/* /var/www/duopass/backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# Deploy dos novos arquivos
echo "[$(date)] Fazendo deploy dos arquivos..." >> $LOG_FILE
rm -rf /var/www/duopass/dist/*
cp -r dist/* /var/www/duopass/dist/
chown -R www-data:www-data /var/www/duopass/dist
chmod -R 755 /var/www/duopass/dist

# Verificar configuração Nginx
echo "[$(date)] Verificando configuração Nginx..." >> $LOG_FILE
cp nginx-unified.conf /etc/nginx/sites-available/duopass
ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/
nginx -t >> $LOG_FILE 2>&1 && systemctl reload nginx

# Limpeza
echo "[$(date)] Limpando arquivos temporários..." >> $LOG_FILE
rm -rf $TMP_DIR

echo "[$(date)] Deploy concluído com sucesso" >> $LOG_FILE
EOF

chmod +x /opt/webhook/scripts/deploy-duopass.sh

# Criar configuração do webhook
log_info "Criando configuração do webhook..."
cat > /etc/webhook.conf << EOF
[
  {
    "id": "deploy-duopass",
    "execute-command": "/opt/webhook/scripts/deploy-duopass.sh",
    "command-working-directory": "/opt/webhook",
    "response-message": "Iniciando deploy do DuoPass...",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha1",
        "secret": "seu-segredo-aqui",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature"
        }
      }
    }
  }
]
EOF

# Criar serviço systemd para o webhook
log_info "Criando serviço systemd para o webhook..."
cat > /etc/systemd/system/webhook.service << EOF
[Unit]
Description=Webhook para deploy automático
After=network.target

[Service]
ExecStart=/usr/bin/webhook -hooks /etc/webhook.conf -verbose
Restart=always
User=root
Group=root
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

[Install]
WantedBy=multi-user.target
EOF

# Habilitar e iniciar o serviço
log_info "Habilitando e iniciando o serviço webhook..."
systemctl daemon-reload
systemctl enable webhook
systemctl restart webhook

# Verificar status do serviço
log_info "Verificando status do serviço webhook..."
systemctl status webhook --no-pager

# Configurar firewall (se existir)
if command -v ufw &> /dev/null; then
    log_info "Configurando firewall..."
    ufw allow 9000/tcp
    ufw status
fi

# Instruções finais
echo ""
log_info "🎉 Webhook configurado com sucesso!"
echo ""
echo "📋 Instruções para configurar o webhook no GitHub:"
echo "1. Acesse seu repositório no GitHub"
echo "2. Vá para Settings > Webhooks > Add webhook"
echo "3. Configure os seguintes campos:"
echo "   - Payload URL: http://duopassclub.ch:9000/hooks/deploy-duopass"
echo "   - Content type: application/json"
echo "   - Secret: seu-segredo-aqui (o mesmo configurado no webhook.conf)"
echo "   - Eventos: Selecione 'Just the push event'"
echo "   - Active: Marcado"
echo ""
echo "⚠️  IMPORTANTE: Substitua 'seu-segredo-aqui' no arquivo /etc/webhook.conf por um segredo forte"
echo "   e use o mesmo segredo na configuração do webhook no GitHub."
echo ""
echo "📝 Logs do webhook: /var/log/webhook/deploy-duopass.log"
echo "📝 Logs do serviço: journalctl -u webhook"
echo ""
echo "🔍 URL do webhook: http://duopassclub.ch:9000/hooks/deploy-duopass"
echo ""