# 🔧 SOLUÇÃO: DISCREPÂNCIA DE DADOS ENTRE LOCALHOST E PRODUÇÃO

## 🚨 PROBLEMA IDENTIFICADO

### **Causa Raiz:**
O componente `CulturalExperiences` na página inicial está buscando dados da tabela `offers` (que contém ofertas comerciais como Pizza, Maquiagem, Cinema) em vez de buscar dados de experiências culturais reais.

### **Estrutura Atual Problemática:**
```typescript
// ❌ PROBLEMA: CulturalExperiences.tsx usa useExperiences
// que busca da tabela 'offers' (dados comerciais)
const { experiences: allExperiences } = useExperiences();

// ❌ RESULTADO: Exibe ofertas comerciais como experiências culturais
// - Pizza Margherita 50% OFF
// - Maquiagem Completa - 50% OFF  
// - Cinema: 2 Ingressos por CHF 38
// - Academia: 3 Meses por CHF 180
```

### **Estrutura Correta Disponível:**
O projeto já possui uma estrutura completa para experiências culturais:
- ✅ Tabela `cultural_partners`
- ✅ Tabela `cultural_experiences` 
- ✅ Interface `CulturalExperience` em `ExperienceDetails.tsx`
- ✅ Dados mock culturais (Sarau Literário, Jantar à Luz de Velas, Oficina de Cerâmica)

## 🎯 SOLUÇÕES PROPOSTAS

### **SOLUÇÃO 1: CRIAR HOOK ESPECÍFICO PARA EXPERIÊNCIAS CULTURAIS (RECOMENDADA)**

```typescript
// Criar: src/hooks/useCulturalExperiences.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CulturalExperience {
  id: string;
  experience_name: string;
  story_behind: string;
  cultural_value: string;
  duo_benefit: string;
  original_price: number;
  duo_price: number;
  ambiance_notes: string;
  best_for: string[];
  cultural_tags: string[];
  emotion_tags: string[];
  active: boolean;
  cultural_partners: {
    id: string;
    business_name: string;
    business_type: string;
    cultural_category: string;
    ambiance_description: string;
    contact_name: string;
    email: string;
    address: any;
  };
}

export function useCulturalExperiences() {
  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCulturalExperiences() {
      try {
        const { data, error } = await supabase
          .from('cultural_experiences')
          .select(`
            *,
            cultural_partners (*)
          `)
          .eq('active', true);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setExperiences(data);
        } else {
          // Fallback para dados mock se banco estiver vazio
          setExperiences(getMockCulturalExperiences());
        }
      } catch (err) {
        console.error('Erro ao buscar experiências culturais:', err);
        setError(err.message);
        // Fallback para dados mock em caso de erro
        setExperiences(getMockCulturalExperiences());
      } finally {
        setLoading(false);
      }
    }

    fetchCulturalExperiences();
  }, []);

  return { experiences, loading, error };
}

function getMockCulturalExperiences(): CulturalExperience[] {
  return [
    {
      id: 'sarau-literario',
      experience_name: 'Sarau Literário com Café Especial',
      story_behind: 'Uma noite especial onde poesia e café se encontram...',
      cultural_value: 'Valoriza a literatura brasileira contemporânea...',
      duo_benefit: 'Duas pessoas participam do sarau e degustam cafés especiais pelo preço de uma.',
      original_price: 60.00,
      duo_price: 30.00,
      ambiance_notes: 'Luzes suaves, música acústica ao vivo...',
      best_for: ['primeiro_encontro', 'amigos_arte'],
      cultural_tags: ['literatura', 'cafe_especial', 'musica_acustica'],
      emotion_tags: ['reflexao', 'descoberta'],
      active: true,
      cultural_partners: {
        id: 'cafe-das-letras',
        business_name: 'Café das Letras',
        business_type: 'cafe_cultural',
        cultural_category: 'literatura_gastronomia',
        ambiance_description: 'Café literário acolhedor...',
        contact_name: 'Ana Beatriz',
        email: 'contato@cafedasletras.com',
        address: {
          street: 'Rua da Poesia, 123',
          city: 'Vila Madalena',
          state: 'São Paulo',
          zipcode: '05014-020'
        }
      }
    },
    // ... outras experiências culturais
  ];
}
```

### **SOLUÇÃO 2: MODIFICAR CulturalExperiences.tsx**

```typescript
// Modificar: src/components/CulturalExperiences.tsx
// TROCAR:
import { useExperiences } from '../hooks/useExperiences';

// POR:
import { useCulturalExperiences } from '../hooks/useCulturalExperiences';

// E TROCAR:
const { experiences: allExperiences, loading, error } = useExperiences();

// POR:
const { experiences: allExperiences, loading, error } = useCulturalExperiences();
```

### **SOLUÇÃO 3: POPULAR BANCO COM DADOS CULTURAIS REAIS**

```javascript
// Criar: populate-cultural-experiences.cjs
const culturalExperiences = [
  {
    partner_id: 'cafe-das-letras-uuid',
    experience_name: 'Sarau Literário com Café Especial',
    story_behind: 'Uma noite especial onde poesia e café se encontram...',
    cultural_value: 'Valoriza a literatura brasileira contemporânea...',
    duo_benefit: 'Duas pessoas participam do sarau pelo preço de uma',
    original_price: 60.00,
    duo_price: 30.00,
    ambiance_notes: 'Luzes suaves, música acústica ao vivo...',
    best_for: ['primeiro_encontro', 'amigos_arte'],
    cultural_tags: ['literatura', 'cafe_especial'],
    emotion_tags: ['reflexao', 'descoberta'],
    active: true
  },
  // ... outras experiências
];
```

## 📋 PLANO DE IMPLEMENTAÇÃO

### **ETAPA 1: CRIAR HOOK ESPECÍFICO**
- [ ] Criar `src/hooks/useCulturalExperiences.ts`
- [ ] Implementar busca na tabela `cultural_experiences`
- [ ] Adicionar fallback para dados mock
- [ ] Testar hook isoladamente

### **ETAPA 2: MODIFICAR COMPONENTE**
- [ ] Atualizar `CulturalExperiences.tsx`
- [ ] Trocar `useExperiences` por `useCulturalExperiences`
- [ ] Ajustar tipagem se necessário
- [ ] Testar renderização

### **ETAPA 3: POPULAR BANCO (OPCIONAL)**
- [ ] Criar script para popular `cultural_experiences`
- [ ] Inserir dados culturais reais
- [ ] Configurar RLS policies se necessário
- [ ] Testar busca no banco

### **ETAPA 4: VALIDAÇÃO**
- [ ] Testar localhost:5175
- [ ] Comparar com duopassclub.ch
- [ ] Verificar consistência de dados
- [ ] Documentar mudanças

## 🎯 RESULTADOS ESPERADOS

### **ANTES (Problemático):**
```
Home Page → CulturalExperiences → useExperiences → tabela 'offers'
↓
Exibe: Pizza Margherita, Maquiagem, Cinema, Academia
```

### **DEPOIS (Correto):**
```
Home Page → CulturalExperiences → useCulturalExperiences → tabela 'cultural_experiences'
↓
Exibe: Sarau Literário, Jantar à Luz de Velas, Oficina de Cerâmica
```

## ⚠️ OBSERVAÇÕES IMPORTANTES

1. **Separação Clara:** Ofertas comerciais ≠ Experiências culturais
2. **Estrutura Existente:** O projeto já tem toda estrutura necessária
3. **Dados Mock:** Já existem dados culturais mock prontos
4. **RLS Policies:** Verificar permissões no Supabase
5. **Consistência:** Garantir que ambos ambientes usem mesma fonte

## 🚀 PRÓXIMOS PASSOS

1. **IMPLEMENTAR SOLUÇÃO 1** (hook específico)
2. **TESTAR MUDANÇAS** no localhost
3. **VERIFICAR CONSISTÊNCIA** com produção
4. **DOCUMENTAR ARQUITETURA** final

---

**📝 CONCLUSÃO:** O problema não é de dados mock vs produção, mas sim de **fonte de dados incorreta**. O componente está buscando ofertas comerciais quando deveria buscar experiências culturais.