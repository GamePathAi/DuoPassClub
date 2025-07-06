import { supabase } from '../lib/supabaseConfig';

export async function createCulturalTables() {
  try {
    console.log('Criando tabelas culturais...');

    // Criar tabela cultural_partners
    const { error: partnersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cultural_partners (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          business_name TEXT NOT NULL,
          founder_story TEXT,
          cultural_mission TEXT,
          contact_name TEXT,
          email TEXT UNIQUE,
          business_type TEXT,
          cultural_category TEXT,
          address JSONB,
          ambiance_description TEXT,
          social_values TEXT[],
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (partnersError) {
      console.error('Erro ao criar tabela cultural_partners:', partnersError);
    } else {
      console.log('Tabela cultural_partners criada com sucesso!');
    }

    // Criar tabela cultural_experiences
    const { error: experiencesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cultural_experiences (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          partner_id UUID REFERENCES cultural_partners(id),
          experience_name TEXT,
          story_behind TEXT,
          cultural_value TEXT,
          duo_benefit TEXT,
          original_price DECIMAL(10,2),
          duo_price DECIMAL(10,2),
          ambiance_notes TEXT,
          best_for TEXT[],
          cultural_tags TEXT[],
          emotion_tags TEXT[],
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (experiencesError) {
      console.error('Erro ao criar tabela cultural_experiences:', experiencesError);
    } else {
      console.log('Tabela cultural_experiences criada com sucesso!');
    }

    // Criar tabela experience_stories
    const { error: storiesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS experience_stories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id),
          experience_id UUID REFERENCES cultural_experiences(id),
          story_text TEXT,
          emotion_tags TEXT[],
          shared_with TEXT,
          memorable_moment TEXT,
          would_recommend BOOLEAN,
          cultural_impact_rating INTEGER CHECK (cultural_impact_rating >= 1 AND cultural_impact_rating <= 5),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (storiesError) {
      console.error('Erro ao criar tabela experience_stories:', storiesError);
    } else {
      console.log('Tabela experience_stories criada com sucesso!');
    }

    // Criar tabela cultural_connections
    const { error: connectionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cultural_connections (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user1_id UUID REFERENCES auth.users(id),
          user2_id UUID REFERENCES auth.users(id),
          experience_id UUID REFERENCES cultural_experiences(id),
          connection_type TEXT, -- 'met_at_experience', 'shared_interest', 'recommended_by'
          connection_story TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (connectionsError) {
      console.error('Erro ao criar tabela cultural_connections:', connectionsError);
    } else {
      console.log('Tabela cultural_connections criada com sucesso!');
    }

    // Criar tabela cultural_metrics
    const { error: metricsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cultural_metrics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          partner_id UUID REFERENCES cultural_partners(id),
          metric_type TEXT, -- 'connections_created', 'cultural_impact', 'community_growth'
          metric_value DECIMAL(10,2),
          measurement_period TEXT, -- 'daily', 'weekly', 'monthly'
          recorded_at TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (metricsError) {
      console.error('Erro ao criar tabela cultural_metrics:', metricsError);
    } else {
      console.log('Tabela cultural_metrics criada com sucesso!');
    }

    // Criar políticas RLS
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Habilitar RLS
        ALTER TABLE cultural_partners ENABLE ROW LEVEL SECURITY;
        ALTER TABLE cultural_experiences ENABLE ROW LEVEL SECURITY;
        ALTER TABLE experience_stories ENABLE ROW LEVEL SECURITY;
        ALTER TABLE cultural_connections ENABLE ROW LEVEL SECURITY;
        ALTER TABLE cultural_metrics ENABLE ROW LEVEL SECURITY;

        -- Políticas para cultural_partners
        CREATE POLICY "Partners can view own data" ON cultural_partners
          FOR SELECT USING (auth.email() = email);
        
        CREATE POLICY "Partners can update own data" ON cultural_partners
          FOR UPDATE USING (auth.email() = email);
        
        CREATE POLICY "Anyone can insert partner data" ON cultural_partners
          FOR INSERT WITH CHECK (true);

        -- Políticas para cultural_experiences
        CREATE POLICY "Public can view active experiences" ON cultural_experiences
          FOR SELECT USING (active = true);
        
        CREATE POLICY "Partners can manage own experiences" ON cultural_experiences
          FOR ALL USING (
            partner_id IN (
              SELECT id FROM cultural_partners WHERE email = auth.email()
            )
          );

        -- Políticas para experience_stories
        CREATE POLICY "Users can view all stories" ON experience_stories
          FOR SELECT USING (true);
        
        CREATE POLICY "Users can create own stories" ON experience_stories
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update own stories" ON experience_stories
          FOR UPDATE USING (auth.uid() = user_id);

        -- Políticas para cultural_connections
        CREATE POLICY "Users can view own connections" ON cultural_connections
          FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
        
        CREATE POLICY "Users can create connections" ON cultural_connections
          FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

        -- Políticas para cultural_metrics
        CREATE POLICY "Partners can view own metrics" ON cultural_metrics
          FOR SELECT USING (
            partner_id IN (
              SELECT id FROM cultural_partners WHERE email = auth.email()
            )
          );
      `
    });

    if (rlsError) {
      console.error('Erro ao criar políticas RLS:', rlsError);
    } else {
      console.log('Políticas RLS criadas com sucesso!');
    }

    console.log('Todas as tabelas culturais foram criadas com sucesso!');
    return { success: true };

  } catch (error) {
    console.error('Erro geral ao criar tabelas:', error);
    return { success: false, error };
  }
}

// Função para inserir dados de exemplo
export async function insertSampleCulturalData() {
  try {
    console.log('Inserindo dados de exemplo...');

    // Inserir parceiro de exemplo
    const { data: partner, error: partnerError } = await supabase
      .from('cultural_partners')
      .insert([
        {
          business_name: 'Café das Letras',
          founder_story: 'Nasceu do sonho de criar um espaço onde literatura e café se encontram, promovendo conversas profundas e conexões genuínas.',
          cultural_mission: 'Ser um ponto de encontro para amantes da literatura, oferecendo um ambiente acolhedor para leitura, escrita e diálogo cultural.',
          contact_name: 'Maria Silva',
          email: 'maria@cafedasletras.com',
          business_type: 'cafe_cultural',
          cultural_category: 'literatura_cafe',
          address: { street: 'Rua das Flores, 123', city: 'São Paulo', state: 'SP', zipcode: '01234-567' },
          ambiance_description: 'Um ambiente acolhedor com estantes repletas de livros, música suave e o aroma de café especial. Perfeito para conversas que fluem naturalmente.',
          social_values: ['sustentabilidade', 'arte_local', 'slow_living'],
          status: 'approved'
        }
      ])
      .select()
      .single();

    if (partnerError) {
      console.error('Erro ao inserir parceiro:', partnerError);
      return;
    }

    // Inserir experiência de exemplo
    const { error: experienceError } = await supabase
      .from('cultural_experiences')
      .insert([
        {
          partner_id: partner.id,
          experience_name: 'Sarau Literário com Café Especial',
          story_behind: 'Uma noite especial onde poesia e café se encontram, criando um ambiente mágico para compartilhar histórias e descobrir novos talentos.',
          cultural_value: 'Promove a literatura local e cria um espaço de expressão artística acessível a todos.',
          duo_benefit: 'Duas pessoas podem participar do sarau e degustar cafés especiais pelo preço de uma.',
          original_price: 60.00,
          duo_price: 30.00,
          ambiance_notes: 'Luzes suaves, música acústica ao vivo e um ambiente que convida à contemplação e ao diálogo.',
          best_for: ['primeiro_encontro', 'amigos_arte', 'descoberta_cultural'],
          cultural_tags: ['literatura', 'poesia', 'musica_acustica', 'cafe_especial'],
          emotion_tags: ['inspiracao', 'conexao', 'descoberta', 'tranquilidade'],
          active: true
        }
      ]);

    if (experienceError) {
      console.error('Erro ao inserir experiência:', experienceError);
    } else {
      console.log('Dados de exemplo inseridos com sucesso!');
    }

  } catch (error) {
    console.error('Erro ao inserir dados de exemplo:', error);
  }
}

// Executar se chamado diretamente
if (typeof window !== 'undefined') {
  // Disponibilizar funções globalmente para teste
  (window as Record<string, unknown>).createCulturalTables = createCulturalTables;
  (window as Record<string, unknown>).insertSampleCulturalData = insertSampleCulturalData;
}