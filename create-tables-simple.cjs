require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function createTablesSimple() {
  try {
    console.log('🏗️ Criando tabelas culturais (versão simples)...');
    
    // Criar tabela cultural_partners
    console.log('📋 Criando tabela cultural_partners...');
    const createPartnersSQL = `
      CREATE TABLE IF NOT EXISTS cultural_partners (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        business_name text NOT NULL,
        founder_story text,
        cultural_mission text,
        contact_name text NOT NULL,
        email text UNIQUE NOT NULL,
        phone text,
        business_type text NOT NULL,
        cultural_category text NOT NULL,
        address jsonb NOT NULL,
        ambiance_description text,
        social_values text[],
        instagram_handle text,
        website_url text,
        opening_hours jsonb,
        capacity_info text,
        accessibility_features text[],
        status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
        approval_notes text,
        curator_notes text,
        created_at timestamp DEFAULT NOW(),
        updated_at timestamp DEFAULT NOW(),
        approved_at timestamp,
        approved_by uuid
      );
    `;
    
    const { data: partnersResult, error: partnersError } = await supabase.rpc('exec_sql', {
      sql: createPartnersSQL
    });
    
    if (partnersError) {
      console.log('⚠️ Aviso ao criar cultural_partners:', partnersError.message);
    } else {
      console.log('✅ Tabela cultural_partners criada');
    }
    
    // Criar tabela cultural_experiences
    console.log('📋 Criando tabela cultural_experiences...');
    const createExperiencesSQL = `
      CREATE TABLE IF NOT EXISTS cultural_experiences (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        partner_id uuid REFERENCES cultural_partners(id) ON DELETE CASCADE,
        experience_name text NOT NULL,
        story_behind text,
        cultural_value text,
        duo_benefit text NOT NULL,
        original_price decimal(10,2) NOT NULL,
        duo_price decimal(10,2) NOT NULL,
        ambiance_notes text,
        best_for text[],
        duration_minutes integer,
        max_participants integer DEFAULT 2,
        available_days text[],
        available_times text[],
        special_requirements text,
        cultural_tags text[],
        emotion_tags text[],
        images text[],
        active boolean DEFAULT true,
        featured boolean DEFAULT false,
        created_at timestamp DEFAULT NOW(),
        updated_at timestamp DEFAULT NOW()
      );
    `;
    
    const { data: experiencesResult, error: experiencesError } = await supabase.rpc('exec_sql', {
      sql: createExperiencesSQL
    });
    
    if (experiencesError) {
      console.log('⚠️ Aviso ao criar cultural_experiences:', experiencesError.message);
    } else {
      console.log('✅ Tabela cultural_experiences criada');
    }
    
    // Habilitar RLS
    console.log('🔒 Configurando Row Level Security...');
    const rlsSQL = `
      ALTER TABLE cultural_partners ENABLE ROW LEVEL SECURITY;
      ALTER TABLE cultural_experiences ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY IF NOT EXISTS "Parceiros aprovados são públicos" ON cultural_partners
        FOR SELECT USING (status = 'approved');
        
      CREATE POLICY IF NOT EXISTS "Experiências ativas são públicas" ON cultural_experiences
        FOR SELECT USING (active = true);
    `;
    
    const { data: rlsResult, error: rlsError } = await supabase.rpc('exec_sql', {
      sql: rlsSQL
    });
    
    if (rlsError) {
      console.log('⚠️ Aviso ao configurar RLS:', rlsError.message);
    } else {
      console.log('✅ RLS configurado');
    }
    
    // Testar as tabelas
    console.log('\n🔍 Testando acesso às tabelas...');
    
    const { data: partnersTest, error: partnersTestError } = await supabase
      .from('cultural_partners')
      .select('*')
      .limit(1);
    
    if (partnersTestError) {
      console.log('❌ Erro ao acessar cultural_partners:', partnersTestError.message);
    } else {
      console.log('✅ Acesso à cultural_partners: OK');
    }
    
    const { data: experiencesTest, error: experiencesTestError } = await supabase
      .from('cultural_experiences')
      .select('*')
      .limit(1);
    
    if (experiencesTestError) {
      console.log('❌ Erro ao acessar cultural_experiences:', experiencesTestError.message);
    } else {
      console.log('✅ Acesso à cultural_experiences: OK');
    }
    
    console.log('\n🎉 Tabelas culturais criadas e testadas com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createTablesSimple();