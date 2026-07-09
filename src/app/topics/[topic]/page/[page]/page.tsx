import { getPaginatedPostsByTopic, getSortedPostsData, POSTS_PER_PAGE } from '@/lib/posts';
import { getSortedTopicList, getTopicBySlug } from '@/lib/topics';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';

interface Props {
  params: Promise<{ topic: string; page: string }>;
}

export function generateStaticParams() {
  const params: { topic: string; page: string }[] = [];

  // Read/parse all posts once, then derive per-topic page counts in memory,
  // instead of re-reading the whole posts directory for every topic.
  const allPosts = getSortedPostsData();

  for (const topic of getSortedTopicList()) {
    const count = allPosts.filter((post) => post.topics.some((t) => t.key === topic.key)).length;
    const totalPages = Math.max(1, Math.ceil(count / POSTS_PER_PAGE));
    // Pre-render every page. Page 1 redirects to /topics/[topic] (see below);
    // it is kept in the params so output: export always has at least one path.
    for (let page = 1; page <= totalPages; page++) {
      params.push({ topic: topic.slug, page: String(page) });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug, page } = await params;
  const topic = getTopicBySlug(topicSlug);
  const topicTitle = topic.name;
  const topicDescription = topic.description ?? `Artigos e recursos sobre ${topicTitle} da comunidade Craft & Code Club.`;

  return {
    title: `${topicTitle} - Página ${page} | Craft & Code Club`,
    description: topicDescription,
    openGraph: {
      title: `${topicTitle} - Página ${page} | Craft & Code Club`,
      description: topicDescription,
    },
    twitter: {
      title: `${topicTitle} - Página ${page} | Craft & Code Club`,
      description: topicDescription,
    }
  };
}

export default async function TopicPaginatedPage({ params }: Props) {
  const { topic: topicSlug, page } = await params;
  const currentPage = parseInt(page, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  // Page 1 lives at the canonical /topics/[topic] URL.
  if (currentPage === 1) {
    redirect(`/topics/${topicSlug}`);
  }

  const topic = getTopicBySlug(topicSlug);
  const { posts, totalPages } = getPaginatedPostsByTopic(topic.key, currentPage);

  if (currentPage > totalPages) {
    notFound();
  }

  const topicTitle = topic.name;

  return (
    <div className="bg-white dark:bg-gray-900 mb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{topicTitle}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/topics/${topic.slug}`} />
      </div>
    </div>
  );
}
