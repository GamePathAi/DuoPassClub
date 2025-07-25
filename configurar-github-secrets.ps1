# 🔑 Configurador de Secrets do GitHub - DuoPass
# Script para ajudar na configuração dos secrets necessários

param(
    [Parameter(Mandatory=$false)]
    [string]$GitHubRepo = "",
    
    [Parameter(Mandatory=$false)]
    [string]$SSHKeyPath = "./dpkeyaws.pem",
    
    [Parameter(Mandatory=$false)]
    [string]$ServerHost = "duopassclub.ch",
    
    [Parameter(Mandatory=$false)]
    [string]$ServerUser = "ubuntu"
)

Write-Host "🔑 CONFIGURADOR DE SECRETS GITHUB - DUOPASS" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Gray
Write-Host ""

# Função para obter informações do repositório
function Get-GitHubRepoInfo {
    try {
        $remoteUrl = git remote get-url origin 2>$null
        if ($remoteUrl) {
            if ($remoteUrl -match "github.com[:/]([^/]+)/([^/.]+)") {
                $owner = $matches[1]
                $repo = $matches[2] -replace "\.git$", ""
                return @{
                    Owner = $owner
                    Repo = $repo
                    Url = "https://github.com/$owner/$repo"
                    SecretsUrl = "https://github.com/$owner/$repo/settings/secrets/actions"
                }
            }
        }
    } catch {
        Write-Host "⚠️  Não foi possível obter informações do repositório" -ForegroundColor Yellow
    }
    return $null
}

# Função para ler chave SSH
function Get-SSHKeyContent {
    param([string]$KeyPath)
    
    if (Test-Path $KeyPath) {
        try {
            $keyContent = Get-Content $KeyPath -Raw
            return $keyContent.Trim()
        } catch {
            Write-Host "❌ Erro ao ler chave SSH: $($_.Exception.Message)" -ForegroundColor Red
            return $null
        }
    } else {
        Write-Host "❌ Chave SSH não encontrada: $KeyPath" -ForegroundColor Red
        return $null
    }
}

# Função para obter SSH known hosts
function Get-SSHKnownHosts {
    param([string]$Host)
    
    try {
        Write-Host "🔍 Obtendo SSH known hosts para $Host..." -ForegroundColor Yellow
        $knownHosts = ssh-keyscan -H $Host 2>$null
        if ($knownHosts) {
            return $knownHosts
        } else {
            Write-Host "⚠️  Não foi possível obter known hosts automaticamente" -ForegroundColor Yellow
            return $null
        }
    } catch {
        Write-Host "⚠️  Erro ao obter known hosts: $($_.Exception.Message)" -ForegroundColor Yellow
        return $null
    }
}

# Função para testar conectividade SSH
function Test-SSHConnection {
    param([string]$KeyPath, [string]$User, [string]$Host)
    
    try {
        Write-Host "🔌 Testando conexão SSH..." -ForegroundColor Yellow
        $testResult = ssh -i $KeyPath -o ConnectTimeout=10 -o StrictHostKeyChecking=no $User@$Host "echo 'SSH OK'" 2>$null
        
        if ($testResult -eq "SSH OK") {
            Write-Host "   ✅ Conexão SSH funcionando" -ForegroundColor Green
            return $true
        } else {
            Write-Host "   ❌ Conexão SSH falhou" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "   ❌ Erro na conexão SSH: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# EXECUÇÃO PRINCIPAL
Write-Host "📋 Coletando informações necessárias..." -ForegroundColor Cyan
Write-Host ""

# 1. Informações do repositório
$repoInfo = Get-GitHubRepoInfo
if ($repoInfo) {
    Write-Host "✅ Repositório detectado:" -ForegroundColor Green
    Write-Host "   Owner: $($repoInfo.Owner)" -ForegroundColor Gray
    Write-Host "   Repo: $($repoInfo.Repo)" -ForegroundColor Gray
    Write-Host "   URL: $($repoInfo.Url)" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "❌ Repositório GitHub não configurado" -ForegroundColor Red
    Write-Host "   Configure com: git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git" -ForegroundColor Yellow
    Write-Host ""
}

# 2. Verificar chave SSH
Write-Host "🔑 Verificando chave SSH..." -ForegroundColor Cyan
$sshKey = Get-SSHKeyContent -KeyPath $SSHKeyPath
if ($sshKey) {
    Write-Host "   ✅ Chave SSH encontrada: $SSHKeyPath" -ForegroundColor Green
    Write-Host "   📏 Tamanho: $($sshKey.Length) caracteres" -ForegroundColor Gray
    
    # Testar conexão
    Test-SSHConnection -KeyPath $SSHKeyPath -User $ServerUser -Host $ServerHost | Out-Null
} else {
    Write-Host "   ❌ Chave SSH não encontrada ou inválida" -ForegroundColor Red
}
Write-Host ""

# 3. Obter known hosts
Write-Host "🌐 Obtendo SSH known hosts..." -ForegroundColor Cyan
$knownHosts = Get-SSHKnownHosts -Host $ServerHost
if ($knownHosts) {
    Write-Host "   ✅ Known hosts obtidos" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Known hosts não obtidos automaticamente" -ForegroundColor Yellow
}
Write-Host ""

# 4. Gerar instruções
Write-Host "📝 INSTRUÇÕES PARA CONFIGURAR SECRETS" -ForegroundColor Magenta
Write-Host "=" * 40 -ForegroundColor Gray
Write-Host ""

if ($repoInfo) {
    Write-Host "🔗 1. Acesse a página de secrets:" -ForegroundColor Yellow
    Write-Host "   $($repoInfo.SecretsUrl)" -ForegroundColor Blue
    Write-Host ""
    
    # Tentar abrir no navegador
    try {
        Write-Host "🌐 Abrindo página de secrets no navegador..." -ForegroundColor Green
        Start-Process $repoInfo.SecretsUrl
    } catch {
        Write-Host "   💡 Copie e cole o link acima no navegador" -ForegroundColor Cyan
    }
    Write-Host ""
}

Write-Host "⚙️ 2. Adicione os seguintes secrets:" -ForegroundColor Yellow
Write-Host ""

# SSH_PRIVATE_KEY
Write-Host "🔑 SSH_PRIVATE_KEY" -ForegroundColor Cyan
Write-Host "   Nome: SSH_PRIVATE_KEY" -ForegroundColor Gray
if ($sshKey) {
    Write-Host "   Valor: [Chave encontrada - copie do arquivo $SSHKeyPath]" -ForegroundColor Green
    
    # Salvar em arquivo temporário para facilitar cópia
    $tempKeyFile = "ssh-private-key-temp.txt"
    $sshKey | Out-File -FilePath $tempKeyFile -Encoding UTF8 -NoNewline
    Write-Host "   📄 Salvo temporariamente em: $tempKeyFile" -ForegroundColor Blue
} else {
    Write-Host "   Valor: [CHAVE SSH NÃO ENCONTRADA]" -ForegroundColor Red
}
Write-Host ""

# SSH_HOST
Write-Host "🌐 SSH_HOST" -ForegroundColor Cyan
Write-Host "   Nome: SSH_HOST" -ForegroundColor Gray
Write-Host "   Valor: $ServerHost" -ForegroundColor Green
Write-Host ""

# SSH_USER
Write-Host "👤 SSH_USER" -ForegroundColor Cyan
Write-Host "   Nome: SSH_USER" -ForegroundColor Gray
Write-Host "   Valor: $ServerUser" -ForegroundColor Green
Write-Host ""

# SSH_KNOWN_HOSTS
Write-Host "🔐 SSH_KNOWN_HOSTS" -ForegroundColor Cyan
Write-Host "   Nome: SSH_KNOWN_HOSTS" -ForegroundColor Gray
if ($knownHosts) {
    Write-Host "   Valor: [Known hosts obtidos automaticamente]" -ForegroundColor Green
    
    # Salvar em arquivo temporário
    $tempKnownHostsFile = "ssh-known-hosts-temp.txt"
    $knownHosts | Out-File -FilePath $tempKnownHostsFile -Encoding UTF8
    Write-Host "   📄 Salvo temporariamente em: $tempKnownHostsFile" -ForegroundColor Blue
else {
    Write-Host "   Valor: [Execute: ssh-keyscan $ServerHost]" -ForegroundColor Yellow
}
Write-Host ""

# 5. Instruções de uso
Write-Host "🚀 3. Após configurar os secrets:" -ForegroundColor Yellow
Write-Host "   • Faça um commit e push" -ForegroundColor Gray
Write-Host "   • GitHub Actions será executado automaticamente" -ForegroundColor Gray
Write-Host "   • Monitore em: $($repoInfo.Url)/actions" -ForegroundColor Gray
Write-Host ""

# 6. Comandos para testar
Write-Host "🧪 4. Comandos para testar:" -ForegroundColor Yellow
Write-Host "   # Deploy automático" -ForegroundColor Gray
Write-Host "   .\deploy-automatico-completo.ps1 -Modo auto -Mensagem 'Teste deploy'" -ForegroundColor Blue
Write-Host ""
Write-Host "   # Verificar site" -ForegroundColor Gray
Write-Host "   .\deploy-automatico-completo.ps1 -Modo verificar" -ForegroundColor Blue
Write-Host ""

# 7. Arquivos temporários criados
Write-Host "📁 ARQUIVOS TEMPORÁRIOS CRIADOS:" -ForegroundColor Magenta
if (Test-Path "ssh-private-key-temp.txt") {
    Write-Host "   📄 ssh-private-key-temp.txt - Copie o conteúdo para SSH_PRIVATE_KEY" -ForegroundColor Blue
}
if (Test-Path "ssh-known-hosts-temp.txt") {
    Write-Host "   📄 ssh-known-hosts-temp.txt - Copie o conteúdo para SSH_KNOWN_HOSTS" -ForegroundColor Blue
}
Write-Host "   ⚠️  Exclua estes arquivos após configurar os secrets" -ForegroundColor Yellow
Write-Host ""

# 8. Script de limpeza
Write-Host "🧹 Para limpar arquivos temporários:" -ForegroundColor Yellow
Write-Host "   Remove-Item ssh-*-temp.txt -Force" -ForegroundColor Gray
Write-Host ""

# 9. Resumo final
Write-Host "✅ RESUMO DA CONFIGURAÇÃO" -ForegroundColor Green
Write-Host "=" * 30 -ForegroundColor Gray
if ($repoInfo) {
    Write-Host "✅ Repositório: $($repoInfo.Url)" -ForegroundColor Green
} else {
    Write-Host "❌ Repositório: Não configurado" -ForegroundColor Red
}

if ($sshKey) {
    Write-Host "✅ SSH Key: Encontrada" -ForegroundColor Green
} else {
    Write-Host "❌ SSH Key: Não encontrada" -ForegroundColor Red
}

if ($knownHosts) {
    Write-Host "✅ Known Hosts: Obtidos" -ForegroundColor Green
} else {
    Write-Host "⚠️  Known Hosts: Obter manualmente" -ForegroundColor Yellow
}

Write-Host "✅ Servidor: $ServerUser@$ServerHost" -ForegroundColor Green
Write-Host ""

Write-Host "🎯 PRÓXIMO PASSO: Configure os secrets no GitHub e faça um push!" -ForegroundColor Magenta