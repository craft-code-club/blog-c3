import Link from 'next/link';

export default function BlogPaginatedNotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Página não encontrada</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Esta página do blog não existe. Talvez você tenha passado da última página.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Voltar para o Blog
        </Link>
      </div>
    </div>
  );
}
