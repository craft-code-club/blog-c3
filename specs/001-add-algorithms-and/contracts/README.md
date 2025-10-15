# TypeScript Contracts: DSA Roadmap

This directory contains the TypeScript interfaces and Zod schemas that define the data contracts for the DSA roadmap feature.

## Files

### `roadmap.types.ts`

Complete TypeScript type definitions and Zod validation schemas for all roadmap entities.

**Location in codebase**: `src/lib/types/roadmap.ts`

**Contents**:
- Link interface and schema
- RoadmapItem interface and schema
- RoadmapCategory interface and schema
- Roadmap interface and schema
- Validation error types

### `component-props.types.ts`

TypeScript interfaces for React component props.

**Location in codebase**: `src/components/roadmap/*.tsx` (inline or separate types file)

**Contents**:
- RoadmapTimelineProps
- CategorySectionProps
- RoadmapCardProps
- ResourceLinkProps

## Usage

These contracts ensure type safety across:
1. YAML configuration validation (build time)
2. Component prop types (compile time)
3. Data transformations (runtime)

## Implementation

See `data-model.md` for complete interface definitions and validation rules.
