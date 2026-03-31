const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'volvid_super_secret_key_2026';

/**
 * Middleware para proteger rutas de la API verificando el Token JWT
 */
const verifyToken = (req, res, next) => {
    // Buscar token en Headers (Authorization: Bearer <token>)
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(403).json({
            success: false,
            message: 'A token is required for authentication',
        });
    }

    const token = bearerHeader.split(' ')[1]; // El split remueve la palabra "Bearer "

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token Bearer malformateado o no proporcionado'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Se guarda la data del token en el request para que los siguientes endpoints lo usen
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid Token'
        });
    }

    return next();
};

module.exports = {
    verifyToken
};
