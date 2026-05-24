## Why

NeoNotion's visual depth can be significantly enhanced by providing an immersive workspace block type called a **Hologram Timeline**. This block type visualizes tasks, events, or plans in a two-column control-panel layout that triggers scrolling live-diagnostic terminal logs on the side. Additionally, user immersion is improved by extending click and keyboard synthesizers globally (in a refined, toggleable manner) and streamlining the upper navigation logo/title branding for a high-fidelity aesthetic.

## What Changes

- **Hologram Timeline Block Type**:
  - Add a new block format `hologram-timeline` to the block selection menu.
  - When active, splits the editor workspace into a two-column futuristic telemetry layout: a left-side interactive vertical timeline track and a right-side glassmorphic `DIAGNOSTIC_CONSOLE.EXE` console panel.
  - Timeline nodes feature custom icons, timestamps, status badges, and action triggers. Clicking a timeline node updates the side console with live-scrolling diagnostic telemetry logs.
- **Refined Key & UI Sound Synthesizer**:
  - Extend the existing `CyberAudio` synthesizers to trigger subtle click/typing sounds globally (outside Focus Mode), with a refined, soft volume profile to prevent auditory fatigue.
  - Add a quick-toggle header control or state parameter to easily silence or enable global auditory feedback.
- **Brand Identity & Logo Polish**:
  - Shorten and polish the browser tab title tag from the generic `NEONOTION // Cybernetic Workspace` to a highly aesthetic, short `NΞONOTION ⚡`.
  - Enhance the sidebar brand logo with a pulsing glassmorphic cyberpunk icon container and styled typography.

## Capabilities

### New Capabilities
- `hologram-timeline`: A full-screen split vertical timeline component with interactive nodes and a scrolling live-diagnostic terminal telemetry console.
- `global-synth-audio`: Refined, soft keyboard and UI click synthesizers enabled globally with a simple silent-toggle switch.
- `brand-aesthetic-upgrade`: High-fidelity, shortened browser title branding and a premium sidebar logo design.

### Modified Capabilities
<!-- No existing spec-level requirements are changing -->

## Impact

- **src/editor.js**: Add `hologram-timeline` block renderer, custom two-column grid layouts, diagnostic console logger, and click handlers.
- **src/focus.js**: Refactor `CyberAudio` sound triggers to support global trigger parameters, volume dampers, and interactive element hover sounds.
- **src/app.js**: Instantiate the brand controllers, header audio-silent controls, and bootstrap timeline actions.
- **index.html**: Inject timeline diagnostic console HTML structures, update `<title>` tag, and design the header audio-toggle button.
- **src/style.css**: Styles for timeline tracks, scrolling diagnostic logs, layout splits, and refined brand logo enhancements.
