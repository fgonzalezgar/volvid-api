-- 03_provider_profiles.sql
-- New table for Service Provider specific details
USE u233760802_volvid;

CREATE TABLE IF NOT EXISTS provider_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    business_name VARCHAR(255),
    services TEXT, -- Store as JSON string or comma-separated list
    experience TEXT,
    identity_document VARCHAR(255),
    certifications VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
