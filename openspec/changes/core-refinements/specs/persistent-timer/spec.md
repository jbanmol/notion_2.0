## ADDED Requirements

### Requirement: Timer Accessible Without Focus Mode
The system SHALL make the Pomodoro countdown timer available as a standalone persistent widget accessible from the header, independently of whether Focus Mode is engaged.

#### Scenario: Timer pill visible in header at all times
- **WHEN** the app is loaded
- **THEN** a compact timer pill SHALL be visible in the header bar showing the current timer state (idle/running/paused)

#### Scenario: Timer runs independently of focus mode toggle
- **WHEN** the user toggles Focus Mode off while a timer is running
- **THEN** the timer SHALL continue running and the compact header pill SHALL reflect the current remaining time

#### Scenario: Clicking timer pill expands full HUD
- **WHEN** the user clicks the compact timer pill in the header
- **THEN** the full mission-timer-hud floating card SHALL appear with all controls (Start, Pause, Reset)

### Requirement: Audio Selector Visibility Tied to Focus Mode
The system SHALL only show the audio profile selector in the header when Focus Mode is active.

#### Scenario: Audio selector hidden in normal mode
- **WHEN** Focus Mode is not active
- **THEN** the `#audio-profile-select` element SHALL NOT be visible in the header

#### Scenario: Audio selector appears when focus mode is engaged
- **WHEN** the user activates Focus Mode
- **THEN** the `#audio-profile-select` element SHALL become visible in the header with a smooth fade-in transition
