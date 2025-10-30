import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * AddTodoForm Component
 * 
 * LEARNING NOTES:
 * - Controlled form component (React manages the input value)
 * - useState hook stores the input text
 * - Form submission prevents default page reload
 * - Clears input after successful submission
 */

interface AddTodoFormProps {
  onAdd: (title: string) => Promise<void>;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  // Local state for input value
  const [title, setTitle] = useState('');
  
  // Loading state while creating todo
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Handle form submission
   * 
   * LEARNING:
   * - e.preventDefault() stops page reload
   * - Validates input before calling parent callback
   * - Resets form after success
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate: don't submit empty todos
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    
    try {
      setIsLoading(true);
      
      // Already uppercase from input onChange
      await onAdd(trimmedTitle);
      
      // Clear input on success
      setTitle('');
    } catch (error) {
      // Error is logged in API layer
      // Could show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value.toUpperCase())}
        disabled={isLoading}
        className="flex-1 text-uppercase"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !title.trim()}
        variant="secondary"
        className="px-6"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </form>
  );
}

