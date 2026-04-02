const pool = require('../config/db');

/**
 * Controller for Provider Services
 * Handles publishing and managing pet care services.
 */

const createService = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const role = req.user.role;

        // Validar que el usuario sea un prestador
        if (role !== 'provider') {
            const error = new Error('Solo los prestadores de servicios pueden publicar nuevas ofertas');
            error.statusCode = 403;
            throw error;
        }

        const { 
            service_type, base_rate, days_available, 
            start_time, end_time, department, city, specific_zones 
        } = req.body;

        // Validación de campos obligatorios
        if (!service_type || !base_rate) {
            const error = new Error('El tipo de servicio y la tarifa base son campos obligatorios');
            error.statusCode = 400;
            throw error;
        }

        // Convertir días de disponibilidad a JSON si es un arreglo
        const daysJson = Array.isArray(days_available) ? JSON.stringify(days_available) : days_available;

        const [result] = await pool.query(
            'INSERT INTO provider_services (provider_id, service_type, base_rate, days_available, start_time, end_time, department, city, specific_zones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                providerId, 
                service_type, 
                base_rate, 
                daysJson || null, 
                start_time || null, 
                end_time || null, 
                department || null, 
                city || null, 
                specific_zones || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Servicio publicado y guardado exitosamente',
            data: { id: result.insertId }
        });
    } catch (error) {
        next(error);
    }
};

const getMyServices = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        
        const [rows] = await pool.query(
            'SELECT * FROM provider_services WHERE provider_id = ? AND status = "active" ORDER BY created_at DESC',
            [providerId]
        );

        // Procesar salida: convertir JSON de días a Arreglo
        const services = rows.map(row => {
            let parsedDays = row.days_available;
            try {
                if (row.days_available) {
                    parsedDays = JSON.parse(row.days_available);
                }
            } catch (e) {
                // Si no es JSON válido, retornar como está
            }
            return { ...row, days_available: parsedDays };
        });

        res.status(200).json({
            success: true,
            data: services
        });
    } catch (error) {
        next(error);
    }
};

const deleteService = async (req, res, next) => {
    try {
        const providerId = req.user.id;
        const serviceId = req.params.id;

        const [result] = await pool.query(
            'UPDATE provider_services SET status = "inactive" WHERE id = ? AND provider_id = ?',
            [serviceId, providerId]
        );

        if (result.affectedRows === 0) {
            const error = new Error('El servicio no existe o no tiene permisos para eliminarlo');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: 'Servicio desactivado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createService,
    getMyServices,
    deleteService
};
