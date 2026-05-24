/* ==========================================================================
   NEONOTION BOOT TELEMETRY (MAIN APP CONTROLLER)
   ========================================================================== */

import { state } from './state.js';
import { SidebarComponent } from './sidebar.js';
import { EditorComponent } from './editor.js';
import { CommandPaletteComponent } from './palette.js';
import { FocusController, MissionHUD } from './focus.js';
import { CyberModalService } from './modals.js';
import { GraphController } from './graph.js';

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
        this.audioMuteBtnEl  = document.getElementById('audio-mute-btn');
        this.graph           = new GraphController();

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

        // Wire global silent/audio controls (Tasks 2.2, 2.3)
        this._initAudioMuteButton();
        this._initGlobalKeystrokes();
        this._initUIInteractions();
        this._initDiagnosticTerminal();

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

    /* -----------------------------------------------------------------------
       GLOBAL AUDIO MUTE BUTTON & SOUND FEEDBACK (Tasks 2.2, 2.3)
    ----------------------------------------------------------------------- */

    _initAudioMuteButton() {
        if (!this.audioMuteBtnEl) return;

        // Apply initial mute state
        this.updateAudioMuteUI();

        this.audioMuteBtnEl.addEventListener('click', () => {
            const isMuted = state.isGlobalAudioMuted();
            state.setGlobalAudioMuted(!isMuted);
            this.updateAudioMuteUI();

            // Warm up audio and play confirmation chime if unmuted
            if (this.focusMode && this.focusMode.audio) {
                this.focusMode.audio.warm();
                if (!state.isGlobalAudioMuted()) {
                    this.focusMode.audio.playSoftClick();
                }
            }
        });
    }

    updateAudioMuteUI() {
        if (!this.audioMuteBtnEl) return;
        const isMuted = state.isGlobalAudioMuted();

        // Update visual active state
        this.audioMuteBtnEl.classList.toggle('active', !isMuted);

        // Update Lucide icon inside button
        const iconEl = this.audioMuteBtnEl.querySelector('i');
        if (iconEl) {
            iconEl.className = ''; // reset classes
            if (isMuted) {
                iconEl.setAttribute('data-lucide', 'volume-x');
            } else {
                iconEl.setAttribute('data-lucide', 'volume-2');
            }
        }

        // Re-render Lucide icons
        if (window.lucide) window.lucide.createIcons();
    }

    _initGlobalKeystrokes() {
        document.addEventListener('click', () => {
            if (this.focusMode && this.focusMode.audio) {
                this.focusMode.audio.warm();
            }
        }, { once: true });

        document.addEventListener('keydown', (e) => {
            // Only play soft clicks if focus mode is NOT active and sound is NOT muted
            if (this.focusMode && this.focusMode.audio && !state.isGlobalAudioMuted()) {
                if (!this.focusMode.active) {
                    const target = e.target;
                    const isEditorTarget =
                        target.contentEditable === 'true' ||
                        target.id === 'document-title' ||
                        target.id === 'sidebar-search' ||
                        target.classList.contains('block-content') ||
                        target.tagName === 'INPUT';
                    if (!isEditorTarget) return;
                    const isPrintable = e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter';
                    if (!isPrintable) return;
                    this.focusMode.audio.playSoftClick();
                }
            }
        });
    }

    _initUIInteractions() {
        // Subtle key click when clicking major UI buttons, links, options or list nodes
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button, .document-item, .hud-btn, .theme-opt, .slash-item');
            if (btn && this.focusMode && this.focusMode.audio && !state.isGlobalAudioMuted()) {
                // If it's the mute button itself, we already handled it
                if (btn.id === 'audio-mute-btn') return;

                this.focusMode.audio.warm();
                this.focusMode.audio.playSoftClick();
            }
        });
    }

    /* -----------------------------------------------------------------------
       HUD COLLAPSIBLE DIAGNOSTIC TERMINAL (Task 3.3)
    ----------------------------------------------------------------------- */

    _initDiagnosticTerminal() {
        const header = document.getElementById('hud-terminal-header');
        if (header) {
            header.addEventListener('click', () => this.toggleTerminal());
        }

        // Toggle Terminal via shortcut Cmd+/ or Ctrl+/
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === '/') {
                e.preventDefault();
                this.toggleTerminal();
            }
        });
    }

    toggleTerminal() {
        const terminalEl = document.getElementById('hud-diagnostic-terminal');
        if (!terminalEl) return;

        if (terminalEl.classList.contains('collapsed')) {
            terminalEl.classList.remove('collapsed');
            terminalEl.classList.add('expanded');
            this.log('SYS_CONSOLE_OPENED // EXPANDED_DIAGNOSTICS_VIEW');
        } else {
            terminalEl.classList.remove('expanded');
            terminalEl.classList.add('collapsed');
            this.log('SYS_CONSOLE_CLOSED // STANDBY');
        }
    }

    log(msg, type = 'info') {
        const feed = document.getElementById('hud-terminal-feed');
        if (!feed) return;

        const line = document.createElement('div');
        line.className = 'console-line';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'console-time';
        const now = new Date();
        const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        timeSpan.textContent = `[${ts}]`;

        const msgSpan = document.createElement('span');
        msgSpan.className = 'console-message font-mono';
        if (type === 'error' || msg.includes('WARNING') || msg.includes('FAIL') || msg.includes('CRITICAL')) {
            msgSpan.classList.add('highlight-red');
        } else if (type === 'success' || msg.includes('OK') || msg.includes('COMPLETE') || msg.includes('SUCCESS') || msg.includes('STABLE') || msg.includes('EXFILTRATED')) {
            msgSpan.classList.add('highlight-green');
        } else if (type === 'cyan' || msg.includes('WARPED') || msg.includes('LOADING') || msg.includes('DECRYPT') || msg.includes('COGNITIVE') || msg.includes('ENGAGED') || msg.includes('MAP')) {
            msgSpan.classList.add('highlight-cyan');
        }

        msgSpan.textContent = msg;

        line.appendChild(timeSpan);
        line.appendChild(msgSpan);
        feed.appendChild(line);

        // Limit lines to 100
        while (feed.children.length > 100) {
            feed.removeChild(feed.firstChild);
        }

        // Scroll to bottom
        feed.scrollTop = feed.scrollHeight;
    }
}

// Instantiate and initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
});
