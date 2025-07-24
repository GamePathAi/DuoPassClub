require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixCulturalTables() {
  try {
    console.log('🔧 Verificando e corrigindo tabelas culturais...');
    
    // 1. Verificar se as tabelas existem
    console.log('\n1. Verificando existência das tabelas...');
    
    const { data: expCheck, error: expError } = await supabase
      .from('cultural_experiences')
      .select('count')
      .limit(1);
    
    const { data: partCheck, error: partError } = await supabase
      .from('cultural_partners')
      .select('count')
      .limit(1);
    
    console.log('cultural_experiences:', expError ? '❌ Não existe' : '✅ Existe');
    console.log('cultural_partners:', partError ? '❌ Não existe' : '✅ Existe');
    
    // 2. Se as tabelas não existem, verificar tabelas alternativas
    if (expError || partError) {
      console.log('\n2. Verificando tabelas alternativas...');
      
      // Verificar se existe tabela 'offers' que pode estar sendo usada
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*')
        .limit(3);
      
      if (!offersError && offersData) {
        console.log('✅ Tabela offers encontrada com', offersData.length, 'registros');
        console.log('Estrutura da tabela offers:', Object.keys(offersData[0] || {}));
      }
      
      // Verificar se existe tabela 'merchants'
      const { data: merchantsData, error: merchantsError } = await supabase
        .from('merchants')
        .select('*')
        .limit(3);
      
      if (!merchantsError && merchantsData) {
        console.log('✅ Tabela merchants encontrada com', merchantsData.length, 'registros');
        console.log('Estrutura da tabela merchants:', Object.keys(merchantsData[0] || {}));
      }
    }
    
    // 3. Testar query problemática
    console.log('\n3. Testando query que está causando erro 400...');
    
    try {
      const { data: problematicQuery, error: problematicError } = await supabase
        .from('cultural_experiences')
        .select('*, cultural_partners(business_name, business_type, cultural_category, ambiance_description)')
        .eq('active', true)
        .limit(6);
      
      if (problematicError) {
        console.log('❌ Query problemática falhou:', problematicError.message);
        console.log('Código do erro:', problematicError.code);
        console.log('Detalhes:', problematicError.details);
      } else {
        console.log('✅ Query problemática funcionou!');
      }
    } catch (err) {
      console.log('❌ Erro ao executar query problemática:', err.message);
    }
    
    // 4. Testar queries alternativas
    console.log('\n4. Testando queries alternativas...');
    
    // Teste com offers (que sabemos que existe)
    try {
      const { data: offersQuery, error: offersQueryError } = await supabase
        .from('offers')
        .select('*, merchant:merchants(business_name, contact_info)')
        .eq('is_active', true)
        .limit(6);
      
      if (offersQueryError) {
        console.log('❌ Query com offers falhou:', offersQueryError.message);
      } else {
        console.log('✅ Query com offers funcionou! Registros:', offersQuery?.length || 0);
      }
    } catch (err) {
      console.log('❌ Erro na query com offers:', err.message);
    }
    
    // 5. Verificar se há algum código fazendo a query problemática
    console.log('\n5. Recomendações de correção:');
    
    if (expError || partError) {
      console.log('\n📋 AÇÕES NECESSÁRIAS:');
      console.log('1. As tabelas cultural_experiences e/ou cultural_partners não existem');
      console.log('2. O código está tentando fazer uma query que falha');
      console.log('3. Soluções possíveis:');
      console.log('   a) Criar as tabelas culturais no Supabase');
      console.log('   b) Modificar o código para usar tabelas existentes (offers/merchants)');
      console.log('   c) Implementar fallback mais robusto para dados mock');
      
      console.log('\n🔧 CORREÇÃO IMEDIATA:');
      console.log('Modifique o hook useCulturalExperiences para não fazer a query problemática');
      console.log('e use apenas dados mock até as tabelas serem criadas.');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

fixCulturalTables();