require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function createExecSqlFunction() {
  try {
    console.log('🔧 Criando função exec_sql no Supabase...');
    
    // Primeiro, vamos tentar criar a função usando uma query direta
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION public.exec_sql(query text)
      RETURNS TABLE(result json)
      LANGUAGE plpgsql
      AS $$
      BEGIN
          RETURN QUERY EXECUTE 'SELECT to_json(t) FROM (' || query || ') t';
      END;
      $$;
    `;
    
    console.log('📝 SQL da função:');
    console.log(createFunctionSQL);
    
    // Tentar executar usando uma query SQL direta
    const { data, error } = await supabase
      .from('pg_stat_user_functions') // Usar uma tabela que existe para testar conexão
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Erro de conexão:', error.message);
      console.log('\n⚠️  AÇÃO NECESSÁRIA:');
      console.log('1. Acesse o Supabase SQL Editor:');
      console.log('   https://app.supabase.com/project/[SEU_PROJECT_ID]/sql/new');
      console.log('\n2. Copie e cole este SQL:');
      console.log(createFunctionSQL);
      console.log('\n3. Clique em "RUN" para executar');
      console.log('\n4. Depois execute novamente este script');
      return;
    }
    
    console.log('✅ Conexão com Supabase OK');
    console.log('\n⚠️  AÇÃO NECESSÁRIA:');
    console.log('Para criar as tabelas culturais, você precisa:');
    console.log('\n1. Acessar o Supabase SQL Editor:');
    console.log('   https://app.supabase.com/project/[SEU_PROJECT_ID]/sql/new');
    console.log('\n2. Executar primeiro este SQL para criar a função exec_sql:');
    console.log(createFunctionSQL);
    console.log('\n3. Depois executar o SQL das tabelas culturais:');
    
    // Mostrar o SQL das tabelas
    const fs = require('fs');
    const path = require('path');
    
    try {
      const sqlPath = path.join(__dirname, 'cultural-partners-schema.sql');
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      
      console.log('\n📄 SQL das tabelas culturais (copie e cole no SQL Editor):');
      console.log('=' .repeat(60));
      console.log(sqlContent.substring(0, 1000) + '...');
      console.log('=' .repeat(60));
      console.log('\n(Arquivo completo: cultural-partners-schema.sql)');
      
    } catch (fileError) {
      console.log('⚠️ Não foi possível ler o arquivo SQL:', fileError.message);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createExecSqlFunction();