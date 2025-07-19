# Instrução Crítica: Habilitar Execução de SQL para Diagnóstico

Para realizar um diagnóstico preciso e seguro das inconsistências de dados, é necessário criar uma função no seu banco de dados Supabase que nos permita executar as consultas de análise. 

**Isso é uma operação única e necessária para a fase de diagnóstico.**

## Passo a Passo

1.  **Acesse o SQL Editor do seu projeto no Supabase:**
    *   Vá para [https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new](https://app.supabase.com/project/rnzvbrlbcnknyhrgubqi/sql/new)

2.  **Copie e cole o seguinte código SQL no editor:**

    ```sql
    CREATE OR REPLACE FUNCTION public.execute_sql(query text)
    RETURNS TABLE(result json)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN QUERY EXECUTE 'SELECT to_json(t) FROM (' || query || ') t';
    END;
    $$;
    ```

3.  **Clique em "RUN"** para criar a função.

Após a criação bem-sucedida desta função, eu poderei executar as análises necessárias na tabela `vouchers` e em outras para identificar a origem do problema com os UUIDs. Por favor, me avise quando tiver concluído este passo.