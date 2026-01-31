import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './config/db';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Lumina Luxe API is running' });
});

// Database health check route
app.get('/health/db', async (_req, res) => {
  try {
    const result = await query('SELECT NOW() as current_time');
    res.json({ 
      status: 'OK', 
      message: 'Database connection healthy',
      timestamp: result.rows[0].current_time
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'Database connection failed' 
    });
  }
});

// Routes
app.get('/api/products', async (_req, res) => {
  try {
    // Example database query - replace with actual products table when available
    const result = await query('SELECT $1 as message, NOW() as timestamp', ['Products endpoint - database connected']);
    res.json({ 
      message: result.rows[0].message,
      timestamp: result.rows[0].timestamp,
      note: 'Replace this with actual products query when products table exists'
    });
  } catch (error) {
    console.error('Products endpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
