# 🔧 Correção Nginx - DuoPass

## 🚨 Problema Identificado

Os domínios `duopassclub.ch` e `www.duopassclub.ch` estão mostrando **ambientes diferentes** devido a configurações nginx conflitantes no servidor.

### Causa Raiz:
- Múltiplas configurações nginx ativas simultaneamente
- Conflito entre configuração de arquivos estáticos e proxy reverso
- Possível cache ou configuração DNS inconsistente

## 📁 Arquivos Criados para Solução

### 1. `nginx-unified.conf`
**Configuração nginx unificada e otimizada**
- ✅ Serve arquivos estáticos React build
- ✅ Redirecionamento HTTP → HTTPS
- ✅ Headers de segurança completos
- ✅ Cache otimizado para performance
- ✅ SPA routing para React Router
- ✅ SSL/TLS configurado corretamente
- ✅ Rate limiting e proteções

### 2. `deploy-nginx-fix.sh`
**Script automatizado de deploy**
- ✅ Remove configurações conflitantes
- ✅ Faz backup automático
- ✅ Aplica nova configuração
- ✅ Testa antes de ativar
- ✅ Verifica SSL e estrutura

### 3. `check-nginx-status.sh`
**Script de diagnóstico rápido**
- ✅ Verifica status atual
- ✅ Identifica conflitos
- ✅ Testa conectividade
- ✅ Analisa logs
- ✅ Fornece recomendações

### 4. `NGINX_DIAGNOSTIC_GUIDE.md`
**Guia completo de diagnóstico**
- ✅ Comandos de troubleshooting
- ✅ Checklist de verificação
- ✅ Soluções para problemas comuns

## 🚀 Como Aplicar a Correção

### Passo 1: Preparação
```bash
# 1. Conectar ao servidor
ssh usuario@servidor

# 2. Navegar para diretório com os arquivos
cd /caminho/para/DuoPass

# 3. Verificar arquivos
ls -la nginx-unified.conf deploy-nginx-fix.sh check-nginx-status.sh

# 4. Dar permissões
chmod +x deploy-nginx-fix.sh check-nginx-status.sh
```

### Passo 2: Diagnóstico (Opcional)
```bash
# Executar diagnóstico para entender o problema atual
sudo ./check-nginx-status.sh
```

### Passo 3: Aplicar Correção
```bash
# Executar script de correção
sudo ./deploy-nginx-fix.sh
```

### Passo 4: Verificação
```bash
# Testar configuração
sudo nginx -t

# Verificar status
sudo systemctl status nginx

# Testar URLs
curl -I https://duopassclub.ch
curl -I https://www.duopassclub.ch
```

## 🔍 Verificações Pós-Deploy

### URLs para Testar:
- ✅ https://duopassclub.ch
- ✅ https://www.duopassclub.ch
- ✅ https://duopassclub.ch/experiencias
- ✅ https://duopassclub.ch/ofertas
- ✅ https://duopassclub.ch/memberships

### Checklist de Verificação:
- [ ] Ambos os domínios carregam o mesmo conteúdo
- [ ] Redirecionamento HTTP → HTTPS funciona
- [ ] Rotas SPA funcionam corretamente
- [ ] SSL válido em ambos os domínios
- [ ] Performance adequada (cache funcionando)
- [ ] Logs sem erros críticos

## 🛠️ Configuração Técnica

### Estrutura de Arquivos:
```
/var/www/duopass/
└── dist/                 ← Build da aplicação React
    ├── index.html
    ├── assets/
    └── ...
```

### Logs Importantes:
```bash
# Logs de acesso
sudo tail -f /var/log/nginx/duopass_access.log

# Logs de erro
sudo tail -f /var/log/nginx/duopass_error.log

# Logs gerais do nginx
sudo tail -f /var/log/nginx/error.log
```

### Comandos Úteis:
```bash
# Recarregar nginx
sudo systemctl reload nginx

# Reiniciar nginx
sudo systemctl restart nginx

# Testar configuração
sudo nginx -t

# Ver configuração ativa
sudo nginx -T | grep -A 20 "duopassclub.ch"
```

## 🚨 Troubleshooting

### Se o site não carregar:
1. **Verificar nginx**: `sudo systemctl status nginx`
2. **Verificar logs**: `sudo tail -f /var/log/nginx/error.log`
3. **Verificar arquivos**: `ls -la /var/www/duopass/dist/`
4. **Verificar permissões**: `sudo chown -R www-data:www-data /var/www/duopass`

### Se SSL não funcionar:
1. **Verificar certificados**: `sudo certbot certificates`
2. **Reconfigurar**: `sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch`
3. **Verificar firewall**: `sudo ufw status`

### Se ainda houver diferenças:
1. **Limpar cache do navegador**
2. **Verificar DNS**: `nslookup duopassclub.ch`
3. **Testar direto**: `curl -H "Host: duopassclub.ch" http://IP_SERVIDOR`
4. **Verificar CDN** (se houver)

## 📋 Rollback (Se Necessário)

```bash
# 1. Parar nginx
sudo systemctl stop nginx

# 2. Restaurar backup
sudo cp /etc/nginx/backup/TIMESTAMP/* /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/CONFIG_ANTERIOR /etc/nginx/sites-enabled/

# 3. Testar e reiniciar
sudo nginx -t
sudo systemctl start nginx
```

## 📞 Suporte

### Informações para Coleta:
```bash
# Executar e enviar resultado:
sudo ./check-nginx-status.sh > diagnostico.txt

# Logs recentes:
sudo tail -50 /var/log/nginx/error.log > nginx_errors.txt

# Configuração ativa:
sudo nginx -T > nginx_config.txt
```

## 🎯 Resultado Esperado

Após aplicar a correção:
- ✅ `duopassclub.ch` e `www.duopassclub.ch` mostram **exatamente o mesmo conteúdo**
- ✅ Redirecionamento automático HTTP → HTTPS
- ✅ SSL válido e seguro
- ✅ Performance otimizada com cache
- ✅ Todas as rotas SPA funcionando
- ✅ Headers de segurança aplicados
- ✅ Logs organizados e limpos

---

**⚡ Execução Rápida:**
```bash
chmod +x deploy-nginx-fix.sh && sudo ./deploy-nginx-fix.sh
```

**🔍 Verificação Rápida:**
```bash
chmod +x check-nginx-status.sh && sudo ./check-nginx-status.sh
```