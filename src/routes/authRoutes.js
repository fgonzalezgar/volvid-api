const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { user: uploadUser, provider: uploadProvider } = require('../middlewares/uploadMiddleware');

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
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Correo electrónico registrado
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *             token:
 *               type: string
 *     ProfileUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             photo:
 *               type: string
 *               description: URL de la foto de perfil actualizada
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro unificado (Dueños y Prestadores)
 *     description: Crea una cuenta de usuario. Si el 'role' es 'provider', se requiere 'business_name' y se pueden subir documentos.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationRequest'
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [owner, provider]
 *               business_name:
 *                 type: string
 *               services:
 *                 type: string
 *               experience:
 *                 type: string
 *               accepted_terms:
 *                 type: boolean
 *               identity_document:
 *                 type: string
 *                 format: binary
 *               certifications:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cuenta creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post('/register', 
    uploadProvider.fields([
        { name: 'identity_document', maxCount: 1 }, 
        { name: 'certifications', maxCount: 1 }
    ]), 
    authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Valida el correo y contraseña ingresados por el usuario y genera un Token JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso, se retorna la información del usuario y token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Datos faltantes en el cuerpo de la petición.
 *       401:
 *         description: Credenciales inválidas (contraseña incorrecta o correo no existe).
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario
 *     description: Retorna la información completa del perfil del usuario autenticado. Requiere Token JWT.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos de perfil obtenidos exitosamente.
 *       401:
 *         description: No autorizado. Token inválido o no proporcionado.
 *   put:
 *     summary: Actualizar perfil y foto
 *     description: Permite modificar los datos personales y subir una foto de perfil. Requiere Token JWT. Soporta Multipart/Form-Data.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               secondary_phone:
 *                 type: string
 *               address:
 *                 type: string
 *               province:
 *                 type: string
 *               city:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileUpdateResponse'
 */
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, uploadUser.single('photo'), authController.updateProfile);
router.post('/profile', verifyToken, uploadUser.single('photo'), authController.updateProfile);
router.patch('/profile', verifyToken, uploadUser.single('photo'), authController.updateProfile);

/**
 * @swagger
 * /api/auth/register/provider:
 *   post:
 *     summary: Alias para registro de prestador (Red Élite)
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 */
router.post('/register/provider', 
    uploadProvider.fields([
        { name: 'identity_document', maxCount: 1 }, 
        { name: 'certifications', maxCount: 1 }
    ]), 
    authController.register
);

module.exports = router;
