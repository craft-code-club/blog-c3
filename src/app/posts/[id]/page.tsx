import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function Post({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.id);
  const authors = post.authors || [];

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('pt-BR')}</time>
          {authors.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <span>{authors.map(author => author.name).join(', ')}</span>
            </>
          )}
        </div>
      </header>
      <div className="prose dark:prose-dark prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </div>
      
      {authors.length > 0 && (
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sobre os Autores</h2>
          <div className="flex flex-col space-y-4">
            {authors.map((author, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                    {author.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {author.link ? (
                  <a 
                    href={author.link}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {author.name}
                  </a>
                ) : (
                  <span className="text-gray-900 dark:text-white font-medium">{author.name}</span>
                )}
              </div>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
} 