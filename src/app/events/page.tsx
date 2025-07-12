import { getEvents } from '@/lib/events';
import { Metadata } from 'next';
import EventsListClient from '@/components/EventsListClient';

export const metadata: Metadata = {
  title: 'Eventos | Craft & Code Club',
  description:
    'Participe dos nossos encontros sobre engenharia de software, System Design, Algoritmos, e muito mais.',
  keywords: [
    'Eventos',
    'Workshops',
    'Meetups',
    'Comunidade',
    'Desenvolvimento de Software',
    'Algoritmos',
    'Estruturas de Dados',
    'System Design',
    'DDD'
  ],
  openGraph: {
    title: 'Eventos | Craft & Code Club',
    description:
      'Participe dos nossos encontros sobre engenharia de software, System Design, Algoritmos, e muito mais.'
  },
  twitter: {
    title: 'Eventos | Craft & Code Club',
    description:
      'Participe dos nossos encontros sobre engenharia de software, System Design, Algoritmos, e muito mais.'
  }
};

export default async function EventsPage() {
  const { allEvents } = await getEvents();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventsListClient events={allEvents} pastLimit={6} />
      </div>
    </div>
  );
}
