import Link from 'next/link';

interface Props {
  currentPage: number;
  totalPages: number;
  // Base path of the listing. Page 1 lives at `basePath` (the canonical URL);
  // subsequent pages live at `${basePath}/page/${n}`.
  // e.g. basePath="/blog" -> "/blog", "/blog/page/2"
  //      basePath="/topics/algoritmos" -> "/topics/algoritmos", "/topics/algoritmos/page/2"
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (page: number) => (page <= 1 ? basePath : `${basePath}/page/${page}`);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show at most 5 page numbers, collapsing the rest into ellipses.
  let pagesToShow: (number | string)[] = pages;
  if (totalPages > 7) {
    if (currentPage <= 3) {
      pagesToShow = [...pages.slice(0, 5), '...', totalPages];
    } else if (currentPage >= totalPages - 2) {
      pagesToShow = [1, '...', ...pages.slice(totalPages - 5)];
    } else {
      pagesToShow = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  }

  return (
    <nav className="flex justify-center mt-12" aria-label="Paginação">
      <ul className="flex items-center gap-1">
        {currentPage > 1 && (
          <li>
            <Link
              href={hrefFor(currentPage - 1)}
              aria-label="Página anterior"
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              &laquo;
            </Link>
          </li>
        )}

        {pagesToShow.map((page, index) =>
          page === '...' ? (
            <li key={`ellipsis-${index}`} className="px-3 py-2 text-gray-600 dark:text-gray-400">
              ...
            </li>
          ) : (
            <li key={page}>
              <Link
                href={hrefFor(page as number)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`px-3 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </Link>
            </li>
          )
        )}

        {currentPage < totalPages && (
          <li>
            <Link
              href={hrefFor(currentPage + 1)}
              aria-label="Próxima página"
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              &raquo;
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
