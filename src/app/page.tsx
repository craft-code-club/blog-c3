import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to Craft & Code Club
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          A community of developers passionate about software craftsmanship, DDD, and clean architecture
        </p>
        <div className="flex justify-center gap-6">
          <a 
            href="https://discord.gg/V7hQJZSDYu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Join our Discord
          </a>
          <a 
            href="https://github.com/craft-code-club"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View on GitHub
          </a>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="py-16 bg-white rounded-2xl shadow-sm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Featured Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link 
              href="/topics/ddd"
              className="group block p-8 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600">Domain-Driven Design</h3>
              <p className="text-gray-600">Master strategic and tactical patterns in DDD</p>
            </Link>
            <Link 
              href="/topics/algorithms"
              className="group block p-8 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600">Algorithms</h3>
              <p className="text-gray-600">Deep dive into algorithms and data structures</p>
            </Link>
            <Link 
              href="/topics/architecture"
              className="group block p-8 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600">Clean Architecture</h3>
              <p className="text-gray-600">Learn about software architecture principles</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">Latest Posts</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <time dateTime={post.date}>{post.date}</time>
                  {post.topic && (
                    <>
                      <span>•</span>
                      <Link href={`/topics/${post.topic}`} className="text-blue-600 hover:text-blue-800">
                        {post.topic.toUpperCase()}
                      </Link>
                    </>
                  )}
                </div>
                <Link href={`/posts/${post.id}`}>
                  <h3 className="text-xl font-semibold mb-3 hover:text-blue-600 transition-colors">{post.title}</h3>
                </Link>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <Link 
                  href={`/posts/${post.id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  Read more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
