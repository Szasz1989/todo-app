import { Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Todo } from '@/types/todo';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo._id });

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
      <button
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo._id)}
      />
      
      <div className="flex-1 min-w-0 space-y-1">
        <p
          className={cn(
            'text-sm font-medium leading-none transition-all',
            todo.completed && 'line-through text-muted-foreground'
          )}
        >
          {todo.title}
        </p>
        
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
