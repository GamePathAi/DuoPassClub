import postgres from 'postgres';
import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

config();

const { VITE_SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

if (!VITE_SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables: VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// Extract database connection info from Supabase URL
const dbUrl = new URL(VITE_SUPABASE_URL);
const connectionString = `postgres://postgres:${SUPABASE_SERVICE_KEY}@${dbUrl.hostname}:${dbUrl.port}/postgres`;

const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
});

async function executeSqlFile() {
  try {
    const filePath = path.join(process.cwd(), 'add-tier-column.sql');
    const sqlQuery = await fs.readFile(filePath, 'utf-8');
    
    await sql.unsafe(sqlQuery);

    console.log('Successfully executed SQL from add-tier-column.sql');
  } catch (error) {
    console.error('Error executing SQL:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

executeSqlFile();