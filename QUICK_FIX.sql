-- פתרון מהיר: השבתת RLS זמנית
-- הרץ את זה ב-SQL Editor

-- השבתת RLS על storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- בדיקה שה-RLS הושבת
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';
