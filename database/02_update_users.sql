-- 02_update_users.sql
-- Modify users table to include profile information for pet owners
USE u233760802_volvid;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS secondary_phone VARCHAR(50) AFTER phone,
ADD COLUMN IF NOT EXISTS address TEXT AFTER secondary_phone,
ADD COLUMN IF NOT EXISTS province VARCHAR(100) AFTER address,
ADD COLUMN IF NOT EXISTS city VARCHAR(100) AFTER province,
ADD COLUMN IF NOT EXISTS photo VARCHAR(255) AFTER city;
