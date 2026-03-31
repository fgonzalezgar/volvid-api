const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @controller AuthController
 * Handles user registration and authentication.
 */

// JWT Secret from env or fallback
const JWT_SECRET = process.env.JWT_SECRET || 'volvid_super_secret_key_2026';

const register = async (req, res, next) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        // Form fields validation based on UI
        if (!name || !email || !password) {
            const error = new Error('Nombre completo, correo y contraseña son obligatorios');
            error.statusCode = 400;
            throw error;
        }

        // Optional Backend check for confirmPassword just in case
        if (confirmPassword && password !== confirmPassword) {
            const error = new Error('Las contraseñas no coinciden');
            error.statusCode = 400;
            throw error;
        }

        // Check if user already exists
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            const error = new Error('El correo electrónico ya está registrado');
            error.statusCode = 409;
            throw error;
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const encodedPassword = await bcrypt.hash(password, salt);

        // Store user in DB
        const [result] = await pool.query(
            'INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
            [name, email, phone || null, encodedPassword]
        );

        // Generate Token so app doesn't need a separate login call
        const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            success: true,
            message: 'Cuenta creada exitosamente',
            data: {
                user: { id: result.insertId, name, email, phone },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register
};
