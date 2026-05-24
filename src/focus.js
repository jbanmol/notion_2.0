/* ==========================================================================
   NEONOTION — FOCUS MODE ENGINE
   Zen collapse, ambient snow, CyberAudio synthesizer, Pomodoro HUD
   ========================================================================== */

/* --------------------------------------------------------------------------
   2.1 — CYBER AUDIO SYNTHESIZER
   Generates tactile click sounds using the Web Audio API (zero external files)
   -------------------------------------------------------------------------- */

class CyberAudio {
    constructor() {
        this.ctx = null;
        this.profile = 'mech';
        this._ready = false;
    }

    /** Warm up AudioContext on first user gesture */
    warm() {
        if (this._ready) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (this.ctx.state === 'suspended') this.ctx.resume();
            this._ready = true;
        } catch (e) {
            console.warn('[CyberAudio] AudioContext unavailable:', e);
        }
    }

    setProfile(name) {
        this.profile = name;
    }

    /** Dispatch the correct click based on active profile */
    click() {
        if (!this._ready || !this.ctx) return;
        const profiles = {
            mech:      () => this._playMech(),
            vaporwave: () => this._playVaporwave(),
            dystopian: () => this._playDystopian(),
            glitch:    () => this._playGlitch(),
        };
        (profiles[this.profile] || profiles.mech)();
    }

    /* --- Mech Click: short high-freq oscillator + noise burst ------------ */
    _playMech() {
        const t = this.ctx.currentTime;
        // Oscillator sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(3200, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.04);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.055);

        // Noise click
        this._noiseClick(t, 0.04, 0.08, 4000, 0.12);
    }

    /* --- Vaporwave: gentle sine bell chirp ------------------------------- */
    _playVaporwave() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.12);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.15);
    }

    /* --- Dystopian bass thud --------------------------------------------- */
    _playDystopian() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 300;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        osc.connect(lp);
        lp.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
    }

    /* --- Glitch: noise burst with bandpass crunch ------------------------- */
    _playGlitch() {
        const t = this.ctx.currentTime;
        this._noiseClick(t, 0.0, 0.06, 6000, 0.22);
        // A second offset glitch stutter
        this._noiseClick(t + 0.025, 0.0, 0.03, 8000, 0.1);
    }

    /* --- White-noise utility helper ------------------------------------- */
    _noiseClick(startTime, delayMs, duration, hpFreq, volume) {
        const bufferSize = Math.ceil(this.ctx.sampleRate * (duration + 0.01));
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const hp = this.ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = hpFreq;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, startTime + delayMs);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + delayMs + duration);

        source.connect(hp);
        hp.connect(gain);
        gain.connect(this.ctx.destination);
        source.start(startTime + delayMs);
        source.stop(startTime + delayMs + duration + 0.01);
    }

    /* --- Double beep alarm (Pomodoro complete) --------------------------- */
    beepAlarm() {
        if (!this._ready || !this.ctx) return;
        const t = this.ctx.currentTime;
        [0, 0.28].forEach(offset => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, t + offset);
            osc.frequency.setValueAtTime(1100, t + offset + 0.1);
            gain.gain.setValueAtTime(0.35, t + offset);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + offset);
            osc.stop(t + offset + 0.25);
        });
    }
}

/* --------------------------------------------------------------------------
   DIGITAL SNOW CANVAS ANIMATION
   -------------------------------------------------------------------------- */

class SnowSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx2d = canvas.getContext('2d');
        this.particles = [];
        this.animId = null;
        this.running = false;
    }

    _resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    _spawn() {
        const count = Math.floor(window.innerWidth / 14);
        this.particles = Array.from({ length: count }, () => this._makeParticle());
    }

    _makeParticle() {
        return {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 1.6 + 0.4,
            speed: Math.random() * 0.8 + 0.3,
            opacity: Math.random() * 0.5 + 0.1,
            drift: (Math.random() - 0.5) * 0.4,
        };
    }

    _tick() {
        const { ctx2d, canvas, particles } = this;
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx2d.beginPath();
            ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx2d.fillStyle = `rgba(0, 240, 255, ${p.opacity})`;
            ctx2d.shadowColor = 'rgba(0, 240, 255, 0.6)';
            ctx2d.shadowBlur = 4;
            ctx2d.fill();
            p.y += p.speed;
            p.x += p.drift;
            if (p.y > canvas.height + 4) {
                p.y = -4;
                p.x = Math.random() * canvas.width;
            }
        });
        if (this.running) this.animId = requestAnimationFrame(() => this._tick());
    }

    start() {
        if (this.running) return;
        this.running = true;
        this._resize();
        this._spawn();
        this._tick();
        window.addEventListener('resize', () => {
            this._resize();
            this._spawn();
        });
    }

    stop() {
        this.running = false;
        if (this.animId) cancelAnimationFrame(this.animId);
        this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

/* --------------------------------------------------------------------------
   MISSION INTRUSION HUD — Pomodoro Countdown
   -------------------------------------------------------------------------- */

class MissionHUD {
    constructor(audio) {
        this.audio = audio;
        this.TOTAL = 25 * 60; // 25 minutes in seconds
        this.remaining = this.TOTAL;
        this.running = false;
        this.intervalId = null;

        // DOM references
        this.hudEl       = document.getElementById('mission-timer-hud');
        this.displayEl   = document.getElementById('timer-display');
        this.statusEl    = document.getElementById('timer-status-text');
        this.progressEl  = document.getElementById('hud-progress-fill');
        this.startBtn    = document.getElementById('timer-start-btn');
        this.pauseBtn    = document.getElementById('timer-pause-btn');
        this.resetBtn    = document.getElementById('timer-reset-btn');
        this.closeBtn    = document.getElementById('hud-close-btn');
        this.modalEl     = document.getElementById('timer-complete-modal');
        this.dismissBtn  = document.getElementById('modal-dismiss-btn');

        this._bindEvents();
        this._render();
    }

    /* 3.2 — Wire Start, Pause, Reset triggers */
    _bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.closeBtn.addEventListener('click', () => this.hide());
        this.dismissBtn.addEventListener('click', () => this._dismissModal());
    }

    show() {
        this.hudEl.classList.remove('hidden');
        lucide.createIcons();
    }

    hide(keepRunning = false) {
        this.hudEl.classList.add('hidden');
        if (!keepRunning) this.pause();
    }

    /* 3.1 — Construct Pomodoro countdown interval */
    start() {
        if (this.running) return;
        this.running = true;
        this.audio.warm();
        this.statusEl.textContent = 'RUNNING';
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.intervalId = setInterval(() => this._tick(), 1000);
    }

    pause() {
        if (!this.running) return;
        this.running = false;
        clearInterval(this.intervalId);
        this.statusEl.textContent = 'PAUSED';
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
    }

    reset() {
        this.pause();
        this.remaining = this.TOTAL;
        this.statusEl.textContent = 'STANDBY';
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this._render();
        this._setAlarmState(false);
    }

    _tick() {
        if (this.remaining <= 0) {
            this._complete();
            return;
        }
        this.remaining--;
        this._render();
        // 3.3 — Warning alarm when under 60 seconds
        this._setAlarmState(this.remaining < 60);
    }

    /* 3.1 — Display INTRUSION_TIME_REMAINING */
    _render() {
        const m = Math.floor(this.remaining / 60);
        const s = this.remaining % 60;
        this.displayEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        const pct = ((this.TOTAL - this.remaining) / this.TOTAL) * 100;
        this.progressEl.style.width = `${100 - pct}%`;
    }

    /* 3.3 — Visual alarm flicker under 1 minute */
    _setAlarmState(active) {
        this.displayEl.classList.toggle('alarm', active);
        this.progressEl.classList.toggle('alarm', active);
        this.hudEl.classList.toggle('alarm', active);
    }

    /* 3.4 — Double beep alarm + fullscreen modal at zero */
    _complete() {
        clearInterval(this.intervalId);
        this.running = false;
        this.remaining = 0;
        this._render();
        this.statusEl.textContent = 'MISSION_COMPLETE';
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = true;
        // Synthesize double beep
        this.audio.beepAlarm();
        // Show modal
        setTimeout(() => {
            this.modalEl.classList.remove('hidden');
        }, 400);
    }

    _dismissModal() {
        this.modalEl.classList.add('hidden');
        this.reset();
    }

    /** Update the timer pill in the header with current time */
    updatePill() {
        const pillEl = document.getElementById('timer-pill-display');
        if (pillEl) {
            const m = Math.floor(this.remaining / 60);
            const s = this.remaining % 60;
            pillEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        }
    }
}

/* --------------------------------------------------------------------------
   FOCUS CONTROLLER — Ambient effects + audio orchestrator
   (Timer is now independent — see MissionHUD exported below)
   -------------------------------------------------------------------------- */

export class FocusController {
    constructor(missionHUD) {
        this.active = false;
        this.audio  = new CyberAudio();
        this.snow   = new SnowSystem(document.getElementById('focus-snow-canvas'));
        this.hud    = missionHUD; // shared HUD instance

        this.toggleBtn   = document.getElementById('focus-toggle-btn');
        this.ambientBg   = document.getElementById('focus-ambient-bg');
        this.snowCanvas  = document.getElementById('focus-snow-canvas');
        this.audioSelect = document.getElementById('audio-profile-select');

        this._bindKeys();
        this._bindToggle();
        this._bindAudioSelect();
        this._bindEditorAudio();
    }

    /* Keyboard shortcut Cmd+Shift+F */
    _bindKeys() {
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    /* Toggle button */
    _bindToggle() {
        this.toggleBtn.addEventListener('click', () => {
            this.audio.warm();
            this.toggle();
        });
    }

    toggle() {
        this.active = !this.active;
        if (this.active) this._engage();
        else             this._disengage();
    }

    /* --- Focus ON --- */
    _engage() {
        document.body.classList.add('focus-mode-active');
        this.ambientBg.classList.remove('hidden');
        requestAnimationFrame(() => this.ambientBg.classList.add('visible'));
        this.snowCanvas.classList.remove('hidden');
        requestAnimationFrame(() => {
            this.snowCanvas.classList.add('visible');
            this.snow.start();
        });
        // Show HUD in focus mode
        if (this.hud) this.hud.show();
    }

    /* --- Focus OFF --- */
    _disengage() {
        document.body.classList.remove('focus-mode-active');
        this.ambientBg.classList.remove('visible');
        setTimeout(() => this.ambientBg.classList.add('hidden'), 1200);
        this.snowCanvas.classList.remove('visible');
        setTimeout(() => {
            this.snow.stop();
            this.snowCanvas.classList.add('hidden');
        }, 1000);
        // Hide HUD but keep timer running
        if (this.hud) this.hud.hide(true);
    }

    /* 2.3 — Wire audio selector */
    _bindAudioSelect() {
        this.audioSelect.addEventListener('change', (e) => {
            this.audio.setProfile(e.target.value);
            this.audio.warm();
            this.audio.click();
        });
    }

    /* 2.2 — Bind keydown in editor to synthesized clicks */
    _bindEditorAudio() {
        document.addEventListener('click', () => this.audio.warm(), { once: true });
        document.addEventListener('keydown', (e) => {
            if (!this.active) return;
            const target = e.target;
            const isEditorTarget =
                target.contentEditable === 'true' ||
                target.id === 'document-title' ||
                target.classList.contains('block-content');
            if (!isEditorTarget) return;
            const isPrintable = e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete';
            if (!isPrintable) return;
            this.audio.click();
        });
    }
}

export { MissionHUD };
