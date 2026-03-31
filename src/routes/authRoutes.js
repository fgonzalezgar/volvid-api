const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistrationRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre completo Ej. Juan Pérez
 *         email:
 *           type: string
 *           description: Correo electrónico tu@ejemplo.com
 *         phone:
 *           type: string
 *           description: Número de teléfono +34 000...
 *         role:
 *           type: string
 *           description: Rol del usuario (ej. owner, provider)
 *           default: owner
 *         accepted_terms:
 *           type: boolean
 *           description: Aceptación de términos y condiciones y políticas de privacidad
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña segura
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Confirmación opcional de contraseña
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Crear cuenta de usuario
 *     description: Registra un nuevo usuario en Volvid y devuelve un Token JWT para la app.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationRequest'
 *     responses:
 *       201:
 *         description: Cuenta creada exitosamente. Token generado.
 *       400:
 *         description: Faltan datos requeridos o las contraseñas no coinciden.
 *       409:
 *         description: El correo ya está registrado en el sistema.
 */
router.post('/register', authController.register);

module.exports = router;
