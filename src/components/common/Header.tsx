'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Deposit', href: '/deposit' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Analytics', href: '/analytics' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 group transition-all duration-500 ease-in-out hover:scale-105 flex-shrink-0"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-zinc-900"
          >
            <path
              d="M7 6 L7 26 L16 26 C22.5 26 26 22.5 26 16 C26 9.5 22.5 6 16 6 L7 6 Z M11 10 L16 10 C19.5 10 22 12.5 22 16 C22 19.5 19.5 22 16 22 L11 22 L11 10 Z"
              fill="currentColor"
            />
          </svg>
          <span className="hidden md:inline-block font-bold text-lg text-zinc-900 whitespace-nowrap">
            DOOR Protocol
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-3 py-2 rounded-lg transition-all duration-500 ease-in-out whitespace-nowrap',
                pathname === item.href
                  ? 'text-zinc-900 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
              )}
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-zinc-900 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side - Theme Toggle & Connect Wallet */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // TODO: Implement theme toggle
            }}
            aria-label="Toggle theme"
            className="rounded-lg hover:bg-zinc-100 transition-all duration-500 ease-in-out"
          >
            <Sun className="h-5 w-5 text-amber-500" />
          </Button>

          {/* Connect Wallet - Hidden on smallest screens */}
          <div className="hidden sm:block scale-95 hover:scale-100 transition-transform duration-500 ease-in-out">
            <ConnectButton />
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="lg:hidden rounded-lg hover:bg-zinc-100 transition-all duration-500 ease-in-out"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-zinc-900" />
            ) : (
              <Menu className="h-5 w-5 text-zinc-900" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200/50 bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg transition-all duration-500 ease-in-out',
                  pathname === item.href
                    ? 'bg-zinc-100 text-zinc-900 font-semibold'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
                )}
              >
                {item.label}
              </Link>
            ))}
            {/* Connect Wallet in mobile menu */}
            <div className="sm:hidden pt-2 border-t border-zinc-200/50">
              <ConnectButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
