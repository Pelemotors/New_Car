-- RLS Policies עבור car-images bucket
-- הרץ את השאילתות האלה ב-SQL Editor של Supabase

-- 1. הפעלת RLS על storage.objects (אם לא מופעל)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. מחיקת policies קיימים (אם יש)
DROP POLICY IF EXISTS "Public read access for car images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update car images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete car images" ON storage.objects;

-- 3. יצירת policies חדשים

-- קריאה ציבורית - כל אחד יכול לראות תמונות
CREATE POLICY "Public read access for car images" ON storage.objects
FOR SELECT USING (bucket_id = 'car-images');

-- העלאה - רק משתמשים מאומתים יכולים להעלות
CREATE POLICY "Authenticated users can upload car images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'car-images' 
  AND auth.role() = 'authenticated'
);

-- עדכון - רק משתמשים מאומתים יכולים לעדכן
CREATE POLICY "Authenticated users can update car images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'car-images' 
  AND auth.role() = 'authenticated'
);

-- מחיקה - רק משתמשים מאומתים יכולים למחוק
CREATE POLICY "Authenticated users can delete car images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'car-images' 
  AND auth.role() = 'authenticated'
);

-- 4. בדיקה שה-policies נוצרו
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%car images%';
