# 🚀 INSTRUÇÕES PARA SINCRONIZAR PRODUÇÃO

## 📦 Arquivos para Upload
Os arquivos de build estão na pasta `dist/` e devem ser enviados para o servidor.

## 🔧 Comandos no Servidor (SSH):

```bash
# 1. Conectar ao servidor
ssh 

# 2. Fazer backup da versão atual
sudo mkdir -p /var/www/duopass/backup/$(date +%Y%m%d_%H%M%S)
sudo cp -r /var/www/duopass/dist/* /var/www/duopass/backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# 3. Limpar pasta atual
sudo rm -rf /var/www/duopass/dist/*

# 4. Enviar novos arquivos (do seu computador local):
# Execute este comando no seu computador LOCAL:
scp -r dist/* seu-usuario@duopassclub.ch:/tmp/duopass-new/

# 5. No servidor, mover arquivos para local correto:
sudo mkdir -p /tmp/duopass-new
sudo cp -r /tmp/duopass-new/* /var/www/duopass/dist/
sudo chown -R www-data:www-data /var/www/duopass/dist
sudo chmod -R 755 /var/www/duopass/dist

# 6. Aplicar configuração nginx correta:
sudo cp nginx-unified.conf /etc/nginx/sites-available/duopass
sudo ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 7. Testar e recarregar nginx:
sudo nginx -t
sudo systemctl reload nginx

# 8. Verificar logs:
sudo tail -f /var/log/nginx/duopass_error.log
```

## 🔍 Verificação Pós-Deploy:

```bash
# Testar URLs:
curl -I https://duopassclub.ch
curl -I https://www.duopassclub.ch

# Verificar se ambos retornam o mesmo conteúdo:
curl -s https://duopassclub.ch | head -20
curl -s https://www.duopassclub.ch | head -20
```

## 🚨 Se ainda houver dessincronização:

1. **Limpar cache do navegador** (Ctrl+F5)
2. **Verificar DNS:** `nslookup duopassclub.ch`
3. **Verificar nginx:** `sudo nginx -T | grep duopassclub`
4. **Verificar arquivos:** `ls -la /var/www/duopass/dist/`

## 📱 Alternativa: Deploy via rsync (mais rápido):

```bash
# Do seu computador local:
rsync -avz --delete dist/ seu-usuario@duopassclub.ch:/tmp/duopass-sync/

# No servidor:
sudo rsync -avz --delete /tmp/duopass-sync/ /var/www/duopass/dist/
sudo chown -R www-data:www-data /var/www/duopass/dist
```

---
**Gerado em:** 23.07.2025, 16:02:23
**Build:** Pronto
