window.addEventListener('DOMContentLoaded', () => {
    const scroller = document.getElementById('scroller');
    const items = document.querySelectorAll('.library-link');

    const observerOptions = {
        root: scroller,
        rootMargin: '0px -35% 0px -35%', // This creates a narrow 10% "strip" in the dead center
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-lit');
            } else {
                entry.target.classList.remove('is-lit');
            }
        });
    }, observerOptions);

    items.forEach(item => observer.observe(item));
});

const aboutTrigger = document.getElementById('about-trigger');
const aboutContent = document.getElementById('about-content');

aboutTrigger.addEventListener('click', () => {
    aboutContent.classList.toggle('is-visible');
});

const canvas = document.getElementById('lightCanvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight * 1.1;
    particles = Array.from({ length: 80 }, () => new Particle());

    // Initial scroll to 4th item (index 3)
    const scroller = document.getElementById('scroller');
    const target = document.querySelectorAll('.library-link')[3];
    const offset = target.offsetLeft - (window.innerWidth / 2) + (target.offsetWidth / 2);
    scroller.scrollLeft = offset;
}

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.2 + 0.5;
        this.speedY = -(Math.random() * 0.3 + 0.01);
        this.vx = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.8;
    }
    update() {
        this.y += this.speedY;
        this.x += this.vx;
        if (this.y < 0) this.y = height;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawSingleBeam(tick) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const centerX = width / 2;
    const topWidth = width * 0.3;    // Narrow top
    const bottomWidth = width * 0.6; // Wide bottom
    const maxOpacity = 0.3;

    // Subtle pulse
    const pulse = Math.sin(tick * 0.0005) * 0.05;
    const dynamicOpacity = maxOpacity + pulse;
    const dynamicOpacity2 = 0 + pulse;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `rgba(230, 230, 220, ${dynamicOpacity})`);
    gradient.addColorStop(0.9, `rgba(230, 230, 220, ${dynamicOpacity2})`);

    ctx.filter = "blur(20px)";
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(centerX - topWidth / 2, 0);
    ctx.lineTo(centerX + topWidth / 2, 0);
    ctx.lineTo(centerX + bottomWidth / 2, height);
    ctx.lineTo(centerX - bottomWidth / 2, height);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function animate(tick) {
    ctx.clearRect(0, 0, width, height);

// Background depth
            const bgGrad = ctx.createRadialGradient(width/2, 0, 0, width/2, 0, height);
            bgGrad.addColorStop(0, '#ede7d2ff');
            bgGrad.addColorStop(1, '#59533fff');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

    drawSingleBeam(tick);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);
init();
requestAnimationFrame(animate);

