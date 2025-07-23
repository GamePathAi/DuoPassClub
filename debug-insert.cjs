require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function debugInsert() {
  try {
    console.log('🔍 Debugando inserção de dados...');
    
    // Testar inserção simples de um parceiro
    console.log('\n1. Testando inserção de parceiro cultural...');
    const { data: partnerData, error: partnerError } = await supabase
      .from('cultural_partners')
      .insert({
        business_name: 'Teste Café',
        business_type: 'cafe',
        cultural_category: 'teste'
      })
      .select();
    
    if (partnerError) {
      console.log('❌ Erro ao inserir parceiro:');
      console.log('Código:', partnerError.code);
      console.log('Mensagem:', partnerError.message);
      console.log('Detalhes:', partnerError.details);
      console.log('Hint:', partnerError.hint);
      console.log('Erro completo:', JSON.stringify(partnerError, null, 2));
    } else {
      console.log('✅ Parceiro inserido com sucesso:', partnerData);
      
      // Se o parceiro foi inserido, testar experiência
      console.log('\n2. Testando inserção de experiência cultural...');
      const { data: expData, error: expError } = await supabase
        .from('cultural_experiences')
        .insert({
          title: 'Teste Experiência',
          description: 'Uma experiência de teste',
          active: true,
          partner_id: partnerData[0].id
        })
        .select();
      
      if (expError) {
        console.log('❌ Erro ao inserir experiência:');
        console.log('Código:', expError.code);
        console.log('Mensagem:', expError.message);
        console.log('Detalhes:', expError.details);
        console.log('Hint:', expError.hint);
      } else {
        console.log('✅ Experiência inserida com sucesso:', expData);
      }
    }
    
    // Verificar se conseguimos ler os dados
    console.log('\n3. Testando leitura de dados...');
    const { data: readData, error: readError } = await supabase
      .from('cultural_experiences')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.log('❌ Erro ao ler experiências:', readError.message);
    } else {
      console.log('✅ Dados lidos com sucesso:', readData?.length || 0, 'registros');
      if (readData && readData.length > 0) {
        console.log('Primeiro registro:', readData[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugInsert();