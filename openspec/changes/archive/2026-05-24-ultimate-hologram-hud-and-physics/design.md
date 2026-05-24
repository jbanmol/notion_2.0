## Context

NeoNotion's visual environment is client-side-only, vanilla ES6 modules. To achieve a deeper wow-factor and peak tactile immersion, we want to integrate structural, physical, and search refinements: a fullscreen orbital page map overlay, real-time typing speed particle acceleration in Focus Mode, a collapsible trace console panel, and matrix-scrambling decrypt animations inside the command search palette. 

## Goals / Non-Goals

**Goals:**
- Render a fullscreen holographic workspace map (`#neural-grid-graph-overlay`) using SVG laser links connecting glassmorphic document bubbles.
- Map WPM typing metric moving averages in `src/editor.js` to trigger particle acceleration inside `SnowSystem` in `src/focus.js`.
- Build a collapsible bottom trace terminal panel `#hud-diagnostic-terminal` that echoes autosaves, caret movement coordinates, and active audio frequencies.
- Integrate matrix cypher letter-scrambling resolution animations for search items inside the Command Palette.

**Non-Goals:**
- Tracking non-alphanumeric keystrokes for flow metrics.
- Supporting multi-branch custom particle canvases outside the focus background.
- Integrating external diagnostic reporting microservices.

## Decisions

### Decision 1: Dedicated GraphController inside src/graph.js
- **Rationale**: Keeps rendering logic isolated and modular. The graph overlay is instantiated in `app.js` and manages coordinate loops, Lucide icon initialisations, and SVG connectors in its own module.
- **Alternatives Considered**: Inlining inside app.js (violates modular design), third-party D3 maps (too heavy, zero-dependency is preferred).

### Decision 2: Keystroke Rolling Queue WPM Calculation
- **Rationale**: To get an accurate reading of "flow state," we'll store a rolling queue of keypress timestamps inside `src/editor.js`. On each keydown, we prune timestamps older than 60 seconds and divide the queue length by 5 to calculate WPM, scaling particles between a factor of `1.0` (idle) to `3.5` (hyper-flow typing speed).
- **Alternatives Considered**: Simple debounced delays.

### Decision 3: Collapsible HUD Terminal via CSS Flex and Global Logger
- **Rationale**: We'll define a global helper `window.app.log(message)` in `src/app.js` which appends log nodes inside the trace terminal DOM. This allows easy logging of caretaker coordinate shifts and save bytes from any module in the codebase.

## Risks / Trade-offs

- **[Risk] High-frequency particle acceleration overhead** → Mitigation: Only compute particle math inside the canvas `requestAnimationFrame` render loop, debouncing speed transitions.
- **[Risk] Text scrambling CPU spikes with multiple items** → Mitigation: Limit palette search items to top 8 and clear scrambling intervals on selection.
