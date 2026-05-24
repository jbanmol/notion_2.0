## 1. Foundation — State Schema & Cyber Modal Service

- [x] 1.1 Extend `state.js` document schema with `createdAt`, `updatedAt`, `icon` (emoji), and `pinned` fields; add backfill logic for existing localStorage data.
- [x] 1.2 Update `state.createNewDocument()` to populate new metadata fields, and `updateDocumentBlocks()` / `updateDocumentTitle()` to refresh `updatedAt`.
- [x] 1.3 Create `src/modals.js` with `CyberModalService` — a Promise-based singleton with `confirm(message)` and `alert(message)` methods rendering glassmorphism modal cards.
- [x] 1.4 Add cyber modal HTML template (`#cyber-modal`) and CSS styles (glassmorphism card, neon confirm/cancel buttons, backdrop, fade-in animation) to `index.html` and `src/style.css`.
- [x] 1.5 Replace all native `alert()` and `confirm()` calls in `sidebar.js` and `state.js` with `CyberModalService.alert()` / `CyberModalService.confirm()`.

## 2. Direction A — Slash Command Menu

- [x] 2.1 Add slash command dropdown overlay HTML (`#slash-menu`) and CSS (positioned overlay, filtered list items, keyboard-active highlight, neon accent border) to `index.html` and `src/style.css`.
- [x] 2.2 In `src/editor.js`, detect `/` character via `input` event on `contenteditable` blocks; record caret position and show `#slash-menu` anchored to cursor bounding rect.
- [x] 2.3 Implement slash menu filtering: match typed query after `/` against command list (text, heading-1, heading-2, heading-3, code, checklist) and re-render filtered items.
- [x] 2.4 Implement keyboard navigation (↑/↓ to move selection, Enter to confirm, Escape to close and remove typed `/query`) inside the slash menu.
- [x] 2.5 On command selection, call `convertBlockType(blockIndex, newType)` in `editor.js` to update block type in state, clear the `/query` text, close the menu, and refocus the block.

## 3. Direction A — Block Drag-and-Drop Reorder

- [x] 3.1 Set `draggable="true"` on each `.editor-block` element in `createBlockElement()` and wire `dragstart`, `dragover`, `dragleave`, and `drop` event handlers in `src/editor.js`.
- [x] 3.2 On `dragstart`, store the dragged block's index in `DataTransfer`; add `.dragging` CSS class (reduced opacity, neon glow border) to the dragged element.
- [x] 3.3 On `dragover`, render a neon drop-indicator line between blocks to show insertion point; prevent default to allow drop.
- [x] 3.4 On `drop`, call atomic `state.moveBlock(fromIndex, toIndex)` (new method) which reorders the blocks array and saves; trigger `renderBlocks()` only after drop completes.
- [x] 3.5 Add `moveBlock(fromIndex, toIndex)` method to `state.js`; add `.dragging` and `.drop-target` CSS classes to `src/style.css`.

## 4. Direction A — Block Type Switcher & Word Count

- [x] 4.1 Add a block type indicator icon to each block's hover toolbar in `createBlockElement()`; clicking it opens a compact inline type-switcher dropdown.
- [x] 4.2 Implement `convertBlockType(index, newType)` in `editor.js` — updates block type in state, preserves existing content, triggers targeted block re-render.
- [x] 4.3 Add `#editor-footer` bar HTML below `.editor-scroller` in `index.html`; style it with subtle monospace text and neon accent word count in `src/style.css`.
- [x] 4.4 Implement `updateWordCount()` in `editor.js` — extracts plain text from all blocks, counts words, calculates read time at 200 wpm, and updates `#editor-footer`.
- [x] 4.5 Call `updateWordCount()` on every `blur` and `input` event in editor blocks, and on `loadDocument()`.
- [x] 4.6 Add `block-enter` CSS keyframe animation (`slideInFade`: `translateY(8px) opacity(0)` → `translateY(0) opacity(1)`, 200ms ease-out) and apply `.block-enter` class to newly inserted blocks.

## 5. Direction B — Document Metadata Sidebar

- [x] 5.1 Update `sidebar.js` `render()` to use `doc.icon` (emoji string) as the page icon instead of Lucide icon names; fall back to `📄` if unset.
- [x] 5.2 Add a curated emoji picker grid HTML and CSS (small dropdown, 40-emoji grid, hover highlight) to `index.html` and `src/style.css`.
- [x] 5.3 Wire emoji picker open/close and selection in `sidebar.js` — clicking the doc icon opens the picker; selecting an emoji calls `state.updateDocumentIcon(id, emoji)` (new state method).
- [x] 5.4 Add `updateDocumentIcon(id, emoji)` and `toggleDocumentPin(id)` methods to `state.js`.
- [x] 5.5 Add pin/unpin button to each sidebar document item; render pinned docs at top of list with a `📌` indicator and neon accent sidebar border.
- [x] 5.6 Show `updatedAt` relative timestamp on sidebar item hover (e.g., "2h ago") using a tooltip or inline subtle text.

## 6. Direction B — Sidebar Search Filter

- [x] 6.1 Add sidebar search input HTML (`#sidebar-search`) above the document list in `index.html`; style with glassmorphism inset, monospace font, neon focus border.
- [x] 6.2 Wire `input` event on `#sidebar-search` in `sidebar.js` to filter the rendered document list in real-time (case-insensitive title substring match).
- [x] 6.3 Render a `NO_NODES_FOUND` empty state message in monospace when search yields no results.

## 7. Direction C — Persistent Timer & Audio Selector Visibility

- [x] 7.1 Add a compact timer pill HTML (`#timer-pill`) to the header in `index.html` (shows `⏱ 25:00` idle state); style as a small capsule button.
- [x] 7.2 In `src/focus.js`, decouple `MissionHUD` timer logic from `FocusController` — timer starts/stops/resets independently; `FocusController` only controls ambient effects and audio.
- [x] 7.3 Wire `#timer-pill` click to toggle the full `#mission-timer-hud` visibility; update pill text to reflect live remaining time when timer is running.
- [x] 7.4 In `src/focus.js`, hide `#audio-profile-select` by default; show it (with fade-in CSS transition) only when `body.focus-mode-active` is present.
- [x] 7.5 Add `src/modals.js` import and `CyberModalService` instantiation to `src/app.js`.

## 8. Commit & Verify

- [x] 8.1 Open the app and test: slash `/` opens the menu, block type converts correctly, drag-and-drop reorders blocks.
- [x] 8.2 Verify emoji picker sets the doc icon, pin floats docs to top, sidebar search filters correctly.
- [x] 8.3 Verify delete confirmation uses the styled modal (no native `alert()`/`confirm()` visible).
- [x] 8.4 Verify word count footer updates live; timer pill in header shows running time independently of focus mode.
- [x] 8.5 Commit all changes to the `sdd_` branch.
