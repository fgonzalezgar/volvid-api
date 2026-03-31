const pool = require('../config/db');

/**
 * @controller PetController
 * Logic for managing pets and their related data.
 */

const getAllPets = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pets ORDER BY created_at DESC');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

const getPetById = async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pets WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            const error = new Error('Mascota no encontrada');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

const createPet = async (req, res, next) => {
    try {
        const { name, species, breed, age, owner_name } = req.body;
        
        if (!name || !species) {
            const error = new Error('Nombre y especie son campos obligatorios');
            error.statusCode = 400;
            throw error;
        }

        const [result] = await pool.query(
            'INSERT INTO pets (name, species, breed, age, owner_name) VALUES (?, ?, ?, ?, ?)',
            [name, species, breed, age, owner_name]
        );

        res.status(201).json({
            success: true,
            message: 'Mascota creada correctamente',
            data: { id: result.insertId, ...req.body }
        });
    } catch (error) {
        next(error);
    }
};

const updatePet = async (req, res, next) => {
    try {
        const { name, species, breed, age, owner_name } = req.body;
        const [rows] = await pool.query('SELECT * FROM pets WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            const error = new Error('Mascota no encontrada');
            error.statusCode = 404;
            throw error;
        }

        await pool.query(
            'UPDATE pets SET name = ?, species = ?, breed = ?, age = ?, owner_name = ? WHERE id = ?',
            [name || rows[0].name, species || rows[0].species, breed || rows[0].breed, age || rows[0].age, owner_name || rows[0].owner_name, req.params.id]
        );

        res.status(200).json({
            success: true,
            message: 'Mascota actualizada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

const deletePet = async (req, res, next) => {
    try {
        const [result] = await pool.query('DELETE FROM pets WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            const error = new Error('Mascota no encontrada');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Mascota eliminada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

const getPetsByOwner = async (req, res, next) => {
    try {
        const { owner_name } = req.params;
        const [rows] = await pool.query('SELECT * FROM pets WHERE owner_name = ? ORDER BY created_at DESC', [owner_name]);
        
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
    getPetsByOwner
};
