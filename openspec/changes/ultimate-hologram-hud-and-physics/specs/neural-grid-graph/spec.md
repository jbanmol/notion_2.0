## ADDED Requirements

### Requirement: Fullscreen Neural Grid Graph Overlay
The system SHALL support a full-screen `#neural-grid-graph-overlay` overlay panel that displays all document pages in orbit around a central `SYS_GATEWAY.EXE` processor hub.

#### Scenario: Visualizing document bubbles
- **WHEN** the user opens the grid map by clicking `#view-graph-btn` in the sidebar actions
- **THEN** a full-screen blurred panel SHALL slide into view showing all pages as absolute-positioned glassmorphic bubbles orbiting the core router node.

### Requirement: Glowing SVG Laser Connectors
The system SHALL draw glowing, animated path lines connecting each document bubble to the central gateway router.

#### Scenario: Rendering neon connections
- **WHEN** the grid map viewport is rendered
- **THEN** the SVG canvas element `#graph-svg-canvas` SHALL generate animated glowing laser lines extending from the coordinates of the central hub to each document orbital node.

### Requirement: Interactive Node Choice Navigation
The system SHALL navigate to the selected document sector and exit the overlay when a user clicks a document node card.

#### Scenario: Transitioning back to workspace
- **WHEN** the user clicks an orbital page card inside the grid map
- **THEN** the system SHALL load the corresponding document in the workspace, refresh sidebar active states, play a soft mechanical chime, and close the map overlay.
