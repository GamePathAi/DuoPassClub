# Deploy Automático para DuoPass

## Visão Geral

Este projeto implementa várias opções de deploy automático para o DuoPass, permitindo que você escolha a solução que melhor se adapta às suas necessidades. O deploy automático elimina a necessidade de executar manualmente os scripts de deploy, reduzindo erros humanos e garantindo consistência no processo de implantação.

## Opções Disponíveis

### 1. GitHub Actions

**Arquivos:** `.github/workflows/deploy.yml`, `.github/README.md`

**Vantagens:**
- Integração nativa com GitHub
- Não requer servidores adicionais
- Fácil configuração
- Minutos gratuitos para execução

**Ideal para:** Projetos hospedados no GitHub que desejam uma solução completa sem infraestrutura adicional.

### 2. Webhook Nginx

**Arquivos:** `setup-webhook.sh`

**Vantagens:**
- Solução leve e direta
- Executa diretamente no servidor
- Baixo overhead
- Independente de serviços externos

**Ideal para:** Ambientes onde você prefere uma solução simples e direta no servidor, sem depender de serviços externos.

### 3. Jenkins

**Arquivos:** `Jenkinsfile`

**Vantagens:**
- Solução robusta e completa
- Altamente personalizável
- Suporte a pipelines complexos
- Integração com diversos plugins

**Ideal para:** Empresas que já utilizam Jenkins ou precisam de um sistema de CI/CD robusto e personalizável.

### 4. CircleCI

**Arquivos:** `.circleci/config.yml`

**Vantagens:**
- Serviço em nuvem
- Interface amigável
- Fácil configuração
- Bom desempenho

**Ideal para:** Equipes que preferem uma solução em nuvem sem necessidade de manter infraestrutura própria.

### 5. GitLab CI/CD

**Arquivos:** `.gitlab-ci.yml`

**Vantagens:**
- Integração nativa com GitLab
- Pipeline completo
- Boa documentação
- Recursos gratuitos disponíveis

**Ideal para:** Projetos hospedados no GitLab que desejam aproveitar as capacidades nativas de CI/CD.

## Como Escolher

Para escolher a melhor opção, considere os seguintes fatores:

1. **Onde seu código está hospedado?**
   - GitHub → GitHub Actions
   - GitLab → GitLab CI/CD
   - Outro → CircleCI ou Jenkins

2. **Você já usa alguma ferramenta de CI/CD?**
   - Jenkins → Use o Jenkinsfile
   - CircleCI → Use a configuração CircleCI
   - Nenhuma → GitHub Actions ou Webhook

3. **Qual o nível de complexidade desejado?**
   - Simples e direto → Webhook
   - Completo mas fácil → GitHub Actions ou CircleCI
   - Robusto e personalizável → Jenkins

4. **Considerações de infraestrutura:**
   - Sem infraestrutura adicional → GitHub Actions, CircleCI
   - Infraestrutura própria → Jenkins, Webhook

## Guia de Implementação

Para instruções detalhadas sobre como configurar cada opção, consulte o arquivo `GUIA_DEPLOY_AUTOMATICO.md`.

## Verificação do Deploy Automático

Use o script `verificar-deploy-automatico.sh` para verificar se o deploy automático está configurado e funcionando corretamente.

```bash
chmod +x verificar-deploy-automatico.sh
./verificar-deploy-automatico.sh
```

## Recomendação para DuoPass

Para o projeto DuoPass, recomendamos a utilização do **GitHub Actions** pelos seguintes motivos:

1. **Integração nativa** - Se o código já está no GitHub, não é necessário configurar serviços externos
2. **Facilidade de configuração** - A configuração é simples e direta
3. **Recursos gratuitos** - O GitHub oferece minutos gratuitos para execução de workflows
4. **Segurança** - Os secrets são gerenciados de forma segura pelo GitHub

Se preferir uma solução mais leve e direta no servidor, o **Webhook** é uma boa alternativa.

## Próximos Passos

1. Escolha a solução que melhor se adapta às suas necessidades
2. Siga as instruções de configuração no `GUIA_DEPLOY_AUTOMATICO.md`
3. Faça um teste de deploy para verificar se tudo está funcionando corretamente
4. Configure notificações para ser alertado em caso de falhas no deploy

## Suporte

Em caso de dúvidas ou problemas com a configuração do deploy automático, consulte a documentação específica de cada ferramenta ou entre em contato com a equipe de desenvolvimento.