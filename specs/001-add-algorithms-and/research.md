# Research: DSA Roadmap Feature

**Feature**: Algorithms and Data Structures Roadmap  
**Date**: 2025-10-14  
**Status**: Complete

## Overview

This document consolidates research findings for implementing the DSA roadmap page, resolving technical unknowns and establishing best practices for the implementation.

---

## 1. Icon Library Selection

**Question**: Which icon library should be used for resource links in roadmap items?

**Decision**: **lucide-react**

**Rationale**:
- **Lightweight**: Tree-shakeable, only imports used icons (~1-2KB per icon)
- **Modern**: Clean, consistent design matching Tailwind aesthetic
- **TypeScript Native**: Full TypeScript support out of the box
- **Active Maintenance**: Regular updates, large icon set (1000+ icons)
- **Next.js Compatible**: Works seamlessly with SSG and Server Components
- **Zero Configuration**: No additional setup beyond `npm install lucide-react`

**Alternatives Considered**:
- **react-icons**: Larger bundle size, multiple icon sets can cause inconsistency
- **heroicons**: Limited icon set (~300 icons), may lack specific resource type icons
- **SVG assets**: Manual management overhead, no built-in accessibility features

**Implementation**:
```typescript
import { Book, Video, FileText, ExternalLink } from 'lucide-react';

// Usage in ResourceLink component
<Book className="w-5 h-5" aria-hidden="true" />
```

**Icon Mapping Strategy**:
- `book`: Documentation, articles
- `video`: Video tutorials, courses
- `file-text`: Blog posts, written resources
- `external-link`: Generic external links
- `code`: Code repositories, examples
- `graduation-cap`: Educational platforms

---

## 2. YAML Parsing & Validation

**Question**: Best approach for parsing and validating YAML configuration in Next.js build?

**Decision**: **js-yaml + Zod schema validation**

**Rationale**:
- **js-yaml**: Industry standard for YAML parsing in Node.js
- **Zod**: Runtime type validation with TypeScript inference
- **Build-time Validation**: Catch errors during `next build`, not at runtime
- **Type Safety**: Generate TypeScript types from Zod schema
- **Clear Errors**: Detailed validation messages for content authors

**Implementation Pattern**:
```typescript
import yaml from 'js-yaml';
import { z } from 'zod';
import fs from 'fs';

// Zod schema for validation
const LinkSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  target: z.enum(['_blank', '_self']).optional(),
});

const ItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  links: z.array(LinkSchema).optional(),
});

const CategorySchema = z.object({
  title: z.string().min(1),
  items: z.array(ItemSchema),
});

const RoadmapSchema = z.object({
  categories: z.array(CategorySchema),
});

// Load and validate function
export function loadRoadmap() {
  const fileContents = fs.readFileSync('_content/roadmap/dsa.yml', 'utf8');
  const data = yaml.load(fileContents);
  
  // Validate with Zod - throws detailed errors
  const roadmap = RoadmapSchema.parse(data);
  return roadmap;
}
```

**Alternatives Considered**:
- **gray-matter only**: No validation, runtime errors possible
- **JSON Schema**: More verbose, less TypeScript integration
- **Manual validation**: Error-prone, harder to maintain

---

## 3. Card Timeline Layout Pattern

**Question**: Best Tailwind CSS approach for responsive card-based vertical timeline?

**Decision**: **Flexbox with custom timeline pseudo-elements**

**Rationale**:
- **Responsive by Default**: Flexbox adapts naturally to viewport changes
- **Visual Clarity**: Vertical line with connector dots indicates progression
- **Tailwind Native**: Uses utility classes with minimal custom CSS
- **Accessible**: Semantic HTML with proper ARIA attributes
- **Performance**: No JavaScript needed for layout

**Layout Structure**:
```tsx
<div className="relative space-y-8">
  {/* Timeline line (hidden on mobile) */}
  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700 
                  hidden md:block" aria-hidden="true" />
  
  {categories.map(category => (
    <section key={category.title} className="relative">
      <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
      
      <div className="space-y-6">
        {category.items.map(item => (
          <div className="relative pl-0 md:pl-12">
            {/* Timeline dot */}
            <div className="absolute left-2.5 w-3 h-3 bg-primary rounded-full 
                            hidden md:block" aria-hidden="true" />
            
            {/* Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 
                            hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {item.description}
              </p>
              
              {/* Links */}
              {item.links && (
                <div className="flex flex-wrap gap-3">
                  {/* Resource links */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  ))}
</div>
```

**Responsive Behavior**:
- **Mobile (<768px)**: Simple stacked cards, no timeline visual
- **Tablet/Desktop (≥768px)**: Cards offset with timeline line and dots

**Alternatives Considered**:
- **CSS Grid**: More complex for varied content heights
- **Absolute positioning**: Fragile on responsive breakpoints
- **Third-party timeline library**: Unnecessary dependency

---

## 4. Navigation Integration Pattern

**Question**: Best approach to add roadmap link to existing navigation?

**Decision**: **Follow existing inline navigation pattern in `src/app/layout.tsx`**

**Rationale**:
- **Consistency**: Navigation is directly embedded in RootLayout component
- **No Separate Component**: Project doesn't use a separate Navigation component
- **Duplicate Mobile/Desktop**: Navigation items are defined twice (mobile and desktop sections)
- **Static Links**: No active state highlighting currently implemented
- **Simple Pattern**: Direct Link components without abstraction

**Implementation Location**:
Add to both mobile and desktop nav sections in `src/app/layout.tsx`:

```typescript
// Mobile Menu Section (around line 58)
<Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Blog</Link>
<Link href="/events" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Eventos</Link>
<Link href="/roadmap/dsa" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Roadmap DSA</Link>  {/* NEW */}
<Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Sobre</Link>

// Desktop Section (around line 70)
<Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Blog</Link>
<Link href="/events" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Eventos</Link>
<Link href="/roadmap/dsa" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Roadmap DSA</Link>  {/* NEW */}
<Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Sobre</Link>
```

**Note**: No active state highlighting needed - follow existing pattern of static navigation links.

---

## 5. SEO & Metadata Strategy

**Question**: How to optimize roadmap page for search engines and social sharing?

**Decision**: **Follow existing Next.js Metadata API pattern from blog/events pages**

**Rationale**:
- **Consistency**: Match the metadata structure already used in `/blog` and `/topics` pages
- **Proven Pattern**: Project already successfully uses this approach
- **Keywords Field**: Include keywords array as seen in existing pages
- **No JSON-LD**: Project doesn't currently implement structured data

**Implementation** (following `/blog/page.tsx` pattern):
```typescript
// src/app/roadmap/dsa/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Roadmap DSA | Craft & Code Club",
  description: "Trilha completa de aprendizado de algoritmos e estruturas de dados com recursos organizados sequencialmente.",
  keywords: ["Roadmap", "Algoritmos", "Estruturas de Dados", "DSA", "Aprendizado", "Trilha"],
  openGraph: {
    title: "Roadmap DSA | Craft & Code Club",
    description: "Trilha completa de aprendizado de algoritmos e estruturas de dados com recursos organizados sequencialmente.",
  },
  twitter: {
    title: "Roadmap DSA | Craft & Code Club",
    description: "Trilha completa de aprendizado de algoritmos e estruturas de dados com recursos organizados sequencialmente.",
  }
};
```

**Note**: Keep titles concise and consistent with existing pages. No structured data (JSON-LD) needed - project doesn't currently use it.

---

## 6. Performance Optimization

**Question**: How to ensure roadmap page meets Core Web Vitals targets?

**Decision**: **Follow existing SSG (Static Site Generation) pattern**

**Rationale**:
- **Already Configured**: Project uses `output: "export"` in next.config.ts
- **Consistent Pattern**: All pages use SSG with no client-side fetching
- **Proven Performance**: Blog/events pages already meet Core Web Vitals

**Implementation Approach**:

1. **SSG Page Generation**:
   - Load YAML data at build time (not runtime)
   - Pre-render complete HTML during `next build`
   - No client components needed

2. **CSS Already Optimized**:
   - Tailwind CSS v4 with automatic purging
   - Project already configured correctly

3. **Minimal JavaScript**:
   - Use server components (default in App Router)
   - No hydration overhead for static content
   - Icons as inline SVG (lucide-react tree-shakes automatically)

**Expected Metrics** (matching existing pages):
- LCP: ~1.5s (static HTML)
- INP: < 50ms (minimal JS)
- CLS: 0 (fixed layout)

**Note**: No special performance configuration needed - follow existing page patterns.

---

## 7. Dark Mode Support

**Question**: How to implement dark mode for card timeline?

**Decision**: **Use existing next-themes + Tailwind dark mode pattern**

**Rationale**:
- **Already Configured**: Project uses `next-themes` with `attribute="class"`
- **ThemeProvider**: Already wrapped in `src/app/layout.tsx`
- **Consistent Styling**: Follow existing dark mode color patterns from blog/events

**Implementation** (follow existing patterns):
```tsx
// Use the same dark mode classes as blog/events pages
<div className="bg-white dark:bg-gray-900">  {/* Page background */}
  <div className="bg-white dark:bg-gray-800 shadow-md 
                  border border-gray-200 dark:border-gray-700">  {/* Cards */}
    <h3 className="text-gray-900 dark:text-white">  {/* Headings */}
    <p className="text-gray-600 dark:text-gray-300">  {/* Body text */}
  </div>
</div>
```

**Color Palette** (from existing pages):
- **Page Background**: `bg-white dark:bg-gray-900`
- **Card Background**: `bg-white dark:bg-gray-800`
- **Borders**: `border-gray-200 dark:border-gray-700`
- **Primary Text**: `text-gray-900 dark:text-white`
- **Secondary Text**: `text-gray-600 dark:text-gray-300`
- **Links/Accents**: `text-blue-600 dark:text-blue-400`

**Note**: No additional configuration needed - theme system already works.

---

## 8. Accessibility Considerations

**Question**: How to make timeline accessible to screen readers and keyboard users?

**Decision**: **Semantic HTML + ARIA landmarks**

**Implementation**:
```tsx
<main role="main" aria-label="Roadmap de DSA">
  <h1 className="sr-only">Algoritmos e Estruturas de Dados - Roadmap</h1>
  
  {categories.map((category, index) => (
    <section 
      key={category.title}
      aria-labelledby={`category-${index}`}
    >
      <h2 id={`category-${index}`}>{category.title}</h2>
      
      <ul role="list" aria-label={`Itens de ${category.title}`}>
        {category.items.map((item, itemIndex) => (
          <li key={itemIndex}>
            <article className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              
              {item.links && (
                <nav aria-label="Recursos relacionados">
                  {/* Links with descriptive aria-labels */}
                </nav>
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  ))}
</main>
```

**Keyboard Navigation**:
- All links focusable with Tab
- Skip to content link
- Proper focus indicators (Tailwind ring utilities)

---

## 9. Error Handling Strategy

**Question**: How to handle YAML validation errors gracefully?

**Decision**: **Fail-fast at build time with detailed messages**

**Implementation**:
```typescript
export function loadRoadmap() {
  try {
    const fileContents = fs.readFileSync('_content/roadmap/dsa.yml', 'utf8');
    const data = yaml.load(fileContents);
    const roadmap = RoadmapSchema.parse(data);
    return roadmap;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Roadmap validation failed:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      throw new Error('Invalid roadmap configuration. Check _content/roadmap/dsa.yml');
    }
    throw error;
  }
}
```

**Build Failure**: Next.js build will fail with clear error messages if YAML is invalid.

---

## 10. Content Authoring Workflow

**Question**: Best practices for editing YAML configuration?

**Decision**: **YAML schema documentation + VS Code extension**

**Recommendations**:

1. **YAML Structure Documentation**:
   - Create `_content/roadmap/README.md` with schema examples
   - Include validation rules and icon options

2. **VS Code YAML Support**:
   - Use `redhat.vscode-yaml` extension
   - Provides syntax highlighting and validation

3. **Example Template**:
```yaml
# _content/roadmap/dsa.yml
categories:
  - title: "Estruturas de Dados Básicas"
    items:
      - title: "Arrays e Listas"
        description: "Fundamentos de estruturas sequenciais"
        links:
          - icon: "book"
            title: "Documentação MDN"
            url: "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array"
            target: "_blank"
          - icon: "video"
            title: "Curso em Vídeo"
            url: "https://youtube.com/watch?v=..."
            target: "_blank"
```

---

## Summary of Decisions

| Area | Decision | Impact |
|------|----------|--------|
| Icons | lucide-react | +1.5KB bundle, modern design |
| YAML Parsing | js-yaml + Zod | Build-time validation, type safety |
| Layout | Flexbox timeline | Responsive, accessible |
| Navigation | Update root layout | Centralized, consistent |
| SEO | Metadata API + JSON-LD | Search engine optimization |
| Performance | SSG + code splitting | Meets Core Web Vitals |
| Dark Mode | Tailwind dark: variants | Theme consistency |
| Accessibility | Semantic HTML + ARIA | WCAG 2.1 AA compliant |
| Error Handling | Fail-fast at build | Content author clarity |
| Authoring | YAML docs + VS Code | Easy content editing |

---

## Next Steps

With all research complete, proceed to:
1. **Phase 1**: Create data model (data-model.md)
2. **Phase 1**: Define TypeScript interfaces (contracts/)
3. **Phase 1**: Write quickstart guide (quickstart.md)
4. **Phase 2**: Generate task list (tasks.md) - Use `/speckit.tasks` command

All NEEDS CLARIFICATION items have been resolved. ✅
