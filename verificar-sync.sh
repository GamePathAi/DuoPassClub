#!/bin/bash

# Script de verificação pós-deploy
echo "🔍 Verificando sincronização produção..."

# Testar URLs
echo "
🌐 Testando URLs:"
curl -I https://duopassclub.ch 2>/dev/null | head -1
curl -I https://www.duopassclub.ch 2>/dev/null | head -1

# Verificar se conteúdo é igual
echo "
📄 Verificando conteúdo:"
HASH1=$(curl -s https://duopassclub.ch | md5sum | cut -d' ' -f1)
HASH2=$(curl -s https://www.duopassclub.ch | md5sum | cut -d' ' -f1)

if [ "$HASH1" = "$HASH2" ]; then
    echo "✅ Conteúdo sincronizado - ambos os domínios iguais"
else
    echo "❌ DESSINCRONIZAÇÃO DETECTADA - conteúdos diferentes!"
    echo "Hash duopassclub.ch: $HASH1"
    echo "Hash www.duopassclub.ch: $HASH2"
fi

# Verificar nginx
echo "
🔧 Verificando nginx:"
sudo nginx -t 2>/dev/null && echo "✅ Nginx OK" || echo "❌ Nginx com problemas"

# Verificar logs recentes
echo "
📋 Logs recentes (últimas 5 linhas):"
sudo tail -5 /var/log/nginx/duopass_error.log 2>/dev/null || echo "Sem logs de erro"

echo "
✅ Verificação concluída!"
