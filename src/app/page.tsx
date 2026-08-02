import ArrowIcon from "@/components/ArrowIcon";
import TopicTags from "@/components/TopicTags";
import UpcomingEventsHome from "@/components/UpcomingEventsHome";
import { getEvents } from "@/lib/events";
import { DISCORD_PAGE_PATH } from "@/lib/discord";
import { getSortedPostsData } from "@/lib/posts";
import escapeHtml from "escape-html";
import Link from "next/link";
export default function Home() {
  const posts = getSortedPostsData().slice(0, 6);
  const { upcoming } = getEvents();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Bem-vindo ao{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Craft & Code Club
              </span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 sm:mt-4">
              Conhecimento da comunidade para a comunidade
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href={DISCORD_PAGE_PATH}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                Entrar no Discord
              </Link>
              <a
                href="https://www.youtube.com/@CraftCodeClub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Ver no YouTube
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Eventos */}
      <UpcomingEventsHome events={upcoming} limit={2} />

      {/* Featured Topics */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tópicos em Destaque
            </h2>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Algoritmos</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Domine os fundamentos da ciência da computação e resolução de problemas.</p>
                <Link href="https://dsa.craftcodeclub.io/" target="_blank" rel="noopener noreferrer" aria-label="Saiba mais sobre Algoritmos" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  Saiba mais <ArrowIcon />
                </Link>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">System Design</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Construa arquiteturas de software escaláveis e distribuídas.</p>
                <Link href="/topics/system-design" aria-label="Saiba mais sobre System Design" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  Saiba mais <ArrowIcon />
                </Link>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Book Club</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Leitura guiada de referências essenciais em engenharia de software.</p>
                <Link href="/book-clubs/designing-data-intensive-applications" aria-label="Saiba mais sobre o Book Club" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  Saiba mais <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Posts */}
      <div className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Últimos Posts
          </h2>
          <div className={`grid gap-8 ${posts.length === 1 ? 'grid-cols-1 max-w-lg mx-auto' : posts.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {posts.map((post) => {
              return (
                <article
                  key={post.id}
                  className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("pt-BR")}
                      </time>
                    </div>
                    <TopicTags topics={post.topics} />
                    <Link href={`/posts/${escapeHtml(post.id)}`}>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {post.description}
                    </p>
                    <Link
                      href={`/posts/${escapeHtml(post.id)}`}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Ler mais
                      <ArrowIcon />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Ver todos os posts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
