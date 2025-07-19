// 🔍 Script de Debug para Status do Usuário - DuoPass
// Execute este script no console do navegador (F12)

console.log('🔍 INICIANDO DEBUG DO STATUS DO USUÁRIO');

// 1. Verificar dados do AuthContext
const checkAuthContext = () => {
  console.log('\n📊 VERIFICANDO AUTHCONTEXT:');
  
  // Tentar acessar o contexto de diferentes formas
  const authData = {
    windowAuthContext: window.authContext,
    reactDevTools: window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
    supabaseClient: window.supabase
  };
  
  console.log('AuthContext disponível:', authData);
  
  // Se tiver React DevTools, tentar acessar o estado
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('React DevTools detectado - verifique o componente AuthProvider');
  }
};

// 2. Verificar localStorage e sessionStorage
const checkStorage = () => {
  console.log('\n💾 VERIFICANDO STORAGE:');
  
  const storageData = {
    localStorage: {
      duopass_demo_session: localStorage.getItem('duopass_demo_session'),
      duopass_user: localStorage.getItem('duopass_user'),
      'sb-token': localStorage.getItem('sb-token')
    },
    sessionStorage: Object.keys(sessionStorage).reduce((acc, key) => {
      acc[key] = sessionStorage.getItem(key);
      return acc;
    }, {})
  };
  
  console.log('Storage data:', storageData);
};

// 3. Verificar conexão com Supabase
const checkSupabaseConnection = async () => {
  console.log('\n🔗 VERIFICANDO SUPABASE:');
  
  try {
    // Verificar se Supabase está disponível
    if (typeof window.supabase === 'undefined') {
      console.error('❌ Supabase client não encontrado no window');
      return;
    }
    
    // Verificar sessão atual
    const { data: { session }, error: sessionError } = await window.supabase.auth.getSession();
    console.log('Sessão atual:', { session, sessionError });
    
    if (session?.user) {
      // Buscar dados do usuário diretamente
      const { data: userData, error: userError } = await window.supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      console.log('Dados do usuário no banco:', { userData, userError });
      
      // Verificar especificamente o usuário Igor
      const { data: igorData, error: igorError } = await window.supabase
        .from('users')
        .select('*')
        .eq('id', 'd97e1c42-3468-425a-8784-4d646b2c4a57')
        .single();
        
      console.log('Dados do Igor no banco:', { igorData, igorError });
    }
  } catch (error) {
    console.error('❌ Erro ao verificar Supabase:', error);
  }
};

// 4. Forçar atualização do perfil
const forceProfileRefresh = async () => {
  console.log('\n🔄 FORÇANDO ATUALIZAÇÃO DO PERFIL:');
  
  try {
    if (typeof window.supabase === 'undefined') {
      console.error('❌ Supabase não disponível');
      return;
    }
    
    const { data: { session } } = await window.supabase.auth.getSession();
    
    if (session?.user) {
      console.log('🔄 Buscando perfil atualizado...');
      
      const { data: profile, error } = await window.supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
      } else {
        console.log('✅ Perfil atualizado:', profile);
        console.log('📊 Status atual:', {
          subscription_status: profile.subscription_status,
          user_type: profile.user_type,
          email: profile.email
        });
      }
    } else {
      console.log('⚠️ Nenhuma sessão ativa');
    }
  } catch (error) {
    console.error('❌ Erro ao forçar atualização:', error);
  }
};

// 5. Limpar cache e recarregar
const clearCacheAndReload = () => {
  console.log('\n🧹 LIMPANDO CACHE:');
  
  // Limpar localStorage
  const keysToRemove = ['duopass_user', 'sb-token', 'duopass_demo_session'];
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`Removido: ${key}`);
  });
  
  // Limpar sessionStorage
  sessionStorage.clear();
  console.log('SessionStorage limpo');
  
  console.log('🔄 Recarregando página em 2 segundos...');
  setTimeout(() => {
    window.location.reload();
  }, 2000);
};

// Executar todas as verificações
const runFullDebug = async () => {
  console.log('🚀 EXECUTANDO DEBUG COMPLETO...');
  
  checkAuthContext();
  checkStorage();
  await checkSupabaseConnection();
  await forceProfileRefresh();
  
  console.log('\n✅ DEBUG COMPLETO FINALIZADO');
  console.log('\n🔧 COMANDOS DISPONÍVEIS:');
  console.log('- clearCacheAndReload() // Limpar cache e recarregar');
  console.log('- forceProfileRefresh() // Forçar atualização do perfil');
  console.log('- checkSupabaseConnection() // Verificar conexão Supabase');
};

// Disponibilizar funções globalmente
window.debugDuoPass = {
  runFullDebug,
  checkAuthContext,
  checkStorage,
  checkSupabaseConnection,
  forceProfileRefresh,
  clearCacheAndReload
};

// Executar debug automaticamente
runFullDebug();

console.log('\n📋 INSTRUÇÕES:');
console.log('1. Analise os logs acima');
console.log('2. Se necessário, execute: debugDuoPass.clearCacheAndReload()');
console.log('3. Ou execute: debugDuoPass.forceProfileRefresh()');