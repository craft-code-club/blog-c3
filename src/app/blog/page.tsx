import { getPaginatedPosts } from '@/lib/posts';
import { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

export const metadata: Metadata = {
  title: "Blog",
  description: "Artigos sobre engenharia de software, System Design, Algoritmos, Estruturas de dados, DDD, melhores práticas e aprendizados da comunidade.",
  keywords: ["Blog", "Artigos", "Desenvolvimento de Software", "Engenharia de Software", "System Design", "Algoritmos", "DDD"],
};

export default function BlogPage() {
  const { posts, totalPages } = getPaginatedPosts(1);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Artigos sobre artesanato de software, melhores práticas e aprendizados da comunidade.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <Pagination currentPage={1} totalPages={totalPages} basePath="/blog" />
      </div>
    </div>
  );
}
