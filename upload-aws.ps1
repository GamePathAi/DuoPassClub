# Script de Upload Direto para AWS - DuoPass
# Execute este script após configurar suas credenciais SSH

param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [string]$KeyPath = "~/.ssh/id_rsa"
)

Write-Host "=== UPLOAD DUOPASS PARA AWS ===" -ForegroundColor Green
Write-Host ""

# Verificar se o build existe
if (-not (Test-Path "project\dist")) {
    Write-Host "ERRO: Build não encontrado. Execute 'npm run build' primeiro." -ForegroundColor Red
    exit 1
}

# Criar arquivo ZIP do build
Write-Host "1. Criando arquivo ZIP do build..." -ForegroundColor Yellow
$zipPath = "duopass-build-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
Compress-Archive -Path "project\dist\*" -DestinationPath $zipPath -Force
Write-Host "   ZIP criado: $zipPath" -ForegroundColor Green

# Comandos para executar no servidor
$deployCommands = @"
# Fazer backup da versão atual
sudo mkdir -p /var/www/duopass/backup/`$(date +%Y%m%d_%H%M%S)
sudo cp -r /var/www/duopass/dist/* /var/www/duopass/backup/`$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# Limpar diretório atual
sudo rm -rf /var/www/duopass/dist/*

# Extrair novo build
sudo unzip -o /tmp/$zipPath -d /var/www/duopass/dist/

# Ajustar permissões
sudo chown -R www-data:www-data /var/www/duopass/dist
sudo chmod -R 755 /var/www/duopass/dist

# Recarregar nginx
sudo systemctl reload nginx

# Verificar status
echo "Deploy concluído!"
echo "Verificando site..."
curl -I https://duopassclub.ch || echo "Site pode demorar alguns segundos para atualizar"
"@

Write-Host "2. Instruções para upload manual:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Execute os seguintes comandos no seu terminal:" -ForegroundColor Cyan
Write-Host ""
Write-Host "# 1. Upload do arquivo ZIP" -ForegroundColor White
Write-Host "scp -i $KeyPath $zipPath $Username@$ServerIP:/tmp/" -ForegroundColor Gray
Write-Host ""
Write-Host "# 2. Conectar ao servidor e executar deploy" -ForegroundColor White
Write-Host "ssh -i $KeyPath $Username@$ServerIP" -ForegroundColor Gray
Write-Host ""
Write-Host "# 3. No servidor, execute:" -ForegroundColor White
Write-Host $deployCommands -ForegroundColor Gray
Write-Host ""

# Salvar comandos em arquivo
$commandsFile = "deploy-commands.sh"
$deployCommands | Out-File -FilePath $commandsFile -Encoding UTF8
Write-Host "3. Comandos salvos em: $commandsFile" -ForegroundColor Green
Write-Host ""

Write-Host "=== ARQUIVOS PRONTOS ===" -ForegroundColor Green
Write-Host "📦 Build ZIP: $zipPath" -ForegroundColor White
Write-Host "📜 Comandos: $commandsFile" -ForegroundColor White
Write-Host "🔧 Nginx: nginx-unified.conf" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Execute os comandos acima para fazer o deploy!" -ForegroundColor Cyan

Write-Host ""
Write-Host "=== EXEMPLO DE USO ===" -ForegroundColor Yellow
Write-Host "./upload-aws.ps1 -ServerIP '18.203.255.123' -Username 'ubuntu'" -ForegroundColor Gray
Write-Host "./upload-aws.ps1 -ServerIP 'duopassclub.ch' -Username 'ec2-user' -KeyPath 'C:\path\to\key.pem'" -ForegroundColor Gray