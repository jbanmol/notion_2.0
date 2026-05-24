## ADDED Requirements

### Requirement: Collapsible bottom trace terminal panel
The system SHALL display a collapsible bottom trace terminal panel `#hud-diagnostic-terminal` styled with dark matrix neon hues and monospace fonts.

#### Scenario: Toggling console panel
- **WHEN** the user clicks the footer console tab or presses `Cmd+/`
- **THEN** the `#hud-diagnostic-terminal` panel SHALL slide up from the bottom or collapse back down.

### Requirement: Real-time telemetry log printing
The system SHALL intercept document saves, cursor movements, block insertions, and audio triggers and print them to the diagnostic terminal scroll feed in real-time.

#### Scenario: Typing logs keystrokes
- **WHEN** a block content change triggers a document auto-save
- **THEN** the trace console SHALL instantly output a green log line detailing exfiltrated save bytes and timestamps.
