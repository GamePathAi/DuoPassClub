require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estrutura das tabelas...');
    
    // Verificar se as tabelas têm dados
    const { data: expData, error: expError } = await supabase
      .from('cultural_experiences')
      .select('*')
      .limit(1);
    
    if (expError) {
      console.log('❌ Erro ao acessar cultural_experiences:', expError.message);
    } else {
      console.log('\n📋 Estrutura da tabela cultural_experiences (primeira linha):');
      if (expData && expData.length > 0) {
        console.log('Colunas encontradas:', Object.keys(expData[0]));
        console.log('Dados:', expData[0]);
      } else {
        console.log('❌ Tabela cultural_experiences está vazia');
      }
    }
    
    // Verificar cultural_partners
    const { data: partData, error: partError } = await supabase
      .from('cultural_partners')
      .select('*')
      .limit(1);
    
    if (partError) {
      console.log('❌ Erro ao acessar cultural_partners:', partError.message);
    } else {
      console.log('\n📋 Estrutura da tabela cultural_partners (primeira linha):');
      if (partData && partData.length > 0) {
        console.log('Colunas encontradas:', Object.keys(partData[0]));
        console.log('Dados:', partData[0]);
      } else {
        console.log('❌ Tabela cultural_partners está vazia');
      }
    }
    
    // Tentar diferentes formas de join
    console.log('\n🧪 Testando diferentes tipos de consulta...');
    
    // Teste 1: Join explícito
    const { data: joinData1, error: joinError1 } = await supabase
      .from('cultural_experiences')
      .select('*, cultural_partners!inner(*)')
      .limit(1);
    
    if (joinError1) {
      console.log('❌ Join explícito falhou:', joinError1.message);
    } else {
      console.log('✅ Join explícito funcionou');
    }
    
    // Teste 2: Consulta sem join
    const { data: noJoinData, error: noJoinError } = await supabase
      .from('cultural_experiences')
      .select('*')
      .limit(1);
    
    if (noJoinError) {
      console.log('❌ Consulta simples falhou:', noJoinError.message);
    } else {
      console.log('✅ Consulta simples funcionou, registros:', noJoinData?.length || 0);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

checkTableStructure();