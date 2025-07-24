# DuoPass CI/CD com GitHub Actions

## Configuração do Deploy Automático

Este repositório está configurado com GitHub Actions para automatizar o processo de build e deploy do DuoPass. Quando um push é feito para a branch principal (main ou master), o workflow de CI/CD é acionado automaticamente.

## Secrets Necessários

Para que o workflow funcione corretamente, você precisa configurar os seguintes secrets no seu repositório GitHub:

1. **SSH_PRIVATE_KEY**: Sua chave SSH privada para acessar o servidor
2. **SSH_KNOWN_HOSTS**: Saída do comando `ssh-keyscan seu-servidor.com`
3. **SSH_USER**: Nome de usuário para SSH
4. **SSH_HOST**: Endereço do servidor (ex: duopassclub.ch)

### Como configurar os secrets:

1. No GitHub, vá para seu repositório
2. Clique em "Settings" > "Secrets and variables" > "Actions"
3. Clique em "New repository secret"
4. Adicione cada um dos secrets acima

### Gerando o SSH_KNOWN_HOSTS:

```bash
ssh-keyscan duopassclub.ch
```

## Workflow de Deploy

O workflow realiza as seguintes etapas:

1. **Build e Teste**:
   - Checkout do código
   - Configuração do Node.js
   - Instalação de dependências
   - Lint do código
   - Build da aplicação
   - Arquivamento dos artefatos de build

2. **Deploy**:
   - Download dos artefatos de build
   - Configuração da chave SSH
   - Backup da versão atual no servidor
   - Envio dos novos arquivos via rsync
   - Configuração do Nginx
   - Verificação do deploy

## Deploy Manual

Você também pode acionar o workflow manualmente através da opção "workflow_dispatch" no GitHub Actions.

## Monitoramento

Após o deploy, o workflow verifica se o site está respondendo corretamente e se ambos os domínios (duopassclub.ch e www.duopassclub.ch) estão sincronizados.