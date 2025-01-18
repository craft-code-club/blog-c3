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
  const post = await getPostData(resolvedParams.id);

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
          {post.author && (
            <>
              <span className="mx-2">•</span>
              <span>{post.author}</span>
            </>
          )}
        </div>
      </header>
      <div className="prose dark:prose-dark prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </div>
    </article>
  );
} 