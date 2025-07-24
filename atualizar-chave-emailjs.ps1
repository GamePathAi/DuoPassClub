# Script PowerShell para atualizar a chave publica do EmailJS
# Execute com: .\atualizar-chave-emailjs.ps1

# Configurar codificacao UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Funcao para exibir mensagens coloridas
function Write-ColorOutput {
    param(
        [string]$ForegroundColor,
        [string]$Message
    )
    
    $originalColor = $host.UI.RawUI.ForegroundColor
    
    switch ($ForegroundColor) {
        "Red" { $host.UI.RawUI.ForegroundColor = "Red" }
        "Green" { $host.UI.RawUI.ForegroundColor = "Green" }
        "Yellow" { $host.UI.RawUI.ForegroundColor = "Yellow" }
        "Cyan" { $host.UI.RawUI.ForegroundColor = "Cyan" }
        "White" { $host.UI.RawUI.ForegroundColor = "White" }
        default { $host.UI.RawUI.ForegroundColor = "White" }
    }
    
    Write-Host $Message
    $host.UI.RawUI.ForegroundColor = $originalColor
}

# Cabecalho
Write-ColorOutput "Green" ""
Write-ColorOutput "Green" "ATUALIZADOR DE CHAVE PUBLICA EMAILJS"
Write-ColorOutput "Green" "====================================="
Write-ColorOutput "Green" ""

# Verificar se o arquivo .env.production existe
$envFile = ".env.production"
if (!(Test-Path $envFile)) {
    Write-ColorOutput "Red" "ERRO: Arquivo $envFile nao encontrado!"
    exit 1
}

Write-ColorOutput "Cyan" "Arquivo $envFile encontrado."

# Ler o conteudo atual do arquivo
$envContent = Get-Content $envFile -Raw

# Solicitar a nova chave publica
Write-ColorOutput "Yellow" ""
Write-ColorOutput "Yellow" "Digite a nova chave publica do EmailJS:"
Write-ColorOutput "Yellow" "(Obtenha em: https://dashboard.emailjs.com/admin/account > API Keys)"
Write-ColorOutput "Cyan" ""
Write-Host "Chave publica: " -NoNewline -ForegroundColor Cyan
$newPublicKey = Read-Host

# Validar a entrada
if ([string]::IsNullOrWhiteSpace($newPublicKey)) {
    Write-ColorOutput "Red" ""
    Write-ColorOutput "Red" "ERRO: Chave publica nao pode ser vazia!"
    exit 1
}

# Fazer backup do arquivo original
$backupFile = "$envFile.backup"
Copy-Item $envFile $backupFile
Write-ColorOutput "Green" ""
Write-ColorOutput "Green" "Backup criado: $backupFile"

# Atualizar a chave publica no arquivo
$pattern = "VITE_EMAILJS_PUBLIC_KEY=.*"
$replacement = "VITE_EMAILJS_PUBLIC_KEY=$newPublicKey"

$newContent = $envContent -replace $pattern, $replacement

# Salvar o arquivo atualizado
Set-Content -Path $envFile -Value $newContent

Write-ColorOutput "Green" ""
Write-ColorOutput "Green" "Chave publica atualizada com sucesso!"

# Instrucoes finais
Write-ColorOutput "Yellow" ""
Write-ColorOutput "Yellow" "PROXIMOS PASSOS:"
Write-ColorOutput "Cyan" "1. Reinicie o servidor de desenvolvimento:"
Write-ColorOutput "White" "   npm run dev"
Write-ColorOutput "Cyan" "2. Teste o envio de emails usando o formulario de contato"
Write-ColorOutput "Cyan" "3. Verifique se nao ha erros no console do navegador"

Write-ColorOutput "Green" ""
Write-ColorOutput "Green" "Configuracao concluida!"
Write-ColorOutput "Green" ""