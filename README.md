# 🌐 NΞONOTION // CYBER_GRID_WORKSPACE

> [!NOTE]
> **PROTOCOL STATUS: ACTIVE // DECK_ONLINE**
> Welcome to a decentralized, hyper-visual, cyberpunk-themed productivity workspace. Built for netrunners, developers, and peak-performance digital architects of the near future.

---

```text
  _  _             _  _         _    _             
 | \| | ___  ___  | \| | ___  _| |_ (_) ___  _ _  
 | .` |/ -_)/ _ \ | .` |/ _ \(_   _)| |/ _ \| ' \ 
 |_|\_|\___|\___/ |_|\_|\___/  |_|  |_|\___/|_||_|
                                                   
```

`NΞONOTION` is a next-generation document editor and wiki workspace designed with a state-of-the-art cyberpunk, dark-synth, and tech aesthetic. By fusing rich productivity utilities with immersive sensory feedback, responsive micro-animations, and custom audio synthesizers, it transforms static document management into an active, tactile netrunning deck.

---

## ⚡ CYBERNETIC COGNITIVE UTILITIES (FEATURES)

### 1. 📡 Neural Grid Graph Map (`NEURAL_GRID_GRAPH`)
- **Orbital Mapping**: Launches a fullscreen glassmorphic coordinate viewport displaying all pages as orbital bubbles revolving around a central `SYS_GATEWAY.EXE` processor router.
- **Pulsing SVG Lasers**: Generates glowing neon connector paths linking document orbital coordinates to the core gateway hub.
- **Warp Navigation**: Clicking a sector node triggers mechanical chimes, updates workspace directories, and smoothly exits the map overlay.

```mermaid
graph TD
    Gateway["SYS_GATEWAY.EXE (Core Node)"]
    Gateway --- Node1["📄 SECTOR_NOD_1 (Page 1)"]
    Gateway --- Node2["📄 SECTOR_NOD_2 (Page 2)"]
    Gateway --- Node3["📄 SECTOR_NOD_3 (Page 3)"]
    style Gateway fill:#0b0d19,stroke:#00f0ff,stroke-width:2px,filter:drop-shadow(0 0 10px #00f0ff)
    style Node1 fill:#08090c,stroke:#ff007f,stroke-width:1px,filter:drop-shadow(0 0 5px #ff007f)
    style Node2 fill:#08090c,stroke:#ff007f,stroke-width:1px,filter:drop-shadow(0 0 5px #ff007f)
    style Node3 fill:#08090c,stroke:#ff007f,stroke-width:1px,filter:drop-shadow(0 0 5px #ff007f)
```

### 2. 🌊 WPM Flow State Telemetry (`FLOW_STATE_TELEMETRY`)
- **Keystroke Velocity**: Measures real-time typing speed (60s sliding window) using custom keypress timestamp queues.
- **Dynamic Particle Physics**: As WPM climbs above 40, the canvas snow/nebula layers accelerate drift velocity, increase density, and slant particle descent angles to visually reflect active cognitive throughput.

### 3. 🖥️ Collapsible bottom HUD Diagnostic Terminal (`CONSOLE_DIAGNOSTICS.LOG`)
- **Telemetry Console**: A bottom-docked trace console panel detailing exfiltrated save records, selection offsets, and device actions in real-time.
- **Command Toggling**: Toggles panel sizes dynamically between collapsed standby and expanded diagnostics view via clicking the footer console tab or the global shortcut `Cmd+/`.
- **Live Event Echoes**:
  - `AUTO_SAVE`: Captures editor updates, logging exfiltrated serialized database save payloads in bytes.
  - `CARET_MUTATION`: Echoes cursor movements in the editor, logging `SECTOR_NOD_x` and exact caret selection offsets.
  - `BLOCK_LIFECYCLE`: Traces block insertions (`BLOCK_INSERTED`) and block conversions (`BLOCK_MORPHED`).
  - `AUDIO_PROFILE`: Prints active keyboard click synthesizer profile changes.

### 4. 🔏 Matrix Decryption Search Solver (`DECRYPT_MATRIX_SEARCH`)
- **Cypher Scramble**: Applies Japanese Katakana characters (`ア`, `カ`, `サ`, `タ`, etc.), binary bits, and system glyphs (`%`, `@`, `$`, `[]`) to command palette results.
- **Visual Decoupling**: Newly updated fuzzy search titles cycle random characters for `200ms` before sequentially resolving from left to right to reveal clear plain text.

### 5. 🔊 Web Audio click Synthesizers (`TACTILE_SWITCH_SELECTOR`)
- Native Web Audio engine (zero external file dependency) synthesizing four unique click sounds:
  - **`🔩 MECH`**: Tactile physical keyboard switch clicks (White noise + triangle frequency sweep).
  - **`🌸 VAPOR`**: Resonant vaporwave digital chime (high frequency sine wave decay).
  - **`🌧 BASS`**: Deep dystopian bass thud (low-pass triangle wave impulse).
  - **`⚡ GLITCH`**: High-crunch plasma static crackle (stuttered high-pass white noise).

---

## 🎨 TACTILE DECK HOTKEYS

| Action Command | Hotkey Shortcut | Operational Description |
| :--- | :--- | :--- |
| **Cmd + K** / **Ctrl + K** | `⌘K` | Launch Holographic Command Palette |
| **Cmd + Shift + F** | `⌘⇧F` | Engage Focus Mode (Collapses sidebar & activates ambient drift) |
| **Cmd + /** / **Ctrl + /** | `⌘/` | Toggle Collapsible HUD Diagnostic Terminal Size |
| **Escape** | `ESC` | Dismiss Command Palette / Slash Command Dropdown / Grid Map |
| **Slash** | `/` | Spawns block-morphing command menu at active editor text block |

---

## 🛠️ FUTURISTIC TECH MATRIX

- **Zero-Dependency Architecture**: Built strictly with client-side vanilla ES6 modules — no complex build matrices, zero bloated frameworks, and ultra-high-speed startup.
- **Frontend Core**: Vanilla HTML5 + ES6 JavaScript.
- **Styling Engine**: Custom Vanilla CSS3 (Design Tokens, custom HSL spaces, glassmorphism, responsive grids, and pulsing scanline animation loops).
- **Data Layer**: High-speed offline-first synchronization using native LocalStorage databases.

---

## 🚀 BOOTUP GRID SEQUENCES (LOCAL LAUNCH)

> [!IMPORTANT]
> NeoNotion has zero external dependencies! You do not need to run heavy `npm install` packages to initiate the deck.

### 1. Launch a Local Web Server
You can launch the grid using any lightweight local static web server. 

**Using Python (Pre-installed on macOS/Linux)**:
```bash
python3 -m http.server 8080
```

**Using Node / NPX**:
```bash
npx http-server -p 8080
```

### 2. Engage Deck
Once the server is booted, open the dashboard in your secure browser link:
```text
http://localhost:8080
```

---

## 🎨 CYBER DESIGN TOKENS

| Color Token | Variable Name | HEX Code | HSL Space | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Obsidian Dark** | `--bg-core` | `#08090C` | `hsl(225, 30%, 4%)` | Core app canvas & background |
| **Grid Line** | `--bg-grid` | `#11141E` | `hsl(225, 25%, 9%)` | Matrix borders & terminal cards |
| **Electric Cyan** | `--neon-cyan` | `#00F0FF` | `hsl(184, 100%, 50%)` | Success highlights, active lines, warp connections |
| **Hot Pink** | `--neon-pink` | `#FF007F` | `hsl(330, 100%, 50%)` | Branding accents, sidebars, alerts |
| **Cyber Violet** | `--neon-violet` | `#9D00FF` | `hsl(277, 100%, 50%)` | Holographic radial gradients & active glows |

---

*System archived and stable. Ready for sensory exploration. // Made for modern digital architects.*
