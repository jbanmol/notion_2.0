## Purpose
Zen Focus Mode provides an immersive, distraction-free environment for writing and deep thinking, featuring ambient neon particle effects, keypress synthesizers, and a decoupled intrusion/Pomodoro countdown HUD.

## Requirements

### Requirement: Zen Workspace Focus Toggle
The system MUST collapse the folders sidebar tree, dim the header navigation breadcrumbs, and center the editor viewport when Focus Mode is engaged via `#focus-toggle-btn` or `Cmd+Shift+F` keyboard hotkeys.

#### Scenario: Focus mode engaged via click
- **WHEN** user clicks the `#focus-toggle-btn` button
- **THEN** the `.focus-mode-active` class is added to the body, sliding the sidebar out of view and re-centering the text canvas.

### Requirement: Cyber Acoustic Key click Synthesizer
The system SHALL dynamically synthesize crisp mechanical click sound effects using the native browser Web Audio API whenever the user types inside any editable document text field.

#### Scenario: Real-time keypress synthesis
- **WHEN** user presses any alphanumeric key inside an active contenteditable block
- **THEN** the Web Audio API synthesizer SHALL instantly generate a short, high-fidelity tactile click chirp.

### Requirement: Holographic Countdown Intrusion HUD
The system MUST display a floating countdown Pomodoro timer widget ticking from `25:00` minutes, featuring emergency warnings and completed alarm notifications.

#### Scenario: Intrusion time elapsed complete
- **WHEN** the countdown timer reaches exactly `00:00`
- **THEN** the audio engine SHALL trigger a double beep exfiltration alarm and display a fullscreen high-alert secured popup card.
