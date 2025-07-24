# 🔧 Guia de Diagnóstico Nginx - DuoPass

## 🚨 Problema Identificado
Os domínios `duopassclub.ch` e `www.duopassclub.ch` estão mostrando ambientes diferentes devido a configurações nginx conflitantes.

## 📊 Diagnóstico Atual

### Configurações Encontradas:
1. **duopass_nginx.conf** - Serve arquivos estáticos de `/var/www/duopass/dist`
2. **nginx-proxy.conf** - Proxy reverso para `localhost:3000`
3. **project/nginx.conf** - Configuração de produção para arquivos estáticos

### 🔍 Comandos de Diagnóstico

```bash
# 1. Verificar configurações ativas
sudo nginx -T | grep -A 10 -B 5 "duopassclub.ch"

# 2. Verificar sites habilitados
ls -la /etc/nginx/sites-enabled/

# 3. Verificar qual configuração está sendo usada
sudo nginx -t -c /etc/nginx/nginx.conf

# 4. Verificar logs de erro
sudo tail -f /var/log/nginx/error.log

# 5. Testar conectividade
curl -I http://duopassclub.ch
curl -I https://duopassclub.ch
curl -I https://www.duopassclub.ch

# 6. Verificar processos rodando na porta 3000
sudo netstat -tlnp | grep :3000
sudo lsof -i :3000

# 7. Verificar se há múltiplas instâncias
ps aux | grep nginx
ps aux | grep node
```

## 🛠️ Solução Implementada

### Arquivo: `nginx-unified.conf`
- ✅ Configuração unificada para ambos os domínios
- ✅ Serve arquivos estáticos de `/var/www/duopass/dist`
- ✅ Redirecionamento HTTP → HTTPS
- ✅ Headers de segurança
- ✅ Cache otimizado
- ✅ SPA routing para React
- ✅ SSL/TLS configurado

### Script: `deploy-nginx-fix.sh`
- ✅ Remove configurações conflitantes
- ✅ Aplica configuração unificada
- ✅ Faz backup das configurações atuais
- ✅ Testa configuração antes de aplicar
- ✅ Verifica certificados SSL

## 🚀 Passos para Aplicar a Correção

### 1. Preparação
```bash
# Navegar para o diretório do projeto
cd /caminho/para/DuoPass

# Verificar arquivos criados
ls -la nginx-unified.conf deploy-nginx-fix.sh

# Dar permissão de execução ao script
chmod +x deploy-nginx-fix.sh
```

### 2. Backup Manual (Recomendado)
```bash
# Backup das configurações atuais
sudo mkdir -p /etc/nginx/backup/manual_$(date +%Y%m%d_%H%M%S)
sudo cp -r /etc/nginx/sites-available /etc/nginx/backup/manual_$(date +%Y%m%d_%H%M%S)/
sudo cp -r /etc/nginx/sites-enabled /etc/nginx/backup/manual_$(date +%Y%m%d_%H%M%S)/
```

### 3. Executar Correção
```bash
# Executar script de correção
sudo ./deploy-nginx-fix.sh
```

### 4. Verificação Pós-Deploy
```bash
# Testar configuração
sudo nginx -t

# Verificar status
sudo systemctl status nginx

# Testar URLs
curl -I https://duopassclub.ch
curl -I https://www.duopassclub.ch

# Verificar logs
sudo tail -f /var/log/nginx/duopass_access.log
sudo tail -f /var/log/nginx/duopass_error.log
```

## 🔍 Verificações Específicas

### Verificar se Build Está Atualizado
```bash
# No diretório do projeto
cd project
npm run build

# Copiar para servidor (se necessário)
sudo cp -r dist/* /var/www/duopass/dist/
sudo chown -R www-data:www-data /var/www/duopass/dist
```

### Verificar DNS
```bash
# Verificar resolução DNS
nslookup duopassclub.ch
nslookup www.duopassclub.ch

# Verificar propagação
dig duopassclub.ch
dig www.duopassclub.ch
```

### Verificar SSL
```bash
# Verificar certificados
sudo certbot certificates

# Renovar se necessário
sudo certbot renew --dry-run

# Reconfigurar se necessário
sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch
```

## 🚨 Troubleshooting

### Se o site não carregar:
1. Verificar se nginx está rodando: `sudo systemctl status nginx`
2. Verificar logs de erro: `sudo tail -f /var/log/nginx/error.log`
3. Verificar se arquivos existem: `ls -la /var/www/duopass/dist/`
4. Verificar permissões: `sudo chown -R www-data:www-data /var/www/duopass`

### Se SSL não funcionar:
1. Verificar certificados: `sudo certbot certificates`
2. Reconfigurar: `sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch`
3. Verificar firewall: `sudo ufw status`

### Se ainda houver diferenças entre domínios:
1. Limpar cache do navegador
2. Verificar CDN (se houver)
3. Verificar DNS cache: `sudo systemctl flush-dns`
4. Testar com curl: `curl -H "Host: duopassclub.ch" http://IP_DO_SERVIDOR`

## 📋 Checklist Final

- [ ] Backup das configurações atuais realizado
- [ ] Script `deploy-nginx-fix.sh` executado com sucesso
- [ ] `nginx -t` retorna OK
- [ ] Nginx recarregado sem erros
- [ ] `https://duopassclub.ch` carrega corretamente
- [ ] `https://www.duopassclub.ch` carrega corretamente
- [ ] Ambos os domínios mostram o mesmo conteúdo
- [ ] Rotas SPA funcionam (ex: `/experiencias`, `/ofertas`)
- [ ] SSL válido em ambos os domínios
- [ ] Logs não mostram erros críticos

## 📞 Suporte

Se ainda houver problemas:
1. Verificar logs detalhados
2. Executar diagnósticos completos
3. Considerar rollback: restaurar backup
4. Verificar configurações de DNS/CDN externas

---

**Nota**: Esta configuração assume que você está servindo uma aplicação React buildada (SPA) e não um servidor Node.js. Se precisar de proxy para APIs, descomente a seção correspondente no `nginx-unified.conf`.