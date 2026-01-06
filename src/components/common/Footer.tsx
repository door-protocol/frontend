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
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-50">
                <span className="text-xl font-bold text-zinc-50 dark:text-zinc-900">
                  🚪
                </span>
              </div>
              <span className="font-bold">DOOR Protocol</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Opening the door to DeFi fixed income. Decentralized Offered Rate
              infrastructure powered by Mantle.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-sm font-semibold">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
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
        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © 2026 DOOR Protocol. Built with ❤️ on Mantle.
            </p>
            <div className="flex items-center space-x-4 text-sm text-zinc-600 dark:text-zinc-400">
              <span>Powered by Treehouse DOR</span>
              <span>•</span>
              <span>Secured by RWA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
