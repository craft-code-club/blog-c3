---
description: "Implementation tasks for DSA Roadmap feature"
---

# Tasks: DSA Roadmap Feature

**Input**: Design documents from `/specs/001-add-algorithms-and/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in specification - implementation only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- Next.js App Router: `src/app/`
- React components: `src/components/roadmap/`
- Utility functions: `src/lib/`
- Type definitions: `src/lib/types/`
- Content files: `_content/roadmap/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create foundational structure

- [ ] T001 Install required npm dependencies: `js-yaml`, `zod`, `lucide-react`
- [ ] T002 [P] Install TypeScript type definitions: `@types/js-yaml`
- [ ] T003 [P] Create roadmap components directory at `src/components/roadmap/`
- [ ] T004 [P] Create types directory at `src/lib/types/`
- [ ] T005 [P] Create content directory at `_content/roadmap/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type definitions and data loading that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create roadmap type definitions with Zod schemas in `src/lib/types/roadmap.ts` (LinkSchema, RoadmapItemSchema, RoadmapCategorySchema, RoadmapSchema)
- [ ] T007 Create YAML loader with validation in `src/lib/roadmap.ts` (loadDSARoadmap function with error handling)
- [ ] T008 Create initial DSA roadmap content file at `_content/roadmap/dsa.yml` with at least 2 categories and 3+ items

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View DSA Roadmap Page (Priority: P1) 🎯 MVP

**Goal**: Display a functional roadmap page at `/roadmap/dsa` with all content, categories, items, and links properly rendered in a card-based vertical timeline layout

**Independent Test**: Navigate to `/roadmap/dsa` and verify:
- Page loads successfully
- All categories display with titles
- All items show title, description, and links (if present)
- Cards are visually organized in vertical timeline
- Responsive layout works on mobile (320px) to desktop (1920px)
- Light and dark themes both work

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create ResourceLink component in `src/components/roadmap/ResourceLink.tsx` (renders Link entity with icon, title, clickable URL, target handling)
- [ ] T010 [P] [US1] Create RoadmapCard component in `src/components/roadmap/RoadmapCard.tsx` (renders RoadmapItem with title, description, optional links using ResourceLink)
- [ ] T011 [US1] Create CategorySection component in `src/components/roadmap/CategorySection.tsx` (renders RoadmapCategory with heading, timeline dots, items as RoadmapCards)
- [ ] T012 [US1] Create RoadmapTimeline component in `src/components/roadmap/RoadmapTimeline.tsx` (renders complete Roadmap with vertical timeline line, maps categories to CategorySection components)
- [ ] T013 [US1] Create DSA roadmap page component at `src/app/roadmap/dsa/page.tsx` (loads roadmap with loadDSARoadmap, renders RoadmapTimeline, includes page metadata)
- [ ] T014 [US1] Add page metadata (title, description, keywords, OpenGraph, Twitter cards) in `src/app/roadmap/dsa/page.tsx` following existing blog page pattern
- [ ] T015 [US1] Verify responsive layout (mobile 320px, tablet 768px, desktop 1920px) and dark mode styling for all components

**Checkpoint**: At this point, User Story 1 should be fully functional - roadmap page displays all content with proper styling

---

## Phase 4: User Story 2 - Navigate to Roadmap from Main Menu (Priority: P2)

**Goal**: Add discoverable navigation link to DSA roadmap in main blog navigation menu so readers can easily find and access the roadmap

**Independent Test**: 
- Look at navigation menu on any page - roadmap link is visible
- Click roadmap link - navigates to `/roadmap/dsa`
- Verify mobile menu includes roadmap link
- Desktop menu includes roadmap link

### Implementation for User Story 2

- [ ] T016 [US2] Add roadmap navigation link to mobile menu section in `src/app/layout.tsx` (add Link component after "Eventos" link, before "Sobre" link)
- [ ] T017 [US2] Add roadmap navigation link to desktop menu section in `src/app/layout.tsx` (add Link component after "Eventos" link, before "Sobre" link)
- [ ] T018 [US2] Verify navigation link text is "Roadmap DSA" with proper styling classes matching existing links
- [ ] T019 [US2] Test navigation from homepage, blog page, and events page to roadmap

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - roadmap is discoverable and accessible from navigation

---

## Phase 5: User Story 3 - Configure Roadmap Content (Priority: P3)

**Goal**: Enable blog admins to easily maintain roadmap by editing a single YAML file, with build-time validation ensuring data integrity

**Independent Test**: 
- Modify `_content/roadmap/dsa.yml` (add category, add item, change description, add link)
- Run `npm run build`
- Verify changes appear on roadmap page
- Test invalid data (missing required fields) triggers clear build errors

### Implementation for User Story 3

- [ ] T020 [US3] Create roadmap content documentation at `_content/roadmap/README.md` (document YAML schema, required fields, validation rules, icon options, example structures)
- [ ] T021 [US3] Expand `_content/roadmap/dsa.yml` with comprehensive content (aim for 5+ categories, 30+ items total, various link configurations)
- [ ] T022 [US3] Test build-time validation with these invalid scenarios: (1) missing category title, (2) missing item description, (3) invalid URL format without protocol, (4) empty items array in category, (5) invalid target value. Verify each produces clear error message with field path
- [ ] T023 [US3] Document content authoring workflow in `_content/roadmap/README.md` (how to add categories, how to add items, how to configure links with different targets)
- [ ] T024 [US3] Verify all edge cases work: items without links, categories with many items (15+), long descriptions (400+ chars), mixed target attributes

**Checkpoint**: All user stories should now be independently functional - roadmap is viewable, navigable, and maintainable via YAML config

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall quality

- [ ] T025 [P] Add YAML validation script at `scripts/validate-roadmap.ts` for local testing before build
- [ ] T026 [P] Verify all Tailwind classes are properly applied and responsive breakpoints work correctly
- [ ] T027 [P] Test accessibility: keyboard navigation through all links, screen reader compatibility, proper ARIA labels
- [ ] T028 [P] Performance check: verify page loads under 3s on 3G, bundle size under 200KB, Core Web Vitals green
- [ ] T029 Update project README.md with roadmap feature documentation (how to access, how to edit content)
- [ ] T030 Run complete quickstart.md validation checklist to ensure all acceptance criteria met
- [ ] T031 [P] Add `/roadmap/dsa` URL to sitemap.xml or verify Next.js auto-generation includes App Router pages for SEO discoverability

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational (Phase 2) completion
  - User Story 1 (P1): Can start after Phase 2 - Independent
  - User Story 2 (P2): Can start after Phase 2, but needs Phase 3 complete for meaningful testing
  - User Story 3 (P3): Can start after Phase 2 - Independent (but requires Phase 3 for visual verification)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ FULLY INDEPENDENT
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Practically needs US1 complete to test navigation target
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories for implementation, needs US1 for verification ✅ INDEPENDENTLY TESTABLE

### Within Each User Story

**User Story 1**:
- T009 (ResourceLink) and T010 (RoadmapCard) can run in parallel [P]
- T011 (CategorySection) depends on T010 completing
- T012 (RoadmapTimeline) depends on T011 completing
- T013 (Page component) depends on T012 completing
- T014-T015 can follow T013

**User Story 2**:
- T016 and T017 can run in parallel [P]
- T018-T019 follow after both navigation links added

**User Story 3**:
- T020 and T021 can run in parallel [P]
- T022-T024 follow sequentially for validation testing

### Parallel Opportunities

- **Phase 1**: All tasks (T001-T005) can run in parallel [P]
- **Phase 2**: T006 and T007 should be sequential (types before loader), T008 can be parallel with T007
- **Phase 3 (US1)**: T009 and T010 can run in parallel
- **Phase 4 (US2)**: T016 and T017 can run in parallel (mobile and desktop nav)
- **Phase 5 (US3)**: T020 and T021 can run in parallel
- **Phase 6**: T025, T026, T027, T028, T031 can all run in parallel [P]
- **Different User Stories**: If team capacity allows, US1 and US3 can be worked on simultaneously (both truly independent)

---

## Parallel Example: User Story 1

```bash
# Launch models/components in parallel:
Task: "Create ResourceLink component in src/components/roadmap/ResourceLink.tsx"
Task: "Create RoadmapCard component in src/components/roadmap/RoadmapCard.tsx"

# Then build up the hierarchy:
Task: "Create CategorySection component" (after RoadmapCard completes)
Task: "Create RoadmapTimeline component" (after CategorySection completes)
Task: "Create page component" (after RoadmapTimeline completes)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T008) - **CRITICAL CHECKPOINT**
3. Complete Phase 3: User Story 1 (T009-T015)
4. **STOP and VALIDATE**: 
   - Navigate to `/roadmap/dsa`
   - Verify all content displays
   - Test responsive layout
   - Test dark mode
5. Deploy/demo if ready - **MVP COMPLETE** ✅

### Incremental Delivery

1. **Foundation**: Phase 1 + Phase 2 (T001-T008) → Types and loader ready
2. **MVP Release**: Add Phase 3 (T009-T015) → Test independently → Deploy/Demo
   - Value: Readers can view complete DSA roadmap
3. **Discoverability Release**: Add Phase 4 (T016-T019) → Test independently → Deploy
   - Value: Readers can find roadmap from navigation
4. **Maintainability Release**: Add Phase 5 (T020-T024) → Test independently → Deploy
   - Value: Admins can easily update content
5. **Polish Release**: Add Phase 6 (T025-T030) → Final quality pass → Deploy
   - Value: Production-ready quality

### Parallel Team Strategy

With multiple developers:

1. **All Together**: Complete Phase 1 + Phase 2 (Setup + Foundation)
2. **Once Foundation Done** (after T008):
   - **Developer A**: User Story 1 (T009-T015) - Primary focus
   - **Developer B**: User Story 3 (T020-T024) - Can work independently
   - **Developer C**: Prepare User Story 2 tasks, help with testing
3. **Sequential Integration**:
   - Merge US1 first (MVP)
   - Merge US2 (adds navigation)
   - Merge US3 (adds content docs)
   - Run Phase 6 polish together

### Single Developer Strategy

Work in priority order:
1. Phase 1 → Phase 2 (foundation)
2. Phase 3 (US1 - MVP) → validate independently
3. Phase 4 (US2 - navigation) → validate independently  
4. Phase 5 (US3 - content management) → validate independently
5. Phase 6 (polish)

---

## Task Summary

### Total Tasks: 31

**By Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 3 tasks ⚠️ BLOCKS ALL STORIES
- Phase 3 (US1 - MVP): 7 tasks 🎯
- Phase 4 (US2): 4 tasks
- Phase 5 (US3): 5 tasks
- Phase 6 (Polish): 7 tasks

**By User Story**:
- User Story 1 (View Roadmap): 7 implementation tasks
- User Story 2 (Navigation): 4 implementation tasks
- User Story 3 (Configuration): 5 implementation tasks

**Parallel Opportunities Identified**: 16 tasks marked [P]

**Independent Test Criteria**:
- US1: Navigate to `/roadmap/dsa` and verify full rendering
- US2: Click navigation link and reach roadmap page
- US3: Edit YAML and verify changes appear after build

**Suggested MVP Scope**: 
- Phase 1 (Setup)
- Phase 2 (Foundational)
- Phase 3 (User Story 1 only)
- **Total: 15 tasks for MVP**

---

## Validation Checklist

At completion of all tasks, verify:

- [ ] All npm dependencies installed and working
- [ ] Type definitions created with Zod validation
- [ ] YAML loader with error handling working
- [ ] All React components created and rendering
- [ ] Page accessible at `/roadmap/dsa`
- [ ] Navigation links added to mobile and desktop menus
- [ ] Content documentation created
- [ ] Build-time validation catches errors
- [ ] Responsive design works (320px to 1920px)
- [ ] Dark mode works properly
- [ ] Links open with correct target behavior
- [ ] Accessibility tested (keyboard navigation, screen reader)
- [ ] Performance meets Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] All edge cases handled (items without links, long descriptions, many categories)

---

## Format Validation

✅ All tasks follow required format:
- Checkbox: `- [ ]`
- Task ID: Sequential (T001-T030)
- [P] marker: Present for parallelizable tasks
- [Story] label: Present for all user story tasks (US1, US2, US3)
- Description: Includes file paths and clear actions

---

## Notes

- No tests requested in specification - implementation tasks only
- [P] tasks can run in parallel (different files, no blocking dependencies)
- [Story] labels ensure traceability to requirements in spec.md
- Each user story is independently completable and testable
- MVP can be deployed after Phase 3 completion
- Foundational phase (Phase 2) is CRITICAL - blocks all user stories
- File paths follow Next.js App Router conventions from plan.md
- All tasks validated against constitution (content-first, SSG, no database)
