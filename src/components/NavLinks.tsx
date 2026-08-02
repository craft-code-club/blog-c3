"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
  external?: boolean;
  highlight?: boolean;
};

const links: NavLink[] = [
  { href: "/blog", label: "Blog" },
  { href: "/events", label: "Eventos" },
  {
    href: "/book-clubs/designing-data-intensive-applications",
    label: "Clube do Livro",
  },
  { href: "https://dsa.craftcodeclub.io/", label: "Roadmap DSA", external: true },
  { href: "/about", label: "Sobre" },
  // "Apoiar" é um CTA: fica destacado no azul do site para chamar atenção.
  { href: "/apoiar", label: "Apoiar", highlight: true },
];

// Ativo na própria rota e em qualquer sub-rota (ex.: /blog/algum-post destaca "Blog").
function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label, external, highlight }) => {
        // Link externo nunca marca rota ativa: o href não é uma rota do site.
        const active = !external && isActivePath(pathname, href);

        // Desktop: traço embaixo do texto. Mobile (menu vertical): barra à esquerda.
        const accent =
          variant === "mobile" ? "border-l-2 pl-3" : "border-b-2 py-1";

        // "Apoiar" é o CTA: usa o azul de destaque do site + negrito, ativo ou não.
        // Os demais itens ficam cinza e só viram azul quando ativos.
        const state = highlight
          ? active
            ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 font-semibold"
            : "text-blue-600 dark:text-blue-400 border-transparent hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
          : active
            ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
            : "text-gray-600 dark:text-gray-300 border-transparent hover:text-blue-600 dark:hover:text-blue-400";

        const className = `font-medium whitespace-nowrap transition-colors ${accent} ${state}`;

        // Links externos usam <a> puro, como no resto do site (ex.: footer do layout).
        if (external) {
          return (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {label}
            </a>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={className}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
