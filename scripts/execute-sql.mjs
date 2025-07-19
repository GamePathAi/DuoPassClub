import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Nota: Precisa ser a service_key para executar SQL

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL ou Service Key não encontradas. Verifique seu arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSql() {
  try {
    // 1. Criar a função RPC
    const createFunctionSql = fs.readFileSync('./scripts/create-alter-table-function.sql', 'utf8');
    const { error: functionError } = await supabase.rpc('exec', { sql: createFunctionSql });
    if (functionError) {
      console.error('Erro ao criar a função RPC:', functionError.message);
      // Continuar mesmo se a função já existir
    }

    // 2. Adicionar a coluna
    const addColumnSql = fs.readFileSync('./scripts/add-tier-column.sql', 'utf8');
    const queries = addColumnSql.split(';').map(q => q.trim()).filter(q => q.length > 0);

    for (const sql of queries) {
      console.log(`\nExecutando query:\n${sql}\n`);
      const { error: alterError } = await supabase.rpc('alter_table', { sql_command: sql });

      if (alterError) {
        console.error('Erro ao executar alteração:', alterError.message);
        return;
      }
    }

    console.log('\nColuna tier adicionada com sucesso!');

  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

executeSql();