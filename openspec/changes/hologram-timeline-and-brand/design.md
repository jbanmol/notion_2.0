## Context

NeoNotion currently supports normal content blocks (text, headings, checkboxes, code blocks) and a client-side synthesised `CyberAudio` engine. The user interface can feel visually static when writing large plans. We want to introduce a highly interactive, dual-pane **Hologram Timeline** block that acts as a cockpit/command center for notes. We also want to expand sensory feedback by introducing a global soft mechanical keypress click sound, manageable via a global silent/mute switch, and clean up the branding to feel even more professional and polished.

## Goals / Non-Goals

**Goals:**
- Implement a two-column `hologram-timeline` block renderer in the workspace.
- Pre-seed a complete template page showing off the timeline capabilities (e.g. `📡 OPERATIONS_TIMELINE.LOG`).
- Render a vertical glowing HSL gradient laser track connecting interactive node cards.
- Display a right-hand `#diagnostic-console` console panel with scrolling, animated diagnostic outputs that change based on the active timeline card click.
- Wire soft mechanical typing keypress sounds globally (across all editor blocks, outside of focus mode).
- Create a global audio-mute/sound-toggle button in the header utilities bar.
- Refine browser tab title to `NΞONOTION ⚡` and upgrade the sidebar brand layout with premium styling.

**Non-Goals:**
- Real-time multiplayer synchronization of timeline clicks.
- Adding arbitrary audio uploads or custom MP3 triggers.
- Multi-column editor layout support for arbitrary blocks (layout split is constrained only to the `hologram-timeline` block type).

## Decisions

### Decision 1: Hologram Timeline dual-pane split via CSS Grid
- **Rationale**: To prevent breaking the modular vertical single-column block model in `src/editor.js`, the `hologram-timeline` block will render as a single parent block element (`.block-hologram-timeline`) but will be styled with `display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px;` in CSS. This keeps editor rendering extremely clean while giving a rich, full-screen control panel interface.
- **Alternatives Considered**: Floating sidebars or full overlay modals. Grid layout is highly integrated and superior because it sits directly in the content canvas, making the notes themselves interactive.

### Decision 2: Global Keypress Sound integration in the central key event hub
- **Rationale**: The existing key listeners in `src/editor.js` can simply check a global audio flag. We'll introduce `audio.playSoftClick()` in the `CyberAudio` class within `src/focus.js` using Web Audio API gain nodes set to a lower amplitude (~0.12 gain vs. ~0.4 Focus mode click gain) and shorter decay to keep keyboard typing clicks delicate and refined.
- **Alternatives Considered**: Hooking into focus mode triggers. Separate listeners in app.js. Centralizing in editor keydown handlers is cleaner and prevents double-clicks.

### Decision 3: Mute Toggle persistent in LocalStorage
- **Rationale**: Persisting the sound setting in `state.js` ensures that users who prefer silence don't have to click mute every single time the application is refreshed.
- **Alternatives Considered**: Session-only variables.

## Risks / Trade-offs

- **[Risk] High-frequency typing audio congestion** → Mitigation: Web Audio API handles rapid sound scheduling cleanly, but we will clamp or debounce synthesizer node creation to prevent clipping and CPU overhead.
- **[Risk] Layout breakage on narrow mobile viewport widths** → Mitigation: Use CSS media queries to collapse the timeline grid from `1fr 1.2fr` into a single vertical stack on mobile screens (`max-width: 768px`).
