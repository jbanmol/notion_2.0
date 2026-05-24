# flow-state-telemetry Specification

## Purpose
TBD - created by archiving change ultimate-hologram-hud-and-physics. Update Purpose after archive.
## Requirements
### Requirement: Real-time keystroke WPM calculation
The system SHALL monitor the frequency of typing keydown events in editor editable areas to calculate a moving average of Words Per Minute (WPM).

#### Scenario: Typing calculates WPM
- **WHEN** the user types characters in any text block inside the active document
- **THEN** the editor controller SHALL update its moving WPM metric every few seconds based on characters typed.

### Requirement: Adaptive Focus Mode Background Particle Dynamics
The system SHALL scale focus mode background particles dynamically according to the calculated WPM.

#### Scenario: Flow state particle acceleration
- **WHEN** Focus Mode is engaged and WPM increases above 40
- **THEN** the `SnowSystem` canvas engine SHALL accelerate particle drift velocity, increase descent speed, and tilt particles to a slant slope to visually represent high flow state telemetry.

