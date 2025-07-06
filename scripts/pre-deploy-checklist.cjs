#!/usr/bin/env node

// Script de Checklist Pré-Deploy para DuoPass
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PreDeployChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    this.projectRoot = process.cwd();
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  checkFile(filePath, description) {
    const fullPath = path.join(this.projectRoot, filePath);
    if (fs.existsSync(fullPath)) {
      this.passed.push(`✓ ${description}`);
      return true;
    } else {
      this.errors.push(`✗ ${description} - Arquivo não encontrado: ${filePath}`);
      return false;
    }
  }

  checkEnvVariable(varName, required = true) {
    const envFile = path.join(this.projectRoot, '.env.production');
    if (!fs.existsSync(envFile)) {
      this.errors.push('✗ Arquivo .env.production não encontrado');
      return false;
    }

    const envContent = fs.readFileSync(envFile, 'utf8');
    const hasVar = envContent.includes(`${varName}=`);
    const hasValue = envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=sua_`);

    if (required && !hasVar) {
      this.errors.push(`✗ Variável de ambiente obrigatória não encontrada: ${varName}`);
      return false;
    }

    if (hasVar && !hasValue) {
      this.warnings.push(`⚠ Variável ${varName} ainda tem valor placeholder`);
      return false;
    }

    if (hasVar && hasValue) {
      this.passed.push(`✓ Variável ${varName} configurada`);
      return true;
    }

    return true;
  }

  checkPackageJson() {
    this.log('\n📦 Verificando package.json...', 'info');
    
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (!this.checkFile('package.json', 'Package.json existe')) return;

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Verificar scripts essenciais
    const requiredScripts = ['build', 'preview'];
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        this.passed.push(`✓ Script '${script}' configurado`);
      } else {
        this.errors.push(`✗ Script '${script}' não encontrado`);
      }
    });

    // Verificar dependências críticas
    const criticalDeps = ['react', 'react-dom', 'vite'];
    criticalDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        this.passed.push(`✓ Dependência '${dep}' instalada`);
      } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
        this.passed.push(`✓ Dependência '${dep}' instalada (dev)`);
      } else {
        this.errors.push(`✗ Dependência crítica '${dep}' não encontrada`);
      }
    });
  }

  checkEnvironmentVariables() {
    this.log('\n🔧 Verificando variáveis de ambiente...', 'info');
    
    // Variáveis obrigatórias
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_APP_URL'
    ];

    requiredVars.forEach(varName => {
      this.checkEnvVariable(varName, true);
    });

    // Variáveis opcionais mas recomendadas
    const optionalVars = [
      'VITE_STRIPE_PUBLISHABLE_KEY',
      'VITE_GA_TRACKING_ID',
      'VITE_SENTRY_DSN'
    ];

    optionalVars.forEach(varName => {
      this.checkEnvVariable(varName, false);
    });
  }

  checkBuildFiles() {
    this.log('\n🏗️ Verificando arquivos de build...', 'info');
    
    const buildFiles = [
      'vite.config.ts',
      'tsconfig.json',
      'index.html'
    ];

    buildFiles.forEach(file => {
      this.checkFile(file, `Arquivo de build: ${file}`);
    });
  }

  checkDeploymentFiles() {
    this.log('\n🚀 Verificando arquivos de deployment...', 'info');
    
    const deployFiles = [
      'nginx.conf',
      'deploy.sh',
      'public/sw.js'
    ];

    deployFiles.forEach(file => {
      this.checkFile(file, `Arquivo de deployment: ${file}`);
    });
  }

  checkSourceFiles() {
    this.log('\n📁 Verificando arquivos fonte críticos...', 'info');
    
    const criticalFiles = [
      'src/main.tsx',
      'src/App.tsx',
      'src/lib/supabase.ts',
      'src/lib/analytics.ts',
      'src/lib/performance.ts',
      'src/lib/seo.ts'
    ];

    criticalFiles.forEach(file => {
      this.checkFile(file, `Arquivo fonte: ${file}`);
    });
  }

  checkBuildProcess() {
    this.log('\n🔨 Testando processo de build...', 'info');
    
    try {
      // Verificar se node_modules existe
      if (!fs.existsSync(path.join(this.projectRoot, 'node_modules'))) {
        this.warnings.push('⚠ node_modules não encontrado - execute npm install');
        return;
      }

      // Tentar build de teste
      this.log('Executando build de teste...', 'info');
      execSync('npm run build', { stdio: 'pipe', cwd: this.projectRoot });
      this.passed.push('✓ Build executado com sucesso');
      
      // Verificar se dist foi criado
      if (fs.existsSync(path.join(this.projectRoot, 'dist'))) {
        this.passed.push('✓ Diretório dist criado');
        
        // Verificar arquivos essenciais no dist
        const distFiles = ['index.html', 'assets'];
        distFiles.forEach(file => {
          if (fs.existsSync(path.join(this.projectRoot, 'dist', file))) {
            this.passed.push(`✓ Arquivo dist/${file} criado`);
          } else {
            this.warnings.push(`⚠ Arquivo dist/${file} não encontrado`);
          }
        });
      } else {
        this.errors.push('✗ Diretório dist não foi criado');
      }
      
    } catch (error) {
      this.errors.push(`✗ Erro no build: ${error.message}`);
    }
  }

  checkSecurityHeaders() {
    this.log('\n🔒 Verificando configurações de segurança...', 'info');
    
    const nginxPath = path.join(this.projectRoot, 'nginx.conf');
    if (fs.existsSync(nginxPath)) {
      const nginxContent = fs.readFileSync(nginxPath, 'utf8');
      
      const securityHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Content-Security-Policy',
        'Strict-Transport-Security'
      ];
      
      securityHeaders.forEach(header => {
        if (nginxContent.includes(header)) {
          this.passed.push(`✓ Header de segurança: ${header}`);
        } else {
          this.warnings.push(`⚠ Header de segurança ausente: ${header}`);
        }
      });
      
      // Verificar HTTPS redirect
      if (nginxContent.includes('return 301 https://')) {
        this.passed.push('✓ Redirecionamento HTTP → HTTPS configurado');
      } else {
        this.warnings.push('⚠ Redirecionamento HTTP → HTTPS não encontrado');
      }
    }
  }

  checkPerformanceOptimizations() {
    this.log('\n⚡ Verificando otimizações de performance...', 'info');
    
    // Verificar Service Worker
    if (fs.existsSync(path.join(this.projectRoot, 'public/sw.js'))) {
      this.passed.push('✓ Service Worker configurado');
    } else {
      this.warnings.push('⚠ Service Worker não encontrado');
    }
    
    // Verificar compressão gzip no nginx
    const nginxPath = path.join(this.projectRoot, 'nginx.conf');
    if (fs.existsSync(nginxPath)) {
      const nginxContent = fs.readFileSync(nginxPath, 'utf8');
      if (nginxContent.includes('gzip on')) {
        this.passed.push('✓ Compressão gzip configurada');
      } else {
        this.warnings.push('⚠ Compressão gzip não configurada');
      }
    }
    
    // Verificar cache headers
    if (fs.existsSync(nginxPath)) {
      const nginxContent = fs.readFileSync(nginxPath, 'utf8');
      if (nginxContent.includes('expires') || nginxContent.includes('Cache-Control')) {
        this.passed.push('✓ Headers de cache configurados');
      } else {
        this.warnings.push('⚠ Headers de cache não configurados');
      }
    }
  }

  generateReport() {
    this.log('\n📊 RELATÓRIO FINAL', 'info');
    this.log('='.repeat(50), 'info');
    
    if (this.passed.length > 0) {
      this.log('\n✅ VERIFICAÇÕES APROVADAS:', 'success');
      this.passed.forEach(item => this.log(item, 'success'));
    }
    
    if (this.warnings.length > 0) {
      this.log('\n⚠️  AVISOS:', 'warning');
      this.warnings.forEach(item => this.log(item, 'warning'));
    }
    
    if (this.errors.length > 0) {
      this.log('\n❌ ERROS CRÍTICOS:', 'error');
      this.errors.forEach(item => this.log(item, 'error'));
    }
    
    this.log('\n' + '='.repeat(50), 'info');
    this.log(`Total: ${this.passed.length} aprovadas, ${this.warnings.length} avisos, ${this.errors.length} erros`, 'info');
    
    if (this.errors.length === 0) {
      this.log('\n🎉 PRONTO PARA DEPLOY!', 'success');
      return true;
    } else {
      this.log('\n🚫 CORRIJA OS ERROS ANTES DO DEPLOY', 'error');
      return false;
    }
  }

  run() {
    this.log('🔍 Iniciando checklist pré-deploy do DuoPass...', 'info');
    
    this.checkPackageJson();
    this.checkEnvironmentVariables();
    this.checkBuildFiles();
    this.checkDeploymentFiles();
    this.checkSourceFiles();
    this.checkBuildProcess();
    this.checkSecurityHeaders();
    this.checkPerformanceOptimizations();
    
    const success = this.generateReport();
    process.exit(success ? 0 : 1);
  }
}

// Executar checklist
if (require.main === module) {
  const checker = new PreDeployChecker();
  checker.run();
}

module.exports = PreDeployChecker;