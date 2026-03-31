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
 *           description: Especie (Perro, Gato, etc.)
 *         breed:
 *           type: string
 *           description: Raza
 *         weight:
 *           type: number
 *           format: float
 *           description: Peso en kg
 *         gender:
 *           type: string
 *           description: Género (Macho, Hembra)
 *         last_vaccine:
 *           type: string
 *           format: date
 *           description: Fecha de última vacuna (YYYY-MM-DD)
 *         last_bath:
 *           type: string
 *           format: date
 *           description: Fecha de último baño (YYYY-MM-DD)
 *         temperament:
 *           type: string
 *           description: Temperamento (Amigable, Energético, etc.)
 *         special_needs:
 *           type: string
 *           description: Detalles sobre alergias o necesidades
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
 * /api/pets/user/{owner_name}:
 *   get:
 *     summary: Obtener mascotas filtradas por usuario (dueño)
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: owner_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del dueño de la mascota
 *     responses:
 *       200:
 *         description: Lista de mascotas que pertenecen a este usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 */
router.route('/user/:owner_name')
    .get(petController.getPetsByOwner);

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
