# 🚀 GUIA RÁPIDO - CORREÇÃO DO ERRO EMAILJS

## ❌ PROBLEMA

**Erro:** `The Public Key is invalid` (Status 400)

**Causa:** Chave pública do EmailJS inválida no arquivo `.env.production`

---

## ✅ SOLUÇÃO RÁPIDA

### **Opção 1: Script Automatizado (Recomendado)**

```powershell
# Execute na pasta project:
cd project
.\atualizar-chave-emailjs.ps1
```

### **Opção 2: Correção Manual**

1. **Obter chave correta:**
   - Acesse: https://dashboard.emailjs.com/admin/account
   - Vá em "API Keys" 
   - Copie a "Public Key"

2. **Atualizar arquivo:**
   - Abra: `project/.env.production`
   - Encontre: `VITE_EMAILJS_PUBLIC_KEY=`
   - Substitua pela chave correta
   - Salve o arquivo

3. **Reiniciar servidor:**
   ```bash
   cd project
   npm run dev
   ```

---

## 🧪 TESTE RÁPIDO

### **Teste via Navegador:**
```bash
cd project
node abrir-teste-emailjs.js
```

### **Teste via Aplicação:**
1. Acesse: http://localhost:5175/
2. Preencha formulário de parceiro
3. Verifique se emails são enviados

---

## ✅ LOGS DE SUCESSO

```
📧 Enviando emails...
✅ Email admin enviado: 200
✅ Email parceiro enviado: 200
✅ Processo concluído com sucesso!
```

---

## 📋 ARQUIVOS ÚTEIS

- `atualizar-chave-emailjs.ps1` - Script de atualização
- `teste-emailjs-browser.html` - Teste direto no navegador
- `CORRECAO_ERRO_EMAILJS_PUBLIC_KEY.md` - Guia detalhado
- `CONFIGURACAO_COMPLETA_EMAILJS.md` - Documentação completa

---

**⏱️ Tempo estimado:** 2-3 minutos  
**🎯 Status:** Pronto para uso