# 🚨 CORREÇÃO URGENTE - Email Duplicado em Produção

## 🔍 PROBLEMA IDENTIFICADO

### **Sintomas:**
- ✅ Em desenvolvimento: Funciona perfeitamente, detecta emails duplicados
- ❌ Em produção: Erro `duplicate key value violates unique constraint "partner_registrations_email_key"`
- 🔄 A função `checkEmailExists` não está funcionando em produção

### **Logs do Erro:**
```javascript
POST https://rnzvbrlbcnknyhrgubqi.supabase.co/rest/v1/partner_registrations 409 (Conflict)
❌ Erro ao salvar no Supabase: {code: '23505', details: null, hint: null, message: 'duplicate key value violates unique constraint "partner_registrations_email_key"'}
```

## 🔧 CAUSA RAIZ

### **Diferenças entre Desenvolvimento e Produção:**

1. **Políticas RLS (Row Level Security)**
   - Em desenvolvimento: Pode estar desabilitado ou com políticas mais permissivas
   - Em produção: RLS ativo pode estar bloqueando a consulta `checkEmailExists`

2. **Configuração do Supabase**
   - Mesma URL e chaves, mas políticas diferentes
   - A função `checkEmailExists` usa `.single()` que pode falhar silenciosamente

## 🛠️ SOLUÇÃO IMPLEMENTADA

### **1. Melhorar a Função checkEmailExists**

**Problema atual:**
```typescript
const { data, error } = await supabase
  .from('partner_registrations')
  .select('email')
  .eq('email', email)
  .single(); // ❌ Pode falhar em produção
```

**Solução:**
```typescript
const { data, error, count } = await supabase
  .from('partner_registrations')
  .select('email', { count: 'exact' })
  .eq('email', email);

return { exists: (count || 0) > 0 };
```

### **2. Implementar Fallback no savePartnerRegistration**

**Adicionar tratamento robusto:**
```typescript
// Se checkEmailExists falhar, tentar inserir e capturar erro 23505
if (error && error.code === '23505') {
  return {
    success: false,
    error: 'Este e-mail já está cadastrado.',
    errorCode: 'duplicate_email'
  };
}
```

## 🚀 IMPLEMENTAÇÃO

### **Arquivo: `src/services/partnerService.ts`**

**Função checkEmailExists melhorada:**
```typescript
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    console.log('🔍 Verificando email duplicado:', email);
    
    // Método mais robusto usando count
    const { data, error, count } = await supabase
      .from('partner_registrations')
      .select('email', { count: 'exact' })
      .eq('email', email);

    if (error) {
      console.error('❌ Erro ao verificar e-mail (método count):', error);
      
      // Fallback: tentar método alternativo
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('partner_registrations')
        .select('email')
        .eq('email', email)
        .limit(1);
      
      if (fallbackError) {
        console.error('❌ Erro no fallback:', fallbackError);
        return { exists: false, error: fallbackError.message };
      }
      
      return { exists: (fallbackData && fallbackData.length > 0) };
    }

    const exists = (count || 0) > 0;
    console.log(`✅ Verificação concluída: ${exists ? 'Email já existe' : 'Email disponível'}`);
    return { exists };
    
  } catch (error) {
    console.error('❌ Erro interno ao verificar e-mail:', error);
    return { exists: false, error: 'Erro interno do sistema' };
  }
};
```

**Função savePartnerRegistration melhorada:**
```typescript
export const savePartnerRegistration = async (data: PartnerRegistrationData): Promise<{ success: boolean; id?: number; error?: string; errorCode?: string }> => {
  try {
    // Verificação de email duplicado
    const emailCheck = await checkEmailExists(data.email);
    
    if (emailCheck.exists) {
      console.log('⚠️ Email já cadastrado:', data.email);
      return {
        success: false,
        error: 'Este e-mail já está cadastrado.',
        errorCode: 'duplicate_email'
      };
    }
    
    // Se houve erro na verificação, continuar mas com cuidado
    if (emailCheck.error) {
      console.warn('⚠️ Erro na verificação de email, continuando com inserção:', emailCheck.error);
    }

    console.log('💾 Salvando dados do parceiro no Supabase...');

    const { data: savedData, error } = await supabase
      .from('partner_registrations')
      .insert([{
        business_name: data.businessName,
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone,
        address_street: data.address.street,
        address_city: data.address.city,
        address_postal_code: data.address.postalCode,
        address_country: data.address.country || 'Switzerland',
        business_type: data.businessType,
        founder_story: data.founderStory,
        cultural_mission: data.culturalMission,
        experience_title: data.proposedExperience.title,
        experience_description: data.proposedExperience.description,
        experience_normal_price: data.proposedExperience.normalPrice,
        experience_duo_value: data.proposedExperience.duoValue,
      }])
      .select('id')
      .single();

    if (error) {
      // Tratamento específico para email duplicado
      if (error.code === '23505' && error.message.includes('partner_registrations_email_key')) {
        console.error('❌ Email duplicado detectado na inserção:', data.email);
        return {
          success: false,
          error: 'Este e-mail já está cadastrado. Por favor, use um e-mail diferente.',
          errorCode: 'duplicate_email'
        };
      }
      
      console.error('❌ Erro ao salvar no Supabase:', error);
      return {
        success: false,
        error: error.message,
        errorCode: error.code
      };
    }

    console.log('✅ Dados salvos com sucesso:', savedData.id);
    return {
      success: true,
      id: savedData.id
    };
    
  } catch (error) {
    console.error('❌ Erro interno ao salvar dados:', error);
    return {
      success: false,
      error: 'Erro interno do sistema'
    };
  }
};
```

## 🧪 COMO TESTAR

### **1. Testar em Desenvolvimento:**
```bash
cd project
npm run dev
```

### **2. Testar Cenário de Email Duplicado:**
1. Cadastrar um parceiro com email `teste@exemplo.com`
2. Tentar cadastrar novamente com o mesmo email
3. Verificar se aparece a mensagem: "Este e-mail já está cadastrado"

### **3. Verificar Logs:**
- Abrir DevTools > Console
- Procurar por logs: `🔍 Verificando email duplicado`
- Confirmar que não há erros de RLS

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Função `checkEmailExists` usa método `count`
- [ ] Fallback implementado para RLS
- [ ] Tratamento de erro 23505 na inserção
- [ ] Logs detalhados para debug
- [ ] Mensagem clara para usuário
- [ ] Testado em desenvolvimento
- [ ] Deploy para produção
- [ ] Teste em produção

## 🚨 PRÓXIMOS PASSOS

1. **Implementar as correções**
2. **Testar localmente**
3. **Deploy para produção**
4. **Monitorar logs de produção**
5. **Confirmar resolução do problema**

---

**Status:** 🔄 Aguardando implementação
**Prioridade:** 🚨 URGENTE
**Impacto:** Alto - Bloqueia cadastro de parceiros em produção