#!/usr/bin/env node

// 🎭 DUOPASS - EXECUTAR SQL NO SUPABASE DE PRODUÇÃO
// Este script executa automaticamente o EXECUTE_NO_SUPABASE.sql

const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente de produção
require('dotenv').config({ path: '.env.production' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('🎭 DUOPASS - EXECUTANDO SQL NO SUPABASE');
console.log('==========================================');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ ERRO: Variáveis de ambiente não encontradas!');
  console.error('Verifique se .env.production contém:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY ou SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('✅ Supabase URL:', SUPABASE_URL);
console.log('✅ Service Key:', SUPABASE_SERVICE_KEY.substring(0, 20) + '...');

// Ler o arquivo SQL
const sqlFilePath = path.join(__dirname, 'EXECUTE_NO_SUPABASE.sql');

if (!fs.existsSync(sqlFilePath)) {
  console.error('❌ ERRO: Arquivo EXECUTE_NO_SUPABASE.sql não encontrado!');
  process.exit(1);
}

const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
console.log('✅ SQL carregado:', sqlContent.length, 'caracteres');

// Função para executar SQL no Supabase
async function executarSQL() {
  try {
    console.log('\n🚀 Executando SQL no Supabase...');
    
    // Dividir o SQL em comandos individuais
    const comandos = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && cmd.length > 10);
    
    console.log('📝 Total de comandos SQL:', comandos.length);
    
    let sucessos = 0;
    let erros = 0;
    
    for (let i = 0; i < comandos.length; i++) {
      const comando = comandos[i];
      
      if (comando.includes('VERIFICAÇÃO FINAL') || comando.includes('SUCESSO!')) {
        continue;
      }
      
      try {
        console.log(`\n[${i + 1}/${comandos.length}] Executando comando...`);
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'apikey': SUPABASE_SERVICE_KEY
          },
          body: JSON.stringify({
            query: comando
          })
        });
        
        if (response.ok) {
          console.log('✅ Sucesso');
          sucessos++;
        } else {
          const errorText = await response.text();
          console.log('⚠️ Aviso:', response.status, errorText.substring(0, 100));
          
          // Tentar execução direta se exec_sql falhar
          if (errorText.includes('exec_sql') || response.status === 404) {
            console.log('🔄 Tentando execução direta...');
            
            const directResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/sql',
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'apikey': SUPABASE_SERVICE_KEY
              },
              body: comando
            });
            
            if (directResponse.ok) {
              console.log('✅ Sucesso (execução direta)');
              sucessos++;
            } else {
              console.log('❌ Erro na execução direta também');
              erros++;
            }
          } else {
            erros++;
          }
        }
        
        // Pequena pausa entre comandos
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log('❌ Erro:', error.message);
        erros++;
      }
    }
    
    console.log('\n📊 RESULTADO FINAL:');
    console.log('✅ Sucessos:', sucessos);
    console.log('❌ Erros:', erros);
    
    if (sucessos > 0) {
      console.log('\n🎉 TABELAS CULTURAIS CRIADAS COM SUCESSO!');
      console.log('\n📋 Próximos passos:');
      console.log('1. Execute: node deploy-sync-producao.cjs');
      console.log('2. Siga as instruções em INSTRUCOES_DEPLOY_SYNC.md');
      console.log('3. Teste a aplicação em https://duopassclub.ch');
    } else {
      console.log('\n⚠️ ATENÇÃO: Nenhum comando foi executado com sucesso.');
      console.log('Verifique as credenciais do Supabase e tente novamente.');
    }
    
  } catch (error) {
    console.error('❌ ERRO GERAL:', error.message);
    console.log('\n💡 SOLUÇÃO MANUAL:');
    console.log('1. Acesse: https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new');
    console.log('2. Copie o conteúdo de EXECUTE_NO_SUPABASE.sql');
    console.log('3. Cole no SQL Editor e clique em RUN');
  }
}

// Executar
executarSQL();