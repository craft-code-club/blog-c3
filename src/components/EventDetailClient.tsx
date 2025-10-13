'use client';

import type { Event } from '@/lib/events';
import Image from 'next/image';
import EventCard from "./EventCard";

interface Props {
  event: Event;
  nextEvents: Event[];
}

export default function EventDetailClient({ event, nextEvents }: Props) {
  const formattedDate = new Date(`${event.date.slice(0, 10)}T${event.time.split('-')[0]}-03:00`)
    .toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

  const today = new Date().toISOString().split('T')[0];
  const isToday = event.date === today;

  const getCalendarUrl = (event: Event) => {
    const startDate = new Date(`${event.date}T${event.time.split('-')[0]}-03:00`);
    const endDate = new Date(`${event.date}T${event.time.split('-')[1]}-03:00`);

    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', event.title);
    url.searchParams.append(
      'details',
      `${event.description}${event.registrationLink ? `\n\n<a href="${event.registrationLink}">Link para o evento (${event.registrationLink})</a>` : ''}`
    );
    url.searchParams.append('location', event.location);
    url.searchParams.append(
      'dates',
      `${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0]}Z`
    );

    return url.toString();
  };

  return (
    <>
      <div className={`rounded-lg shadow-md border overflow-hidden ${
        isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}>
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <time dateTime={event.date}>{formattedDate}</time>
              <span>•</span>
              <span>{event.time}</span>
              <span>•</span>
              <span className="capitalize">{event.type}</span>
              {isToday && (
                <>
                  <span>•</span>
                  <span className="text-green-600 dark:text-green-400 font-medium animate-pulse">Acontecendo Hoje!</span>
                </>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>

            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-6">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>

            {event.banner && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <Image
                  src={event.banner}
                  alt={`Banner para ${event.title}`}
                  width={800}
                  height={320}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p>{event.description}</p>
            </div>

            {event.speakers && event.speakers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Palestrantes</h2>
                <ul className="space-y-2">
                  {event.speakers.map((speaker, index) => (
                    <li key={index} className="flex items-center text-gray-800 dark:text-gray-200">
                      <svg className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {speaker}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              {isToday ? (
                <div className="flex gap-3">
                  {event.registrationLink ? (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center text-center px-4 py-2 rounded-md transition-colors bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-medium"
                    >
                      Participar Agora
                    </a>
                  ) : (
                    <a
                      href="https://discord.gg/cqF9THUfnN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center text-center px-4 py-2 rounded-md transition-colors bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-medium"
                    >
                      Participar via Discord
                    </a>
                  )}
                  <a
                    href="https://discord.gg/cqF9THUfnN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center text-center px-4 py-2 rounded-md transition-colors bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                  >
                    Entrar no Discord
                  </a>
                </div>
              ) : new Date(event.date) > new Date() ? (
                <div className="flex gap-3">
                  <a
                    href={getCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center text-center px-4 py-2 rounded-md transition-colors bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white"
                  >
                    Adicionar ao Calendário
                  </a>
                  <a
                    href="https://discord.gg/cqF9THUfnN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center text-center px-4 py-2 rounded-md transition-colors bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                  >
                    Entrar no Discord
                  </a>
                </div>
              ) : (
                <div className="flex gap-3">
                  {event.recordingLink && (
                    <a
                      href={event.recordingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2 rounded-md transition-colors bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 text-white"
                    >
                      Assistir Gravação
                    </a>
                  )}
                  {event.postLink && (
                    <a
                      href={event.postLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-2 rounded-md transition-colors bg-purple-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                    >
                      Ler Artigo
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {nextEvents.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Próximos Eventos</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {nextEvents.map(nextEvent => (
              <EventCard key={nextEvent.id} event={nextEvent} isPast={false} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
