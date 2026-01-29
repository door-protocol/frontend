import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  Protocol: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Deposit', href: '/deposit' },
    { label: 'Analytics', href: '/analytics' },
  ],
  Resources: [
    {
      label: 'Documentation',
      href: 'https://github.com/door-protocol/.github',
    },
    { label: 'GitHub', href: 'https://github.com/door-protocol' },
    { label: 'X (Twitter)', href: 'https://x.com/door_protocol' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 md:gap-x-12 md:grid-cols-5">
          {/* Brand */}
          <div className="space-y-3 text-center md:text-left md:col-span-3">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Image
                src="/door-logo.webp"
                alt="DOOR Protocol Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-bold text-foreground">DOOR Protocol</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm md:max-w-none">
              Structured DeFi product with waterfall distribution. Risk-adjusted
              yields through dual-tranche architecture on Mantle Network.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div
              key={category}
              className="space-y-3 text-center md:text-left md:col-span-1"
            >
              <h4 className="text-sm font-semibold text-foreground">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t pt-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Powered by DOOR Rate Oracle</span>
              <span>•</span>
              <span>Secured by RWA</span>
              <span>•</span>
              <span>Built on Mantle</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 DOOR Protocol. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
