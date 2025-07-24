# 🎭 PLANO COMPLETO DE SINCRONIZAÇÃO - DuoPass

## 🎯 OBJETIVO
Sincronizar o ambiente de desenvolvimento com a produção em `duopassclub.ch`

## 🔍 PROBLEMAS IDENTIFICADOS
- ❌ Tabelas `cultural_experiences` não existem no Supabase de produção
- ❌ Servidor pode estar servindo build desatualizado
- ❌ Possível configuração nginx incorreta
- ❌ Dessincronização entre dev e produção

## 🚀 PLANO DE EXECUÇÃO

### PASSO 1: Criar Tabelas no Supabase ⏳
**Status:** PENDENTE - AÇÃO MANUAL NECESSÁRIA

**Instruções:**
1. Acesse: https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new
2. Copie TODO o conteúdo do arquivo: `EXECUTE_NO_SUPABASE.sql`
3. Cole no SQL Editor e clique em "RUN"
4. Aguarde a execução completa

**Resultado esperado:**
- ✅ Tabela `cultural_partners` criada
- ✅ Tabela `cultural_experiences` criada
- ✅ Tabela `experience_stories` criada
- ✅ Tabela `cultural_connections` criada
- ✅ Políticas RLS configuradas
- ✅ Dados de exemplo inseridos

### PASSO 2: Sincronizar Build com Servidor ✅
**Status:** PREPARADO

**Arquivos prontos:**
- ✅ Build atualizado na pasta `dist/`
- ✅ Instruções detalhadas em `INSTRUCOES_DEPLOY_SYNC.md`
- ✅ Script de verificação `verificar-sync.sh`

**Comandos principais:**
```bash
# No servidor (SSH):
sudo rm -rf /var/www/duopass/dist/*

# Do seu computador local:
scp -r dist/* seu-usuario@duopassclub.ch:/tmp/duopass-new/

# No servidor:
sudo cp -r /tmp/duopass-new/* /var/www/duopass/dist/
sudo chown -R www-data:www-data /var/www/duopass/dist
```

### PASSO 3: Aplicar Configuração Nginx ✅
**Status:** PREPARADO

**Arquivo:** `nginx-unified.conf`

**Comandos:**
```bash
# Enviar configuração:
scp nginx-unified.conf seu-usuario@duopassclub.ch:/tmp/

# No servidor:
sudo cp /tmp/nginx-unified.conf /etc/nginx/sites-available/duopass
sudo ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### PASSO 4: Verificação Final ✅
**Status:** PREPARADO

**Script:** `verificar-sync.sh`

**Comandos:**
```bash
# No servidor:
bash verificar-sync.sh

# Teste manual:
curl -I https://duopassclub.ch
curl -I https://www.duopassclub.ch
```

## 📋 ORDEM DE EXECUÇÃO

1. **PRIMEIRO:** Execute SQL no Supabase (MANUAL)
2. **SEGUNDO:** Siga `INSTRUCOES_DEPLOY_SYNC.md`
3. **TERCEIRO:** Aplique `nginx-unified.conf`
4. **QUARTO:** Execute `verificar-sync.sh`
5. **QUINTO:** Limpe cache do navegador (Ctrl+F5)

## 🎉 RESULTADO ESPERADO

Após completar todos os passos:
- ✅ `duopassclub.ch` e `www.duopassclub.ch` mostram conteúdo idêntico
- ✅ Experiências culturais funcionam (tabelas criadas)
- ✅ Navegação SPA funciona corretamente
- ✅ SSL válido em ambos os domínios
- ✅ Performance otimizada
- ✅ Sincronização completa dev ↔ produção

## ⏱️ TEMPO ESTIMADO
**15-30 minutos** (incluindo tempo de upload)

## 🆘 SUPORTE
Se encontrar problemas:
1. Verifique logs: `sudo tail -f /var/log/nginx/duopass_error.log`
2. Teste conectividade: `curl -I https://duopassclub.ch`
3. Verifique arquivos: `ls -la /var/www/duopass/dist/`

---
**Gerado em:** 23/07/2025, 16:03:42
**Status:** Plano preparado - Aguardando execução manual do Supabase
**Próximo passo:** Executar SQL no Supabase SQL Editor
