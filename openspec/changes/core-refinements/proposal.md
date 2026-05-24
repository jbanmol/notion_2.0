## Why

NeoNotion's cyberpunk aesthetic is compelling, but the core editing experience has critical gaps — no slash commands, broken drag-and-drop handles, native browser `alert()` dialogs, and a flat sidebar — that prevent it from being a genuinely useful productivity tool for peak-performance individuals who need to capture ideas, structure thoughts, and execute on them fast.

## What Changes

**Direction A — Editing that actually works:**
- **Slash command menu** (`/`) inline in any block — lets users instantly switch block type (text → H1, code, checklist, etc.) without leaving the keyboard
- **Block drag-and-drop reordering** — wires up the existing drag handle UI that currently renders but does nothing
- **Block type switcher** — right-click or hover menu to change an existing block's type in-place
- **Live word count + estimated read time** footer in the editor

**Direction B — Smarter sidebar & documents:**
- **Document metadata** — `createdAt` and `updatedAt` timestamps saved to state; "last modified" shown in sidebar on hover
- **Custom emoji/icon picker** for each page — replaces hardcoded icon-per-doc-ID logic with a user-selectable set
- **Sidebar search/filter** — a small inline search input filters the document list in real-time
- **Pinned documents** — star/pin a page so it always floats to the top of the sidebar

**Direction C — Visual polish:**
- **Styled cyber confirm modal** — replaces native browser `alert()` / `confirm()` dialogs with glassmorphism popup cards
- **Block insertion micro-animation** — new blocks slide in with a subtle neon-pulse entrance
- **Persistent mini-timer** — Pomodoro HUD decoupled from Focus Mode; accessible as a standalone widget in the header area
- **Audio selector hidden until focus mode is active** — reduces visual noise in normal mode

## Capabilities

### New Capabilities
- `slash-commands`: Inline `/` command menu for block type switching and quick actions
- `block-reorder`: Drag-and-drop block repositioning within a document
- `document-metadata`: Page timestamps, emoji icons, pin state stored and rendered in the sidebar
- `sidebar-filter`: Real-time document search and filter inside the sidebar navigation
- `cyber-modals`: Branded glassmorphism confirm/alert modal system replacing native dialogs
- `editor-enhancements`: Word count footer, block type switcher, block entrance animations
- `persistent-timer`: Pomodoro HUD available independently of Focus Mode

### Modified Capabilities
<!-- No existing spec-level requirements are changing — all additions are new capabilities -->

## Impact

- **src/editor.js**: Slash command detection, drag-and-drop event wiring, block type switching, word count calculation
- **src/sidebar.js**: Emoji picker, metadata rendering, inline search filter, pin/unpin logic
- **src/state.js**: Add `createdAt`, `updatedAt`, `icon` (emoji), `pinned` fields to document schema
- **src/focus.js**: Decouple Pomodoro HUD from focus toggle; hide audio selector outside focus mode
- **src/app.js**: Register `CyberModalService` globally; wire persistent timer
- **index.html**: Add slash command dropdown overlay, cyber modal template, word count bar, sidebar search input
- **src/style.css**: Slash command menu styles, modal animations, word count bar, block entrance keyframes, emoji picker
- **[NEW] src/modals.js**: Standalone `CyberModalService` — drop-in replacement for `alert()` / `confirm()`
