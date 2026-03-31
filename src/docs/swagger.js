const swaggerJsDoc = require('swagger-jsdoc');

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
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
