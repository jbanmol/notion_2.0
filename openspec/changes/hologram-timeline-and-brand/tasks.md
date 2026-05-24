## 1. Setup, Branding & State Enhancements

- [ ] 1.1 Extend `src/state.js` document state schema with a global sound mute setting (`globalAudioMuted`) persisted in localStorage.
- [ ] 1.2 Update initial seeding logic in `src/state.js` to pre-seed the interactive workspace logs template page: `📡 OPERATIONS_TIMELINE.LOG`.
- [ ] 1.3 Update the `<title>` tag in `index.html` to read `NΞONOTION ⚡` for optimized browser tab branding.
- [ ] 1.4 Upgrade the sidebar brand header in `index.html` with a glowing, glassmorphic circle processor logo container (`.logo-icon-container`).
- [ ] 1.5 Inject the `#audio-mute-btn` capsule button in the header utility bar of `index.html` to act as the global sound-toggle control.

## 2. Refined Global Synthesizer Audio

- [ ] 2.1 Refactor the `CyberAudio` sound engine in `src/focus.js` to add a `playSoftClick()` method, utilizing a dampening Web Audio gain node (0.12 gain) and tight wave decay parameters.
- [ ] 2.2 Wire the keydown event listener inside `src/editor.js` to play `audio.playSoftClick()` globally during block contenteditable editing, subject to the active mute state.
- [ ] 2.3 Wire the `#audio-mute-btn` button inside `src/app.js` to toggle local state, save to state managers, and instantly swap Lucide volume icons.

## 3. Hologram Timeline Layout & Diagnostic HUD

- [ ] 3.1 Design and append CSS rule sets inside `src/style.css` for `.block-hologram-timeline`, the vertical track timeline center nodes, gradient laser tracks, and the `#diagnostic-console` scroll interface.
- [ ] 3.2 Add the custom `hologram-timeline` block type renderer in `src/editor.js` which renders the split interactive console dashboard directly in the editor viewport.
- [ ] 3.3 Add node click listeners inside `src/editor.js` that fire mechanical audio chirps, trigger active classes on nodes, and execute real-time scrolling log streams inside the diagnostic console view.

## 4. Verification & Validation

- [ ] 4.1 Verify layout split, interactive timeline node transitions, scrolling logs, global key click synthesizer, silent toggle button, browser tab title, and sidebar logo visuals.
- [ ] 4.2 Run `openspec validate --all` to verify full spec-driven compliance across the whole codebase.
