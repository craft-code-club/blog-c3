'use client';

import type { Event } from '@/lib/events';
import { useMemo } from 'react';
import EventCard from './EventCard';

interface Props {
  events: Event[];
}

export default function BookClubEventsClient({ events }: Props) {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Next encounters: closest date first
  const upcoming = useMemo(() =>
    events
      .filter(e => e.date >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [events, today]
  );

  // Past encounters: most recent first
  const past = useMemo(() =>
    events
      .filter(e => e.date < today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [events, today]
  );

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Próximos Encontros</h2>
        {upcoming.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {upcoming.map(event => (
              <EventCard key={event.id} event={event} isPast={false} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            Nenhum encontro agendado no momento. Fique de olho e entre no Discord para não perder o próximo!
          </p>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Encontros Anteriores</h2>
        {past.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {past.map(event => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Ainda não houve encontros. O primeiro está chegando!</p>
        )}
      </section>
    </div>
  );
}
