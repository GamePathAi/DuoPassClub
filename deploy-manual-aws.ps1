# Script de Deploy Manual para AWS - DuoPass
# Este script simula o processo do GitHub Actions para deploy na AWS

Write-Host "=== DEPLOY MANUAL DUOPASS PARA AWS ===" -ForegroundColor Green
Write-Host ""

# Verificar se estamos na pasta correta
if (-not (Test-Path "project\package.json")) {
    Write-Host "ERRO: Execute este script na pasta raiz do DuoPass" -ForegroundColor Red
    exit 1
}

# Passo 1: Navegar para a pasta do projeto
Write-Host "1. Navegando para pasta do projeto..." -ForegroundColor Yellow
Set-Location project

# Passo 2: Instalar dependências
Write-Host "2. Instalando dependências..." -ForegroundColor Yellow
npm ci --prefer-offline --no-audit
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao instalar dependências" -ForegroundColor Red
    exit 1
}

# Passo 3: Auditoria de segurança
Write-Host "3. Executando auditoria de segurança..." -ForegroundColor Yellow
npm audit --audit-level moderate
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVISO: Vulnerabilidades encontradas, mas continuando..." -ForegroundColor Yellow
}

# Passo 4: Lint do código
Write-Host "4. Executando lint..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "AVISO: Problemas de lint encontrados, mas continuando..." -ForegroundColor Yellow
}

# Passo 5: Copiar arquivo de produção
Write-Host "5. Configurando ambiente de produção..." -ForegroundColor Yellow
Copy-Item ".env.production" ".env" -Force

# Passo 6: Build da aplicação
Write-Host "6. Executando build da aplicação..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha no build da aplicação" -ForegroundColor Red
    exit 1
}

# Passo 7: Verificar integridade do build
Write-Host "7. Verificando integridade do build..." -ForegroundColor Yellow
if (-not (Test-Path "dist")) {
    Write-Host "ERRO: Diretório dist não foi criado" -ForegroundColor Red
    exit 1
}
Write-Host "Build verificado com sucesso!" -ForegroundColor Green

# Passo 8: Informações para deploy na AWS
Write-Host ""
Write-Host "=== PRÓXIMOS PASSOS PARA DEPLOY NA AWS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "O build foi criado com sucesso na pasta: project/dist" -ForegroundColor Green
Write-Host ""
Write-Host "Para fazer o deploy na AWS, você precisa:" -ForegroundColor White
Write-Host ""
Write-Host "1. CONFIGURAR SECRETS NO GITHUB:" -ForegroundColor Yellow
Write-Host "   - SSH_PRIVATE_KEY: Sua chave SSH privada da AWS" -ForegroundColor White
Write-Host "   - SSH_KNOWN_HOSTS: Known hosts do servidor AWS" -ForegroundColor White
Write-Host "   - SSH_USER: Usuário SSH (ex: ubuntu, ec2-user)" -ForegroundColor White
Write-Host "   - SSH_HOST: IP ou domínio do servidor AWS" -ForegroundColor White
Write-Host ""
Write-Host "2. UPLOAD MANUAL (alternativa):" -ForegroundColor Yellow
Write-Host "   - Comprima a pasta 'dist' em um arquivo ZIP" -ForegroundColor White
Write-Host "   - Faça upload via SCP/SFTP para: /var/www/duopass/dist/" -ForegroundColor White
Write-Host "   - Execute: sudo systemctl reload nginx" -ForegroundColor White
Write-Host ""
Write-Host "3. CONFIGURAÇÃO DO NGINX:" -ForegroundColor Yellow
Write-Host "   - O arquivo nginx-unified.conf está pronto" -ForegroundColor White
Write-Host "   - Copie para: /etc/nginx/sites-available/duopass" -ForegroundColor White
Write-Host "   - Ative: sudo ln -s /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/" -ForegroundColor White
Write-Host "   - Teste: sudo nginx -t" -ForegroundColor White
Write-Host "   - Recarregue: sudo systemctl reload nginx" -ForegroundColor White
Write-Host ""
Write-Host "4. VERIFICAÇÃO:" -ForegroundColor Yellow
Write-Host "   - Acesse: https://duopassclub.ch" -ForegroundColor White
Write-Host "   - Verifique se o site está funcionando" -ForegroundColor White
Write-Host ""
Write-Host "=== DEPLOY LOCAL CONCLUÍDO ===" -ForegroundColor Green

# Voltar para pasta raiz
Set-Location ..

Write-Host "Arquivos prontos para deploy:" -ForegroundColor Cyan
Write-Host "- Build: project/dist/" -ForegroundColor White
Write-Host "- Nginx: nginx-unified.conf" -ForegroundColor White
Write-Host "- Env: project/.env.production" -ForegroundColor White