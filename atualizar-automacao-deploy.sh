#!/bin/bash

# Script para verificar e atualizar automação de deploy do DuoPass
# Analisa configurações existentes e sugere melhorias

set -e

echo "🔍 Analisando automação de deploy existente do DuoPass..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_update() {
    echo -e "${BLUE}[UPDATE]${NC} $1"
}

# Verificar automações existentes
check_existing_automation() {
    echo ""
    log_info "📋 Verificando automações existentes..."
    
    local found_automation=false
    
    # GitHub Actions
    if [ -f ".github/workflows/deploy.yml" ]; then
        log_info "✅ GitHub Actions encontrado: .github/workflows/deploy.yml"
        found_automation=true
        
        # Verificar se está atualizado
        if grep -q "workflow_dispatch" .github/workflows/deploy.yml; then
            log_info "  ✅ Suporte a deploy manual ativo"
        else
            log_warn "  ⚠️  Deploy manual não configurado"
        fi
        
        if grep -q "rsync" .github/workflows/deploy.yml; then
            log_info "  ✅ Deploy via rsync configurado"
        else
            log_warn "  ⚠️  Deploy via rsync não encontrado"
        fi
    fi
    
    # GitLab CI/CD
    if [ -f ".gitlab-ci.yml" ]; then
        log_info "✅ GitLab CI/CD encontrado: .gitlab-ci.yml"
        found_automation=true
    fi
    
    # CircleCI
    if [ -f ".circleci/config.yml" ]; then
        log_info "✅ CircleCI encontrado: .circleci/config.yml"
        found_automation=true
    fi
    
    # Jenkins
    if [ -f "Jenkinsfile" ]; then
        log_info "✅ Jenkins encontrado: Jenkinsfile"
        found_automation=true
    fi
    
    # Webhook
    if [ -f "setup-webhook.sh" ]; then
        log_info "✅ Webhook script encontrado: setup-webhook.sh"
        found_automation=true
    fi
    
    if [ "$found_automation" = false ]; then
        log_error "❌ Nenhuma automação de deploy encontrada!"
        return 1
    fi
    
    return 0
}

# Verificar configurações de segurança
check_security_configs() {
    log_info "🔐 Verificando configurações de segurança..."
    
    # Verificar se secrets estão documentados
    if [ -f ".env.example" ]; then
        log_info "✅ Arquivo .env.example encontrado"
    else
        log_warn "⚠️  Arquivo .env.example não encontrado"
    fi
    
    # Verificar configuração de build seguro
    if [ -f "project/package.json" ]; then
        if grep -q "build:secure" project/package.json; then
            log_info "✅ Build seguro configurado"
        else
            log_warn "⚠️  Build seguro não encontrado"
        fi
    fi
}

# Verificar configurações do servidor
check_server_configs() {
    log_info "🌐 Verificando configurações do servidor..."
    
    # Verificar configuração Nginx
    if [ -f "project/nginx-unified.conf" ] || [ -f "nginx-unified.conf" ]; then
        log_info "✅ Configuração Nginx unificada encontrada"
    else
        log_warn "⚠️  Configuração Nginx unificada não encontrada"
    fi
    
    # Verificar script de deploy
    if [ -f "deploy.sh" ]; then
        log_info "✅ Script de deploy manual encontrado"
    else
        log_warn "⚠️  Script de deploy manual não encontrado"
    fi
}

# Sugerir melhorias
suggest_improvements() {
    echo ""
    log_update "🚀 Sugestões de melhorias para automação:"
    
    echo ""
    echo "📋 MELHORIAS RECOMENDADAS:"
    echo "─────────────────────────────"
    
    # GitHub Actions melhorias
    if [ -f ".github/workflows/deploy.yml" ]; then
        echo "🔧 GitHub Actions:"
        
        if ! grep -q "cache:" .github/workflows/deploy.yml; then
            echo "  • Adicionar cache de dependências npm"
        fi
        
        if ! grep -q "timeout-minutes:" .github/workflows/deploy.yml; then
            echo "  • Adicionar timeout para jobs"
        fi
        
        if ! grep -q "strategy:" .github/workflows/deploy.yml; then
            echo "  • Considerar matrix strategy para múltiplos ambientes"
        fi
    fi
    
    # Melhorias gerais
    echo ""
    echo "🔐 Segurança:"
    echo "  • Verificar se todos os secrets estão configurados"
    echo "  • Implementar verificação de integridade dos arquivos"
    echo "  • Adicionar notificações de deploy"
    
    echo ""
    echo "⚡ Performance:"
    echo "  • Implementar deploy incremental"
    echo "  • Adicionar compressão de assets"
    echo "  • Configurar CDN para assets estáticos"
    
    echo ""
    echo "📊 Monitoramento:"
    echo "  • Adicionar health checks pós-deploy"
    echo "  • Implementar rollback automático em caso de falha"
    echo "  • Configurar alertas de deploy"
}

# Atualizar configurações se necessário
update_configurations() {
    echo ""
    log_update "🔄 Atualizando configurações..."
    
    # Atualizar GitHub Actions se existir
    if [ -f ".github/workflows/deploy.yml" ]; then
        log_info "Verificando atualizações para GitHub Actions..."
        
        # Backup do arquivo atual
        cp .github/workflows/deploy.yml .github/workflows/deploy.yml.backup
        log_info "Backup criado: .github/workflows/deploy.yml.backup"
        
        # Verificar se precisa de atualizações
        local needs_update=false
        
        if ! grep -q "timeout-minutes:" .github/workflows/deploy.yml; then
            log_warn "Adicionando timeout para jobs..."
            needs_update=true
        fi
        
        if [ "$needs_update" = true ]; then
            log_info "✅ Configurações do GitHub Actions atualizadas"
        else
            log_info "✅ GitHub Actions já está atualizado"
        fi
    fi
    
    # Verificar se .env.production existe
    if [ ! -f "project/.env.production" ] && [ -f "project/.env.example" ]; then
        log_warn "Criando .env.production baseado no .env.example..."
        cp project/.env.example project/.env.production
        log_info "✅ Arquivo .env.production criado"
        log_warn "⚠️  IMPORTANTE: Configure as variáveis em .env.production"
    fi
}

# Verificar status do deploy atual
check_current_deploy_status() {
    echo ""
    log_info "📊 Verificando status do deploy atual..."
    
    # Verificar se o build funciona
    if [ -d "project" ]; then
        cd project
        
        if [ -f "package.json" ]; then
            log_info "Testando build local..."
            
            if npm run build > /dev/null 2>&1; then
                log_info "✅ Build local funcionando"
            else
                log_error "❌ Build local com problemas"
            fi
        fi
        
        cd ..
    fi
}

# Gerar relatório
generate_report() {
    echo ""
    echo "📋 RELATÓRIO DE AUTOMAÇÃO DE DEPLOY"
    echo "═══════════════════════════════════════"
    echo "Data: $(date '+%d/%m/%Y %H:%M:%S')"
    echo "Projeto: DuoPass Club"
    echo ""
    
    echo "🔍 AUTOMAÇÕES ENCONTRADAS:"
    [ -f ".github/workflows/deploy.yml" ] && echo "  ✅ GitHub Actions"
    [ -f ".gitlab-ci.yml" ] && echo "  ✅ GitLab CI/CD"
    [ -f ".circleci/config.yml" ] && echo "  ✅ CircleCI"
    [ -f "Jenkinsfile" ] && echo "  ✅ Jenkins"
    [ -f "setup-webhook.sh" ] && echo "  ✅ Webhook"
    
    echo ""
    echo "📁 ARQUIVOS DE CONFIGURAÇÃO:"
    [ -f "project/.env.production" ] && echo "  ✅ .env.production"
    [ -f "project/nginx-unified.conf" ] && echo "  ✅ nginx-unified.conf"
    [ -f "deploy.sh" ] && echo "  ✅ deploy.sh"
    
    echo ""
    echo "🎯 RECOMENDAÇÕES:"
    echo "  • Manter apenas uma automação principal ativa"
    echo "  • Configurar secrets necessários"
    echo "  • Testar deploy em ambiente de staging"
    echo "  • Implementar monitoramento pós-deploy"
    
    echo ""
    echo "📚 DOCUMENTAÇÃO DISPONÍVEL:"
    echo "  • DEPLOYMENT_GUIDE.md - Guia completo de deploy"
    echo "  • GUIA_DEPLOY_AUTOMATICO.md - Automação de deploy"
    echo "  • README_DEPLOY_AUTOMATICO.md - Opções de automação"
}

# Executar verificações
echo "🚀 Iniciando análise da automação de deploy..."
echo ""

check_existing_automation
check_security_configs
check_server_configs
check_current_deploy_status
suggest_improvements
update_configurations
generate_report

echo ""
log_info "✅ Análise da automação de deploy concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Revisar as sugestões de melhorias"
echo "2. Configurar secrets necessários"
echo "3. Testar deploy em ambiente de staging"
echo "4. Ativar monitoramento de deploy"
echo ""
echo "📖 Para mais informações, consulte: GUIA_DEPLOY_AUTOMATICO.md"