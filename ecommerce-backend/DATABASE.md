# Database Configuration

## PostgreSQL Setup

The backend uses PostgreSQL with connection pooling for production-safe database operations.

### Environment Variables

Required in `.env`:
```bash
DATABASE_URL=postgresql://username:password@host:port/database_name
```

Example for local development:
```bash
DATABASE_URL=postgresql://localhost:5432/lumina_luxe
```

### Connection Pool Configuration

The database connection pool is configured with production-safe defaults:
- **Max connections**: 20
- **Idle timeout**: 30 seconds
- **Connection timeout**: 2 seconds
- **SSL**: Enabled in production, disabled in development

### Usage

```typescript
import { query } from './config/db';

// Execute a query
const result = await query('SELECT * FROM products WHERE id = $1', [productId]);

// Access results
const products = result.rows;
```

### Health Checks

- **API Health**: `GET /health`
- **Database Health**: `GET /health/db`

### Error Handling

- Connection failures cause the server to exit with code 1
- Pool errors are logged and cause process exit
- Graceful shutdown on SIGINT/SIGTERM
- Individual query errors are caught and logged

### Local Development

1. Install PostgreSQL locally
2. Create database: `createdb lumina_luxe`
3. Update `.env` with your database URL
4. Start server: `npm run dev`

The server will test the database connection on startup and fail fast if the database is not reachable.