'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Deposit', href: '/deposit' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Analytics', href: '/analytics' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-50">
            <span className="text-xl font-bold text-zinc-50 dark:text-zinc-900">
              🚪
            </span>
          </div>
          <span className="hidden font-bold sm:inline-block">
            DOOR Protocol
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-zinc-900 dark:hover:text-zinc-50',
                pathname === item.href
                  ? 'text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-600 dark:text-zinc-400',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side - Theme Toggle & Connect Wallet */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Connect Wallet */}
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
