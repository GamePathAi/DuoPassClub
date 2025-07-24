# 🚀 Guia Completo de Deploy DuoPass na AWS

## ✅ Status do Build

**BUILD CONCLUÍDO COM SUCESSO!** ✨

- **Pasta de build:** `project/dist/`
- **Tamanho total:** ~1.3MB (comprimido: ~300KB)
- **Arquivos gerados:** 6 arquivos otimizados
- **Tempo de build:** 16.08s

---

## 🏗️ Arquivos Prontos para Deploy

### 📁 Build da Aplicação
```
project/dist/
├── index.html (0.84 kB)
├── assets/
│   ├── index-CqFfnZrw.css (79.59 kB)
│   ├── router-DhmkEjUx.js (21.71 kB)
│   ├── supabase-D-eN9Y6Z.js (116.13 kB)
│   ├── vendor-YmKVTMpv.js (142.25 kB)
│   └── index-CePF7K3F.js (929.42 kB)
```

### ⚙️ Configurações
- **Nginx:** `nginx-unified.conf` (configurado para duopassclub.ch)
- **Ambiente:** `project/.env.production` (configurado)
- **Deploy automático:** `.github/workflows/deploy.yml` (pronto)

---

## 🔧 Opções de Deploy

### 🤖 Opção 1: Deploy Automático (Recomendado)

#### Pré-requisitos:
1. **Repositório GitHub configurado**
2. **Servidor AWS EC2 configurado**
3. **Domínio duopassclub.ch apontando para o servidor**

#### Configurar Secrets no GitHub:
```bash
# No GitHub Repository > Settings > Secrets and variables > Actions
SSH_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAuDSMR00NANanhxTruPLdhorZ+SyCxq5o324B4gBkIfs9S+sn
2A4XKuEqYKkKz5PP8kxrnTsGHEpYbMwIhjpYA0ULKjBb+huWZXYWDSmob1nrAobH
42naQHFDodAN0HQdNeJmr3aq7HbZOCrDa96RIoEa82MyYisRzDAoux4C+uPcEiw5
VoBLmObnA8HYemmsl3CmDP9SrSuQ690kQn2CA/X6YafcZQ3hb6Z67n/PnqCkzSNv
dzrhyC6x4k0fQAmZKCs7wz2jfNt9ptXlzeY14GjqAk9f8RizXM9OhZMr6N84y3Q4
aGnb+02vxEHw5BO5bwM86lr0J455mztSJkUb0wIDAQABAoIBAQCTf1g4G6Vm33rD
umfJ74acngBN+ms5JhzJk6+kRQXpA+EgMkr0QMwiRKwHPDRw5H3lGXYuLz4EVy+Y
5oOI35zr+VQoUxLDIWX7FmQv5ASALTL2EfBq0660XT13iz4UhXWCWSg6Jb5VnBDx
XaSfclcqltB6xRpp6uzUYFetBSoDtCU71rI7vYxZXhMZ86od6wIuHkxmOnn6SOPX
lHHWH4r2uvShqJhJlDwG2aI6czoceJ4RroFL3N/61Xgqw7UKOP2zQ2U93D1Mu5N8
YJ34l6EvFyePxKywXGKO7Mla3VflvVhCxuv/sOEGHRFKshDDltEmBkXqUifN/Lql
Ndo8dCmpAoGBAPDB6qQTgBbnsJyhAxZGFmnTaKQxnrX66Y6xNQmgR+4WnOjm4fiJ
ZvRWFzd6NC9YJZy97OpILL4ot+y+K+DCyBXIUFlbBIEqWOYGP7o2x3QBLsOBkdQz
pCGWpIc/u2vFyCbQmmAHZbvKLetuDz9I38egMPlHBz1yR+uvJRvotXR9AoGBAMPe
D0wBshk2iOIcgNUxYMw1BpDMk8AnNiYcn9BQfZYe/XxU24fVF9FGALpm8jLe20I8
pZwQ9cIOykH9tDHmDo82gD9bhwVKoJpKhIxNWN55mGWBwkLPE1SCsrnta3AtDiwS
zrqGhrNRQdcPll2S6Wts5YitlfX1tfjou6EATVKPAoGAJYPR8Ccpumf32TAtrvbU
30CV+Z/Rv0GNyzJJtWpISw0y/gecBoJCjKgtjfN41jfCBJ6DoC4G6sqlfjpT0/4F
937zJjlMhmP23kDzBS0r/yOACe7SrmItnR5AHOMNbUmwWnv+0h/U9mIWrazEq3PL
iuunNfCfbC+2jT8JZUPponECgYEAii1sKTjBBhx88Nce5EgTe7ykxx4r1dFT2As1
i2ZdUrzGIyJSRT9FsDNsbBQYJV8m21Ghm7ozRhXdBjUPHGyqNMpEK25MkKUXLAIK
BFjEqx6pLmMeQreHcYVKxPQDaX2/k8Qo51nkSTi39Bpg/96WoVyPiZ68Pmp7WAAH
7gsigW0CgYBg9M0XhAqle1WKWx/Lz6pPu/9++lygf4NAldn+1gpIU7TrilqT47MG
ZmsmoXU0uMnIfVT63T45IF1GO4SLSzf4Q0BE/oO9dOed94lQd3TFixaKhDWJ9JNH
BZSTRMhZeYYGWIJm074BDZuzTgfdhbAEPIIy/nwN3kWCjhXX7hn5yw==
-----END RSA PRIVATE KEY-----
SSH_KNOWN_HOSTS=|1|LasfGVD5fIu5fQP26R6DgRHIPNQ=07dOew6OsXmCcFtZkMf6vJtHQZA= ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDeO0lnAg6TJdDqTipNhBIr/u+4/y+tVZPSe4ZYt8G/oTPR41AhXWZEYncdT0I+VKqK9xcDBfcRL+FzHKZtXbUokbXVjGvAD9RgdVDWshiBmdXHX7PiqzbSKoF/rh3UzRnLLWMK/oi+eDNPOG4QwQ28ENgZTLKFBMCJ0ugqj7tVLQghjYB3CBgITV8p8vuhZdw1h2X3VoU9ohC/EFrqj73pWma9YK2E5LqIL6NYF8ImjQriXH1qTBhrjLqf0Q/1fIcJaIe+GgPgj6oN3XeISHKXhLV01sBMhhERihjqVMu/hVxq/LC72jvFSDpLEJJk0qS9WqCjHJ5wO2Fl0Gkte74Kp+NwHT2uMQ9ymX0GlR7Z9dVQSFNS82250NnLM3ScpqrLi61YPP9M5K0xMosshrGgk7ob8z/rRFUmoFlhpmc0PpZGrLMb+6UxYNfw9kO/A/WKBaR/3eeo+GrwIGkUMymTJgkDnjjMDRO9hpsdOFMiEBRnkUkHPiCnpZpAaLLM=
|1|FsJ5pDLXO8fe3skpj/CfIibCu2w=|Sb2yKVf+KAzjL965v/SCqf8C52s= ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBCAFfTj3c1pM9TignSg5NuxcdcXFZxxo6hwav4s5Qzan2KzzolzPj+p4VMewUcn2vwYr3foXbhV2SLMtdHNMBtQ=
|1|1n3mPOfY3aYwulbH6+FWbj8Z7zc=|Y9u3ExGXDNMCK6NWXSx2ke/rqjo= ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIL/DJEYhKKlvCafaektDlAAWY8N5ZfLEiwjueW0r7yVy
SSH_USER=ubuntu
SSH_HOST=54.78.178.154
```

#### Como obter SSH_KNOWN_HOSTS:
```bash
ssh-keyscan -H 54.78.178.154 >> known_hosts
ssh-keyscan -H duopassclub.ch >> known_hosts
```

#### Disparar Deploy:
```bash
git add .
git commit -m "Deploy: Atualização DuoPass"
git push origin main  # ou master
```

### 📤 Opção 2: Upload Manual

#### Passo 1: Comprimir arquivos
```powershell
# No Windows (PowerShell)
Compress-Archive -Path "project\dist\*" -DestinationPath "duopass-build.zip"
```

#### Passo 2: Upload via SCP
```bash
# Upload do build
scp duopass-build.zip usuario@servidor:/tmp/

# No servidor
ssh usuario@servidor
sudo rm -rf /var/www/duopass/dist/*
sudo unzip /tmp/duopass-build.zip -d /var/www/duopass/dist/
sudo chown -R www-data:www-data /var/www/duopass/dist
```

#### Passo 3: Configurar Nginx
```bash
# Copiar configuração
sudo cp nginx-unified.conf /etc/nginx/sites-available/duopass

# Ativar site
sudo ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Recarregar nginx
sudo systemctl reload nginx
```

---

## 🖥️ Configuração do Servidor AWS

### 📋 Estrutura de Diretórios
```bash
/var/www/duopass/
├── dist/          # Arquivos da aplicação
├── backup/        # Backups automáticos
└── logs/          # Logs da aplicação
```

### 🔧 Comandos de Configuração Inicial
```bash
# Criar estrutura
sudo mkdir -p /var/www/duopass/{dist,backup,logs}
sudo chown -R www-data:www-data /var/www/duopass

# Instalar dependências
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Configurar SSL (Let's Encrypt)
sudo certbot --nginx -d duopassclub.ch -d www.duopassclub.ch
```

### 🔒 Configuração de Segurança
```bash
# Firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Fail2ban (opcional)
sudo apt install -y fail2ban
```

---

## 🔍 Verificação e Monitoramento

### ✅ Checklist Pós-Deploy
- [ ] Site acessível em https://duopassclub.ch
- [ ] Redirecionamento HTTP → HTTPS funcionando
- [ ] Certificado SSL válido
- [ ] Todas as páginas carregando corretamente
- [ ] Funcionalidades principais testadas
- [ ] Logs sem erros críticos

### 📊 Comandos de Verificação
```bash
# Status do nginx
sudo systemctl status nginx

# Logs do nginx
sudo tail -f /var/log/nginx/duopass_error.log
sudo tail -f /var/log/nginx/duopass_access.log

# Teste de conectividade
curl -I https://duopassclub.ch

# Verificar certificado SSL
ssl-cert-check -c duopassclub.ch
```

### 🚨 Troubleshooting
```bash
# Se o site não carregar:
1. sudo nginx -t  # Testar configuração
2. sudo systemctl restart nginx
3. sudo tail -f /var/log/nginx/error.log

# Se SSL não funcionar:
1. sudo certbot renew --dry-run
2. sudo systemctl reload nginx

# Se arquivos não atualizarem:
1. Verificar permissões: ls -la /var/www/duopass/dist/
2. Limpar cache do navegador
3. Verificar cache do nginx
```

---

## 🔄 Processo de Rollback

### Em caso de problemas:
```bash
# Restaurar backup anterior
BACKUP_DIR=$(ls -t /var/www/duopass/backup/ | head -1)
sudo rm -rf /var/www/duopass/dist/*
sudo cp -r /var/www/duopass/backup/$BACKUP_DIR/* /var/www/duopass/dist/
sudo systemctl reload nginx
```

---

## 📞 Suporte

### 📧 Contatos
- **Email:** contact@duopassclub.ch
- **Domínio:** https://duopassclub.ch

### 📚 Documentação Adicional
- `MELHORIAS_GITHUB_ACTIONS.md` - Detalhes do CI/CD
- `nginx-unified.conf` - Configuração completa do Nginx
- `.github/workflows/deploy.yml` - Pipeline de deploy

---

## 🎉 Deploy Concluído!

**Seu DuoPass está pronto para produção na AWS!** 🚀

**URLs de acesso:**
- 🌐 **Produção:** https://duopassclub.ch
- 🔒 **SSL:** Configurado automaticamente
- ⚡ **Performance:** Otimizada com cache e compressão

**Próximos passos:**
1. Configurar monitoramento (opcional)
2. Configurar backups automáticos
3. Implementar CI/CD completo
4. Configurar alertas de uptime

---

*Última atualização: $(Get-Date -Format 'dd/MM/yyyy HH:mm')*