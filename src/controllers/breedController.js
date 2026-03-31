const pool = require('../config/db');

/**
 * @swagger
 * components:
 *   schemas:
 *     Breed:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la raza
 *         species:
 *           type: string
 *           description: Especie (Perro o Gato)
 *         name:
 *           type: string
 *           description: Nombre de la raza
 *     BreedListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Breed'
 */

const getBreedsBySpecies = async (req, res, next) => {
    try {
        const { species } = req.params;
        const [rows] = await pool.query('SELECT * FROM breeds WHERE species = ? ORDER BY name ASC', [species]);
        
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBreedsBySpecies
};
