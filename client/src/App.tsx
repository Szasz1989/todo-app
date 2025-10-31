import { useEffect, useState } from 'react';
import type { Todo } from '@/types/todo';
import * as api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { TodoList } from '@/components/TodoList';
import { AddTodoForm } from '@/components/AddTodoForm';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadTodos();
  }, []);
  
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
  
  const handleAddTodo = async (title: string) => {
    try {
      const newTodo = await api.createTodo(title);
      setTodos([newTodo, ...todos]);
    } catch (err) {
      setError('Failed to create todo');
      throw err;
    }
  };
  
  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodo = await api.toggleTodo(id);
      setTodos(todos.map((todo) => 
        todo._id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  };
  
  const handleDeleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  };
  
  const handleReorder = async (reorderedTodos: Todo[]) => {
    const previousTodos = todos;
    setTodos(reorderedTodos);

    try {
      const todoIds = reorderedTodos.map((todo) => todo._id);
      await api.reorderTodos(todoIds);
    } catch (err) {
      setError('Failed to save order');
      setTodos(previousTodos);
      console.error(err);
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards totalCount={totalCount} completedCount={completedCount} />

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

        {error && <ErrorMessage message={error} />}

        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <LoadingState />}
            {!isLoading && todos.length === 0 && <EmptyState />}
            {!isLoading && todos.length > 0 && (
              <TodoList
                todos={todos}
                onReorder={handleReorder}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default App;
