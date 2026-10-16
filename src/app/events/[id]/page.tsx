import type { Event } from '@/lib/events';
import { getEvent, getEvents } from '@/lib/events';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetailClient from '@/components/EventDetailClient';
import { buildKeywords, DEFAULT_EVENT_KEYWORDS, OG_DEFAULTS } from '@/lib/seo';
// O corpo do evento em Markdown usa os mesmos estilos de código dos posts.
import '@/assets/code-stackoverflow-dark.css';
import '@/assets/inline-code.css';

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
      title: 'Evento não encontrado'
    };
  }

  return {
    title: event.title,
    description: event.description,
    keywords: buildKeywords(event.tags ?? [], DEFAULT_EVENT_KEYWORDS),
    // O banner vira o card do link no WhatsApp, LinkedIn e X. O Next copia as
    // imagens do Open Graph para o card do Twitter, já como summary_large_image.
    openGraph: {
      ...OG_DEFAULTS,
      ...(event.banner && { images: [`/events/${event.banner}`] }),
    },
  };
}

export default async function EventPage({ params }: Props) {
  const resolvedParams = await params;
  const event = await getEvent(resolvedParams.id);

  if (!event) {
    notFound();
  }

  const { upcoming } = await getEvents();
  const nextEvents = upcoming.filter((upcomingEvent) => upcomingEvent.id !== event!.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EventDetailClient event={event!} nextEvents={nextEvents} />
      </div>
    </div>
  );
}
