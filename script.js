const canvas = document.getElementById('zenCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

// ridimensiona il canvas a tutto schermo
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 5 + 2;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        this.alpha = 1; // trasparenza per l'effetto svanimento
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01; // svanisce lentamente
        this.radius += 0.5; // si espande
    }
}

function animate() {
    // crea un effetto scia invece di pulire tutto
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        } else {
            p.update();
            p.draw();
        }
    });
    requestAnimationFrame(animate);
}

window.addEventListener('mousedown', (e) => {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
    }
});

document.getElementById('saveBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'zen-art.png';
    link.href = canvas.toDataURL();
    link.click();
});

animate();