-- 02_seed.sql
USE volvid_db;

INSERT INTO pets (name, species, breed, age, owner_name) VALUES
('Max', 'Dog', 'Golden Retriever', 3, 'Fernando Gonzalez'),
('Bella', 'Cat', 'Siamese', 2, 'Elena Rodriguez'),
('Charlie', 'Dog', 'Beagle', 5, 'Juan Pérez'),
('Luna', 'Cat', 'Maine Coon', 1, 'Maria Gomez');
