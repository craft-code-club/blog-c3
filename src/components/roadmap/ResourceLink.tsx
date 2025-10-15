/**
 * ResourceLink Component
 * 
 * Renders a clickable link to an external resource with an icon.
 * Supports different icon types and target behaviors (same tab or new tab).
 */

import type { Link } from '@/lib/types/roadmap';
import * as Icons from 'lucide-react';

interface ResourceLinkProps {
  link: Link;
}

// Map icon names to lucide-react components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  book: Icons.Book,
  'book-open': Icons.BookOpen,
  video: Icons.Video,
  'file-text': Icons.FileText,
  code: Icons.Code,
  'external-link': Icons.ExternalLink,
  'graduation-cap': Icons.GraduationCap,
  'play-circle': Icons.PlayCircle,
  github: Icons.Github,
  calendar: Icons.Calendar,
};

/**
 * ResourceLink component displays a link with an icon
 */
export function ResourceLink({ link }: ResourceLinkProps) {
  const Icon = iconMap[link.icon] || Icons.ExternalLink;
  
  return (
    <a
      href={link.url}
      target={link.target || '_self'}
      rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center gap-2 px-4 py-2 
                 bg-blue-50 dark:bg-blue-900/20 
                 hover:bg-blue-100 dark:hover:bg-blue-900/30 
                 text-blue-700 dark:text-blue-300 
                 rounded-lg transition-colors
                 text-sm font-medium"
    >
      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      <span>{link.title}</span>
    </a>
  );
}
