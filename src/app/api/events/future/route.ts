import { getFutureEvents } from '@/lib/events';

export const dynamic = 'force-static';

export function GET() {
  const events = getFutureEvents();
  return new Response(JSON.stringify(events, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
