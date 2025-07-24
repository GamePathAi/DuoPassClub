# 🚀 Script de Configuração Automática do Deploy - DuoPass
# Este script configura todo o sistema de deploy automático

param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubRepo = "",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubUsername = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipGitHub = $false
)

Write-Host "🚀 CONFIGURAÇÃO AUTOMÁTICA DO DEPLOY DUOPASS" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Gray
Write-Host ""

# Verificar se está na pasta correta
if (-not (Test-Path "project\package.json")) {
    Write-Host "❌ ERRO: Execute este script na pasta raiz do DuoPass" -ForegroundColor Red
    Write-Host "   Pasta atual: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "   Esperado: pasta que contém 'project/package.json'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Pasta correta detectada" -ForegroundColor Green
Write-Host ""

# ETAPA 1: Verificar dependências
Write-Host "📋 ETAPA 1: Verificando dependências..." -ForegroundColor Cyan

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js não encontrado. Instale Node.js 18+" -ForegroundColor Red
    exit 1
}

# Verificar Git
try {
    $gitVersion = git --version
    Write-Host "   ✅ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Git não encontrado. Instale Git" -ForegroundColor Red
    exit 1
}

# Verificar se GitHub Actions está configurado
if (Test-Path ".github\workflows\deploy.yml") {
    Write-Host "   ✅ GitHub Actions configurado" -ForegroundColor Green
} else {
    Write-Host "   ❌ GitHub Actions não encontrado" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ETAPA 2: Instalar dependências do projeto
Write-Host "📦 ETAPA 2: Instalando dependências..." -ForegroundColor Cyan

Set-Location "project"

try {
    Write-Host "   Executando npm install..." -ForegroundColor Yellow
    npm install --silent
    Write-Host "   ✅ Dependências instaladas" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

Set-Location ".."
Write-Host ""

# ETAPA 3: Fazer build de teste
Write-Host "🔨 ETAPA 3: Testando build..." -ForegroundColor Cyan

Set-Location "project"

try {
    Write-Host "   Executando npm run build..." -ForegroundColor Yellow
    npm run build
    
    if (Test-Path "dist") {
        Write-Host "   ✅ Build realizado com sucesso" -ForegroundColor Green
        $distFiles = Get-ChildItem "dist" -Recurse | Measure-Object
        Write-Host "   📁 Arquivos gerados: $($distFiles.Count)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Pasta dist não foi criada" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ❌ Erro no build" -ForegroundColor Red
    exit 1
}

Set-Location ".."
Write-Host ""

# ETAPA 4: Configurar Git (se necessário)
Write-Host "🔧 ETAPA 4: Configurando Git..." -ForegroundColor Cyan

# Verificar se já é um repositório Git
if (-not (Test-Path ".git")) {
    Write-Host "   Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    Write-Host "   ✅ Repositório Git inicializado" -ForegroundColor Green
} else {
    Write-Host "   ✅ Repositório Git já existe" -ForegroundColor Green
}

# Verificar remote
$remoteUrl = git remote get-url origin 2>$null
if ($remoteUrl) {
    Write-Host "   ✅ Remote configurado: $remoteUrl" -ForegroundColor Green
} else {
    if (-not $SkipGitHub) {
        if (-not $GitHubRepo) {
            Write-Host "   ⚠️  Remote não configurado" -ForegroundColor Yellow
            Write-Host "   💡 Configure manualmente com:" -ForegroundColor Cyan
            Write-Host "      git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git" -ForegroundColor Gray
        } else {
            Write-Host "   Configurando remote..." -ForegroundColor Yellow
            git remote add origin $GitHubRepo
            Write-Host "   ✅ Remote configurado: $GitHubRepo" -ForegroundColor Green
        }
    }
}

Write-Host ""

# ETAPA 5: Verificar arquivos essenciais
Write-Host "📄 ETAPA 5: Verificando arquivos essenciais..." -ForegroundColor Cyan

$essentialFiles = @(
    "project\package.json",
    "project\vite.config.ts",
    "project\.env.production",
    ".github\workflows\deploy.yml",
    "nginx-unified.conf"
)

foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file (FALTANDO)" -ForegroundColor Red
    }
}

Write-Host ""

# ETAPA 6: Criar scripts auxiliares
Write-Host "🛠️  ETAPA 6: Criando scripts auxiliares..." -ForegroundColor Cyan

# Script de deploy rápido
$quickDeployScript = @'
#!/bin/bash
# deploy-rapido.sh - Deploy rápido para emergências

echo "🚀 Deploy rápido DuoPass..."

# Verificar se está na pasta correta
if [ ! -f "project/package.json" ]; then
    echo "❌ Execute na pasta raiz do DuoPass"
    exit 1
fi

# Build
echo "📦 Fazendo build..."
cd project
npm run build
cd ..

# Deploy manual
echo "🚀 Fazendo deploy..."
./upload-aws.ps1 -ServerIP "duopassclub.ch" -Username "ubuntu" -KeyPath "./dpkeyaws.pem"

echo "✅ Deploy concluído!"
'@

$quickDeployScript | Out-File -FilePath "deploy-rapido.sh" -Encoding UTF8
Write-Host "   ✅ deploy-rapido.sh criado" -ForegroundColor Green

# Script de verificação
$checkScript = @'
#!/bin/bash
# verificar-site.sh - Verificar se o site está funcionando

echo "🔍 Verificando DuoPass..."

# Testar conectividade
if curl -f -s -I https://duopassclub.ch | head -n 1 | grep -q "200 OK"; then
    echo "✅ Site online: https://duopassclub.ch"
else
    echo "❌ Site offline ou com problemas"
fi

# Verificar SSL
if curl -f -s -I https://duopassclub.ch | grep -q "HTTP/2 200"; then
    echo "✅ SSL/HTTP2 funcionando"
else
    echo "⚠️  Verificar configuração SSL"
fi

echo "📊 Verificação concluída"
'@

$checkScript | Out-File -FilePath "verificar-site.sh" -Encoding UTF8
Write-Host "   ✅ verificar-site.sh criado" -ForegroundColor Green

Write-Host ""

# ETAPA 7: Instruções finais
Write-Host "🎯 CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "=" * 30 -ForegroundColor Gray
Write-Host ""

Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. 🔑 Configurar Secrets no GitHub:" -ForegroundColor Yellow
Write-Host "   • Vá para: Settings > Secrets and variables > Actions" -ForegroundColor Gray
Write-Host "   • Adicione os secrets necessários (SSH_PRIVATE_KEY, SSH_HOST, etc.)" -ForegroundColor Gray
Write-Host ""

Write-Host "2. 🚀 Fazer primeiro deploy:" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Setup deploy automático'" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""

Write-Host "3. 📊 Monitorar deploy:" -ForegroundColor Yellow
Write-Host "   • GitHub Actions: https://github.com/SEU_USUARIO/SEU_REPO/actions" -ForegroundColor Gray
Write-Host "   • Site: https://duopassclub.ch" -ForegroundColor Gray
Write-Host ""

Write-Host "🛠️  COMANDOS ÚTEIS:" -ForegroundColor Cyan
Write-Host "   ./deploy-rapido.sh          # Deploy manual de emergência" -ForegroundColor Gray
Write-Host "   ./verificar-site.sh         # Verificar se site está online" -ForegroundColor Gray
Write-Host "   npm run build               # Build local (pasta project/)" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Sistema de deploy automático configurado e pronto!" -ForegroundColor Green
Write-Host "🎉 Faça um push para ativar o deploy automático!" -ForegroundColor Magenta