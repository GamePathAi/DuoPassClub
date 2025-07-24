#!/bin/bash

# Script para corrigir configuração Nginx - DuoPass
# Resolve conflitos entre duopassclub.ch e www.duopassclub.ch

echo "🚀 Iniciando correção da configuração Nginx para DuoPass..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    error "Este script deve ser executado como root (sudo)"
    exit 1
fi

# Backup das configurações atuais
log "Fazendo backup das configurações atuais..."
mkdir -p /etc/nginx/backup/$(date +%Y%m%d_%H%M%S)
cp /etc/nginx/sites-available/* /etc/nginx/backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
cp /etc/nginx/sites-enabled/* /etc/nginx/backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# Remover configurações conflitantes
log "Removendo configurações conflitantes..."
rm -f /etc/nginx/sites-enabled/duopass*
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-available/duopass*

# Copiar nova configuração
log "Aplicando nova configuração unificada..."
cp nginx-unified.conf /etc/nginx/sites-available/duopass

# Criar link simbólico
ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/

# Testar configuração
log "Testando configuração Nginx..."
if nginx -t; then
    success "Configuração Nginx válida!"
else
    error "Erro na configuração Nginx!"
    log "Restaurando backup..."
    rm -f /etc/nginx/sites-enabled/duopass
    # Restaurar configuração anterior se existir
    if [ -f "/etc/nginx/backup/$(date +%Y%m%d_%H%M%S)/duopass" ]; then
        cp "/etc/nginx/backup/$(date +%Y%m%d_%H%M%S)/duopass" /etc/nginx/sites-available/
        ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/
    fi
    exit 1
fi

# Verificar se o diretório da aplicação existe
log "Verificando diretório da aplicação..."
if [ ! -d "/var/www/duopass/dist" ]; then
    warning "Diretório /var/www/duopass/dist não encontrado!"
    log "Criando estrutura de diretórios..."
    mkdir -p /var/www/duopass/dist
    chown -R www-data:www-data /var/www/duopass
    
    if [ -d "./dist" ]; then
        log "Copiando arquivos de build local..."
        cp -r ./dist/* /var/www/duopass/dist/
        chown -R www-data:www-data /var/www/duopass/dist
    else
        warning "Arquivos de build não encontrados! Execute 'npm run build' primeiro."
    fi
fi

# Verificar certificados SSL
log "Verificando certificados SSL..."
if [ ! -f "/etc/letsencrypt/live/duopassclub.ch/fullchain.pem" ]; then
    warning "Certificados SSL não encontrados!"
    log "Para configurar SSL, execute:"
    echo "sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch"
else
    success "Certificados SSL encontrados!"
fi

# Recarregar Nginx
log "Recarregando Nginx..."
if systemctl reload nginx; then
    success "Nginx recarregado com sucesso!"
else
    error "Erro ao recarregar Nginx!"
    systemctl status nginx
    exit 1
fi

# Verificar status
log "Verificando status dos serviços..."
echo "📊 Status do Nginx:"
systemctl status nginx --no-pager -l

echo ""
echo "🔍 Testando conectividade:"
curl -I http://duopassclub.ch 2>/dev/null | head -1 || echo "❌ HTTP não acessível"
curl -I https://duopassclub.ch 2>/dev/null | head -1 || echo "❌ HTTPS não acessível"
curl -I https://www.duopassclub.ch 2>/dev/null | head -1 || echo "❌ WWW não acessível"

echo ""
success "✅ Configuração Nginx aplicada com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Verificar se duopassclub.ch e www.duopassclub.ch mostram o mesmo conteúdo"
echo "2. Testar todas as rotas da aplicação"
echo "3. Verificar logs: tail -f /var/log/nginx/duopass_error.log"
echo "4. Se necessário, configurar SSL: sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch"
echo ""
echo "🌐 URLs para testar:"
echo "   - https://duopassclub.ch"
echo "   - https://www.duopassclub.ch"
echo "   - https://duopassclub.ch/experiencias"
echo "   - https://duopassclub.ch/ofertas"

log "Deploy concluído! 🎉"