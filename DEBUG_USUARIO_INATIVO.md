# 🔍 Debug Sistemático - Usuário Ainda Inativo

## 🚨 Problema Identificado
Apesar do SQL ter sido executado com sucesso, a interface ainda mostra o usuário como "Inativo". Vamos investigar e corrigir definitivamente.

## 📋 Plano de Debug Sistemático

### Passo 1: Verificar Banco de Dados

#### 1.1 Executar Script de Debug SQL
```sql
-- Execute no Supabase SQL Editor:
-- Arquivo: debug_and_fix_igor_user.sql
```

**Resultado Esperado:**
- Usuário Igor com `subscription_status = 'active'`
- `user_type = 'client'`
- `email_verified = true`
- Vouchers criados (se tabela existir)

#### 1.2 Verificar Políticas RLS
Se o usuário não aparecer ou não puder ser atualizado, pode ser problema de Row Level Security.

### Passo 2: Debug Frontend

#### 2.1 Executar Script de Debug JavaScript
```javascript
// No console do navegador (F12):
// 1. Abrir localhost:5174
// 2. Pressionar F12
// 3. Ir na aba Console
// 4. Copiar e colar o conteúdo do arquivo: debug_user_status.js
```

**O que o script vai verificar:**
- ✅ Dados do AuthContext
- ✅ localStorage e sessionStorage
- ✅ Conexão com Supabase
- ✅ Dados reais do usuário no banco
- ✅ Status atual do perfil

#### 2.2 Comandos Disponíveis no Console
```javascript
// Executar debug completo
debugDuoPass.runFullDebug()

// Forçar atualização do perfil
debugDuoPass.forceProfileRefresh()

// Limpar cache e recarregar
debugDuoPass.clearCacheAndReload()

// Verificar conexão Supabase
debugDuoPass.checkSupabaseConnection()
```

### Passo 3: Possíveis Causas e Soluções

#### 3.1 Causa: Campo Errado no Banco
**Sintoma:** SQL executado mas frontend ainda mostra "Inativo"

**Solução:**
```sql
-- Verificar todos os campos de status
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name LIKE '%status%';

-- Atualizar TODOS os campos possíveis
UPDATE public.users 
SET 
    subscription_status = 'active',
    status = 'active',  -- Se existir
    user_type = 'client',
    email_verified = true
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';
```

#### 3.2 Causa: Cache do Frontend
**Sintoma:** Dados corretos no banco, mas interface não atualiza

**Solução:**
```javascript
// No console do navegador:
debugDuoPass.clearCacheAndReload()

// Ou manualmente:
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

#### 3.3 Causa: Lógica Frontend Incorreta
**Sintoma:** Frontend lendo campo errado

**Verificação:**
```javascript
// No console, verificar que campo está sendo lido:
console.log('UserProfile:', window.authContext?.userProfile);
console.log('Subscription Status:', window.authContext?.userProfile?.subscription_status);
```

**Solução:** Corrigir nos arquivos:
- `src/components/Layout/UserDropdown.tsx`
- `src/components/Layout/Sidebar.tsx`
- `src/components/Layout/MobileMenu.tsx`

#### 3.4 Causa: Usuário Duplicado
**Sintoma:** Múltiplos registros para o mesmo email

**Verificação:**
```sql
SELECT id, email, subscription_status, created_at 
FROM public.users 
WHERE email = 'igor.bonafe@gmail.com'
ORDER BY created_at DESC;
```

**Solução:**
```sql
-- Manter apenas o registro mais recente
-- Deletar registros duplicados (cuidado!)
```

#### 3.5 Causa: Políticas RLS Bloqueando
**Sintoma:** Usuário não consegue ver próprios dados

**Verificação:**
```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'users';
```

**Solução:**
```sql
-- Temporariamente desabilitar RLS para teste
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Testar se resolve, depois reabilitar:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

### Passo 4: Teste Final

#### 4.1 Verificação Completa
1. ✅ Executar `debug_and_fix_igor_user.sql`
2. ✅ Executar `debug_user_status.js` no console
3. ✅ Limpar cache: `debugDuoPass.clearCacheAndReload()`
4. ✅ Fazer login novamente
5. ✅ Verificar se aparece "Ativo"
6. ✅ Testar botões do dashboard

#### 4.2 Resultado Esperado
```
✅ Usuário: igor.bonafe@gmail.com
✅ Status: Ativo (verde)
✅ Tipo: Cliente
✅ Botões funcionando
✅ Dashboard acessível
```

## 🔧 Comandos Rápidos

### SQL (Supabase)
```sql
-- Verificar usuário
SELECT * FROM public.users WHERE email = 'igor.bonafe@gmail.com';

-- Forçar ativação
UPDATE public.users 
SET subscription_status = 'active', user_type = 'client'
WHERE id = 'd97e1c42-3468-425a-8784-4d646b2c4a57';
```

### JavaScript (Console)
```javascript
// Debug completo
debugDuoPass.runFullDebug()

// Limpar e recarregar
debugDuoPass.clearCacheAndReload()
```

### PowerShell (Terminal)
```powershell
# Reiniciar servidor
npm run dev
```

## 📞 Próximos Passos

1. **Execute o debug SQL primeiro**
2. **Execute o debug JavaScript no navegador**
3. **Analise os logs para identificar a causa**
4. **Aplique a solução específica**
5. **Teste o resultado final**

## 🎯 Meta
**Usuário Igor aparecendo como "Ativo" na interface e botões funcionando perfeitamente.**