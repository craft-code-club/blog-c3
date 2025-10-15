/**
 * Component Props Type Definitions for DSA Roadmap
 * 
 * This file contains TypeScript interfaces for all React component props
 * used in the roadmap feature.
 * 
 * @module component-props.types
 */

import type { Roadmap, RoadmapCategory, RoadmapItem, Link } from './roadmap.types';

// ============================================================================
// Page Component Props
// ============================================================================

/**
 * Props for the main DSA roadmap page component
 */
export interface DSARoadmapPageProps {
  /** The complete roadmap data loaded from YAML */
  roadmap: Roadmap;
}

// ============================================================================
// Timeline Component Props
// ============================================================================

/**
 * Props for the RoadmapTimeline component (root timeline container)
 */
export interface RoadmapTimelineProps {
  /** Array of categories to display in timeline */
  categories: RoadmapCategory[];
  
  /** Optional CSS className for custom styling */
  className?: string;
}

// ============================================================================
// Category Component Props
// ============================================================================

/**
 * Props for the CategorySection component
 */
export interface CategorySectionProps {
  /** Category data including title and items */
  category: RoadmapCategory;
  
  /** Zero-based index of this category in the roadmap */
  categoryIndex: number;
  
  /** Total number of categories (for styling variations) */
  totalCategories: number;
}

// ============================================================================
// Item Card Component Props
// ============================================================================

/**
 * Props for the RoadmapCard component (individual learning item)
 */
export interface RoadmapCardProps {
  /** Learning item data */
  item: RoadmapItem;
  
  /** Zero-based index of this item within its category */
  itemIndex: number;
  
  /** Total number of items in this category */
  totalItems: number;
  
  /** Optional CSS className for custom styling */
  className?: string;
}

// ============================================================================
// Link Component Props
// ============================================================================

/**
 * Props for the ResourceLink component
 */
export interface ResourceLinkProps {
  /** Link data including icon, title, URL, and target */
  link: Link;
  
  /** Zero-based index of this link within the item */
  linkIndex: number;
  
  /** Optional CSS className for custom styling */
  className?: string;
}

// ============================================================================
// Icon Component Props
// ============================================================================

/**
 * Props for the RoadmapIcon wrapper component
 */
export interface RoadmapIconProps {
  /** Icon identifier (e.g., 'book', 'video', 'file-text') */
  icon: string;
  
  /** Optional size className (default: 'w-5 h-5') */
  size?: string;
  
  /** Optional CSS className for additional styling */
  className?: string;
  
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

// ============================================================================
// Utility Component Props
// ============================================================================

/**
 * Props for the TimelineDot component (visual indicator on timeline)
 */
export interface TimelineDotProps {
  /** Whether this is the last item in the category */
  isLast?: boolean;
  
  /** Optional custom color (default uses theme) */
  color?: string;
}

/**
 * Props for the TimelineLine component (vertical connector)
 */
export interface TimelineLineProps {
  /** Height of the line (auto-calculated or fixed) */
  height?: string | number;
}
