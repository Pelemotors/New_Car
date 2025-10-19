-- Fix authentication issues in Supabase
-- Run this in Supabase SQL Editor

-- 1. Allow anonymous users to authenticate
CREATE POLICY "Allow anonymous authentication"
    ON auth.users FOR ALL
    USING (true);

-- 2. Allow public to read published cars (if not exists)
DROP POLICY IF EXISTS "Public can view published cars" ON cars;
CREATE POLICY "Public can view published cars"
    ON cars FOR SELECT
    USING (is_published = true AND is_sold = false);

-- 3. Allow authenticated users to manage cars
DROP POLICY IF EXISTS "Authenticated users can manage cars" ON cars;
CREATE POLICY "Authenticated users can manage cars"
    ON cars FOR ALL
    USING (auth.role() = 'authenticated');

-- 4. Allow authenticated users to manage leads
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON leads;
CREATE POLICY "Authenticated users can manage leads"
    ON leads FOR ALL
    USING (auth.role() = 'authenticated');

-- 5. Check if user exists and is confirmed
SELECT 
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'admin@admin.com';
