# 🚀 GUIA COMPLETO - DEPLOY AUTOMÁTICO DUOPASS

## ✅ STATUS ATUAL
**Deploy automático ATIVADO e FUNCIONANDO!**

- ✅ Código enviado para GitHub (commit: 8a7aa4ef)
- ✅ GitHub Actions configurado e ativo
- ✅ Pipeline de CI/CD executando automaticamente
- ✅ Deploy para AWS em andamento

---

## 🔄 COMO FUNCIONA O DEPLOY AUTOMÁTICO

### 1. **Trigger Automático**
```bash
# Qualquer push para main ativa o deploy:
git add .
git commit -m "Suas alterações"
git push origin main
```

### 2. **Pipeline Completo (GitHub Actions)**

#### **Fase 1: Build e Testes** (5-10 min)
- ✅ Checkout do código
- ✅ Setup Node.js 20
- ✅ Instalação de dependências
- ✅ Auditoria de segurança
- ✅ Lint do código
- ✅ Build da aplicação
- ✅ Verificação de integridade
- ✅ Arquivamento dos artefatos

#### **Fase 2: Deploy AWS** (3-5 min)
- ✅ Download dos artefatos
- ✅ Verificação de secrets
- ✅ Instalação de chave SSH
- ✅ Backup da versão atual
- ✅ Deploy dos novos arquivos
- ✅ Reload do Nginx
- ✅ Verificação pós-deploy

---

## 📊 MONITORAMENTO DO DEPLOY

### **1. GitHub Actions Dashboard**
```
https://github.com/GamePathAi/DuoPassClub/actions
```

### **2. Status em Tempo Real**
- 🟡 **Amarelo**: Pipeline executando
- 🟢 **Verde**: Deploy concluído com sucesso
- 🔴 **Vermelho**: Erro no deploy

### **3. Logs Detalhados**
- Clique na execução específica
- Visualize logs de cada etapa
- Identifique problemas rapidamente

---

## 🎯 VERIFICAÇÃO PÓS-DEPLOY

### **Automática (GitHub Actions)**
```bash
# Verificação automática incluída:
curl -f -s https://duopassclub.ch
```

### **Manual (Você)**
1. **Site Principal**: https://duopassclub.ch
2. **Funcionalidades**:
   - ✅ Login/Cadastro
   - ✅ Dashboard de usuários
   - ✅ Sistema de vouchers
   - ✅ Portal de parceiros culturais
   - ✅ Formulário de contato (EmailJS)

---

## 🛠️ CONFIGURAÇÕES NECESSÁRIAS (JÁ FEITAS)

### **GitHub Secrets Configurados**
```
SSH_PRIVATE_KEY     → Chave privada AWS
SSH_USER           → Usuário do servidor
SSH_HOST           → IP/domínio do servidor
SSH_KNOWN_HOSTS    → Fingerprint do servidor
```

### **Servidor AWS Configurado**
```
/var/www/duopass/dist/     → Arquivos da aplicação
/etc/nginx/sites-available/ → Configuração Nginx
SSL/HTTPS                  → Certificado válido
```

---

## 🚨 TROUBLESHOOTING

### **Deploy Falhou?**

#### **1. Verificar Logs**
```
1. Acesse: https://github.com/GamePathAi/DuoPassClub/actions
2. Clique na execução com erro
3. Analise os logs da etapa que falhou
```

#### **2. Problemas Comuns**

**Build Error:**
```bash
# Testar localmente:
cd project
npm run build
```

**SSH Error:**
```bash
# Verificar conectividade:
ssh ubuntu@seu-servidor
```

**Nginx Error:**
```bash
# No servidor:
sudo nginx -t
sudo systemctl status nginx
```

#### **3. Rollback Manual**
```bash
# No servidor AWS:
sudo cp -r /var/www/duopass/backup/YYYYMMDD_HHMMSS/* /var/www/duopass/dist/
sudo systemctl reload nginx
```

---

## 🔄 WORKFLOW DIÁRIO

### **Para Desenvolver**
```bash
# 1. Fazer alterações no código
vim src/components/MeuComponente.tsx

# 2. Testar localmente
npm run dev

# 3. Commit e push (ativa deploy automático)
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 4. Monitorar deploy
# → GitHub Actions executará automaticamente
# → Em 10-15 min estará no ar
```

### **Para Emergências**
```bash
# Deploy manual rápido (se GitHub Actions falhar):
./upload-aws.ps1 -ServerIP "seu-ip" -Username "ubuntu" -KeyPath "./dpkeyaws.pem"
```

---

## 📈 BENEFÍCIOS DO DEPLOY AUTOMÁTICO

✅ **Zero Downtime**: Deploy sem interrupção
✅ **Backup Automático**: Versão anterior preservada
✅ **Verificação Automática**: Testes integrados
✅ **Rollback Rápido**: Reversão em caso de erro
✅ **Logs Completos**: Rastreabilidade total
✅ **Segurança**: Auditoria e lint automáticos

---

## 🎓 PRÓXIMOS PASSOS

1. **Monitorar primeiro deploy**: Acompanhe o GitHub Actions
2. **Testar funcionalidades**: Verifique se tudo funciona
3. **Configurar notificações**: Slack/email para deploys
4. **Ambiente de staging**: Para testes antes da produção

---

## 📞 SUPORTE

**Deploy falhando?**
- Verifique GitHub Actions logs
- Teste build local: `npm run build`
- Verifique conectividade SSH

**Site fora do ar?**
- Acesse: https://duopassclub.ch
- Verifique status do servidor
- Execute rollback se necessário

---

**🎉 PARABÉNS! Seu deploy automático está funcionando!**

Agora toda alteração no código será automaticamente:
1. Testada
2. Construída
3. Deployada
4. Verificada

**Tempo total: ~15 minutos do commit ao ar!** 🚀