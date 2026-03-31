const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

/**
 * Genera un código QR para una mascota y lo guarda como imagen.
 * @param {number|string} petId - ID único de la mascota.
 * @returns {Promise<string>} - Ruta relativa del archivo generado.
 */
const generatePetQR = async (petId) => {
    try {
        const qrContent = `https://volvidmascotas.com/pet/${petId}`;
        const fileName = `qr-${petId}.png`;
        const uploadPath = path.join(__dirname, '../../public/uploads/qrcodes');
        const filePath = path.join(uploadPath, fileName);

        // Asegurar que la carpeta existe
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Generar el código QR
        await QRCode.toFile(filePath, qrContent, {
            color: {
                dark: '#00695C',  // Color principal de Volvid
                light: '#FFFFFF'
            },
            width: 500
        });

        return `/uploads/qrcodes/${fileName}`;
    } catch (err) {
        console.error('Error generating QR:', err);
        throw new Error('No se pudo generar el código QR');
    }
};

module.exports = { generatePetQR };
