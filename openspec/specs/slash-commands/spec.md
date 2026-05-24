# slash-commands Specification

## Purpose
TBD - created by archiving change core-refinements. Update Purpose after archive.
## Requirements
### Requirement: Slash Command Menu Activation
The system SHALL display a floating command menu overlay when a user types `/` as the first character of an empty block or after whitespace in a `contenteditable` block.

#### Scenario: Menu opens on slash key
- **WHEN** the user types `/` inside a block content area
- **THEN** a positioned floating dropdown SHALL appear below the cursor listing available block type commands

#### Scenario: Menu filters on subsequent typing
- **WHEN** the user types characters after `/` (e.g., `/he`)
- **THEN** the dropdown SHALL filter to only show commands matching the typed query (e.g., `heading-1`, `heading-2`)

#### Scenario: Menu dismissed on Escape
- **WHEN** the user presses `Escape` while the slash menu is open
- **THEN** the menu SHALL close and the typed `/query` text SHALL be removed from the block

### Requirement: Slash Command Block Conversion
The system SHALL convert the current block to the selected type when the user selects a command from the slash menu.

#### Scenario: Block type converted via slash command
- **WHEN** the user selects a block type from the slash menu (via click or Enter key)
- **THEN** the current block SHALL be converted to that type, the slash query text SHALL be cleared, and the cursor SHALL remain in the block

#### Scenario: Keyboard navigation in slash menu
- **WHEN** the slash menu is open
- **THEN** the user SHALL be able to navigate items with `↑`/`↓` arrow keys and confirm with `Enter`

