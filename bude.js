// =====================================================
//  DIE BUDE — schräg von oben (isometrisch)
// =====================================================
//
//  Der Boden ist ein Gitter aus Kacheln. Jede Kachel hat
//  eine Position x (nach rechts unten) und y (nach links unten).
//  Die Funktion iso() rechnet das in Bildschirm-Pixel um.
//
//  ⭐ Zum Ausprobieren: Farben und Positionen hier oben ändern!
// =====================================================

const KACHEL_B = 64;    // Breite einer Bodenkachel in Pixeln
const KACHEL_H = 32;    // Höhe einer Bodenkachel (halb so hoch = schräg von oben)
const BREITE = 12;      // so viele Kacheln nach rechts
const TIEFE = 10;       // so viele Kacheln nach vorne
const LADEN_TIEFE = 6;  // ab hier ist Straße statt Laden

const FARBEN = {
  boden1: '#f3dfbf', boden2: '#e8cfa6',
  strasse1: '#b9b9b9', strasse2: '#adadad',
  wandLinks: '#d9534f', wandRechts: '#b5311e',
  thekeOben: '#f7f7f7', thekeVorne: '#4a7bbf', thekeSeite: '#355d94',
  schild: '#ffd23f',
};

const THEKE = { x: 2, y: 4, breite: 7, tiefe: 0.8, hoehe: 34 };
const SPIESS = { x: 1.5, y: 3.2 };
const KOCH_POS = { x: 6, y: 3.5 };
const EINGANG = { x: 13, y: 8.5 };     // hier kommen Kunden rein
const AUSGANG = { x: -2, y: 8.5 };     // hier gehen sie raus
const SCHLANGE = [ { x: 6, y: 5.3 }, { x: 6.3, y: 6.5 }, { x: 6.6, y: 7.7 }, { x: 6.9, y: 8.9 } ];
const LAUF_TEMPO = 3;   // Kacheln pro Sekunde

let gehende = [];       // Kunden, die gerade rausgehen
let effekte = [];       // fliegendes Geld "+9,00 $"

// ---------- Umrechnen: Kachel → Bildschirm ----------

const szene = document.getElementById('szene');
const pinsel = szene.getContext('2d');
const MITTE_X = TIEFE * KACHEL_B / 2 + 30;
const OBEN_Y = 90;

function iso(x, y, hoehe = 0) {
  return {
    x: MITTE_X + (x - y) * KACHEL_B / 2,
    y: OBEN_Y + (x + y) * KACHEL_H / 2 - hoehe,
  };
}

function viereck(punkte, farbe, rand = 'rgba(0,0,0,0.25)') {
  pinsel.beginPath();
  punkte.forEach((p, i) => i ? pinsel.lineTo(p.x, p.y) : pinsel.moveTo(p.x, p.y));
  pinsel.closePath();
  pinsel.fillStyle = farbe;
  pinsel.fill();
  pinsel.strokeStyle = rand;
  pinsel.lineWidth = 1;
  pinsel.stroke();
}

// Ein Klotz: Boden bei (x, y), so breit/tief/hoch. "basis" = wie hoch er schwebt.
function klotz(x, y, b, t, h, oben, vorne, seite, basis = 0) {
  const u = basis, o = basis + h;
  viereck([iso(x, y + t, u), iso(x + b, y + t, u), iso(x + b, y + t, o), iso(x, y + t, o)], vorne);
  viereck([iso(x + b, y, u), iso(x + b, y + t, u), iso(x + b, y + t, o), iso(x + b, y, o)], seite);
  viereck([iso(x, y, o), iso(x + b, y, o), iso(x + b, y + t, o), iso(x, y + t, o)], oben);
}

// Etwas flach auf eine Fläche malen (Wand oder Vorderseite von einem Klotz).
// "richtung" = 'x' (Fläche läuft nach rechts hinten) oder 'y' (läuft nach links vorne).
// Im malen()-Teil ist 1 Kachel = 32 Pixel breit.
function flach(x, y, hoehe, richtung, malen) {
  const p = iso(x, y, hoehe);
  pinsel.save();
  pinsel.translate(p.x, p.y);
  pinsel.transform(1, richtung === 'x' ? 0.5 : -0.5, 0, 1, 0, 0);
  malen(pinsel);
  pinsel.restore();
}

// ---------- Die Teile der Bude ----------

function zeichneBoden() {
  for (let x = 0; x < BREITE; x++) {
    for (let y = 0; y < TIEFE; y++) {
      const laden = y < LADEN_TIEFE;
      const hell = (x + y) % 2 === 0;
      const farbe = laden ? (hell ? FARBEN.boden1 : FARBEN.boden2)
                          : (hell ? FARBEN.strasse1 : FARBEN.strasse2);
      viereck([iso(x, y), iso(x + 1, y), iso(x + 1, y + 1), iso(x, y + 1)], farbe, 'rgba(0,0,0,0.08)');
    }
  }
}

function zeichneWaende() {
  const h = 80;
  viereck([iso(0, 0), iso(0, LADEN_TIEFE), iso(0, LADEN_TIEFE, h), iso(0, 0, h)], FARBEN.wandLinks);
  viereck([iso(0, 0), iso(BREITE, 0), iso(BREITE, 0, h), iso(0, 0, h)], FARBEN.wandRechts);

  // Schild an der hinteren Wand
  flach(4, 0, 70, 'x', c => {
    c.fillStyle = FARBEN.schild; c.fillRect(0, 0, 192, 30);
    c.strokeStyle = '#2b1a0e'; c.lineWidth = 2; c.strokeRect(0, 0, 192, 30);
    c.fillStyle = '#b5311e'; c.font = 'bold 22px system-ui';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('DÖNERBUDE', 96, 16);
  });
}

function zeichneSpiess(zeit) {
  const unten = iso(SPIESS.x, SPIESS.y);
  const h = 95, rOben = 16, rUnten = 22;
  pinsel.fillStyle = '#555';
  pinsel.fillRect(unten.x - 2, unten.y - h - 20, 4, h + 20);  // Stange
  pinsel.beginPath();
  pinsel.moveTo(unten.x - rUnten, unten.y - 8);
  pinsel.lineTo(unten.x - rOben, unten.y - h);
  pinsel.lineTo(unten.x + rOben, unten.y - h);
  pinsel.lineTo(unten.x + rUnten, unten.y - 8);
  pinsel.closePath();
  pinsel.fillStyle = '#9b4a1c';
  pinsel.fill();
  pinsel.strokeStyle = '#2b1a0e';
  pinsel.lineWidth = 2;
  pinsel.stroke();
  // Streifen, die sich bewegen — so sieht es aus, als dreht er sich
  pinsel.strokeStyle = '#d98b4f';
  for (let i = 0; i < 6; i++) {
    const s = ((i * 16 + zeit * 20) % 96);
    const yy = unten.y - 10 - s * (h - 12) / 96;
    const r = rUnten - (rUnten - rOben) * s / 96;
    pinsel.beginPath();
    pinsel.moveTo(unten.x - r + 3, yy);
    pinsel.quadraticCurveTo(unten.x, yy + 5, unten.x + r - 3, yy);
    pinsel.stroke();
  }
  pinsel.lineWidth = 1;
}

// Der Koch ist Mathis' Avatar aus index.html — wir malen ihn als Bild
// (ohne roten Kreis und Logo-Spieß — die sind nur fürs Logo)
const kochSvg = document.getElementById('koch').cloneNode(true);
kochSvg.querySelectorAll('.nur-logo').forEach(teil => teil.remove());
const kochBild = new Image();
kochBild.src = 'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(new XMLSerializer().serializeToString(kochSvg));

const KOCH_GROESSE = 0.85;
function zeichneKoch(zeit) {
  const p = iso(KOCH_POS.x, KOCH_POS.y);
  const wippen = Math.sin(zeit * 3) * 2;
  const s = KOCH_GROESSE;
  // 128/215 = wo im Bild die Füße vom Koch sind
  if (kochBild.complete) pinsel.drawImage(kochBild, p.x - 128 * s, p.y - 215 * s + wippen, 200 * s, 220 * s);
}

function zeichneTheke() {
  klotz(THEKE.x, THEKE.y, THEKE.breite, THEKE.tiefe, THEKE.hoehe,
        FARBEN.thekeOben, FARBEN.thekeVorne, FARBEN.thekeSeite);
  // das Gericht, das gerade gebaut wird, liegt auf der Theke
  if (gericht) {
    const p = iso(KOCH_POS.x, THEKE.y + 0.4, THEKE.hoehe);
    pinsel.fillStyle = '#000';
    pinsel.font = '28px system-ui';
    pinsel.textAlign = 'center';
    pinsel.fillText(gericht.typ === 'doener' ? '🥙' : '🌯', p.x, p.y + 8);
  }
}

// =====================================================
//  DEKO — jedes Teil hat seine eigene Mal-Funktion
// =====================================================

const DEKO_MALEN = {
  teppich() {
    viereck([iso(9.4, 1.4), iso(11.9, 1.4), iso(11.9, 5.6), iso(9.4, 5.6)], '#b8323a');
    viereck([iso(9.7, 1.7), iso(11.6, 1.7), iso(11.6, 5.3), iso(9.7, 5.3)], '#d9534f', '#f2c14e');
  },

  lichterkette(zeit) {
    const farben = ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff'];
    const lampen = [];
    for (let x = 0; x <= BREITE; x += 0.5) lampen.push(iso(x, 0, 76 - 4 * Math.abs(Math.sin(x * Math.PI))));
    for (let y = 0.5; y <= LADEN_TIEFE; y += 0.5) lampen.push(iso(0, y, 76 - 4 * Math.abs(Math.sin(y * Math.PI))));
    lampen.forEach((p, i) => {
      const an = (i + Math.floor(zeit * 3)) % 4;
      pinsel.beginPath(); pinsel.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      pinsel.fillStyle = farben[an]; pinsel.shadowColor = farben[an]; pinsel.shadowBlur = 8;
      pinsel.fill(); pinsel.shadowBlur = 0;
    });
  },

  poster() {
    flach(0, 1.4, 68, 'y', c => {
      kasten(c, 0, 0, 40, 46, '#fff8e0', 2);
      c.fillStyle = '#b5311e'; c.font = 'bold 10px system-ui'; c.textAlign = 'center';
      c.fillText('DÖNER', 20, 13); c.fillText('DELUXE', 20, 24);
      c.fillStyle = '#000'; c.font = '16px system-ui'; c.fillText('🥙', 20, 42);
    });
  },

  neon(zeit) {
    const flackern = Math.sin(zeit * 20) > -0.9 ? 1 : 0.4;
    flach(0, 5.6, 62, 'y', c => {
      c.globalAlpha = flackern;
      c.strokeStyle = '#ff3df2'; c.lineWidth = 2; c.shadowColor = '#ff3df2'; c.shadowBlur = 12;
      c.strokeRect(0, 0, 54, 24);
      c.fillStyle = '#ff9cf8'; c.font = 'bold 17px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('OPEN', 27, 13);
    });
  },

  uhr() {
    flach(3.15, 0, 74, 'x', c => {
      kreis(c, 11, 11, 11, '#fff');
      // der Zeiger läuft einmal rum, solange der Tag dauert
      const winkel = (1 - zeitRest / TAG_LAENGE) * Math.PI * 2 - Math.PI / 2;
      c.strokeStyle = '#d61f1f'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(11, 11); c.lineTo(11 + Math.cos(winkel) * 8, 11 + Math.sin(winkel) * 8); c.stroke();
      c.strokeStyle = '#2b1a0e';
      c.beginPath(); c.moveTo(11, 11); c.lineTo(11, 5); c.stroke();
    });
  },

  fernseher(zeit) {
    flach(1.4, 0, 70, 'x', c => {
      kasten(c, 0, 0, 52, 32, '#111', 3);
      c.fillStyle = '#2e9e44'; c.fillRect(3, 3, 46, 26);
      c.strokeStyle = '#fff'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(26, 3); c.lineTo(26, 29); c.stroke();
      c.strokeRect(3, 9, 6, 14); c.strokeRect(43, 9, 6, 14);
      const ball = 26 + Math.sin(zeit * 1.7) * 18;
      kreis(c, 26 + Math.sin(zeit * 1.1) * 12, 12, 2, '#e53935', false);
      kreis(c, 26 - Math.sin(zeit * 1.3) * 12, 20, 2, '#1e88e5', false);
      kreis(c, ball, 16 + Math.cos(zeit * 2.3) * 6, 1.6, '#fff', false);
    });
  },

  kuehlschrank() {
    klotz(0.15, 0.2, 1.0, 0.9, 78, '#e0e0e0', '#f2f7fb', '#b9c7d3');
    flach(0.15, 1.1, 78, 'x', c => {
      c.fillStyle = 'rgba(120,200,255,0.55)'; c.fillRect(4, 6, 24, 62);
      const flaschen = ['#e53935', '#43a047', '#fb8c00', '#1e88e5', '#ffffff'];
      for (let reihe = 0; reihe < 4; reihe++)
        for (let i = 0; i < 4; i++) {
          c.fillStyle = flaschen[(reihe + i) % flaschen.length];
          c.fillRect(6 + i * 5.5, 12 + reihe * 15, 4, 11);
        }
      c.fillStyle = '#b5311e'; c.fillRect(4, 0, 24, 5);
    });
  },

  aquarium(zeit) {
    klotz(10.5, 0.15, 1.3, 0.6, 22, '#6d4c41', '#5d4037', '#4e342e');
    klotz(10.5, 0.15, 1.3, 0.6, 32, 'rgba(170,230,255,0.75)', 'rgba(80,170,240,0.6)', 'rgba(60,140,220,0.6)', 22);
    flach(10.5, 0.75, 54, 'x', c => {
      for (const [tempo, hoehe, farbe] of [[0.8, 10, '#ff9800'], [1.3, 22, '#ffeb3b']]) {
        const fx = 6 + (Math.sin(zeit * tempo) + 1) / 2 * 30;
        const blick = Math.cos(zeit * tempo) > 0 ? 1 : -1;
        c.fillStyle = farbe;
        c.beginPath(); c.ellipse(fx, hoehe, 4, 2.5, 0, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(fx - blick * 3, hoehe); c.lineTo(fx - blick * 7, hoehe - 3); c.lineTo(fx - blick * 7, hoehe + 3); c.fill();
      }
      // Blubberblasen
      c.fillStyle = 'rgba(255,255,255,0.8)';
      for (let i = 0; i < 3; i++) {
        const by = 30 - ((zeit * 10 + i * 10) % 28);
        c.beginPath(); c.arc(34 + i * 1.5, by, 1.2, 0, Math.PI * 2); c.fill();
      }
    });
  },

  pflanze() {
    klotz(11.2, 5.1, 0.5, 0.5, 14, '#c0643a', '#a8522c', '#8f4422');
    const p = iso(11.45, 5.35, 14);
    pinsel.fillStyle = '#2e7d32'; pinsel.strokeStyle = '#1b5e20';
    for (let i = 0; i < 7; i++) {
      const w = -Math.PI / 2 + (i - 3) * 0.38;
      pinsel.beginPath();
      pinsel.ellipse(p.x + Math.cos(w) * 12, p.y + Math.sin(w) * 16 - 4, 4, 12, w + Math.PI / 2, 0, Math.PI * 2);
      pinsel.fill(); pinsel.stroke();
    }
  },

  statue(zeit) {
    klotz(0.6, 5.0, 0.7, 0.7, 18, '#e0e0e0', '#bdbdbd', '#9e9e9e');
    const p = iso(0.95, 5.35, 18);
    pinsel.beginPath();
    pinsel.moveTo(p.x - 13, p.y); pinsel.lineTo(p.x - 9, p.y - 50);
    pinsel.lineTo(p.x + 9, p.y - 50); pinsel.lineTo(p.x + 13, p.y); pinsel.closePath();
    pinsel.fillStyle = '#ffc83d'; pinsel.fill();
    pinsel.strokeStyle = '#a07800'; pinsel.lineWidth = 2; pinsel.stroke(); pinsel.lineWidth = 1;
    pinsel.fillStyle = '#555'; pinsel.fillRect(p.x - 1.5, p.y - 62, 3, 14);
    // Glitzer
    const g = (Math.sin(zeit * 4) + 1) / 2;
    pinsel.fillStyle = `rgba(255,255,255,${g})`;
    pinsel.font = '14px system-ui'; pinsel.textAlign = 'center';
    pinsel.fillText('✦', p.x + 6, p.y - 30);
    pinsel.fillText('✦', p.x - 7, p.y - 12 - g * 4);
  },
};

// wo die Deko auf dem Boden steht — damit Leute davor/dahinter richtig gemalt werden
const DEKO_VORNE = { pflanze: 11.45 + 5.35, statue: 0.95 + 5.35 };

function malDeko(id, zeit) { if (hatDeko(id)) DEKO_MALEN[id](zeit); }

// ---------- Tisch mit Hockern: Gäste setzen sich zum Essen ----------

const HOCKER = [ { x: 9.6, y: 2.8 }, { x: 10.6, y: 1.85 }, { x: 11.65, y: 2.8 }, { x: 10.6, y: 3.85 } ];
const TISCH = { x: 10.2, y: 2.4, b: 1.2, t: 1.2 };
// Sitzplätze: wo der Gast sitzt und über welchen Umweg er hin- und zurückläuft
const SITZE = [
  { x: 9.82,  y: 3.02, umweg: { x: 9.4,  y: 3.1 } },
  { x: 10.82, y: 2.07, umweg: { x: 9.3,  y: 2.1 } },
  { x: 11.87, y: 3.02, umweg: { x: 11.9, y: 4.6 } },
  { x: 10.82, y: 4.07, umweg: { x: 10.8, y: 4.9 } },
];
const VOR_DER_THEKE = { x: 9.5, y: 5.4 };
const STRASSE = { x: 9.0, y: 7.2 };

function malHocker(h) { klotz(h.x, h.y, 0.45, 0.45, 14, '#e53935', '#c62828', '#a31f1f'); }
function malTisch() { klotz(TISCH.x, TISCH.y, TISCH.b, TISCH.t, 24, '#d7a26a', '#a0673a', '#8a5630'); }

let sitzende = [];   // Gäste, die gerade am Tisch essen

function platzBelegt(nr) {
  return sitzende.some(g => g.sitz === nr) || gehende.some(g => g.sitz === nr);
}

function jemandSitzt() {
  return sitzende.length > 0 || gehende.some(g => g.sitz !== null && g.sitz !== undefined);
}

// ---------- Leute ----------

function zeichneMensch(k, stimmung, sitzt = false) {
  const p = sitzt ? iso(k.x, k.y, 14) : iso(k.x, k.y);
  let laune;
  if (stimmung) laune = stimmung === '😋' ? 'froh' : 'sauer';
  else {
    const anteil = k.geduld / k.geduldMax;
    laune = anteil < 0.25 ? 'sauer' : anteil < 0.5 ? 'normal' : 'froh';
  }
  zeichneFigur(pinsel, p.x, p.y, k.look, k.laeuft ? k.schritt : null, laune, null, sitzt);

  const skala = k.look.kind ? 0.75 : 1;
  const kopf = p.y - skala * (sitzt ? 82 : 90);
  pinsel.textAlign = 'center';

  if (sitzt) {
    pinsel.fillStyle = '#000'; pinsel.font = '16px system-ui';
    pinsel.fillText('🥙', p.x + 12 * skala, p.y - 22 * skala);
    return;
  }

  if (k.vip) {   // goldenes Glitzern über VIPs
    pinsel.fillStyle = '#fd3'; pinsel.font = 'bold 14px monospace';
    pinsel.fillText('VIP', p.x, kopf - 8);
  }

  if (stimmung) {
    pinsel.fillStyle = '#000';
    pinsel.font = '22px system-ui';
    pinsel.fillText(stimmung, p.x, kopf);
    return;
  }

  // Herz-Blase: der Gast hat seine Lieblings-Deko entdeckt
  if (k.mag && k.herz > 0) {
    const bx = p.x + 20, by = kopf - 24;
    pinsel.fillStyle = '#fff'; pinsel.strokeStyle = '#000'; pinsel.lineWidth = 2;
    pinsel.beginPath(); pinsel.roundRect(bx - 22, by - 16, 44, 26, 6); pinsel.fill(); pinsel.stroke();
    pinsel.beginPath(); pinsel.moveTo(bx - 14, by + 10); pinsel.lineTo(bx - 20, by + 18); pinsel.lineTo(bx - 6, by + 10); pinsel.fill();
    pinsel.fillStyle = '#000'; pinsel.font = '16px system-ui';
    pinsel.fillText('❤' + k.mag.emoji, bx, by + 4);
    pinsel.lineWidth = 1;
  }

  // Geduldsbalken über dem Kopf
  const anteil = Math.max(0, k.geduld / k.geduldMax);
  pinsel.fillStyle = '#000';
  pinsel.fillRect(p.x - 19, kopf - 1, 38, 7);
  pinsel.fillStyle = anteil < 0.25 ? '#e33' : anteil < 0.5 ? '#f80' : '#fff';
  pinsel.fillRect(p.x - 18, kopf, 36 * anteil, 5);
  if (k.mag) { pinsel.fillStyle = '#e33'; pinsel.font = '12px system-ui'; pinsel.fillText('❤', p.x + 26, kopf + 6); }
}

// Feuer auf der Theke, wenn die Combo läuft
function zeichneComboFeuer(zeit) {
  const mal = comboFaktor();
  if (mal <= 1) return;
  const groesse = mal >= 3 ? 1.6 : mal >= 2 ? 1.3 : 1;
  for (let i = 0; i < 5; i++) {
    const p = iso(4.6 + i * 0.7, 4.4, THEKE.hoehe);
    const h = (16 + Math.sin(zeit * 14 + i * 2) * 5) * groesse;
    for (const [farbe, f] of [['#e33', 1], ['#f80', 0.7], ['#fd3', 0.4]]) {
      pinsel.beginPath();
      pinsel.moveTo(p.x - 7 * f * groesse, p.y);
      pinsel.quadraticCurveTo(p.x - 6 * f, p.y - h * f * 0.6, p.x, p.y - h * f);
      pinsel.quadraticCurveTo(p.x + 6 * f, p.y - h * f * 0.6, p.x + 7 * f * groesse, p.y);
      pinsel.closePath();
      pinsel.fillStyle = farbe; pinsel.fill();
    }
  }
}

function zeichneEffekte() {
  for (const e of effekte) {
    const p = iso(e.x, e.y);
    pinsel.globalAlpha = Math.max(0, 1 - e.alter / 1.5);
    pinsel.font = `bold ${e.gross ? 26 : 20}px monospace`;
    pinsel.textAlign = 'center';
    pinsel.lineWidth = 4; pinsel.strokeStyle = '#000';
    const y = p.y - (e.hoehe || 100) - e.alter * 40;
    pinsel.strokeText(e.text, p.x, y);
    pinsel.fillStyle = e.farbe || '#fd3';
    pinsel.fillText(e.text, p.x, y);
    pinsel.globalAlpha = 1; pinsel.lineWidth = 1;
  }
}

// wird von spiel.js aufgerufen
function comboEffekt(text, farbe) {
  effekte.push({ x: 6, y: 4.4, text, alter: 0, farbe, gross: true, hoehe: 70 });
}

// ---------- Bewegen ----------

function laufeZu(k, ziel, dt) {
  const dx = ziel.x - k.x, dy = ziel.y - k.y;
  const weg = Math.hypot(dx, dy);
  const schritt = LAUF_TEMPO * dt;
  if (weg <= schritt) { k.x = ziel.x; k.y = ziel.y; k.laeuft = false; return true; }
  k.x += dx / weg * schritt;
  k.y += dy / weg * schritt;
  k.laeuft = true;
  k.schritt = (k.schritt || 0) + dt * 12;
  return false;
}

// wird von spiel.js aufgerufen, wenn ein Kunde fertig ist
function kundeGeht(k, stimmung, text) {
  if (text) effekte.push({ x: k.x, y: k.y, text, alter: 0 });
  let sitz = null;
  if (stimmung === '😋' && hatDeko('tisch')) {
    const frei = SITZE.findIndex((s, nr) => !platzBelegt(nr));
    if (frei >= 0) sitz = frei;
  }
  const weg = sitz !== null
    ? [VOR_DER_THEKE, SITZE[sitz].umweg, SITZE[sitz]]
    : [AUSGANG];
  gehende.push({ ...k, stimmung, sitz, weg: [...weg] });
}

// Laufen: 20 Mal pro Sekunde ein kleines Stück
function bewegen() {
  if (pausiert) return;
  const dt = 0.05;
  kunden.forEach((k, i) => laufeZu(k, SCHLANGE[i] || SCHLANGE[SCHLANGE.length - 1], dt));

  const nochUnterwegs = [];
  for (const g of gehende) {
    if (laufeZu(g, g.weg[0], dt)) g.weg.shift();
    if (g.weg.length) nochUnterwegs.push(g);
    else if (g.sitz !== null) sitzende.push({ ...g, rest: SITZ_ZEIT, laeuft: false });
  }
  gehende = nochUnterwegs;

  for (const s of sitzende) s.rest -= dt;
  for (const s of sitzende.filter(s => s.rest <= 0)) {
    const betrag = sattBezahlt(s);
    effekte.push({ x: s.x, y: s.y, text: `+${dollar(betrag)} satt!`, alter: 0, farbe: '#9e6' });
    const platz = SITZE[s.sitz];
    gehende.push({ ...s, sitz: null, stimmung: '😋', weg: [platz.umweg, VOR_DER_THEKE, STRASSE, AUSGANG] });
  }
  sitzende = sitzende.filter(s => s.rest > 0);

  effekte.forEach(e => e.alter += dt);
  effekte = effekte.filter(e => e.alter < 1.5);
}
setInterval(bewegen, 50);

// ---------- Jedes Bild neu malen ----------

// Amiga-Look: Die Leinwand ist nur halb so groß (385 × 228 Pixel, fast wie ein Amiga 500).
// Wir malen alles mit Maßstab 0,5 hinein, und retro.js macht 32 Farben daraus.
// Im glatten Look ist sie voll groß (770 × 455).
function passeGroesseAn() {
  const breite = einstellungen.retro ? 385 : 770;
  if (szene.width !== breite) {
    szene.width = breite;
    szene.height = einstellungen.retro ? 228 : 455;
  }
  pinsel.imageSmoothingEnabled = !einstellungen.retro;
  return breite / 770;
}

function malen(jetzt) {
  const zeit = jetzt / 1000;
  const massstab = passeGroesseAn();

  pinsel.setTransform(massstab, 0, 0, massstab, 0, 0);
  zeichneCopper(pinsel, 770, 455);
  zeichneBoden();
  malDeko('teppich', zeit);
  zeichneWaende();
  for (const id of ['lichterkette', 'poster', 'neon', 'uhr', 'fernseher', 'kuehlschrank', 'aquarium'])
    malDeko(id, zeit);
  zeichneSpiess(zeit);
  zeichneKoch(zeit);
  zeichneTheke();
  zeichneComboFeuer(zeit);

  // vorne: Leute, Tisch und Deko nach Tiefe sortiert, damit Vorderes vor Hinterem ist
  const vorne = [
    ...kunden.map(k => ({ tiefe: k.x + k.y, mal: () => zeichneMensch(k, null) })),
    ...gehende.map(k => ({ tiefe: k.x + k.y, mal: () => zeichneMensch(k, k.stimmung) })),
    ...sitzende.map(k => ({ tiefe: k.x + k.y + 0.01, mal: () => zeichneMensch(k, null, true) })),
    ...Object.keys(DEKO_VORNE).filter(hatDeko).map(id => ({ tiefe: DEKO_VORNE[id], mal: () => DEKO_MALEN[id](zeit) })),
  ];
  if (hatDeko('tisch')) {
    HOCKER.forEach(h => vorne.push({ tiefe: h.x + h.y + 0.45, mal: () => malHocker(h) }));
    vorne.push({ tiefe: TISCH.x + TISCH.y + 1.2, mal: malTisch });
  }
  vorne.sort((a, b) => a.tiefe - b.tiefe).forEach(teil => teil.mal());
  zeichneEffekte();

  pinsel.setTransform(1, 0, 0, 1, 0, 0);
  amigaFarben(pinsel, szene.width, szene.height);

  requestAnimationFrame(malen);
}
requestAnimationFrame(malen);
