import { Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Todo } from '@/types/todo';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * TodoItem Component with Drag & Drop
 * 
 * LEARNING NOTES:
 * - Displays a single todo with checkbox and delete button
 * - Uses @dnd-kit/sortable for drag and drop functionality
 * - Props pattern: parent passes data and callbacks
 * - Drag handle (grip icon) for better UX
 */

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  // Set up drag and drop with dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo._id });

  // Create CSS transform for smooth dragging
  // Disable transition during drag for better performance
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        willChange: isDragging ? 'transform' : 'auto',
      }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-md border bg-card/50 hover:bg-accent/50 transition-colors group',
        isDragging && 'opacity-50 ring-2 ring-primary cursor-grabbing'
      )}
    >
      {/* Drag handle */}
      <button
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Checkbox for completion status */}
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo._id)}
      />
      
      {/* Todo title and metadata */}
      <div className="flex-1 min-w-0 space-y-1">
        <p
          className={cn(
            'text-sm font-medium leading-none transition-all',
            todo.completed && 'line-through text-muted-foreground'
          )}
        >
          {todo.title}
        </p>
        
        {/* Created date (small text) */}
        <p className="text-xs text-muted-foreground">
          {new Date(todo.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      
      {/* Delete button - visible on hover */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo._id)}
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

