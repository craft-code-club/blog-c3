import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';
import { resolveDiscordLinks } from './discord';
import { isEventPast, getEventStartTimestamp } from '@/lib/date';
import { absoluteUrl } from '@/lib/site';
import { markdownToHtml } from '@/lib/markdown';

const eventsDirectory = path.join(process.cwd(), '_content', 'events');

/**
 * No frontmatter, cada item de `speakers` é só o nome ou `{ name, link }`. O
 * `link` vira o link do nome na página do evento. Dentro do código, o
 * palestrante é sempre o objeto.
 */
const SpeakersSchema = z.array(
  z
    .union([
      z.string().min(1),
      z.object({
        name: z.string().min(1),
        link: z.url({ protocol: /^https?$/ }).optional(),
      }),
    ])
    .transform((speaker) => (typeof speaker === 'string' ? { name: speaker } : speaker)),
);

export type Speaker = z.output<typeof SpeakersSchema>[number];

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  banner?: string;
  registrationLink?: string;
  recordingLink?: string;
  postLink?: string;
  excalidrawLink?: string;
  speakers?: Speaker[];
  tags?: string[];
}

/**
 * O evento como sai em `/api/events/future`. Os palestrantes saem só com o
 * nome, como a API sempre devolveu, para não quebrar o bot do Discord.
 */
export type ApiEvent = Omit<Event, 'speakers'> & { speakers?: string[] };

/**
 * O evento da página de detalhe. O corpo do Markdown é opcional: quando o
 * arquivo tem corpo, ele vira o conteúdo do detalhe e a `description` fica só
 * para a listagem e o SEO. Sem corpo, `contentHtml` não existe e o detalhe
 * mostra a `description`.
 */
export interface EventDetail extends Event {
  contentHtml?: string;
}

export interface EventsData {
  upcoming: Event[];
  past: Event[];
  allEvents: Event[];
}

/**
 * Os campos do frontmatter, com os palestrantes normalizados. Palestrante
 * inválido quebra o build, com o nome do arquivo na mensagem.
 */
function parseFrontmatter(id: string, data: Record<string, unknown>): Omit<Event, 'id'> {
  const fields = data as Omit<Event, 'id'>;
  if (data.speakers === undefined) return fields;

  const speakers = SpeakersSchema.safeParse(data.speakers);
  if (!speakers.success) {
    throw new Error(`_content/events/${id}.md: speakers inválido\n${z.prettifyError(speakers.error)}`);
  }
  return { ...fields, speakers: speakers.data };
}

export function getEvents(pastLimit?: number): EventsData {
  const fileNames = fs.readdirSync(eventsDirectory);
  const allEvents = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(eventsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(resolveDiscordLinks(fileContents));

    return {
      id,
      ...parseFrontmatter(id, matterResult.data),
    };
  });

  // Filter events first, considering the event's end time (not just its date)
  const upcomingEvents = allEvents.filter(event => !isEventPast(event.date, event.time));
  const pastEvents = allEvents.filter(event => isEventPast(event.date, event.time));

  // Sort upcoming events by start instant (closer first)
  const upcoming = upcomingEvents.sort((a, b) => {
    return getEventStartTimestamp(a.date, a.time) - getEventStartTimestamp(b.date, b.time);
  });

  // Sort past events by start instant (most recent first)
  const past = pastEvents.sort((a, b) => {
    return getEventStartTimestamp(b.date, b.time) - getEventStartTimestamp(a.date, a.time);
  });

  return {
    upcoming,
    past: pastLimit ? past.slice(0, pastLimit) : past,
    allEvents,
  };
}

export function getPaginatedPastEvents(page: number = 1, limit: number = 20): { events: Event[], total: number, totalPages: number } {
  const { past } = getEvents();
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedEvents = past.slice(startIndex, endIndex);
  const totalPages = Math.ceil(past.length / limit);
  
  return {
    events: paginatedEvents,
    total: past.length,
    totalPages
  };
}

export function getFutureEvents(): ApiEvent[] {
  const { allEvents } = getEvents();
  const cutoff = Date.now() - 12 * 60 * 60 * 1000; // now (UTC) - 12h, fixed at build time

  return allEvents
    .filter((event) => getEventStartTimestamp(event.date, event.time) >= cutoff)
    .sort((a, b) => getEventStartTimestamp(a.date, a.time) - getEventStartTimestamp(b.date, b.time))
    .map(({ speakers, ...event }) => ({
      ...event,
      ...(speakers && { speakers: speakers.map((speaker) => speaker.name) }),
      ...(event.registrationLink && { registrationLink: absoluteUrl(event.registrationLink) }),
      ...(event.banner && { banner: absoluteUrl(`/events/${event.banner}`) }),
    }));
}

export function getEventsByTags(tags: string[]): Event[] {
  const { allEvents } = getEvents();
  const wanted = tags.map(tag => tag.toLowerCase());

  return allEvents.filter(event => {
    const eventTags = (event.tags ?? []).map(tag => tag.toLowerCase());
    return wanted.every(tag => eventTags.includes(tag));
  });
}

export async function getEvent(id: string): Promise<EventDetail | null> {
  let fileContents: string;
  try {
    fileContents = fs.readFileSync(path.join(eventsDirectory, `${id}.md`), 'utf8');
  } catch {
    return null;
  }

  // Só o arquivo inexistente vira 404. Erro de parse ou de renderização tem
  // que quebrar o build, senão a página do evento some do export sem aviso.
  const matterResult = matter(resolveDiscordLinks(fileContents));
  const contentHtml = await markdownToHtml(matterResult.content);
  // Corpo que não gera HTML (vazio, ou só um comentário `[//]: #`) conta como sem corpo.
  const hasContent = contentHtml.trim() !== '';

  return {
    id,
    ...parseFrontmatter(id, matterResult.data),
    ...(hasContent && { contentHtml }),
  };
} 