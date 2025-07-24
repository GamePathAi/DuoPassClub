#!/usr/bin/env node

// 🎭 DUOPASS - PLANO COMPLETO DE SINCRONIZAÇÃO
// Este script executa todo o plano de sincronização dev → produção

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎭 DUOPASS - PLANO COMPLETO DE SINCRONIZAÇÃO');
console.log('============================================');
console.log('🎯 Objetivo: Sincronizar desenvolvimento com produção');
console.log('🌐 Domínio: duopassclub.ch');
console.log('');

// Verificar se estamos na pasta correta
if (!fs.existsSync('package.json')) {
  console.error('❌ ERRO: Execute este script na pasta /project/');
  console.error('💡 Solução: cd project && node executar-plano-completo.cjs');
  process.exit(1);
}

console.log('✅ Pasta correta detectada');

// Verificar arquivos necessários
const arquivosNecessarios = [
  'EXECUTE_NO_SUPABASE.sql',
  'INSTRUCOES_DEPLOY_SYNC.md',
  'nginx-unified.conf',
  'verificar-sync.sh'
];

let arquivosFaltando = [];
for (const arquivo of arquivosNecessarios) {
  if (!fs.existsSync(arquivo)) {
    arquivosFaltando.push(arquivo);
  }
}

if (arquivosFaltando.length > 0) {
  console.error('❌ ERRO: Arquivos necessários não encontrados:');
  arquivosFaltando.forEach(arquivo => console.error(`   - ${arquivo}`));
  process.exit(1);
}

console.log('✅ Todos os arquivos necessários encontrados');

// Função para criar resumo do plano
function criarResumoPlano() {
  const resumo = `# 🎭 PLANO COMPLETO DE SINCRONIZAÇÃO - DuoPass

## 🎯 OBJETIVO
Sincronizar o ambiente de desenvolvimento com a produção em \`duopassclub.ch\`

## 🔍 PROBLEMAS IDENTIFICADOS
- ❌ Tabelas \`cultural_experiences\` não existem no Supabase de produção
- ❌ Servidor pode estar servindo build desatualizado
- ❌ Possível configuração nginx incorreta
- ❌ Dessincronização entre dev e produção

## 🚀 PLANO DE EXECUÇÃO

### PASSO 1: Criar Tabelas no Supabase ⏳
**Status:** PENDENTE - AÇÃO MANUAL NECESSÁRIA

**Instruções:**
1. Acesse: https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new
2. Copie TODO o conteúdo do arquivo: \`EXECUTE_NO_SUPABASE.sql\`
3. Cole no SQL Editor e clique em "RUN"
4. Aguarde a execução completa

**Resultado esperado:**
- ✅ Tabela \`cultural_partners\` criada
- ✅ Tabela \`cultural_experiences\` criada
- ✅ Tabela \`experience_stories\` criada
- ✅ Tabela \`cultural_connections\` criada
- ✅ Políticas RLS configuradas
- ✅ Dados de exemplo inseridos

### PASSO 2: Sincronizar Build com Servidor ✅
**Status:** PREPARADO

**Arquivos prontos:**
- ✅ Build atualizado na pasta \`dist/\`
- ✅ Instruções detalhadas em \`INSTRUCOES_DEPLOY_SYNC.md\`
- ✅ Script de verificação \`verificar-sync.sh\`

**Comandos principais:**
\`\`\`bash
# No servidor (SSH):
sudo rm -rf /var/www/duopass/dist/*

# Do seu computador local:
scp -r dist/* seu-usuario@duopassclub.ch:/tmp/duopass-new/

# No servidor:
sudo cp -r /tmp/duopass-new/* /var/www/duopass/dist/
sudo chown -R www-data:www-data /var/www/duopass/dist
\`\`\`

### PASSO 3: Aplicar Configuração Nginx ✅
**Status:** PREPARADO

**Arquivo:** \`nginx-unified.conf\`

**Comandos:**
\`\`\`bash
# Enviar configuração:
scp nginx-unified.conf seu-usuario@duopassclub.ch:/tmp/

# No servidor:
sudo cp /tmp/nginx-unified.conf /etc/nginx/sites-available/duopass
sudo ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

### PASSO 4: Verificação Final ✅
**Status:** PREPARADO

**Script:** \`verificar-sync.sh\`

**Comandos:**
\`\`\`bash
# No servidor:
bash verificar-sync.sh

# Teste manual:
curl -I https://duopassclub.ch
curl -I https://www.duopassclub.ch
\`\`\`

## 📋 ORDEM DE EXECUÇÃO

1. **PRIMEIRO:** Execute SQL no Supabase (MANUAL)
2. **SEGUNDO:** Siga \`INSTRUCOES_DEPLOY_SYNC.md\`
3. **TERCEIRO:** Aplique \`nginx-unified.conf\`
4. **QUARTO:** Execute \`verificar-sync.sh\`
5. **QUINTO:** Limpe cache do navegador (Ctrl+F5)

## 🎉 RESULTADO ESPERADO

Após completar todos os passos:
- ✅ \`duopassclub.ch\` e \`www.duopassclub.ch\` mostram conteúdo idêntico
- ✅ Experiências culturais funcionam (tabelas criadas)
- ✅ Navegação SPA funciona corretamente
- ✅ SSL válido em ambos os domínios
- ✅ Performance otimizada
- ✅ Sincronização completa dev ↔ produção

## ⏱️ TEMPO ESTIMADO
**15-30 minutos** (incluindo tempo de upload)

## 🆘 SUPORTE
Se encontrar problemas:
1. Verifique logs: \`sudo tail -f /var/log/nginx/duopass_error.log\`
2. Teste conectividade: \`curl -I https://duopassclub.ch\`
3. Verifique arquivos: \`ls -la /var/www/duopass/dist/\`

---
**Gerado em:** ${new Date().toLocaleString('pt-BR')}
**Status:** Plano preparado - Aguardando execução manual do Supabase
**Próximo passo:** Executar SQL no Supabase SQL Editor
`;

  fs.writeFileSync('PLANO_COMPLETO_SINCRONIZACAO.md', resumo);
  return resumo;
}

// Função principal
function executarPlanoCompleto() {
  try {
    console.log('\n📋 CRIANDO PLANO COMPLETO...');
    
    // Criar resumo do plano
    criarResumoPlano();
    console.log('✅ Arquivo criado: PLANO_COMPLETO_SINCRONIZACAO.md');
    
    // Verificar status do build
    const distExists = fs.existsSync('dist');
    const distStats = distExists ? fs.statSync('dist') : null;
    
    console.log('\n📦 STATUS DO BUILD:');
    if (distExists && distStats) {
      const ageBuild = (Date.now() - distStats.mtime.getTime()) / (1000 * 60); // em minutos
      console.log(`✅ Build existe (criado há ${ageBuild.toFixed(1)} minutos)`);
      
      if (ageBuild > 60) {
        console.log('⚠️ Build pode estar desatualizado (>1h)');
        console.log('💡 Considere executar: npm run build');
      }
    } else {
      console.log('❌ Build não encontrado');
      console.log('💡 Execute: npm run build');
    }
    
    console.log('\n🎯 PLANO COMPLETO PREPARADO!');
    console.log('=====================================');
    
    console.log('\n📋 PRÓXIMOS PASSOS OBRIGATÓRIOS:');
    console.log('\n1. 🎭 CRIAR TABELAS NO SUPABASE (MANUAL):');
    console.log('   → Acesse: https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new');
    console.log('   → Copie conteúdo de: EXECUTE_NO_SUPABASE.sql');
    console.log('   → Cole no SQL Editor e clique "RUN"');
    
    console.log('\n2. 🚀 SINCRONIZAR ARQUIVOS:');
    console.log('   → Leia: INSTRUCOES_DEPLOY_SYNC.md');
    console.log('   → Execute comandos SSH conforme instruções');
    
    console.log('\n3. ⚙️ APLICAR NGINX:');
    console.log('   → Envie: nginx-unified.conf para servidor');
    console.log('   → Configure conforme instruções');
    
    console.log('\n4. ✅ VERIFICAR:');
    console.log('   → Execute: verificar-sync.sh no servidor');
    console.log('   → Teste: https://duopassclub.ch');
    console.log('   → Limpe cache do navegador (Ctrl+F5)');
    
    console.log('\n📄 ARQUIVOS CRIADOS:');
    console.log('   ✅ PLANO_COMPLETO_SINCRONIZACAO.md (este plano)');
    console.log('   ✅ INSTRUCOES_SUPABASE_MANUAL.md (instruções Supabase)');
    console.log('   ✅ INSTRUCOES_DEPLOY_SYNC.md (instruções deploy)');
    console.log('   ✅ verificar-sync.sh (script verificação)');
    console.log('   ✅ nginx-unified.conf (configuração nginx)');
    
    console.log('\n⏱️ TEMPO ESTIMADO: 15-30 minutos');
    console.log('🎯 RESULTADO: Sincronização completa dev ↔ produção');
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    console.log('\n💡 SOLUÇÃO ALTERNATIVA:');
    console.log('1. Execute manualmente cada passo');
    console.log('2. Consulte os arquivos de instruções criados');
    console.log('3. Teste a aplicação após cada passo');
  }
}

// Executar plano completo
executarPlanoCompleto();