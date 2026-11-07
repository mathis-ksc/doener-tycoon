// =====================================================
//  STÄDTE — die Weltreise (Charlottes Idee)
// =====================================================
//
//  Man fängt in Ettlingen an. Wer in einer Stadt ALLE Upgrades
//  und ALLE Deko gekauft hat, zieht in die nächste Stadt.
//  Dort gibt es einen neuen, leeren Laden — Geld und Sterne
//  kommen mit. Jede Stadt sieht anders aus und ist schwerer.
//
//  preis   = so viel mal mehr kostet ein Döner (und Upgrades/Deko)
//  einkauf = so viel mal teurer sind die Zutaten
//  tempo   = so viel mal schneller kommen die Gäste
//
//  ⭐ Neue Stadt? Einfach einen Block kopieren und ändern!
// =====================================================

const STAEDTE = [
  {
    id: 'ettlingen', name: 'Ettlingen', flagge: '🇩🇪', schild: 'DÖNERBUDE',
    preis: 1, einkauf: 1, tempo: 1, ort: { lat: 48.9, lon: 8.4 }, etikett: { dx: 22, dy: 12 },
    himmel: ['#124', '#124', '#037', '#037', '#05a', '#05a', '#47b', '#47b', '#6cf', '#f9a', '#f80', '#f80'],
    farben: { wandLinks: '#d9534f', wandRechts: '#b5311e', boden1: '#f3dfbf', boden2: '#e8cfa6',
              strasse1: '#b9b9b9', strasse2: '#adadad', schild: '#ffd23f' },
  },
  {
    id: 'losangeles', name: 'Los Angeles', flagge: '🇺🇸', schild: 'DÖNER L.A.',
    preis: 1.5, einkauf: 1.3, tempo: 1.1, ort: { lat: 34, lon: -118 },
    himmel: ['#82a', '#82a', '#f4e', '#f4e', '#f9a', '#f9a', '#f80', '#f80', '#fd3', '#fd3', '#fec', '#fec'],
    farben: { wandLinks: '#ff99aa', wandRechts: '#dd5544', boden1: '#ffeecc', boden2: '#eebb77',
              strasse1: '#cccccc', strasse2: '#aaaaaa', schild: '#66ccff' },
  },
  {
    id: 'london', name: 'London', flagge: '🇬🇧', schild: 'LONDON DÖNER',
    preis: 2, einkauf: 1.6, tempo: 1.15, ort: { lat: 51.5, lon: -0.1 }, etikett: { dx: -16, dy: -6 },
    himmel: ['#444', '#444', '#777', '#777', '#777', '#aaa', '#aaa', '#aaa', '#ccc', '#ccc', '#ccc', '#fff'],
    farben: { wandLinks: '#22aa44', wandRechts: '#117744', boden1: '#cccccc', boden2: '#777777',
              strasse1: '#777777', strasse2: '#444444', schild: '#ffdd33' },
  },
  {
    id: 'newyork', name: 'New York', flagge: '🇺🇸', schild: 'NY DÖNER',
    preis: 2.5, einkauf: 2, tempo: 1.2, ort: { lat: 40.7, lon: -74 },
    himmel: ['#000', '#000', '#124', '#124', '#124', '#037', '#037', '#037', '#05a', '#05a', '#47b', '#47b'],
    farben: { wandLinks: '#bb3311', wandRechts: '#885533', boden1: '#cc8844', boden2: '#996633',
              strasse1: '#777777', strasse2: '#444444', schild: '#ffdd33' },
  },
  {
    id: 'tokio', name: 'Tokio', flagge: '🇯🇵', schild: 'DÖNER TOKIO',
    preis: 3, einkauf: 2.4, tempo: 1.25, ort: { lat: 35.7, lon: 139.7 },
    himmel: ['#000', '#124', '#124', '#82a', '#82a', '#82a', '#f4e', '#f4e', '#82a', '#124', '#124', '#000'],
    farben: { wandLinks: '#ff44ee', wandRechts: '#8822aa', boden1: '#ffffff', boden2: '#cccccc',
              strasse1: '#444444', strasse2: '#112244', schild: '#66ccff' },
  },
  {
    id: 'singapur', name: 'Singapur', flagge: '🇸🇬', schild: 'DÖNER SG',
    preis: 4, einkauf: 3, tempo: 1.3, ort: { lat: 1.3, lon: 103.8 },
    himmel: ['#05a', '#05a', '#47b', '#47b', '#6cf', '#6cf', '#6cf', '#9e6', '#9e6', '#6cf', '#6cf', '#47b'],
    farben: { wandLinks: '#66ccff', wandRechts: '#4477bb', boden1: '#ffeecc', boden2: '#ffddbb',
              strasse1: '#aaaaaa', strasse2: '#cccccc', schild: '#ff8800' },
  },
];

// Gäste, die nur in einer bestimmten Stadt kommen
KUNDEN_TYPEN.push(
  { name: 'Wanderer Hans',       stadt: 'ettlingen',  haare: 'glatze-rand', haarfarbe: '#8b5a2b', shirt: '#43a047', extra: 'kappe', mag: 'pflanze' },
  { name: 'Surfer Kai',          stadt: 'losangeles', haare: 'lang', haarfarbe: '#e8d07a', shirt: '#00acc1', extra: 'sonnenbrille', mag: 'lichterkette' },
  { name: 'Filmstar Bella',      stadt: 'losangeles', haare: 'lang', haarfarbe: '#e8d07a', shirt: '#ec407a', extra: 'sonnenbrille', extra2: 'kette', mag: 'statue' },
  { name: 'Wachsoldat Oliver',   stadt: 'london',     haare: 'kurz', shirt: '#e53935', hose: '#111111', extra: 'baerenfell', mag: 'uhr' },
  { name: 'Gentleman James',     stadt: 'london',     haare: 'kurz', shirt: '#222222', hose: '#222222', extra: 'zylinder', extra2: 'brille', mag: 'teppich' },
  { name: 'Taxifahrer Tony',     stadt: 'newyork',    haare: 'locken', shirt: '#fdd835', extra: 'kappe', kappenfarbe: '#fdd835', mag: 'fernseher' },
  { name: 'Brokerin Kim',        stadt: 'newyork',    haare: 'dutt', shirt: '#222222', hose: '#222222', extra: 'brille', mag: 'kuehlschrank' },
  { name: 'Gamerin Yuki',        stadt: 'tokio',      haare: 'zoepfe', haarfarbe: '#e0218a', shirt: '#8e24aa', extra: 'kopfhoerer', mag: 'neon' },
  { name: 'Schüler Haruto',      stadt: 'tokio',      haare: 'kurz', haarfarbe: '#111111', shirt: '#283593', kind: true, mag: 'aquarium' },
  { name: 'Köchin Mei',          stadt: 'singapur',   haare: 'dutt', haarfarbe: '#111111', shirt: '#ffffff', extra: 'kochmuetze', mag: 'poster' },
  { name: 'Touristin Sophie',    stadt: 'singapur',   haare: 'lang', shirt: '#fb8c00', extra: 'kappe', extra2: 'sonnenbrille', mag: 'pflanze' },
);

function aktuelleStadt() { return STAEDTE[Math.min(spiel.stadt || 0, STAEDTE.length - 1)]; }
function naechsteStadt() { return STAEDTE[(spiel.stadt || 0) + 1] || null; }

// Gäste, die in der aktuellen Stadt kommen dürfen
function gaesteHier(liste = KUNDEN_TYPEN) {
  const id = aktuelleStadt().id;
  return liste.filter(t => !t.stadt || t.stadt === id);
}

// Wie viel vom Laden in dieser Stadt schon gekauft ist
function ausbau() {
  const gesamt = SKILLS.length + DEKO.length;
  const fertig = spiel.skills.length + spiel.deko.length;
  return { fertig, gesamt, komplett: fertig >= gesamt };
}

// =====================================================
//  MALEN: der Blick aus dem Fenster und die Straßen-Deko
//  (benutzt iso, klotz, flach und pinsel aus bude.js)
// =====================================================

const FENSTER_BILD = {
  ettlingen(c, z) {   // Fachwerkhäuser und grüne Hügel
    c.fillStyle = '#6cf'; c.fillRect(0, 0, 62, 42);
    c.fillStyle = '#2a4'; c.beginPath(); c.ellipse(16, 44, 34, 16, 0, 0, Math.PI * 2); c.ellipse(52, 46, 30, 18, 0, 0, Math.PI * 2); c.fill();
    for (const [x, h] of [[6, 18], [26, 22], [44, 17]]) {
      c.fillStyle = '#fff'; c.fillRect(x, 42 - h, 14, h);
      c.strokeStyle = '#853'; c.lineWidth = 1.5; c.strokeRect(x, 42 - h, 14, h);
      c.beginPath(); c.moveTo(x, 42 - h); c.lineTo(x + 14, 42); c.moveTo(x + 14, 42 - h); c.lineTo(x, 42); c.stroke();
      c.fillStyle = '#b31'; c.beginPath(); c.moveTo(x - 2, 42 - h); c.lineTo(x + 7, 32 - h); c.lineTo(x + 16, 42 - h); c.fill();
    }
  },
  losangeles(c, z) {   // Sonnenuntergang, Hügel und Palmen
    const g = c.createLinearGradient(0, 0, 0, 42); g.addColorStop(0, '#f4e'); g.addColorStop(1, '#fd3');
    c.fillStyle = g; c.fillRect(0, 0, 62, 42);
    c.fillStyle = '#f80'; c.beginPath(); c.arc(31, 30, 9, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#853'; c.beginPath(); c.moveTo(0, 42); c.lineTo(0, 30); c.lineTo(20, 24); c.lineTo(40, 30); c.lineTo(62, 26); c.lineTo(62, 42); c.fill();
    for (const x of [10, 50]) palme(c, x, 42, 26, z);
  },
  london(c, z) {   // Regen, Uhrturm und roter Bus
    c.fillStyle = '#aaa'; c.fillRect(0, 0, 62, 42);
    c.fillStyle = '#777'; c.fillRect(8, 6, 8, 36); c.beginPath(); c.moveTo(7, 6); c.lineTo(12, -2); c.lineTo(17, 6); c.fill();
    c.fillStyle = '#fd3'; c.beginPath(); c.arc(12, 11, 2.5, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#777'; c.fillRect(20, 22, 42, 20);
    const bx = ((z * 12) % 100) - 30;
    c.fillStyle = '#e33'; c.fillRect(bx, 24, 26, 16);
    c.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { c.fillRect(bx + 2 + i * 6, 26, 4, 4); c.fillRect(bx + 2 + i * 6, 32, 4, 4); }
    c.strokeStyle = '#ccc'; c.lineWidth = 1;
    for (let i = 0; i < 10; i++) { const rx = (i * 13 + z * 30) % 66, ry = (i * 17 + z * 60) % 46; c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx - 2, ry + 5); c.stroke(); }
  },
  newyork(c, z) {   // Wolkenkratzer bei Nacht und gelbes Taxi
    c.fillStyle = '#124'; c.fillRect(0, 0, 62, 42);
    for (const [x, b, h] of [[0, 12, 30], [13, 10, 40], [24, 14, 26], [39, 9, 36], [49, 13, 22]]) {
      c.fillStyle = '#000'; c.fillRect(x, 42 - h, b, h);
      c.fillStyle = '#fd3';
      for (let y = 42 - h + 3; y < 38; y += 5) for (let wx = x + 2; wx < x + b - 2; wx += 4) if ((wx * 7 + y * 3) % 5 > 1) c.fillRect(wx, y, 2, 2);
    }
    const tx = ((z * 18) % 90) - 20;
    c.fillStyle = '#fd3'; c.fillRect(tx, 36, 14, 5); c.fillRect(tx + 3, 33, 8, 3);
    c.fillStyle = '#000'; c.fillRect(tx + 2, 41, 3, 1); c.fillRect(tx + 9, 41, 3, 1);
  },
  tokio(c, z) {   // Neon-Nacht, Berg und Kirschblüten
    c.fillStyle = '#124'; c.fillRect(0, 0, 62, 42);
    c.fillStyle = '#82a'; c.beginPath(); c.moveTo(14, 42); c.lineTo(36, 10); c.lineTo(58, 42); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.moveTo(31, 17); c.lineTo(36, 10); c.lineTo(41, 17); c.fill();
    const an = Math.sin(z * 6) > -0.6;
    c.fillStyle = an ? '#f4e' : '#82a'; c.fillRect(3, 20, 8, 16);
    c.fillStyle = an ? '#6cf' : '#47b'; c.fillRect(48, 24, 10, 12);
    c.fillStyle = '#f9a';
    for (const [x, y] of [[20, 30], [24, 27], [28, 31], [22, 34], [26, 33]]) { c.beginPath(); c.arc(x, y, 3, 0, Math.PI * 2); c.fill(); }
    c.fillStyle = '#853'; c.fillRect(24, 34, 2, 8);
  },
  singapur(c, z) {   // Hochhäuser am Wasser
    c.fillStyle = '#6cf'; c.fillRect(0, 0, 62, 42);
    c.fillStyle = '#47b'; c.fillRect(0, 32, 62, 10);
    c.fillStyle = '#aaa';
    for (const x of [16, 26, 36]) c.fillRect(x, 12, 6, 20);
    c.fillStyle = '#777'; c.fillRect(13, 9, 32, 3);
    c.fillStyle = '#ccc'; c.fillRect(48, 18, 8, 14); c.fillRect(3, 20, 8, 12);
    c.strokeStyle = '#fff'; c.lineWidth = 1;
    for (let i = 0; i < 4; i++) { const wx = (i * 17 + z * 8) % 62; c.beginPath(); c.moveTo(wx, 36 + (i % 2) * 3); c.lineTo(wx + 5, 36 + (i % 2) * 3); c.stroke(); }
  },
};

function palme(c, x, boden, hoehe, z) {
  c.strokeStyle = '#853'; c.lineWidth = 2.5;
  c.beginPath(); c.moveTo(x, boden); c.quadraticCurveTo(x + 3, boden - hoehe / 2, x + 1, boden - hoehe); c.stroke();
  c.strokeStyle = '#174'; c.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const w = -Math.PI + i * Math.PI / 4 + Math.sin(z * 2 + i) * 0.08;
    c.beginPath(); c.moveTo(x + 1, boden - hoehe);
    c.quadraticCurveTo(x + 1 + Math.cos(w) * 7, boden - hoehe - 5, x + 1 + Math.cos(w) * 11, boden - hoehe + Math.abs(Math.sin(w)) * 2 + 4);
    c.stroke();
  }
}

// Das Fenster in der linken Wand mit dem Blick auf die Stadt
function zeichneStadtFenster(zeit) {
  flach(0, 3.8, 70, 'y', c => {
    c.save();
    c.beginPath(); c.rect(0, 0, 62, 42); c.clip();
    FENSTER_BILD[aktuelleStadt().id](c, zeit);
    c.restore();
    c.strokeStyle = '#fff'; c.lineWidth = 3; c.strokeRect(0, 0, 62, 42);
    c.lineWidth = 2; c.beginPath(); c.moveTo(31, 0); c.lineTo(31, 42); c.moveTo(0, 21); c.lineTo(62, 21); c.stroke();
    c.strokeStyle = '#2b1a0e'; c.lineWidth = 1; c.strokeRect(-1.5, -1.5, 65, 45);
  });
}

// Etwas Typisches auf der Straße vor der Bude
const STRASSEN_POS = { x: 11.6, y: 6.6 };
const STRASSEN_DEKO = {
  ettlingen(z) {   // Laterne
    const p = iso(STRASSEN_POS.x, STRASSEN_POS.y);
    pinsel.fillStyle = '#222'; pinsel.fillRect(p.x - 2, p.y - 70, 4, 70);
    pinsel.fillStyle = '#fd3'; pinsel.fillRect(p.x - 6, p.y - 82, 12, 12);
    pinsel.strokeStyle = '#222'; pinsel.lineWidth = 2; pinsel.strokeRect(p.x - 6, p.y - 82, 12, 12); pinsel.lineWidth = 1;
  },
  losangeles(z) { const p = iso(STRASSEN_POS.x, STRASSEN_POS.y); palmeGross(p, z); },
  london() {   // rote Telefonzelle
    klotz(STRASSEN_POS.x - 0.35, STRASSEN_POS.y - 0.35, 0.7, 0.7, 70, '#e33', '#e33', '#b31');
    flach(STRASSEN_POS.x - 0.35, STRASSEN_POS.y + 0.35, 66, 'x', c => {
      c.fillStyle = '#fff'; for (let i = 0; i < 3; i++) c.fillRect(4, 12 + i * 14, 14, 10);
    });
  },
  newyork() {   // Hydrant
    const p = iso(STRASSEN_POS.x, STRASSEN_POS.y);
    pinsel.fillStyle = '#e33'; pinsel.strokeStyle = '#2b1a0e';
    pinsel.beginPath(); pinsel.roundRect(p.x - 7, p.y - 24, 14, 24, 3); pinsel.fill(); pinsel.stroke();
    pinsel.beginPath(); pinsel.arc(p.x, p.y - 24, 7, Math.PI, 0); pinsel.fill(); pinsel.stroke();
    pinsel.fillRect(p.x - 11, p.y - 17, 22, 5);
  },
  tokio(z) {   // Getränkeautomat
    klotz(STRASSEN_POS.x - 0.35, STRASSEN_POS.y - 0.3, 0.7, 0.6, 62, '#ffffff', '#1e88e5', '#1565c0');
    flach(STRASSEN_POS.x - 0.35, STRASSEN_POS.y + 0.3, 60, 'x', c => {
      c.fillStyle = Math.sin(z * 5) > 0 ? '#6cf' : '#fff'; c.fillRect(2, 4, 18, 22);
      const dosen = ['#e33', '#fd3', '#2a4', '#f80'];
      for (let i = 0; i < 4; i++) { c.fillStyle = dosen[i]; c.fillRect(4 + i * 4, 8, 3, 6); c.fillRect(4 + i * 4, 17, 3, 6); }
    });
  },
  singapur(z) { const p = iso(STRASSEN_POS.x, STRASSEN_POS.y); palmeGross(p, z); },
};

function palmeGross(p, z) {
  pinsel.save(); pinsel.translate(p.x, p.y); pinsel.scale(3, 3);
  palme(pinsel, 0, 0, 30, z);
  pinsel.restore();
}

function zeichneStrassenDeko(zeit) { STRASSEN_DEKO[aktuelleStadt().id](zeit); }

// Farben der Bude auf die Stadt umstellen
function wendeStadtAn() {
  const s = aktuelleStadt();
  Object.assign(FARBEN, s.farben);
  const rahmen = document.getElementById('szene-rahmen');
  const n = s.himmel.length;
  rahmen.style.background = 'linear-gradient(to bottom, ' +
    s.himmel.map((f, i) => `${f} ${i / n * 100}% ${(i + 1) / n * 100}%`).join(', ') + ')';
  document.getElementById('stadt').textContent = s.name;
}
