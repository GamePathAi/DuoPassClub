#!/bin/bash

# Script para atualizar a chave pública do EmailJS
# Execute com: ./atualizar-chave-emailjs.sh

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Cabeçalho
echo -e "\n${GREEN}🔑 ATUALIZADOR DE CHAVE PÚBLICA EMAILJS${NC}"
echo -e "${GREEN}=========================================${NC}\n"

# Verificar se estamos na pasta correta
if [ ! -d "project" ]; then
    echo -e "${RED}❌ ERRO: Pasta 'project' não encontrada!${NC}"
    echo -e "${YELLOW}Por favor, execute este script na pasta raiz do projeto DuoPass.${NC}"
    exit 1
fi

# Mudar para a pasta do projeto
cd project
echo -e "${CYAN}✅ Pasta do projeto encontrada: $(pwd)${NC}"

# Verificar se o arquivo .env.production existe
ENV_FILE=".env.production"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ ERRO: Arquivo $ENV_FILE não encontrado!${NC}"
    exit 1
fi

# Solicitar a nova chave pública
echo -e "\n${YELLOW}📝 Digite a nova chave pública do EmailJS:${NC}"
echo -e "${YELLOW}(Obtenha em: https://dashboard.emailjs.com/admin/account > API Keys)${NC}"
echo -e "\n${CYAN}👉 Chave pública: ${NC}" 
read NEW_PUBLIC_KEY

# Validar a entrada
if [ -z "$NEW_PUBLIC_KEY" ]; then
    echo -e "\n${RED}❌ ERRO: Chave pública não pode ser vazia!${NC}"
    exit 1
fi

# Fazer backup do arquivo original
BACKUP_FILE="${ENV_FILE}.backup"
cp "$ENV_FILE" "$BACKUP_FILE"
echo -e "\n${GREEN}✅ Backup criado: $BACKUP_FILE${NC}"

# Atualizar a chave pública no arquivo
if [[ "$(uname)" == "Darwin" ]]; then
    # macOS usa sed diferente
    sed -i '' "s/VITE_EMAILJS_PUBLIC_KEY=.*/VITE_EMAILJS_PUBLIC_KEY=$NEW_PUBLIC_KEY/" "$ENV_FILE"
else
    # Linux
    sed -i "s/VITE_EMAILJS_PUBLIC_KEY=.*/VITE_EMAILJS_PUBLIC_KEY=$NEW_PUBLIC_KEY/" "$ENV_FILE"
fi

echo -e "\n${GREEN}✅ Chave pública atualizada com sucesso!${NC}"

# Instruções finais
echo -e "\n${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
echo -e "${CYAN}1. Reinicie o servidor de desenvolvimento:${NC}"
echo -e "   npm run dev"
echo -e "${CYAN}2. Teste o envio de emails usando o formulário de contato${NC}"
echo -e "${CYAN}3. Verifique se não há erros no console do navegador${NC}"

echo -e "\n${GREEN}🚀 Configuração concluída!${NC}\n"

# Voltar para o diretório original
cd ..