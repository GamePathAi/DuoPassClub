# Deploy Automatico Completo - DuoPass
# Script all-in-one para deploy do projeto local para AWS

param(
    [Parameter(Mandatory=$false)]
    [string]$Modo = "auto",  # auto, manual, verificar
    
    [Parameter(Mandatory=$false)]
    [string]$Mensagem = "Deploy automatico",
    
    [Parameter(Mandatory=$false)]
    [switch]$ForcarBuild = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipTests = $false
)

Write-Host "DEPLOY AUTOMATICO DUOPASS" -ForegroundColor Green
Write-Host "Modo: $Modo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Gray
Write-Host ""

# Funcao para verificar pre-requisitos
function Test-Prerequisites {
    Write-Host "Verificando pre-requisitos..." -ForegroundColor Cyan
    
    # Verificar pasta correta
    if (-not (Test-Path "project\package.json")) {
        Write-Host "Execute na pasta raiz do DuoPass" -ForegroundColor Red
        return $false
    }
    
    # Verificar se esta na pasta project
    $currentPath = Get-Location
    if ($currentPath.Path.EndsWith("\project")) {
        Write-Host "Voce esta na pasta project. Mudando para pasta raiz..." -ForegroundColor Yellow
        Set-Location ".."
    }
    
    # Verificar Node.js
    try {
        $nodeVersion = node --version
        Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "   Node.js nao encontrado" -ForegroundColor Red
        return $false
    }
    
    # Verificar Git
    try {
        $gitStatus = git status --porcelain 2>$null
        Write-Host "   Git configurado" -ForegroundColor Green
    } catch {
        Write-Host "   Git nao configurado" -ForegroundColor Red
        return $false
    }
    
    # Verificar remote
    try {
        $remote = git remote get-url origin 2>$null
        if ($remote) {
            Write-Host "   Remote: $remote" -ForegroundColor Green
        } else {
            Write-Host "   Remote nao configurado" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   Remote nao configurado" -ForegroundColor Yellow
    }
    
    return $true
}

# Funcao para fazer build
function Invoke-Build {
    Write-Host "Fazendo build do projeto..." -ForegroundColor Cyan
    
    Set-Location "project"
    
    try {
        # Verificar se precisa instalar dependencias
        if (-not (Test-Path "node_modules") -or $ForcarBuild) {
            Write-Host "   Instalando dependencias..." -ForegroundColor Yellow
            npm install
        }
        
        # Fazer build
        Write-Host "   Executando build..." -ForegroundColor Yellow
        npm run build
        
        # Verificar se build foi criado
        if (Test-Path "dist") {
            $distSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
            $distSizeMB = [math]::Round($distSize / 1MB, 2)
            Write-Host "   Build concluido ($distSizeMB MB)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "   Build falhou - pasta dist nao criada" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "   Erro no build: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    } finally {
        Set-Location ".."
    }
}

# Funcao para fazer commit e push
function Invoke-GitDeploy {
    param([string]$CommitMessage)
    
    Write-Host "Fazendo deploy via Git..." -ForegroundColor Cyan
    
    try {
        # Verificar se ha mudancas
        $changes = git status --porcelain
        if (-not $changes) {
            Write-Host "   Nenhuma mudanca detectada" -ForegroundColor Blue
            return $true
        }
        
        # Adicionar arquivos
        Write-Host "   Adicionando arquivos..." -ForegroundColor Yellow
        git add .
        
        # Commit
        Write-Host "   Fazendo commit..." -ForegroundColor Yellow
        git commit -m $CommitMessage
        
        # Push
        Write-Host "   Fazendo push..." -ForegroundColor Yellow
        git push
        
        Write-Host "   Deploy via Git concluido" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "   Erro no Git: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Funcao para deploy manual
function Invoke-ManualDeploy {
    Write-Host "Fazendo deploy manual..." -ForegroundColor Cyan
    
    if (Test-Path "upload-aws.ps1") {
        try {
            Write-Host "   Executando upload-aws.ps1..." -ForegroundColor Yellow
            & .\upload-aws.ps1 -ServerIP "duopassclub.ch" -Username "ubuntu" -KeyPath "./dpkeyaws.pem"
            Write-Host "   Deploy manual concluido" -ForegroundColor Green
            return $true
        } catch {
            Write-Host "   Erro no deploy manual: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "   Script upload-aws.ps1 nao encontrado" -ForegroundColor Red
        return $false
    }
}

# Funcao para verificar site
function Test-Website {
    Write-Host "Verificando site..." -ForegroundColor Cyan
    
    try {
        # Testar conectividade basica
        $response = Invoke-WebRequest -Uri "https://duopassclub.ch" -Method Head -TimeoutSec 30 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "   Site online (Status: $($response.StatusCode))" -ForegroundColor Green
            
            # Verificar headers importantes
            if ($response.Headers.ContainsKey("Content-Security-Policy")) {
                Write-Host "   CSP configurado" -ForegroundColor Green
            }
            
            if ($response.Headers.ContainsKey("Strict-Transport-Security")) {
                Write-Host "   HSTS ativo" -ForegroundColor Green
            }
            
            return $true
        } else {
            Write-Host "   Site respondeu com status: $($response.StatusCode)" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "   Site offline ou com problemas: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Funcao para monitorar GitHub Actions
function Watch-GitHubActions {
    Write-Host "Monitorando GitHub Actions..." -ForegroundColor Cyan
    
    try {
        $remote = git remote get-url origin
        if ($remote -match "github.com[:/]([^/]+)/([^/.]+)") {
            $owner = $matches[1]
            $repo = $matches[2] -replace "\.git$", ""
            $actionsUrl = "https://github.com/$owner/$repo/actions"
            
            Write-Host "   GitHub Actions: $actionsUrl" -ForegroundColor Blue
            Write-Host "   Abra o link acima para acompanhar o deploy" -ForegroundColor Yellow
            
            # Tentar abrir no navegador
            try {
                Start-Process $actionsUrl
                Write-Host "   Abrindo GitHub Actions no navegador..." -ForegroundColor Green
            } catch {
                Write-Host "   Copie e cole o link no navegador" -ForegroundColor Blue
            }
        }
    } catch {
        Write-Host "   Nao foi possivel determinar URL do GitHub Actions" -ForegroundColor Yellow
    }
}

# EXECUCAO PRINCIPAL
if (-not (Test-Prerequisites)) {
    Write-Host "Pre-requisitos nao atendidos. Abortando." -ForegroundColor Red
    exit 1
}

Write-Host ""

switch ($Modo.ToLower()) {
    "auto" {
        Write-Host "MODO AUTOMATICO" -ForegroundColor Magenta
        Write-Host ""
        
        # 1. Build
        if (-not (Invoke-Build)) {
            Write-Host "Build falhou. Abortando." -ForegroundColor Red
            exit 1
        }
        
        # 2. Git Deploy
        if (-not (Invoke-GitDeploy -CommitMessage $Mensagem)) {
            Write-Host "Deploy via Git falhou. Tentando deploy manual..." -ForegroundColor Red
            
            if (-not (Invoke-ManualDeploy)) {
                Write-Host "Deploy manual tambem falhou. Abortando." -ForegroundColor Red
                exit 1
            }
        } else {
            # Monitorar GitHub Actions
            Watch-GitHubActions
        }
        
        # 3. Aguardar e verificar
        Write-Host "Aguardando deploy (30 segundos)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        Test-Website | Out-Null
    }
    
    "manual" {
        Write-Host "MODO MANUAL" -ForegroundColor Magenta
        Write-Host ""
        
        # 1. Build
        if (-not (Invoke-Build)) {
            Write-Host "Build falhou. Abortando." -ForegroundColor Red
            exit 1
        }
        
        # 2. Deploy manual
        if (-not (Invoke-ManualDeploy)) {
            Write-Host "Deploy manual falhou. Abortando." -ForegroundColor Red
            exit 1
        }
        
        # 3. Verificar
        Start-Sleep -Seconds 10
        Test-Website | Out-Null
    }
    
    "verificar" {
        Write-Host "MODO VERIFICACAO" -ForegroundColor Magenta
        Write-Host ""
        
        Test-Website | Out-Null
        Watch-GitHubActions
    }
    
    default {
        Write-Host "Modo invalido: $Modo" -ForegroundColor Red
        Write-Host "Modos disponiveis: auto, manual, verificar" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "DEPLOY CONCLUIDO!" -ForegroundColor Green
Write-Host "Site: https://duopassclub.ch" -ForegroundColor Cyan
Write-Host ""

# Instrucoes finais
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "   • Verificar site: https://duopassclub.ch" -ForegroundColor Gray
Write-Host "   • Monitorar GitHub Actions (se aplicavel)" -ForegroundColor Gray
Write-Host "   • Testar funcionalidades principais" -ForegroundColor Gray
Write-Host ""

Write-Host "COMANDOS UTEIS:" -ForegroundColor Yellow
Write-Host "   .\deploy-automatico-completo.ps1 -Modo auto" -ForegroundColor Gray
Write-Host "   .\deploy-automatico-completo.ps1 -Modo manual" -ForegroundColor Gray
Write-Host "   .\deploy-automatico-completo.ps1 -Modo verificar" -ForegroundColor Gray