import { getPostData, getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function Post({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id);

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <Link 
        href="/"
        className="text-blue-600 hover:text-blue-800 mb-8 inline-block"
      >
        ← Back to home
      </Link>
      
      <article className="prose lg:prose-xl max-w-none">
        <h1>{post.title}</h1>
        <div className="text-gray-600 mb-8">{post.date}</div>
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    </main>
  );
} 