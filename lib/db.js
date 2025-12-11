import mysql from 'mysql2/promise';

// Force IPv4 by converting localhost to 127.0.0.1
const dbHost = process.env.DB_HOST || '127.0.0.1';
const normalizedHost = dbHost === 'localhost' ? '127.0.0.1' : dbHost;

// SSL Configuration for Aiven (or other cloud providers)
const sslConfig = process.env.DB_SSL === 'true' || process.env.DB_SSL_MODE === 'REQUIRED' 
  ? {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      // If CA certificate is provided, use it
      ...(process.env.DB_CA_CERT && {
        ca: process.env.DB_CA_CERT.replace(/\\n/g, '\n')
      })
    }
  : false;

const pool = mysql.createPool({
  host: normalizedHost,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'perpustakaan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig,
  // Enable keep-alive for better connection stability
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection on startup (only in development)
if (process.env.NODE_ENV === 'development') {
  pool.getConnection()
    .then(connection => {
      console.log('✅ Database connected successfully');
      console.log('Database config:', {
        host: normalizedHost,
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_NAME || 'perpustakaan',
        user: process.env.DB_USER || 'root',
        ssl: sslConfig ? 'enabled' : 'disabled'
      });
      connection.release();
    })
    .catch(error => {
      console.error('❌ Database connection error:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', {
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      });
      console.error('Please check your database configuration in .env.local');
      console.error('Required variables: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME');
      if (process.env.DB_SSL === 'true') {
        console.error('SSL is enabled. Make sure DB_SSL_REJECT_UNAUTHORIZED is set correctly.');
      }
    });
}

export default pool;
