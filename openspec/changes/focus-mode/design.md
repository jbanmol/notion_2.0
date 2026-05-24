## Context

The distraction-free writing environment (Focus Mode) requires a combination of high-fidelity client-side audio synthesis, hardware-accelerated CSS animations, and reactive ticking timers. We need to implement a dedicated, modular ES6 script `src/focus.js` and extend `src/style.css` to handle collapsing workspace states, slow-drifting backdrops, and mechanical typing sounds completely locally without third-party dependencies.

## Goals / Non-Goals

**Goals:**
- Implement Zen collapse triggers hiding folders sidebars and breadcrumbs headers.
- Create customizable Web Audio click oscillators producing Mech click, Vaporwave chime, Dampened bass, and Static glitch profiles.
- Design drifting HSL nebulas and falling digital snow overlays.
- Build floating Pomodoro intrusion timer HUDs with play/pause/reset controls.

**Non-Goals:**
- Playing heavy MP3 soundboards (strictly synthesized waveforms).
- Synchronization across remote databases.

## Decisions

### Decision 1: Custom Web Audio API Synthesizer (Oscillators & Noise Buffers)
- **Rationale**: Relying on local audio synthesis rather than loading `.mp3` click tracks ensures absolute stability, offline operation, zero network loading latency, and gives us complete modular control over high-pass envelopes, sine sweeps, and white noise decays.
- **Alternatives Considered**: Fetching audio clicks via CDN links. Rejected due to CORS issues, buffering delays, and network failure vulnerabilities.

### Decision 2: CSS Transition Keyframe Classes (`.focus-mode-active`)
- **Rationale**: Toggling body class states allows the browser to perform hardware-accelerated grid shifts and sidebar translations (`transform: translateX(-320px)`), which maintains absolute fluid responsiveness without layout thrashing.

## Risks / Trade-offs

- **[Risk] Browser security restrictions blocking audio contexts before interactions**
  - *Mitigation*: Automatically warm up and resume the `AudioContext` instance whenever the user triggers the `#focus-toggle-btn` selector button or clicks inside the viewport.
