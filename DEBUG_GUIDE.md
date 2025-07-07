# 🔧 Guia de Debug para DUO PASS Club

## 🎯 Problema Resolvido: Build Minificado Dificulta Debug

Este guia resolve o problema de debugging em produção quando o código está minificado e ofuscado.

## 🚀 Novos Scripts Disponíveis

### Para Debug Local:
```bash
npm run build:debug    # Build não minificado
npm run build:dev      # Build com sourcemaps completos
npm run deploy:debug   # Build + mensagem de confirmação
```

### Para Produção (quando necessário):
```bash
npm run build:secure     # Build de produção padrão
npm run build:protected  # Build com lint + minificação máxima
npm run deploy:secure    # Deploy seguro completo
```

## 🔍 Como Fazer Debug no Servidor AWS

### 1. Deploy de Debug (quando servidor voltar):
```bash
# Conectar ao servidor
ssh -i C:\Users\igor_\Downloads\dpkeyaws.pem ubuntu@54.229.77.39

# Navegar para o projeto
cd /var/www/duopass

# Atualizar código
git pull origin main

# Build de debug (não minificado)
npm run build:debug

# Recarregar servidor
sudo systemctl reload nginx
```

### 2. Verificar Erros no Console:
- Abrir DevTools (F12)
- Ir para Console
- Erros agora mostrarão código legível
- Sourcemaps permitirão ver código original

### 3. Quando Terminar Debug:
```bash
# Voltar para build de produção
npm run build:secure
sudo systemctl reload nginx
```

## 📋 Diferenças entre Builds

| Tipo | Minificado | Sourcemaps | Tamanho | Uso |
|------|------------|------------|---------|-----|
| `build:debug` | ❌ Não | ✅ Inline | ~7MB | Debug fácil |
| `build:dev` | ❌ Não | ✅ Arquivos | ~8MB | Debug completo |
| `build` | ✅ Sim | ❌ Não | ~2MB | Produção padrão |
| `build:protected` | ✅ Máximo | ❌ Não | ~1.5MB | Produção segura |

## 🎭 Status Atual do Projeto

✅ **Código funcionando perfeitamente em local** (`http://localhost:5174/`)
❌ **Servidor AWS com problemas de conectividade**
✅ **Configurações de debug implementadas**
✅ **Scripts prontos para quando servidor voltar**

## 🔧 Próximos Passos

1. **Aguardar servidor AWS voltar**
2. **Fazer deploy com `npm run build:debug`**
3. **Identificar erros específicos no console**
4. **Reportar erros legíveis para correção**
5. **Voltar para build de produção após correções**

---

**💡 Dica:** Sempre use `build:debug` para identificar problemas e `build:secure` para produção final!