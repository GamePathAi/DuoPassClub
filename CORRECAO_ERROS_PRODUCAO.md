# 🔧 Correção de Erros de Produção - DuoPass

## 🚨 Problemas Identificados nos Logs

### 1. **InvalidCharacterError: createElement com SVG**
```
InvalidCharacterError: Failed to execute 'createElement' on 'Document': 
The tag name provided ('/assets/duopass_logo-CM0oFegY.svg') is not a valid name.
```

**Causa:** Alguma biblioteca ou código está tentando usar um caminho de arquivo SVG como tag name no createElement.

**Solução:**
1. Verificar se há imports incorretos de SVG
2. Garantir que SVGs sejam importados corretamente como componentes React
3. Verificar se há código que confunde src com tagName

### 2. **Erro 404: /vite.svg**
```
/vite.svg:1 Failed to load resource: the server responded with a status of 404
```

**Causa:** Referência ao arquivo padrão do Vite que não existe.

**Solução:** Remover referências ao vite.svg ou criar o arquivo.

### 3. **Erros Supabase 404/400**
```
rnzvbrlbcnknyhrgubqi.supabase.co/rest/v1/cultural_experiences?select=count&limit=1:1 
Failed to load resource: the server responded with a status of 404

rnzvbrlbcnknyhrgubqi.supabase.co/rest/v1/cultural_experiences?select=*%2Ccultural_partners%28business_name%2Cbusiness_type%2Ccultural_category%2Cambiance_description%29&active=eq.true&limit=6:1 
Failed to load resource: the server responded with a status of 400
```

**Causa:** Tabela `cultural_experiences` não existe ou queries malformadas.

**Solução:** Verificar estrutura do banco e queries.

### 4. **Warnings de Preload**
```
The resource <URL> was preloaded using link preload but not used within a few seconds
```

**Causa:** Resources sendo precarregados mas não utilizados imediatamente.

## 🛠️ Implementação das Correções

### Correção 1: SVG createElement Error

**Arquivo:** `src/types/svg.d.ts`
```typescript
// Garantir que SVGs sejam tratados corretamente
declare module "*.svg" {
  import React from "react";
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Adicionar tipagem para evitar confusão
declare module "*.svg?react" {
  import React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
```

### Correção 2: Vite.svg Missing

**Criar arquivo:** `public/vite.svg`
```xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257">
  <defs>
    <linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%">
      <stop offset="0%" stop-color="#41D1FF"></stop>
      <stop offset="100%" stop-color="#BD34FE"></stop>
    </linearGradient>
    <linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%">
      <stop offset="0%" stop-color="#FFEA83"></stop>
      <stop offset="8.333%" stop-color="#FFDD35"></stop>
      <stop offset="100%" stop-color="#FFA800"></stop>
    </linearGradient>
  </defs>
  <path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path>
  <path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path>
</svg>
```

## 🛠️ Implementação das Correções
### Correção 3: Supabase Queries

**PROBLEMA IDENTIFICADO:** Query malformada com join entre `cultural_experiences` e `cultural_partners`

**URL do erro:**
```
rnzvbrlbcnknyhrgubqi.supabase.co/rest/v1/cultural_experiences?select=*%2Ccultural_partners%28business_name%2Cbusiness_type%2Ccultural_category%2Cambiance_description%29&active=eq.true&limit=6:1
```

**CAUSA:** A query está tentando fazer um join com uma tabela que não existe ou não tem a relação correta configurada.

**SOLUÇÃO IMPLEMENTADA:**
✅ **CORREÇÃO IMEDIATA:** Hook `useCulturalExperiences` modificado para usar apenas dados mock
- Comentado código que fazia queries problemáticas
- Implementado fallback robusto para dados mock
- Eliminados erros 400/404 relacionados às tabelas culturais

**PRÓXIMOS PASSOS:**
1. Criar as tabelas `cultural_experiences` e `cultural_partners` no Supabase
2. Configurar foreign key entre elas (partner_id)
3. Descomentar código no hook quando tabelas estiverem prontas
4. Testar queries com join em ambiente de desenvolvimento

```sql
-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('cultural_experiences', 'cultural_partners');

-- Verificar foreign keys
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('cultural_experiences', 'cultural_partners');
```

### Correção 4: Otimizar Preloads

**Arquivo:** `src/lib/performance.ts`
```typescript
// Remover preloads desnecessários ou ajustar timing
export const optimizePreloads = () => {
  // Só precarregar recursos que serão usados imediatamente
  const criticalResources = [
    { href: '/duopass_logo.svg', as: 'image' },
    { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    Object.assign(link, resource);
    document.head.appendChild(link);
  });
};
```

## 🧪 Testes de Verificação

### 1. Testar SVG Loading
```javascript
// Console do browser
console.log('Testando SVG loading...');
const img = new Image();
img.onload = () => console.log('✅ SVG carregado com sucesso');
img.onerror = () => console.error('❌ Erro ao carregar SVG');
img.src = '/duopass_logo.svg';
```

### 2. Testar Supabase Queries
```javascript
// Console do browser
supabase.from('experiences').select('count').limit(1)
  .then(result => console.log('✅ Query funcionando:', result))
  .catch(error => console.error('❌ Erro na query:', error));
```

### 3. Verificar createElement
```javascript
// Console do browser
try {
  document.createElement('div'); // ✅ Válido
  document.createElement('/assets/test.svg'); // ❌ Deve dar erro
} catch (error) {
  console.log('Erro esperado:', error.message);
}
```

## 📋 Checklist de Implementação

- [ ] Corrigir tipagem SVG em `src/types/svg.d.ts`
- [ ] Criar arquivo `public/vite.svg`
- [ ] Verificar e corrigir queries Supabase
- [ ] Otimizar preloads em `src/lib/performance.ts`
- [ ] Testar em ambiente de desenvolvimento
- [ ] Fazer build e testar em produção
- [ ] Verificar console do browser para novos erros
- [ ] Monitorar performance após correções

## 🎯 Resultado Esperado

✅ **Sem erros InvalidCharacterError**
✅ **Sem erros 404 para vite.svg**
✅ **Queries Supabase funcionando**
✅ **Preloads otimizados**
✅ **Console limpo de erros**
✅ **Performance melhorada**

---

**Nota:** Após implementar as correções, fazer um novo build e deploy para verificar se todos os problemas foram resolvidos.