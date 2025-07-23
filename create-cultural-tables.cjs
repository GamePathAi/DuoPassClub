require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function createCulturalTables() {
  try {
    console.log('🏗️ Criando tabelas culturais...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'scripts', 'create_cultural_tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 SQL a ser executado:');
    console.log(sqlContent);
    
    // Dividir em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`\n🔧 Executando ${commands.length} comandos SQL...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      console.log(`\n[${i + 1}/${commands.length}] Executando:`);
      console.log(command.substring(0, 100) + '...');
      
      const { data, error } = await supabase.rpc('exec_sql', {
        sql: command
      });
      
      if (error) {
        console.log(`❌ Erro no comando ${i + 1}:`, error.message);
        // Continuar mesmo com erro (pode ser que a tabela já exista)
      } else {
        console.log(`✅ Comando ${i + 1} executado com sucesso`);
      }
    }
    
    // Verificar se as tabelas foram criadas
    console.log('\n🔍 Verificando se as tabelas foram criadas...');
    
    const { data: expData, error: expError } = await supabase
      .from('cultural_experiences')
      .select('count', { count: 'exact', head: true });
    
    if (expError) {
      console.log('❌ Tabela cultural_experiences ainda não existe:', expError.message);
    } else {
      console.log('✅ Tabela cultural_experiences criada com sucesso!');
    }
    
    const { data: partData, error: partError } = await supabase
      .from('cultural_partners')
      .select('count', { count: 'exact', head: true });
    
    if (partError) {
      console.log('❌ Tabela cultural_partners ainda não existe:', partError.message);
    } else {
      console.log('✅ Tabela cultural_partners criada com sucesso!');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

createCulturalTables();