# Implementation Plan: DSA Roadmap Page

**Branch**: `001-add-algorithms-and` | **Date**: 2025-10-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-add-algorithms-and/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a dedicated Algorithms and Data Structures roadmap page accessible at `/roadmap/dsa` that displays a card-based vertical timeline of learning topics organized by categories. The roadmap content is stored in `_content/roadmap/dsa.yml` and rendered as a static page using Next.js SSG. The implementation includes navigation integration, responsive card layout with Tailwind CSS, YAML parsing with validation, and support for optional external resource links per item.

**Technical Approach**: Leverage Next.js App Router for the `/roadmap/dsa` route, use gray-matter/js-yaml for parsing the YAML configuration, create functional React components for timeline cards, apply Tailwind CSS for responsive styling, and implement build-time validation for data integrity.

## Technical Context

**Language/Version**: TypeScript 5+ / Node.js (for build time)
**Framework**: Next.js 15+ with App Router  
**Styling**: Tailwind CSS 4.x with CSS-first configuration
**Primary Dependencies**: 
- Content: js-yaml (YAML parsing and validation), zod (schema validation)
- UI: next-themes, @tailwindcss/typography
- Icons: lucide-react (tree-shakeable, TypeScript native)
**Storage**: File-based YAML at `_content/roadmap/dsa.yml` - NO database
**Content Types**: New roadmap type at `_content/roadmap/`
**Build Target**: Static Site Generation (SSG) with `output: "export"`
**Target Platform**: Static HTML/CSS/JS deployable to any CDN/static host
**Performance Goals**: 
- Core Web Vitals "Good" (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Initial load < 3s on 3G
- Main bundle < 200KB
**Constraints**: 
- Must work without server-side runtime
- No API routes or middleware
- Portuguese language content
- Mobile-first responsive card timeline (320px-1920px)
- Support light/dark theme switching
**Scale/Scope**: Single roadmap page with 5-15 categories, 30-100 items total, ~3-5 links per item average

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with `.specify/memory/constitution.md` principles:

- [x] **Content-First**: ✅ Uses file-based YAML at `_content/roadmap/dsa.yml` as single source of truth
- [x] **No Database**: ✅ No database dependencies - pure file-based content
- [x] **Static Export**: ✅ Compatible with `output: "export"` - SSG only, no runtime server
- [x] **Performance**: ✅ Static page generation meets targets; cards lazy-load if needed
- [x] **Accessibility**: ✅ Semantic HTML cards, keyboard navigation, ARIA labels for timeline
- [x] **Functional Components**: ✅ All components will be functional React with hooks
- [x] **Tailwind CSS v4**: ✅ Card timeline uses Tailwind utilities with `@layer components`
- [x] **SEO Structure**: ✅ Page metadata, semantic HTML (H1 for title, H2 for categories), proper heading hierarchy
- [x] **Content Standards**: ✅ YAML schema validation enforces required fields and structure

**Result**: ✅ ALL GATES PASSED - No constitution violations

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
# DSA Roadmap Feature Structure
src/
├── app/
│   ├── roadmap/
│   │   └── dsa/
│   │       └── page.tsx          # Main roadmap page component (SSG)
│   └── layout.tsx                # Update: Add roadmap nav link
├── components/
│   └── roadmap/
│       ├── RoadmapTimeline.tsx   # Timeline container component
│       ├── CategorySection.tsx   # Category heading + items group
│       ├── RoadmapCard.tsx       # Individual item card
│       └── ResourceLink.tsx      # Link component with icon
├── lib/
│   ├── roadmap.ts                # Load & parse YAML, validation logic
│   └── types/
│       └── roadmap.ts            # TypeScript interfaces for entities
└── styles/
    └── (use existing globals)    # Tailwind utilities sufficient

_content/
└── roadmap/
    └── dsa.yml                   # Roadmap configuration file

public/
└── icons/                        # Icon assets if needed (SVG)
```

**Structure Decision**: Extends existing Next.js blog structure with new `/roadmap/dsa` route in App Router. Components follow feature-based organization in `src/components/roadmap/`. Content follows established pattern with new `_content/roadmap/` directory. No new top-level directories needed.

## Complexity Tracking

*No constitution violations - all gates passed. No complexity justifications needed.*

---

## Phase Completion Summary

### Phase 0: Research ✅ COMPLETE

**Artifacts Generated**:
- `research.md` - Complete technical research with 10 decision points resolved

**Key Decisions**:
1. Icon Library: lucide-react (lightweight, TypeScript native)
2. YAML Parsing: js-yaml + Zod validation (build-time safety)
3. Layout: Flexbox card timeline (responsive, accessible)
4. Navigation: Root layout update (centralized)
5. SEO: Next.js Metadata API + JSON-LD structured data
6. Performance: SSG + code splitting strategies
7. Dark Mode: Tailwind dark: utilities
8. Accessibility: Semantic HTML + ARIA landmarks
9. Error Handling: Fail-fast at build time
10. Content Authoring: YAML docs + VS Code extension

**All NEEDS CLARIFICATION items resolved**: ✅

### Phase 1: Design & Contracts ✅ COMPLETE

**Artifacts Generated**:
- `data-model.md` - Complete entity definitions with Zod schemas
- `contracts/roadmap.types.ts` - TypeScript interfaces and validation
- `contracts/component-props.types.ts` - React component prop interfaces
- `contracts/README.md` - Contract documentation
- `quickstart.md` - Step-by-step implementation guide

**Data Model**:
- 4 entities: Roadmap → Category → Item → Link (hierarchical)
- Full Zod schema validation with detailed error messages
- TypeScript type inference from schemas
- YAML structure examples and validation rules

**Components Designed**:
- RoadmapTimeline (container)
- CategorySection (category grouping)
- RoadmapCard (item display)
- ResourceLink (external links with icons)

**Constitution Re-check**: ✅ ALL GATES STILL PASSED

### Phase 2: Tasks (Next Step)

**Command**: `/speckit.tasks`

This will generate `tasks.md` with:
- Task breakdown by user story (P1, P2, P3)
- Dependency management
- Parallel execution opportunities
- File-specific implementation steps

---

## Implementation Readiness

✅ **All prerequisites complete**  
✅ **Constitution compliant**  
✅ **Technical decisions documented**  
✅ **Data model finalized**  
✅ **Component architecture defined**  
✅ **Quickstart guide ready**

**Ready to proceed to task generation**: Run `/speckit.tasks` to create implementation task list.
