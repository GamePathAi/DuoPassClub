import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './.env.production' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const logFile = './test-result.log';

// Limpa o arquivo de log anterior
if (fs.existsSync(logFile)) {
  fs.unlinkSync(logFile);
}

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = '❌ Variáveis de ambiente Supabase não encontradas. Verifique seu arquivo .env.production';
  console.error(errorMsg);
  fs.writeFileSync(logFile, errorMsg);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonInsert() {
  const log = (message) => fs.appendFileSync(logFile, message + '\n');
  log('🚀 Iniciando teste de inserção anônima...');

  const testData = {
    business_name: 'Teste Anônimo Completo',
    contact_name: 'Tester Completo',
    email: `test-completo-${Date.now()}@example.com`,
    phone: '987654321',
    address_street: 'Rua do Teste Completo',
    address_city: 'Cidade Teste Completo',
    address_postal_code: '54321-876',
    address_country: 'Brasil',
    business_type: 'restaurante',
    founder_story: 'História de teste completo.',
    cultural_mission: 'Missão de teste completo.',
    experience_title: 'Experiência de Teste Completo',
    experience_description: 'Descrição de teste completo.',
    experience_normal_price: 150,
    experience_duo_value: 'Valor de teste completo',
  };

  try {
    const { data, error } = await supabase
      .from('partner_registrations')
      .insert([testData])
      .select();

    if (error) {
      const errorMsg = `❌ Erro na inserção anônima: ${JSON.stringify(error, null, 2)}`;
      console.error(errorMsg);
      log(errorMsg);
      return;
    }

    const successMsg = `✅ Inserção anônima bem-sucedida: ${JSON.stringify(data, null, 2)}`;
    console.log(successMsg);
    log(successMsg);
  } catch (err) {
    const errorMsg = `❌ Erro inesperado durante o teste: ${err.message}`;
    console.error(errorMsg);
    log(errorMsg);
  }
}

testAnonInsert();