import { getEventsByTags } from '@/lib/events';
import { Metadata } from 'next';
import Image from 'next/image';
import BookClubEventsClient from '@/components/BookClubEventsClient';

const BOOK_CLUB_TAGS = ['book-club', 'ddia'];
const DISCORD_INVITE = 'https://discord.gg/cqF9THUfnN';

export const metadata: Metadata = {
  title: 'Book Club: Designing Data-Intensive Applications | Craft & Code Club',
  description:
    'Leitura guiada da 2ª edição de "Designing Data-Intensive Applications" (DDIA), de Martin Kleppmann e Chris Riccomini. Um encontro por capítulo, em ritmo quinzenal, com discussões no Discord da comunidade.',
  keywords: [
    'Book Club',
    'Clube do Livro',
    'DDIA',
    'Designing Data-Intensive Applications',
    'Martin Kleppmann',
    'System Design',
    'Engenharia de Dados',
    'Sistemas Distribuídos',
    'Comunidade',
  ],
  openGraph: {
    title: 'Book Club: Designing Data-Intensive Applications | Craft & Code Club',
    description:
      'Leitura guiada da 2ª edição de "Designing Data-Intensive Applications" (DDIA). Um encontro por capítulo, em ritmo quinzenal.',
    images: ['/assets/book-club-ddia.png'],
  },
  twitter: {
    title: 'Book Club: Designing Data-Intensive Applications | Craft & Code Club',
    description:
      'Leitura guiada da 2ª edição de "Designing Data-Intensive Applications" (DDIA). Um encontro por capítulo, em ritmo quinzenal.',
    images: ['/assets/book-club-ddia.png'],
  },
};

export default async function BookClubPage() {
  const events = getEventsByTags(BOOK_CLUB_TAGS);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <header className="mb-12">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 mb-4">
            Book Club
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Designing Data-Intensive Applications
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Vamos ler juntos a <strong>2ª edição</strong> do clássico <em>DDIA</em>, capítulo a capítulo,
            no ritmo da comunidade. Um mergulho profundo em sistemas distribuídos confiáveis, escaláveis e fáceis de manter.
          </p>
        </header>

        <div className="mb-12 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
          <Image
            src="/assets/book-club-ddia.png"
            alt="Book Club: Designing Data-Intensive Applications"
            width={1280}
            height={720}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Sobre o livro */}
        <section className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sobre o livro</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              <strong>Designing Data-Intensive Applications</strong> (carinhosamente conhecido como{' '}
              <strong>DDIA</strong>) é uma das referências mais respeitadas sobre arquitetura de sistemas de dados.
              Escrito por <strong>Martin Kleppmann</strong>, com <strong>Chris Riccomini</strong>&nbsp;como
              coautor nesta 2ª edição, e publicado pela O&apos;Reilly, o livro explica os princípios
              fundamentais por trás de sistemas <em>confiáveis, escaláveis e fáceis de manter</em>.
            </p>
            <p>
              Ao longo dos capítulos, o livro percorre modelos de dados, armazenamento e recuperação, codificação e
              evolução de dados, replicação, particionamento (sharding), transações, os desafios dos sistemas
              distribuídos, consistência e consenso, além de processamento em batch e em streaming. É leitura
              obrigatória para quem trabalha (ou quer trabalhar) em sistemas de alta escala e dominar System Design.
            </p>
          </div>
        </section>

        {/* Como funciona */}
        <section className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Como funciona</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm font-semibold">
                1
              </span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Um encontro por capítulo.</strong> Cada sessão é dedicada a um capítulo do livro, do começo
                ao fim, na ordem da obra.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm font-semibold">
                2
              </span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Ritmo quinzenal.</strong> Os encontros acontecem a cada duas semanas, dando tempo de sobra
                para ler com calma e trocar ideias.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm font-semibold">
                3
              </span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Em ordem, do início ao fim.</strong> O primeiro encontro cobre o Capítulo 1, o segundo cobre
                o Capítulo 2, e assim por diante até concluirmos o livro.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm font-semibold">
                4
              </span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Discussão aberta.</strong> Cada sessão é uma conversa: dúvidas, experiências reais e debate
                sobre os trade-offs apresentados em cada capítulo.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-1 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-sm font-semibold">
                5
              </span>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Tudo gravado.</strong> Os encontros são gravados e, depois, publicados no{' '}
                <a
                  href="https://www.youtube.com/@CraftCodeClub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  YouTube da comunidade
                </a>.
              </p>
            </li>
          </ul>
        </section>

        {/* CTA Discord */}
        <section className="mb-12 rounded-lg bg-blue-600 dark:bg-blue-700 p-8 text-center shadow-md">
          <h2 className="text-2xl font-bold text-white mb-3">As discussões acontecem no Discord</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Toda a conversa do Book Club, antes, durante e depois dos encontros, rola no Discord da
            comunidade. Entre para acompanhar os capítulos, tirar dúvidas e não perder nenhum encontro.
          </p>
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white text-blue-700 font-medium hover:bg-blue-50 transition-colors"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Entrar no Discord da comunidade
          </a>
        </section>

        {/* Encontros */}
        <BookClubEventsClient events={events} />
      </div>
    </div>
  );
}
