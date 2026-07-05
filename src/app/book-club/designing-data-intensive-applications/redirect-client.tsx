'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookClubRedirectClient() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/book-clubs/designing-data-intensive-applications');
  }, [router]);

  return (
    <p className="p-8 text-center text-gray-600 dark:text-gray-300">
      Redirecionando...{' '}
      <a
        href="/book-clubs/designing-data-intensive-applications"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        Clique aqui
      </a>{' '}
      se não for redirecionado automaticamente.
    </p>
  );
}
