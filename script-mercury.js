const canvas = document.getElementById('zenCanvas');
const ctx = canvas.getContext('2d');

const config = {
    baseHue: Math.random() * 360,   // colore di partenza random
    colorSpeed: 0.5,                // velocità di cambio di colore
    fadeOpacity: 0.01,              // quanto lentamente svanisce (più basso = rimane di più)
    maxThickness: 50,               // spessore massimo della scia
    minThickness: 5                 // spessore minimo
};

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = config.baseHue;
let currentThickness = config.minThickness;

// ridimensiona il canvas a tutto schermo
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // quando ridimensiona, pulisce tutto o ol background diventa grigio
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();   // inizializzazione

function draw(e) {
    if (!isDrawing) return; // disegna solo se il mouse è premuto

    // calcolo la velocità del mouse per variare lo spessore
    // (distanza tra punto attuale e precedente)
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;
    const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // gestione dinamica dello spessore (più veloce = più sottile, effetto liquido)
    // piccolo smooth sullo spessore
    const targetThickness = Math.max(config.minThickness, config.maxThickness - speed * 1.5);
    currentThickness += (targetThickness - currentThickness) * 0.1; // smoothing

    // gestione colore randomico/ciclico
    ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
    ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;    // per i "capolini" rotondi
    hue += config.colorSpeed;   // cicla attraverso i colori dell'arcobaleno

    // setup dello stile di linea per l'effetto metallico/fluido
    ctx.lineWidth = currentThickness;
    ctx.lineCap = 'round';  // estremità arrotondate fondamentali
    ctx.lineJoin = 'round';

    // aggiungo un po' di ombra/glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsl(${hue}, 80%, 40%)`;

    // disegno la linea dal punto precedente a quello attuale
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    // aggiorno le coordinate precedenti
    [lastX, lastY] = [e.clientX, e.clientY];
}

function animate() {
    // crea una patina nera semi-trasparente sopra tutto
    ctx.globalCompositeOperation = 'source-over';   // default
    ctx.fillStyle = `rgba(0, 0, 0, ${config.fadeOpacity})`;

    // disabilito l'ombra per il rettangolo di fate altrimenti rallenta tutto
    ctx.shadowBlur = 0;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);
}

window.addEventListener('mousedown', (e) => {
    isDrawing = true;
    // aggiorno subito lastX/Y altrimenti la prima linea parte da 0,0
    [lastX, lastY] = [e.clientX, e.clientY];
    // reset spessore all'inizio del click
    currentThickness = config.maxThickness / 2;
});

window.addEventListener('mousemove', draw);

window.addEventListener('mouseup', () => isDrawing = false);
// se il mouse esce dal canvas, smette di disegnare
window.addEventListener('mouseout', () => isDrawing = false);

// --- fix per il tasto salva ---
const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('mousedown', (e) => {
    // ferma la propagazione del click
    // senza questo, il mousedown attiva 'isDrawing' sul canvas sotto al bottone
    e.stopPropagation();
});

saveBtn.addEventListener('click', (e) => {
    // per sicurezza, blocco anche qui
    e.stopPropagation();

    const link = document.createElement('a');
    link.download = 'zen-art.png';

    // per far si che il background sia nero nel salvataggio (dato che lo svanimento lavora in trasparenza)
    // creo un canvas temporaneo per il salvataggio
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // riempio di nero
    tempCtx.fillStyle = 'black';
    tempCtx.fillRect(0, 0, canvas.width, canvas.height);

    // disegno sopra il canvas attuale
    tempCtx.drawImage(canvas, 0, 0);

    link.href = canvas.toDataURL();
    link.click();
});

animate();