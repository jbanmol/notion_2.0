# sidebar-filter Specification

## Purpose
TBD - created by archiving change core-refinements. Update Purpose after archive.
## Requirements
### Requirement: Sidebar Document Search Filter
The system SHALL provide a real-time search input inside the sidebar that filters the document list as the user types.

#### Scenario: Typing filters document list
- **WHEN** the user types into the sidebar search input
- **THEN** only documents whose titles match the query (case-insensitive substring) SHALL be displayed in the list

#### Scenario: Empty query shows all documents
- **WHEN** the sidebar search input is cleared or empty
- **THEN** all documents SHALL be displayed (pinned first)

#### Scenario: No results state
- **WHEN** the search query matches no documents
- **THEN** a `NO_NODES_FOUND` message in monospace font SHALL be displayed in place of the document list

