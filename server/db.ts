import { Pool, PoolConfig, DatabaseError } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Pool configuration
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  maxUses: 7500, // Close a connection after it has been used 7500 times (prevents memory leaks)
  allowExitOnIdle: false, // Don't allow the pool to exit while we have work to do
  
  // Error handling
  application_name: 'poopy-pals', // Helps identify the application in pg_stat_activity
  keepAlive: true, // Enables TCP keepalive
  keepAliveInitialDelayMillis: 10000, // Wait 10 seconds before starting keepalive
};

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create a PostgreSQL pool for connection to the database
export const pool = new Pool(poolConfig);

// Error handling for the pool
pool.on('error', (err: DatabaseError, client) => {
  console.error('Unexpected error on idle client', err);
  // Close the client and remove it from the pool
  client.release(true);
});

pool.on('connect', (client) => {
  client.on('error', (err: DatabaseError) => {
    console.error('Database client error:', err);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Closing pool...');
  pool.end().then(() => {
    console.log('Pool has ended');
    process.exit(0);
  });
});

// Helper function to retry failed queries
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      if (error instanceof DatabaseError) {
        const retryableCodes = ['40001', '40P01', '55P03']; // Deadlock, serialization failure, lock timeout
        if (!retryableCodes.includes(error.code)) {
          throw error; // Don't retry if error is not retryable
        }
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
      }
    }
  }
  
  throw lastError;
}

// Create a drizzle instance using the pool and schema
export const db = drizzle(pool, { schema });

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

// Connection pool statistics
export function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  };
}