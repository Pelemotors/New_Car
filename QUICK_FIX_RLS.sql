-- Quick fix for RLS - allow reading all cars for development
-- Run this in Supabase SQL Editor

-- Drop existing policy
DROP POLICY IF EXISTS "Public can view published cars" ON cars;

-- Create new policy that allows reading all cars
CREATE POLICY "Allow all cars read access"
    ON cars FOR SELECT
    USING (true);

-- Alternative: Create policy that allows reading cars with any status
CREATE POLICY "Public can view all active cars"
    ON cars FOR SELECT
    USING (is_active = true);
