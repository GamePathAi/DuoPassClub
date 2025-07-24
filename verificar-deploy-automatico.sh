#!/bin/bash

# Script para verificar o status do deploy automático
# Verifica se os componentes necessários estão configurados e funcionando

set -e  # Para em caso de erro

echo "🔍 Verificando configuração de deploy automático do DuoPass..."

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

# Verificar se o webhook está instalado e rodando
check_webhook() {
    log_info "Verificando webhook..."
    
    if ! command -v webhook &> /dev/null; then
        log_error "Webhook não está instalado"
        return 1
    fi
    
    if ! systemctl is-active --quiet webhook; then
        log_error "Serviço webhook não está rodando"
        return 1
    fi
    
    if ! grep -q "deploy-duopass" /etc/webhook.conf 2>/dev/null; then
        log_error "Webhook para DuoPass não está configurado"
        return 1
    fi
    
    log_info "Webhook está configurado e rodando"
    return 0
}

# Verificar se o script de deploy existe
check_deploy_script() {
    log_info "Verificando script de deploy..."
    
    if [ ! -f "/opt/webhook/scripts/deploy-duopass.sh" ]; then
        log_error "Script de deploy não encontrado"
        return 1
    fi
    
    if [ ! -x "/opt/webhook/scripts/deploy-duopass.sh" ]; then
        log_error "Script de deploy não tem permissão de execução"
        return 1
    fi
    
    log_info "Script de deploy encontrado e com permissões corretas"
    return 0
}

# Verificar se o Nginx está configurado corretamente
check_nginx() {
    log_info "Verificando configuração Nginx..."
    
    if [ ! -f "/etc/nginx/sites-available/duopass" ]; then
        log_error "Configuração Nginx para DuoPass não encontrada"
        return 1
    fi
    
    if [ ! -L "/etc/nginx/sites-enabled/duopass" ]; then
        log_error "Link simbólico para configuração Nginx não encontrado"
        return 1
    fi
    
    if ! nginx -t &> /dev/null; then
        log_error "Configuração Nginx inválida"
        return 1
    fi
    
    log_info "Nginx está configurado corretamente"
    return 0
}

# Verificar se o site está acessível
check_site() {
    log_info "Verificando acesso ao site..."
    
    if ! curl -s -f -o /dev/null https://duopassclub.ch; then
        log_error "Site duopassclub.ch não está acessível"
        return 1
    fi
    
    if ! curl -s -f -o /dev/null https://www.duopassclub.ch; then
        log_error "Site www.duopassclub.ch não está acessível"
        return 1
    fi
    
    # Verificar se ambos retornam o mesmo conteúdo
    HASH1=$(curl -s https://duopassclub.ch | md5sum | cut -d' ' -f1)
    HASH2=$(curl -s https://www.duopassclub.ch | md5sum | cut -d' ' -f1)
    
    if [ "$HASH1" != "$HASH2" ]; then
        log_error "Dessincronização detectada - conteúdos diferentes"
        return 1
    fi
    
    log_info "Site está acessível e sincronizado"
    return 0
}

# Verificar logs recentes
check_logs() {
    log_info "Verificando logs recentes..."
    
    if [ -f "/var/log/webhook/deploy-duopass.log" ]; then
        echo "Últimas 5 linhas do log de deploy:"
        tail -5 /var/log/webhook/deploy-duopass.log
    else
        log_warn "Log de deploy não encontrado"
    fi
    
    if [ -f "/var/log/nginx/duopass_error.log" ]; then
        echo "Últimas 5 linhas do log de erro do Nginx:"
        tail -5 /var/log/nginx/duopass_error.log
    else
        log_warn "Log de erro do Nginx não encontrado"
    fi
    
    return 0
}

# Verificar GitHub Actions (se aplicável)
check_github_actions() {
    log_info "Verificando GitHub Actions..."
    
    if [ -f "$HOME/.github/workflows/deploy.yml" ]; then
        log_info "Configuração do GitHub Actions encontrada"
    else
        log_warn "Configuração do GitHub Actions não encontrada localmente"
        log_warn "Verifique se está configurada no repositório GitHub"
    fi
    
    return 0
}

# Executar verificações
echo "🚀 Iniciando verificação do deploy automático..."
echo ""

WEBHOOK_OK=false
DEPLOY_SCRIPT_OK=false
NGINX_OK=false
SITE_OK=false

if check_webhook; then
    WEBHOOK_OK=true
fi

if check_deploy_script; then
    DEPLOY_SCRIPT_OK=true
fi

if check_nginx; then
    NGINX_OK=true
fi

if check_site; then
    SITE_OK=true
fi

check_logs
check_github_actions

echo ""
echo "📊 Resumo da verificação:"
echo "-------------------"
echo -e "Webhook: $([ "$WEBHOOK_OK" == true ] && echo -e "${GREEN}OK${NC}" || echo -e "${RED}FALHA${NC}")"
echo -e "Script de Deploy: $([ "$DEPLOY_SCRIPT_OK" == true ] && echo -e "${GREEN}OK${NC}" || echo -e "${RED}FALHA${NC}")"
echo -e "Nginx: $([ "$NGINX_OK" == true ] && echo -e "${GREEN}OK${NC}" || echo -e "${RED}FALHA${NC}")"
echo -e "Site: $([ "$SITE_OK" == true ] && echo -e "${GREEN}OK${NC}" || echo -e "${RED}FALHA${NC}")"

echo ""
if [ "$WEBHOOK_OK" == true ] && [ "$DEPLOY_SCRIPT_OK" == true ] && [ "$NGINX_OK" == true ] && [ "$SITE_OK" == true ]; then
    log_info "✅ Deploy automático está configurado e funcionando corretamente"
    exit 0
else
    log_error "❌ Deploy automático tem problemas de configuração"
    echo "Consulte o GUIA_DEPLOY_AUTOMATICO.md para instruções de configuração"
    exit 1
fi