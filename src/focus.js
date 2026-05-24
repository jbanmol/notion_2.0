/* ==========================================================================
   NEONOTION FOCUS CONTROLLER, CYBER AUDIO SYNTHESIS & MISSION TIMER
   ========================================================================== */

class CyberAudio {
    constructor() {
        this.ctx = null;
        this.currentProfile = 'mech'; // Default click sound
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playClick() {
        this.init();
        if (!this.ctx || this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        const now = this.ctx.currentTime;

        if (this.currentProfile === 'vaporwave') {
            // SYN_SINE: Resonant high-pitched synthesizer bell chime
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
            
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(now + 0.15);
        } 
        
        else if (this.currentProfile === 'dystopian') {
            // LOW_BASS: Deep dampened tactile mechanical thud
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);
            
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(now + 0.1);
        } 
        
        else if (this.currentProfile === 'glitch') {
            // PLS_STATIC: Ultra-short electrostatic glitch crackle
            const bufferSize = this.ctx.sampleRate * 0.006; // Ultra-short 6ms buffer
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.7; // Glitched static noise
            }
            
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.006);
            
            noise.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start();
        } 
        
        else {
            // TCT_MECH: Standard tactical mechanical click
            // 1. Synthetic crisp tactile transient (click sound)
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600 + Math.random() * 300, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.03);
            
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(now + 0.04);

            // 2. High-pass noise crunch
            const bufferSize = this.ctx.sampleRate * 0.015;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.012, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
            
            noise.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noise.start();
        }
    }

    playAlarm() {
        this.init();
        if (!this.ctx) return;
        this.ctx.resume();

        const now = this.ctx.currentTime;
        const playBeep = (delay, pitch) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(pitch, now + delay);
            
            gain.gain.setValueAtTime(0, now + delay);
            gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.25);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now + delay);
            osc.stop(now + delay + 0.35);
        };

        // Double alarm synthetic chime
        playBeep(0, 880);
        playBeep(0.18, 880);
    }
}

export class FocusController {
    constructor() {
        this.audio = new CyberAudio();
        
        // DOM Nodes
        this.focusBtn = document.getElementById('focus-toggle-btn');
        this.sidebar = document.getElementById('sidebar-panel');
        this.mainViewport = document.getElementById('main-viewport');
        this.ambientBg = document.getElementById('focus-ambient-bg');
        this.timerHud = document.getElementById('mission-timer-hud');
        
        // Timer controls
        this.timerDisplay = document.getElementById('timer-display');
        this.btnStart = document.getElementById('timer-start-btn');
        this.btnPause = document.getElementById('timer-pause-btn');
        this.btnReset = document.getElementById('timer-reset-btn');

        // State parameters
        this.isFocusActive = false;
        this.timerInterval = null;
        this.timeLeft = 25 * 60; // 25:00 default
        this.isTimerRunning = false;

        this.init();
    }

    init() {
        // Toggle focus mode event
        this.focusBtn.addEventListener('click', () => this.toggleFocusMode());

        // Keyboard hotkeys: Cmd+Shift+F / Ctrl+Shift+F to toggle focus mode
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                this.toggleFocusMode();
            }
        });

        // Typing Sound Bindings (attaches to editor workspace)
        const editorWorkspace = document.getElementById('editor-viewport-container');
        if (editorWorkspace) {
            editorWorkspace.addEventListener('input', (e) => {
                // Synthesize cyber mechanical sound instantly
                this.audio.playClick();
            });

            // Also capture page title editing
            const titleInput = document.getElementById('document-title');
            if (titleInput) {
                titleInput.addEventListener('input', () => this.audio.playClick());
            }
        }

        // Timer Interface Controls
        this.btnStart.addEventListener('click', () => this.startTimer());
        this.btnPause.addEventListener('click', () => this.pauseTimer());
        this.btnReset.addEventListener('click', () => this.resetTimer());

        // Audio Driver Selector binding
        const audioSelect = document.getElementById('timer-audio-driver');
        if (audioSelect) {
            audioSelect.addEventListener('change', (e) => {
                this.audio.currentProfile = e.target.value;
                this.audio.playClick(); // Audibly confirm the selected driver profile immediately
            });
        }

        // Update display on startup
        this.updateTimerDisplay();
    }

    toggleFocusMode() {
        this.isFocusActive = !this.isFocusActive;
        this.audio.init(); // Warm up audio context on interaction

        if (this.isFocusActive) {
            // Engage distraction free aesthetics
            document.body.classList.add('focus-mode-active');
            this.ambientBg.classList.remove('hidden');
            this.timerHud.classList.remove('hidden');
            this.focusBtn.classList.add('active');
            
            // Adjust visual icons
            const icon = this.focusBtn.querySelector('i');
            if (icon) icon.setAttribute('data-lucide', 'eye-off');
        } else {
            // Dismiss focus mode
            document.body.classList.remove('focus-mode-active');
            this.ambientBg.classList.add('hidden');
            this.timerHud.classList.add('hidden');
            this.focusBtn.classList.remove('active');
            
            const icon = this.focusBtn.querySelector('i');
            if (icon) icon.setAttribute('data-lucide', 'eye');
            
            this.pauseTimer();
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // --- Mission Countdown HUD Controller ---
    updateTimerDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        this.timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        // Alarm state if under 1 minute remaining
        if (this.timeLeft <= 60 && this.timeLeft > 0) {
            this.timerHud.classList.add('alarm-state');
        } else {
            this.timerHud.classList.remove('alarm-state');
        }
    }

    startTimer() {
        if (this.isTimerRunning) return;
        
        this.audio.init();
        this.isTimerRunning = true;
        this.btnStart.style.display = 'none';
        this.btnPause.style.display = 'flex';

        this.timerInterval = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateTimerDisplay();
                
                // Optional ticking sound when low on time
                if (this.timeLeft < 10 && this.timeLeft > 0) {
                    this.audio.playClick();
                }
            } else {
                this.completeTimerAction();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);
        this.btnStart.style.display = 'flex';
        this.btnPause.style.display = 'none';
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = 25 * 60;
        this.updateTimerDisplay();
        this.timerHud.classList.remove('alarm-state');
    }

    completeTimerAction() {
        this.pauseTimer();
        this.audio.playAlarm();

        // High-contrast holographic alarm alert popup modal
        const alertOverlay = document.createElement('div');
        alertOverlay.style.position = 'fixed';
        alertOverlay.style.top = '0';
        alertOverlay.style.left = '0';
        alertOverlay.style.width = '100vw';
        alertOverlay.style.height = '100vh';
        alertOverlay.style.background = 'rgba(255, 0, 127, 0.2)';
        alertOverlay.style.backdropFilter = 'blur(15px)';
        alertOverlay.style.zIndex = '10000';
        alertOverlay.style.display = 'flex';
        alertOverlay.style.alignItems = 'center';
        alertOverlay.style.justifyContent = 'center';

        const box = document.createElement('div');
        box.className = 'glass-panel alarm-state animate-slide-up';
        box.style.width = '480px';
        box.style.padding = '32px';
        box.style.border = '2px solid var(--neon-accent)';
        box.style.boxShadow = '0 0 30px var(--neon-accent-glow)';
        box.style.borderRadius = '8px';
        box.style.background = 'rgba(10, 12, 20, 0.95)';
        box.style.textAlign = 'center';

        box.innerHTML = `
            <i data-lucide="shield-alert" class="neon-glow-icon pink pulsing" style="width: 48px; height: 48px; margin: 0 auto 16px auto; display: block;"></i>
            <h2 class="pink font-mono" style="font-size: 1.6rem; letter-spacing: 0.1em; margin-bottom: 8px;">UPLINK SECURED</h2>
            <div class="font-mono" style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">MISSION_ACCOMPLISHED // ZEN_FOCUS_SUCCESSFUL</div>
            <p class="font-sans" style="line-height: 1.6; margin-bottom: 32px; color: var(--text-main);">The intrusion sequence timer has elapsed. Active mental telemetry has been fully compiled and synced into the local memory matrix.</p>
            <button class="cyber-btn" id="dismiss-alert-btn" style="border-color: var(--neon-accent); color: var(--neon-accent); font-weight: bold; width: 100%;">DISMISS_LINK</button>
        `;

        alertOverlay.appendChild(box);
        document.body.appendChild(alertOverlay);

        if (window.lucide) {
            window.lucide.createIcons();
        }

        const dismissBtn = box.querySelector('#dismiss-alert-btn');
        dismissBtn.addEventListener('click', () => {
            document.body.removeChild(alertOverlay);
            this.resetTimer();
        });
    }
}
