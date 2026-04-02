-- 04_provider_services.sql
-- Table to store services offered by professional pet care providers
USE u233760802_volvid;

CREATE TABLE IF NOT EXISTS provider_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider_id INT NOT NULL,
    service_type VARCHAR(100) NOT NULL, -- 'Paseo', 'Peluquería', 'Transporte'
    base_rate DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    days_available TEXT, -- JSON array string e.g. '["L", "M", "MI"]'
    start_time TIME,
    end_time TIME,
    department VARCHAR(150),
    city VARCHAR(150),
    specific_zones TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
);
