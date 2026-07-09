import type { BlogPost } from '@/lib/posts';
import Link from 'next/link';
import ArrowIcon from './ArrowIcon';
import TopicTags from './TopicTags';

interface Props {
  post: Omit<BlogPost, 'contentHtml'>;
}

export default function PostCard({ post }: Props) {
  const href = `/posts/${encodeURIComponent(post.id)}`;

  return (
    <article className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
          </time>
        </div>
        <TopicTags topics={post.topics} />
        <Link href={href}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {post.title}
          </h2>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
        <Link
          href={href}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Ler mais
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}
