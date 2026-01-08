import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-500 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg hover:shadow-xl bg-blue-600 text-white hover:bg-blue-700',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl bg-red-600 text-white hover:bg-red-700',
        outline:
          'border-2 border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100 hover:border-zinc-400 border-zinc-400 bg-transparent text-white hover:bg-zinc-800 hover:border-zinc-300',
        secondary:
          'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 shadow-sm bg-zinc-700 text-white hover:bg-zinc-600',
        ghost: 'text-zinc-900 hover:bg-zinc-100 text-white hover:bg-zinc-800',
        link: 'text-zinc-900 underline-offset-4 hover:underline text-white',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
