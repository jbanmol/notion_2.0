## 1. Holographic Workspace Map (Node Core)

- [x] 1.1 Create `src/graph.js` to implement the `GraphController` managing fullscreen document orbiter coordinates and glowing SVG connector paths.
- [x] 1.2 Inject the fullscreen holographic map overlay container `#neural-grid-graph-overlay` in `index.html`.
- [x] 1.3 Instantiate `GraphController` in `src/app.js` and bind the sidebar actions toggle trigger.

## 2. Flow State WPM Particle Telemetry

- [x] 2.1 Refactor `SnowSystem` inside `src/focus.js` to add particle velocity and count scaling controllers (`setSpeedFactor`).
- [x] 2.2 Implement a rolling keypress timestamp queue inside `src/editor.js` to calculate a moving average of Words Per Minute (WPM).
- [x] 2.3 Wire the calculated WPM value from `src/editor.js` to dynamically scale particle velocity inside `src/focus.js` in real-time.

## 3. HUD Collapsible Diagnostic Terminal

- [x] 3.1 Inject the `#hud-diagnostic-terminal` collapsible console panel HTML inside `index.html`.
- [x] 3.2 Design and append terminal trace visual styles and flex layouts inside `src/style.css`.
- [x] 3.3 Create the global logger method `window.app.log(msg)` in `src/app.js` and hook caretaker, keystroke, and auto-save events to print telemetry logs.

## 4. Matrix Decryption Search

- [x] 4.1 Implement a glyph scrambling loop animation in `src/palette.js` to cycle matching search items before resolving to plain titles.

## 5. Verification & Sync

- [x] 5.1 Verify all four premium features interactively in a local test.
- [x] 5.2 Run `openspec validate --all` to confirm perfect OpenSpec spec-driven validation compliance.
