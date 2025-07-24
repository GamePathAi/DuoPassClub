# 🚨 ERRO CRÍTICO EM PRODUÇÃO - AÇÃO URGENTE NECESSÁRIA

## ❌ Problema Identificado
**Erro:** `Could not find the 'privacy_accepted' column of 'partner_registrations' in the schema cache`

**Causa:** O esquema da tabela `partner_registrations` em produção está desatualizado e não possui as colunas necessárias.

## 🔥 Impacto
- ❌ Cadastro de parceiros **NÃO FUNCIONA** em produção
- ❌ Formulários de registro geram erro
- ❌ Usuários não conseguem se cadastrar como parceiros

## ⚡ SOLUÇÃO URGENTE (5 minutos)

### 1. Execute o SQL de Correção no Supabase
1. Acesse: https://app.supabase.com/project/[SEU_PROJECT_ID]/sql/new
2. Copie todo o conteúdo do arquivo `CORRIGIR_PARTNER_REGISTRATIONS_PRODUCAO.sql`
3. Cole no SQL Editor do Supabase
4. Clique em "Run" para executar

### 2. Verificação Imediata
Após executar o SQL, você deve ver:
```
✅ Colunas adicionadas com sucesso
✅ Índices criados
✅ Teste de inserção funcionando
✅ Estrutura da tabela corrigida
```

### 3. Teste em Produção
1. Acesse: https://duopassclub.ch
2. Vá para o formulário de cadastro de parceiros
3. Preencha e envie um teste
4. Verifique se não há mais erros no console

## 📋 Colunas Que Serão Adicionadas
- ✅ `privacy_accepted` (CRÍTICA - causa do erro)
- ✅ `terms_accepted`
- ✅ `updated_at`
- ✅ `business_name`
- ✅ `contact_name`
- ✅ `phone`
- ✅ `business_type`
- ✅ `address_street`
- ✅ `address_city`
- ✅ `address_postal_code`
- ✅ `address_country`
- ✅ `website_url`
- ✅ `instagram_handle`
- ✅ `description`

## 🔍 Outros Erros Identificados
- ⚠️ Múltiplos erros "NaN" - podem estar relacionados a campos numéricos
- ⚠️ Browsing Topics API removida - não crítico

## 📱 Se o Problema Persistir
1. **Limpe o cache do navegador** (Ctrl+F5)
2. **Execute o build sync completo** usando `INSTRUCOES_DEPLOY_SYNC.md`
3. **Verifique logs do Supabase** para outros erros

## ⏰ Tempo Estimado de Correção
- **SQL no Supabase**: 2-3 minutos
- **Teste e verificação**: 2-3 minutos
- **Total**: 5-6 minutos

---

## 🎯 Arquivos Relacionados
- ✅ `CORRIGIR_PARTNER_REGISTRATIONS_PRODUCAO.sql` (execute AGORA)
- 📋 `INSTRUCOES_DEPLOY_SYNC.md` (se necessário)
- 📋 `scripts/fix-partner-registrations-schema.sql` (referência)

**Status:** 🚨 CRÍTICO - Requer ação imediata