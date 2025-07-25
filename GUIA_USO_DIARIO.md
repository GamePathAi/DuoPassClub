# 📅 GUIA DE USO DIÁRIO - DEPLOY AUTOMÁTICO DUOPASS

## 🚀 COMANDOS ESSENCIAIS

### Deploy Automático (Recomendado)
```powershell
# Comando principal - faz tudo automaticamente
.\deploy-automatico-completo.ps1 -Modo auto -Mensagem "Suas alterações"

# Exemplos práticos:
.\deploy-automatico-completo.ps1 -Modo auto -Mensagem "Fix bug login"
.\deploy-automatico-completo.ps1 -Modo auto -Mensagem "Nova funcionalidade vouchers"
.\deploy-automatico-completo.ps1 -Modo auto -Mensagem "Atualização UI dashboard"
```

### Deploy Manual (Emergência)
```powershell
# Se GitHub Actions falhar
.\deploy-automatico-completo.ps1 -Modo manual

# Ou usar script direto
.\upload-aws.ps1 -ServerIP "duopassclub.ch" -Username "ubuntu" -KeyPath "./dpkeyaws.pem"
```

### Verificação Rápida
```powershell
# Verificar se site está online
.\deploy-automatico-completo.ps1 -Modo verificar
```

## 📋 WORKFLOW DIÁRIO

### 1. Desenvolvimento Local
```powershell
# Sempre trabalhar na pasta project
cd project

# Iniciar servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:5175

# Fazer alterações no código...
# Testar localmente...
```

### 2. Deploy para Produção
```powershell
# Voltar para pasta raiz
cd ..

# Deploy automático
.\deploy-automatico-completo.ps1 -Modo auto -Mensagem "Descrição das alterações"

# O script fará:
# ✅ Build do projeto
# ✅ Commit e push para GitHub
# ✅ GitHub Actions fará deploy automático
# ✅ Verificação do site
```

### 3. Monitoramento
```powershell
# Verificar status do deploy
.\deploy-automatico-completo.ps1 -Modo verificar

# Acessar GitHub Actions
# URL será exibida automaticamente
```

## 🔧 COMANDOS POR SITUAÇÃO

### Primeira Configuração
```powershell
# Configurar tudo pela primeira vez
.\setup-deploy-automatico.ps1

# Seguir instruções na tela
# Configurar secrets no GitHub
# Fazer primeiro push
```

### Desenvolvimento Normal
```powershell
# 1. Trabalhar no código
cd project
npm run dev
# ... fazer alterações ...

# 2. Deploy quando pronto
cd ..
.\deploy-automatico-completo.ps1 -Modo auto -Mensagem "Suas alterações"
```

### Emergência (GitHub Actions offline)
```powershell
# Deploy direto para AWS
.\deploy-automatico-completo.ps1 -Modo manual

# Ou build + upload manual
cd project
npm run build
cd ..
.\upload-aws.ps1 -ServerIP "duopassclub.ch" -Username "ubuntu"
```

### Debugging
```powershell
# Build local para testar
cd project
npm run build
npm run preview
# Acesse: http://localhost:4173

# Verificar logs do servidor
ssh -i dpkeyaws.pem ubuntu@duopassclub.ch
sudo tail -f /var/log/nginx/error.log
```

## 📊 MONITORAMENTO

### URLs Importantes
- **Site**: https://duopassclub.ch
- **GitHub Actions**: https://github.com/SEU_USUARIO/duopass/actions
- **Logs AWS**: SSH para servidor

### Verificações Automáticas
```powershell
# Status completo
.\deploy-automatico-completo.ps1 -Modo verificar

# Teste manual
Invoke-WebRequest -Uri "https://duopassclub.ch" -Method Head
```

## 🚨 TROUBLESHOOTING

### Problema: Build Falha
```powershell
# Limpar cache e reinstalar
cd project
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
npm run build
```

### Problema: GitHub Actions Falha
```powershell
# Verificar secrets no GitHub
# Settings > Secrets and variables > Actions

# Deploy manual como backup
.\deploy-automatico-completo.ps1 -Modo manual
```

### Problema: Site Offline
```powershell
# Conectar ao servidor
ssh -i dpkeyaws.pem ubuntu@duopassclub.ch

# Verificar Nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl reload nginx

# Verificar logs
sudo tail -f /var/log/nginx/error.log
```

### Problema: SSL/Certificado
```powershell
# No servidor AWS
ssh -i dpkeyaws.pem ubuntu@duopassclub.ch

# Renovar certificado
sudo certbot renew
sudo systemctl reload nginx

# Verificar validade
curl -vI https://duopassclub.ch 2>&1 | grep -i ssl
```

## 📈 DICAS DE PRODUTIVIDADE

### Aliases Úteis (PowerShell Profile)
```powershell
# Adicionar ao seu $PROFILE
function Deploy-Auto { .\deploy-automatico-completo.ps1 -Modo auto -Mensagem $args[0] }
function Deploy-Manual { .\deploy-automatico-completo.ps1 -Modo manual }
function Check-Site { .\deploy-automatico-completo.ps1 -Modo verificar }
function Dev-Start { cd project; npm run dev }
function Build-Test { cd project; npm run build; npm run preview }

# Uso:
Deploy-Auto "Fix bug login"
Deploy-Manual
Check-Site
Dev-Start
Build-Test
```

### Scripts Rápidos
```powershell
# Deploy rápido com timestamp
.\deploy-automatico-completo.ps1 -Modo auto -Mensagem "Update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

# Build forçado (limpa cache)
.\deploy-automatico-completo.ps1 -Modo auto -ForcarBuild -Mensagem "Rebuild completo"
```

## 📋 CHECKLIST DIÁRIO

### Antes de Começar
- [ ] Verificar se site está online: `Check-Site`
- [ ] Puxar últimas alterações: `git pull`
- [ ] Iniciar dev server: `cd project && npm run dev`

### Antes do Deploy
- [ ] Testar localmente: `http://localhost:5175`
- [ ] Build local: `npm run build && npm run preview`
- [ ] Commit com mensagem descritiva

### Após Deploy
- [ ] Verificar GitHub Actions
- [ ] Testar site em produção: `https://duopassclub.ch`
- [ ] Verificar funcionalidades principais
- [ ] Monitorar logs se necessário

## 🎯 COMANDOS MAIS USADOS

```powershell
# Top 5 comandos diários

# 1. Deploy automático
.\deploy-automatico-completo.ps1 -Modo auto -Mensagem "Suas alterações"

# 2. Verificar site
.\deploy-automatico-completo.ps1 -Modo verificar

# 3. Desenvolvimento local
cd project && npm run dev

# 4. Build e preview
cd project && npm run build && npm run preview

# 5. Deploy manual (emergência)
.\deploy-automatico-completo.ps1 -Modo manual
```

## 📞 SUPORTE RÁPIDO

### Logs Importantes
```powershell
# GitHub Actions
# https://github.com/SEU_USUARIO/duopass/actions

# Servidor AWS
ssh -i dpkeyaws.pem ubuntu@duopassclub.ch
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Local
cd project
npm run build  # Ver erros de build
```

### Contatos de Emergência
- **Documentação**: `SISTEMA_DEPLOY_AUTOMATICO_COMPLETO.md`
- **Scripts**: `deploy-automatico-completo.ps1`
- **Configuração**: `setup-deploy-automatico.ps1`

---

## ✅ RESUMO EXECUTIVO

**Para deploy normal:**
```powershell
.\deploy-automatico-completo.ps1 -Modo auto -Mensagem "Suas alterações"
```

**Para emergência:**
```powershell
.\deploy-automatico-completo.ps1 -Modo manual
```

**Para verificar:**
```powershell
.\deploy-automatico-completo.ps1 -Modo verificar
```

🎉 **Deploy automático configurado e funcionando!**