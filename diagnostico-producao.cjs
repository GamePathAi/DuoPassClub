const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

console.log('🔍 DIAGNÓSTICO DE PRODUÇÃO - DuoPass');
console.log('=====================================\n');

// Verificar variáveis de ambiente
console.log('📋 VARIÁVEIS DE AMBIENTE:');
console.log('VITE_APP_URL:', process.env.VITE_APP_URL);
console.log('VITE_PUBLIC_URL:', process.env.VITE_PUBLIC_URL);
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('VITE_EMAIL_CONFIRM_URL:', process.env.VITE_EMAIL_CONFIRM_URL);
console.log('VITE_EMAIL_RESET_URL:', process.env.VITE_EMAIL_RESET_URL);
console.log('');

// Testar conexão com Supabase
async function testarSupabase() {
  try {
    console.log('🔗 TESTANDO CONEXÃO SUPABASE:');
    
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
    
    // Testar conexão básica
    const { data, error } = await supabase
      .from('cultural_experiences')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Erro Supabase:', error.message);
    } else {
      console.log('✅ Conexão Supabase OK');
    }
    
  } catch (err) {
    console.log('❌ Erro de conexão:', err.message);
  }
}

// Verificar URLs de produção
async function testarURLs() {
  console.log('\n🌐 TESTANDO URLs DE PRODUÇÃO:');
  
  const urls = [
    'https://duopassclub.ch',
    'https://www.duopassclub.ch',
    'https://duopassclub.ch/experiencias',
    'https://duopassclub.ch/ofertas'
  ];
  
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`${response.ok ? '✅' : '❌'} ${url} - Status: ${response.status}`);
    } catch (err) {
      console.log(`❌ ${url} - Erro: ${err.message}`);
    }
  }
}

// Verificar build local
function verificarBuild() {
  console.log('\n📦 VERIFICANDO BUILD LOCAL:');
  const fs = require('fs');
  const path = require('path');
  
  const distPath = path.join(__dirname, 'dist');
  
  if (fs.existsSync(distPath)) {
    console.log('✅ Pasta dist/ existe');
    
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✅ index.html existe');
      
      // Verificar se o build está atualizado
      const stats = fs.statSync(indexPath);
      const buildDate = stats.mtime;
      const agora = new Date();
      const diffHoras = (agora - buildDate) / (1000 * 60 * 60);
      
      console.log(`📅 Build criado: ${buildDate.toLocaleString()}`);
      console.log(`⏰ Há ${diffHoras.toFixed(1)} horas`);
      
      if (diffHoras > 24) {
        console.log('⚠️  Build pode estar desatualizado');
      }
    } else {
      console.log('❌ index.html não encontrado');
    }
  } else {
    console.log('❌ Pasta dist/ não existe - Execute npm run build');
  }
}

// Verificar package.json
function verificarPackage() {
  console.log('\n📋 VERIFICANDO CONFIGURAÇÃO:');
  const fs = require('fs');
  const path = require('path');
  
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    console.log('📦 Nome:', packageJson.name);
    console.log('🔢 Versão:', packageJson.version);
    console.log('🏗️  Build script:', packageJson.scripts?.build);
    console.log('🚀 Dev script:', packageJson.scripts?.dev);
    
  } catch (err) {
    console.log('❌ Erro ao ler package.json:', err.message);
  }
}

// Executar diagnósticos
async function executarDiagnostico() {
  verificarPackage();
  verificarBuild();
  await testarSupabase();
  await testarURLs();
  
  console.log('\n🎯 RESUMO DO DIAGNÓSTICO:');
  console.log('========================');
  console.log('1. Verifique se o build está atualizado');
  console.log('2. Confirme se os arquivos foram enviados para /var/www/duopass/dist/');
  console.log('3. Verifique se o nginx está usando a configuração correta');
  console.log('4. Confirme se as variáveis de ambiente estão corretas no servidor');
  console.log('\n💡 POSSÍVEIS CAUSAS DA DESSINCRONIZAÇÃO:');
  console.log('- Build desatualizado no servidor');
  console.log('- Cache do navegador/CDN');
  console.log('- Configuração nginx incorreta');
  console.log('- Variáveis de ambiente diferentes');
  console.log('- DNS apontando para servidor errado');
}

executarDiagnostico().catch(console.error);