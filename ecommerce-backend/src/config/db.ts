import { Pool, PoolClient, QueryResult } from 'pg';

// Database connection pool
let pool: Pool;

/**
 * Initialize PostgreSQL connection pool
 */
export const initializeDatabase = (): Pool => {
  if (pool) {
    return pool;
  }

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
  });

  // Handle pool errors
  pool.on('error', (err: Error) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });

  return pool;
};

/**
 * Get the database pool instance
 */
export const getPool = (): Pool => {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return pool;
};

/**
 * Execute a query with parameters
 */
export const query = async (text: string, params?: any[]): Promise<QueryResult> => {
  const client: PoolClient = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Test database connection
 */
export const testConnection = async (): Promise<void> => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as version');
    console.log('✅ Database connected successfully');
    console.log(`📅 Server time: ${result.rows[0].current_time}`);
    console.log(`🗄️  PostgreSQL version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

/**
 * Close database connection pool
 */
export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    console.log('🔌 Database connection pool closed');
  }
};

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, closing database connections...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, closing database connections...');
  await closeDatabase();
  process.exit(0);
});