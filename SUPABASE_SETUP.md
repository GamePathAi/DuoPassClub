# Configuração do Supabase para DuoPass

Este documento contém todas as instruções necessárias para configurar o banco de dados Supabase para o sistema DuoPass.

## 1. Criação do Projeto Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Configure o projeto:
   - **Name**: DuoPass
   - **Database Password**: Crie uma senha segura
   - **Region**: Escolha a região mais próxima dos seus usuários
6. Clique em "Create new project"

## 2. Configuração do Banco de Dados

### 2.1 Executar o Schema SQL

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor SQL
5. Clique em "Run" para executar o script

### 2.2 Verificar Tabelas Criadas

Após executar o script, verifique se as seguintes tabelas foram criadas:

- `users` - Perfis de usuários (clientes e comerciantes)
- `categories` - Categorias de ofertas
- `offers` - Ofertas dos comerciantes
- `activated_coupons` - Cupons ativados pelos usuários
- `vouchers` - Vouchers gerados para parcerias
- `voucher_usage` - Histórico de uso dos vouchers

## 3. Configuração de Autenticação

### 3.1 Configurar Provedores de Auth

1. Vá para **Authentication > Settings**
2. Configure os seguintes settings:
   - **Site URL**: `http://localhost:5173` (desenvolvimento)
   - **Redirect URLs**: `http://localhost:5173/**`

### 3.2 Configurar Email Templates (Opcional)

1. Vá para **Authentication > Email Templates**
2. Customize os templates de:
   - Confirmação de email
   - Reset de senha
   - Convite de usuário

## 4. Configuração das Variáveis de Ambiente

### 4.1 Obter Credenciais do Supabase

1. No painel do Supabase, vá para **Settings > API**
2. Copie as seguintes informações:
   - **Project URL**
   - **anon public key**

### 4.2 Configurar Arquivo .env

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` com suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   ```

## 5. Configuração de Row Level Security (RLS)

O schema já inclui políticas de RLS configuradas. As principais regras são:

### 5.1 Usuários
- Usuários podem ver e editar apenas seu próprio perfil
- Perfis de comerciantes são públicos para visualização

### 5.2 Ofertas
- Qualquer pessoa pode ver ofertas ativas e não expiradas
- Comerciantes podem gerenciar apenas suas próprias ofertas

### 5.3 Vouchers
- Usuários podem ver apenas seus próprios vouchers
- Comerciantes podem ver vouchers relacionados ao seu negócio
- Comerciantes podem validar vouchers

### 5.4 Cupons Ativados
- Usuários podem ver e gerenciar apenas seus próprios cupons

## 6. Configuração de Storage (Opcional)

Para upload de imagens das ofertas:

1. Vá para **Storage**
2. Crie um novo bucket chamado `offer-images`
3. Configure as políticas de acesso:
   ```sql
   -- Permitir upload para comerciantes autenticados
   CREATE POLICY "Merchants can upload offer images" ON storage.objects
     FOR INSERT WITH CHECK (
       bucket_id = 'offer-images' AND 
       auth.role() = 'authenticated'
     );
   
   -- Permitir visualização pública
   CREATE POLICY "Anyone can view offer images" ON storage.objects
     FOR SELECT USING (bucket_id = 'offer-images');
   ```

## 7. Configuração de Realtime (Opcional)

Para atualizações em tempo real:

1. Vá para **Database > Replication**
2. Ative a replicação para as tabelas:
   - `vouchers`
   - `voucher_usage`
   - `offers`

## 8. Backup e Monitoramento

### 8.1 Configurar Backups Automáticos

1. Vá para **Settings > Database**
2. Configure backups automáticos diários

### 8.2 Monitoramento

1. Configure alertas para:
   - Uso de CPU alto
   - Muitas conexões simultâneas
   - Erros de autenticação

## 9. Dados de Teste

Para popular o banco com dados de teste, execute:

```sql
-- Inserir usuário comerciante de teste
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'comerciante@teste.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Inserir ofertas de teste
INSERT INTO public.offers (merchant_id, title, description, original_value, category, location, expires_at, terms_conditions)
VALUES (
  (SELECT id FROM public.users WHERE user_type = 'merchant' LIMIT 1),
  'Pizza Margherita 50% OFF',
  'Deliciosa pizza margherita com desconto especial',
  25.90,
  'Restaurantes',
  'Centro, São Paulo',
  NOW() + INTERVAL '30 days',
  'Válido apenas para consumo no local. Não cumulativo com outras promoções.'
);
```

## 10. Troubleshooting

### Problemas Comuns

1. **Erro de conexão**: Verifique se as URLs e chaves estão corretas no `.env`
2. **RLS bloqueando queries**: Verifique se o usuário está autenticado
3. **Políticas muito restritivas**: Revise as políticas de RLS

### Logs e Debug

1. Vá para **Logs** no painel do Supabase
2. Monitore logs de:
   - Database
   - Auth
   - API

## 11. Próximos Passos

Após a configuração:

1. Teste a autenticação no frontend
2. Verifique se as operações CRUD funcionam
3. Teste a geração e validação de vouchers
4. Configure monitoramento em produção
5. Implemente backup strategy

## Suporte

Para dúvidas sobre Supabase:
- [Documentação oficial](https://supabase.com/docs)
- [Discord da comunidade](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)