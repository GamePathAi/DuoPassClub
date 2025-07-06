// Script para inserir perfil do usuário na tabela users
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

async function insertUserProfile() {
  try {
    writeLog('👤 Inserindo perfil do usuário na tabela users...');
    
    const userId = '9ac93aed-53e0-49d4-b7bb-42e7c123b96e';
    
    // Inserir perfil na tabela users
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: 'igor_bonafe@msn.com',
        full_name: 'Igor Teste',
        user_type: 'customer',
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      writeLog('❌ Erro ao inserir perfil: ' + JSON.stringify(error, null, 2));
    } else {
      writeLog('✅ Perfil inserido com sucesso!');
      writeLog('📊 Dados: ' + JSON.stringify(data, null, 2));
    }
    
    // Verificar se o perfil foi inserido
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'igor_bonafe@msn.com')
      .single();

    if (userError) {
      writeLog('❌ Erro ao buscar usuário: ' + JSON.stringify(userError, null, 2));
    } else {
      writeLog('👤 Usuário encontrado na tabela: ' + JSON.stringify(userData, null, 2));
    }
    
    // Salvar log em arquivo
    fs.writeFileSync('insert-profile-result.txt', log);
    writeLog('📄 Resultado salvo em insert-profile-result.txt');
    
  } catch (error) {
    writeLog('💥 Erro geral: ' + error.message);
    fs.writeFileSync('insert-profile-result.txt', log);
  }
}

insertUserProfile();