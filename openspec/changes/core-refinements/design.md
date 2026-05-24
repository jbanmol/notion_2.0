## Context

NeoNotion is a client-side-only, vanilla ES6 module workspace (no build step, no framework). State is persisted to `localStorage`. The app has a modular component architecture: `state.js` → `sidebar.js` + `editor.js` + `palette.js` + `focus.js`, all orchestrated by `app.js`. Target users are peak-performance individuals: fast typers, idea capturers, deep workers who live in their notes app and expect keyboard-first, zero-friction interactions.

The current pain points are all fixable without architectural upheaval — the existing component boundaries are clean. The biggest risk is the editor, which currently full-re-renders on every state save (`renderBlocks()` wipes and rebuilds DOM). Adding drag-and-drop and slash commands requires careful coordination with this re-render cycle.

## Goals / Non-Goals

**Goals:**
- Slash command menu for instant block type switching (keyboard-first)
- Drag-and-drop block reordering using HTML5 native DnD API (already has handles)
- Block type switcher on existing blocks (right-click context or hover menu)
- Live word count + read time estimation in a subtle editor footer
- Document metadata: `createdAt`, `updatedAt`, `icon` (emoji string), `pinned` boolean
- Emoji icon picker for page identity
- Sidebar inline search filter (no extra page/route needed)
- Pinned documents float to sidebar top
- `CyberModalService` — global singleton replacing all `alert()`/`confirm()` calls
- Block entrance micro-animation on block creation/insertion
- Decouple Pomodoro timer from Focus Mode toggle
- Audio selector visible only when focus mode is active

**Non-Goals:**
- Server sync, multi-user, or real-time collaboration
- Full rich text formatting (bold, italic, links) — too complex for this scope
- Native drag-and-drop across documents
- A full emoji search library — a curated set of ~40 relevant emojis is enough

## Decisions

### Decision 1: Slash Command — Floating Dropdown Overlay (not inline DOM)
- **Rationale**: Inserting a DOM node inside a `contenteditable` to render the menu causes focus loss bugs across all major browsers. A positioned overlay `div` attached to `document.body` and tracked to the cursor's bounding rect is the universally reliable pattern (how Linear, Notion, and Craft all do it).
- **Alternatives Considered**: `<datalist>` — too visually limited. CSS popover — poor keyboard control. Inline DOM injection — focus and caret position bugs.

### Decision 2: Drag-and-Drop — HTML5 Native DnD (no library)
- **Rationale**: The drag handle UI is already rendered. HTML5 `draggable` + `dragstart/dragover/drop` events are natively supported, zero-dependency, and sufficient for vertical block reordering in a single-column list. `DataTransfer` stores the dragged block index.
- **Alternatives Considered**: Third-party sortable libraries — adds build-step complexity and bundle size to a zero-dependency project. Pointer events + custom physics — overkill.

### Decision 3: `CyberModalService` — Promise-based Singleton
- **Rationale**: Replacing `alert()`/`confirm()` requires a synchronous-feeling API for existing callers. A Promise-based singleton (`CyberModalService.confirm("message").then(ok => ...)`) is the cleanest drop-in that preserves call-site simplicity while delivering async styled UI.
- **Alternatives Considered**: Callback-based — works but less ergonomic in async code. Custom Events — over-engineered for this use case.

### Decision 4: Document Metadata — State Schema Migration with Fallback
- **Rationale**: Existing `localStorage` data doesn't have `createdAt`, `updatedAt`, `icon`, or `pinned`. On load, `state.js` will backfill these fields with sensible defaults (`createdAt = Date.now()`, `pinned = false`, `icon = '📄'`) for any document that lacks them. No data loss, no migration prompt needed.

### Decision 5: Persistent Timer — Separate from Focus Mode
- **Rationale**: Users discovered the timer is useful independently. The `MissionHUD` in `focus.js` will be split: `TimerController` (pure countdown logic, always available) and `FocusController` (ambient effects only). A compact timer pill will be added to the header that is always visible but minimal until activated.

## Risks / Trade-offs

- **[Risk] Re-render wipes drag state** — `renderBlocks()` rebuilds the DOM on every save, breaking mid-drag. → Mitigation: Implement `moveBlock(fromIndex, toIndex)` as an atomic state mutation that triggers a re-render only *after* drop completes, never during.
- **[Risk] Slash command positioning near viewport edge** — cursor near the bottom could clip the dropdown below the fold. → Mitigation: Detect if dropdown would overflow and flip it upward (`transform-origin: bottom`).
- **[Risk] `contentEditable` slash detection conflicts with IME** — on mobile/international keyboards, composition events fire before `keydown`. → Mitigation: Use `input` event to detect `/` character, not `keydown`.
- **[Risk] localStorage schema mismatch** — new metadata fields on old data. → Mitigation: Backfill logic on load (Decision 4) handles this silently.

## Open Questions
- Should pinned documents be visually distinguished with a special neon accent color in addition to floating to the top?
- For the emoji picker, should we support the user typing to filter emojis, or just a scrollable grid of ~40 curated icons?
