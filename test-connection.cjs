require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Testando conexão com Supabase...');
console.log('URL:', process.env.VITE_SUPABASE_URL ? 'Definida' : 'Não definida');
console.log('ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    // Testar uma query simples
    console.log('\n1. Testando query básica...');
    const { data, error } = await supabase
      .from('offers')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Erro na query básica:', error.message);
      console.log('Código:', error.code);
      console.log('Detalhes:', error.details);
    } else {
      console.log('✅ Conexão OK - tabela offers acessível');
      console.log('Count:', data);
    }
    
    // Listar todas as tabelas disponíveis
    console.log('\n2. Listando tabelas disponíveis...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_schema_tables')
      .then(result => result)
      .catch(err => ({ error: err }));
    
    if (tablesError) {
      console.log('❌ Não foi possível listar tabelas:', tablesError.message || tablesError);
    } else {
      console.log('✅ Tabelas encontradas:', tables);
    }
    
    // Tentar acessar cultural_experiences diretamente
    console.log('\n3. Testando acesso direto a cultural_experiences...');
    const { data: cultData, error: cultError } = await supabase
      .from('cultural_experiences')
      .select('*')
      .limit(1);
    
    if (cultError) {
      console.log('❌ Erro ao acessar cultural_experiences:');
      console.log('Mensagem:', cultError.message);
      console.log('Código:', cultError.code);
      console.log('Detalhes:', cultError.details);
      console.log('Hint:', cultError.hint);
    } else {
      console.log('✅ cultural_experiences acessível:', cultData?.length || 0, 'registros');
    }
    
    // Tentar acessar cultural_partners diretamente
    console.log('\n4. Testando acesso direto a cultural_partners...');
    const { data: partData, error: partError } = await supabase
      .from('cultural_partners')
      .select('*')
      .limit(1);
    
    if (partError) {
      console.log('❌ Erro ao acessar cultural_partners:');
      console.log('Mensagem:', partError.message);
      console.log('Código:', partError.code);
      console.log('Detalhes:', partError.details);
      console.log('Hint:', partError.hint);
    } else {
      console.log('✅ cultural_partners acessível:', partData?.length || 0, 'registros');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error('Stack:', error.stack);
  }
}

testConnection();