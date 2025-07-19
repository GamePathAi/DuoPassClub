// 🚨 SCRIPT DE DIAGNÓSTICO - NAVEGAÇÃO E BOTÕES
// Execute no console do navegador (F12) para diagnosticar problemas de navegação

console.log('🔍 INICIANDO DIAGNÓSTICO DE NAVEGAÇÃO E BOTÕES');

// 1. VERIFICAR REACT ROUTER
function verificarReactRouter() {
  console.log('\n📍 1. VERIFICANDO REACT ROUTER:');
  
  // Verificar se React Router está carregado
  const hasReactRouter = window.React && window.ReactRouterDOM;
  console.log('React Router carregado:', hasReactRouter);
  
  // Verificar URL atual
  console.log('URL atual:', window.location.href);
  console.log('Pathname:', window.location.pathname);
  console.log('Search params:', window.location.search);
  
  // Verificar se há elementos de rota no DOM
  const routeElements = document.querySelectorAll('[data-testid*="route"], [class*="route"]');
  console.log('Elementos de rota encontrados:', routeElements.length);
}

// 2. VERIFICAR BOTÕES NO DOM
function verificarBotoesDOM() {
  console.log('\n🔘 2. VERIFICANDO BOTÕES NO DOM:');
  
  // Buscar todos os botões
  const allButtons = document.querySelectorAll('button');
  console.log('Total de botões encontrados:', allButtons.length);
  
  // Verificar botões específicos do dashboard
  const dashboardButtons = {
    'Ver Detalhes': document.querySelectorAll('button:contains("Ver Detalhes")')?.length || 0,
    'Resgatar Voucher': document.querySelectorAll('button:contains("RESGATAR")')?.length || 0,
    'Ver E-Ticket': document.querySelectorAll('button:contains("E-Ticket")')?.length || 0,
    'Tabs': document.querySelectorAll('button[class*="border-b"]')?.length || 0
  };
  
  console.log('Botões específicos encontrados:', dashboardButtons);
  
  // Verificar se botões têm event listeners
  let buttonsWithListeners = 0;
  allButtons.forEach((btn, index) => {
    const hasOnClick = btn.onclick !== null;
    const hasEventListeners = getEventListeners && getEventListeners(btn)?.click?.length > 0;
    
    if (hasOnClick || hasEventListeners) {
      buttonsWithListeners++;
    }
    
    if (index < 5) { // Log dos primeiros 5 botões
      console.log(`Botão ${index + 1}:`, {
        text: btn.textContent?.trim().substring(0, 30),
        hasOnClick,
        hasEventListeners,
        disabled: btn.disabled,
        className: btn.className
      });
    }
  });
  
  console.log('Botões com event listeners:', buttonsWithListeners);
}

// 3. VERIFICAR NAVEGAÇÃO PROGRAMÁTICA
function verificarNavegacao() {
  console.log('\n🧭 3. VERIFICANDO NAVEGAÇÃO:');
  
  // Verificar se useNavigate está disponível
  try {
    // Simular clique em botão "Ver Detalhes"
    const verDetalhesBtn = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Ver Detalhes'));
    
    if (verDetalhesBtn) {
      console.log('Botão "Ver Detalhes" encontrado:', verDetalhesBtn);
      console.log('Classe do botão:', verDetalhesBtn.className);
      console.log('Botão está habilitado:', !verDetalhesBtn.disabled);
      
      // Verificar se o botão responde a eventos
      console.log('Testando clique no botão "Ver Detalhes"...');
      verDetalhesBtn.click();
      
      setTimeout(() => {
        console.log('URL após clique:', window.location.href);
      }, 1000);
    } else {
      console.log('❌ Botão "Ver Detalhes" não encontrado');
    }
  } catch (error) {
    console.error('❌ Erro ao testar navegação:', error);
  }
}

// 4. VERIFICAR ESTADO DO REACT
function verificarEstadoReact() {
  console.log('\n⚛️ 4. VERIFICANDO ESTADO DO REACT:');
  
  // Verificar se React DevTools está disponível
  const hasReactDevTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  console.log('React DevTools disponível:', !!hasReactDevTools);
  
  // Tentar acessar componentes React
  try {
    const reactFiber = document.querySelector('#root')?._reactInternalFiber ||
                      document.querySelector('#root')?._reactInternals;
    
    console.log('React Fiber encontrado:', !!reactFiber);
    
    if (reactFiber) {
      console.log('Tipo do componente raiz:', reactFiber.type?.name || 'Desconhecido');
    }
  } catch (error) {
    console.log('Não foi possível acessar React Fiber:', error.message);
  }
}

// 5. VERIFICAR CONSOLE ERRORS
function verificarErrosConsole() {
  console.log('\n❌ 5. VERIFICANDO ERROS NO CONSOLE:');
  
  // Interceptar erros futuros
  const originalError = console.error;
  const errors = [];
  
  console.error = function(...args) {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    console.log('Erros capturados nos últimos 5 segundos:', errors);
    console.error = originalError; // Restaurar console.error original
  }, 5000);
}

// 6. TESTE DE NAVEGAÇÃO MANUAL
function testeNavegacaoManual() {
  console.log('\n🧪 6. TESTE DE NAVEGAÇÃO MANUAL:');
  
  const testRoutes = [
    '/customer-dashboard',
    '/vouchers',
    '/offers',
    '/profile'
  ];
  
  console.log('Testando navegação para rotas:', testRoutes);
  
  testRoutes.forEach((route, index) => {
    setTimeout(() => {
      console.log(`Navegando para: ${route}`);
      window.history.pushState({}, '', route);
      
      setTimeout(() => {
        console.log(`URL atual após navegação: ${window.location.pathname}`);
        const hasContent = document.body.textContent.length > 1000;
        console.log(`Conteúdo carregado: ${hasContent}`);
      }, 500);
    }, index * 2000);
  });
}

// 7. VERIFICAR SUPABASE E AUTH
function verificarSupabaseAuth() {
  console.log('\n🔐 7. VERIFICANDO SUPABASE E AUTH:');
  
  // Verificar se Supabase está carregado
  const hasSupabase = window.supabase || window._supabase;
  console.log('Supabase carregado:', !!hasSupabase);
  
  // Verificar localStorage para auth
  const authKeys = Object.keys(localStorage).filter(key => 
    key.includes('supabase') || key.includes('auth')
  );
  console.log('Chaves de auth no localStorage:', authKeys);
  
  // Verificar se usuário está autenticado
  authKeys.forEach(key => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      if (value.user || value.access_token) {
        console.log(`Auth encontrado em ${key}:`, {
          hasUser: !!value.user,
          hasToken: !!value.access_token,
          userEmail: value.user?.email
        });
      }
    } catch (e) {
      // Ignorar erros de parsing
    }
  });
}

// EXECUTAR TODOS OS TESTES
function executarDiagnosticoCompleto() {
  console.log('🚀 EXECUTANDO DIAGNÓSTICO COMPLETO DE NAVEGAÇÃO');
  console.log('=' .repeat(60));
  
  verificarReactRouter();
  verificarBotoesDOM();
  verificarEstadoReact();
  verificarSupabaseAuth();
  verificarErrosConsole();
  
  setTimeout(() => {
    verificarNavegacao();
  }, 1000);
  
  setTimeout(() => {
    testeNavegacaoManual();
  }, 3000);
  
  console.log('\n✅ DIAGNÓSTICO INICIADO - Aguarde os resultados...');
  console.log('=' .repeat(60));
}

// AUTO-EXECUTAR
executarDiagnosticoCompleto();

// FUNÇÕES AUXILIARES PARA TESTE MANUAL
window.debugNavegacao = {
  verificarBotoes: verificarBotoesDOM,
  testarNavegacao: verificarNavegacao,
  verificarRouter: verificarReactRouter,
  testeCompleto: executarDiagnosticoCompleto
};

console.log('\n🛠️ FUNÇÕES DISPONÍVEIS:');
console.log('- debugNavegacao.verificarBotoes()');
console.log('- debugNavegacao.testarNavegacao()');
console.log('- debugNavegacao.verificarRouter()');
console.log('- debugNavegacao.testeCompleto()');