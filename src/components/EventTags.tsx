interface EventTagsProps {
  tags: string[];
  className?: string;
}

export default function EventTags({ tags, className = '' }: EventTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 whitespace-nowrap"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
