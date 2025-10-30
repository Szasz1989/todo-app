import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase, closeDatabaseConnection } from './config/database.js';
import todoRoutes from './routes/todoRoutes.js';

/**
 * Express Server Setup
 * 
 * LEARNING NOTES:
 * - This is the entry point of your backend application
 * - We configure Express middleware and routes here
 * - The server listens for HTTP requests on a specific port
 */

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// Get port from environment or use default
const PORT = process.env.PORT || 5000;

/**
 * Middleware Configuration
 * 
 * LEARNING NOTES:
 * - Middleware = functions that process requests before they reach routes
 * - They execute in the order they're defined (top to bottom)
 * - Each middleware can modify req/res or end the request cycle
 */

// 1. CORS Middleware
// LEARNING: Allows your React app (different port) to make requests to this server
// Without this, browsers block cross-origin requests (security feature)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// 2. JSON Body Parser
// LEARNING: Parses incoming JSON payloads into req.body
// Without this, req.body would be undefined
app.use(express.json());

// 3. URL-encoded Body Parser
// LEARNING: Parses form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// 4. Request Logger (simple middleware)
// LEARNING: Shows how to create custom middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next(); // Pass control to next middleware
});

/**
 * Routes
 * 
 * LEARNING NOTES:
 * - All todo routes are prefixed with /api/todos
 * - This creates a clear API namespace
 * - Makes versioning easier (e.g., /api/v1/todos)
 */

// Health check endpoint (useful for monitoring)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount todo routes at /api/todos
app.use('/api/todos', todoRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.url,
  });
});

/**
 * Error Handling Middleware
 * 
 * LEARNING NOTES:
 * - Must have 4 parameters (err, req, res, next)
 * - Express automatically calls this when errors occur
 * - Should be defined AFTER all routes
 */
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

/**
 * Start Server
 * 
 * LEARNING NOTES:
 * - Connect to database first, then start accepting requests
 * - If database connection fails, server won't start
 * - This prevents serving requests when database is unavailable
 */
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Start listening for requests
    app.listen(PORT, () => {
      console.log('');
      console.log('=================================');
      console.log('🚀 Server is running!');
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 URL: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`📋 API: http://localhost:${PORT}/api/todos`);
      console.log('=================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1); // Exit with error code
  }
}

/**
 * Graceful Shutdown
 * 
 * LEARNING NOTES:
 * - Close database connections when server stops
 * - Prevents hanging connections and data corruption
 * - Listen for process termination signals
 */
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  try {
    await closeDatabaseConnection();
    console.log('✅ Server shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start the server
startServer();


