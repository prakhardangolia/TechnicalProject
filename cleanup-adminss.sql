-- Clean up the old adminss table (if it exists)
-- Run this in MySQL if you want to remove the old table

-- Check if adminss table exists and drop it
DROP TABLE IF EXISTS adminss;

-- Verify the correct admins table exists
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'logistic_management' 
AND TABLE_NAME = 'admins';

-- Show admin accounts in the correct table
SELECT * FROM admins;





