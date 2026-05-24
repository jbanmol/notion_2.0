# document-metadata Specification

## Purpose
TBD - created by archiving change core-refinements. Update Purpose after archive.
## Requirements
### Requirement: Document Timestamp Tracking
The system SHALL store `createdAt` and `updatedAt` Unix timestamps for every document and backfill these fields on load for any existing documents that lack them.

#### Scenario: New document gets timestamps
- **WHEN** the user creates a new document
- **THEN** `createdAt` and `updatedAt` SHALL both be set to the current timestamp

#### Scenario: Document updated timestamp refreshes
- **WHEN** the user edits a document's title or blocks
- **THEN** `updatedAt` SHALL be updated to the current timestamp

#### Scenario: Existing documents backfilled on load
- **WHEN** the app loads and finds documents in localStorage without `createdAt`
- **THEN** the system SHALL set `createdAt = updatedAt = Date.now()` for those documents silently

### Requirement: Document Emoji Icon
The system SHALL allow users to set a custom emoji as a document's icon, replacing hardcoded icon logic.

#### Scenario: Emoji picker opens on icon click in sidebar
- **WHEN** the user clicks the document icon in the sidebar
- **THEN** a small emoji picker grid SHALL appear offering a curated set of ~40 emojis

#### Scenario: Chosen emoji saved to document
- **WHEN** the user selects an emoji from the picker
- **THEN** the document's `icon` field SHALL be updated to the chosen emoji string and rendered in the sidebar

### Requirement: Document Pinning
The system SHALL allow users to pin documents so they always appear at the top of the sidebar list.

#### Scenario: Document pinned via sidebar action
- **WHEN** the user activates the pin action on a document
- **THEN** the document's `pinned` field SHALL be set to `true` and it SHALL float to the top of the sidebar list

#### Scenario: Pinned document visually distinguished
- **WHEN** a document has `pinned: true`
- **THEN** it SHALL be rendered with a pin indicator and neon accent border in the sidebar

