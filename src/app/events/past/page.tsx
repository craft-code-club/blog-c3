import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

// Esta rota só redireciona para /events/past/1. Sem isto ela herdaria o canonical
// autorreferente do layout e se declararia canônica sendo uma página vazia.
export const metadata: Metadata = {
  robots: { index: false },
  alternates: { canonical: '/events/past/1' },
};

export default function PastEventsPage() {
  redirect('/events/past/1');
}
