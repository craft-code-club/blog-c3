import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const eventsDirectory = path.join(process.cwd(), '_content', 'events');

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  registrationLink?: string;
  recordingLink?: string;
  postLink?: string;
  speakers?: string[];
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
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as Omit<Event, 'id'>),
    };
  });

  const today = new Date().toISOString().split('T')[0];

  // Filter events first
  const upcomingEvents = allEvents.filter(event => event.date >= today);
  const pastEvents = allEvents.filter(event => event.date < today);

  // Sort upcoming events by date (closer dates first)
  const upcoming = upcomingEvents.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Sort past events by date (most recent first)
  const past = pastEvents.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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

export function getEvent(id: string): Event | null {
  try {
    const fullPath = path.join(eventsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as Omit<Event, 'id'>),
    };
  } catch {
    return null;
  }
} 