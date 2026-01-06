import Link from 'next/link';

const footerLinks = {
  Protocol: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Deposit', href: '/deposit' },
    { label: 'Analytics', href: '/analytics' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'Discord', href: '#' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 md:gap-x-12 md:grid-cols-6">
          {/* Brand */}
          <div className="space-y-3 text-center md:text-left md:col-span-3">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-zinc-900 dark:text-zinc-50"
              >
                <path
                  d="M7 6 L7 26 L16 26 C22.5 26 26 22.5 26 16 C26 9.5 22.5 6 16 6 L7 6 Z M11 10 L16 10 C19.5 10 22 12.5 22 16 C22 19.5 19.5 22 16 22 L11 22 L11 10 Z"
                  fill="currentColor"
                />
              </svg>
              <span className="font-bold">DOOR Protocol</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm md:max-w-none">
              Opening the door to DeFi fixed income. Decentralized Offered Rate
              infrastructure powered by Mantle.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div
              key={category}
              className="space-y-3 text-center md:text-left md:col-span-1"
            >
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span>Powered by Treehouse DOR</span>
              <span>•</span>
              <span>Secured by RWA</span>
              <span>•</span>
              <span>Built on Mantle</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              © 2026 DOOR Protocol. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
