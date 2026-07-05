'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/blog', label: 'Blog' },
  { href: '/events', label: 'Eventos' },
  { href: '/book-club/designing-data-intensive-applications', label: 'Clube do Livro' },
  { href: '/roadmap/dsa', label: 'Roadmap DSA' },
  { href: '/about', label: 'Sobre' },
];

// Ativo na própria rota e em qualquer sub-rota (ex.: /blog/algum-post destaca "Blog").
function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label }) => {
        const active = isActivePath(pathname, href);

        // Desktop: traço embaixo do texto. Mobile (menu vertical): barra à esquerda.
        const accent =
          variant === 'mobile' ? 'border-l-2 pl-3' : 'border-b-2 py-1';

        const state = active
          ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
          : 'text-gray-600 dark:text-gray-300 border-transparent hover:text-blue-600 dark:hover:text-blue-400';

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`font-medium transition-colors ${accent} ${state}`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
