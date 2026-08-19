import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { resolveDiscordLinks } from './discord';
import { isEventPast, getEventStartTimestamp } from '@/lib/date';
import { absoluteUrl } from '@/lib/site';

const eventsDirectory = path.join(process.cwd(), '_content', 'events');

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
  speakers?: string[];
  tags?: string[];
}

export interface EventsData {
  upcoming: Event[];
  past: Event[];
  allEvents: Event[];
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
      ...(matterResult.data as Omit<Event, 'id'>),
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

export function getFutureEvents(): Event[] {
  const { allEvents } = getEvents();
  const cutoff = Date.now() - 12 * 60 * 60 * 1000; // now (UTC) - 12h, fixed at build time

  return allEvents
    .filter((event) => getEventStartTimestamp(event.date, event.time) >= cutoff)
    .sort((a, b) => getEventStartTimestamp(a.date, a.time) - getEventStartTimestamp(b.date, b.time))
    .map((event) => ({
      ...event,
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

export function getEvent(id: string): Event | null {
  try {
    const fullPath = path.join(eventsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(resolveDiscordLinks(fileContents));

    return {
      id,
      ...(matterResult.data as Omit<Event, 'id'>),
    };
  } catch {
    return null;
  }
} 