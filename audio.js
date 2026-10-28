// Audio Controller powered by browser Web Audio API
// Procedural audio generation: Zero external assets needed, ultra-low latency & offline-ready.

class SoundFX {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.volume = 0.5; // master volume
        this.initialized = false;
        
        // Load preference from localStorage
        const savedMute = localStorage.getItem('quiz_muted');
        if (savedMute !== null) {
            this.muted = savedMute === 'true';
        }
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.initialized = true;
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('quiz_muted', this.muted);
        return this.muted;
    }

    isMuted() {
        return this.muted;
    }

    // Gentle tactile click for buttons and options
    playClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

        gain.gain.setValueAtTime(0.15 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Melodic ascending chime for correct answers
    playCorrect() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.06;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.25 * this.volume, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.36);
        });
    }

    // Soft gentle buzz for incorrect answers
    playIncorrect() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.25);

        gain.gain.setValueAtTime(0.18 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        // Low-pass filter to keep it from being harsh
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Timer countdown tick sound
    playTick(isUrgent = false) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(isUrgent ? 880 : 440, now);

        gain.gain.setValueAtTime((isUrgent ? 0.2 : 0.08) * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
    }

    // Lifeline power-up / whoosh sound
    playLifeline() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);

        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Streak multiplier fanfare
    playStreak() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const notes = [440, 554.37, 659.25, 880, 1108.73];
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.045;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.2 * this.volume, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.26);
        });
    }

    // Game completed celebration fanfare
    playFanfare() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const chordNotes = [
            { f: 523.25, time: 0 },
            { f: 659.25, time: 0.1 },
            { f: 783.99, time: 0.2 },
            { f: 1046.50, time: 0.35, len: 0.6 }
        ];

        const now = this.ctx.currentTime;
        chordNotes.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + item.time;
            const duration = item.len || 0.35;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, start);

            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.3 * this.volume, start + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + duration + 0.05);
        });
    }
}

// Global sound manager instance
window.soundFX = new SoundFX();
