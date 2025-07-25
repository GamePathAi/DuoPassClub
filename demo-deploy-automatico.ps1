# Demonstracao do Sistema de Deploy Automatico - DuoPass
# Script de demonstracao completa do sistema

param(
    [Parameter(Mandatory=$false)]
    [switch]$Executar = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$SomenteVerificar = $false
)

Write-Host "DEMONSTRACAO - DEPLOY AUTOMATICO DUOPASS" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Gray
Write-Host ""

if (-not $Executar -and -not $SomenteVerificar) {
    Write-Host "ESTE E UM SCRIPT DE DEMONSTRACAO" -ForegroundColor Cyan
    Write-Host "   Mostra como usar o sistema de deploy automatico" -ForegroundColor Gray
    Write-Host "   Use -Executar para executar de verdade" -ForegroundColor Gray
    Write-Host "   Use -SomenteVerificar para apenas verificar" -ForegroundColor Gray
    Write-Host ""
}

# Funcao para simular ou executar comando
function Invoke-DemoCommand {
    param(
        [string]$Comando,
        [string]$Descricao,
        [switch]$Executar
    )
    
    Write-Host "$Descricao" -ForegroundColor Yellow
    Write-Host "   Comando: $Comando" -ForegroundColor Gray
    
    if ($Executar) {
        try {
            Write-Host "   Executando..." -ForegroundColor Blue
            Invoke-Expression $Comando
            Write-Host "   Concluido" -ForegroundColor Green
        } catch {
            Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "   (Simulacao - use -Executar para executar)" -ForegroundColor Cyan
    }
    Write-Host ""
}

# DEMONSTRACAO COMPLETA
Write-Host "CENARIO: DESENVOLVEDOR FAZENDO DEPLOY" -ForegroundColor Magenta
Write-Host ""

# 1. Verificacao inicial
Write-Host "ETAPA 1: Verificacao do ambiente" -ForegroundColor Cyan
Write-Host ""

Invoke-DemoCommand -Comando "Get-Location" -Descricao "Verificar pasta atual" -Executar:$Executar
Invoke-DemoCommand -Comando "Test-Path 'project\package.json'" -Descricao "Verificar estrutura do projeto" -Executar:$Executar
Invoke-DemoCommand -Comando "git status" -Descricao "Verificar status do Git" -Executar:$Executar

# 2. Desenvolvimento local
Write-Host "ETAPA 2: Desenvolvimento local" -ForegroundColor Cyan
Write-Host ""

Write-Host "Simulando desenvolvimento..." -ForegroundColor Yellow
Write-Host "   1. cd project" -ForegroundColor Gray
Write-Host "   2. npm run dev (http://localhost:5175)" -ForegroundColor Gray
Write-Host "   3. Fazer alteracoes no codigo..." -ForegroundColor Gray
Write-Host "   4. Testar localmente..." -ForegroundColor Gray
Write-Host "   5. cd .. (voltar para raiz)" -ForegroundColor Gray
Write-Host ""

# 3. Build e teste
Write-Host "ETAPA 3: Build e teste" -ForegroundColor Cyan
Write-Host ""

if ($SomenteVerificar) {
    Invoke-DemoCommand -Comando ".\deploy-automatico-completo.ps1 -Modo verificar" -Descricao "Verificar status atual" -Executar:$true
} else {
    Invoke-DemoCommand -Comando "cd project; npm run build" -Descricao "Build do projeto" -Executar:$Executar
    Invoke-DemoCommand -Comando "cd project; npm run preview" -Descricao "Preview local (http://localhost:4173)" -Executar:$false
}

# 4. Deploy automatico
Write-Host "ETAPA 4: Deploy automatico" -ForegroundColor Cyan
Write-Host ""

if (-not $SomenteVerificar) {
    Invoke-DemoCommand -Comando ".\deploy-automatico-completo.ps1 -Modo auto -Mensagem 'Demo deploy automatico'" -Descricao "Deploy automatico completo" -Executar:$Executar
}

# 5. Monitoramento
Write-Host "ETAPA 5: Monitoramento" -ForegroundColor Cyan
Write-Host ""

Invoke-DemoCommand -Comando ".\deploy-automatico-completo.ps1 -Modo verificar" -Descricao "Verificar status do site" -Executar:$Executar

# 6. Cenarios alternativos
Write-Host "ETAPA 6: Cenarios alternativos" -ForegroundColor Cyan
Write-Host ""

Write-Host "Deploy manual (se GitHub Actions falhar):" -ForegroundColor Yellow
Write-Host "   .\deploy-automatico-completo.ps1 -Modo manual" -ForegroundColor Gray
Write-Host ""

Write-Host "Deploy de emergencia:" -ForegroundColor Yellow
Write-Host "   .\upload-aws.ps1 -ServerIP 'duopassclub.ch' -Username 'ubuntu'" -ForegroundColor Gray
Write-Host ""

Write-Host "Debugging no servidor:" -ForegroundColor Yellow
Write-Host "   ssh -i dpkeyaws.pem ubuntu@duopassclub.ch" -ForegroundColor Gray
Write-Host "   sudo tail -f /var/log/nginx/error.log" -ForegroundColor Gray
Write-Host ""

# 7. Resultados esperados
Write-Host "RESULTADOS ESPERADOS" -ForegroundColor Green
Write-Host "=" * 25 -ForegroundColor Gray
Write-Host ""

Write-Host "Site online: https://duopassclub.ch" -ForegroundColor Green
Write-Host "SSL ativo e funcionando" -ForegroundColor Green
Write-Host "GitHub Actions executando automaticamente" -ForegroundColor Green
Write-Host "Monitoramento ativo" -ForegroundColor Green
Write-Host "Backup manual disponivel" -ForegroundColor Green
Write-Host ""

# 8. Comandos mais usados
Write-Host "COMANDOS MAIS USADOS NO DIA A DIA" -ForegroundColor Magenta
Write-Host "=" * 35 -ForegroundColor Gray
Write-Host ""

Write-Host "1. Deploy normal:" -ForegroundColor Cyan
Write-Host "   .\deploy-automatico-completo.ps1 -Modo auto -Mensagem 'Suas alteracoes'" -ForegroundColor Blue
Write-Host ""

Write-Host "2. Verificar site:" -ForegroundColor Cyan
Write-Host "   .\deploy-automatico-completo.ps1 -Modo verificar" -ForegroundColor Blue
Write-Host ""

Write-Host "3. Desenvolvimento local:" -ForegroundColor Cyan
Write-Host "   cd project; npm run dev" -ForegroundColor Blue
Write-Host ""

Write-Host "4. Deploy manual (emergencia):" -ForegroundColor Cyan
Write-Host "   .\deploy-automatico-completo.ps1 -Modo manual" -ForegroundColor Blue
Write-Host ""

Write-Host "5. Configuracao inicial:" -ForegroundColor Cyan
Write-Host "   .\setup-deploy-automatico.ps1" -ForegroundColor Blue
Write-Host "   .\configurar-github-secrets.ps1" -ForegroundColor Blue
Write-Host ""

# 9. Fluxo completo
Write-Host "FLUXO COMPLETO DE TRABALHO" -ForegroundColor Magenta
Write-Host "=" * 30 -ForegroundColor Gray
Write-Host ""

Write-Host "Rotina diaria:" -ForegroundColor Yellow
Write-Host "   1. cd project" -ForegroundColor Gray
Write-Host "   2. npm run dev" -ForegroundColor Gray
Write-Host "   3. [Fazer alteracoes no codigo]" -ForegroundColor Gray
Write-Host "   4. [Testar localmente]" -ForegroundColor Gray
Write-Host "   5. cd .." -ForegroundColor Gray
Write-Host "   6. .\deploy-automatico-completo.ps1 -Modo auto -Mensagem 'Descricao'" -ForegroundColor Gray
Write-Host "   7. [Monitorar GitHub Actions]" -ForegroundColor Gray
Write-Host "   8. [Verificar site em producao]" -ForegroundColor Gray
Write-Host ""

# 10. Troubleshooting
Write-Host "TROUBLESHOOTING RAPIDO" -ForegroundColor Red
Write-Host "=" * 25 -ForegroundColor Gray
Write-Host ""

Write-Host "Build falha:" -ForegroundColor Red
Write-Host "   cd project; Remove-Item node_modules -Recurse -Force; npm install" -ForegroundColor Gray
Write-Host ""

Write-Host "GitHub Actions falha:" -ForegroundColor Red
Write-Host "   .\deploy-automatico-completo.ps1 -Modo manual" -ForegroundColor Gray
Write-Host ""

Write-Host "Site offline:" -ForegroundColor Red
Write-Host "   ssh -i dpkeyaws.pem ubuntu@duopassclub.ch" -ForegroundColor Gray
Write-Host "   sudo systemctl status nginx; sudo systemctl reload nginx" -ForegroundColor Gray
Write-Host ""

# 11. Arquivos importantes
Write-Host "ARQUIVOS IMPORTANTES" -ForegroundColor Magenta
Write-Host "=" * 20 -ForegroundColor Gray
Write-Host ""

$arquivosImportantes = @(
    @{Nome=".github/workflows/deploy.yml"; Desc="Configuracao GitHub Actions"},
    @{Nome="deploy-automatico-completo.ps1"; Desc="Script principal de deploy"},
    @{Nome="setup-deploy-automatico.ps1"; Desc="Configuracao inicial"},
    @{Nome="configurar-github-secrets.ps1"; Desc="Configurar secrets GitHub"},
    @{Nome="upload-aws.ps1"; Desc="Deploy manual de emergencia"},
    @{Nome="nginx-unified.conf"; Desc="Configuracao Nginx"},
    @{Nome="project/package.json"; Desc="Configuracao do projeto"},
    @{Nome="dpkeyaws.pem"; Desc="Chave SSH para AWS"}
)

foreach ($arquivo in $arquivosImportantes) {
    if (Test-Path $arquivo.Nome) {
        Write-Host "   OK $($arquivo.Nome) - $($arquivo.Desc)" -ForegroundColor Green
    } else {
        Write-Host "   FALTA $($arquivo.Nome) - $($arquivo.Desc) (FALTANDO)" -ForegroundColor Red
    }
}
Write-Host ""

# 12. URLs importantes
Write-Host "URLS IMPORTANTES" -ForegroundColor Magenta
Write-Host "=" * 15 -ForegroundColor Gray
Write-Host ""

Write-Host "Site em producao: https://duopassclub.ch" -ForegroundColor Blue
Write-Host "Desenvolvimento local: http://localhost:5175" -ForegroundColor Blue
Write-Host "Preview local: http://localhost:4173" -ForegroundColor Blue

try {
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl -match "github\.com[:/](.*?)/(.*?)(\.git)?$") {
        $owner = $matches[1]
        $repo = $matches[2]
        Write-Host "GitHub Actions: https://github.com/$owner/$repo/actions" -ForegroundColor Blue
        Write-Host "GitHub Secrets: https://github.com/$owner/$repo/settings/secrets/actions" -ForegroundColor Blue
    }
} catch {
    Write-Host "GitHub Actions: [Configure repositorio primeiro]" -ForegroundColor Yellow
}
Write-Host ""

# 13. Conclusao
Write-Host "DEMONSTRACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "=" * 25 -ForegroundColor Gray
Write-Host ""

if ($Executar) {
    Write-Host "Comandos executados com sucesso!" -ForegroundColor Green
    Write-Host "Verifique o site: https://duopassclub.ch" -ForegroundColor Cyan
} elseif ($SomenteVerificar) {
    Write-Host "Verificacao concluida!" -ForegroundColor Green
    Write-Host "Status do sistema verificado" -ForegroundColor Cyan
} else {
    Write-Host "Esta foi uma demonstracao simulada" -ForegroundColor Blue
    Write-Host "Use -Executar para executar de verdade" -ForegroundColor Cyan
    Write-Host "Use -SomenteVerificar para verificar status" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "   1. Configure GitHub secrets (se ainda nao fez)" -ForegroundColor Gray
Write-Host "   2. Faca um push para testar o deploy automatico" -ForegroundColor Gray
Write-Host "   3. Use os comandos mostrados no dia a dia" -ForegroundColor Gray
Write-Host "   4. Monitore GitHub Actions e o site" -ForegroundColor Gray
Write-Host ""

Write-Host "COMANDO PRINCIPAL:" -ForegroundColor Magenta
Write-Host ".\deploy-automatico-completo.ps1 -Modo auto -Mensagem 'Suas alteracoes'" -ForegroundColor Blue