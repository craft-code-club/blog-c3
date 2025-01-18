import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Craft & Code Club</h1>
        <p className="text-xl text-gray-600 mb-8">
          A community of developers passionate about software craftsmanship, DDD, and clean architecture
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="https://discord.gg/V7hQJZSDYu"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Join our Discord
          </a>
          <a 
            href="https://github.com/craft-code-club"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 px-6 py-2 rounded-lg hover:border-gray-400"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Featured Topics */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Featured Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/topics/ddd"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Domain-Driven Design</h3>
            <p className="text-gray-600">Explore strategic and tactical patterns in DDD</p>
          </Link>
          <Link 
            href="/topics/algorithms"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Algorithms</h3>
            <p className="text-gray-600">Deep dive into algorithms and data structures</p>
          </Link>
          <Link 
            href="/topics/architecture"
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Clean Architecture</h3>
            <p className="text-gray-600">Learn about software architecture principles</p>
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <Link href={`/posts/${post.id}`}>
                <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{post.title}</h3>
              </Link>
              <div className="text-gray-600 mb-4">{post.date}</div>
              <p className="text-gray-700 mb-4">{post.description}</p>
              <Link 
                href={`/posts/${post.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
