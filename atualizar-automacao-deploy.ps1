# Script PowerShell para verificar e atualizar automação de deploy do DuoPass
Write-Host "🔍 Analisando automação de deploy existente do DuoPass..." -ForegroundColor Cyan

# Verificar automações existentes
Write-Host ""
Write-Host "[INFO] 📋 Verificando automações existentes..." -ForegroundColor Green

$foundAutomation = $false

# GitHub Actions
if (Test-Path ".github\workflows\deploy.yml") {
    Write-Host "[INFO] ✅ GitHub Actions encontrado: .github/workflows/deploy.yml" -ForegroundColor Green
    $foundAutomation = $true
    
    $content = Get-Content ".github\workflows\deploy.yml" -Raw
    if ($content -match "workflow_dispatch") {
        Write-Host "[INFO]   ✅ Suporte a deploy manual ativo" -ForegroundColor Green
    } else {
        Write-Host "[WARN]   ⚠️  Deploy manual não configurado" -ForegroundColor Yellow
    }
    
    if ($content -match "rsync") {
        Write-Host "[INFO]   ✅ Deploy via rsync configurado" -ForegroundColor Green
    } else {
        Write-Host "[WARN]   ⚠️  Deploy via rsync não encontrado" -ForegroundColor Yellow
    }
}

# GitLab CI/CD
if (Test-Path ".gitlab-ci.yml") {
    Write-Host "[INFO] ✅ GitLab CI/CD encontrado: .gitlab-ci.yml" -ForegroundColor Green
    $foundAutomation = $true
}

# CircleCI
if (Test-Path ".circleci\config.yml") {
    Write-Host "[INFO] ✅ CircleCI encontrado: .circleci/config.yml" -ForegroundColor Green
    $foundAutomation = $true
}

# Jenkins
if (Test-Path "Jenkinsfile") {
    Write-Host "[INFO] ✅ Jenkins encontrado: Jenkinsfile" -ForegroundColor Green
    $foundAutomation = $true
}

# Webhook
if (Test-Path "setup-webhook.sh") {
    Write-Host "[INFO] ✅ Webhook script encontrado: setup-webhook.sh" -ForegroundColor Green
    $foundAutomation = $true
}

if (-not $foundAutomation) {
    Write-Host "[ERROR] ❌ Nenhuma automação de deploy encontrada!" -ForegroundColor Red
}

# Verificar configurações de segurança
Write-Host "[INFO] 🔐 Verificando configurações de segurança..." -ForegroundColor Green

if (Test-Path ".env.example") {
    Write-Host "[INFO] ✅ Arquivo .env.example encontrado" -ForegroundColor Green
} else {
    Write-Host "[WARN] ⚠️  Arquivo .env.example não encontrado" -ForegroundColor Yellow
}

if (Test-Path "project\package.json") {
    $packageContent = Get-Content "project\package.json" -Raw
    if ($packageContent -match "build:secure") {
        Write-Host "[INFO] ✅ Build seguro configurado" -ForegroundColor Green
    } else {
        Write-Host "[WARN] ⚠️  Build seguro não encontrado" -ForegroundColor Yellow
    }
}

# Verificar configurações do servidor
Write-Host "[INFO] 🌐 Verificando configurações do servidor..." -ForegroundColor Green

if ((Test-Path "project\nginx-unified.conf") -or (Test-Path "nginx-unified.conf")) {
    Write-Host "[INFO] ✅ Configuração Nginx unificada encontrada" -ForegroundColor Green
} else {
    Write-Host "[WARN] ⚠️  Configuração Nginx unificada não encontrada" -ForegroundColor Yellow
}

if (Test-Path "deploy.sh") {
    Write-Host "[INFO] ✅ Script de deploy manual encontrado" -ForegroundColor Green
} else {
    Write-Host "[WARN] ⚠️  Script de deploy manual não encontrado" -ForegroundColor Yellow
}

# Verificar se .env.production existe
if ((-not (Test-Path "project\.env.production")) -and (Test-Path "project\.env.example")) {
    Write-Host "[WARN] Criando .env.production baseado no .env.example..." -ForegroundColor Yellow
    Copy-Item "project\.env.example" "project\.env.production"
    Write-Host "[INFO] ✅ Arquivo .env.production criado" -ForegroundColor Green
    Write-Host "[WARN] ⚠️  IMPORTANTE: Configure as variáveis em .env.production" -ForegroundColor Yellow
}

# Gerar relatório
Write-Host ""
Write-Host "📋 RELATÓRIO DE AUTOMAÇÃO DE DEPLOY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')"
Write-Host "Projeto: DuoPass Club"
Write-Host ""

Write-Host "🔍 AUTOMAÇÕES ENCONTRADAS:" -ForegroundColor Green
if (Test-Path ".github\workflows\deploy.yml") { Write-Host "  ✅ GitHub Actions" }
if (Test-Path ".gitlab-ci.yml") { Write-Host "  ✅ GitLab CI/CD" }
if (Test-Path ".circleci\config.yml") { Write-Host "  ✅ CircleCI" }
if (Test-Path "Jenkinsfile") { Write-Host "  ✅ Jenkins" }
if (Test-Path "setup-webhook.sh") { Write-Host "  ✅ Webhook" }

Write-Host ""
Write-Host "📁 ARQUIVOS DE CONFIGURAÇÃO:" -ForegroundColor Green
if (Test-Path "project\.env.production") { Write-Host "  ✅ .env.production" }
if (Test-Path "project\nginx-unified.conf") { Write-Host "  ✅ nginx-unified.conf" }
if (Test-Path "deploy.sh") { Write-Host "  ✅ deploy.sh" }

Write-Host ""
Write-Host "🎯 RECOMENDAÇÕES:" -ForegroundColor Yellow
Write-Host "  • Manter apenas uma automação principal ativa"
Write-Host "  • Configurar secrets necessários no GitHub/GitLab"
Write-Host "  • Testar deploy em ambiente de staging"
Write-Host "  • Implementar monitoramento pós-deploy"

Write-Host ""
Write-Host "📚 DOCUMENTAÇÃO DISPONÍVEL:" -ForegroundColor Cyan
Write-Host "  • DEPLOYMENT_GUIDE.md - Guia completo de deploy"
Write-Host "  • GUIA_DEPLOY_AUTOMATICO.md - Automação de deploy"
Write-Host "  • README_DEPLOY_AUTOMATICO.md - Opções de automação"

Write-Host ""
Write-Host "[INFO] ✅ Análise da automação de deploy concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Revisar as sugestões de melhorias"
Write-Host "2. Configurar secrets necessários"
Write-Host "3. Testar deploy em ambiente de staging"
Write-Host "4. Ativar monitoramento de deploy"
Write-Host ""
Write-Host "📖 Para mais informações, consulte: GUIA_DEPLOY_AUTOMATICO.md" -ForegroundColor Cyan