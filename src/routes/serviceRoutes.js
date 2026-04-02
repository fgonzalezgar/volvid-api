const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceRequest:
 *       type: object
 *       required:
 *         - service_type
 *         - base_rate
 *       properties:
 *         service_type:
 *           type: string
 *           description: Tipo de servicio (Paseo, Peluquería, Transporte)
 *           example: "Paseo"
 *         base_rate:
 *           type: number
 *           description: Tarifa inicial (Costo por sesión o recorrido)
 *           example: 35000.50
 *         days_available:
 *           type: array
 *           description: Días de disponibilidad (Ej. ["L", "M", "MI", "J", "V"])
 *           items:
 *             type: string
 *           example: ["L", "M", "MI", "J", "V"]
 *         start_time:
 *           type: string
 *           description: Hora inicio de disponibilidad (Formato 24h HH:mm)
 *           example: "08:00:00"
 *         end_time:
 *           type: string
 *           description: Hora fin de disponibilidad (Formato 24h HH:mm)
 *           example: "18:00:00"
 *         department:
 *           type: string
 *           description: Departamento de cobertura (Ej. Antioquia)
 *           example: "Antioquia"
 *         city:
 *           type: string
 *           description: Ciudad de cobertura (Ej. Medellín)
 *           example: "Medellín"
 *         specific_zones:
 *           type: string
 *           description: Barrios o comunas específicas que atiende
 *           example: "El Poblado, Laureles, Envigado"
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Publicar una nueva oferta de servicio
 *     description: Permite a los prestadores de servicios crear sus perfiles profesionales de servicio (Paseo, Peluquería, etc.). Requiere rol 'provider'.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceRequest'
 *     responses:
 *       201:
 *         description: Servicio creado con éxito y publicado en la zona de cobertura.
 *       400:
 *         description: Faltan datos obligatorios (tipo o tarifa).
 *       403:
 *         description: Acceso denegado (El usuario no es un prestador de servicios).
 *   get:
 *     summary: Ver mis servicios publicados
 *     description: Retorna la lista de servicios ofertados por el prestador autenticado.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de servicios obtenido exitosamente.
 */
router.post('/', verifyToken, serviceController.createService);
router.get('/', verifyToken, serviceController.getMyServices);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Desactivar oferta de servicio
 *     description: Cambia el estado de un servicio a 'inactive' para que no sea visible para clientes.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a eliminar.
 *     responses:
 *       200:
 *         description: Servicio inactivado exitosamente.
 *       404:
 *         description: Servicio no encontrado o el usuario no es dueño de la oferta.
 */
router.delete('/:id', verifyToken, serviceController.deleteService);

module.exports = router;
