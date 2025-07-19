# 🔧 Correção do Erro de Vouchers - Campo Title Obrigatório

## ❌ Problema Identificado

**Erro SQL:**
```
ERROR: 23502: null value in column "title" of relation "vouchers" violates not-null constraint
```

**Causa:** A tabela `vouchers` tem um campo `title` obrigatório (NOT NULL) que não estava sendo preenchido nos INSERTs.

## ✅ Correção Implementada

### 1. **Arquivo Corrigido**
- **<mcfile name="fix-google-users-activation.sql" path="c:\Users\igor_\Desktop\DuoPass\project\fix-google-users-activation.sql"></mcfile>**

### 2. **Mudanças Realizadas**

#### A. INSERT de Vouchers Específicos (Seção 2)
```sql
-- ANTES (❌ Erro):
INSERT INTO public.vouchers (user_id, code, status, expires_at)

-- DEPOIS (✅ Corrigido):
INSERT INTO public.vouchers (user_id, code, title, description, status, expires_at)
VALUES 
  ('d97e1c42-3468-425a-8784-4d646b2c4a57', 'IGOR001', 'Voucher Boas-vindas', 'Voucher de boas-vindas para Igor', 'active', NOW() + INTERVAL '30 days'),
  ('d97e1c42-3468-425a-8784-4d646b2c4a57', 'IGOR002', 'Voucher Especial', 'Voucher especial para experiências', 'active', NOW() + INTERVAL '45 days'),
  ('d97e1c42-3468-425a-8784-4d646b2c4a57', 'IGOR003', 'Voucher Premium', 'Voucher premium com benefícios extras', 'active', NOW() + INTERVAL '60 days')
```

#### B. Função create_initial_vouchers_for_user (Seção 13)
```sql
-- ANTES (❌ Erro):
INSERT INTO public.vouchers (user_id, code, status, expires_at)

-- DEPOIS (✅ Corrigido):
INSERT INTO public.vouchers (user_id, code, title, description, status, expires_at)
VALUES
  (user_id_param, 'WELCOME_' || SUBSTRING(user_id_param::text, 1, 8), 'Voucher de Boas-vindas', 'Voucher especial para novos usuários', 'active', NOW() + INTERVAL '30 days'),
  (user_id_param, 'BONUS_' || SUBSTRING(user_id_param::text, 1, 8), 'Voucher Bônus', 'Voucher bônus com benefícios extras', 'active', NOW() + INTERVAL '45 days'),
  (user_id_param, 'SPECIAL_' || SUBSTRING(user_id_param::text, 1, 8), 'Voucher Especial', 'Voucher especial com ofertas exclusivas', 'active', NOW() + INTERVAL '60 days')
```

#### C. Query de Verificação (Seção 14)
```sql
-- ANTES:
SELECT user_id, code, status, expires_at

-- DEPOIS (✅ Mais completo):
SELECT user_id, code, title, description, status, expires_at
```

## 🎯 Como Executar a Correção

### Passo 1: Executar SQL Corrigido
1. Abrir **Supabase SQL Editor**
2. Copiar todo o conteúdo de <mcfile name="fix-google-users-activation.sql" path="c:\Users\igor_\Desktop\DuoPass\project\fix-google-users-activation.sql"></mcfile>
3. Executar o script completo

### Passo 2: Verificar Resultados

#### A. Usuário Ativado
```sql
SELECT 'USUÁRIO ATIVADO' as status, id, email, subscription_status, user_type
FROM public.users
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';
```

**Resultado Esperado:**
- `subscription_status`: 'active'
- `user_type`: 'basic'
- `email`: 'igor.bonafe@gmail.com'

#### B. Vouchers Criados
```sql
SELECT 'VOUCHERS CRIADOS' as status, user_id, code, title, description, status, expires_at
FROM public.vouchers
WHERE user_id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';
```

**Resultado Esperado:**
- 3 vouchers criados (IGOR001, IGOR002, IGOR003)
- Todos com `status = 'active'`
- Todos com `title` e `description` preenchidos
- Datas de expiração: 30, 45 e 60 dias

#### C. Sistema Merchant
```sql
SELECT 'MERCHANTS CRIADOS' as status, COUNT(*) as total_merchants
FROM public.merchants;

SELECT 'OFERTAS DISPONÍVEIS' as status, COUNT(*) as total_ofertas
FROM public.offers WHERE is_active = true;
```

**Resultado Esperado:**
- 3 merchants criados
- 6 ofertas ativas

## 🔍 Troubleshooting

### Problema 1: Ainda Erro de Title
**Sintoma:** `ERROR: 23502: null value in column "title"`

**Soluções:**
```sql
-- A. Verificar estrutura da tabela vouchers
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vouchers' AND table_schema = 'public'
ORDER BY ordinal_position;

-- B. Verificar constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'vouchers' AND table_schema = 'public';

-- C. Limpar vouchers existentes (se necessário)
DELETE FROM public.vouchers WHERE user_id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';
```

### Problema 2: Vouchers Duplicados
**Sintoma:** `ON CONFLICT (code) DO NOTHING` não funciona

**Soluções:**
```sql
-- A. Verificar vouchers existentes
SELECT code, title, status FROM public.vouchers 
WHERE code IN ('IGOR001', 'IGOR002', 'IGOR003');

-- B. Remover duplicados
DELETE FROM public.vouchers 
WHERE code IN ('IGOR001', 'IGOR002', 'IGOR003') 
AND title IS NULL;
```

### Problema 3: Função Não Funciona
**Sintoma:** `create_initial_vouchers_for_user` falha

**Soluções:**
```sql
-- A. Testar função manualmente
SELECT public.create_initial_vouchers_for_user('d97e1c42-3468-425a-8784-4d646b2c4a57');

-- B. Verificar se função foi criada
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_name = 'create_initial_vouchers_for_user';

-- C. Recriar função se necessário
DROP FUNCTION IF EXISTS public.create_initial_vouchers_for_user(UUID);
-- Depois executar novamente a seção 13 do SQL
```

## ✅ Critérios de Sucesso

1. **SQL executa sem erros** - Sem constraint violations
2. **Usuário ativado** - `subscription_status = 'active'`
3. **3 vouchers criados** - Com title e description preenchidos
4. **Sistema merchant funcionando** - 3 merchants + 6 ofertas
5. **Trigger ativo** - Auto-ativação para novos usuários Google
6. **Função disponível** - `create_initial_vouchers_for_user` operacional

## 📞 Próximos Passos

1. **Execute o SQL corrigido** no Supabase
2. **Verifique os resultados** com as queries de verificação
3. **Teste o login Google** no frontend
4. **Confirme usuário ativo** na interface
5. **Teste funcionalidades** de vouchers e merchants

---

**OBJETIVO**: Sistema completo funcionando com vouchers válidos e usuário ativo automaticamente.