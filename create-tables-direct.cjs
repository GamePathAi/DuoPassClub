require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function createTablesDirect() {
  try {
    console.log('🏗️ Criando tabelas diretamente...');
    
    // Como não temos acesso direto ao SQL, vamos usar uma abordagem alternativa
    // Vamos tentar inserir dados em tabelas que sabemos que existem para testar permissões
    
    console.log('\n1. Testando permissões de escrita...');
    const { data: testData, error: testError } = await supabase
      .from('offers')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('❌ Erro ao ler offers:', testError.message);
    } else {
      console.log('✅ Conseguimos ler offers:', testData?.length || 0, 'registros');
    }
    
    // Vamos verificar se conseguimos usar alguma função RPC para criar tabelas
    console.log('\n2. Tentando usar RPC para executar SQL...');
    
    // Tentar diferentes nomes de função RPC
    const rpcFunctions = ['exec_sql', 'execute_sql', 'sql', 'run_sql'];
    
    for (const funcName of rpcFunctions) {
      console.log(`Tentando função: ${funcName}`);
      
      const { data: rpcData, error: rpcError } = await supabase
        .rpc(funcName, {
          sql: 'SELECT 1 as test;'
        });
      
      if (!rpcError) {
        console.log(`✅ Função ${funcName} funciona!`);
        
        // Usar esta função para criar as tabelas
        const createSQL = `
          -- Criar tabela cultural_partners
          CREATE TABLE IF NOT EXISTS cultural_partners (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            business_name text NOT NULL,
            business_type text,
            cultural_category text,
            ambiance_description text,
            created_at timestamp with time zone DEFAULT now(),
            updated_at timestamp with time zone DEFAULT now()
          );
          
          -- Criar tabela cultural_experiences
          CREATE TABLE IF NOT EXISTS cultural_experiences (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            title text NOT NULL,
            description text,
            active boolean DEFAULT true,
            partner_id uuid REFERENCES cultural_partners(id),
            created_at timestamp with time zone DEFAULT now(),
            updated_at timestamp with time zone DEFAULT now()
          );
          
          -- Habilitar RLS
          ALTER TABLE cultural_partners ENABLE ROW LEVEL SECURITY;
          ALTER TABLE cultural_experiences ENABLE ROW LEVEL SECURITY;
          
          -- Criar políticas de leitura pública
          CREATE POLICY IF NOT EXISTS "Allow public read access" ON cultural_partners
            FOR SELECT USING (true);
          
          CREATE POLICY IF NOT EXISTS "Allow public read access" ON cultural_experiences
            FOR SELECT USING (true);
        `;
        
        const { data: createData, error: createError } = await supabase
          .rpc(funcName, { sql: createSQL });
        
        if (createError) {
          console.log(`❌ Erro ao criar tabelas com ${funcName}:`, createError.message);
        } else {
          console.log(`✅ Tabelas criadas com sucesso usando ${funcName}!`);
          break;
        }
      } else {
        console.log(`❌ Função ${funcName} não disponível:`, rpcError.message);
      }
    }
    
    // Verificar se as tabelas foram criadas
    console.log('\n3. Verificando se as tabelas foram criadas...');
    
    const { data: expCheck, error: expError } = await supabase
      .from('cultural_experiences')
      .select('count', { count: 'exact', head: true });
    
    const { data: partCheck, error: partError } = await supabase
      .from('cultural_partners')
      .select('count', { count: 'exact', head: true });
    
    console.log('cultural_experiences:', !expError ? '✅ Criada' : '❌ Não existe');
    console.log('cultural_partners:', !partError ? '✅ Criada' : '❌ Não existe');
    
    if (expError) console.log('Erro exp:', expError.message);
    if (partError) console.log('Erro part:', partError.message);
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error('Stack:', error.stack);
  }
}

createTablesDirect();