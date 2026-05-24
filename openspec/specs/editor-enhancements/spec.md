# editor-enhancements Specification

## Purpose
TBD - created by archiving change core-refinements. Update Purpose after archive.
## Requirements
### Requirement: Live Word Count and Read Time
The system SHALL display a live word count and estimated reading time for the active document in a footer bar below the editor.

#### Scenario: Word count updates on block edit
- **WHEN** the user types or edits content in any block
- **THEN** the word count in the editor footer SHALL update in real time

#### Scenario: Read time displayed alongside word count
- **WHEN** a document contains text content
- **THEN** an estimated read time (calculated at 200 words/min) SHALL be displayed next to the word count (e.g., `142 words · 1 min read`)

### Requirement: Block Type Switcher
The system SHALL allow users to change the type of an existing block via a hover menu without deleting and recreating the block.

#### Scenario: Block type menu appears on hover icon
- **WHEN** the user hovers over an existing block and clicks the block type indicator icon
- **THEN** a compact dropdown SHALL show available block types to switch to

#### Scenario: Block type changed in place
- **WHEN** the user selects a new block type from the type switcher
- **THEN** the block SHALL change type, its content SHALL be preserved, and the state SHALL be saved

### Requirement: Block Entrance Animation
The system SHALL animate newly created blocks with a subtle entrance animation to provide visual feedback.

#### Scenario: New block animates in
- **WHEN** a new block is inserted into the editor (via Enter key or slash command)
- **THEN** the block SHALL animate with a `slide-in-fade` transition (slides up ~8px, fades from opacity 0 to 1) over 200ms

