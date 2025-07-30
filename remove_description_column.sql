-- SQL script to remove the description column from the dashboards table
-- Run this script in your Supabase SQL editor or database management tool

-- Remove the description column from the dashboards table
ALTER TABLE dashboards DROP COLUMN IF EXISTS description;

-- Verify the column has been removed
-- You can run this query to check the table structure:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'dashboards' 
-- ORDER BY ordinal_position; 