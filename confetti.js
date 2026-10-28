// Lightweight 60FPS Canvas Confetti Engine
// No dependencies, ultra-smooth physics particle bursts

class ConfettiEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animId = null;
        this.colors = ['#7c5cbf', '#9d7cf0', '#ebe4f7', '#2563eb', '#15803d', '#d97706', '#e11d48'];
    }

    init() {
        if (this.canvas) return;
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 70) {
        this.init();
        const colors = this.colors;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 6 + Math.random() * 12;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 4,
                size: 6 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rSpeed: (Math.random() - 0.5) * 15,
                opacity: 1,
                decay: 0.012 + Math.random() * 0.015,
                tilt: Math.random() * 10
            });
        }

        if (!this.animId) {
            this.loop();
        }
    }

    celebrateVictory() {
        this.burst(window.innerWidth * 0.25, window.innerHeight * 0.4, 60);
        setTimeout(() => this.burst(window.innerWidth * 0.75, window.innerHeight * 0.4, 60), 200);
        setTimeout(() => this.burst(window.innerWidth * 0.5, window.innerHeight * 0.3, 90), 450);
    }

    loop() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.35; // Gravity
            p.vx *= 0.98; // Friction
            p.rotation += p.rSpeed;
            p.opacity -= p.decay;

            if (p.opacity <= 0 || p.y > window.innerHeight + 20) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.fillStyle = p.color;

            // Draw confetti rectangle
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            this.ctx.restore();
        }

        if (this.particles.length > 0) {
            this.animId = requestAnimationFrame(() => this.loop());
        } else {
            this.animId = null;
        }
    }
}

window.confettiEngine = new ConfettiEngine();
