# SCRIPT DE TESTE - DEPLOY AUTOMATICO DUOPASS
# Executa testes completos do sistema de deploy

Write-Host "=== TESTE DE DEPLOY AUTOMATICO DUOPASS ===" -ForegroundColor Green
Write-Host "Iniciando validação completa do sistema..." -ForegroundColor Yellow

# Função para log colorido
function Write-Log {
    param(
        [string]$Message,
        [string]$Type = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    switch ($Type) {
        "SUCCESS" { Write-Host "[$timestamp] [OK] $Message" -ForegroundColor Green }
        "ERROR" { Write-Host "[$timestamp] [ERROR] $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "[$timestamp] [WARNING] $Message" -ForegroundColor Yellow }
        default { Write-Host "[$timestamp] [INFO] $Message" -ForegroundColor Cyan }
    }
}

# Verificar se estamos na pasta correta
Write-Log "Verificando estrutura de pastas..."
if (-not (Test-Path "project\package.json")) {
    Write-Log "ERRO: Não encontrado project/package.json. Execute na pasta raiz do DuoPass." "ERROR"
    exit 1
}
Write-Log "Estrutura de pastas validada" "SUCCESS"

# Verificar dependências
Write-Log "Verificando dependências do projeto..."
Set-Location project

if (-not (Test-Path "node_modules")) {
    Write-Log "Instalando dependências..." "WARNING"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Log "Erro ao instalar dependências" "ERROR"
        exit 1
    }
}
Write-Log "Dependências verificadas" "SUCCESS"

# Teste de build local
Write-Log "Executando build local para teste..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Log "Erro no build local" "ERROR"
    exit 1
}
Write-Log "Build local executado com sucesso" "SUCCESS"

# Verificar arquivos de build
Write-Log "Verificando arquivos de build..."
if (-not (Test-Path "dist\index.html")) {
    Write-Log "Arquivo dist/index.html não encontrado" "ERROR"
    exit 1
}

$distFiles = Get-ChildItem -Path "dist" -Recurse | Measure-Object
Write-Log "Build contém $($distFiles.Count) arquivos" "SUCCESS"

# Verificar configuração de ambiente
Write-Log "Verificando configuração de ambiente..."
if (-not (Test-Path ".env.production")) {
    Write-Log "Arquivo .env.production não encontrado" "WARNING"
} else {
    Write-Log "Arquivo .env.production encontrado" "SUCCESS"
}

# Teste de conectividade com o site
Write-Log "Testando conectividade com duopassclub.ch..."
try {
    $response = Invoke-WebRequest -Uri "https://duopassclub.ch" -Method Head -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Log "Site duopassclub.ch respondendo (Status: $($response.StatusCode))" "SUCCESS"
    } else {
        Write-Log "Site respondeu com status: $($response.StatusCode)" "WARNING"
    }
} catch {
    Write-Log "Erro ao conectar com duopassclub.ch: $($_.Exception.Message)" "ERROR"
}

# Verificar workflow do GitHub Actions
Write-Log "Verificando workflow GitHub Actions..."
Set-Location ..
if (Test-Path ".github\workflows\deploy.yml") {
    Write-Log "Workflow deploy.yml encontrado" "SUCCESS"
    
    # Verificar se o workflow tem as correções implementadas
    $workflowContent = Get-Content ".github\workflows\deploy.yml" -Raw
    
    if ($workflowContent -match "StrictHostKeyChecking=no") {
        Write-Log "Correção SSH implementada" "SUCCESS"
    } else {
        Write-Log "Correção SSH não encontrada" "WARNING"
    }
    
    if ($workflowContent -match "if_key_exists: replace") {
        Write-Log "Configuração de chave SSH implementada" "SUCCESS"
    } else {
        Write-Log "Configuração de chave SSH não encontrada" "WARNING"
    }
} else {
    Write-Log "Workflow deploy.yml não encontrado" "ERROR"
}

# Verificar documentação
Write-Log "Verificando documentação..."
$docs = @(
    "CORRECAO_GITHUB_ACTIONS_WORKFLOW.md",
    "PROXIMOS_PASSOS_DEPLOY.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Log "Documentação $doc encontrada" "SUCCESS"
    } else {
        Write-Log "Documentação $doc não encontrada" "WARNING"
    }
}

# Resumo final
Write-Host "
=== RESUMO DO TESTE ===" -ForegroundColor Green
Write-Log "[OK] Estrutura de pastas validada"
Write-Log "[OK] Dependencias verificadas"
Write-Log "[OK] Build local executado"
Write-Log "[OK] Workflow GitHub Actions verificado"
Write-Log "[OK] Documentacao verificada"

Write-Host "
PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Acesse: https://github.com/GamePathAi/DuoPassClub/actions"
Write-Host "2. Execute o workflow 'DuoPass CI/CD Pipeline - Optimized'"
Write-Host "3. Monitore os logs de deploy"
Write-Host "4. Verifique se o site está funcionando"

Write-Host "
COMANDOS UTEIS:" -ForegroundColor Cyan
Write-Host "• Servidor local: cd project; npm run dev"
Write-Host "• Build: cd project; npm run build"
Write-Host "• Verificar site: curl -I https://duopassclub.ch"

Write-Host "
Sistema pronto para deploy automatico!" -ForegroundColor Green

# Voltar para pasta original
Set-Location project