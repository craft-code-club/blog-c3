import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Welcome to <span className="text-blue-600 dark:text-blue-400">Craft & Code Club</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 sm:mt-4">
              A community of software craftspeople dedicated to clean code, domain-driven design, and software architecture excellence.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a href="https://discord.gg/V7hQJZSDYu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                Join Discord
              </a>
              <a href="https://github.com/craft-code-club" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Topics */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Topics</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 lg:mx-auto">
              Explore our comprehensive guides and discussions on software development best practices.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* DDD Card */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Domain-Driven Design</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Learn how to create software that reflects your business domain.</p>
                <Link href="/topics/ddd" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  Learn more →
                </Link>
              </div>

              {/* Algorithms Card */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Algorithms & Data Structures</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Master the fundamentals of computer science and problem-solving.</p>
                <Link href="/topics/algorithms" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  Learn more →
                </Link>
              </div>

              {/* Clean Architecture Card */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Clean Architecture</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Build maintainable and scalable software architectures.</p>
                <Link href="/topics/architecture" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Posts */}
      <div className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Latest Posts</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <time dateTime={post.date}>{post.date}</time>
                    {post.topic && (
                      <>
                        <span>•</span>
                        <Link href={`/topics/${post.topic}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          {post.topic.toUpperCase()}
                        </Link>
                      </>
                    )}
                  </div>
                  <Link href={`/posts/${post.id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{post.title}</h3>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
                  <Link 
                    href={`/posts/${post.id}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/topics/ddd" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Domain-Driven Design</Link>
                </li>
                <li>
                  <Link href="/topics/algorithms" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Algorithms & Data Structures</Link>
                </li>
                <li>
                  <Link href="/topics/architecture" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Clean Architecture</Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Community</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://discord.gg/V7hQJZSDYu" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Join Discord
                  </a>
                </li>
                <li>
                  <a href="https://www.meetup.com/craft-code-club" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Attend Meetups
                  </a>
                </li>
                <li>
                  <a href="https://github.com/craft-code-club" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Contribute on GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Craft & Code Club. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
