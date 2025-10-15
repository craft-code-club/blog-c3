# Quickstart Guide: DSA Roadmap Implementation

**Feature**: Algorithms and Data Structures Roadmap  
**Date**: 2025-10-14  
**Prerequisites**: Node.js 18+, npm/yarn, basic Next.js knowledge

## Overview

This guide provides step-by-step instructions to implement the DSA roadmap feature from scratch.

---

## Phase 1: Project Setup & Dependencies

### Step 1.1: Install Required Dependencies

```bash
# Navigate to project root
cd /Users/wilson/Desktop/blog-c3

# Install new dependencies
npm install js-yaml zod lucide-react

# Install type definitions
npm install --save-dev @types/js-yaml
```

**Dependencies added**:
- `js-yaml`: Parse YAML configuration files
- `zod`: Runtime schema validation with TypeScript inference
- `lucide-react`: Tree-shakeable icon library
- `@types/js-yaml`: TypeScript definitions for js-yaml

### Step 1.2: Verify Installation

```bash
npm list js-yaml zod lucide-react
```

Expected output showing installed versions.

---

## Phase 2: Create Type Definitions

### Step 2.1: Create Types Directory

```bash
mkdir -p src/lib/types
```

### Step 2.2: Add Roadmap Types

Create `src/lib/types/roadmap.ts`:

```typescript
import { z } from 'zod';

// Link Schema
export const LinkSchema = z.object({
  icon: z.string().min(1, 'Icon is required'),
  title: z.string().min(1).max(100),
  url: z.string().url('Must be a valid URL'),
  target: z.enum(['_blank', '_self']).optional(),
});

export type Link = z.infer<typeof LinkSchema>;

// RoadmapItem Schema
export const RoadmapItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  links: z.array(LinkSchema).optional(),
});

export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;

// RoadmapCategory Schema
export const RoadmapCategorySchema = z.object({
  title: z.string().min(1).max(100),
  items: z.array(RoadmapItemSchema).min(1),
});

export type RoadmapCategory = z.infer<typeof RoadmapCategorySchema>;

// Roadmap Schema (Root)
export const RoadmapSchema = z.object({
  categories: z.array(RoadmapCategorySchema).min(1),
});

export type Roadmap = z.infer<typeof RoadmapSchema>;
```

---

## Phase 3: Create YAML Loading Logic

### Step 3.1: Create Roadmap Utility

Create `src/lib/roadmap.ts`:

```typescript
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { RoadmapSchema, type Roadmap } from './types/roadmap';
import { ZodError } from 'zod';

/**
 * Loads and validates the DSA roadmap from YAML
 */
export function loadDSARoadmap(): Roadmap {
  try {
    const filePath = path.join(process.cwd(), '_content/roadmap/dsa.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
    const roadmap = RoadmapSchema.parse(data);
    return roadmap;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('❌ DSA Roadmap validation failed:');
      console.error('File: _content/roadmap/dsa.yml\n');
      error.errors.forEach((err, index) => {
        console.error(`${index + 1}. ${err.path.join(' → ')}: ${err.message}`);
      });
      throw new Error('Invalid roadmap configuration');
    }
    throw error;
  }
}
```

---

## Phase 4: Create YAML Configuration

### Step 4.1: Create Roadmap Directory

```bash
mkdir -p _content/roadmap
```

### Step 4.2: Create Initial DSA Roadmap

Create `_content/roadmap/dsa.yml`:

```yaml
categories:
  - title: "Estruturas de Dados Básicas"
    items:
      - title: "Arrays e Listas"
        description: "Estruturas de dados sequenciais fundamentais para armazenar coleções ordenadas de elementos."
        links:
          - icon: "book"
            title: "MDN - Arrays"
            url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array"
            target: "_blank"
          - icon: "video"
            title: "Curso em Vídeo"
            url: "https://youtube.com/watch?v=example"
            target: "_blank"
      
      - title: "Pilhas (Stack)"
        description: "Estrutura LIFO (Last In First Out) para gerenciar elementos em ordem reversa de inserção."
        links:
          - icon: "book"
            title: "Documentação"
            url: "https://example.com/stack-docs"
            target: "_blank"
  
  - title: "Algoritmos de Ordenação"
    items:
      - title: "Bubble Sort"
        description: "Algoritmo simples de ordenação por comparação e troca de elementos adjacentes."
      
      - title: "Quick Sort"
        description: "Algoritmo eficiente de ordenação por divisão e conquista com complexidade O(n log n)."
        links:
          - icon: "code"
            title: "Implementação em GitHub"
            url: "https://github.com/example/quicksort"
            target: "_blank"
```

### Step 4.3: Test YAML Loading

Create a test script `scripts/test-roadmap.ts`:

```typescript
import { loadDSARoadmap } from '../src/lib/roadmap';

try {
  const roadmap = loadDSARoadmap();
  console.log('✅ Roadmap loaded successfully!');
  console.log(`Categories: ${roadmap.categories.length}`);
  console.log(`Total items: ${roadmap.categories.reduce((sum, cat) => sum + cat.items.length, 0)}`);
} catch (error) {
  console.error('❌ Failed to load roadmap:', error);
  process.exit(1);
}
```

Run test:
```bash
npx tsx scripts/test-roadmap.ts
```

---

## Phase 5: Create React Components

### Step 5.1: Create Component Directory

```bash
mkdir -p src/components/roadmap
```

### Step 5.2: Create ResourceLink Component

Create `src/components/roadmap/ResourceLink.tsx`:

```typescript
import type { Link } from '@/lib/types/roadmap';
import * as Icons from 'lucide-react';

interface ResourceLinkProps {
  link: Link;
}

// Map icon names to lucide-react components
const iconMap: Record<string, React.ComponentType<any>> = {
  book: Icons.Book,
  video: Icons.Video,
  'file-text': Icons.FileText,
  code: Icons.Code,
  'external-link': Icons.ExternalLink,
  'graduation-cap': Icons.GraduationCap,
};

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
                 rounded-lg transition-colors"
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span className="text-sm font-medium">{link.title}</span>
    </a>
  );
}
```

### Step 5.3: Create RoadmapCard Component

Create `src/components/roadmap/RoadmapCard.tsx`:

```typescript
import type { RoadmapItem } from '@/lib/types/roadmap';
import { ResourceLink } from './ResourceLink';

interface RoadmapCardProps {
  item: RoadmapItem;
}

export function RoadmapCard({ item }: RoadmapCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 
                       hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {item.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">
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
```

### Step 5.4: Create CategorySection Component

Create `src/components/roadmap/CategorySection.tsx`:

```typescript
import type { RoadmapCategory } from '@/lib/types/roadmap';
import { RoadmapCard } from './RoadmapCard';

interface CategorySectionProps {
  category: RoadmapCategory;
  categoryIndex: number;
}

export function CategorySection({ category, categoryIndex }: CategorySectionProps) {
  return (
    <section 
      className="relative"
      aria-labelledby={`category-${categoryIndex}`}
    >
      <h2 
        id={`category-${categoryIndex}`}
        className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6"
      >
        {category.title}
      </h2>
      
      <div className="space-y-6">
        {category.items.map((item, itemIndex) => (
          <div key={itemIndex} className="relative pl-0 md:pl-12">
            {/* Timeline dot (hidden on mobile) */}
            <div 
              className="absolute left-2.5 w-3 h-3 bg-blue-500 rounded-full 
                         hidden md:block"
              aria-hidden="true"
            />
            
            <RoadmapCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Step 5.5: Create RoadmapTimeline Component

Create `src/components/roadmap/RoadmapTimeline.tsx`:

```typescript
import type { Roadmap } from '@/lib/types/roadmap';
import { CategorySection } from './CategorySection';

interface RoadmapTimelineProps {
  roadmap: Roadmap;
}

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
```

---

## Phase 6: Create Roadmap Page

### Step 6.1: Create Page Directory

```bash
mkdir -p src/app/roadmap/dsa
```

### Step 6.2: Create DSA Roadmap Page

Create `src/app/roadmap/dsa/page.tsx`:

```typescript
import type { Metadata } from 'next';
import { loadDSARoadmap } from '@/lib/roadmap';
import { RoadmapTimeline } from '@/components/roadmap/RoadmapTimeline';

export const metadata: Metadata = {
  title: 'Roadmap de Algoritmos e Estruturas de Dados | Craft & Code Club',
  description: 'Trilha completa de aprendizado de algoritmos e estruturas de dados com recursos organizados sequencialmente.',
  openGraph: {
    title: 'Roadmap DSA - Craft & Code Club',
    description: 'Aprenda algoritmos e estruturas de dados com nossa trilha estruturada',
    type: 'website',
  },
};

export default function DSARoadmapPage() {
  // Load roadmap at build time (SSG)
  const roadmap = loadDSARoadmap();
  
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Roadmap de Algoritmos e Estruturas de Dados
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Trilha de aprendizado sequencial com recursos organizados
          </p>
        </div>
      </header>
      
      <RoadmapTimeline roadmap={roadmap} />
    </main>
  );
}
```

---

## Phase 7: Add Navigation Link

### Step 7.1: Update Navigation Component

Find your navigation component (likely in `src/app/layout.tsx` or `src/components/Navigation.tsx`) and add:

```typescript
const navigationItems = [
  { name: 'Início', href: '/' },
  { name: 'Posts', href: '/posts' },
  { name: 'Eventos', href: '/events' },
  { name: 'Roadmap DSA', href: '/roadmap/dsa' }, // ADD THIS
];
```

---

## Phase 8: Build & Test

### Step 8.1: Run Development Server

```bash
npm run dev
```

Navigate to: `http://localhost:3000/roadmap/dsa`

### Step 8.2: Check for Errors

- Console should show no YAML validation errors
- Page should render with timeline layout
- Cards should be responsive (test mobile viewport)
- Links should open correctly based on target attribute
- Dark mode should work properly

### Step 8.3: Test Build

```bash
npm run build
```

Expected: Build succeeds with no errors. If YAML is invalid, build will fail with clear error messages.

---

## Phase 9: Validation & Quality Checks

### Step 9.1: Test YAML Validation

Try adding invalid data to `_content/roadmap/dsa.yml`:

```yaml
categories:
  - title: "Test"
    items:
      - title: "Item"
        # description missing - should fail
```

Run `npm run build` - should fail with clear error message.

### Step 9.2: Accessibility Check

- Tab through all links (keyboard navigation)
- Test with screen reader
- Verify proper heading hierarchy (H1 → H2 → H3)
- Check color contrast in both light and dark modes

### Step 9.3: Performance Check

```bash
npm run build
npm run start
```

Use Lighthouse to verify:
- LCP < 2.5s ✓
- INP < 200ms ✓
- CLS < 0.1 ✓

---

## Common Issues & Solutions

### Issue: "Cannot find module 'zod'"

**Solution**: Install missing dependency
```bash
npm install zod
```

### Issue: "YAML file not found"

**Solution**: Verify file exists at `_content/roadmap/dsa.yml`
```bash
ls -la _content/roadmap/dsa.yml
```

### Issue: "Invalid YAML syntax"

**Solution**: Check YAML indentation (use 2 spaces, not tabs)
```bash
npx js-yaml _content/roadmap/dsa.yml
```

### Issue: Icons not rendering

**Solution**: Verify icon names match lucide-react exports
```typescript
// Check available icons
import * as Icons from 'lucide-react';
console.log(Object.keys(Icons));
```

---

## Next Steps

1. **Content**: Populate `dsa.yml` with complete roadmap content
2. **Styling**: Refine card styles and timeline appearance
3. **Features**: Add progress tracking (future enhancement)
4. **Analytics**: Track which resources are most clicked
5. **SEO**: Submit sitemap with new `/roadmap/dsa` URL

---

## Validation Checklist

- [ ] All dependencies installed
- [ ] Type definitions created
- [ ] YAML loader with validation working
- [ ] Initial `dsa.yml` created
- [ ] All React components created
- [ ] Page component created at `/roadmap/dsa`
- [ ] Navigation link added
- [ ] Development server shows roadmap correctly
- [ ] Build succeeds without errors
- [ ] YAML validation catches errors correctly
- [ ] Responsive design works (mobile to desktop)
- [ ] Dark mode works properly
- [ ] Links open with correct target behavior
- [ ] Accessibility tested (keyboard + screen reader)
- [ ] Performance meets Core Web Vitals targets

---

## Estimated Implementation Time

- Phase 1-3 (Setup & Types): 30 minutes
- Phase 4 (YAML Configuration): 20 minutes
- Phase 5 (Components): 1 hour
- Phase 6-7 (Page & Navigation): 30 minutes
- Phase 8-9 (Testing): 30 minutes

**Total**: ~3 hours for experienced developer
