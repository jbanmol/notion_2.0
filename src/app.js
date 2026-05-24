/* ==========================================================================
   NEONOTION BOOT TELEMETRY (MAIN APP CONTROLLER)
   ========================================================================== */

import { state } from './state.js';
import { SidebarComponent } from './sidebar.js';
import { EditorComponent } from './editor.js';
import { CommandPaletteComponent } from './palette.js';
import { FocusController, MissionHUD } from './focus.js';
import { CyberModalService } from './modals.js';

class AppController {
    constructor() {
        // Initialize CyberModalService first (needed by sidebar)
        CyberModalService.init();

        this.sidebar = new SidebarComponent();
        this.editor  = new EditorComponent();
        this.palette = new CommandPaletteComponent((doc) => this.editor.loadDocument(doc));

        // Create shared MissionHUD instance (timer is independent of focus mode)
        this.missionHUD  = new MissionHUD(null); // audio passed after FocusController init
        this.focusMode   = new FocusController(this.missionHUD);
        // Give HUD access to the focus controller's audio
        this.missionHUD.audio = this.focusMode.audio;

        this.themeBtnEl      = document.getElementById('theme-toggle-btn');
        this.themeDropdownEl = document.getElementById('theme-dropdown');
        this.timerPillEl     = document.getElementById('timer-pill');

        this.init();
    }

    init() {
        // Subscribe components to state changes
        state.subscribe(() => {
            this.sidebar.render();
        });

        // Initialize HUD Themes
        this.applyTheme(state.getActiveTheme());
        this.initThemeSelector();

        // Boot document loader
        this.loadActiveDocument();

        // Render initial sidebar
        this.sidebar.render();

        // Wire timer pill (Task 7.3)
        this._initTimerPill();

        console.log("⚡ NEONOTION CORES ENGAGED. FUTURISTIC HUD DEPLOYED.");
        console.log("🎯 FOCUS MODE CONTROLLER ONLINE. Cmd+Shift+F to engage.");
        console.log("⏱  PERSISTENT TIMER PILL ACTIVE. Click the timer in the header.");
    }

    loadActiveDocument() {
        const doc = state.getActiveDocument();
        if (doc) {
            this.editor.loadDocument(doc);
        }
    }

    /* -----------------------------------------------------------------------
       TIMER PILL (Task 7.3)
    ----------------------------------------------------------------------- */

    _initTimerPill() {
        if (!this.timerPillEl) return;

        // Toggle HUD on pill click
        this.timerPillEl.addEventListener('click', () => {
            const hudEl = document.getElementById('mission-timer-hud');
            if (hudEl) {
                const isHidden = hudEl.classList.contains('hidden');
                if (isHidden) {
                    this.missionHUD.show();
                } else {
                    this.missionHUD.hide(true); // keepRunning = true
                }
            }
        });

        // Update pill display every second to reflect timer
        setInterval(() => {
            if (this.missionHUD) {
                this.missionHUD.updatePill();
            }
        }, 1000);
    }

    /* -----------------------------------------------------------------------
       THEME SELECTOR
    ----------------------------------------------------------------------- */

    initThemeSelector() {
        this.themeBtnEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.themeDropdownEl.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            this.themeDropdownEl.classList.add('hidden');
        });

        const themeOptions = this.themeDropdownEl.querySelectorAll('.theme-opt');
        themeOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                const targetTheme = opt.dataset.theme;
                state.setTheme(targetTheme);
                this.applyTheme(targetTheme);
                themeOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
            });
        });
    }

    applyTheme(themeName) {
        document.body.classList.remove('theme-obsidian', 'theme-vaporwave', 'theme-amber');
        document.body.classList.add(themeName);
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
