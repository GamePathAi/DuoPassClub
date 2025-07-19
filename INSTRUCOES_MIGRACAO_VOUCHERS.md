# Instruções para Execução do Script de Migração de Vouchers

**Objetivo:** Aplicar o script `migrate_vouchers_uuids.sql` para corrigir as inconsistências de UUID na tabela `vouchers` e preparar a aplicação para produção.

**ATENÇÃO:** Antes de prosseguir, é altamente recomendável que você faça um backup do seu banco de dados. A migração altera a estrutura e os dados da tabela.

--- 

## Passos para Execução

1.  **Acesse o SQL Editor do seu projeto no Supabase:**
    *   Vá para [https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new](https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new)

2.  **Carregue o Script de Migração:**
    *   No SQL Editor, você pode abrir o arquivo `migrate_vouchers_uuids.sql` que está no seu projeto ou copiar e colar o conteúdo dele diretamente na área de consulta.

3.  **Execute o Script:**
    *   Com o conteúdo do script na área de consulta, clique no botão **"RUN"**.
    *   O script executará as seguintes ações:
        *   Atualizará todos os IDs de vouchers que não são UUIDs para UUIDs válidos.
        *   Alterará o tipo da coluna `id` para `UUID`.
        *   Definirá a geração automática de UUIDs para novos vouchers.
        *   Garantirá que a coluna `id` seja a chave primária.

4.  **Verifique o Resultado:**
    *   Após a execução, o Supabase indicará se o script foi executado com sucesso.
    *   Você pode executar as consultas de verificação que estão comentadas no final do script para confirmar que as alterações foram aplicadas corretamente.

--- 

Uma vez que o script tenha sido executado com sucesso, o problema de inconsistência de dados na tabela `vouchers` estará resolvido de forma definitiva.

Por favor, me informe quando tiver concluído este passo para que possamos prosseguir com a validação final.