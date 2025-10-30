/**
 * Todo Type Definitions
 * 
 * LEARNING NOTES:
 * - TypeScript interfaces define the shape of our data
 * - Must match what the backend returns
 * - _id comes from MongoDB (note the underscore!)
 * - Dates are strings (JSON doesn't have Date type)
 */

export interface Todo {
  _id: string;              // MongoDB's unique identifier
  title: string;            // Todo text/description
  completed: boolean;       // Completion status
  order: number;            // Display order for drag & drop
  createdAt: string;        // ISO date string
  updatedAt: string;        // ISO date string
}

/**
 * API Response wrapper
 * 
 * LEARNING: Backend sends consistent response structure
 * All responses have success, message, and optional data
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

