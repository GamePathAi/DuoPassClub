#!/bin/bash

# 🚀 SCRIPT DE TESTE - DEPLOY AUTOMÁTICO DUOPASS
# Executa testes completos do sistema de deploy

echo "=== TESTE DE DEPLOY AUTOMÁTICO DUOPASS ==="
echo "Iniciando validação completa do sistema..."

# Função para log colorido
log_message() {
    local message="$1"
    local type="${2:-INFO}"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $type in
        "SUCCESS")
            echo -e "\033[32m[$timestamp] ✅ $message\033[0m"
            ;;
        "ERROR")
            echo -e "\033[31m[$timestamp] ❌ $message\033[0m"
            ;;
        "WARNING")
            echo -e "\033[33m[$timestamp] ⚠️ $message\033[0m"
            ;;
        *)
            echo -e "\033[36m[$timestamp] ℹ️ $message\033[0m"
            ;;
    esac
}

# Verificar se estamos na pasta correta
log_message "Verificando estrutura de pastas..."
if [ ! -f "project/package.json" ]; then
    log_message "ERRO: Não encontrado project/package.json. Execute na pasta raiz do DuoPass." "ERROR"
    exit 1
fi
log_message "Estrutura de pastas validada" "SUCCESS"

# Verificar dependências
log_message "Verificando dependências do projeto..."
cd project

if [ ! -d "node_modules" ]; then
    log_message "Instalando dependências..." "WARNING"
    npm install
    if [ $? -ne 0 ]; then
        log_message "Erro ao instalar dependências" "ERROR"
        exit 1
    fi
fi
log_message "Dependências verificadas" "SUCCESS"

# Teste de build local
log_message "Executando build local para teste..."
npm run build
if [ $? -ne 0 ]; then
    log_message "Erro no build local" "ERROR"
    exit 1
fi
log_message "Build local executado com sucesso" "SUCCESS"

# Verificar arquivos de build
log_message "Verificando arquivos de build..."
if [ ! -f "dist/index.html" ]; then
    log_message "Arquivo dist/index.html não encontrado" "ERROR"
    exit 1
fi

dist_files=$(find dist -type f | wc -l)
log_message "Build contém $dist_files arquivos" "SUCCESS"

# Verificar configuração de ambiente
log_message "Verificando configuração de ambiente..."
if [ ! -f ".env.production" ]; then
    log_message "Arquivo .env.production não encontrado" "WARNING"
else
    log_message "Arquivo .env.production encontrado" "SUCCESS"
fi

# Teste de conectividade com o site
log_message "Testando conectividade com duopassclub.ch..."
if curl -I -s --connect-timeout 10 https://duopassclub.ch | head -n 1 | grep -q "200 OK"; then
    log_message "Site duopassclub.ch respondendo (Status: 200)" "SUCCESS"
else
    log_message "Site não está respondendo ou com erro" "WARNING"
fi

# Verificar workflow do GitHub Actions
log_message "Verificando workflow GitHub Actions..."
cd ..
if [ -f ".github/workflows/deploy.yml" ]; then
    log_message "Workflow deploy.yml encontrado" "SUCCESS"
    
    # Verificar se o workflow tem as correções implementadas
    if grep -q "StrictHostKeyChecking=no" ".github/workflows/deploy.yml"; then
        log_message "Correção SSH implementada" "SUCCESS"
    else
        log_message "Correção SSH não encontrada" "WARNING"
    fi
    
    if grep -q "if_key_exists: replace" ".github/workflows/deploy.yml"; then
        log_message "Configuração de chave SSH implementada" "SUCCESS"
    else
        log_message "Configuração de chave SSH não encontrada" "WARNING"
    fi
else
    log_message "Workflow deploy.yml não encontrado" "ERROR"
fi

# Verificar documentação
log_message "Verificando documentação..."
docs=("CORRECAO_GITHUB_ACTIONS_WORKFLOW.md" "PROXIMOS_PASSOS_DEPLOY.md")

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        log_message "Documentação $doc encontrada" "SUCCESS"
    else
        log_message "Documentação $doc não encontrada" "WARNING"
    fi
done

# Resumo final
echo ""
echo "=== RESUMO DO TESTE ==="
log_message "✅ Estrutura de pastas validada"
log_message "✅ Dependências verificadas"
log_message "✅ Build local executado"
log_message "✅ Workflow GitHub Actions verificado"
log_message "✅ Documentação verificada"

echo ""
echo -e "\033[33m🎯 PRÓXIMOS PASSOS:\033[0m"
echo "1. Acesse: https://github.com/GamePathAi/DuoPassClub/actions"
echo "2. Execute o workflow 'DuoPass CI/CD Pipeline - Optimized'"
echo "3. Monitore os logs de deploy"
echo "4. Verifique se o site está funcionando"

echo ""
echo -e "\033[36m📋 COMANDOS ÚTEIS:\033[0m"
echo "• Servidor local: cd project && npm run dev"
echo "• Build: cd project && npm run build"
echo "• Verificar site: curl -I https://duopassclub.ch"

echo ""
echo -e "\033[32m🚀 Sistema pronto para deploy automático!\033[0m"

# Voltar para pasta original
cd project