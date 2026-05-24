# cyber-modals Specification

## Purpose
TBD - created by archiving change core-refinements. Update Purpose after archive.
## Requirements
### Requirement: Cyber-Styled Confirmation Modal
The system SHALL replace all native `alert()` and `confirm()` browser dialogs with a themed glassmorphism modal card via a `CyberModalService` singleton.

#### Scenario: Confirm modal shown for document deletion
- **WHEN** the user triggers a delete action for a document
- **THEN** a styled modal card SHALL appear with the message, a confirm button (neon-green), and a cancel button (neon-red), instead of a native browser dialog

#### Scenario: Confirm resolves true on acceptance
- **WHEN** the user clicks the confirm button in the modal
- **THEN** the Promise returned by `CyberModalService.confirm()` SHALL resolve to `true`

#### Scenario: Confirm resolves false on cancel or Escape
- **WHEN** the user clicks cancel or presses `Escape` while the modal is open
- **THEN** the Promise SHALL resolve to `false` and no destructive action SHALL occur

### Requirement: Cyber Alert Modal
The system SHALL provide a `CyberModalService.alert()` method for informational messages that require only an acknowledge action.

#### Scenario: Alert modal shown for system messages
- **WHEN** `CyberModalService.alert("message")` is called
- **THEN** a styled modal SHALL appear with the message and a single `ACKNOWLEDGED` button

