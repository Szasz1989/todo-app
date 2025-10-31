import { ListTodo } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
      <p className="text-sm text-muted-foreground">
        Get started by adding your first task above.
      </p>
    </div>
  );
}

