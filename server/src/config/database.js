import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'todo_app';

const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
};

let client = null;
let db = null;

export async function connectToDatabase() {
  try {
    if (db) {
      console.log('Using existing MongoDB connection');
      return { client, db };
    }

    console.log('Connecting to MongoDB...');
    
    client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    
    db = client.db(DB_NAME);
    
    await db.command({ ping: 1 });
    
    console.log('Successfully connected to MongoDB');
    console.log(`Database: ${DB_NAME}`);
    
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not connected! Call connectToDatabase() first.');
  }
  return db;
}

export async function closeDatabaseConnection() {
  try {
    if (client) {
      await client.close();
      client = null;
      db = null;
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}


