const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Volvid API',
            version: '1.0.0',
            description: 'API para la gestión de servicios de mascotas Volvid',
            contact: {
                name: 'Soporte Volvid',
                url: 'https://volvid.com'
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Servidor de Desarrollo'
                }
            ],
        },
    },
    apis: [path.join(__dirname, '../routes/*.js')], // Ruta absoluta a los archivos de ruteo
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
