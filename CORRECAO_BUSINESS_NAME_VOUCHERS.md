# 🔧 Correção do Erro business_name na Tabela Vouchers

## 🚨 Problema Identificado

**Erro Original:**
```
ERROR: 23502: null value in column "business_name" of relation "vouchers" violates not-null constraint
```

**Causa Raiz:**
O script `fix-google-users-activation.sql` estava tentando inserir vouchers usando campos que não existem na estrutura real da tabela `vouchers` ou estava omitindo campos obrigatórios.

## ✅ Correção Implementada

### 1. **Estrutura Real da Tabela Vouchers**

Segundo o schema atual (`supabase-schema.sql`), a tabela `vouchers` tem esta estrutura:

```sql
CREATE TABLE public.vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES public.users(id) ON DELETE CASCADE,  -- OBRIGATÓRIO
  voucher_code VARCHAR(50) UNIQUE NOT NULL,                        -- OBRIGATÓRIO
  qr_code_data TEXT NOT NULL,                                      -- OBRIGATÓRIO
  status voucher_status_enum DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,                    -- OBRIGATÓRIO
  used_at TIMESTAMP WITH TIME ZONE,
  used_location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. **Mudanças Realizadas**

#### A. Seção 2 - Criação de Vouchers Iniciais

**ANTES:**
```sql
INSERT INTO public.vouchers (user_id, code, title, description, status, expires_at)
VALUES 
  ('d97e1c42-3468-425a-8784-4d646b2c4a57', 'IGOR001', 'Voucher Boas-vindas', 'Voucher de boas-vindas para Igor', 'active', NOW() + INTERVAL '30 days')
```

**DEPOIS:**
```sql
INSERT INTO public.vouchers (
  user_id, 
  merchant_id, 
  voucher_code, 
  qr_code_data, 
  status, 
  expires_at
)
VALUES 
  (
    'd97e1c42-3468-425a-8784-4d646b2c4a57', 
    merchant1_id, 
    'IGOR001', 
    'QR_IGOR001_' || EXTRACT(EPOCH FROM NOW())::text, 
    'active', 
    NOW() + INTERVAL '30 days'
  )
```

#### B. Função `create_initial_vouchers_for_user`

**ANTES:**
```sql
INSERT INTO public.vouchers (user_id, code, title, description, status, expires_at)
```

**DEPOIS:**
```sql
INSERT INTO public.vouchers (
  user_id, 
  merchant_id, 
  voucher_code, 
  qr_code_data, 
  status, 
  expires_at
)
```

#### C. Queries de Verificação

**ANTES:**
```sql
SELECT user_id, code, title, description, status, expires_at
```

**DEPOIS:**
```sql
SELECT user_id, voucher_code, status, expires_at, qr_code_data
```

### 3. **Campos Corrigidos**

| Campo Antigo | Campo Correto | Tipo | Obrigatório |
|-------------|---------------|------|-------------|
| `code` | `voucher_code` | VARCHAR(50) | ✅ SIM |
| `title` | ❌ Removido | - | - |
| `description` | ❌ Removido | - | - |
| ❌ Ausente | `merchant_id` | UUID | ✅ SIM |
| ❌ Ausente | `qr_code_data` | TEXT | ✅ SIM |

### 4. **Lógica de Merchant**

Adicionada lógica para:
- Buscar merchant existente (`merchant1@duopass.com`)
- Criar merchant do sistema se não existir
- Associar vouchers ao merchant correto

## 🎯 Como Executar a Correção

### Passo 1: Executar Script Corrigido
```bash
# No Supabase SQL Editor, execute:
fix-google-users-activation.sql
```

### Passo 2: Verificar Resultados

#### A. Usuário Ativado
```sql
SELECT id, email, subscription_status, user_type
FROM public.users
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';
```

#### B. Vouchers Criados
```sql
SELECT user_id, voucher_code, status, expires_at, qr_code_data
FROM public.vouchers
WHERE user_id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';
```

#### C. Merchants Criados
```sql
SELECT name, email, business_type
FROM public.merchants;
```

## 🔍 Troubleshooting

### Problema 1: Ainda Erro de business_name
**Solução:** Execute primeiro o script de verificação:
```sql
-- Execute: check-vouchers-structure.sql
```

### Problema 2: Merchant não encontrado
**Solução:** O script agora cria automaticamente um merchant do sistema.

### Problema 3: Conflito de voucher_code
**Solução:** O script usa `ON CONFLICT (voucher_code) DO NOTHING`.

## 📊 Resultados Esperados

✅ **Usuário Igor ativado** (`subscription_status = 'active'`)  
✅ **3 vouchers criados** com códigos IGOR001, IGOR002, IGOR003  
✅ **Merchants disponíveis** para o sistema  
✅ **Ofertas populadas** e ativas  
✅ **Sistema merchant** funcionando  

## 🚀 Próximos Passos

1. **Testar Dashboard:** Verificar se botões estão ativos
2. **Verificar Vouchers:** Confirmar carregamento no frontend
3. **Testar Merchant:** Validar sistema de validação
4. **Performance:** Monitorar queries e índices

---

**Data da Correção:** $(date)  
**Arquivo Corrigido:** `fix-google-users-activation.sql`  
**Status:** ✅ Pronto para execução