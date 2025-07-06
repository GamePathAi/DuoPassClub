-- Script para desabilitar temporariamente RLS policies
-- Execute este script no Supabase Dashboard > SQL Editor
-- ATENÇÃO: Isso remove a segurança das tabelas temporariamente!

-- Desabilitar RLS para tabelas culturais
ALTER TABLE cultural_partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_experiences DISABLE ROW LEVEL SECURITY;
ALTER TABLE experience_stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_connections DISABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_metrics DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS para outras tabelas principais
ALTER TABLE offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchants DISABLE ROW LEVEL SECURITY;

-- Verificar status das RLS policies
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN 'RLS ATIVADO' 
        ELSE 'RLS DESABILITADO' 
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'cultural_partners', 
    'cultural_experiences', 
    'experience_stories', 
    'cultural_connections', 
    'cultural_metrics',
    'offers',
    'vouchers', 
    'categories', 
    'merchants'
)
ORDER BY tablename;

-- Para reabilitar RLS depois dos testes, execute:
-- ALTER TABLE cultural_partners ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cultural_experiences ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE experience_stories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cultural_connections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cultural_metrics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;