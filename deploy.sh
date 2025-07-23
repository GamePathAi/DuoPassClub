#!/bin/bash

# Script de Deploy para DuoPass - Produção
# Execute com: chmod +x deploy.sh && ./deploy.sh

set -e  # Para em caso de erro

echo "🚀 Iniciando deploy do DuoPass para produção..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para logs coloridos
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    log_error "package.json não encontrado. Execute o script no diretório raiz do projeto."
    exit 1
fi

# Verificar se .env.production existe
if [ ! -f ".env.production" ]; then
    log_error ".env.production não encontrado. Configure as variáveis de ambiente primeiro."
    exit 1
fi

log_info "Verificando dependências..."

# Instalar dependências
log_info "Instalando dependências..."
npm ci --production=false

# Atualizar browserslist
log_info "Atualizando browserslist..."
npx update-browserslist-db@latest

# Executar testes (se existirem)
if [ -f "src/__tests__" ] || grep -q '"test"' package.json; then
    log_info "Executando testes..."
    npm test -- --watchAll=false
fi

# Lint do código
if grep -q '"lint"' package.json; then
    log_info "Verificando qualidade do código..."
    npm run lint
fi

# Build para produção
log_info "Gerando build de produção..."
cp .env.production .env
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    log_error "Build falhou. Diretório dist não foi criado."
    exit 1
fi

log_info "Build concluído com sucesso!"

# Otimizar imagens (se imagemin estiver disponível)
if command -v imagemin &> /dev/null; then
    log_info "Otimizando imagens..."
    find dist -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | xargs imagemin --out-dir=dist/assets/
fi

# Comprimir arquivos adicionais
log_info "Comprimindo arquivos..."
find dist -name "*.js" -o -name "*.css" -o -name "*.html" | xargs gzip -k -9

# Gerar relatório de tamanho dos arquivos
log_info "Relatório de tamanho dos arquivos:"
du -sh dist/*

# Backup do deploy anterior (se existir)
DEPLOY_DIR="/var/www/duopass"
BACKUP_DIR="/var/backups/duopass"

if [ -d "$DEPLOY_DIR" ]; then
    log_info "Criando backup do deploy anterior..."
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp -r "$DEPLOY_DIR" "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)"
fi

# Deploy dos arquivos
log_info "Fazendo deploy dos arquivos..."
sudo mkdir -p "$DEPLOY_DIR"
sudo cp -r dist/* "$DEPLOY_DIR/"
sudo chown -R www-data:www-data "$DEPLOY_DIR"
sudo chmod -R 755 "$DEPLOY_DIR"

# Configurar Nginx (se ainda não estiver configurado)
NGINX_SITE="/etc/nginx/sites-available/duopass"
if [ ! -f "$NGINX_SITE" ]; then
    log_info "Configurando Nginx..."
    sudo cp nginx.conf "$NGINX_SITE"
    sudo ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
fi

# Verificar se o SSL está configurado
echo "🔒 Verificando certificado SSL..."
if [ ! -f "/etc/letsencrypt/live/duopassclub.ch/fullchain.pem" ]; then
    echo "⚠️  Certificado SSL não encontrado. Execute:"
    echo "sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch"
else
    echo "✅ Certificado SSL encontrado"
fi

# Reiniciar serviços
log_info "Reiniciando serviços..."
sudo systemctl reload nginx

# Verificar se o site está respondendo
log_info "Verificando se o site está online..."
if curl -f -s https://duopassclub.ch > /dev/null; then
    log_info "✅ Site está online e respondendo!"
else
    log_warn "⚠️  Site pode não estar respondendo corretamente."
fi

# Limpeza
log_info "Limpando arquivos temporários..."
rm -f .env

# Relatório final
echo ""
log_info "🎉 Deploy concluído com sucesso!"
log_info "📊 Estatísticas do deploy:"
echo "   - Tamanho total: $(du -sh dist | cut -f1)"
echo "   - Arquivos: $(find dist -type f | wc -l)"
echo "   - Data: $(date)"
echo ""
log_info "🔗 Acesse: https://duopassclub.ch"
log_info "📋 Logs do Nginx: sudo tail -f /var/log/nginx/duopass_*.log"
echo ""
log_warn "📝 Lembre-se de:"
echo "   1. Configurar SSL se ainda não foi feito"
echo "   2. Configurar monitoramento"
echo "   3. Testar todos os fluxos da aplicação"
echo "   4. Configurar backups automáticos"

echo ""
log_info "Deploy finalizado! 🚀"