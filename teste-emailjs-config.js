// Script para testar a configuração do EmailJS
// Execute com: node teste-emailjs-config.js

import dotenv from 'dotenv';
import emailjs from '@emailjs/browser';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.production' });

// Configuração do EmailJS
const EMAILJS_CONFIG = {
  serviceId: process.env.VITE_EMAILJS_SERVICE_ID || 'service_nj1x65i',
  templateIds: {
    admin: process.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN || 'template_r3t7pti',
    partner: process.env.VITE_EMAILJS_TEMPLATE_ID_PARTNER || 'template_r3t7pti',
  },
  publicKey: process.env.VITE_EMAILJS_PUBLIC_KEY
};

// Função para testar a configuração
async function testEmailJSConfig() {
  console.log('🔍 Testando configuração do EmailJS...');
  console.log('Configuração carregada:', EMAILJS_CONFIG);
  
  // Verificar se a chave pública está definida
  if (!EMAILJS_CONFIG.publicKey || EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
    console.error('❌ ERRO: Chave pública não definida ou inválida!');
    console.log('Por favor, atualize VITE_EMAILJS_PUBLIC_KEY no arquivo .env.production');
    console.log('Obtenha a chave em: https://dashboard.emailjs.com/admin/account');
    return;
  }
  
  try {
    // Inicializar EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('✅ EmailJS inicializado com sucesso');
    
    // Testar envio de email
    const testParams = {
      to_email: 'test@example.com', // Email de teste
      contact_name: 'Teste Automatizado',
      business_name: 'Sistema DuoPass',
      contact_email: 'noreply@duopassclub.ch',
      contact_date: new Date().toLocaleString(),
      reply_to: 'contact@duopassclub.ch'
    };
    
    console.log('📧 Tentando enviar email de teste...');
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.partner,
      testParams
    );
    
    console.log('✅ Email de teste enviado com sucesso!', response);
    console.log('Status:', response.status);
    console.log('Text:', response.text);
    
  } catch (error) {
    console.error('❌ Erro ao testar EmailJS:', error);
    console.log('Detalhes do erro:');
    console.log('- Status:', error.status);
    console.log('- Texto:', error.text);
    
    if (error.text && error.text.includes('The Public Key is invalid')) {
      console.log('\n🔑 SOLUÇÃO: Atualize sua chave pública em .env.production');
      console.log('Obtenha a chave correta em: https://dashboard.emailjs.com/admin/account');
    }
  }
}

// Executar o teste
testEmailJSConfig();