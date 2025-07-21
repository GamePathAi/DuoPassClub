import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL ou Service Key não encontradas. Verifique seu arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSql() {
  try {
    // 1. Criar a tabela partner_registrations
    const createTableSql = fs.readFileSync('./scripts/create-partner-registrations.sql', 'utf8');
    const { error: createError } = await supabase.rpc('exec', { sql: createTableSql });
    if (createError) {
      console.error('Erro ao criar a tabela:', createError.message);
      return;
    }

    console.log('\nTabela partner_registrations criada com sucesso!');

  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

executeSql();