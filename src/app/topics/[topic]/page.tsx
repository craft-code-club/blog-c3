import {getSortedPostsData, formatTopicDisplay, getAllTopics} from '@/lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopicTags from '@/components/TopicTags';

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    topic: topic.replace(/\s+/g, '-').toLowerCase(),
  }));
}


export default async function TopicPage({ params }: Props) {
  const resolvedParams = await params;
  const allPosts = getSortedPostsData();
  const posts = allPosts.filter(post => post.topics.includes(resolvedParams.topic));
  const topicTitle = resolvedParams.topic.charAt(0).toUpperCase() + resolvedParams.topic.slice(1).replace(/-/g, ' ');

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{topicTitle}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Artigos relacionados a {topicTitle.toLowerCase()}.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => {
            const { visibleTopics, hiddenTopics, hasHidden } = formatTopicDisplay(post.topics);
            
            return (
              <article key={post.id} className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                  <TopicTags 
                    visibleTopics={visibleTopics}
                    hiddenTopics={hiddenTopics}
                    hasHidden={hasHidden}
                  />
                  <Link href={`/posts/${post.id}`}>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
                  <Link 
                    href={`/posts/${post.id}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Ler mais
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
} 