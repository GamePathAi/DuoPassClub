# 🗄️ Configuração do Banco de Dados Supabase

## ⚠️ IMPORTANTE: Execute estas etapas OBRIGATORIAMENTE

Para corrigir os erros de "Failed to fetch" e configurar o banco de dados corretamente:

## 📋 Passo a Passo

### 1. Acesse o Supabase Dashboard
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione seu projeto DuoPass

### 2. Execute o SQL Schema
1. No painel lateral, clique em **"SQL Editor"**
2. Clique em **"New Query"**
3. Copie e cole o conteúdo completo do arquivo `supabase-schema.sql`
4. Clique em **"Run"** para executar

### 3. Verificar Tabelas Criadas
Após executar o SQL, verifique se as seguintes tabelas foram criadas:

- ✅ `users` - Tabela de usuários
- ✅ `categories` - Categorias com dados padrão
- ✅ `offers` - Ofertas dos comerciantes
- ✅ `activated_coupons` - Cupons ativados pelos usuários

### 4. Verificar Categorias Padrão
As seguintes categorias devem estar inseridas automaticamente:

- 🍽️ **Gastronomia** (gastronomy)
- ✨ **Beleza** (beauty)
- 🎮 **Lazer** (leisure)
- 💪 **Fitness** (fitness)
- 🛍️ **Compras** (shopping)
- 🔧 **Serviços** (services)

### 5. Configurações de Segurança
O RLS (Row Level Security) será habilitado automaticamente para:
- `users`
- `offers`
- `activated_coupons`

## 🔧 Resolução de Problemas

### Se aparecer erro "relation already exists":
- ✅ **Normal!** As tabelas já existem
- Continue com o próximo passo

### Se aparecer erro de permissão:
1. Verifique se você é o owner do projeto
2. Tente executar o SQL em partes menores

### Verificar se funcionou:
1. Vá para **"Table Editor"** no Supabase
2. Deve ver todas as 4 tabelas listadas
3. Clique em `categories` - deve ter 6 registros

## ✅ Após Executar o SQL

1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Teste a aplicação:**
   - Acesse http://localhost:5173/
   - Tente fazer cadastro/login
   - Não deve mais aparecer "Failed to fetch"

## 📞 Suporte

Se ainda houver problemas:
1. Verifique se as chaves do `.env` estão corretas
2. Confirme se o projeto Supabase está ativo
3. Teste a conexão no SQL Editor do Supabase

---

**🎯 Objetivo:** Eliminar erros de banco de dados e permitir funcionamento completo da aplicação.