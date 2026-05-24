## ADDED Requirements

### Requirement: Block Drag-and-Drop Reordering
The system SHALL allow users to reorder blocks within a document by dragging the block's drag handle and dropping it at a new position.

#### Scenario: Block successfully reordered via drag
- **WHEN** the user drags a block handle and drops it above or below another block
- **THEN** the block SHALL be repositioned in the document and state SHALL be persisted

#### Scenario: Visual drop target indicator shown during drag
- **WHEN** the user is dragging a block over another block's drop zone
- **THEN** a neon accent drop indicator line SHALL be visible between blocks showing the insertion point

#### Scenario: Dragged block visually distinguished
- **WHEN** a block is being dragged
- **THEN** the dragged block SHALL render with reduced opacity and a neon border glow to signal active drag state
