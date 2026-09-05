import { getPaginatedPosts } from '@/lib/posts';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

type Props = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  const { totalPages } = getPaginatedPosts(1);

  // Pre-render every page. Page 1 redirects to the canonical /blog (see below);
  // it is kept in the params so output: export always has at least one path.
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;

  return {
    title: `Blog - Página ${page}`,
    description: "Artigos sobre engenharia de software, System Design, Algoritmos, Estruturas de dados, DDD, melhores práticas e aprendizados da comunidade.",
  };
}

export default async function BlogPaginatedPage({ params }: Props) {
  const { page } = await params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  // Page 1 lives at the canonical /blog URL.
  if (currentPage === 1) {
    redirect('/blog');
  }

  const { posts, totalPages } = getPaginatedPosts(currentPage);

  if (currentPage > totalPages) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
      </div>
    </div>
  );
}
