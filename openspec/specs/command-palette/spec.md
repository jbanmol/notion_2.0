# command-palette Specification

## Purpose
TBD - created by archiving change futuristic-command-palette. Update Purpose after archive.
## Requirements
### Requirement: Keyboard and Button Activation
The system SHALL trigger the command palette view on `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) keyboard events, or when clicking the `#search-btn` search button.

#### Scenario: Palette activation via hotkey
- **WHEN** user presses `Cmd+K`
- **THEN** the `#command-palette` overlay modal SHALL be displayed and focus SHALL transition to the search input field.

#### Scenario: Palette activation via button click
- **WHEN** user clicks the `#search-btn` button in the header utilities
- **THEN** the `#command-palette` overlay modal SHALL be displayed and focus SHALL transition to the search input field.

### Requirement: Fuzzy Page Node Navigation
The system SHALL dynamically query the document tree using character strings typed inside the command palette search input and navigate to the selected document record.

#### Scenario: Node switching from the command overlay
- **WHEN** user inputs "runner", selects the matching "NEON_RUNNER_CREDENTIALS" node from the list, and presses `Enter`
- **THEN** the active document in the state manager SHALL switch to the runner credentials node, the sidebar list and main workspace editor SHALL re-render, and the command palette overlay SHALL close.

### Requirement: Neural AI Operations Console
The system SHALL display an immersive, animated terminal diagnostics console overlay when an AI operation is selected, executing simulated telemetry checks before presenting the parsed information output.

#### Scenario: AI task exfiltration and workspace injection
- **WHEN** user executes the "AI: Extract Core Action Items" command, allows the console print log sequence to finish, and clicks the "INJECT_TO_PAGE" action button
- **THEN** the exfiltrated checklist blocks SHALL be appended directly to the active document's blocks array, the page editor SHALL re-render the active canvas, and the console overlay modal SHALL close.

#### Scenario: AI weekly operations inject
- **WHEN** user executes the "AI: Inject Weekly Operations Plan" command, allows the console print log sequence to finish, and clicks the "INJECT_MATRIX_TABLE" action button
- **THEN** the generated 7-day operations scheduler table blocks SHALL be appended directly to the active document's blocks array, the page editor SHALL re-render the active canvas, and the console overlay modal SHALL close.

