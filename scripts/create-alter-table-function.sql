-- Cria a função RPC para executar comandos DDL
CREATE OR REPLACE FUNCTION alter_table(sql_command text)
RETURNS void AS $$
BEGIN
  EXECUTE sql_command;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;