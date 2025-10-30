import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * 
 * LEARNING NOTES:
 * - clsx: combines class names conditionally
 * - twMerge: intelligently merges Tailwind classes (removes conflicts)
 * - This is used by all shadcn/ui components
 * 
 * Example:
 * cn('p-4', 'p-2') => 'p-2' (last one wins, no conflict)
 * cn('text-red-500', condition && 'text-blue-500') => conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


