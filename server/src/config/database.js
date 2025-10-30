import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Database configuration
 * 
 * LEARNING NOTES:
 * - We're using the native MongoDB driver, not an ORM like Mongoose
 * - This gives us direct access to MongoDB's API
 * - We need to handle connections, error handling, and cleanup ourselves
 */

// MongoDB connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Database name from environment variable
const DB_NAME = process.env.MONGODB_DB_NAME || 'todo_app';

/**
 * MongoClient configuration options
 * 
 * LEARNING NOTES:
 * - MongoClient manages connection pooling automatically
 * - A pool reuses connections instead of creating new ones for each request
 * - This is much more efficient for production applications
 */
const options = {
  // Maximum number of connections in the pool
  maxPoolSize: 10,
  
  // Minimum number of connections in the pool
  minPoolSize: 2,
  
  // Close sockets after 45 seconds of inactivity
  socketTimeoutMS: 45000,
  
  // Timeout for initial connection
  serverSelectionTimeoutMS: 5000,
};

// Create a single MongoClient instance (singleton pattern)
// This will be shared across your entire application
let client = null;
let db = null;

/**
 * Connect to MongoDB
 * 
 * LEARNING NOTES:
 * - This function establishes the connection to MongoDB
 * - We only create ONE client for the entire app (singleton pattern)
 * - The client manages a pool of connections internally
 */
export async function connectToDatabase() {
  try {
    if (db) {
      // Already connected, return existing connection
      console.log('📦 Using existing MongoDB connection');
      return { client, db };
    }

    console.log('🔌 Connecting to MongoDB...');
    
    // Create and connect the client
    client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    
    // Get the database instance
    db = client.db(DB_NAME);
    
    // Test the connection by pinging the database
    await db.command({ ping: 1 });
    
    console.log('✅ Successfully connected to MongoDB');
    console.log(`📚 Database: ${DB_NAME}`);
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Get the database instance
 * 
 * LEARNING NOTES:
 * - Use this function to get the db instance in your routes/controllers
 * - This ensures you're always using the same connection
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not connected! Call connectToDatabase() first.');
  }
  return db;
}

/**
 * Close the MongoDB connection
 * 
 * LEARNING NOTES:
 * - Always close connections when shutting down your server
 * - This prevents memory leaks and hanging connections
 * - We'll call this on process termination signals
 */
export async function closeDatabaseConnection() {
  try {
    if (client) {
      await client.close();
      client = null;
      db = null;
      console.log('👋 MongoDB connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
}


