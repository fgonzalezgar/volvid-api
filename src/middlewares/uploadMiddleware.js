const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Función para configurar el almacenamiento dinámicamente
const createStorage = (folder, prefix) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, `../../public/uploads/${folder}`);
            
            // Crear la carpeta si no existe
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            // Generar un nombre único
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `${prefix}-${uniqueSuffix}${ext}`);
        }
    });
};

// Filtro de archivos (Solo imágenes)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (ext && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, webp)'), false);
    }
};

// Filtro que incluye PDFs para Prestadores
const fileFilterProvider = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (ext && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, webp) o documentos PDF'), false);
    }
};

// Instancia para Mascotas (Mantener compatibilidad)
const uploadPet = multer({
    storage: createStorage('pets', 'pet'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Instancia para Usuarios (Dueños)
const uploadUser = multer({
    storage: createStorage('users', 'user'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Instancia para Prestadores (Soporta PDF)
const uploadProvider = multer({
    storage: createStorage('providers', 'doc'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilterProvider
});

// Exportar todos
module.exports = uploadPet;
module.exports.user = uploadUser;
module.exports.provider = uploadProvider;
