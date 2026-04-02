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
 *           description: Tipo de servicio que ofrece el prestador
 *           enum: [Paseo, Peluquería, Transporte, Veterinaria, Cuidado en Casa]
 *           example: "Paseo"
 *         base_rate:
 *           type: number
 *           format: float
 *           description: Tarifa base (Costo por sesión o recorrido en pesos colombianos)
 *           example: 35000.00
 *         days_available:
 *           type: array
 *           description: "Días de disponibilidad. Valores posibles: L=Lunes, M=Martes, MI=Miércoles, J=Jueves, V=Viernes, S=Sábado, D=Domingo"
 *           items:
 *             type: string
 *             enum: [L, M, MI, J, V, S, D]
 *           example: ["L", "M", "MI", "J", "V"]
 *         start_time:
 *           type: string
 *           description: Hora de inicio de atención en formato HH:mm:ss (24 horas)
 *           example: "08:00:00"
 *         end_time:
 *           type: string
 *           description: Hora de cierre de atención en formato HH:mm:ss (24 horas)
 *           example: "18:00:00"
 *         department:
 *           type: string
 *           description: Departamento donde presta el servicio
 *           example: "Antioquia"
 *         city:
 *           type: string
 *           description: Ciudad donde presta el servicio
 *           example: "Medellín"
 *         specific_zones:
 *           type: string
 *           description: Barrios, comunas o zonas específicas de cobertura (texto libre)
 *           example: "El Poblado, Laureles, Envigado"
 *
 *     ServiceResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del servicio
 *           example: 1
 *         provider_id:
 *           type: integer
 *           description: ID del prestador dueño de la oferta
 *           example: 5
 *         service_type:
 *           type: string
 *           example: "Paseo"
 *         base_rate:
 *           type: string
 *           description: Tarifa en formato decimal
 *           example: "25000.00"
 *         days_available:
 *           type: array
 *           description: Días de disponibilidad como arreglo
 *           items:
 *             type: string
 *           example: ["L", "M", "MI", "J", "V"]
 *         start_time:
 *           type: string
 *           example: "08:00:00"
 *         end_time:
 *           type: string
 *           example: "18:00:00"
 *         department:
 *           type: string
 *           example: "Antioquia"
 *         city:
 *           type: string
 *           example: "Medellín"
 *         specific_zones:
 *           type: string
 *           example: "El Poblado, Laureles"
 *         status:
 *           type: string
 *           description: Estado del servicio
 *           enum: [active, inactive]
 *           example: "active"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-04-02T15:00:00.000Z"
 *
 *     ServiceCreatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Servicio publicado y guardado exitosamente"
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID del nuevo servicio creado
 *               example: 3
 *
 *     ServiceListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ServiceResponse'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Descripción del error"
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Publicar nueva oferta de servicio
 *     description: |
 *       Permite a un **prestador de servicios** (role: provider) crear y publicar una nueva oferta.
 *
 *       **Tipos de servicio disponibles:**
 *       - `Paseo` → Paseos recreativos y ejercicio diario
 *       - `Peluquería` → Estética, baño y cuidado del pelaje
 *       - `Transporte` → Traslado seguro a veterinarios o citas
 *       - `Veterinaria` → Atención médica y seguimiento de salud
 *       - `Cuidado en Casa` → Cuidado en el hogar del prestador
 *
 *       **Nota:** Requiere token JWT de un usuario con rol `provider`.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceRequest'
 *           examples:
 *             paseo:
 *               summary: "Ejemplo: Servicio de Paseo"
 *               value:
 *                 service_type: "Paseo"
 *                 base_rate: 25000
 *                 days_available: ["L", "M", "MI", "J", "V"]
 *                 start_time: "08:00:00"
 *                 end_time: "18:00:00"
 *                 department: "Antioquia"
 *                 city: "Medellín"
 *                 specific_zones: "El Poblado, Laureles"
 *             peluqueria:
 *               summary: "Ejemplo: Servicio de Peluquería"
 *               value:
 *                 service_type: "Peluquería"
 *                 base_rate: 45000
 *                 days_available: ["M", "J", "S"]
 *                 start_time: "09:00:00"
 *                 end_time: "17:00:00"
 *                 department: "Antioquia"
 *                 city: "Medellín"
 *                 specific_zones: "Envigado, Itagüí"
 *             transporte:
 *               summary: "Ejemplo: Servicio de Transporte"
 *               value:
 *                 service_type: "Transporte"
 *                 base_rate: 20000
 *                 days_available: ["L", "M", "MI", "J", "V", "S"]
 *                 start_time: "07:00:00"
 *                 end_time: "20:00:00"
 *                 department: "Antioquia"
 *                 city: "Medellín"
 *                 specific_zones: "Toda la ciudad"
 *     responses:
 *       201:
 *         description: Servicio publicado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceCreatedResponse'
 *       400:
 *         description: Datos obligatorios faltantes (tipo de servicio o tarifa base).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "El tipo de servicio y la tarifa base son campos obligatorios"
 *       401:
 *         description: Token JWT no proporcionado o inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "No autorizado. Token inválido o expirado."
 *       403:
 *         description: El usuario autenticado no tiene rol 'provider'.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Solo los prestadores de servicios pueden publicar nuevas ofertas"
 *
 *   get:
 *     summary: Listar mis servicios publicados
 *     description: |
 *       Retorna todos los servicios **activos** publicados por el prestador autenticado.
 *
 *       El campo `days_available` se retorna como un **arreglo** de strings para facilitar su uso en la interfaz.
 *
 *       **Nota:** Requiere token JWT de un usuario con rol `provider`.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de servicios obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceListResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   provider_id: 5
 *                   service_type: "Paseo"
 *                   base_rate: "25000.00"
 *                   days_available: ["L", "M", "MI", "J", "V"]
 *                   start_time: "08:00:00"
 *                   end_time: "18:00:00"
 *                   department: "Antioquia"
 *                   city: "Medellín"
 *                   specific_zones: "El Poblado, Laureles"
 *                   status: "active"
 *                   created_at: "2026-04-02T15:00:00.000Z"
 *       401:
 *         description: Token JWT no proporcionado o inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', verifyToken, serviceController.createService);
router.get('/', verifyToken, serviceController.getMyServices);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Desactivar una oferta de servicio
 *     description: |
 *       Cambia el estado de un servicio a `inactive`, ocultándolo de la vista pública.
 *       **El servicio no se elimina físicamente** de la base de datos.
 *
 *       Solo el prestador propietario del servicio puede inactivarlo.
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del servicio a desactivar.
 *         example: 1
 *     responses:
 *       200:
 *         description: Servicio inactivado correctamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Servicio desactivado correctamente"
 *       401:
 *         description: Token JWT no proporcionado o inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: El servicio no existe o no pertenece al prestador autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "El servicio no existe o no tiene permisos para eliminarlo"
 */
router.delete('/:id', verifyToken, serviceController.deleteService);

module.exports = router;
