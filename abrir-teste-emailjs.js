// Script para abrir o teste do EmailJS no navegador
// Execute com: node abrir-teste-emailjs.js

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho para o arquivo HTML de teste
const testFilePath = resolve(__dirname, 'teste-emailjs-browser.html');

// Verificar se o arquivo existe
if (!fs.existsSync(testFilePath)) {
  console.error('❌ Arquivo de teste não encontrado:', testFilePath);
  process.exit(1);
}

// Função para abrir o arquivo no navegador padrão
function openInBrowser(filePath) {
  const fileUrl = `file://${filePath}`;
  
  // Detectar o sistema operacional
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    // Windows
    command = `start "" "${fileUrl}"`;
  } else if (platform === 'darwin') {
    // macOS
    command = `open "${fileUrl}"`;
  } else {
    // Linux e outros
    command = `xdg-open "${fileUrl}"`;
  }
  
  console.log('🔍 Abrindo teste do EmailJS no navegador...');
  
  exec(command, (error) => {
    if (error) {
      console.error('❌ Erro ao abrir o navegador:', error);
      return;
    }
    
    console.log('✅ Teste aberto no navegador!');
    console.log('📋 Instruções:');
    console.log('1. Preencha o campo "Public Key" com sua chave do EmailJS');
    console.log('2. Atualize o campo "Email de Destino" com seu email');
    console.log('3. Clique em "Enviar Email de Teste"');
    console.log('4. Verifique o resultado e sua caixa de entrada');
    console.log('\n🔑 Obtenha sua chave pública em: https://dashboard.emailjs.com/admin/account');
  });
}

// Abrir o arquivo no navegador
openInBrowser(testFilePath);

console.log('\n📧 TESTE DE CONFIGURAÇÃO DO EMAILJS');
console.log('===============================');
console.log('Este script abre uma página de teste para verificar a configuração do EmailJS.');
console.log('Siga as instruções na página para testar o envio de emails.');