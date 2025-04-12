import Link from 'next/link';
import { Topic } from '@/lib/topics';

interface TopicTagsProps {
  topics: Topic[];
}

export default function TopicTags({ topics }: TopicTagsProps) {
  return (
    <div className="flex gap-2 mb-3 overflow-hidden">
      {topics.map((topic) => (
        <Link
          key={topic.slug}
          href={`/topics/${topic.slug}`}
          className="inline-flex items-center flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors whitespace-nowrap"
        >
          {topic.name}
        </Link>
      ))}
    </div>
  );
}