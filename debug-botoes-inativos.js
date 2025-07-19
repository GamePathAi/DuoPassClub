// 🔍 DEBUG ESPECÍFICO: Botões Inativos Pós-Login
// Cole este script no console do navegador (F12) após fazer login

console.log('🚀 INICIANDO DEBUG DOS BOTÕES INATIVOS');

// 1. VERIFICAR ESTADO COMPLETO DO AUTHCONTEXT
console.log('\n=== 1. ESTADO DO AUTHCONTEXT ===');
try {
  // Tentar acessar o contexto através do React DevTools ou window
  const authState = {
    user: window.authContext?.user || 'Não encontrado',
    profile: window.authContext?.profile || 'Não encontrado',
    loading: window.authContext?.loading || 'Não encontrado',
    isAuthenticated: window.authContext?.isAuthenticated || 'Não encontrado'
  };
  console.log('📊 Estado AuthContext:', authState);
} catch (error) {
  console.log('❌ Erro ao acessar AuthContext:', error);
}

// 2. VERIFICAR USUÁRIO NO SUPABASE
console.log('\n=== 2. VERIFICANDO USUÁRIO NO SUPABASE ===');
try {
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log('👤 Usuário Supabase:', { user, error });
  
  if (user) {
    // Verificar dados do usuário na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    console.log('📋 Dados do usuário na tabela:', { userData, userError });
  }
} catch (error) {
  console.log('❌ Erro ao verificar usuário:', error);
}

// 3. VERIFICAR VOUCHERS DO USUÁRIO
console.log('\n=== 3. VERIFICANDO VOUCHERS ===');
try {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data: vouchers, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('user_id', user.id);
    
    console.log('🎫 Vouchers do usuário:', { vouchers, error, count: vouchers?.length });
  }
} catch (error) {
  console.log('❌ Erro ao verificar vouchers:', error);
}

// 4. VERIFICAR OFERTAS DISPONÍVEIS
console.log('\n=== 4. VERIFICANDO OFERTAS ===');
try {
  const { data: offers, error } = await supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .gte('expires_at', new Date().toISOString());
  
  console.log('🛍️ Ofertas disponíveis:', { offers, error, count: offers?.length });
} catch (error) {
  console.log('❌ Erro ao verificar ofertas:', error);
}

// 5. VERIFICAR ESTADO DOS BOTÕES
console.log('\n=== 5. VERIFICANDO BOTÕES ===');
try {
  const buttons = document.querySelectorAll('button');
  console.log('🔘 Total de botões encontrados:', buttons.length);
  
  buttons.forEach((btn, index) => {
    const buttonInfo = {
      index,
      text: btn.textContent?.trim().substring(0, 30) + '...',
      disabled: btn.disabled,
      className: btn.className,
      hasOnClick: !!btn.onclick,
      hasEventListeners: btn.getEventListeners ? Object.keys(btn.getEventListeners()).length : 'N/A'
    };
    console.log(`Botão ${index}:`, buttonInfo);
  });
} catch (error) {
  console.log('❌ Erro ao verificar botões:', error);
}

// 6. VERIFICAR LOADING STATES
console.log('\n=== 6. VERIFICANDO LOADING STATES ===');
try {
  // Procurar por elementos de loading
  const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"]');
  console.log('⏳ Elementos de loading encontrados:', loadingElements.length);
  
  // Verificar se há texto "Carregando"
  const loadingTexts = Array.from(document.querySelectorAll('*')).filter(el => 
    el.textContent?.includes('Carregando') || el.textContent?.includes('Loading')
  );
  console.log('📝 Textos de loading:', loadingTexts.map(el => el.textContent));
} catch (error) {
  console.log('❌ Erro ao verificar loading states:', error);
}

// 7. VERIFICAR CONSOLE LOGS ANTERIORES
console.log('\n=== 7. PROCURAR LOGS DO CUSTOMERDASHBOARD ===');
console.log('🔍 Procure nos logs acima por:');
console.log('- "🏠 CustomerDashboard: Componente renderizado"');
console.log('- "📊 CustomerDashboard: Resultado da busca"');
console.log('- "✅ CustomerDashboard: Ofertas carregadas"');
console.log('- "✅ CustomerDashboard: Vouchers carregados"');

// 8. TESTE DE CLIQUE EM BOTÃO
console.log('\n=== 8. TESTE DE CLIQUE ===');
try {
  const offerButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.textContent?.includes('Ver Detalhes') || btn.textContent?.includes('Ver E-Ticket')
  );
  
  console.log('🎯 Botões de ação encontrados:', offerButtons.length);
  
  if (offerButtons.length > 0) {
    console.log('🧪 Testando clique no primeiro botão...');
    const firstButton = offerButtons[0];
    console.log('Botão selecionado:', {
      text: firstButton.textContent,
      disabled: firstButton.disabled,
      className: firstButton.className
    });
    
    // Simular clique
    firstButton.click();
    console.log('✅ Clique simulado executado');
  } else {
    console.log('❌ Nenhum botão de ação encontrado');
  }
} catch (error) {
  console.log('❌ Erro no teste de clique:', error);
}

// 9. VERIFICAR ESTRUTURA DO DASHBOARD
console.log('\n=== 9. ESTRUTURA DO DASHBOARD ===');
try {
  const tabs = document.querySelectorAll('[role="tab"], button[class*="tab"]');
  console.log('📑 Tabs encontradas:', tabs.length);
  
  const activeTab = document.querySelector('[class*="border-[#FF6B35]"]');
  console.log('🎯 Tab ativa:', activeTab?.textContent?.trim());
  
  const voucherCards = document.querySelectorAll('[class*="voucher"], [class*="card"]');
  console.log('🎫 Cards de voucher/oferta:', voucherCards.length);
} catch (error) {
  console.log('❌ Erro ao verificar estrutura:', error);
}

// 10. RESUMO E DIAGNÓSTICO
console.log('\n=== 🎯 RESUMO DO DIAGNÓSTICO ===');
console.log('1. Verifique se o usuário está autenticado e ativo');
console.log('2. Verifique se há vouchers e ofertas carregados');
console.log('3. Verifique se os botões não estão desabilitados');
console.log('4. Verifique se não há erros de JavaScript');
console.log('5. Verifique se o loading state foi resolvido');
console.log('\n🔧 PRÓXIMOS PASSOS:');
console.log('- Se usuário inativo: Execute o SQL de ativação');
console.log('- Se sem vouchers/ofertas: Execute o SQL de população');
console.log('- Se botões não respondem: Verifique event listeners');
console.log('- Se loading infinito: Verifique useEffect dependencies');

console.log('\n✅ DEBUG CONCLUÍDO - Analise os resultados acima');