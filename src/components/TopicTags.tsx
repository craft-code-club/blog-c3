'use client';

import Link from 'next/link';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface TopicTagsProps {
  visibleTopics: string[];
  hiddenTopics: string[];
  hasHidden: boolean;
}

export default function TopicTags({ visibleTopics, hiddenTopics, hasHidden }: TopicTagsProps) {
  const TagContent = () => (
    <div className="flex flex-wrap gap-2 p-2">
      {hiddenTopics.map((topic) => (
        <Link
          key={topic}
          href={`/topics/${topic}`}
          className="inline-flex items-center flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors whitespace-nowrap"
        >
          {topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ')}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="flex gap-2 mb-3 overflow-hidden">
      {visibleTopics.map((topic) => (
        <Link
          key={topic}
          href={`/topics/${topic}`}
          className="inline-flex items-center flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors whitespace-nowrap"
        >
          {topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ')}
        </Link>
      ))}
      {hasHidden && (
        <Tippy
          content={<TagContent />}
          interactive={true}
          placement="top"
          className="[&_.tippy-content]:p-0 [&_.tippy-arrow]:hidden [&_.tippy-box]:!bg-transparent"
        >
          <span className="inline-flex items-center flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 cursor-pointer">
            ...
          </span>
        </Tippy>
      )}
    </div>
  );
} 