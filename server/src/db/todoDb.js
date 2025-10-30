import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

/**
 * Todo Database Layer
 * 
 * LEARNING NOTES:
 * - This file contains all database operations for todos
 * - We're using the native MongoDB driver directly
 * - Each function demonstrates core database operations (CRUD)
 * - No ORM magic - you see exactly what's happening with the database
 */

// Collection name constant
const COLLECTION_NAME = 'todos';

/**
 * Get reference to the todos collection
 * 
 * LEARNING NOTES:
 * - A "collection" in MongoDB is like a "table" in SQL
 * - MongoDB is document-based, so we store JSON-like documents
 * - Collections are created automatically when you insert the first document
 */
function getTodosCollection() {
  const db = getDatabase();
  return db.collection(COLLECTION_NAME);
}

/**
 * CREATE - Insert a new todo
 * 
 * @param {Object} todoData - The todo data to insert
 * @returns {Object} The created todo with its ID
 * 
 * LEARNING NOTES:
 * - insertOne() adds a single document to the collection
 * - MongoDB automatically generates an _id field (ObjectId)
 * - The insertedId is returned so we can fetch the created document
 */
export async function createTodo(todoData) {
  try {
    const collection = getTodosCollection();
    
    // Shift all existing todos down by incrementing their order
    await collection.updateMany(
      {},
      { $inc: { order: 1 } }
    );
    
    // Prepare the todo document with order 0 (first position)
    const todo = {
      title: todoData.title,
      completed: todoData.completed || false,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Insert the document
    const result = await collection.insertOne(todo);
    
    // Return the created todo with its new ID
    return {
      _id: result.insertedId,
      ...todo,
    };
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}

/**
 * READ - Get all todos
 * 
 * @returns {Array} Array of all todos
 * 
 * LEARNING NOTES:
 * - find() returns a cursor (pointer to results)
 * - toArray() converts the cursor to a JavaScript array
 * - find({}) with empty object means "find all documents"
 * - sort() orders results (1 = ascending, -1 = descending)
 */
export async function getAllTodos() {
  try {
    const collection = getTodosCollection();
    
    // Find all todos, sorted by order (ascending), then by createdAt for old todos without order
    const todos = await collection
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    
    // Assign order to todos that don't have it (for backwards compatibility)
    let needsUpdate = false;
    todos.forEach((todo, index) => {
      if (todo.order === undefined || todo.order === null) {
        todo.order = index;
        needsUpdate = true;
      }
    });
    
    // If any todos were missing order, update them in the database
    if (needsUpdate) {
      const bulkOps = todos
        .filter(todo => todo.order !== undefined)
        .map(todo => ({
          updateOne: {
            filter: { _id: todo._id },
            update: { $set: { order: todo.order } },
          },
        }));
      
      if (bulkOps.length > 0) {
        await collection.bulkWrite(bulkOps);
      }
    }
    
    return todos;
  } catch (error) {
    console.error('Error getting todos:', error);
    throw error;
  }
}

/**
 * READ - Get a single todo by ID
 * 
 * @param {string} id - The todo ID
 * @returns {Object|null} The todo or null if not found
 * 
 * LEARNING NOTES:
 * - MongoDB uses ObjectId for _id field
 * - Must convert string ID to ObjectId for queries
 * - findOne() returns single document or null
 */
export async function getTodoById(id) {
  try {
    const collection = getTodosCollection();
    
    // Convert string ID to ObjectId
    const objectId = new ObjectId(id);
    
    // Find the todo by _id
    const todo = await collection.findOne({ _id: objectId });
    
    return todo;
  } catch (error) {
    console.error('Error getting todo by ID:', error);
    throw error;
  }
}

/**
 * UPDATE - Update a todo
 * 
 * @param {string} id - The todo ID
 * @param {Object} updates - The fields to update
 * @returns {Object|null} The updated todo or null if not found
 * 
 * LEARNING NOTES:
 * - findOneAndUpdate() finds and updates in one atomic operation
 * - $set operator updates specific fields without replacing the entire document
 * - returnDocument: 'after' returns the updated version
 * - updateOne() vs findOneAndUpdate(): latter returns the document
 */
export async function updateTodo(id, updates) {
  try {
    const collection = getTodosCollection();
    const objectId = new ObjectId(id);
    
    // Prepare update data
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    
    // Update the todo and return the updated document
    const result = await collection.findOneAndUpdate(
      { _id: objectId },           // Filter: which document to update
      { $set: updateData },         // Update: what to change
      { returnDocument: 'after' }   // Options: return updated document
    );
    
    return result;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

/**
 * DELETE - Delete a todo
 * 
 * @param {string} id - The todo ID
 * @returns {boolean} True if deleted, false if not found
 * 
 * LEARNING NOTES:
 * - deleteOne() removes a single document
 * - deletedCount tells us if anything was actually deleted
 * - Returns boolean for easy success checking
 */
export async function deleteTodo(id) {
  try {
    const collection = getTodosCollection();
    const objectId = new ObjectId(id);
    
    // Delete the todo
    const result = await collection.deleteOne({ _id: objectId });
    
    // Return true if something was deleted
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

/**
 * UTILITY - Toggle todo completion status
 * 
 * @param {string} id - The todo ID
 * @returns {Object|null} The updated todo or null if not found
 * 
 * LEARNING NOTES:
 * - This demonstrates how to build helper functions on top of base operations
 * - We fetch, modify, then update
 * - In production, you might use MongoDB's $set with a computed value
 */
export async function toggleTodoComplete(id) {
  try {
    // Get the current todo
    const todo = await getTodoById(id);
    
    if (!todo) {
      return null;
    }
    
    // Toggle the completed status
    const updated = await updateTodo(id, {
      completed: !todo.completed,
    });
    
    return updated;
  } catch (error) {
    console.error('Error toggling todo:', error);
    throw error;
  }
}

/**
 * UPDATE - Reorder todos
 * 
 * @param {Array} todoIds - Array of todo IDs in new order
 * @returns {boolean} True if successful
 * 
 * LEARNING NOTES:
 * - Bulk update operation for efficiency
 * - Updates the order field for multiple documents
 * - Uses bulkWrite for atomic operations
 */
export async function reorderTodos(todoIds) {
  try {
    const collection = getTodosCollection();
    
    // Create bulk write operations
    const bulkOps = todoIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index, updatedAt: new Date() } },
      },
    }));
    
    // Execute all updates at once
    await collection.bulkWrite(bulkOps);
    
    return true;
  } catch (error) {
    console.error('Error reordering todos:', error);
    throw error;
  }
}

