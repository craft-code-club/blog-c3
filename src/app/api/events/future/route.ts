import { NextResponse } from 'next/server';
import { getFutureEvents } from '@/lib/events';

export const dynamic = 'force-static';

export function GET() {
  const events = getFutureEvents();
  return NextResponse.json(events, {
    headers: { 'Content-Disposition': 'inline' },
  });
}
