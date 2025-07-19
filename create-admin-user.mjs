// Script para criar usuário admin no Supabase
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

async function createAdminUser() {
  try {
    writeLog('🔧 Criando usuário admin no Supabase...');
    
    // Primeiro, verificar se o usuário já existe
    writeLog('🔍 Verificando se admin já existe...');
    const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers();
    
    if (checkError) {
      writeLog('❌ Erro ao verificar usuários: ' + JSON.stringify(checkError, null, 2));
    }
    
    // Verificar se admin@duopass.com já existe
    const adminExists = existingUser?.users?.find(user => user.email === 'admin@duopass.com');
    
    if (adminExists) {
      writeLog('⚠️ Usuário admin já existe. Atualizando senha...');
      
      // Atualizar senha do admin existente
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        adminExists.id,
        {
          password: 'admin123',
          email_confirm: true
        }
      );
      
      if (updateError) {
        writeLog('❌ Erro ao atualizar admin: ' + JSON.stringify(updateError, null, 2));
      } else {
        writeLog('✅ Senha do admin atualizada!');
        writeLog('📧 Email: admin@duopass.com');
        writeLog('🔑 Senha: admin123');
      }
    } else {
      // Criar novo usuário admin
      writeLog('📝 Criando novo usuário admin...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@duopass.com',
        password: 'admin123',
        options: {
          data: {
            full_name: 'Administrador DuoPass',
            user_type: 'admin'
          }
        }
      });

      if (signUpError) {
        writeLog('❌ Erro no registro: ' + JSON.stringify(signUpError, null, 2));
      } else {
        writeLog('✅ Usuário admin criado! ID: ' + signUpData.user?.id);
        writeLog('📧 Email: admin@duopass.com');
        writeLog('🔑 Senha: admin123');
        writeLog('✉️ Confirmação: ' + (signUpData.user?.email_confirmed_at ? 'Confirmado' : 'Pendente'));
        
        // Confirmar email automaticamente se necessário
        if (!signUpData.user?.email_confirmed_at && signUpData.user?.id) {
          writeLog('📧 Confirmando email automaticamente...');
          
          const { error: confirmError } = await supabase.auth.admin.updateUserById(
            signUpData.user.id,
            { email_confirm: true }
          );
          
          if (confirmError) {
            writeLog('❌ Erro ao confirmar email: ' + JSON.stringify(confirmError, null, 2));
          } else {
            writeLog('✅ Email confirmado automaticamente!');
          }
        }
      }
    }
    
    // Testar login
    writeLog('🔐 Testando login com credenciais admin...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@duopass.com',
      password: 'admin123'
    });

    if (loginError) {
      writeLog('❌ Erro no login: ' + JSON.stringify(loginError, null, 2));
    } else {
      writeLog('✅ Login admin funcionando!');
      writeLog('👤 Usuário logado: ' + loginData.user?.email);
      
      // Fazer logout para não interferir
      await supabase.auth.signOut();
    }
    
  } catch (error) {
    writeLog('💥 Erro geral: ' + error.message);
  } finally {
    // Salvar log
    fs.writeFileSync('create-admin-result.txt', log);
    writeLog('📄 Log salvo em create-admin-result.txt');
  }
}

createAdminUser();