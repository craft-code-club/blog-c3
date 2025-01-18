import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const eventsDirectory = path.join(process.cwd(), 'events');

export type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'online' | 'in-person' | 'hybrid';
  registrationLink: string;
  speakers?: string[];
}

export function getSortedEventsData(): Event[] {
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

  // Sort events by date
  return allEventsData.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    } else {
      return 1;
    }
  });
}

export async function getEventData(id: string): Promise<Event> {
  const fullPath = path.join(eventsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the event metadata section
  const matterResult = matter(fileContents);

  // Combine the data with the id
  return {
    id,
    ...(matterResult.data as Omit<Event, 'id'>),
  };
} 