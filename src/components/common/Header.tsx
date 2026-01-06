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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:border-zinc-800/50 dark:bg-zinc-950/80 dark:supports-[backdrop-filter]:bg-zinc-950/70 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        {/* Logo */}
        <Link
          href="/"
          className="mr-8 flex items-center space-x-2 group transition-all duration-500 ease-in-out hover:scale-105"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9 text-zinc-900 dark:text-zinc-50"
          >
            <path
              d="M7 6 L7 26 L16 26 C22.5 26 26 22.5 26 16 C26 9.5 22.5 6 16 6 L7 6 Z M11 10 L16 10 C19.5 10 22 12.5 22 16 C22 19.5 19.5 22 16 22 L11 22 L11 10 Z"
              fill="currentColor"
            />
          </svg>
          <span className="hidden font-bold text-lg sm:inline-block bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-50 dark:to-zinc-300 bg-clip-text text-transparent">
            DOOR Protocol
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-1 text-sm font-medium flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-4 py-2 rounded-lg transition-all duration-500 ease-in-out',
                pathname === item.href
                  ? 'text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900',
              )}
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-zinc-900 dark:bg-zinc-50 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side - Theme Toggle & Connect Wallet */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-500 ease-in-out"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Connect Wallet */}
          <div className="scale-95 hover:scale-100 transition-transform duration-500 ease-in-out">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
