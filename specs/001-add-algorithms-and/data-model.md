# Data Model: DSA Roadmap

**Feature**: Algorithms and Data Structures Roadmap  
**Date**: 2025-10-14  
**Status**: Complete

## Overview

This document defines the data structures and relationships for the DSA roadmap feature. The data model is implemented as TypeScript interfaces with Zod schemas for runtime validation.

---

## Entity Relationship

```
Roadmap (1)
  └─ has many ─> Category (n)
                   └─ has many ─> Item (n)
                                    └─ has many ─> Link (n)
```

**Hierarchy**: Roadmap → Categories → Items → Links (optional)

---

## 1. Link Entity

Represents an external resource or reference for a roadmap item.

### TypeScript Interface

```typescript
export interface Link {
  /** Icon identifier for visual representation (e.g., 'book', 'video', 'file-text') */
  icon: string;
  
  /** Display text for the link */
  title: string;
  
  /** Valid URL to the resource */
  url: string;
  
  /** Optional target attribute for link behavior */
  target?: '_blank' | '_self';
}
```

### Zod Schema

```typescript
import { z } from 'zod';

export const LinkSchema = z.object({
  icon: z.string()
    .min(1, 'Icon is required')
    .describe('Icon identifier (e.g., book, video, file-text)'),
  
  title: z.string()
    .min(1, 'Link title is required')
    .max(100, 'Link title must be 100 characters or less'),
  
  url: z.string()
    .url('Must be a valid URL')
    .describe('Full URL including protocol (https://)'),
  
  target: z.enum(['_blank', '_self'])
    .optional()
    .describe('How link opens: _blank (new tab) or _self (same tab)'),
});

export type Link = z.infer<typeof LinkSchema>;
```

### YAML Example

```yaml
- icon: "book"
  title: "Documentação MDN"
  url: "https://developer.mozilla.org/docs/..."
  target: "_blank"
```

### Validation Rules

| Field | Required | Validation | Default |
|-------|----------|------------|---------|
| icon | Yes | Non-empty string | N/A |
| title | Yes | 1-100 characters | N/A |
| url | Yes | Valid URL format | N/A |
| target | No | '_blank' or '_self' | undefined (same tab) |

### Icon Mapping

Supported icon identifiers (lucide-react):
- `book`: Documentation, articles
- `video`: Video tutorials
- `file-text`: Blog posts, articles
- `code`: Code repositories
- `external-link`: Generic external links
- `graduation-cap`: Educational platforms
- `play-circle`: Interactive tutorials

---

## 2. Item Entity

Represents a single learning topic within a category.

### TypeScript Interface

```typescript
export interface RoadmapItem {
  /** Title of the learning topic */
  title: string;
  
  /** Brief description of the topic (1-2 sentences) */
  description: string;
  
  /** Optional array of resource links */
  links?: Link[];
}
```

### Zod Schema

```typescript
export const RoadmapItemSchema = z.object({
  title: z.string()
    .min(1, 'Item title is required')
    .max(200, 'Item title must be 200 characters or less'),
  
  description: z.string()
    .min(1, 'Item description is required')
    .max(500, 'Item description must be 500 characters or less')
    .describe('Brief explanation of the topic'),
  
  links: z.array(LinkSchema)
    .optional()
    .describe('Optional array of related resource links'),
});

export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;
```

### YAML Example

```yaml
- title: "Arrays e Listas"
  description: "Estruturas de dados sequenciais fundamentais para armazenar coleções ordenadas de elementos."
  links:
    - icon: "book"
      title: "MDN - Arrays"
      url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array"
      target: "_blank"
    - icon: "video"
      title: "Curso Completo"
      url: "https://youtube.com/..."
      target: "_blank"
```

### Validation Rules

| Field | Required | Validation | Default |
|-------|----------|------------|---------|
| title | Yes | 1-200 characters | N/A |
| description | Yes | 1-500 characters | N/A |
| links | No | Array of valid Link objects | [] (empty array) |

### Relationships

- **Parent**: Category (1:n)
- **Children**: Links (0:n)
- **Sequential Position**: Determined by array order in YAML

---

## 3. Category Entity

Represents a thematic grouping of related learning items.

### TypeScript Interface

```typescript
export interface RoadmapCategory {
  /** Category name (e.g., "Basic Data Structures") */
  title: string;
  
  /** Array of learning items in this category */
  items: RoadmapItem[];
}
```

### Zod Schema

```typescript
export const RoadmapCategorySchema = z.object({
  title: z.string()
    .min(1, 'Category title is required')
    .max(100, 'Category title must be 100 characters or less'),
  
  items: z.array(RoadmapItemSchema)
    .min(1, 'Category must have at least one item')
    .describe('Array of learning items in sequential order'),
});

export type RoadmapCategory = z.infer<typeof RoadmapCategorySchema>;
```

### YAML Example

```yaml
- title: "Estruturas de Dados Básicas"
  items:
    - title: "Arrays e Listas"
      description: "..."
      links: [...]
    - title: "Pilhas e Filas"
      description: "..."
      links: [...]
```

### Validation Rules

| Field | Required | Validation | Default |
|-------|----------|------------|---------|
| title | Yes | 1-100 characters | N/A |
| items | Yes | Non-empty array | N/A |

### Relationships

- **Parent**: Roadmap (1:n)
- **Children**: Items (1:n, minimum 1)
- **Sequential Position**: Determined by array order in YAML

---

## 4. Roadmap Entity (Root)

Represents the complete roadmap structure.

### TypeScript Interface

```typescript
export interface Roadmap {
  /** Array of categories in learning sequence */
  categories: RoadmapCategory[];
}
```

### Zod Schema

```typescript
export const RoadmapSchema = z.object({
  categories: z.array(RoadmapCategorySchema)
    .min(1, 'Roadmap must have at least one category')
    .describe('Array of categories in sequential learning order'),
});

export type Roadmap = z.infer<typeof RoadmapSchema>;
```

### Complete YAML Example

```yaml
# _content/roadmap/dsa.yml
categories:
  - title: "Estruturas de Dados Básicas"
    items:
      - title: "Arrays e Listas"
        description: "Estruturas sequenciais fundamentais"
        links:
          - icon: "book"
            title: "MDN Arrays"
            url: "https://developer.mozilla.org/..."
            target: "_blank"
      
      - title: "Pilhas e Filas"
        description: "Estruturas LIFO e FIFO"
        links:
          - icon: "video"
            title: "Tutorial em Vídeo"
            url: "https://youtube.com/..."
  
  - title: "Árvores"
    items:
      - title: "Árvores Binárias"
        description: "Estrutura hierárquica com dois filhos"
        links:
          - icon: "book"
            title: "Documentação"
            url: "https://..."
```

### Validation Rules

| Field | Required | Validation | Default |
|-------|----------|------------|---------|
| categories | Yes | Non-empty array | N/A |

---

## File Structure

### TypeScript Type Definitions

**Location**: `src/lib/types/roadmap.ts`

```typescript
import { z } from 'zod';

// Schemas (as defined above)
export const LinkSchema = z.object({ /* ... */ });
export const RoadmapItemSchema = z.object({ /* ... */ });
export const RoadmapCategorySchema = z.object({ /* ... */ });
export const RoadmapSchema = z.object({ /* ... */ });

// Inferred Types
export type Link = z.infer<typeof LinkSchema>;
export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;
export type RoadmapCategory = z.infer<typeof RoadmapCategorySchema>;
export type Roadmap = z.infer<typeof RoadmapSchema>;
```

### YAML Configuration

**Location**: `_content/roadmap/dsa.yml`

Contains the actual roadmap content following the schema above.

---

## Data Loading & Validation

### Load Function

**Location**: `src/lib/roadmap.ts`

```typescript
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { RoadmapSchema, type Roadmap } from './types/roadmap';

/**
 * Loads and validates the DSA roadmap from YAML configuration
 * @throws {Error} If file not found or validation fails
 * @returns Validated roadmap data
 */
export function loadDSARoadmap(): Roadmap {
  try {
    const filePath = path.join(process.cwd(), '_content/roadmap/dsa.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse YAML
    const data = yaml.load(fileContents);
    
    // Validate with Zod schema
    const roadmap = RoadmapSchema.parse(data);
    
    return roadmap;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ DSA Roadmap validation failed:');
      console.error('File: _content/roadmap/dsa.yml\n');
      
      error.errors.forEach((err, index) => {
        const path = err.path.join(' → ');
        console.error(`${index + 1}. ${path}`);
        console.error(`   Error: ${err.message}\n`);
      });
      
      throw new Error(
        'Invalid roadmap configuration. Please fix errors in _content/roadmap/dsa.yml'
      );
    }
    
    throw error;
  }
}
```

### Build-Time Validation

The `loadDSARoadmap()` function is called during Next.js build in the page component:

```typescript
// src/app/roadmap/dsa/page.tsx
import { loadDSARoadmap } from '@/lib/roadmap';

// This runs at build time (SSG)
export default function DSARoadmapPage() {
  const roadmap = loadDSARoadmap(); // Throws if invalid
  
  return (
    <main>
      {/* Render roadmap */}
    </main>
  );
}
```

**Result**: Build fails with clear error messages if YAML is invalid.

---

## Example Data Scenarios

### Minimum Valid Roadmap

```yaml
categories:
  - title: "Básico"
    items:
      - title: "Introdução"
        description: "Começando com algoritmos"
```

### Item Without Links

```yaml
- title: "Conceito Teórico"
  description: "Apenas teoria, sem recursos externos"
  # links omitted (optional)
```

### Item With Multiple Links

```yaml
- title: "Tópico Rico"
  description: "Múltiplos recursos disponíveis"
  links:
    - icon: "book"
      title: "Artigo"
      url: "https://..."
    - icon: "video"
      title: "Vídeo"
      url: "https://..."
    - icon: "code"
      title: "Código"
      url: "https://github.com/..."
      target: "_blank"
```

### Large Roadmap (Edge Case)

- 15 categories
- Average 7 items per category = 105 total items
- Average 3 links per item = 315 total links

**Performance**: SSG handles this efficiently at build time. No runtime performance impact.

---

## Validation Error Examples

### Missing Required Field

```yaml
categories:
  - title: "Test"
    items:
      - title: "Item"
        # description missing!
```

**Error**:
```
1. categories → 0 → items → 0 → description
   Error: Item description is required
```

### Invalid URL

```yaml
links:
  - icon: "book"
    title: "Test"
    url: "not-a-valid-url"
```

**Error**:
```
1. categories → 0 → items → 0 → links → 0 → url
   Error: Must be a valid URL
```

### Empty Category

```yaml
categories:
  - title: "Empty Category"
    items: []
```

**Error**:
```
1. categories → 0 → items
   Error: Category must have at least one item
```

---

## Summary

| Entity | Required Fields | Optional Fields | Children |
|--------|----------------|-----------------|----------|
| **Roadmap** | categories | - | Categories (1+) |
| **Category** | title, items | - | Items (1+) |
| **Item** | title, description | links | Links (0+) |
| **Link** | icon, title, url | target | - |

**Total Entities**: 4 (hierarchical)  
**Validation**: Runtime with Zod at build time  
**Storage**: Single YAML file at `_content/roadmap/dsa.yml`  
**Type Safety**: Full TypeScript inference from Zod schemas
