// Script para criar usuário no Supabase
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

async function createUser() {
  try {
    writeLog('🔧 Criando usuário no Supabase...');
    
    // Registrar novo usuário
    writeLog('📝 Registrando igor_bonafe@msn.com...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'igor_bonafe@msn.com',
      password: '123456',
      options: {
        data: {
          full_name: 'Igor Teste'
        }
      }
    });

    if (signUpError) {
      writeLog('❌ Erro no registro: ' + JSON.stringify(signUpError, null, 2));
    } else {
      writeLog('✅ Usuário registrado! ID: ' + signUpData.user?.id);
      writeLog('📧 Email: ' + signUpData.user?.email);
      writeLog('✉️ Confirmação: ' + (signUpData.user?.email_confirmed_at ? 'Confirmado' : 'Pendente'));
      
      // Se o usuário foi criado, tentar fazer login
      if (signUpData.user) {
        writeLog('🔐 Testando login...');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'igor_bonafe@msn.com',
          password: '123456'
        });

        if (loginError) {
          writeLog('❌ Erro no login: ' + JSON.stringify(loginError, null, 2));
        } else {
          writeLog('✅ Login funcionou!');
          await supabase.auth.signOut();
        }
      }
    }
    
    // Salvar log em arquivo
    fs.writeFileSync('create-user-result.txt', log);
    writeLog('📄 Resultado salvo em create-user-result.txt');
    
  } catch (error) {
    writeLog('💥 Erro geral: ' + error.message);
    fs.writeFileSync('create-user-result.txt', log);
  }
}

createUser();