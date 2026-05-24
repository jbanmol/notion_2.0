## Why

NeoNotion netrunners require a dedicated high-concentration focus state that isolates visual distractions while editing mission-critical log elements. Currently, the permanent folder sidebars and diagnostic layouts compete for screen space and mental focus during deep writing sessions. By introducing a distraction-free Focus Mode featuring slow-drifting lofi background auroras, digital atmospheric snow transitions, custom tactile synthesized key clicks, and a high-stakes floating intrusion timer HUD, we deliver an immersive hacking productivity environment.

## What Changes

- **Holographic Zen Mode Toggle**: Spawns a floating header selector and a global `Cmd+Shift+F` keyboard shortcut.
- **Distraction-Free Workspace Collapse**: Smoothly slides the folders sidebar completely out of view, dims the top utility header breadcrumbs, and dynamically centers and expands the editing column.
- **Ambient Cyberpunk Lo-Fi Canvas**: Activates a multi-layered scrolling aura backscreen (`#focus-ambient-bg`) featuring drifting HSL gradients, grid scanning overlays, and slow digital falling snow rain.
- **Tactile Key click Synthesizer**: Uses the browser **Web Audio API** to dynamically play highly tactile mechanical click sound effects when typing inside any editor block.
- **Mission Intrusion Timer HUD**: Integrates a floating Pomodoro countdown widget ticking from `25:00` with emergency visual alarm warnings (under 1:00) and double-chime secured notifications when the timer hits zero.

## Capabilities

### New Capabilities
- `focus-mode`: Holographic Zen focus toggle, atmospheric lo-fi backdrops, cybernetic key click synthesis, and a floating mission intrusion countdown HUD card.

### Modified Capabilities
<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- **index.html**: Adds background nebula divs, focus trigger buttons, and timer card widgets.
- **src/style.css**: Defines Zen collapse states, ambient radial auroras, snow rain keyframes, alarm flickering nodes, and select dropdown layouts.
- **src/app.js**: Integrates focus drive controllers.
- **src/focus.js [NEW]**: Instantiates audio click generators and countdown Pomodoro HUD widgets.
