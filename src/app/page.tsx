import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600">{post.title}</h2>
            </Link>
            <div className="text-gray-600 mb-4">{post.date}</div>
            <p className="text-gray-700">{post.description}</p>
            <Link 
              href={`/posts/${post.id}`}
              className="inline-block mt-4 text-blue-600 hover:text-blue-800"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
