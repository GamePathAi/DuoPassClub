require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function recreateTables() {
  try {
    console.log('🏗️ Recriando tabelas culturais...');
    
    // Verificar se as tabelas existem
    console.log('\n1. Verificando existência das tabelas...');
    const { data: expCheck, error: expCheckError } = await supabase
      .from('cultural_experiences')
      .select('count', { count: 'exact', head: true });
    
    const { data: partCheck, error: partCheckError } = await supabase
      .from('cultural_partners')
      .select('count', { count: 'exact', head: true });
    
    console.log('cultural_experiences existe:', !expCheckError);
    console.log('cultural_partners existe:', !partCheckError);
    
    if (expCheckError || partCheckError) {
      console.log('\n2. Criando tabelas...');
      
      // Criar tabela cultural_partners primeiro
      console.log('Criando cultural_partners...');
      const createPartnersSQL = `
        CREATE TABLE IF NOT EXISTS cultural_partners (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          business_name text NOT NULL,
          business_type text,
          cultural_category text,
          ambiance_description text,
          created_at timestamp with time zone DEFAULT now(),
          updated_at timestamp with time zone DEFAULT now()
        );
      `;
      
      // Usar uma abordagem diferente - executar SQL diretamente
      const { data: createPartnerResult, error: createPartnerError } = await supabase.rpc('sql', {
        query: createPartnersSQL
      });
      
      if (createPartnerError) {
        console.log('❌ Erro ao criar cultural_partners:', createPartnerError.message);
        
        // Tentar abordagem alternativa
        console.log('Tentando abordagem alternativa...');
        try {
          // Usar o cliente admin se disponível
          const adminClient = createClient(
            process.env.VITE_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
          );
          
          const { error: adminError } = await adminClient.rpc('sql', {
            query: createPartnersSQL
          });
          
          if (adminError) {
            console.log('❌ Erro com cliente admin:', adminError.message);
          } else {
            console.log('✅ Tabela cultural_partners criada com cliente admin');
          }
        } catch (adminErr) {
          console.log('❌ Erro ao usar cliente admin:', adminErr.message);
        }
      } else {
        console.log('✅ Tabela cultural_partners criada');
      }
      
      // Criar tabela cultural_experiences
      console.log('Criando cultural_experiences...');
      const createExperiencesSQL = `
        CREATE TABLE IF NOT EXISTS cultural_experiences (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          title text NOT NULL,
          description text,
          active boolean DEFAULT true,
          partner_id uuid REFERENCES cultural_partners(id),
          created_at timestamp with time zone DEFAULT now(),
          updated_at timestamp with time zone DEFAULT now()
        );
      `;
      
      const { data: createExpResult, error: createExpError } = await supabase.rpc('sql', {
        query: createExperiencesSQL
      });
      
      if (createExpError) {
        console.log('❌ Erro ao criar cultural_experiences:', createExpError.message);
      } else {
        console.log('✅ Tabela cultural_experiences criada');
      }
    }
    
    // Verificar novamente
    console.log('\n3. Verificação final...');
    const { data: finalExpCheck, error: finalExpError } = await supabase
      .from('cultural_experiences')
      .select('count', { count: 'exact', head: true });
    
    const { data: finalPartCheck, error: finalPartError } = await supabase
      .from('cultural_partners')
      .select('count', { count: 'exact', head: true });
    
    console.log('✅ Status final:');
    console.log('cultural_experiences:', !finalExpError ? 'OK' : 'ERRO');
    console.log('cultural_partners:', !finalPartError ? 'OK' : 'ERRO');
    
    if (finalExpError) console.log('Erro exp:', finalExpError.message);
    if (finalPartError) console.log('Erro part:', finalPartError.message);
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

recreateTables();