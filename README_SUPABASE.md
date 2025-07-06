# Organização do Supabase - DuoPass

Este documento descreve a organização completa do banco de dados Supabase para o sistema DuoPass.

## 📁 Arquivos Criados

### 1. Schema e Configuração
- **`supabase-schema.sql`** - Schema completo do banco de dados
- **`supabase-seeds.sql`** - Dados iniciais e funções utilitárias
- **`SUPABASE_SETUP.md`** - Guia completo de configuração

### 2. Configuração TypeScript
- **`src/lib/supabaseConfig.ts`** - Configuração avançada do cliente Supabase
- **`src/lib/supabase.ts`** - Re-exports para compatibilidade
- **`src/lib/supabaseUtils.ts`** - Utilitários para operações comuns
- **`src/types/database.ts`** - Tipos TypeScript para o banco

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### `users`
- Perfis de usuários (clientes e comerciantes)
- Estende `auth.users` do Supabase
- Campos: id, email, full_name, user_type, subscription_status, business_name, contact_info

#### `categories`
- Categorias de ofertas
- Campos: id, name, icon, slug

#### `offers`
- Ofertas dos comerciantes
- Campos: id, merchant_id, title, description, original_value, category, location, expires_at, is_active, image_url, terms_conditions

#### `activated_coupons`
- Cupons ativados pelos usuários
- Campos: id, user_id, offer_id, activated_at, used_at, status

#### `vouchers`
- Vouchers gerados para parcerias
- Campos: id, user_id, merchant_id, voucher_code, qr_code_data, status, expires_at, used_at, used_location

#### `voucher_usage`
- Histórico de uso dos vouchers
- Campos: id, voucher_id, merchant_id, user_id, used_at, location, validated_by

### Funções do Banco

#### Relatórios
- `get_system_stats()` - Estatísticas gerais do sistema
- `get_monthly_usage_report(target_month)` - Relatório mensal de uso

#### Manutenção
- `expire_old_vouchers()` - Expira vouchers antigos
- `expire_old_coupons()` - Expira cupons antigos

#### Desenvolvimento
- `create_test_users()` - Cria usuários de teste
- `clean_test_data()` - Remove dados de teste

## 🔧 Como Usar

### 1. Configuração Inicial

```bash
# 1. Copiar variáveis de ambiente
cp .env.example .env

# 2. Editar .env com suas credenciais do Supabase
# VITE_SUPABASE_URL=https://seu-projeto.supabase.co
# VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

### 2. Executar Schema no Supabase

1. Acesse o painel do Supabase
2. Vá para **SQL Editor**
3. Execute o conteúdo de `supabase-schema.sql`
4. Execute o conteúdo de `supabase-seeds.sql` (opcional, para dados de teste)

### 3. Usar no Código

#### Importação Básica
```typescript
import { supabase } from '../lib/supabase';
```

#### Usando Utilitários
```typescript
import { supabaseUtils } from '../lib/supabaseUtils';

// Buscar ofertas ativas
const { data: offers, error } = await supabaseUtils.offer.getActiveOffers(1, 10);

// Buscar vouchers do usuário
const { data: vouchers } = await supabaseUtils.voucher.getUserVouchers(userId);

// Ativar cupom
const result = await supabaseUtils.coupon.activate(userId, offerId);
```

#### Usando Configuração Avançada
```typescript
import { checkSupabaseConnection, getSystemStats } from '../lib/supabase';

// Verificar conexão
const connectionStatus = await checkSupabaseConnection();

// Obter estatísticas
const stats = await getSystemStats();
```

### 4. Tipos TypeScript

```typescript
import { DbUser, DbOffer, InsertVoucher, ApiResponse } from '../types/database';

// Função tipada
const createOffer = async (offerData: InsertOffer): Promise<ApiResponse<DbOffer>> => {
  // implementação
};
```

## 🔐 Segurança (RLS)

### Políticas Implementadas

#### Usuários
- ✅ Usuários podem ver/editar apenas seu próprio perfil
- ✅ Perfis de comerciantes são públicos

#### Ofertas
- ✅ Qualquer pessoa pode ver ofertas ativas
- ✅ Comerciantes gerenciam apenas suas ofertas

#### Vouchers
- ✅ Usuários veem apenas seus vouchers
- ✅ Comerciantes veem vouchers do seu negócio
- ✅ Apenas comerciantes podem validar vouchers

#### Cupons
- ✅ Usuários gerenciam apenas seus cupons

## 📊 Monitoramento

### Verificar Status do Sistema
```typescript
import { getSystemStats } from '../lib/supabase';

const stats = await getSystemStats();
console.log('Total de usuários:', stats.total_users);
console.log('Ofertas ativas:', stats.active_offers);
console.log('Taxa de uso de vouchers:', stats.used_vouchers / stats.total_vouchers);
```

### Relatório Mensal
```typescript
import { getMonthlyReport } from '../lib/supabase';

const report = await getMonthlyReport('2024-01-01');
console.log('Vouchers gerados:', report.vouchers_generated);
console.log('Taxa de uso:', report.usage_rate + '%');
```

## 🧪 Dados de Teste

### Criar Dados de Teste
```sql
-- No SQL Editor do Supabase
SELECT create_test_users();
```

### Usuários de Teste Criados
- **Cliente**: `cliente@duopass.com` (senha: 123456)
- **Pizzaria**: `pizzaria@duopass.com` (senha: 123456)
- **Salão**: `salao@duopass.com` (senha: 123456)

### Limpar Dados de Teste
```sql
SELECT clean_test_data();
```

## 🔄 Manutenção

### Limpeza Automática
```typescript
import { supabaseUtils } from '../lib/supabaseUtils';

// Expirar vouchers antigos
await supabaseUtils.cleanup.expireOldVouchers();

// Expirar cupons antigos
await supabaseUtils.cleanup.expireOldCoupons();
```

### Backup
- Configure backups automáticos no painel do Supabase
- Recomendado: backup diário

## 🚀 Próximos Passos

1. **Configurar Supabase**: Siga o `SUPABASE_SETUP.md`
2. **Executar Schema**: Execute `supabase-schema.sql`
3. **Testar Conexão**: Use `checkSupabaseConnection()`
4. **Criar Dados de Teste**: Execute `supabase-seeds.sql`
5. **Implementar Features**: Use `supabaseUtils` nas suas páginas

## 📚 Recursos Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [TypeScript com Supabase](https://supabase.com/docs/guides/api/generating-types)

## 🐛 Troubleshooting

### Erro de Conexão
```typescript
import { checkSupabaseConnection } from '../lib/supabase';

const status = await checkSupabaseConnection();
if (!status.connected) {
  console.error('Erro de conexão:', status.error);
}
```

### Verificar Variáveis de Ambiente
```typescript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada');
```

### Logs do Supabase
- Acesse **Logs** no painel do Supabase
- Monitore logs de Database, Auth e API

---

**Nota**: Esta organização foi criada para facilitar o desenvolvimento e manutenção do sistema DuoPass. Todos os arquivos estão documentados e prontos para uso em produção.