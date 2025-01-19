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
  registrationLink: string;
  speakers?: string[];
}

export interface EventsData {
  upcoming: Event[];
  past: Event[];
}

export function getEvents(): EventsData {
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
    past,
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