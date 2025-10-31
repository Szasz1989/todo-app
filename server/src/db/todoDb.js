import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

const COLLECTION_NAME = 'todos';

function getTodosCollection() {
  const db = getDatabase();
  return db.collection(COLLECTION_NAME);
}

export async function createTodo(todoData) {
  try {
    const collection = getTodosCollection();
    
    await collection.updateMany(
      {},
      { $inc: { order: 1 } }
    );
    
    const todo = {
      title: todoData.title,
      completed: todoData.completed || false,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await collection.insertOne(todo);
    
    return {
      _id: result.insertedId,
      ...todo,
    };
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}

export async function getAllTodos() {
  try {
    const collection = getTodosCollection();
    
    const todos = await collection
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    
    let needsUpdate = false;
    todos.forEach((todo, index) => {
      if (todo.order === undefined || todo.order === null) {
        todo.order = index;
        needsUpdate = true;
      }
    });
    
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

export async function getTodoById(id) {
  try {
    const collection = getTodosCollection();
    const objectId = ObjectId.createFromHexString(id);
    const todo = await collection.findOne({ _id: objectId });
    return todo;
  } catch (error) {
    console.error('Error getting todo by ID:', error);
    throw error;
  }
}

export async function updateTodo(id, updates) {
  try {
    const collection = getTodosCollection();
    const objectId = ObjectId.createFromHexString(id);
    
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    return result;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

export async function deleteTodo(id) {
  try {
    const collection = getTodosCollection();
    const objectId = ObjectId.createFromHexString(id);
    const result = await collection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

export async function toggleTodoComplete(id) {
  try {
    const todo = await getTodoById(id);
    
    if (!todo) {
      return null;
    }
    
    const updated = await updateTodo(id, {
      completed: !todo.completed,
    });
    
    return updated;
  } catch (error) {
    console.error('Error toggling todo:', error);
    throw error;
  }
}

export async function reorderTodos(todoIds) {
  try {
    const collection = getTodosCollection();
    
    const bulkOps = todoIds.map((id, index) => ({
      updateOne: {
        filter: { _id: ObjectId.createFromHexString(id) },
        update: { $set: { order: index, updatedAt: new Date() } },
      },
    }));
    
    await collection.bulkWrite(bulkOps);
    
    return true;
  } catch (error) {
    console.error('Error reordering todos:', error);
    throw error;
  }
}
