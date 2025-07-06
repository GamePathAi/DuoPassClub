// Script para confirmar email do usuário diretamente no banco
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

async function confirmUserEmail() {
  try {
    writeLog('🔧 Atualizando status de verificação do email...');
    
    // Atualizar o campo email_verified na tabela users
    const { data, error } = await supabase
      .from('users')
      .update({ email_verified: true })
      .eq('email', 'igor_bonafe@msn.com')
      .select();

    if (error) {
      writeLog('❌ Erro ao atualizar: ' + JSON.stringify(error, null, 2));
    } else {
      writeLog('✅ Email confirmado com sucesso!');
      writeLog('📊 Dados atualizados: ' + JSON.stringify(data, null, 2));
    }
    
    // Testar login novamente
    writeLog('\n🔐 Testando login após confirmação...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'igor_bonafe@msn.com',
      password: '123456'
    });

    if (loginError) {
      writeLog('❌ Erro no login: ' + JSON.stringify(loginError, null, 2));
    } else {
      writeLog('✅ Login funcionou! Usuário autenticado.');
      writeLog('👤 Dados do usuário: ' + JSON.stringify(loginData.user, null, 2));
      await supabase.auth.signOut();
    }
    
    // Salvar log em arquivo
    fs.writeFileSync('confirm-email-result.txt', log);
    writeLog('\n📄 Resultado salvo em confirm-email-result.txt');
    
  } catch (error) {
    writeLog('💥 Erro geral: ' + error.message);
    fs.writeFileSync('confirm-email-result.txt', log);
  }
}

confirmUserEmail();