require('dotenv').config({ path: './.env' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// ATENÇÃO: Usando a chave de serviço para operações de escrita.
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Service Key not found. Make sure to set them in your .env file.');
  process.exit(1);
}

// Usar a chave de serviço para ter permissões de escrita
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const runSql = async (filePath) => {
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    console.log(`Executing diagnostics from ${filePath}...\n`);

    // Split queries by semicolon, filter out empty ones
    const queries = sqlContent.split(';').map(q => q.trim()).filter(q => q.length > 0);

    for (const sql of queries) {
      console.log(`--- Running Query ---\n${sql}\n--------------------`);
      
      // For security and simplicity, we are not using a generic RPC executor.
      // Instead, we'll use the Supabase client library for specific, known queries.
      // This is a temporary, diagnostic-focused approach.
      // A more robust solution would involve creating specific RPC functions in PostgreSQL.

      // This script is now hardcoded to run voucher diagnostics for safety.
      // The file argument is just to trigger the correct logic.
      if (filePath.includes('simple_voucher_check.sql')) {
        // Lógica para executar consultas SELECT simples
        const tableNameMatch = sql.match(/from\s+public\.([a-zA-Z_]+)/i);
        const isInformationSchema = sql.includes('information_schema.columns');

        if (isInformationSchema) {
            // O cliente Supabase não suporta consultas diretas ao information_schema
            // Vamos pular esta consulta por enquanto, pois as outras nos darão os dados que precisamos
            console.log('Skipping information_schema query as it is not directly supported.');
        } else if (tableNameMatch && tableNameMatch[1]) {
            const tableName = tableNameMatch[1];
            console.log(`Querying table: ${tableName}`);
            const { data, error } = await supabaseAdmin.from(tableName).select('*');
            if (error) {
                console.error(`Error executing query for table ${tableName}:`, error.message);
            } else {
                console.log('Query Result:', JSON.stringify(data, null, 2));
            }
        } else {
            console.log("Could not determine table from query, skipping.");
        }
      } else if (filePath.includes('fix_user_type.sql')) {
          console.log('Executing UPDATE on users table...');
          const { data, error } = await supabaseAdmin
              .from('users')
              .update({ user_type: 'customer' })
              .eq('email', 'igor.bonafe@gmail.com')
              .select();

          if (error) throw error;
          console.log('Update Result:', JSON.stringify(data, null, 2));
      } else {
          console.log(`No specific logic for ${filePath}. Skipping.`);
      }
      console.log('\n');
    }

  } catch (err) {
    console.error('Error executing SQL:', err.message);
  }
};

const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide a path to a SQL file.');
  process.exit(1);
}

runSql(filePath);