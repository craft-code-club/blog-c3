import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white dark:bg-gray-900 flex items-center justify-center px-4 mt-20 mb-20">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Página não encontrada
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
} 