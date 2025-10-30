import type { Todo, ApiResponse } from '@/types/todo';

/**
 * API Service Layer
 * 
 * LEARNING NOTES:
 * - Centralized place for all backend communication
 * - Uses native fetch API (no axios needed for simple apps)
 * - Each function corresponds to a backend endpoint
 * - Error handling is done here, not in components
 */

// Base API URL
// In development, Vite proxy forwards /api to http://localhost:5000
const API_BASE_URL = '/api/todos';

/**
 * Fetch all todos
 * GET /api/todos
 * 
 * LEARNING: async/await makes asynchronous code look synchronous
 */
export async function fetchTodos(): Promise<Todo[]> {
  try {
    const response = await fetch(API_BASE_URL);
    
    // Check if request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Parse JSON response
    const result: ApiResponse<Todo[]> = await response.json();
    
    // Return the data array
    return result.data || [];
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}

/**
 * Create a new todo
 * POST /api/todos
 * 
 * LEARNING:
 * - POST request sends data in the request body
 * - Content-Type header tells server it's JSON
 * - JSON.stringify converts JavaScript object to JSON string
 */
export async function createTodo(title: string): Promise<Todo> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Todo> = await response.json();
    
    if (!result.data) {
      throw new Error('No data returned from server');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}

/**
 * Update a todo
 * PATCH /api/todos/:id
 * 
 * LEARNING:
 * - PATCH for partial updates (only send changed fields)
 * - Template literal for dynamic URL with ID
 */
export async function updateTodo(
  id: string,
  updates: { title?: string; completed?: boolean }
): Promise<Todo> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Todo> = await response.json();
    
    if (!result.data) {
      throw new Error('No data returned from server');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

/**
 * Delete a todo
 * DELETE /api/todos/:id
 * 
 * LEARNING:
 * - DELETE request removes a resource
 * - Returns void (no data needed after deletion)
 */
export async function deleteTodo(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // No need to return data for delete
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

/**
 * Toggle todo completion status
 * PATCH /api/todos/:id/toggle
 * 
 * LEARNING:
 * - Convenience endpoint - client doesn't need to know current state
 * - Server handles the toggle logic
 */
export async function toggleTodo(id: string): Promise<Todo> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
      method: 'PATCH',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Todo> = await response.json();
    
    if (!result.data) {
      throw new Error('No data returned from server');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error toggling todo:', error);
    throw error;
  }
}

/**
 * Reorder todos
 * PUT /api/todos/reorder
 * 
 * LEARNING:
 * - Sends array of todo IDs in new order
 * - Server updates all todos in one operation (efficient!)
 * - Uses PUT since we're replacing the entire order
 */
export async function reorderTodos(todoIds: string[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todoIds }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // No data needed for reorder response
  } catch (error) {
    console.error('Error reordering todos:', error);
    throw error;
  }
}

