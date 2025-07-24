# Guia de Implementação de Deploy Automático - DuoPass

## Introdução

Este guia apresenta as diferentes opções de deploy automático implementadas para o projeto DuoPass. Cada solução oferece uma forma de automatizar o processo de build e deploy, eliminando a necessidade de executar manualmente os scripts de deploy.

## Opções Implementadas

Foram implementadas quatro opções de deploy automático:

1. **GitHub Actions** - Solução integrada ao GitHub
2. **Webhook Nginx** - Solução leve baseada em webhooks
3. **Jenkins** - Solução robusta de CI/CD
4. **CircleCI** - Serviço de CI/CD em nuvem
5. **GitLab CI/CD** - Solução integrada ao GitLab

## 1. GitHub Actions

### Arquivos Criados
- `.github/workflows/deploy.yml` - Configuração do workflow
- `.github/README.md` - Instruções de configuração

### Como Configurar

1. Certifique-se de que seu código está hospedado no GitHub
2. Configure os secrets necessários no repositório:
   - `SSH_PRIVATE_KEY` - Chave SSH privada para acessar o servidor
   - `SSH_KNOWN_HOSTS` - Saída do comando `ssh-keyscan duopassclub.ch`
   - `SSH_USER` - Nome de usuário para SSH
   - `SSH_HOST` - Endereço do servidor (ex: duopassclub.ch)

### Como Funciona

Quando um push é feito para a branch principal (main ou master), o workflow é acionado automaticamente e executa as seguintes etapas:

1. Checkout do código
2. Configuração do Node.js
3. Instalação de dependências
4. Lint do código
5. Build da aplicação
6. Deploy para o servidor via SSH/rsync
7. Verificação do deploy

## 2. Webhook Nginx

### Arquivos Criados
- `setup-webhook.sh` - Script para configurar o webhook no servidor

### Como Configurar

1. Faça upload do script `setup-webhook.sh` para o servidor
2. Execute o script como root: `sudo bash setup-webhook.sh`
3. Configure o webhook no GitHub:
   - Vá para Settings > Webhooks > Add webhook
   - Payload URL: `http://duopassclub.ch:9000/hooks/deploy-duopass`
   - Content type: `application/json`
   - Secret: o mesmo configurado no script
   - Eventos: Selecione 'Just the push event'

### Como Funciona

Quando um push é feito para o repositório, o GitHub envia uma notificação para o webhook configurado no servidor. O webhook executa o script de deploy, que faz o clone do repositório, instala dependências, faz o build e atualiza os arquivos no servidor.

## 3. Jenkins

### Arquivos Criados
- `Jenkinsfile` - Configuração do pipeline Jenkins

### Como Configurar

1. Configure um servidor Jenkins
2. Instale os plugins necessários:
   - Pipeline
   - Git
   - SSH Agent
3. Crie uma nova pipeline e configure para usar o Jenkinsfile do repositório
4. Configure as credenciais SSH no Jenkins:
   - ID: `duopass-ssh-key`
   - Tipo: SSH Username with private key
   - Username: seu usuário SSH
   - Private Key: sua chave privada SSH
5. Configure as variáveis de ambiente no Jenkins:
   - `SSH_USER` - Nome de usuário para SSH
   - `SSH_HOST` - Endereço do servidor

### Como Funciona

O pipeline Jenkins é configurado para monitorar o repositório e, quando detecta mudanças na branch principal, executa o pipeline de build e deploy automaticamente.

## 4. CircleCI

### Arquivos Criados
- `.circleci/config.yml` - Configuração do pipeline CircleCI

### Como Configurar

1. Crie uma conta no CircleCI e conecte ao seu repositório
2. Configure as variáveis de ambiente no CircleCI:
   - `SSH_KEY_FINGERPRINT` - Fingerprint da chave SSH
   - `SSH_USER` - Nome de usuário para SSH
   - `SSH_HOST` - Endereço do servidor
3. Adicione a chave SSH às chaves do projeto no CircleCI

### Como Funciona

O CircleCI monitora o repositório e, quando detecta mudanças na branch principal, executa o pipeline de build e deploy automaticamente.

## 5. GitLab CI/CD

### Arquivos Criados
- `.gitlab-ci.yml` - Configuração do pipeline GitLab CI/CD

### Como Configurar

1. Certifique-se de que seu código está hospedado no GitLab
2. Configure as variáveis de ambiente no GitLab:
   - `SSH_PRIVATE_KEY` - Chave SSH privada para acessar o servidor
   - `SSH_KNOWN_HOSTS` - Saída do comando `ssh-keyscan duopassclub.ch`
   - `SSH_USER` - Nome de usuário para SSH
   - `SSH_HOST` - Endereço do servidor

### Como Funciona

O GitLab CI/CD monitora o repositório e, quando detecta mudanças na branch principal, executa o pipeline de build e deploy automaticamente.

## Recomendação

Para o projeto DuoPass, recomendamos a utilização do **GitHub Actions** pelos seguintes motivos:

1. **Integração nativa** - Se o código já está no GitHub, não é necessário configurar serviços externos
2. **Facilidade de configuração** - A configuração é simples e direta
3. **Recursos gratuitos** - O GitHub oferece minutos gratuitos para execução de workflows
4. **Segurança** - Os secrets são gerenciados de forma segura pelo GitHub

Se preferir uma solução mais leve e direta no servidor, o **Webhook** é uma boa alternativa.

## Próximos Passos

1. Escolha a solução que melhor se adapta às suas necessidades
2. Siga as instruções de configuração da solução escolhida
3. Faça um teste de deploy para verificar se tudo está funcionando corretamente
4. Configure notificações para ser alertado em caso de falhas no deploy

## Considerações de Segurança

- Nunca armazene chaves SSH ou outros segredos diretamente nos arquivos de configuração
- Use sempre variáveis de ambiente ou sistemas de gerenciamento de segredos
- Limite as permissões do usuário SSH no servidor apenas ao necessário para o deploy
- Considere usar chaves SSH específicas para o deploy, diferentes das chaves pessoais

## Suporte

Em caso de dúvidas ou problemas com a configuração do deploy automático, entre em contato com a equipe de desenvolvimento.