require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Configurado' : 'Não encontrado');
console.log('Supabase Key:', supabaseKey ? 'Configurado' : 'Não encontrado');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('\n🔍 Verificando tabelas...');
    
    // Verificar cultural_experiences
    const { data: expData, error: expError } = await supabase
      .from('cultural_experiences')
      .select('count', { count: 'exact', head: true });
    
    if (expError) {
      console.log('❌ Tabela cultural_experiences:', expError.message);
    } else {
      console.log('✅ Tabela cultural_experiences existe');
    }
    
    // Verificar cultural_partners
    const { data: partData, error: partError } = await supabase
      .from('cultural_partners')
      .select('count', { count: 'exact', head: true });
    
    if (partError) {
      console.log('❌ Tabela cultural_partners:', partError.message);
    } else {
      console.log('✅ Tabela cultural_partners existe');
    }
    
    // Testar a consulta que está falhando
    console.log('\n🧪 Testando consulta com join...');
    const { data: joinData, error: joinError } = await supabase
      .from('cultural_experiences')
      .select(`
        *,
        cultural_partners (*)
      `)
      .limit(1);
    
    if (joinError) {
      console.log('❌ Erro no join:', joinError.message);
      console.log('Detalhes:', joinError);
    } else {
      console.log('✅ Join funcionando, dados encontrados:', joinData?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

checkTables();