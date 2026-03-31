-- 02_seed.sql
USE u233760802_volvid;

-- Insert default breeds
INSERT INTO breeds (species, name) VALUES
('Perro', 'Labrador Retriever'), ('Perro', 'Pastor Alemán'), ('Perro', 'Bulldog Francés'), 
('Perro', 'Golden Retriever'), ('Perro', 'Poodle (Caniche)'), ('Perro', 'Beagle'), 
('Perro', 'Rottweiler'), ('Perro', 'Yorkshire Terrier'), ('Perro', 'Boxer'), ('Perro', 'Dachshund'),
('Perro', 'Mestizo / Criollo'),
('Gato', 'Persa'), ('Gato', 'Siamés'), ('Gato', 'Maine Coon'), ('Gato', 'Bengalí'), 
('Gato', 'Sphynx (Esfinge)'), ('Gato', 'Ragdoll'), ('Gato', 'British Shorthair'), 
('Gato', 'Abisinio'), ('Gato', 'Scottish Fold'), ('Gato', 'Mestizo / Criollo');

INSERT INTO pets (name, species, breed, age, owner_name) VALUES
('Max', 'Perro', 'Golden Retriever', 3, 'Fernando Gonzalez'),
('Bella', 'Gato', 'Siamés', 2, 'Elena Rodriguez'),
('Charlie', 'Perro', 'Beagle', 5, 'Juan Pérez'),
('Luna', 'Gato', 'Maine Coon', 1, 'Maria Gomez Rojas');

-- Thomas Fernando
