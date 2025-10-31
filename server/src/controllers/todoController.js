import * as todoDb from '../db/todoDb.js';
import { handleError } from '../utils/errorHandler.js';

export async function getTodos(req, res) {
  try {
    console.log('Fetching all todos...');
    const todos = await todoDb.getAllTodos();
    
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    handleError(error, res, 'Failed to fetch todos');
  }
}

export async function getTodoById(req, res) {
  try {
    const { id } = req.params;
    console.log(`Fetching todo with ID: ${id}`);
    
    const todo = await todoDb.getTodoById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    handleError(error, res, 'Failed to fetch todo');
  }
}

export async function createTodo(req, res) {
  try {
    const { title, completed } = req.body;
    console.log('Creating new todo:', { title, completed });
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }
    
    const newTodo = await todoDb.createTodo({
      title: title.trim(),
      completed: completed || false,
    });
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: newTodo,
    });
  } catch (error) {
    handleError(error, res, 'Failed to create todo');
  }
}

export async function updateTodo(req, res) {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    console.log(`Updating todo ${id}:`, { title, completed });
    
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (completed !== undefined) updates.completed = completed;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }
    
    const updatedTodo = await todoDb.updateTodo(id, updates);
    
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  } catch (error) {
    handleError(error, res, 'Failed to update todo');
  }
}

export async function deleteTodo(req, res) {
  try {
    const { id } = req.params;
    console.log(`Deleting todo ${id}`);
    
    const deleted = await todoDb.deleteTodo(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    handleError(error, res, 'Failed to delete todo');
  }
}

export async function toggleTodoComplete(req, res) {
  try {
    const { id } = req.params;
    console.log(`Toggling todo ${id} completion`);
    
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
    handleError(error, res, 'Failed to toggle todo');
  }
}

export async function reorderTodos(req, res) {
  try {
    const { todoIds } = req.body;
    console.log(`Reordering ${todoIds?.length || 0} todos`);
    
    if (!Array.isArray(todoIds) || todoIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'todoIds must be a non-empty array',
      });
    }
    
    await todoDb.reorderTodos(todoIds);
    
    res.status(200).json({
      success: true,
      message: 'Todos reordered successfully',
    });
  } catch (error) {
    handleError(error, res, 'Failed to reorder todos');
  }
}
