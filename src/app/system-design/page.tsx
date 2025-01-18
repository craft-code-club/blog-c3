import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

export default function SystemDesign() {
  const allPosts = getSortedPostsData();
  const posts = allPosts.filter(post => post.topic === 'system-design');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">System Design</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Deep dive into software architecture, design patterns, and system scalability
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <time dateTime={post.date}>{post.date}</time>
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

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No articles available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
} 