import { CheckSquare } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">What Todo</h1>
            <p className="text-sm text-muted-foreground">
              For people with dementia like me :D
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

