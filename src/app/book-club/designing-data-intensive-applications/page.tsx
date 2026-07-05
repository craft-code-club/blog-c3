import type { Metadata } from 'next';
import BookClubRedirectClient from './redirect-client';

export const metadata: Metadata = {
  robots: { index: false },
  alternates: {
    canonical: '/book-clubs/designing-data-intensive-applications',
  },
};

export default function BookClubLegacyPage() {
  return <BookClubRedirectClient />;
}
