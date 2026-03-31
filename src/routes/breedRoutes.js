const express = require('express');
const router = express.Router();
const breedController = require('../controllers/breedController');

/**
 * @swagger
 * /api/breeds/{species}:
 *   get:
 *     summary: Obtener catalogo de razas por especie
 *     description: Retorna la lista de razas disponibles para "Perro" o "Gato".
 *     tags: [Breeds]
 *     parameters:
 *       - in: path
 *         name: species
 *         schema:
 *           type: string
 *         required: true
 *         description: Especie a consultar (Perro o Gato)
 *     responses:
 *       200:
 *         description: Lista de razas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Breed'
 */
router.route('/:species')
    .get(breedController.getBreedsBySpecies);

module.exports = router;
