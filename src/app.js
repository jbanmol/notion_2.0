/* ==========================================================================
   NEONOTION BOOT TELEMETRY (MAIN APP CONTROLLER)
   ========================================================================== */

import { state } from './state.js';
import { SidebarComponent } from './sidebar.js';
import { EditorComponent } from './editor.js';
import { CommandPaletteComponent } from './palette.js';
import { FocusController } from './focus.js';
import { GraphController } from './graph.js';

class AppController {
    constructor() {
        this.sidebar = new SidebarComponent();
        this.editor = new EditorComponent();
        this.palette = new CommandPaletteComponent((doc) => this.editor.loadDocument(doc));
        this.focus = new FocusController();
        this.graph = new GraphController();

        this.themeBtnEl = document.getElementById('theme-toggle-btn');
        this.themeDropdownEl = document.getElementById('theme-dropdown');

        this.init();
    }

    init() {
        // Subscribe components to state changes
        state.subscribe((data) => {
            // Re-render sidebar tree to match document lists
            this.sidebar.render();
        });

        // Initialize HUD Themes
        this.applyTheme(state.getActiveTheme());
        this.initThemeSelector();

        // Boot document loader
        this.loadActiveDocument();

        // Render initial sidebar
        this.sidebar.render();

        // Boot custom telemetry exporter
        this.initExporter();

        console.log("⚡ NEONOTION CORES ENGAGED. FUTURISTIC HUD DEPLOYED.");
    }

    loadActiveDocument() {
        const doc = state.getActiveDocument();
        if (doc) {
            this.editor.loadDocument(doc);
        }
    }

    initThemeSelector() {
        // Click theme toggle btn to open/close menu
        this.themeBtnEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.themeDropdownEl.classList.toggle('hidden');
        });

        // Click outside closes dropdown
        document.addEventListener('click', () => {
            this.themeDropdownEl.classList.add('hidden');
        });

        // Handle clicking specific themes
        const themeOptions = this.themeDropdownEl.querySelectorAll('.theme-opt');
        themeOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                const targetTheme = opt.dataset.theme;
                
                // Set state & update UI active classes
                state.setTheme(targetTheme);
                this.applyTheme(targetTheme);
                
                themeOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
            });
        });
    }

    applyTheme(themeName) {
        // Purge old theme class tokens
        document.body.classList.remove('theme-obsidian', 'theme-vaporwave', 'theme-amber');
        
        // Inject selected theme class token
        document.body.classList.add(themeName);
        
        // Sync active state visually inside the dropdown on initial startup
        const activeOpt = this.themeDropdownEl.querySelector(`[data-theme="${themeName}"]`);
        if (activeOpt) {
            const themeOptions = this.themeDropdownEl.querySelectorAll('.theme-opt');
            themeOptions.forEach(o => o.classList.remove('active'));
            activeOpt.classList.add('active');
        }
    }

    initExporter() {
        const btn = document.getElementById('export-chip-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                this.exportCurrentDocument();
            });
        }
    }

    exportCurrentDocument() {
        const activeDoc = state.getActiveDocument();
        if (!activeDoc) return;

        // Custom high-tech structured exfiltration payload
        const payload = {
            metadata: {
                header: "CYBER_CORE_NODE_TELEMETRY",
                version: "2.0",
                security_layer: "AES-DYNAMIC-256",
                exfiltration_timestamp: new Date().toISOString(),
                node_id: activeDoc.id
            },
            payload: {
                title: activeDoc.title,
                icon: activeDoc.icon || "file-text",
                blocks: activeDoc.blocks
            }
        };

        const jsonString = JSON.stringify(payload, null, 4);
        
        // Dynamic file download trigger
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        
        // Clean cyberpunk filename
        const cleanTitle = activeDoc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${cleanTitle}_CORE_CHIP.DAT`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Play synthetic mechanical confirm click sound!
        if (this.focus && this.focus.audio) {
            this.focus.audio.playAlarm(); // double beep for download success!
        }

        console.log(`[DECRYPT] Exfiltrated telemetry successfully! Saved ${cleanTitle}_CORE_CHIP.DAT`);
    }
}

// Instantiate and initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
});
