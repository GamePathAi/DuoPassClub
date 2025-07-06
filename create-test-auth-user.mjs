// Script para testar conexão com Supabase e verificar usuários
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Definida' : 'Não definida');
  process.exit(1);
}

console.log('🔗 Conectando ao Supabase...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🧪 Testando conexão com Supabase...');
    
    // Testar conexão básica
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao conectar:', error);
      return;
    }

    console.log('✅ Conexão com Supabase funcionando!');
    
    // Verificar se existe usuário com o email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'igor_bonafe@msn.com')
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar usuário:', userError);
      return;
    }

    if (userData) {
      console.log('👤 Usuário encontrado na tabela users:', userData);
    } else {
      console.log('❌ Usuário não encontrado na tabela users');
    }

    // Tentar fazer login para testar auth
    console.log('🔐 Testando login...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'igor_bonafe@msn.com',
      password: '123456'
    });

    if (authError) {
      console.error('❌ Erro no login:', authError);
    } else {
      console.log('✅ Login funcionou!', authData.user?.email);
      // Fazer logout
      await supabase.auth.signOut();
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testConnection();