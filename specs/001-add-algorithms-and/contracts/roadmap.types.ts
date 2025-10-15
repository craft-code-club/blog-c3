/**
 * TypeScript Type Definitions for DSA Roadmap
 * 
 * This file contains all type definitions and Zod schemas for the DSA roadmap feature.
 * These types ensure data integrity from YAML configuration through to component rendering.
 * 
 * @module roadmap.types
 */

import { z } from 'zod';

// ============================================================================
// Link Entity
// ============================================================================

/**
 * Zod schema for validating link objects
 */
export const LinkSchema = z.object({
  icon: z.string()
    .min(1, 'Icon is required')
    .describe('Icon identifier from lucide-react (e.g., book, video, file-text)'),
  
  title: z.string()
    .min(1, 'Link title is required')
    .max(100, 'Link title must be 100 characters or less'),
  
  url: z.string()
    .url('Must be a valid URL')
    .describe('Full URL including protocol (https://)'),
  
  target: z.enum(['_blank', '_self'])
    .optional()
    .describe('Link target: _blank (new tab) or _self (same tab, default)'),
});

/**
 * TypeScript interface for a resource link
 */
export type Link = z.infer<typeof LinkSchema>;

// ============================================================================
// RoadmapItem Entity
// ============================================================================

/**
 * Zod schema for validating roadmap items
 */
export const RoadmapItemSchema = z.object({
  title: z.string()
    .min(1, 'Item title is required')
    .max(200, 'Item title must be 200 characters or less'),
  
  description: z.string()
    .min(1, 'Item description is required')
    .max(500, 'Item description must be 500 characters or less')
    .describe('Brief explanation of the learning topic (1-2 sentences)'),
  
  links: z.array(LinkSchema)
    .optional()
    .describe('Optional array of related resource links'),
});

/**
 * TypeScript interface for a roadmap learning item
 */
export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;

// ============================================================================
// RoadmapCategory Entity
// ============================================================================

/**
 * Zod schema for validating roadmap categories
 */
export const RoadmapCategorySchema = z.object({
  title: z.string()
    .min(1, 'Category title is required')
    .max(100, 'Category title must be 100 characters or less'),
  
  items: z.array(RoadmapItemSchema)
    .min(1, 'Category must have at least one item')
    .describe('Array of learning items in sequential order'),
});

/**
 * TypeScript interface for a roadmap category
 */
export type RoadmapCategory = z.infer<typeof RoadmapCategorySchema>;

// ============================================================================
// Roadmap Entity (Root)
// ============================================================================

/**
 * Zod schema for validating the complete roadmap structure
 */
export const RoadmapSchema = z.object({
  categories: z.array(RoadmapCategorySchema)
    .min(1, 'Roadmap must have at least one category')
    .describe('Array of categories in sequential learning order'),
});

/**
 * TypeScript interface for the complete roadmap
 */
export type Roadmap = z.infer<typeof RoadmapSchema>;

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Type for roadmap loading errors
 */
export interface RoadmapLoadError {
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * Type guard to check if a value is a valid Roadmap
 */
export function isRoadmap(value: unknown): value is Roadmap {
  try {
    RoadmapSchema.parse(value);
    return true;
  } catch {
    return false;
  }
}
