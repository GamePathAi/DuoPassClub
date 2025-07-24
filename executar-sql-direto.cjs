#!/usr/bin/env node

// 🎭 DUOPASS - EXECUTAR SQL DIRETO NO SUPABASE
// Este script executa o SQL usando a biblioteca oficial do Supabase

const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente de produção
require('dotenv').config({ path: '.env.production' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🎭 DUOPASS - EXECUTANDO SQL DIRETO NO SUPABASE');
console.log('===============================================');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ERRO: Variáveis de ambiente não encontradas!');
  console.error('Verifique se .env.production contém:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('✅ Supabase URL:', SUPABASE_URL);
console.log('✅ Anon Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');

// Ler o arquivo SQL
const sqlFilePath = path.join(__dirname, 'EXECUTE_NO_SUPABASE.sql');

if (!fs.existsSync(sqlFilePath)) {
  console.error('❌ ERRO: Arquivo EXECUTE_NO_SUPABASE.sql não encontrado!');
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
console.log('✅ SQL carregado:', sqlContent.length, 'caracteres');

// Função para testar conexão com Supabase
async function testarConexao() {
  try {
    console.log('\n🔍 Testando conexão com Supabase...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY
      }
    });
    
    if (response.ok) {
      console.log('✅ Conexão com Supabase OK');
      return true;
    } else {
      console.log('❌ Erro na conexão:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro na conexão:', error.message);
    return false;
  }
}

// Função para verificar se as tabelas já existem
async function verificarTabelas() {
  try {
    console.log('\n🔍 Verificando tabelas existentes...');
    
    const tabelas = ['cultural_partners', 'cultural_experiences', 'experience_stories', 'cultural_connections'];
    const resultados = {};
    
    for (const tabela of tabelas) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}?limit=1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY
          }
        });
        
        if (response.ok) {
          console.log(`✅ Tabela ${tabela} existe`);
          resultados[tabela] = true;
        } else {
          console.log(`❌ Tabela ${tabela} não existe`);
          resultados[tabela] = false;
        }
      } catch (error) {
        console.log(`❌ Erro ao verificar ${tabela}:`, error.message);
        resultados[tabela] = false;
      }
    }
    
    return resultados;
  } catch (error) {
    console.log('❌ Erro na verificação:', error.message);
    return {};
  }
}

// Função principal
async function executarPlano() {
  try {
    // Testar conexão
    const conexaoOk = await testarConexao();
    if (!conexaoOk) {
      throw new Error('Não foi possível conectar ao Supabase');
    }
    
    // Verificar tabelas
    const tabelas = await verificarTabelas();
    const tabelasExistentes = Object.values(tabelas).filter(Boolean).length;
    
    console.log('\n📊 SITUAÇÃO ATUAL:');
    console.log('Tabelas culturais existentes:', tabelasExistentes, 'de 4');
    
    if (tabelasExistentes === 4) {
      console.log('\n🎉 TODAS AS TABELAS JÁ EXISTEM!');
      console.log('As tabelas culturais já estão criadas no Supabase.');
      console.log('\n📋 Próximo passo: Sincronizar arquivos com produção');
      console.log('Execute: node deploy-sync-producao.cjs');
      return;
    }
    
    console.log('\n⚠️ ALGUMAS TABELAS ESTÃO FALTANDO');
    console.log('\n💡 SOLUÇÃO MANUAL NECESSÁRIA:');
    console.log('\n1. Acesse o Supabase SQL Editor:');
    console.log('   https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new');
    console.log('\n2. Copie TODO o conteúdo do arquivo:');
    console.log('   EXECUTE_NO_SUPABASE.sql');
    console.log('\n3. Cole no SQL Editor e clique em "RUN"');
    console.log('\n4. Após executar, volte e execute:');
    console.log('   node deploy-sync-producao.cjs');
    
    // Criar arquivo de instruções simplificadas
    const instrucoes = `# 🎭 INSTRUÇÕES PARA CRIAR TABELAS NO SUPABASE

## 🚀 PASSO A PASSO:

1. **Acesse o Supabase SQL Editor:**
   https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new

2. **Copie o conteúdo completo do arquivo:**
   \`EXECUTE_NO_SUPABASE.sql\`

3. **Cole no SQL Editor e clique em "RUN"**

4. **Aguarde a execução (pode demorar alguns segundos)**

5. **Após sucesso, execute:**
   \`\`\`bash
   node deploy-sync-producao.cjs
   \`\`\`

## ✅ RESULTADO ESPERADO:
- ✅ Tabela \`cultural_partners\` criada
- ✅ Tabela \`cultural_experiences\` criada  
- ✅ Tabela \`experience_stories\` criada
- ✅ Tabela \`cultural_connections\` criada
- ✅ Índices e políticas RLS configuradas
- ✅ Dados de exemplo inseridos

---
**Gerado em:** ${new Date().toLocaleString('pt-BR')}
**Status:** Tabelas faltando (${4 - tabelasExistentes} de 4)
`;
    
    fs.writeFileSync('INSTRUCOES_SUPABASE_MANUAL.md', instrucoes);
    console.log('\n📄 Arquivo criado: INSTRUCOES_SUPABASE_MANUAL.md');
    
  } catch (error) {
    console.error('❌ ERRO GERAL:', error.message);
    console.log('\n💡 SOLUÇÃO ALTERNATIVA:');
    console.log('1. Acesse: https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new');
    console.log('2. Execute o SQL manualmente');
    console.log('3. Continue com o deploy');
  }
}

// Executar
executarPlano();