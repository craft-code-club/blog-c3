import { getPostData, getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    id: post.id,
  }));
}

async function BlogPostContent({ id }: { id: string }) {
  try {
    const post = await getPostData(id);
    return (
      <article className="prose lg:prose-xl max-w-none">
        <h1>{post.title}</h1>
        <div className="text-gray-600 mb-8">{post.date}</div>
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    );
  } catch (_: unknown) {
    notFound();
  }
}

export default async function Post({ params }: Props) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    notFound();
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      <Link 
        href="/"
        className="text-blue-600 hover:text-blue-800 mb-8 inline-block"
      >
        ← Back to home
      </Link>
      
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Async Server Component */}
        <BlogPostContent id={resolvedParams.id} />
      </Suspense>
    </main>
  );
} 