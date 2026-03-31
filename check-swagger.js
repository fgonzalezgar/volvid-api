const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Volvid API',
            version: '1.0.0',
            description: 'API for Volvid pets platform',
        },
    },
    apis: [path.join(__dirname, 'src/routes/*.js')],
};

const specs = swaggerJsdoc(options);
const fs = require('fs');
fs.writeFileSync('swagger-check.json', JSON.stringify(specs, null, 2));
console.log('Swagger JSON generated. Check swagger-check.json');
