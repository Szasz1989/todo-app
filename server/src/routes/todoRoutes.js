import express from 'express';
import * as todoController from '../controllers/todoController.js';

/**
 * Todo Routes
 * 
 * LEARNING NOTES:
 * - Routes define the API endpoints (URLs) your server responds to
 * - Express Router lets us organize routes into modules
 * - Each route maps an HTTP method + path to a controller function
 * - This is the "R" in MVC (Model-View-Controller) architecture
 */

// Create a new router instance
const router = express.Router();

/**
 * RESTful API Design Pattern:
 * 
 * GET    /api/todos          - Get all todos
 * GET    /api/todos/:id      - Get single todo
 * POST   /api/todos          - Create new todo
 * PATCH  /api/todos/:id      - Update todo (partial)
 * DELETE /api/todos/:id      - Delete todo
 * 
 * LEARNING NOTES:
 * - REST = Representational State Transfer
 * - Uses HTTP verbs to indicate action (GET, POST, PATCH, DELETE)
 * - Resource-based URLs (nouns, not verbs)
 * - Consistent, predictable pattern
 */

// GET all todos
router.get('/', todoController.getTodos);

// GET single todo by ID
// :id is a route parameter - accessible via req.params.id
router.get('/:id', todoController.getTodoById);

// POST create new todo
// Client sends data in request body (req.body)
router.post('/', todoController.createTodo);

// PUT reorder todos (must be before /:id routes)
router.put('/reorder', todoController.reorderTodos);

// PATCH update todo
// PATCH = partial update, PUT = full replacement
router.patch('/:id', todoController.updateTodo);

// DELETE todo
router.delete('/:id', todoController.deleteTodo);

// PATCH toggle completion status (convenience endpoint)
router.patch('/:id/toggle', todoController.toggleTodoComplete);

/**
 * Route Order Matters!
 * 
 * LEARNING NOTES:
 * - Express matches routes in the order they're defined
 * - Put specific routes BEFORE generic ones
 * - /:id/toggle must come before /:id
 * - Otherwise "toggle" would be treated as an ID
 */

export default router;

