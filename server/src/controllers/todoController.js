import * as todoDb from '../db/todoDb.js';

/**
 * Todo Controllers
 * 
 * LEARNING NOTES:
 * - Controllers contain the business logic for each route
 * - They handle the request/response cycle
 * - They call the database layer functions
 * - They format responses and handle errors
 * - This separation keeps routes clean and logic organized
 */

/**
 * GET /api/todos - Get all todos
 * 
 * LEARNING NOTES:
 * - req (request) contains incoming data from the client
 * - res (response) is used to send data back to the client
 * - res.json() sends JSON response with proper Content-Type header
 * - Status codes: 200 = success, 500 = server error
 */
export async function getTodos(req, res) {
  try {
    console.log('📋 Fetching all todos...');
    
    const todos = await todoDb.getAllTodos();
    
    // Send successful response
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error('Error in getTodos controller:', error);
    
    // Send error response
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todos',
      error: error.message,
    });
  }
}

/**
 * GET /api/todos/:id - Get a single todo by ID
 * 
 * LEARNING NOTES:
 * - req.params contains route parameters (e.g., :id)
 * - Status 404 = Not Found (when todo doesn't exist)
 * - Always validate input before database operations
 */
export async function getTodoById(req, res) {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Fetching todo with ID: ${id}`);
    
    const todo = await todoDb.getTodoById(id);
    
    // Check if todo exists
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }
    
    // Send successful response
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error('Error in getTodoById controller:', error);
    
    // Invalid ObjectId format error
    if (error.name === 'BSONError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todo',
      error: error.message,
    });
  }
}

/**
 * POST /api/todos - Create a new todo
 * 
 * LEARNING NOTES:
 * - req.body contains data sent in the request body
 * - Must validate required fields
 * - Status 201 = Created (successful creation)
 * - Status 400 = Bad Request (validation error)
 */
export async function createTodo(req, res) {
  try {
    const { title, completed } = req.body;
    
    console.log('➕ Creating new todo:', { title, completed });
    
    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }
    
    // Create the todo
    const newTodo = await todoDb.createTodo({
      title: title.trim(),
      completed: completed || false,
    });
    
    // Send successful response with 201 status
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo,
    });
  } catch (error) {
    console.error('Error in createTodo controller:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: error.message,
    });
  }
}

/**
 * PATCH /api/todos/:id - Update a todo
 * 
 * LEARNING NOTES:
 * - PATCH is for partial updates (only changed fields)
 * - PUT would be for complete replacement
 * - We validate that at least one field is being updated
 */
export async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    
    console.log(`✏️ Updating todo ${id}:`, { title, completed });
    
    // Build update object with only provided fields
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (completed !== undefined) updates.completed = completed;
    
    // Check if there's anything to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }
    
    // Update the todo
    const updatedTodo = await todoDb.updateTodo(id, updates);
    
    // Check if todo exists
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }
    
    // Send successful response
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  } catch (error) {
    console.error('Error in updateTodo controller:', error);
    
    // Invalid ObjectId format error
    if (error.name === 'BSONError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      error: error.message,
    });
  }
}

/**
 * DELETE /api/todos/:id - Delete a todo
 * 
 * LEARNING NOTES:
 * - Status 204 = No Content (successful deletion, no response body)
 * - We're using 200 with a message for better client feedback
 */
export async function deleteTodo(req, res) {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ Deleting todo ${id}`);
    
    const deleted = await todoDb.deleteTodo(id);
    
    // Check if todo was actually deleted
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }
    
    // Send successful response
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteTodo controller:', error);
    
    // Invalid ObjectId format error
    if (error.name === 'BSONError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      error: error.message,
    });
  }
}

/**
 * PATCH /api/todos/:id/toggle - Toggle todo completion status
 * 
 * LEARNING NOTES:
 * - This is a specialized endpoint for a common operation
 * - Makes the API more user-friendly
 * - Client doesn't need to know current state to toggle
 */
export async function toggleTodoComplete(req, res) {
  try {
    const { id } = req.params;
    
    console.log(`🔄 Toggling todo ${id} completion`);
    
    const updatedTodo = await todoDb.toggleTodoComplete(id);
    
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Todo toggled successfully',
      data: updatedTodo,
    });
  } catch (error) {
    console.error('Error in toggleTodoComplete controller:', error);
    
    if (error.name === 'BSONError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID format',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to toggle todo',
      error: error.message,
    });
  }
}

/**
 * PUT /api/todos/reorder - Reorder todos
 * 
 * LEARNING NOTES:
 * - PUT is used for replacing/reordering
 * - Receives array of todo IDs in new order
 * - Updates all affected todos in one operation
 */
export async function reorderTodos(req, res) {
  try {
    const { todoIds } = req.body;
    
    console.log(`🔀 Reordering ${todoIds?.length || 0} todos`);
    
    // Validate input
    if (!Array.isArray(todoIds) || todoIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'todoIds must be a non-empty array',
      });
    }
    
    // Reorder todos
    await todoDb.reorderTodos(todoIds);
    
    res.status(200).json({
      success: true,
      message: 'Todos reordered successfully',
    });
  } catch (error) {
    console.error('Error in reorderTodos controller:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to reorder todos',
      error: error.message,
    });
  }
}

