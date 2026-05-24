/* ==========================================================================
   NEONOTION BOOT TELEMETRY (MAIN APP CONTROLLER)
   ========================================================================== */

import { state } from './state.js';
import { SidebarComponent } from './sidebar.js';
import { EditorComponent } from './editor.js';
import { CommandPaletteComponent } from './palette.js';
import { FocusController } from './focus.js';

class AppController {
    constructor() {
        this.sidebar = new SidebarComponent();
        this.editor = new EditorComponent();
        this.palette = new CommandPaletteComponent((doc) => this.editor.loadDocument(doc));
        this.focus = new FocusController();

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
}

// Instantiate and initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
});
