#!/bin/bash

# Script de Verificação Rápida - Status Nginx DuoPass
# Identifica configurações ativas e possíveis conflitos

echo "🔍 Verificação Rápida do Status Nginx - DuoPass"
echo "================================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função para status
status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
    fi
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Status do Nginx
echo "1️⃣ Status do Serviço Nginx:"
sudo systemctl is-active nginx >/dev/null 2>&1
status "Nginx está rodando"
echo ""

# 2. Configurações ativas
echo "2️⃣ Sites Habilitados:"
if [ -d "/etc/nginx/sites-enabled" ]; then
    ls -la /etc/nginx/sites-enabled/ | grep -v "total"
    echo ""
else
    warning "Diretório sites-enabled não encontrado"
fi

# 3. Configurações disponíveis
echo "3️⃣ Sites Disponíveis:"
if [ -d "/etc/nginx/sites-available" ]; then
    ls -la /etc/nginx/sites-available/ | grep -v "total"
    echo ""
else
    warning "Diretório sites-available não encontrado"
fi

# 4. Teste de configuração
echo "4️⃣ Teste de Configuração:"
sudo nginx -t >/dev/null 2>&1
status "Configuração Nginx válida"
echo ""

# 5. Portas em uso
echo "5️⃣ Portas em Uso:"
info "Porta 80 (HTTP):"
sudo netstat -tlnp | grep :80 | head -3
info "Porta 443 (HTTPS):"
sudo netstat -tlnp | grep :443 | head -3
info "Porta 3000 (Node.js):"
sudo netstat -tlnp | grep :3000 | head -3
echo ""

# 6. Processos relacionados
echo "6️⃣ Processos Ativos:"
info "Processos Nginx:"
ps aux | grep nginx | grep -v grep | head -5
info "Processos Node.js:"
ps aux | grep node | grep -v grep | head -3
echo ""

# 7. Diretórios da aplicação
echo "7️⃣ Diretórios da Aplicação:"
if [ -d "/var/www/duopass" ]; then
    info "Estrutura /var/www/duopass:"
    ls -la /var/www/duopass/ 2>/dev/null || warning "Sem permissão para listar"
    
    if [ -d "/var/www/duopass/dist" ]; then
        info "Arquivos em /var/www/duopass/dist:"
        ls -la /var/www/duopass/dist/ | head -10
    else
        warning "Diretório /var/www/duopass/dist não encontrado"
    fi
else
    warning "Diretório /var/www/duopass não encontrado"
fi
echo ""

# 8. Certificados SSL
echo "8️⃣ Certificados SSL:"
if command -v certbot >/dev/null 2>&1; then
    sudo certbot certificates 2>/dev/null | grep -A 5 "duopassclub.ch" || warning "Certificados para duopassclub.ch não encontrados"
else
    warning "Certbot não instalado"
fi
echo ""

# 9. Teste de conectividade
echo "9️⃣ Teste de Conectividade:"
info "Testando HTTP (duopassclub.ch):"
curl -I -s --connect-timeout 5 http://duopassclub.ch | head -1 || warning "HTTP não acessível"

info "Testando HTTPS (duopassclub.ch):"
curl -I -s --connect-timeout 5 https://duopassclub.ch | head -1 || warning "HTTPS não acessível"

info "Testando HTTPS (www.duopassclub.ch):"
curl -I -s --connect-timeout 5 https://www.duopassclub.ch | head -1 || warning "WWW HTTPS não acessível"
echo ""

# 10. Logs recentes
echo "🔟 Logs Recentes (últimas 5 linhas):"
if [ -f "/var/log/nginx/error.log" ]; then
    info "Erros Nginx:"
    sudo tail -5 /var/log/nginx/error.log 2>/dev/null || warning "Sem permissão para ler logs"
else
    warning "Log de erro não encontrado"
fi
echo ""

# 11. Configurações específicas do DuoPass
echo "1️⃣1️⃣ Configurações DuoPass:"
info "Procurando configurações com 'duopass' ou 'duopassclub':"
sudo grep -r "duopassclub.ch" /etc/nginx/ 2>/dev/null | head -5 || warning "Nenhuma configuração encontrada"
echo ""

# 12. Resumo e recomendações
echo "📋 RESUMO E RECOMENDAÇÕES:"
echo "================================"

# Verificar se há conflitos
CONFIG_COUNT=$(sudo find /etc/nginx/sites-enabled -name "*duopass*" -o -name "*default*" 2>/dev/null | wc -l)
if [ "$CONFIG_COUNT" -gt 1 ]; then
    warning "Múltiplas configurações detectadas - possível conflito!"
    echo "   Configurações encontradas:"
    sudo find /etc/nginx/sites-enabled -name "*duopass*" -o -name "*default*" 2>/dev/null
else
    info "Configuração única detectada"
fi

# Verificar se aplicação existe
if [ -f "/var/www/duopass/dist/index.html" ]; then
    info "Aplicação React encontrada em /var/www/duopass/dist"
else
    warning "Aplicação React não encontrada - execute 'npm run build' e copie para /var/www/duopass/dist"
fi

# Verificar SSL
if sudo certbot certificates 2>/dev/null | grep -q "duopassclub.ch"; then
    info "Certificados SSL configurados"
else
    warning "Certificados SSL não encontrados - execute: sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch"
fi

echo ""
echo "🚀 PRÓXIMOS PASSOS:"
echo "1. Se há conflitos: execute ./deploy-nginx-fix.sh"
echo "2. Se aplicação não existe: cd project && npm run build && sudo cp -r dist/* /var/www/duopass/dist/"
echo "3. Se SSL não configurado: sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch"
echo "4. Verificar logs detalhados: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "✅ Verificação concluída!"
echo "📖 Para mais detalhes, consulte: NGINX_DIAGNOSTIC_GUIDE.md"