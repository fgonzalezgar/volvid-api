const pool = require('../config/db');

/**
 * Controller for Bookings / Reservas
 * Handles the Uber-like lifecycle of a service reservation.
 */

// Crear una nueva reserva (Solo Dueños)
const createBooking = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const { 
            provider_id, 
            service_id, 
            pet_id, 
            service_date, 
            service_time, 
            pickup_address, 
            total_price 
        } = req.body;

        // Validación de campos obligatorios
        if (!provider_id || !service_id || !pet_id || !service_date || !service_time || !pickup_address || !total_price) {
            const error = new Error('Todos los campos son obligatorios para procesar la reserva (fecha, mascota, dirección, etc.)');
            error.statusCode = 400;
            throw error;
        }

        const [result] = await pool.query(
            'INSERT INTO bookings (owner_id, provider_id, service_id, pet_id, service_date, service_time, pickup_address, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [ownerId, provider_id, service_id, pet_id, service_date, service_time, pickup_address, total_price]
        );

        res.status(201).json({
            success: true,
            message: 'Reserva generada con éxito. Pendiente de confirmación por el prestador.',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar estado de la reserva (Aceptar, Rechazar, Iniciar, Finalizar)
const updateBookingStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.id;
        const { status } = req.body;

        const allowedStatuses = ['accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];
        if (!allowedStatuses.includes(status)) {
            const error = new Error('Estado no soportado por el sistema');
            error.statusCode = 400;
            throw error;
        }

        // Obtener datos de la reserva actual
        const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
        if (bookings.length === 0) {
            const error = new Error('Reserva no encontrada');
            error.statusCode = 404;
            throw error;
        }

        const booking = bookings[0];

        // Reglas de negocio para cambios de estado
        if (status === 'cancelled') {
            if (booking.owner_id !== userId && booking.provider_id !== userId) {
                const error = new Error('No tienes permisos sobre esta reserva');
                error.statusCode = 403;
                throw error;
            }
        } else {
            // Solo el prestador puede aceptar, rechazar, iniciar o completar
            if (booking.provider_id !== userId) {
                const error = new Error('Solo el prestador asignado puede gestionar este servicio');
                error.statusCode = 403;
                throw error;
            }
        }

        await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, bookingId]);

        res.status(200).json({
            success: true,
            message: `Reserva actualizada correctamente a: ${status}`
        });
    } catch (error) {
        next(error);
    }
};

// Listar reservas (Para dueños y prestadores)
const listBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        let query = `
            SELECT 
                b.*, 
                uo.name AS owner_name, 
                up.name AS provider_name, 
                p.name AS pet_name, 
                ps.service_type
            FROM bookings b
            JOIN users uo ON b.owner_id = uo.id
            JOIN users up ON b.provider_id = up.id
            JOIN pets p ON b.pet_id = p.id
            JOIN provider_services ps ON b.service_id = ps.id
            WHERE (b.owner_id = ? OR b.provider_id = ?)
        `;
        const params = [userId, userId];

        if (status) {
            query += ' AND b.status = ?';
            params.push(status);
        }

        query += ' ORDER BY b.created_at DESC';

        const [rows] = await pool.query(query, params);

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

// Registrar ubicación GPS (Seguimiento Real-Time) - Cada 5 min según solicitud usuario
const trackLocation = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.id;
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            const error = new Error('Latitud y longitud son requeridas para el seguimiento');
            error.statusCode = 400;
            throw error;
        }

        const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
        if (bookings.length === 0) {
            const error = new Error('Reserva inexistente');
            error.statusCode = 404;
            throw error;
        }

        const booking = bookings[0];
        
        // El seguimiento solo puede enviarlo el prestador mientras el servicio está activo
        if (booking.provider_id !== userId) {
            const error = new Error('Solo el prestador asignado puede enviar coordenadas');
            error.statusCode = 403;
            throw error;
        }
        if (booking.status !== 'in_progress') {
            const error = new Error('El seguimiento solo está disponible mientras el servicio está "en progreso"');
            error.statusCode = 400;
            throw error;
        }

        await pool.query(
            'INSERT INTO booking_locations (booking_id, latitude, longitude) VALUES (?, ?, ?)',
            [bookingId, latitude, longitude]
        );

        res.status(201).json({
            success: true,
            message: 'Ubicación almacenada correctamente'
        });
    } catch (error) {
        next(error);
    }
};

// Consultar la ruta del servicio (Historial de ubicaciones)
const getBookingRoute = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.id;

        const [bookings] = await pool.query('SELECT * FROM bookings WHERE id = ?', [bookingId]);
        if (bookings.length === 0) {
            const error = new Error('Reserva no encontrada');
            error.statusCode = 404;
            throw error;
        }

        const booking = bookings[0];
        
        // Dueño o prestador pueden ver la ruta
        if (booking.owner_id !== userId && booking.provider_id !== userId) {
            const error = new Error('No tienes acceso a los datos de esta ruta');
            error.statusCode = 403;
            throw error;
        }

        const [locations] = await pool.query(
            'SELECT latitude, longitude, timestamp FROM booking_locations WHERE booking_id = ? ORDER BY timestamp ASC',
            [bookingId]
        );

        res.status(200).json({
            success: true,
            data: locations
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    updateBookingStatus,
    listBookings,
    trackLocation,
    getBookingRoute
};
