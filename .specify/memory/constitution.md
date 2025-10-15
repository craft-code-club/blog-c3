<!--
Sync Impact Report:
Version: 1.0.0 (Initial Constitution)
Modified Principles: N/A (Initial version)
Added Sections: All core sections
Removed Sections: N/A
Templates Status:
  ✅ plan-template.md - Aligned with constitution principles
  ✅ spec-template.md - Aligned with constitution principles  
  ✅ tasks-template.md - Aligned with constitution principles
  ✅ README.md - Consistent with project values
  ✅ CONTRIBUTING.md - Aligned with development workflow
Follow-up TODOs: None
-->

# Craft & Code Club Blog Constitution

## Core Principles

### I. Content-First Architecture

The blog exists to serve educational content about software engineering for the Brazilian developer community. Every technical decision MUST prioritize content accessibility, discoverability, and reader experience.

**Rules:**
- Content files (Markdown/YAML) are the single source of truth
- No database dependencies - file-based content management only
- Static Site Generation (SSG) is mandatory for maximum portability and performance
- Content MUST be independently editable without requiring code changes
- Support bilingual content (Portuguese primary, English secondary when applicable)

**Rationale:** File-based content ensures community members can contribute without backend infrastructure knowledge, enables version control of all content, and maintains deployment simplicity.

### II. Performance & Accessibility (NON-NEGOTIABLE)

The blog MUST be fast, accessible, and inclusive for all users regardless of device, connection speed, or abilities.

**Rules:**
- Core Web Vitals MUST meet "Good" thresholds (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- WCAG 2.1 AA compliance mandatory for all pages and components
- Images MUST use Next.js Image component with proper alt text and lazy loading
- Mobile-first responsive design required for all layouts
- Support for light/dark themes without layout shift
- No blocking third-party scripts in critical rendering path

**Rationale:** Brazilian internet connectivity varies significantly; performance directly impacts reach and inclusivity. Accessibility ensures all community members can learn regardless of abilities.

### III. Semantic Structure & SEO

Content MUST be structured for both human readers and search engines to maximize educational impact and community growth.

**Rules:**
- Proper semantic HTML hierarchy (single H1, logical H2-H6 progression)
- Metadata API used for all pages (title, description, OpenGraph, Twitter cards)
- Structured data (schema.org) for blog posts and events
- Clean, descriptive URLs following documented slug conventions
- Canonical URLs and proper robots.txt/sitemap.xml
- Internal linking between related posts and topics

**Rationale:** Effective SEO amplifies community impact by helping developers find quality educational content. Semantic structure improves comprehension and navigation.

### IV. Component Modularity

All UI components MUST be functional, reusable, and follow Next.js best practices.

**Rules:**
- Exclusively functional components with React hooks (no class components)
- Components in PascalCase, single responsibility principle
- Proper TypeScript typing for all props
- Server Components by default; Client Components only when interactivity required
- Proper `'use client'` directive placement
- Global components only for truly shared functionality

**Rationale:** Functional components align with modern React patterns, improve maintainability, and enable better tree-shaking and code splitting.

### V. CSS Framework: Tailwind CSS v4

All styling MUST use Tailwind CSS v4 with CSS-first configuration approach.

**Rules:**
- Use `@theme` directive for customizations (colors, spacing, fonts, breakpoints)
- No separate `tailwind.config.js` file - all configuration in CSS
- Utility-first classes for component styling
- Custom components defined in `@layer components` when needed
- Responsive design using Tailwind breakpoints
- Dark mode support via Tailwind's dark mode utilities
- Typography plugin for Markdown content styling

**Rationale:** Tailwind v4's CSS-first approach reduces build complexity, improves CSS variable integration, and maintains a single source of truth for styling.

### VI. Content Consistency & Standards

All blog posts and events MUST follow documented conventions for discoverability and quality.

**Rules:**
- Slug naming conventions MUST be followed (e.g., `dsa-topic.md`, `book-sd-topic.md`)
- Frontmatter schema strictly enforced (title, date, description, topics/authors for posts; title, date, time, location, type for events)
- Topics/tags used consistently across related content
- ISO date format (YYYY-MM-DD) mandatory
- Code snippets MUST use proper syntax highlighting
- Images require descriptive alt text
- Author attribution with GitHub links

**Rationale:** Consistent structure enables programmatic filtering, improves navigation, and maintains professional quality across diverse contributors.

### VII. Static Export & Deployment

The blog MUST be deployable as static HTML/CSS/JS to any hosting provider without server dependencies.

**Rules:**
- `output: "export"` configuration in next.config.ts is mandatory
- No server-side runtime dependencies (API routes, middleware, etc.)
- Custom image loader for static export compatibility
- All build outputs in `out/` directory
- Environment-agnostic builds (no runtime environment variables for content)
- Docker support for containerized deployment (optional)

**Rationale:** Static export ensures maximum portability, zero hosting costs options (GitHub Pages, Vercel, Netlify), improved security (no server attack surface), and simplified deployment.

## Technical Constraints

### Required Technology Stack
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4+ with CSS-first configuration
- **Content Processing**: gray-matter, remark, rehype ecosystem
- **Theme Management**: next-themes
- **Code Highlighting**: rehype-highlight

### Prohibited Patterns
- Class-based React components
- Runtime databases or CMSs requiring server infrastructure
- Client-side data fetching for content (use SSG only)
- Inline styles or CSS-in-JS libraries conflicting with Tailwind
- Blocking third-party scripts in `<head>`

### Performance Budgets
- Initial page load: < 3s on 3G connection
- JavaScript bundle: < 200KB (main bundle)
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay/Interaction to Next Paint (INP): < 200ms

## Development Workflow

### Content Contribution Process
1. Content proposal via GitHub issue (optional but encouraged for major topics)
2. Create Markdown file following slug conventions in `_content/posts/` or `_content/events/`
3. Include proper frontmatter with all required fields
4. Add images to `public/posts/` or `public/events/` if needed
5. Submit Pull Request with conventional commit message
6. Automated checks verify frontmatter schema and build success
7. Community review for technical accuracy and clarity
8. Merge to main triggers automatic deployment

### Code Contribution Process
1. Open GitHub issue describing bug or feature
2. Fork repository and create feature branch following `feat/description` or `fix/description`
3. Make changes following constitution principles
4. Ensure build passes (`npm run build`)
5. Run linter (`npm run lint`)
6. Commit using Conventional Commits format
7. Submit Pull Request with clear description
8. Automated checks verify build and linting
9. Code review for constitution compliance
10. Merge to main after approval

### Quality Gates
**All PRs MUST pass:**
- TypeScript compilation without errors
- ESLint with zero errors (warnings acceptable if justified)
- Successful static build (`next build`)
- No accessibility violations in changed components
- Conventional Commits format for commit messages

**Content PRs MUST additionally verify:**
- Valid frontmatter schema
- Slug follows documented conventions
- Images have alt text
- Links are valid (internal and external)

### Review Requirements
- **Content PRs**: 1 approval from community maintainer
- **Code PRs**: 1 approval from technical maintainer
- **Constitution changes**: 2 approvals from core team + community discussion

## Governance

### Constitution Authority
This constitution supersedes all other project documentation for architectural and process decisions. When conflicts arise, constitution principles take precedence.

### Amendment Process
1. Propose amendment via GitHub issue with clear rationale
2. Community discussion period (minimum 7 days)
3. Draft amendment in branch referencing issue
4. Update `LAST_AMENDED_DATE` and increment `CONSTITUTION_VERSION`
5. Document version bump rationale (MAJOR/MINOR/PATCH per semantic versioning)
6. Update affected templates and documentation
7. Create Sync Impact Report (as HTML comment at top of file)
8. Submit PR with 2+ core team approvals required
9. Merge amendment with documented migration plan if breaking

### Version Semantics
- **MAJOR**: Backward incompatible changes (removed principles, prohibited previously allowed patterns)
- **MINOR**: New principles, expanded sections, new mandatory requirements
- **PATCH**: Clarifications, wording improvements, non-semantic corrections

### Compliance Verification
- All PRs reviewed against constitution checklist
- Monthly constitution audit for drift detection
- Annual comprehensive review with community input
- Templates updated within 1 week of constitution changes

### Exceptions & Complexity Budget
Violations of constitution principles MUST be explicitly justified in a "Complexity Tracking" table within the relevant spec/plan document. Justifications must include:
1. Specific principle violated
2. Why the violation is necessary for the feature
3. What simpler alternatives were rejected and why

Unjustified violations block PR approval.

**Version**: 1.0.0 | **Ratified**: 2025-10-14 | **Last Amended**: 2025-10-14