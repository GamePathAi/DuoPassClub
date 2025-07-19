// DEBUG CONSOLE - Cole no console do navegador (F12)
// Comandos para debugar o problema dos botões inativos

console.log('🔍 INICIANDO DEBUG DOS BOTÕES INATIVOS');

// 1. Verificar Estado do Usuário
console.log('\n=== 1. VERIFICANDO ESTADO DO USUÁRIO ===');
try {
  const userResult = await supabase.auth.getUser();
  console.log('👤 User:', userResult);
  
  const sessionResult = await supabase.auth.getSession();
  console.log('🔐 Session:', sessionResult);
} catch (error) {
  console.error('❌ Erro ao verificar usuário:', error);
}

// 2. Verificar Dados do Profile
console.log('\n=== 2. VERIFICANDO PROFILE ===');
try {
  const { data: user } = await supabase.auth.getUser();
  if (user?.user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.user.id);
    
    console.log('👤 Profile data:', profile);
    console.log('❌ Profile error:', error);
  }
} catch (error) {
  console.error('💥 Erro ao buscar profile:', error);
}

// 3. Verificar Vouchers
console.log('\n=== 3. VERIFICANDO VOUCHERS ===');
try {
  const { data: vouchers, error } = await supabase
    .from('vouchers')
    .select('*');
  
  console.log('🎫 Vouchers:', vouchers);
  console.log('❌ Vouchers error:', error);
} catch (error) {
  console.error('💥 Erro ao buscar vouchers:', error);
}

// 4. Verificar Ofertas
console.log('\n=== 4. VERIFICANDO OFERTAS ===');
try {
  const { data: offers, error } = await supabase
    .from('offers')
    .select('*');
  
  console.log('🎯 Offers:', offers);
  console.log('❌ Offers error:', error);
} catch (error) {
  console.error('💥 Erro ao buscar ofertas:', error);
}

// 5. Verificar Tabelas Disponíveis
console.log('\n=== 5. VERIFICANDO ESTRUTURA DO BANCO ===');
try {
  // Tentar listar todas as tabelas
  const { data: tables, error } = await supabase
    .rpc('get_schema_tables');
  
  console.log('📊 Tabelas disponíveis:', tables);
  console.log('❌ Error:', error);
} catch (error) {
  console.log('ℹ️ RPC não disponível, isso é normal');
}

console.log('\n✅ DEBUG CONCLUÍDO - Verifique os resultados acima');
console.log('\n📋 PRÓXIMOS PASSOS:');
console.log('1. Se user/session estão OK mas profile está vazio → Criar profile');
console.log('2. Se vouchers/offers estão vazios → Adicionar dados de teste');
console.log('3. Se há erros de RLS → Verificar políticas do Supabase');
console.log('4. Se tudo está vazio → Database não foi configurado');