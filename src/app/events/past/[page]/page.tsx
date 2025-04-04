import { getPaginatedPastEvents, getEvents } from '@/lib/events';
import type { Event } from '@/lib/events';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ page: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const pageNumber = parseInt(resolvedParams.page, 10);
  
  return {
    title: `Eventos Anteriores - Página ${pageNumber} | Craft & Code Club`,
    description: "Veja todos os eventos anteriores do Craft & Code Club sobre engenharia de software, System Design, Algoritmos, e muito mais.",
  };
}

export async function generateStaticParams() {
  // Calculate total number of pages
  const { past } = await getEvents();
  const totalPages = Math.ceil(past.length / 20);
  
  // Generate params for each page number
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1)
  }));
}

export default async function PastEventsPage({ params }: Props) {
  const resolvedParams = await params;
  const currentPage = parseInt(resolvedParams.page, 10);
  
  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }
  
  const { events, total, totalPages } = await getPaginatedPastEvents(currentPage);
  
  // If requesting a page that doesn't exist
  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }
  
  const EventCard = ({ event }: { event: Event }) => {
    return (
      <article className="flex flex-col h-full rounded-lg shadow-sm border overflow-hidden transition-all hover:shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 hover:border-blue-200 dark:hover:border-blue-800">
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <time dateTime={event.date}>{new Date(event.date).toLocaleDateString('pt-BR')}</time>
            <span>•</span>
            <span>{event.time}</span>
            <span>•</span>
            <span className="capitalize">{event.type}</span>
          </div>
          
          <Link href={`/events/${event.id}`} className="group">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400">{event.title}</h3>
          </Link>
          
          <div className="flex-grow flex flex-col">
            <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>
            
            <div className="mt-auto space-y-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
              
              {event.speakers && event.speakers.length > 0 && (
                <div className="space-y-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">Palestrantes:</h4>
                  <ul className="space-y-1">
                    {event.speakers.map((speaker, index) => (
                      <li key={index} className="text-gray-600 dark:text-gray-300">{speaker}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0 mt-auto space-y-3">
          <div className="flex gap-3">
            <Link
              href={`/events/${event.id}`}
              className="flex-1 text-center px-4 py-2 rounded-md transition-colors bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              Ver Detalhes
            </Link>
            {event.recordingLink && (
              <a
                href={event.recordingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-2 rounded-md transition-colors bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white"
              >
                Assistir Gravação
              </a>
            )}
          </div>
        </div>
      </article>
    );
  };

  const Pagination = ({ currentPage, totalPages }: { currentPage: number, totalPages: number }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    // Show at most 5 page numbers, with ellipsis for the rest
    let pagesToShow: (number | string)[] = pages;
    if (totalPages > 7) {
      if (currentPage <= 3) {
        pagesToShow = [...pages.slice(0, 5), '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pagesToShow = [1, '...', ...pages.slice(totalPages - 5)];
      } else {
        pagesToShow = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    
    return (
      <nav className="flex justify-center mt-8">
        <ul className="flex items-center gap-1">
          {currentPage > 1 && (
            <li>
              <Link
                href={`/events/past/${currentPage - 1}`}
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                &laquo;
              </Link>
            </li>
          )}
          
          {pagesToShow.map((page, index) => (
            page === '...' ? (
              <li key={`ellipsis-${index}`} className="px-3 py-2 text-gray-600 dark:text-gray-400">
                ...
              </li>
            ) : (
              <li key={page}>
                <Link
                  href={`/events/past/${page}`}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {page}
                </Link>
              </li>
            )
          ))}
          
          {currentPage < totalPages && (
            <li>
              <Link
                href={`/events/past/${currentPage + 1}`}
                className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                &raquo;
              </Link>
            </li>
          )}
        </ul>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Eventos Anteriores 
            <span className="text-gray-500 dark:text-gray-400 text-lg font-normal ml-3">
              ({total} eventos)
            </span>
          </h1>
          <Link
            href="/events"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para Eventos
          </Link>
        </div>
        
        {events.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Nenhum evento anterior para exibir.</p>
        )}
      </div>
    </div>
  );
} 