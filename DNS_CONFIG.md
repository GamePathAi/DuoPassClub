# Configuração DNS para duopassclub.ch

## 📋 Registros DNS Necessários

### Registros Principais

```dns
; Registro A - Domínio principal
duopassclub.ch.        IN  A     SEU_IP_SERVIDOR

; Registro A - Subdomínio www
www.duopassclub.ch.    IN  A     SEU_IP_SERVIDOR

; Registro CNAME alternativo para www (escolha A ou CNAME)
; www.duopassclub.ch.    IN  CNAME duopassclub.ch.
```

### Registros de Email (Opcional)

```dns
; Registro MX - Para receber emails
duopassclub.ch.        IN  MX    10 mail.duopassclub.ch.

; Registro A para servidor de email
mail.duopassclub.ch.   IN  A     SEU_IP_SERVIDOR
```

### Registros de Segurança

```dns
; Registro TXT - SPF (Sender Policy Framework)
duopassclub.ch.        IN  TXT   "v=spf1 a mx ~all"

; Registro TXT - DMARC
_dmarc.duopassclub.ch. IN  TXT   "v=DMARC1; p=quarantine; rua=mailto:admin@duopassclub.ch"

; Registro TXT - DKIM (será gerado pelo servidor de email)
; default._domainkey.duopassclub.ch. IN TXT "v=DKIM1; k=rsa; p=SUA_CHAVE_PUBLICA"
```

## 🌐 Configuração por Provedor

### Cloudflare (Recomendado)

1. **Acesse o painel do Cloudflare**
2. **Adicione o domínio duopassclub.ch**
3. **Configure os registros DNS:**

| Tipo | Nome | Conteúdo | Proxy |
|------|------|----------|-------|
| A | duopassclub.ch | SEU_IP_SERVIDOR | ✅ |
| A | www | SEU_IP_SERVIDOR | ✅ |
| TXT | duopassclub.ch | "v=spf1 a mx ~all" | ❌ |
| TXT | _dmarc | "v=DMARC1; p=quarantine; rua=mailto:admin@duopassclub.ch" | ❌ |

4. **Configurações SSL/TLS:**
   - Modo: "Full (strict)"
   - Edge Certificates: Ativado
   - Always Use HTTPS: Ativado
   - HSTS: Ativado

5. **Configurações de Performance:**
   - Auto Minify: CSS, JS, HTML
   - Brotli: Ativado
   - Rocket Loader: Ativado

### Outros Provedores DNS

#### Namecheap
```
Host: @
Type: A Record
Value: SEU_IP_SERVIDOR
TTL: Automatic

Host: www
Type: A Record
Value: SEU_IP_SERVIDOR
TTL: Automatic
```

#### GoDaddy
```
Type: A
Name: @
Value: SEU_IP_SERVIDOR
TTL: 1 Hour

Type: A
Name: www
Value: SEU_IP_SERVIDOR
TTL: 1 Hour
```

## 🔧 Verificação da Configuração

### Comandos de Teste

```bash
# Verificar registro A
dig duopassclub.ch A
dig www.duopassclub.ch A

# Verificar propagação DNS
nslookup duopassclub.ch
nslookup www.duopassclub.ch

# Verificar de diferentes servidores DNS
dig @8.8.8.8 duopassclub.ch
dig @1.1.1.1 duopassclub.ch

# Verificar registros TXT
dig duopassclub.ch TXT
dig _dmarc.duopassclub.ch TXT
```

### Ferramentas Online

- **DNS Checker:** https://dnschecker.org/
- **DNS Propagation:** https://www.whatsmydns.net/
- **MX Toolbox:** https://mxtoolbox.com/
- **SSL Labs:** https://www.ssllabs.com/ssltest/

## ⏱️ Tempo de Propagação

- **TTL Padrão:** 1 hora
- **Propagação Global:** 24-48 horas
- **Cloudflare:** 5-10 minutos

## 🚨 Troubleshooting

### Problemas Comuns

1. **DNS não resolve:**
   ```bash
   # Verificar se o domínio está registrado
   whois duopassclub.ch
   
   # Verificar nameservers
   dig duopassclub.ch NS
   ```

2. **SSL não funciona:**
   ```bash
   # Verificar certificado
   openssl s_client -connect duopassclub.ch:443 -servername duopassclub.ch
   
   # Verificar configuração Nginx
   sudo nginx -t
   ```

3. **Redirecionamento não funciona:**
   ```bash
   # Testar redirecionamento HTTP para HTTPS
   curl -I http://duopassclub.ch
   curl -I http://www.duopassclub.ch
   ```

### Logs para Monitorar

```bash
# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs do Certbot
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Logs de renovação SSL
sudo tail -f /var/log/ssl-renewal.log
```

## 📋 Checklist de Configuração

- [ ] Domínio duopassclub.ch registrado
- [ ] Nameservers configurados
- [ ] Registro A para duopassclub.ch
- [ ] Registro A para www.duopassclub.ch
- [ ] DNS propagado globalmente
- [ ] Servidor web configurado
- [ ] Certificado SSL instalado
- [ ] HTTPS funcionando
- [ ] Redirecionamento HTTP → HTTPS
- [ ] Redirecionamento www → não-www (ou vice-versa)
- [ ] Registros de segurança (SPF, DMARC)
- [ ] Renovação automática SSL configurada
- [ ] Monitoramento configurado

## 🔗 Links Úteis

- **Registro .ch:** https://www.nic.ch/
- **Cloudflare:** https://www.cloudflare.com/
- **Let's Encrypt:** https://letsencrypt.org/
- **Certbot:** https://certbot.eff.org/
- **Nginx:** https://nginx.org/

---

**Nota:** Substitua `SEU_IP_SERVIDOR` pelo IP real do seu servidor onde o DuoPass está hospedado.