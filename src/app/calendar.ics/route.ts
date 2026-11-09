import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/events';
import { buildEventsCalendar } from '@/lib/calendar';

export const dynamic = 'force-static';

// Vira o arquivo estático `out/calendar.ics` no build. Os headers abaixo valem
// no `next dev`; em produção o Content-Type vem do servidor estático, pela
// extensão do arquivo.
export function GET() {
  const { allEvents } = getEvents();
  return new NextResponse(buildEventsCalendar(allEvents), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="craft-code-club.ics"',
    },
  });
}
