# 🚨 Instruções para Deploy Manual - Nginx DuoPass

## ⚠️ Problema Identificado
O servidor AWS (54.229.77.39) não está acessível via SSH no momento. Isso pode ser devido a:

- ✅ Servidor AWS desligado
- ✅ Security Groups bloqueando porta 22
- ✅ Problemas de conectividade de rede
- ✅ IP do servidor alterado

## 🔧 Soluções Alternativas

### Opção 1: AWS Console (Recomendado)

1. **Acessar AWS Console**
   - Fazer login no AWS Console
   - Navegar para EC2 > Instances
   - Localizar a instância do DuoPass

2. **Verificar Status da Instância**
   - Se estiver "stopped": clicar em "Start instance"
   - Se estiver "running": verificar Security Groups

3. **Conectar via Session Manager**
   - Selecionar a instância
   - Clicar em "Connect"
   - Escolher "Session Manager"
   - Clicar em "Connect"

### Opção 2: AWS CloudShell

1. **Abrir CloudShell no AWS Console**
2. **Fazer upload dos arquivos**:
   ```bash
   # Upload via interface do CloudShell:
   # - nginx-unified.conf
   # - deploy-nginx-fix.sh
   # - check-nginx-status.sh
   ```

3. **Conectar à instância**:
   ```bash
   # Obter IP atual da instância
   aws ec2 describe-instances --filters "Name=tag:Name,Values=DuoPass" --query 'Reservations[*].Instances[*].PublicIpAddress'
   
   # Conectar via SSH
   ssh -i dpkeyaws.pem ubuntu@IP_DA_INSTANCIA
   ```

### Opção 3: Comandos Manuais (Quando SSH Funcionar)

```bash
# 1. Conectar ao servidor
ssh -i C:\Users\igor_\Downloads\dpkeyaws.pem ubuntu@54.229.77.39

# 2. Fazer backup das configurações atuais
sudo mkdir -p /etc/nginx/backup/$(date +%Y%m%d_%H%M%S)
sudo cp /etc/nginx/sites-available/* /etc/nginx/backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true
sudo cp /etc/nginx/sites-enabled/* /etc/nginx/backup/$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# 3. Criar nova configuração nginx
sudo nano /etc/nginx/sites-available/duopass
# (Copiar conteúdo do arquivo nginx-unified.conf)

# 4. Remover configurações conflitantes
sudo rm -f /etc/nginx/sites-enabled/duopass*
sudo rm -f /etc/nginx/sites-enabled/default

# 5. Ativar nova configuração
sudo ln -sf /etc/nginx/sites-available/duopass /etc/nginx/sites-enabled/

# 6. Testar configuração
sudo nginx -t

# 7. Aplicar configuração
sudo systemctl reload nginx

# 8. Verificar status
sudo systemctl status nginx
```

## 📋 Arquivos Preparados

Todos os arquivos necessários estão prontos na pasta local:

### 1. `nginx-unified.conf`
- Configuração nginx unificada
- Resolve conflitos entre domínios
- Otimizada para React SPA
- Headers de segurança incluídos

### 2. `deploy-nginx-fix.sh`
- Script automatizado de deploy
- Faz backup automático
- Testa configuração antes de aplicar

### 3. `check-nginx-status.sh`
- Script de diagnóstico
- Verifica configurações ativas
- Identifica conflitos

### 4. `deploy-nginx-windows.ps1`
- Script PowerShell para Windows
- Transfere arquivos via SCP
- Executa comandos remotos

## 🔍 Verificações Necessárias no AWS

### Security Groups
```bash
# Verificar se porta 22 está liberada
# No AWS Console:
# EC2 > Security Groups > Selecionar SG da instância
# Inbound rules > Verificar se SSH (22) está permitido
```

### Status da Instância
```bash
# Verificar se instância está rodando
# EC2 > Instances > Verificar "Instance state"
# Se "stopped": Start instance
# Se "running": Verificar conectividade
```

### IP Público
```bash
# Verificar se IP público mudou
# EC2 > Instances > Verificar "Public IPv4 address"
# Se mudou: Atualizar DNS ou usar novo IP
```

## 🚀 Quando o Servidor Estiver Acessível

### Método Rápido (PowerShell):
```powershell
# Executar script automatizado
powershell -ExecutionPolicy Bypass -File deploy-nginx-windows.ps1
```

### Método Manual (SSH):
```bash
# 1. Transferir arquivos
scp -i C:\Users\igor_\Downloads\dpkeyaws.pem nginx-unified.conf ubuntu@IP:/tmp/
scp -i C:\Users\igor_\Downloads\dpkeyaws.pem deploy-nginx-fix.sh ubuntu@IP:/tmp/

# 2. Conectar e executar
ssh -i C:\Users\igor_\Downloads\dpkeyaws.pem ubuntu@IP
chmod +x /tmp/deploy-nginx-fix.sh
sudo /tmp/deploy-nginx-fix.sh
```

## 🎯 Resultado Esperado

Após aplicar a configuração:
- ✅ `duopassclub.ch` e `www.duopassclub.ch` mostram o mesmo conteúdo
- ✅ Redirecionamento HTTP → HTTPS funciona
- ✅ SSL válido em ambos os domínios
- ✅ Todas as rotas SPA funcionam
- ✅ Performance otimizada

## 📞 Troubleshooting

### Se ainda não conseguir conectar:
1. **Verificar AWS Console**: Instância ligada?
2. **Verificar Security Groups**: Porta 22 liberada?
3. **Verificar IP**: Mudou desde a última vez?
4. **Usar Session Manager**: Alternativa ao SSH
5. **Usar CloudShell**: Ambiente AWS integrado

### Se nginx não funcionar após deploy:
1. **Verificar logs**: `sudo tail -f /var/log/nginx/error.log`
2. **Testar config**: `sudo nginx -t`
3. **Reiniciar**: `sudo systemctl restart nginx`
4. **Verificar arquivos**: `ls -la /var/www/duopass/dist/`

---

**📝 Nota**: Todos os arquivos estão prontos. Assim que o servidor estiver acessível, a correção pode ser aplicada em poucos minutos.