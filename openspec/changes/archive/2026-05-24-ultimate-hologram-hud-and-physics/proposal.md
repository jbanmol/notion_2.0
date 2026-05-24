## Why

To deliver an absolute premium, highly immersive workspace experience for peak-performance creators, NeoNotion requires deep visual and sensory feedback layers. This change establishes four advanced systems: a fullscreen **Holographic Workspace Map** (`NEURAL_GRID_GRAPH`), **Flow State Physics** particles (`FLOW_STATE_TELEMETRY`) driven in real-time by WPM, a collapsible **HUD Diagnostic Terminal** for system logs, and a highly aesthetic **Matrix Decryption** search solver. These additions convert static page management into an active, tactile cyberpunk deck.

## What Changes

- **Holographic Neural Grid Graph Overlay**:
  - Add a fullscreen `#neural-grid-graph-overlay` overlay displaying pages as glassmorphic orbital nodes orbiting a core `SYS_GATEWAY.EXE` router, bound by pulsing laser coordinates on an SVG canvas.
  - Clicking any node navigates directly to the page while triggering mechanical sound feedback.
- **Flow State WPM Particle Telemetry**:
  - Integrate real-time WPM calculation inside the editor keystroke queue.
  - Dynamically scale focus mode background particles (snow angle, descent velocity, count) based on active typing speed (e.g. idle leads to a gentle drift, rapid typing prompts a high-speed matrix cascade).
- **HUD Collapsible Diagnostic Terminal**:
  - Create a collapsible bottom-docked `#hud-diagnostic-terminal` console panel displaying monospace logs of caretaker indices, file sync diagnostics, and audio triggers in real-time.
- **Matrix Decryption search**:
  - Apply matrix-style random cypher letter-scrambling loops to command palette fuzzy matching results, quickly decrypting and resolving to clear titles upon load.

## Capabilities

### New Capabilities
- `neural-grid-graph`: Fullscreen absolute glassmorphic document node mapping linked by animated, glowing SVG canvas laser path coordinates.
- `flow-state-telemetry`: Dynamic particle physics speed, angle, and density scaling bound to real-time keystroke WPM typing metrics.
- `hud-diagnostic-terminal`: Collapsible bottom trace terminal panel echoing live system alerts, caret position logs, and sync events.
- `decrypt-matrix-search`: Cyber glyph character-scrambling visual decryption transitions inside the global fuzzy search palette.

### Modified Capabilities
<!-- No existing spec-level requirements are changing -->

## Impact

- **src/graph.js [NEW]**: High-fidelity fullscreen page correlation mapper, orbital bubble layouts, and click routing.
- **src/focus.js**: Refactor particle system algorithms inside `SnowSystem` to expose dynamic velocity parameters, and count controllers.
- **src/editor.js**: Add WPM calculating queues, event bindings for trace logs, and search list renderer hooks.
- **src/app.js**: Orchestrate `GraphController`, hook mute states, and wire collapsing console panel logic.
- **index.html**: Inject full-screen overlay coordinates, mute/unmute buttons, console panel, and visual grid overlay templates.
- **src/style.css**: Pulsing path keyframes, console scrollbar, scrambling spans, and custom HSL orbital glows.
