import { useEffect, useState } from 'react';
import { CheckSquare, ListTodo, CheckCircle2, Clock } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Todo } from '@/types/todo';
import * as api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TodoItem } from '@/components/TodoItem';
import { AddTodoForm } from '@/components/AddTodoForm';

/**
 * Main App Component
 * 
 * LEARNING NOTES:
 * - Container component - manages state and API calls
 * - useEffect for loading data when component mounts
 * - useState for storing todos array
 * - Passes callbacks to child components
 * - This is the "smart component" pattern - logic lives here
 */

function App() {
  // State for todos array
  const [todos, setTodos] = useState<Todo[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Track which todo is being dragged
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  /**
   * Drag & Drop Sensors
   * 
   * LEARNING NOTES:
   * - Sensors detect drag interactions (mouse, touch, keyboard)
   * - PointerSensor: handles mouse and touch
   * - KeyboardSensor: allows keyboard-based dragging (accessibility!)
   * - activationConstraint prevents accidental drags on click
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // Minimal distance for faster response
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  /**
   * Load todos when component mounts
   * 
   * LEARNING:
   * - useEffect with empty deps [] runs once on mount
   * - Async function inside useEffect (can't make useEffect itself async)
   * - Good place for initial data fetching
   */
  useEffect(() => {
    loadTodos();
  }, []); // Empty deps = run once on mount
  
  /**
   * Fetch todos from API
   */
  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.fetchTodos();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Make sure the server is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Create a new todo
   * 
   * LEARNING:
   * - Optimistic update: add to UI immediately
   * - If API fails, we could roll back (not implemented here)
   * - Updates state immutably with [...todos, newTodo]
   */
  const handleAddTodo = async (title: string) => {
    try {
      const newTodo = await api.createTodo(title);
      
      // Add new todo to the beginning of the array
      setTodos([newTodo, ...todos]);
    } catch (err) {
      setError('Failed to create todo');
      throw err; // Re-throw so form can handle it
    }
  };
  
  /**
   * Toggle todo completion status
   * 
   * LEARNING:
   * - map() creates new array with one item changed
   * - Immutable update pattern (don't mutate state directly)
   * - Could use optimistic update for better UX
   */
  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodo = await api.toggleTodo(id);
      
      // Update the todo in state
      setTodos(todos.map((todo) => 
        todo._id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };
  
  /**
   * Delete a todo
   * 
   * LEARNING:
   * - filter() creates new array without the deleted item
   * - Immutable update pattern
   */
  const handleDeleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id);
      
      // Remove todo from state
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };
  
  /**
   * Handle drag start event
   * 
   * LEARNING NOTES:
   * - Sets the active todo for the drag overlay
   * - Makes dragging smoother by rendering on a separate layer
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const todo = todos.find((t) => t._id === active.id);
    setActiveTodo(todo || null);
  };

  /**
   * Handle drag end event
   * 
   * LEARNING NOTES:
   * - Called when user drops a dragged item
   * - arrayMove() reorders the array efficiently
   * - Updates UI immediately (optimistic update)
   * - Then persists to backend
   */
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // Clear active todo
    setActiveTodo(null);

    // If dropped in same position, do nothing
    if (!over || active.id === over.id) {
      return;
    }

    // Find old and new indices
    const oldIndex = todos.findIndex((todo) => todo._id === active.id);
    const newIndex = todos.findIndex((todo) => todo._id === over.id);

    // Reorder the array
    const reorderedTodos = arrayMove(todos, oldIndex, newIndex);

    // Update UI immediately (optimistic update)
    setTodos(reorderedTodos);

    try {
      // Persist new order to backend
      const todoIds = reorderedTodos.map((todo: Todo) => todo._id);
      await api.reorderTodos(todoIds);
    } catch (err) {
      // On error, revert to original order
      setError('Failed to save order');
      setTodos(todos);
      console.error(err);
    }
  };

  /**
   * Computed values
   * 
   * LEARNING:
   * - Derived state (computed from todos array)
   * - No need for separate state, just calculate when needed
   */
  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-semibold tracking-tight mb-1">What Todo</h1>
              <p className="text-sm text-muted-foreground">
                For people with dementia like me :D
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {/* Total Tasks Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tasks
              </CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalCount === 1 ? 'task' : 'tasks'} in your list
              </p>
            </CardContent>
          </Card>

          {/* Completed Tasks Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalCount > 0 
                  ? `${Math.round((completedCount / totalCount) * 100)}% completion rate`
                  : 'No tasks yet'
                }
              </p>
            </CardContent>
          </Card>

          {/* Pending Tasks Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount - completedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalCount - completedCount === 1 ? 'task' : 'tasks'} remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Add Todo Form Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>
              Create a new task to keep track of your work.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddTodoForm onAdd={handleAddTodo} />
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Todo List Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12 text-muted-foreground">
                <div className="animate-pulse">Loading your tasks...</div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && todos.length === 0 && (
              <div className="text-center py-12">
                <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                <p className="text-sm text-muted-foreground">
                  Get started by adding your first task above.
                </p>
              </div>
            )}

            {/* Todo List with Drag & Drop */}
            {!isLoading && todos.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={todos.map((todo) => todo._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {todos.map((todo) => (
                      <TodoItem
                        key={todo._id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeTodo ? (
                    <div className="flex items-center gap-4 p-4 rounded-md border bg-card shadow-lg opacity-90">
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activeTodo.title}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default App;

