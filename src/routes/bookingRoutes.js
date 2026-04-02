const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingRequest:
 *       type: object
 *       required:
 *         - provider_id
 *         - service_id
 *         - pet_id
 *         - service_date
 *         - service_time
 *         - pickup_address
 *         - total_price
 *       properties:
 *         provider_id:
 *           type: integer
 *           description: ID del prestador seleccionado
 *           example: 5
 *         service_id:
 *           type: integer
 *           description: ID del servicio ofrecido por el prestador
 *           example: 1
 *         pet_id:
 *           type: integer
 *           description: ID de la mascota que recibe el servicio
 *           example: 2
 *         service_date:
 *           type: string
 *           format: date
 *           description: Fecha del servicio (YYYY-MM-DD)
 *           example: "2026-04-10"
 *         service_time:
 *           type: string
 *           description: Hora del servicio (HH:mm:ss)
 *           example: "08:00:00"
 *         pickup_address:
 *           type: string
 *           description: Dirección de recogida de la mascota
 *           example: "Calle de la Alegría, 42, Medellín"
 *         total_price:
 *           type: number
 *           description: Precio total acordado
 *           example: 25000.00
 *
 *     LocationUpdate:
 *       type: object
 *       required:
 *         - latitude
 *         - longitude
 *       properties:
 *         latitude:
 *           type: number
 *           example: 6.2442
 *         longitude:
 *           type: number
 *           example: -75.5812
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Crear una nueva reserva (Reserva)
 *     description: Permite a los dueños de mascotas solicitar un servicio a un prestador específico. La reserva queda en estado 'pending'.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingRequest'
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente.
 *   get:
 *     summary: Listar mis reservas
 *     description: Retorna las reservas donde el usuario es dueño o prestador. Permite filtrar por estado (pending, accepted, rejected, in_progress, completed, cancelled).
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, in_progress, completed, cancelled]
 *         description: Filtrar por estado de la reserva.
 *     responses:
 *       200:
 *         description: Listado de reservas obtenido.
 */
router.post('/', verifyToken, bookingController.createBooking);
router.get('/', verifyToken, bookingController.listBookings);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Gestionar estado de reserva (Aceptar/Rechazar/Iniciar/Finalizar)
 *     description: Permite al prestador cambiar el estado de la reserva según el ciclo de Uber. El estado 'cancelled' puede ser enviado tanto por dueño como prestador.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected, in_progress, completed, cancelled]
 *                 example: "accepted"
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente.
 */
router.patch('/:id/status', verifyToken, bookingController.updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}/location:
 *   post:
 *     summary: Registrar ubicación GPS (Seguimiento 5 min)
 *     description: El prestador debe enviar latitud/longitud cada 5 minutos mientras el estado sea 'in_progress'. Esto permite al dueño ver el recorrido.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationUpdate'
 *     responses:
 *       201:
 *         description: Ubicación almacenada correctamente.
 */
router.post('/:id/location', verifyToken, bookingController.trackLocation);

/**
 * @swagger
 * /api/bookings/{id}/route:
 *   get:
 *     summary: Consultar reporte de ubicación (Ruta)
 *     description: Retorna el historial de coordenadas para visualizar el recorrido de un servicio finalizado o en curso.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Historial de coordenadas obtenido.
 */
router.get('/:id/route', verifyToken, bookingController.getBookingRoute);

module.exports = router;
