// Script simples para testar Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://rnzvbrlbcnknyhrgubqi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuenZicmxiY25rbnlocmd1YnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMTc0ODksImV4cCI6MjA2NjU5MzQ4OX0.fjMnzy1PCCqkGucrGp-1jkaJtwBuo9qNB1rk6OOw3zk';

const supabase = createClient(supabaseUrl, supabaseKey);

let log = '';

function writeLog(message) {
  log += message + '\n';
  console.log(message);
}

async function testSupabase() {
  try {
    writeLog('🧪 Testando conexão com Supabase...');
    
    // Testar login
    writeLog('🔐 Testando login com igor_bonafe@msn.com...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'igor_bonafe@msn.com',
      password: '123456'
    });

    if (authError) {
      writeLog('❌ Erro no login: ' + JSON.stringify(authError, null, 2));
    } else {
      writeLog('✅ Login funcionou! Usuário: ' + authData.user?.email);
      await supabase.auth.signOut();
    }
    
    // Salvar log em arquivo
    fs.writeFileSync('supabase-test-result.txt', log);
    writeLog('📄 Resultado salvo em supabase-test-result.txt');
    
  } catch (error) {
    writeLog('💥 Erro geral: ' + error.message);
    fs.writeFileSync('supabase-test-result.txt', log);
  }
}

testSupabase();