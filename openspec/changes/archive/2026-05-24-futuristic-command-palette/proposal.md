## Why

NeoNotion users (digital netrunners and cybernetic architects) require a centralized, high-efficiency navigation deck and dynamic AI assistant to operate rapidly within the cyber-workspace. Currently, switching between sector notes and initiating document summaries requires manual side-panel clicks, which slows down operational throughput. By introducing a holographic command palette, we enable sub-millisecond, keyboard-driven document switching and simulated neural AI operations (summarizing, task exfiltration, note correlation matching, and calendar matrices generation) to deliver an immersive, premium tech workspace experience.

## What Changes

- **Holographic Floating Radar Overlay**: Introduces a glassmorphic dashboard panel triggered globally via `Cmd+K` / `Ctrl+K` or a top utilities search button.
- **Fuzzy Node Switching**: Performs live filters across all document nodes in the workspace, enabling instant keyboard navigation jumps.
- **AI Neural Decryption Terminal**: Executes scrolling diagnostic print sequences within a console overlay interface to mock advanced satellite telemetry checks.
- **Dynamic AI Commands Suite**:
  - **Summarize Page Telemetry**: Compiles active text segments into a formatted abstract bulletin.
  - **Extract Action Checklist**: Isolates actionable checkboxes and appends them dynamically as editable checklist blocks inside the active page layout.
  - **Cross-Grid Semantic Correlation**: Visualizes correlation indexes referencing other workspace documents using glowing gauges.
  - **Inject Weekly Operations**: Deploys a pre-formatted 7-day operational table directly at the bottom of the active note.

## Capabilities

### New Capabilities
- `command-palette`: Dynamic fuzzy node selector overlay and simulated AI decryption terminal console actions.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- **index.html**: Adds command palette overlays, text search inputs, result nodes, and header search button widgets.
- **src/style.css**: Implements neon dropdown borders, keyframe slider transitions, scrolling terminal line spaces, and glass backdrop filters.
- **src/app.js**: Hooks up keyboard keydown interceptors and imports palette modules.
- **src/palette.js [NEW]**: Handles fuzzy filter routines, visual lists render cycles, and console print simulators.
