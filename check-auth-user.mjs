// Script para verificar usuário no sistema de autenticação
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

async function checkAuthUser() {
  try {
    writeLog('🔍 Verificando usuário no sistema de autenticação...');
    
    // Verificar usuário na tabela users
    writeLog('📊 Buscando na tabela users...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'igor_bonafe@msn.com')
      .single();

    if (userError) {
      writeLog('❌ Erro ao buscar na tabela users: ' + JSON.stringify(userError, null, 2));
    } else {
      writeLog('👤 Usuário encontrado na tabela users:');
      writeLog('   ID: ' + userData.id);
      writeLog('   Email: ' + userData.email);
      writeLog('   Nome: ' + userData.full_name);
      writeLog('   Verificado: ' + userData.email_verified);
    }
    
    // Tentar criar um novo usuário com email diferente para teste
    writeLog('\n🆕 Criando usuário de teste com email diferente...');
    const testEmail = 'teste' + Date.now() + '@duopass.com';
    const { data: newUserData, error: newUserError } = await supabase.auth.signUp({
      email: testEmail,
      password: '123456'
    });

    if (newUserError) {
      writeLog('❌ Erro ao criar usuário de teste: ' + JSON.stringify(newUserError, null, 2));
    } else {
      writeLog('✅ Usuário de teste criado:');
      writeLog('   ID: ' + newUserData.user?.id);
      writeLog('   Email: ' + newUserData.user?.email);
      writeLog('   Confirmado: ' + (newUserData.user?.email_confirmed_at ? 'Sim' : 'Não'));
      
      // Tentar fazer login com o usuário de teste
      writeLog('\n🔐 Testando login com usuário de teste...');
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: '123456'
      });

      if (loginError) {
        writeLog('❌ Erro no login de teste: ' + JSON.stringify(loginError, null, 2));
      } else {
        writeLog('✅ Login de teste funcionou!');
        await supabase.auth.signOut();
      }
    }
    
    // Salvar log em arquivo
    fs.writeFileSync('check-auth-result.txt', log);
    writeLog('\n📄 Resultado salvo em check-auth-result.txt');
    
  } catch (error) {
    writeLog('💥 Erro geral: ' + error.message);
    fs.writeFileSync('check-auth-result.txt', log);
  }
}

checkAuthUser();