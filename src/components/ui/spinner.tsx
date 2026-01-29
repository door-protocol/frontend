import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function Spinner({ className, size = 'sm' }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin', sizeMap[size], className)}
      aria-label="Loading"
    />
  );
}
