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
        const { name, email, phone, password, confirmPassword, role, accepted_terms } = req.body;

        // Form fields validation based on UI
        if (!name || !email || !password) {
            const error = new Error('Nombre completo, correo y contraseña son obligatorios');
            error.statusCode = 400;
            throw error;
        }

        if (accepted_terms !== true) {
            const error = new Error('Debes aceptar los términos y condiciones para registrarte');
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

        const assignedRole = role || 'owner'; // Dueño de mascota por defecto

        // Store user in DB
        const [result] = await pool.query(
            'INSERT INTO users (name, email, phone, role, accepted_terms, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, phone || null, assignedRole, accepted_terms ? 1 : 0, encodedPassword]
        );

        // Generate Token
        const token = jwt.sign({ id: result.insertId, email, role: assignedRole }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            success: true,
            message: 'Cuenta creada exitosamente',
            data: {
                user: { id: result.insertId, name, email, phone, role: assignedRole, accepted_terms },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Correo y contraseña son obligatorios');
            error.statusCode = 400;
            throw error;
        }

        // Buscar el usuario en la Base de Datos
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401; // Unauthorized
            throw error;
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }

        // Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    accepted_terms: user.accepted_terms
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        // Consultar info completa del usuario
        const [users] = await pool.query(
            'SELECT id, name, email, phone, secondary_phone, address, province, city, photo, role, created_at FROM users WHERE id = ?', 
            [userId]
        );
        
        if (users.length === 0) {
            const error = new Error('Usuario no encontrado');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualizar perfil del usuario
 */
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, phone, secondary_phone, address, province, city } = req.body;
        
        // La foto viene de multer si se subió
        const photo = req.file ? `/uploads/users/${req.file.filename}` : null;

        // Obtener datos actuales para no sobrescribir con null si no se envían
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            const error = new Error('Usuario no encontrado');
            error.statusCode = 404;
            throw error;
        }

        const user = rows[0];

        // Actualizar en DB
        await pool.query(
            'UPDATE users SET name = ?, phone = ?, secondary_phone = ?, address = ?, province = ?, city = ?, photo = ? WHERE id = ?',
            [
                name || user.name,
                phone || user.phone,
                secondary_phone !== undefined ? secondary_phone : user.secondary_phone,
                address !== undefined ? address : user.address,
                province !== undefined ? province : user.province,
                city !== undefined ? city : user.city,
                photo || user.photo,
                userId
            ]
        );

        res.status(200).json({
            success: true,
            message: 'Perfil actualizado correctamente',
            data: {
                photo: photo || user.photo
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Registro de nuevos Prestadores de Servicios
 */
const registerProvider = async (req, res, next) => {
    try {
        const { name, email, phone, password, business_name, services, experience, accepted_terms } = req.body;

        // Validaciones básicas
        if (!name || !email || !password || !business_name) {
            const error = new Error('Nombre, correo, contraseña y nombre del negocio son obligatorios');
            error.statusCode = 400;
            throw error;
        }

        if (accepted_terms !== 'true' && accepted_terms !== true && accepted_terms !== 1) {
            const error = new Error('Debes aceptar los términos y condiciones');
            error.statusCode = 400;
            throw error;
        }

        // Verificar si el correo ya existe
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            const error = new Error('El correo electrónico ya está registrado');
            error.statusCode = 409;
            throw error;
        }

        // Hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const encodedPassword = await bcrypt.hash(password, salt);

        // Iniciar transacción para asegurar integridad (User + Profile)
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Crear Usuario con rol 'provider'
            const [userResult] = await connection.query(
                'INSERT INTO users (name, email, phone, role, accepted_terms, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
                [name, email, phone || null, 'provider', 1, encodedPassword]
            );

            const userId = userResult.insertId;

            // 2. Obtener rutas de archivos subidos por Multer
            const identityDoc = req.files && req.files['identity_document'] 
                ? `/uploads/providers/${req.files['identity_document'][0].filename}` 
                : null;
            
            const certsDoc = req.files && req.files['certifications'] 
                ? `/uploads/providers/${req.files['certifications'][0].filename}` 
                : null;

            // 3. Crear Perfil de Prestador
            await connection.query(
                'INSERT INTO provider_profiles (user_id, business_name, services, experience, identity_document, certifications) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    userId, 
                    business_name, 
                    services || null, 
                    experience || null, 
                    identityDoc, 
                    certsDoc
                ]
            );

            await connection.commit();

            // Generar Token JWT
            const token = jwt.sign({ id: userId, email, role: 'provider' }, JWT_SECRET, { expiresIn: '30d' });

            res.status(201).json({
                success: true,
                message: 'Registro de prestador enviado correctamente y en proceso de verificación',
                data: {
                    user: { id: userId, name, email, role: 'provider' },
                    token
                }
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    registerProvider
};
