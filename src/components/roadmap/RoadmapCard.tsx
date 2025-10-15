/**
 * RoadmapCard Component
 * 
 * Displays a single roadmap item as a card with title, description,
 * and optional resource links.
 */

import type { RoadmapItem } from '@/lib/types/roadmap';
import { ResourceLink } from './ResourceLink';

interface RoadmapCardProps {
  item: RoadmapItem;
}

/**
 * RoadmapCard renders a roadmap learning item
 */
export function RoadmapCard({ item }: RoadmapCardProps) {
  return (
    <article 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 
                 hover:shadow-lg transition-shadow
                 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {item.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        {item.description}
      </p>
      
      {item.links && item.links.length > 0 && (
        <nav aria-label="Recursos relacionados" className="flex flex-wrap gap-3">
          {item.links.map((link, index) => (
            <ResourceLink key={index} link={link} />
          ))}
        </nav>
      )}
    </article>
  );
}
