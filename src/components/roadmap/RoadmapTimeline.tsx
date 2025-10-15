/**
 * RoadmapTimeline Component
 * 
 * Main timeline container that renders all categories with a vertical timeline line.
 * This is the root component for displaying the complete roadmap.
 */

import type { Roadmap } from '@/lib/types/roadmap';
import { CategorySection } from './CategorySection';

interface RoadmapTimelineProps {
  roadmap: Roadmap;
}

/**
 * RoadmapTimeline renders the complete roadmap with timeline visualization
 */
export function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  return (
    <div className="relative max-w-4xl mx-auto px-4 py-12">
      {/* Timeline line (hidden on mobile) */}
      <div 
        className="absolute left-8 top-0 bottom-0 w-0.5 
                   bg-gray-300 dark:bg-gray-700 
                   hidden md:block"
        aria-hidden="true"
      />
      
      <div className="space-y-12">
        {roadmap.categories.map((category, index) => (
          <CategorySection 
            key={index}
            category={category}
            categoryIndex={index}
          />
        ))}
      </div>
    </div>
  );
}
