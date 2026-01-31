import app from './app';
import { initializeDatabase, testConnection } from './config/db';

const PORT = process.env.PORT || 3001;

/**
 * Start the server with database initialization
 */
const startServer = async (): Promise<void> => {
  try {
    // Initialize database connection pool
    console.log('🔌 Initializing database connection...');
    initializeDatabase();
    
    // Test database connection
    await testConnection();
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`🚀 Lumina Luxe API server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🗄️  Database health: http://localhost:${PORT}/health/db`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Make sure PostgreSQL is running and DATABASE_URL is correct');
    process.exit(1);
  }
};

// Start the server
startServer();
