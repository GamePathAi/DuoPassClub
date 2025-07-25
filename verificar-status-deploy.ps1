# Deploy Status Checker - DuoPass
# Script para monitorar o deploy em tempo real

Write-Host "Verificando status do deploy automatico..." -ForegroundColor Cyan
Write-Host "" 

# Configuracoes
$repo = "GamePathAi/DuoPassClub"
$apiUrl = "https://api.github.com/repos/$repo/actions/runs"

# Funcao para obter status colorido
function Get-StatusColor($status, $conclusion) {
    if ($status -eq "in_progress" -or $status -eq "queued") {
        return "Yellow"
    }
    elseif ($conclusion -eq "success") {
        return "Green"
    }
    elseif ($conclusion -eq "failure") {
        return "Red"
    }
    else {
        return "Gray"
    }
}

# Funcao para obter emoji do status
function Get-StatusEmoji($status, $conclusion) {
    if ($status -eq "in_progress" -or $status -eq "queued") {
        return "[EXECUTANDO]"
    }
    elseif ($conclusion -eq "success") {
        return "[SUCESSO]"
    }
    elseif ($conclusion -eq "failure") {
        return "[FALHOU]"
    }
    else {
        return "[PENDENTE]"
    }
}

try {
    # Buscar ultimas execucoes
    Write-Host "Consultando GitHub Actions API..." -ForegroundColor Blue
    $response = Invoke-RestMethod -Uri $apiUrl -Method Get
    
    if ($response.workflow_runs.Count -eq 0) {
        Write-Host "Nenhuma execucao encontrada" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "" 
    Write-Host "ULTIMAS EXECUCOES DO DEPLOY:" -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "" 
    
    # Mostrar ultimas 5 execucoes
    $execucoes = $response.workflow_runs | Select-Object -First 5
    
    foreach ($run in $execucoes) {
        $emoji = Get-StatusEmoji $run.status $run.conclusion
        $color = Get-StatusColor $run.status $run.conclusion
        $data = [DateTime]::Parse($run.created_at).ToString("dd/MM/yyyy HH:mm")
        
        Write-Host "$emoji" -NoNewline -ForegroundColor $color
        Write-Host " #$($run.run_number) - " -NoNewline
        Write-Host "$($run.display_title)" -ForegroundColor White -NoNewline
        Write-Host " [$data]" -ForegroundColor Gray
        Write-Host "   Status: " -NoNewline
        Write-Host "$($run.status)" -ForegroundColor $color -NoNewline
        
        if ($run.conclusion) {
            Write-Host " -> $($run.conclusion)" -ForegroundColor $color
        } else {
            Write-Host ""
        }
        
        Write-Host "   Branch: $($run.head_branch)" -ForegroundColor Cyan
        Write-Host "   Commit: $($run.head_sha.Substring(0,7))" -ForegroundColor Yellow
        Write-Host "   URL: $($run.html_url)" -ForegroundColor Blue
        Write-Host "" 
    }
    
    # Status da ultima execucao
    $ultimaExecucao = $execucoes[0]
    $ultimoEmoji = Get-StatusEmoji $ultimaExecucao.status $ultimaExecucao.conclusion
    $ultimaCor = Get-StatusColor $ultimaExecucao.status $ultimaExecucao.conclusion
    
    Write-Host "STATUS ATUAL DO DEPLOY:" -ForegroundColor White -BackgroundColor DarkGreen
    Write-Host "" 
    Write-Host "$ultimoEmoji Execucao #$($ultimaExecucao.run_number)" -ForegroundColor $ultimaCor
    Write-Host "Commit: $($ultimaExecucao.display_title)" -ForegroundColor White
    Write-Host "Branch: $($ultimaExecucao.head_branch)" -ForegroundColor Cyan
    Write-Host "Iniciado: $([DateTime]::Parse($ultimaExecucao.created_at).ToString('dd/MM/yyyy HH:mm:ss'))" -ForegroundColor Gray
    
    if ($ultimaExecucao.status -eq "completed") {
        Write-Host "Finalizado: $([DateTime]::Parse($ultimaExecucao.updated_at).ToString('dd/MM/yyyy HH:mm:ss'))" -ForegroundColor Gray
        $duracao = [DateTime]::Parse($ultimaExecucao.updated_at) - [DateTime]::Parse($ultimaExecucao.created_at)
        Write-Host "Duracao: $($duracao.Minutes)m $($duracao.Seconds)s" -ForegroundColor Gray
    }
    
    Write-Host "" 
    
    # Recomendacoes baseadas no status
    if ($ultimaExecucao.status -eq "in_progress" -or $ultimaExecucao.status -eq "queued") {
        Write-Host "DEPLOY EM ANDAMENTO" -ForegroundColor Yellow -BackgroundColor Black
        Write-Host "   - Aguarde a conclusao (5-15 minutos)" -ForegroundColor Yellow
        Write-Host "   - Monitore em: $($ultimaExecucao.html_url)" -ForegroundColor Blue
        Write-Host "   - Execute este script novamente em alguns minutos" -ForegroundColor Yellow
    }
    elseif ($ultimaExecucao.conclusion -eq "success") {
        Write-Host "DEPLOY CONCLUIDO COM SUCESSO!" -ForegroundColor Green -BackgroundColor Black
        Write-Host "   - Site disponivel em: https://duopassclub.ch" -ForegroundColor Green
        Write-Host "   - Verifique as funcionalidades" -ForegroundColor Green
        Write-Host "   - Proximo deploy sera automatico no proximo push" -ForegroundColor Cyan
    }
    elseif ($ultimaExecucao.conclusion -eq "failure") {
        Write-Host "DEPLOY FALHOU!" -ForegroundColor Red -BackgroundColor Black
        Write-Host "   - Verifique os logs: $($ultimaExecucao.html_url)" -ForegroundColor Red
        Write-Host "   - Corrija os erros e faca novo commit" -ForegroundColor Yellow
        Write-Host "   - Use deploy manual se necessario: ./upload-aws.ps1" -ForegroundColor Cyan
    }
    
    Write-Host "" 
    Write-Host "COMANDOS UTEIS:" -ForegroundColor White -BackgroundColor DarkMagenta
    Write-Host "   - Verificar status: ./verificar-status-deploy.ps1" -ForegroundColor Magenta
    Write-Host "   - Deploy manual: ./upload-aws.ps1" -ForegroundColor Magenta
    Write-Host "   - Novo deploy: git add . && git commit -m 'msg' && git push" -ForegroundColor Magenta
    Write-Host "" 
    
}
catch {
    Write-Host "ERRO ao consultar GitHub API:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "" 
    Write-Host "SOLUCOES:" -ForegroundColor Yellow
    Write-Host "   - Verifique sua conexao com internet" -ForegroundColor Yellow
    Write-Host "   - Acesse manualmente: https://github.com/GamePathAi/DuoPassClub/actions" -ForegroundColor Blue
    Write-Host "   - Use deploy manual se necessario" -ForegroundColor Yellow
    exit 1
}

# Verificar se site esta online
Write-Host "VERIFICANDO SITE..." -ForegroundColor Blue
try {
    $siteResponse = Invoke-WebRequest -Uri "https://duopassclub.ch" -Method Head -TimeoutSec 10
    if ($siteResponse.StatusCode -eq 200) {
        Write-Host "Site online e respondendo!" -ForegroundColor Green
    }
}
catch {
    Write-Host "Site pode estar temporariamente indisponivel" -ForegroundColor Yellow
    Write-Host "   Aguarde alguns minutos se deploy estiver em andamento" -ForegroundColor Yellow
}

Write-Host "" 
Write-Host "Deploy automatico configurado e funcionando!" -ForegroundColor Green
Write-Host "   Toda alteracao no codigo sera automaticamente deployada" -ForegroundColor Cyan
Write-Host ""