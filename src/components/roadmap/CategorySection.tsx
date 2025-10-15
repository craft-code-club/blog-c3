/**
 * CategorySection Component
 * 
 * Renders a category section with heading and all items in that category.
 * Includes timeline dots for visual progression.
 */

import type { RoadmapCategory } from '@/lib/types/roadmap';
import { RoadmapCard } from './RoadmapCard';

interface CategorySectionProps {
  category: RoadmapCategory;
  categoryIndex: number;
}

/**
 * CategorySection displays a category with its items
 */
export function CategorySection({ category, categoryIndex }: CategorySectionProps) {
  return (
    <section 
      className="relative"
      aria-labelledby={`category-${categoryIndex}`}
    >
      <h2 
        id={`category-${categoryIndex}`}
        className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6
                   pl-0 md:pl-12"
      >
        {category.title}
      </h2>
      
      <div className="space-y-6">
        {category.items.map((item, itemIndex) => (
          <div key={itemIndex} className="relative pl-0 md:pl-12">
            {/* Timeline dot (hidden on mobile) */}
            <div 
              className="absolute left-2.5 w-3 h-3 bg-blue-500 dark:bg-blue-400 
                         rounded-full hidden md:block top-8"
              aria-hidden="true"
            />
            
            <RoadmapCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
