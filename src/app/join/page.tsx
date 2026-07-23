import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { DISCORD_INVITE_URL } from '@/lib/discord';

const TITLE = 'Entrar no Discord | Craft & Code Club';
const DESCRIPTION =
  'Convite oficial para o servidor Discord do Craft & Code Club, comunidade de engenharia de software de alto nível. Clube do livro, papos técnicos, workshops, algoritmos e system design.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/join',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: ['/logo.png'],
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    images: ['/logo.png'],
  },
};

const TAGS = [
  'Clube do Livro',
  'Papos Técnicos',
  'Workshops',
  'Algoritmos',
  'System Design',
  'AI',
  'Spec-Driven Development',
  'Engenharia de Software',
  'Alta Performance',
];

function DiscordLogo({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-2xl text-center">
        {/* Logos: Discord + comunidade */}
        <div className="flex items-center justify-center gap-5 sm:gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#5865F2] shadow-lg shadow-[#5865F2]/30">
            <DiscordLogo className="h-11 w-11 text-white" />
          </div>

          <span className="text-2xl font-light text-gray-300 dark:text-gray-600" aria-hidden="true">
            +
          </span>

          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg shadow-gray-900/10 dark:shadow-black/30">
            <Image
              src="/logo.png"
              alt="Logo do Craft & Code Club"
              width={56}
              height={56}
              priority
            />
          </div>
        </div>

        <h1 className="mt-8 text-balance text-lg font-medium text-blue-600 dark:text-blue-400 sm:text-xl">
          Engenharia de software de alto nível
        </h1>

        <a
          href={DISCORD_INVITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-[#5865F2]/30 hover:bg-[#4752C4] hover:shadow-xl hover:shadow-[#5865F2]/40 transition-all"
        >
          <DiscordLogo className="h-6 w-6" />
          Entrar no Discord
        </a>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Ao entrar, você concorda em seguir as{' '}
          <Link
            href="/codigo-conduta"
            className="underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            regras da comunidade
          </Link>
          .
        </p>

        <p className="mt-12 mx-auto max-w-xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
          Um espaço colaborativo para engenheiros de software aprenderem, trocarem
          conhecimento e evoluírem juntos. Da base, com algoritmos e estruturas de dados,
          até arquitetura de sistemas de alta performance.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
