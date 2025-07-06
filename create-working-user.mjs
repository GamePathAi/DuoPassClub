// Script para criar um usuário funcional no sistema de autenticação
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

async function createWorkingUser() {
  try {
    const testEmail = 'test@duopass.com';
    const testPassword = '123456';
    
    writeLog('🆕 Criando usuário de teste funcional...');
    writeLog('📧 Email: ' + testEmail);
    writeLog('🔑 Senha: ' + testPassword);
    
    // Criar usuário no sistema de autenticação
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: undefined // Desabilitar confirmação por email
      }
    });

    if (signUpError) {
      writeLog('❌ Erro ao criar usuário: ' + JSON.stringify(signUpError, null, 2));
    } else {
      writeLog('✅ Usuário criado no sistema de autenticação!');
      writeLog('👤 ID do usuário: ' + signUpData.user?.id);
      writeLog('📧 Email: ' + signUpData.user?.email);
      writeLog('✉️ Confirmado: ' + (signUpData.user?.email_confirmed_at ? 'Sim' : 'Não'));
      
      // Se o usuário foi criado, tentar fazer login imediatamente
      if (signUpData.user) {
        writeLog('\n🔐 Tentando fazer login imediatamente...');
        
        // Fazer logout primeiro para limpar sessão
        await supabase.auth.signOut();
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });

        if (loginError) {
          writeLog('❌ Erro no login: ' + JSON.stringify(loginError, null, 2));
          
          // Se der erro de email não confirmado, vamos criar na tabela users também
          if (loginError.message.includes('email_not_confirmed') || loginError.code === 'email_not_confirmed') {
            writeLog('\n📝 Criando perfil na tabela users...');
            
            const { data: profileData, error: profileError } = await supabase
              .from('users')
              .insert({
                id: signUpData.user.id,
                email: testEmail,
                full_name: 'Usuário Teste',
                user_type: 'merchant',
                email_verified: true
              })
              .select();

            if (profileError) {
              writeLog('❌ Erro ao criar perfil: ' + JSON.stringify(profileError, null, 2));
            } else {
              writeLog('✅ Perfil criado na tabela users!');
              writeLog('📊 Dados: ' + JSON.stringify(profileData, null, 2));
            }
          }
        } else {
          writeLog('✅ Login funcionou perfeitamente!');
          writeLog('👤 Usuário logado: ' + JSON.stringify(loginData.user, null, 2));
          await supabase.auth.signOut();
        }
      }
    }
    
    // Salvar log em arquivo
    fs.writeFileSync('working-user-result.txt', log);
    writeLog('\n📄 Resultado salvo em working-user-result.txt');
    
  } catch (error) {
    writeLog('💥 Erro geral: ' + error.message);
    fs.writeFileSync('working-user-result.txt', log);
  }
}

createWorkingUser();