const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 SINCRONIZAÇÃO DEV → PRODUÇÃO - DuoPass');
console.log('============================================\n');

// Função para executar comandos
function executarComando(comando, descricao) {
  console.log(`🔧 ${descricao}...`);
  try {
    const resultado = execSync(comando, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${descricao} - Concluído`);
    return resultado;
  } catch (erro) {
    console.log(`❌ ${descricao} - Erro:`, erro.message);
    throw erro;
  }
}

// Verificar se está na pasta correta
function verificarPasta() {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    throw new Error('Execute este script na pasta project/ onde está o package.json');
  }
  console.log('✅ Pasta correta confirmada');
}

// Fazer build de produção
function fazerBuild() {
  console.log('\n📦 FAZENDO BUILD DE PRODUÇÃO:');
  
  // Limpar dist anterior
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('🗑️  Pasta dist/ anterior removida');
  }
  
  // Build com variáveis de produção
  executarComando('npm run build', 'Build de produção');
  
  // Verificar se build foi criado
  if (!fs.existsSync('dist/index.html')) {
    throw new Error('Build falhou - index.html não encontrado');
  }
  
  console.log('✅ Build de produção criado com sucesso');
}

// Criar arquivo de instruções para upload
function criarInstrucoesUpload() {
  console.log('\n📋 CRIANDO INSTRUÇÕES DE UPLOAD:');
  
  const instrucoes = `# 🚀 INSTRUÇÕES PARA SINCRONIZAR PRODUÇÃO

## 📦 Arquivos para Upload
Os arquivos de build estão na pasta \`dist/\` e devem ser enviados para o servidor.

## 🔧 Comandos no Servidor (SSH):

\`\`\`bash
# 1. Conectar ao servidor
ssh seu-usuario@duopassclub.ch

# 2. Fazer backup da versão atual
sudo mkdir -p /var/www/duopass/backup/\$(date +%Y%m%d_%H%M%S)
sudo cp -r /var/www/duopass/dist/* /var/www/duopass/backup/\$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# 3. Limpar pasta atual
sudo rm -rf /var/www/duopass/dist/*

# 4. Enviar novos arquivos (do seu computador local):
# Execute este comando no seu computador LOCAL:
scp -r dist/* seu-usuario@duopassclub.ch:/tmp/duopass-new/

# 5. No servidor, mover arquivos para local correto:
sudo mkdir -p /tmp/duopass-new
sudo cp -r /tmp/duopass-new/* /var/www/duopass/dist/
sudo chown -R www-data:www-data /var/www/duopass/dist
sudo chmod -R 755 /var/www/duopass/dist

# 6. Aplicar configuração nginx correta:
sudo cp nginx-unified.conf /etc/nginx/sites-available/duopass
sudo ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 7. Testar e recarregar nginx:
sudo nginx -t
sudo systemctl reload nginx

# 8. Verificar logs:
sudo tail -f /var/log/nginx/duopass_error.log
\`\`\`

## 🔍 Verificação Pós-Deploy:

\`\`\`bash
# Testar URLs:
curl -I https://duopassclub.ch
curl -I https://www.duopassclub.ch

# Verificar se ambos retornam o mesmo conteúdo:
curl -s https://duopassclub.ch | head -20
curl -s https://www.duopassclub.ch | head -20
\`\`\`

## 🚨 Se ainda houver dessincronização:

1. **Limpar cache do navegador** (Ctrl+F5)
2. **Verificar DNS:** \`nslookup duopassclub.ch\`
3. **Verificar nginx:** \`sudo nginx -T | grep duopassclub\`
4. **Verificar arquivos:** \`ls -la /var/www/duopass/dist/\`

## 📱 Alternativa: Deploy via rsync (mais rápido):

\`\`\`bash
# Do seu computador local:
rsync -avz --delete dist/ seu-usuario@duopassclub.ch:/tmp/duopass-sync/

# No servidor:
sudo rsync -avz --delete /tmp/duopass-sync/ /var/www/duopass/dist/
sudo chown -R www-data:www-data /var/www/duopass/dist
\`\`\`

---
**Gerado em:** ${new Date().toLocaleString()}
**Build:** ${fs.existsSync('dist') ? 'Pronto' : 'Pendente'}
`;
  
  fs.writeFileSync('INSTRUCOES_DEPLOY_SYNC.md', instrucoes);
  console.log('✅ Arquivo INSTRUCOES_DEPLOY_SYNC.md criado');
}

// Criar script de verificação pós-deploy
function criarScriptVerificacao() {
  console.log('\n🔍 CRIANDO SCRIPT DE VERIFICAÇÃO:');
  
  const scriptVerificacao = `#!/bin/bash

# Script de verificação pós-deploy
echo "🔍 Verificando sincronização produção..."

# Testar URLs
echo "\n🌐 Testando URLs:"
curl -I https://duopassclub.ch 2>/dev/null | head -1
curl -I https://www.duopassclub.ch 2>/dev/null | head -1

# Verificar se conteúdo é igual
echo "\n📄 Verificando conteúdo:"
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
echo "\n🔧 Verificando nginx:"
sudo nginx -t 2>/dev/null && echo "✅ Nginx OK" || echo "❌ Nginx com problemas"

# Verificar logs recentes
echo "\n📋 Logs recentes (últimas 5 linhas):"
sudo tail -5 /var/log/nginx/duopass_error.log 2>/dev/null || echo "Sem logs de erro"

echo "\n✅ Verificação concluída!"
`;
  
  fs.writeFileSync('verificar-sync.sh', scriptVerificacao);
  console.log('✅ Script verificar-sync.sh criado');
}

// Função principal
async function executarSync() {
  try {
    console.log('🎯 Iniciando sincronização...');
    
    verificarPasta();
    fazerBuild();
    criarInstrucoesUpload();
    criarScriptVerificacao();
    
    console.log('\n🎉 SINCRONIZAÇÃO PREPARADA COM SUCESSO!');
    console.log('=====================================');
    console.log('');
    console.log('📋 PRÓXIMOS PASSOS:');
    console.log('1. Leia o arquivo: INSTRUCOES_DEPLOY_SYNC.md');
    console.log('2. Execute os comandos no servidor conforme instruções');
    console.log('3. Use verificar-sync.sh para confirmar sincronização');
    console.log('');
    console.log('🔧 CAUSA PROVÁVEL DA DESSINCRONIZAÇÃO:');
    console.log('- O servidor está servindo uma versão antiga do build');
    console.log('- Arquivos em /var/www/duopass/dist/ estão desatualizados');
    console.log('- Configuração nginx pode estar incorreta');
    console.log('');
    console.log('💡 SOLUÇÃO:');
    console.log('- Envie os novos arquivos de dist/ para o servidor');
    console.log('- Aplique a configuração nginx-unified.conf');
    console.log('- Limpe cache do navegador após deploy');
    
  } catch (erro) {
    console.log('\n❌ ERRO NA SINCRONIZAÇÃO:');
    console.log(erro.message);
    process.exit(1);
  }
}

executarSync();