'use client';

import type { Event } from '@/lib/events';
import { isEventPast, getEventStartTimestamp } from '@/lib/date';
import { useMemo } from 'react';
import Link from 'next/link';
import EventCard from './EventCard';

interface Props {
  // Pass the FULL upcoming list (not pre-sliced): events that have passed since
  // the static build are filtered out here, and the client backfills up to
  // `limit` from what remains. Pre-slicing on the server would show fewer.
  events: Event[];
  limit?: number;
}

export default function UpcomingEventsHome({ events, limit = 2 }: Props) {
  const upcoming = useMemo(() =>
    events
      .filter(e => !isEventPast(e.date, e.time))
      .sort((a, b) => getEventStartTimestamp(a.date, a.time) - getEventStartTimestamp(b.date, b.time))
      .slice(0, limit),
    [events, limit]
  );

  if (upcoming.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Próximos Eventos
          </h2>
        </div>
        <div className="mt-10">
          {upcoming.length === 1 ? (
            <EventCard
              event={upcoming[0]}
              isPast={false}
              compact={true}
              featured={true}
            />
          ) : (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
              {upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isPast={false}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/events"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Ver todos os eventos →
          </Link>
        </div>
      </div>
    </div>
  );
}
