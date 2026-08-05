import { getPaginatedPostsByTopic } from '@/lib/posts';
import { getSortedTopicList, getTopicBySlug } from '@/lib/topics';
import { Metadata } from 'next';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import DsaPlatformCallout from '@/components/DsaPlatformCallout';
import { getDsaLinkForSiteTopic } from '@/lib/dsa-platform';

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return getSortedTopicList().map((topic) => ({
    topic: topic.slug
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const topic = getTopicBySlug(resolvedParams.topic);
  const topicTitle = topic.name;
  const topicDescription = topic.description ?? `Artigos e recursos sobre ${topicTitle} da comunidade Craft & Code Club.`;
  const topicKeywords = [topicTitle, "Desenvolvimento de Software", "Desenvolvimento", "Software", "Aprendizado", "Comunidade", "Algoritmos", "Estruturas de Dados", "System Design", "DDD"];

  return {
    title: `${topicTitle} | Craft & Code Club`,
    description: topicDescription,
    keywords: topicKeywords,
    openGraph: {
      title: `${topicTitle} | Craft & Code Club`,
      description: topicDescription,
    },
    twitter: {
      title: `${topicTitle} | Craft & Code Club`,
      description: topicDescription,
    }
  };
}

export default async function TopicPage({ params }: Props) {
  const resolvedParams = await params;

  const topic = getTopicBySlug(resolvedParams.topic);
  const { posts, totalPages } = getPaginatedPostsByTopic(topic.key, 1);
  const topicTitle = topic.name;
  const topicDescription = topic.description ?? `Artigos e recursos sobre ${topicTitle} da comunidade Craft & Code Club.`;
  // Tópicos de algoritmos existem dos dois lados: aqui é o arquivo de artigos e
  // encontros, na plataforma é o material de estudo. O link deixa a divisão
  // explícita para quem lê e para o buscador.
  const dsaLink = getDsaLinkForSiteTopic(topic.slug);

  return (
    <div className="bg-white dark:bg-gray-900 mb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{topicTitle}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {topicDescription}
          </p>
        </header>

        {dsaLink && <DsaPlatformCallout topic={dsaLink.topic} className="mb-12" />}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Ainda não temos artigos sobre {topicTitle.toLowerCase()}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Estamos trabalhando para trazer conteúdo sobre este tópico em breve.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              Ver todos os artigos
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            <Pagination currentPage={1} totalPages={totalPages} basePath={`/topics/${topic.slug}`} />
          </>
        )}
      </div>
    </div>
  );
}
