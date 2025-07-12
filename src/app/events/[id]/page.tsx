import type { Event } from '@/lib/events';
import { getEvent, getEvents } from '@/lib/events';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetailClient from '@/components/EventDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const { allEvents } = await getEvents();

  return allEvents.map((event: Event) => ({
    id: event.id
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const event = await getEvent(resolvedParams.id);

  if (!event) {
    return {
      title: 'Evento não encontrado | Craft & Code Club'
    };
  }

  return {
    title: `${event.title} | Craft & Code Club`,
    description: event.description,
    openGraph: {
      title: `${event.title} | Craft & Code Club`,
      description: event.description
    },
    twitter: {
      title: `${event.title} | Craft & Code Club`,
      description: event.description
    }
  };
}

export default async function EventPage({ params }: Props) {
  const resolvedParams = await params;
  const event = await getEvent(resolvedParams.id);

  if (!event) {
    notFound();
  }

  const { upcoming } = await getEvents();
  const nextEvents = upcoming.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventDetailClient event={event!} nextEvents={nextEvents} />
      </div>
    </div>
  );
}
