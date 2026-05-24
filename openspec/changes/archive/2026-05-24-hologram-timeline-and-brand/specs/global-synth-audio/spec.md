## ADDED Requirements

### Requirement: Global Audio click Synthesis
The system SHALL dynamically synthesize soft, refined mechanical keyboard click tones during text editing across all documents, irrespective of Focus Mode status.

#### Scenario: Typing plays soft click globally
- **WHEN** the user types characters inside any active text block outside of Focus Mode
- **THEN** the browser Web Audio API SHALL instantly play a subtle, soft-volumed mechanical click feedback chirp.

### Requirement: Global Auditory Silent Mute Toggle
The system SHALL provide a dedicated capsule silent toggle button in the header that instantly silences or unmutes all global sound synthesizers.

#### Scenario: Toggling audio mute state
- **WHEN** the user clicks the `#audio-mute-btn` button in the header utilities
- **THEN** the system SHALL toggle the sound state, visually update the button icon to indicate sound status, and instantly mute/unmute all synthesized keystroke tones.
