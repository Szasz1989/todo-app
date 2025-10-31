import type { Todo, ApiResponse } from '@/types/todo';

const API_BASE_URL = '/api/todos';

export async function fetchTodos(): Promise<Todo[]> {
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<Todo[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
}

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

export async function deleteTodo(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}

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
  } catch (error) {
    console.error('Error reordering todos:', error);
    throw error;
  }
}
