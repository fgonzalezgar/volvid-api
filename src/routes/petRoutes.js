const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *         - name
 *         - species
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado
 *         name:
 *           type: string
 *           description: Nombre de la mascota
 *         species:
 *           type: string
 *           description: Especie (Dog, Cat, etc.)
 *         breed:
 *           type: string
 *           description: Raza
 *         age:
 *           type: integer
 *           description: Edad en años
 *         owner_name:
 *           type: string
 *           description: Nombre del dueño
 */

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: Mascota creada
 */
router.route('/')
    .get(petController.getAllPets)
    .post(petController.createPet);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Obtener mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Datos de la mascota
 *       404:
 *         description: Mascota no encontrada
 *   put:
 *     summary: Actualizar una mascota
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *   delete:
 *     summary: Eliminar una mascota
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Mascota eliminada
 */
router.route('/:id')
    .get(petController.getPetById)
    .put(petController.updatePet)
    .delete(petController.deletePet);

module.exports = router;
