# Script PowerShell para Deploy Nginx - DuoPass
# Alternativa para Windows quando SSH nao esta disponivel

Write-Host "Deploy Nginx DuoPass - Versao Windows" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Blue
Write-Host ""

# Configuracoes
$SERVER_IP = "54.78.178.154"
$SSH_KEY = "C:\Users\igor_\Downloads\dpkeyaws.pem"
$SERVER_USER = "ubuntu"
$LOCAL_FILES = @(
    "nginx-unified.conf",
    "deploy-nginx-fix.sh",
    "check-nginx-status.sh"
)

# Funcao para log colorido
function Write-ColorLog {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" -ForegroundColor $Color
}

# Verificar se arquivos existem
Write-ColorLog "Verificando arquivos locais..." "Yellow"
foreach ($file in $LOCAL_FILES) {
    if (Test-Path $file) {
        Write-ColorLog "OK $file encontrado" "Green"
    } else {
        Write-ColorLog "ERRO $file nao encontrado" "Red"
        exit 1
    }
}

# Verificar conectividade
Write-ColorLog "Testando conectividade com o servidor..." "Yellow"
$ping = Test-NetConnection -ComputerName $SERVER_IP -Port 22 -WarningAction SilentlyContinue
if (-not $ping.TcpTestSucceeded) {
    Write-ColorLog "ERRO Nao foi possivel conectar ao servidor na porta 22" "Red"
    Write-ColorLog "Possiveis causas:" "Yellow"
    Write-ColorLog "  - Servidor desligado" "White"
    Write-ColorLog "  - Firewall bloqueando" "White"
    Write-ColorLog "  - IP incorreto" "White"
    Write-ColorLog "  - Problemas de rede" "White"
    Write-Host ""
    Write-ColorLog "Solucoes alternativas:" "Cyan"
    Write-ColorLog "1. Verificar se o servidor AWS esta ligado" "White"
    Write-ColorLog "2. Verificar Security Groups (porta 22 liberada)" "White"
    Write-ColorLog "3. Usar AWS Systems Manager Session Manager" "White"
    Write-ColorLog "4. Usar AWS CloudShell" "White"
    Write-ColorLog "5. Acessar via Console AWS EC2" "White"
    exit 1
}

Write-ColorLog "OK Servidor acessivel na porta 22" "Green"

# Tentar transferir arquivos
Write-ColorLog "Transferindo arquivos para o servidor..." "Yellow"

try {
    # Usar SCP para transferir arquivos
    foreach ($file in $LOCAL_FILES) {
        Write-ColorLog "Transferindo $file..." "White"
        $scpCommand = "scp -i `"$SSH_KEY`" -o StrictHostKeyChecking=no `"$file`" $SERVER_USER@${SERVER_IP}:/tmp/"
        
        $result = Invoke-Expression $scpCommand 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorLog "OK $file transferido com sucesso" "Green"
        } else {
            Write-ColorLog "ERRO ao transferir $file" "Red"
            Write-ColorLog "Erro: $result" "Red"
        }
    }
    
    # Executar comandos no servidor
    Write-ColorLog "Executando comandos no servidor..." "Yellow"
    
    $commands = @(
        "sudo cp /tmp/nginx-unified.conf /etc/nginx/sites-available/duopass",
        "sudo rm -f /etc/nginx/sites-enabled/duopass*",
        "sudo rm -f /etc/nginx/sites-enabled/default",
        "sudo ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/",
        "sudo nginx -t",
        "sudo systemctl reload nginx",
        "sudo systemctl status nginx --no-pager -l"
    )
    
    foreach ($cmd in $commands) {
        Write-ColorLog "Executando: $cmd" "White"
        $sshCommand = "ssh -i `"$SSH_KEY`" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP '$cmd'"
        
        $result = Invoke-Expression $sshCommand 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-ColorLog "OK Comando executado com sucesso" "Green"
            if ($result) {
                Write-Host $result -ForegroundColor Gray
            }
        } else {
            Write-ColorLog "ERRO ao executar comando" "Red"
            Write-ColorLog "Erro: $result" "Red"
        }
        Write-Host ""
    }
    
} catch {
    Write-ColorLog "ERRO durante a execucao: $($_.Exception.Message)" "Red"
    exit 1
}

# Testar URLs
Write-ColorLog "Testando URLs..." "Yellow"
$urls = @(
    "https://duopassclub.ch",
    "https://www.duopassclub.ch"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -ErrorAction Stop
        Write-ColorLog "OK $url - Status: $($response.StatusCode)" "Green"
    } catch {
        Write-ColorLog "ERRO $url - Erro: $($_.Exception.Message)" "Red"
    }
}

Write-Host ""
Write-ColorLog "Deploy concluido!" "Green"
Write-ColorLog "Verificacoes recomendadas:" "Cyan"
Write-ColorLog "1. Acessar https://duopassclub.ch" "White"
Write-ColorLog "2. Acessar https://www.duopassclub.ch" "White"
Write-ColorLog "3. Verificar se ambos mostram o mesmo conteudo" "White"
Write-ColorLog "4. Testar rotas: /experiencias, /ofertas, /memberships" "White"

Write-Host ""
Write-ColorLog "Se houver problemas:" "Yellow"
Write-ColorLog "1. Verificar logs: sudo tail -f /var/log/nginx/error.log" "White"
Write-ColorLog "2. Verificar configuracao: sudo nginx -t" "White"
Write-ColorLog "3. Reiniciar nginx: sudo systemctl restart nginx" "White"