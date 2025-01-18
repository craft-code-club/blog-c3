import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const eventsDirectory = path.join(process.cwd(), 'events');

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'online' | 'in-person' | 'hybrid';
  registrationLink: string;
  speakers?: string[];
}

export interface EventsData {
  upcoming: Event[];
  past: Event[];
}

export function getEvents(): EventsData {
  // Create events directory if it doesn't exist
  if (!fs.existsSync(eventsDirectory)) {
    fs.mkdirSync(eventsDirectory, { recursive: true });
  }

  // Get file names under /events
  const fileNames = fs.readdirSync(eventsDirectory);
  const allEventsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(eventsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the event metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as Omit<Event, 'id'>),
    };
  });

  const now = new Date();
  const upcoming = allEventsData
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = allEventsData
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Most recent first
    .slice(0, 10); // Only keep the 10 most recent past events

  return { upcoming, past };
}

export function getEvent(id: string): Event | undefined {
  try {
    const fullPath = path.join(eventsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the event metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as Omit<Event, 'id'>),
    };
  } catch {
    return undefined;
  }
} 