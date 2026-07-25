'use client';

import type { Event } from '@/lib/events';
import { isEventPast, getEventStartTimestamp } from '@/lib/date';
import { useMemo } from 'react';
import Link from 'next/link';
import EventCard from './EventCard';

interface Props {
  events: Event[];
  pastLimit?: number;
}

export default function EventsListClient({ events, pastLimit = 6 }: Props) {
  const upcoming = useMemo(() =>
    events
      .filter(e => !isEventPast(e.date, e.time))
      .sort((a, b) => getEventStartTimestamp(a.date, a.time) - getEventStartTimestamp(b.date, b.time)),
    [events]
  );

  const past = useMemo(() =>
    events
      .filter(e => isEventPast(e.date, e.time))
      .sort((a, b) => getEventStartTimestamp(b.date, b.time) - getEventStartTimestamp(a.date, a.time))
      .slice(0, pastLimit),
    [events, pastLimit]
  );

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Próximos Eventos</h2>
        {upcoming.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {upcoming.map(event => (
              <EventCard key={event.id} event={event} isPast={false} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Nenhum evento programado. Volte em breve!</p>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Eventos Anteriores</h2>
        {past.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              {past.map(event => (
                <EventCard key={event.id} event={event} isPast />
              ))}
            </div>
            <div className="flex justify-center">
              <Link
                href="/events/past/1"
                className="text-center px-4 py-2 rounded-md transition-colors bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
              >
                Ver todos os eventos anteriores
              </Link>
            </div>
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Nenhum evento anterior para exibir.</p>
        )}
      </section>
    </div>
  );
}
