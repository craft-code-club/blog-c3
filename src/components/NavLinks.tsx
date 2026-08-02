"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links: { href: string; label: string; highlight?: boolean }[] = [
  { href: "/blog", label: "Blog" },
  { href: "/events", label: "Eventos" },
  {
    href: "/book-clubs/designing-data-intensive-applications",
    label: "Clube do Livro",
  },
  { href: "/roadmap/dsa", label: "Roadmap DSA" },
  { href: "/about", label: "Sobre" },
  // "Apoiar" é um CTA: fica destacado em âmbar para chamar atenção.
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
      {links.map(({ href, label, highlight }) => {
        const active = isActivePath(pathname, href);

        // Desktop: traço embaixo do texto. Mobile (menu vertical): barra à esquerda.
        const accent =
          variant === "mobile" ? "border-l-2 pl-3" : "border-b-2 py-1";

        // "Apoiar" é destacado em âmbar (CTA), ativo ou não. Os demais seguem o azul.
        const state = highlight
          ? active
            ? "text-amber-600 dark:text-amber-400 border-amber-500 dark:border-amber-400 font-semibold"
            : "text-amber-600 dark:text-amber-400 border-transparent hover:text-amber-700 dark:hover:text-amber-300 font-semibold"
          : active
            ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
            : "text-gray-600 dark:text-gray-300 border-transparent hover:text-blue-600 dark:hover:text-blue-400";

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`font-medium whitespace-nowrap transition-colors ${accent} ${state}`}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
