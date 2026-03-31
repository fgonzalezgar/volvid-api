const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000, // Important for remote connections stability
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
};

const pool = mysql.createPool(dbConfig);

// Improved database health check for deployment logs
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Base de datos remota conectada correctamente');
        connection.release();
    } catch (err) {
        console.error('❌ Error fatal de conexión a la base de datos:', err.message);
        // Do not exit on error to allow the server to start even with transient DB issues
    }
};

if (process.env.NODE_ENV !== 'test') {
    testConnection();
}

module.exports = pool;
