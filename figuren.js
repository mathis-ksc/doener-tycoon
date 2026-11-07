// =====================================================
//  FIGUREN — die Gäste in deiner Bude
// =====================================================
//
//  Jeder Gast wird aus Teilen zusammengebaut:
//  Haut, Haare, Shirt, Hose und ein Extra (Helm, Krone, Kopfhörer …).
//
//  mag = welche Deko der Gast liebt. Steht sie in der Bude,
//        wartet er viel länger und gibt mehr Trinkgeld.
//        (Mathis' Idee: Der Fußballfan liebt den Fernseher.)
//
//  ⭐ Hier kannst du neue Gäste erfinden! Einfach eine Zeile
//     in KUNDEN_TYPEN kopieren und ändern.
//     Was du weglässt (z. B. die Shirtfarbe), wird ausgewürfelt.
//     Eigene Freunde & Familie: im Spiel unter ⚙️ Einstellungen.
// =====================================================

//  haare:  kurz, lang, locken, afro, iro, zoepfe, dutt, glatze, glatze-rand
//  extra:  helm, kappe, polizei, sonnenbrille, brille, kopfhoerer, krone,
//          superheld, kochmuetze, nummer, schal, baskenmuetze, zylinder, kette
const KUNDEN_TYPEN = [
  { name: 'Bauarbeiter Jo',  haare: 'kurz',  shirt: '#ff8c1a', streifen: true, extra: 'helm',  mag: 'kuehlschrank' },
  { name: 'Polizistin Pia',  haare: 'zoepfe', shirt: '#2d4f9e', hose: '#1d2f5e', extra: 'polizei', mag: 'uhr' },
  { name: 'Superheld Max',   haare: 'kurz',  shirt: '#1f5fd6', hose: '#1f5fd6', extra: 'superheld', mag: 'statue' },
  { name: 'Oma Erna',        haare: 'dutt',  haarfarbe: '#dcdcdc', shirt: '#b05fa8', extra: 'brille', mag: 'pflanze' },
  { name: 'Opa Kurt',        haare: 'glatze-rand', haarfarbe: '#cfcfcf', shirt: '#6b8e4e', extra: 'brille', mag: 'teppich' },
  { name: 'Gamer Leon',      haare: 'kurz',  shirt: '#222222', extra: 'kopfhoerer', mag: 'neon' },
  { name: 'Skater Finn',     haare: 'lang',  extra: 'kappe', mag: 'lichterkette' },
  { name: 'Rockerin Jess',   haare: 'iro',   haarfarbe: '#e0218a', shirt: '#111111', hose: '#111111', extra: 'sonnenbrille', mag: 'neon' },
  { name: 'König Karl',      haare: 'locken', shirt: '#7b1fa2', extra: 'krone', mag: 'statue' },
  { name: 'Koch Mehmet',     haare: 'kurz',  shirt: '#ffffff', extra: 'kochmuetze', mag: 'poster' },
  { name: 'Fußballer Ronny', haare: 'kurz',  shirt: '#e53935', hose: '#ffffff', extra: 'nummer', mag: 'fernseher' },
  { name: 'Fußballfan Ben',  haare: 'kurz',  shirt: '#e53935', extra: 'schal', mag: 'fernseher' },
  { name: 'Studentin Sara',  haare: 'lang',  extra: 'kopfhoerer', mag: 'tisch' },
  { name: 'Kind Mia',        haare: 'zoepfe', kind: true, mag: 'aquarium' },
  { name: 'Kind Tim',        haare: 'kurz',  kind: true, extra: 'kappe', mag: 'aquarium' },
  { name: 'Ali',             haare: 'afro',  mag: 'fernseher' },
  { name: 'Lena',            haare: 'lang',  mag: 'pflanze' },
  { name: 'Jonas',           haare: 'locken', extra: 'sonnenbrille', mag: 'lichterkette' },
  { name: 'Emma',            haare: 'dutt',  mag: 'tisch' },
];

// VIP-Gäste: kommen ab Tag 2 manchmal. Schwierige Bestellung, riesiges Trinkgeld.
const VIP_TYPEN = [
  { name: 'Döner-Kritikerin Krause', haare: 'lang', haarfarbe: '#111111', shirt: '#222222', hose: '#222222',
    extra: 'baskenmuetze', extra2: 'brille', mag: 'teppich', kritiker: true },
  { name: 'Fußballstar Kevin', haare: 'iro', haarfarbe: '#d9a441', shirt: '#ffc107', hose: '#ffffff',
    extra: 'nummer', extra2: 'sonnenbrille', mag: 'fernseher' },
  { name: 'Bürgermeisterin Brandt', haare: 'dutt', haarfarbe: '#8b5a2b', shirt: '#1d2f5e', hose: '#1d2f5e',
    extra: 'zylinder', extra2: 'kette', mag: 'statue' },
];

const HAUT   = ['#f9d7b5', '#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#5c3a1e'];
const HAARE  = ['#2b1a0e', '#4a2c17', '#8b5a2b', '#d9a441', '#e8d07a', '#b03a2e', '#111111'];
const SHIRTS = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#8e24aa', '#fb8c00', '#00acc1', '#ec407a', '#6d4c41'];
const HOSEN  = ['#283593', '#37474f', '#5d4037', '#1b5e20', '#212121', '#546e7a'];

// Für den Gäste-Baukasten in den Einstellungen
const BAUKASTEN = {
  haut:      { name: 'Haut',      werte: HAUT },
  haare:     { name: 'Haare',     werte: ['kurz', 'lang', 'locken', 'afro', 'iro', 'zoepfe', 'dutt', 'glatze', 'glatze-rand'] },
  haarfarbe: { name: 'Haarfarbe', werte: [...HAARE, '#dcdcdc', '#e0218a', '#1e88e5', '#43a047'] },
  shirt:     { name: 'Shirt',     werte: [...SHIRTS, '#ffffff', '#222222'] },
  hose:      { name: 'Hose',      werte: HOSEN },
  extra:     { name: 'Extra',     werte: ['', 'kappe', 'brille', 'sonnenbrille', 'kopfhoerer', 'schal', 'helm',
                                          'krone', 'superheld', 'kochmuetze', 'polizei', 'nummer', 'baskenmuetze', 'zylinder', 'kette', 'baerenfell'] },
};
const TEIL_NAMEN = {
  kurz: 'kurz', lang: 'lang', locken: 'Locken', afro: 'Afro', iro: 'Iro', zoepfe: 'Zöpfe', dutt: 'Dutt',
  glatze: 'Glatze', 'glatze-rand': 'Halbglatze', '': 'nichts', kappe: 'Kappe', brille: 'Brille',
  sonnenbrille: 'Sonnenbrille', kopfhoerer: 'Kopfhörer', schal: 'Fan-Schal', helm: 'Bauhelm', krone: 'Krone',
  superheld: 'Superheld', kochmuetze: 'Kochmütze', polizei: 'Polizeimütze', nummer: 'Trikot 10',
  baskenmuetze: 'Baskenmütze', zylinder: 'Zylinder', kette: 'Goldkette', baerenfell: 'Fellmütze',
};

function wuerfel(liste) { return liste[Math.floor(Math.random() * liste.length)]; }

// Einen Gast zusammenbauen. Was in "typ" steht, gewinnt; der Rest wird gewürfelt.
function baueFigur(typ) {
  return {
    haut: wuerfel(HAUT),
    haarfarbe: wuerfel(HAARE),
    shirt: wuerfel(SHIRTS),
    hose: wuerfel(HOSEN),
    kappenfarbe: wuerfel(SHIRTS),
    ...typ,
  };
}

// "schonDa" = Namen, die gerade in der Schlange stehen (niemand kommt doppelt)
function neueFigur(schonDa = [], liste = KUNDEN_TYPEN) {
  const frei = liste.filter(t => !schonDa.includes(t.name));
  return baueFigur(wuerfel(frei.length ? frei : liste));
}

// ---------- Malen ----------
// c = Pinsel, (x, y) = wo die Füße stehen
// schritt = null, wenn der Gast steht; sonst eine Zahl, die beim Laufen hochzählt
// laune = 'froh', 'normal' oder 'sauer'
// sitzt = true, wenn der Gast auf einem Hocker sitzt

const RAND = '#2b1a0e';

function kreis(c, x, y, r, farbe, rand = true) {
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = farbe; c.fill();
  if (rand) { c.strokeStyle = RAND; c.lineWidth = 1.5; c.stroke(); }
}

function kasten(c, x, y, b, h, farbe, rund = 3) {
  c.beginPath(); c.roundRect(x, y, b, h, rund);
  c.fillStyle = farbe; c.fill();
  c.strokeStyle = RAND; c.lineWidth = 1.5; c.stroke();
}

function zeichneFigur(c, x, y, look, schritt, laune, skala, sitzt = false) {
  if (skala === undefined || skala === null) skala = look.kind ? 0.75 : 1;
  const laeuft = schritt !== null && schritt !== undefined;
  const schwung = laeuft ? Math.sin(schritt) : 0;
  const wippen = laeuft ? Math.abs(Math.sin(schritt)) * 2 : 0;
  const hatExtra = id => look.extra === id || look.extra2 === id;

  c.save();
  c.translate(x, y);
  c.scale(skala, skala);

  // Schatten
  if (!sitzt) {
    c.fillStyle = 'rgba(0,0,0,0.22)';
    c.beginPath(); c.ellipse(0, 0, 15, 6, 0, 0, Math.PI * 2); c.fill();
  }

  // Umhang (nur Superhelden) — hinter allem
  if (hatExtra('superheld')) {
    c.beginPath();
    c.moveTo(-11, -40 - wippen); c.lineTo(-19, -6); c.lineTo(19, -6); c.lineTo(11, -40 - wippen);
    c.closePath(); c.fillStyle = '#d61f1f'; c.fill(); c.strokeStyle = RAND; c.stroke();
  }

  if (sitzt) {
    // kurze Beine, die vom Hocker baumeln
    kasten(c, -9, -8, 7, 8, look.hose, 2);
    kasten(c, 2, -8, 7, 8, look.hose, 2);
    kreis(c, -5.5, 0, 4, '#3a2a1e', false);
    kreis(c, 5.5, 0, 4, '#3a2a1e', false);
    c.translate(0, 8);
  } else {
    // Beine (beim Laufen hebt sich abwechselnd ein Bein)
    const hebL = Math.max(0, schwung) * 5, hebR = Math.max(0, -schwung) * 5;
    kasten(c, -9, -18, 7, 18 - hebL, look.hose, 2);
    kasten(c, 2, -18, 7, 18 - hebR, look.hose, 2);
    kreis(c, -5.5, -hebL - 1, 4, '#3a2a1e', false);
    kreis(c, 5.5, -hebR - 1, 4, '#3a2a1e', false);
  }

  c.translate(0, -wippen);   // Oberkörper wippt beim Laufen

  // Arme (schwingen gegen die Beine)
  for (const seite of [-1, 1]) {
    c.save();
    c.translate(seite * 13.5, -40);
    c.rotate(sitzt ? -seite * 0.5 : -seite * schwung * 0.45);
    kasten(c, -3, 0, 6, 16, look.shirt, 3);
    kreis(c, 0, 18, 3.5, look.haut);
    c.restore();
  }

  // Körper
  kasten(c, -12, -42, 24, 27, look.shirt, 7);
  if (look.streifen) {
    c.fillStyle = '#f5f5a0';
    c.fillRect(-11, -32, 22, 3); c.fillRect(-11, -25, 22, 3);
  }
  if (hatExtra('nummer')) {
    c.fillStyle = look.shirt === '#ffffff' ? '#e53935' : '#fff';
    c.font = 'bold 12px monospace'; c.textAlign = 'center';
    c.fillText('10', 0, -24);
  }
  if (hatExtra('superheld')) {
    kreis(c, 0, -31, 6, '#ffd23f');
    c.fillStyle = '#d61f1f'; c.font = 'bold 9px monospace'; c.textAlign = 'center'; c.fillText('S', 0, -28);
  }
  if (hatExtra('kette')) {
    c.strokeStyle = '#ffc107'; c.lineWidth = 2.5;
    c.beginPath(); c.arc(0, -42, 9, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke();
    kreis(c, 0, -32, 3.5, '#ffc107');
  }

  zeichneHaareHinten(c, look);

  // Kopf
  kreis(c, 0, -55, 13, look.haut);
  if (look.kind) { kreis(c, -8, -50, 2.5, 'rgba(255,120,120,0.5)', false); kreis(c, 8, -50, 2.5, 'rgba(255,120,120,0.5)', false); }

  zeichneGesicht(c, look, laune);
  zeichneHaareVorne(c, look);
  if (look.extra) zeichneExtra(c, look, look.extra);
  if (look.extra2) zeichneExtra(c, look, look.extra2);

  c.restore();
}

function zeichneHaareHinten(c, look) {
  const f = look.haarfarbe;
  switch (look.haare) {
    case 'afro':   kreis(c, 0, -59, 19, f); break;
    case 'lang':   kasten(c, -15, -62, 30, 30, f, 8); break;
    case 'zoepfe': kreis(c, -15, -50, 5, f); kreis(c, 15, -50, 5, f); break;
    case 'dutt':   kreis(c, 0, -71, 6.5, f); break;
  }
}

function zeichneHaareVorne(c, look) {
  const f = look.haarfarbe;
  const kappe = () => {
    c.beginPath(); c.arc(0, -56, 13.8, Math.PI * 1.02, Math.PI * 1.98); c.closePath();
    c.fillStyle = f; c.fill(); c.strokeStyle = RAND; c.lineWidth = 1.5; c.stroke();
  };
  switch (look.haare) {
    case 'kurz': case 'lang': case 'zoepfe': case 'dutt': case 'afro':
      kappe(); break;
    case 'locken':
      kappe();
      for (let i = -2; i <= 2; i++) kreis(c, i * 5.5, -67 + Math.abs(i) * 2, 4.5, f);
      break;
    case 'iro':
      c.beginPath();
      c.moveTo(-4, -66);
      for (let i = 0; i < 4; i++) { c.lineTo(-3 + i * 2, -82 + i * 3); c.lineTo(-2 + i * 2, -68); }
      c.lineTo(4, -66); c.closePath();
      c.fillStyle = f; c.fill(); c.strokeStyle = RAND; c.stroke();
      break;
    case 'glatze-rand':
      kasten(c, -14, -60, 4, 8, f, 2); kasten(c, 10, -60, 4, 8, f, 2);
      break;
  }
}

function zeichneGesicht(c, look, laune) {
  c.strokeStyle = RAND; c.lineWidth = 1.8; c.lineCap = 'round';
  const verdeckt = [look.extra, look.extra2].some(e => e === 'sonnenbrille' || e === 'superheld');
  if (!verdeckt) {
    kreis(c, -5, -55, 2.2, RAND, false); kreis(c, 5, -55, 2.2, RAND, false);
    kreis(c, -4.3, -55.7, 0.8, '#fff', false); kreis(c, 5.7, -55.7, 0.8, '#fff', false);
  }
  c.beginPath();
  if (laune === 'froh') {
    c.arc(0, -50, 5, 0.15 * Math.PI, 0.85 * Math.PI);
  } else if (laune === 'sauer') {
    c.arc(0, -44, 5, 1.2 * Math.PI, 1.8 * Math.PI);
    c.moveTo(-9, -62); c.lineTo(-2, -59);   // böse Augenbrauen
    c.moveTo(9, -62); c.lineTo(2, -59);
  } else {
    c.moveTo(-4, -47); c.lineTo(4, -47);
  }
  c.stroke();
}

function zeichneExtra(c, look, extra) {
  c.lineWidth = 1.5; c.strokeStyle = RAND;
  switch (extra) {
    case 'helm':
      c.beginPath(); c.arc(0, -58, 14.5, Math.PI, 2 * Math.PI); c.closePath();
      c.fillStyle = '#ffd23f'; c.fill(); c.stroke();
      kasten(c, -17, -60, 34, 4, '#ffd23f', 2);
      break;
    case 'kappe':
      c.beginPath(); c.arc(0, -58, 14, Math.PI, 2 * Math.PI); c.closePath();
      c.fillStyle = look.kappenfarbe || '#e53935'; c.fill(); c.stroke();
      c.beginPath(); c.ellipse(7, -58, 11, 3, 0, 0, Math.PI * 2); c.fill(); c.stroke();
      break;
    case 'polizei':
      kasten(c, -14, -71, 28, 12, '#1d2f5e', 3);
      c.beginPath(); c.ellipse(0, -59, 16, 3.5, 0, 0, Math.PI * 2); c.fillStyle = '#111'; c.fill();
      kreis(c, 0, -65, 2.8, '#ffd23f');
      break;
    case 'sonnenbrille':
      kasten(c, -11, -59, 9, 6, '#111', 2); kasten(c, 2, -59, 9, 6, '#111', 2);
      c.beginPath(); c.moveTo(-2, -57); c.lineTo(2, -57); c.stroke();
      break;
    case 'brille':
      c.beginPath(); c.arc(-5, -55, 4.5, 0, 2 * Math.PI); c.moveTo(9.5, -55); c.arc(5, -55, 4.5, 0, 2 * Math.PI);
      c.moveTo(-0.5, -55); c.lineTo(0.5, -55); c.stroke();
      break;
    case 'kopfhoerer':
      c.beginPath(); c.arc(0, -56, 16, 1.1 * Math.PI, 1.9 * Math.PI); c.lineWidth = 3; c.stroke();
      kasten(c, -18, -61, 6, 11, look.kappenfarbe || '#1e88e5', 3); kasten(c, 12, -61, 6, 11, look.kappenfarbe || '#1e88e5', 3);
      break;
    case 'krone':
      c.beginPath();
      c.moveTo(-11, -66); c.lineTo(-11, -78); c.lineTo(-5.5, -71); c.lineTo(0, -80);
      c.lineTo(5.5, -71); c.lineTo(11, -78); c.lineTo(11, -66); c.closePath();
      c.fillStyle = '#ffc107'; c.fill(); c.stroke();
      kreis(c, 0, -70, 1.8, '#e53935', false);
      break;
    case 'superheld':
      kasten(c, -13, -59, 26, 7, '#111', 3);
      kreis(c, -5, -55.5, 2.4, '#fff', false); kreis(c, 5, -55.5, 2.4, '#fff', false);
      kreis(c, -5, -55.5, 1.2, RAND, false); kreis(c, 5, -55.5, 1.2, RAND, false);
      break;
    case 'kochmuetze':
      kasten(c, -10, -74, 20, 10, '#fff', 2);
      kreis(c, -7, -77, 6.5, '#fff'); kreis(c, 7, -77, 6.5, '#fff'); kreis(c, 0, -81, 7.5, '#fff');
      break;
    case 'schal':   // rot-weißer Fan-Schal
      kasten(c, -12, -45, 24, 6, '#e53935', 3);
      c.fillStyle = '#fff'; c.fillRect(-6, -44, 3, 4); c.fillRect(3, -44, 3, 4);
      kasten(c, 4, -42, 6, 14, '#e53935', 2);
      c.fillStyle = '#fff'; c.fillRect(5, -36, 4, 3);
      break;
    case 'baskenmuetze':
      c.beginPath(); c.ellipse(-2, -66, 15, 6, -0.15, 0, Math.PI * 2);
      c.fillStyle = '#b31b1b'; c.fill(); c.stroke();
      kreis(c, -2, -72, 2, '#b31b1b');
      break;
    case 'baerenfell':   // hohe schwarze Fellmütze der Wachsoldaten
      c.fillStyle = '#111';
      c.beginPath(); c.ellipse(0, -76, 14, 22, 0, 0, Math.PI * 2); c.fill();
      c.fillRect(-14, -70, 28, 12);
      c.strokeStyle = '#ffc107'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(-12, -58); c.quadraticCurveTo(0, -42, 12, -58); c.stroke();
      break;
    case 'zylinder':
      kasten(c, -10, -88, 20, 22, '#111', 2);
      c.fillStyle = '#e53935'; c.fillRect(-10, -72, 20, 4);
      c.beginPath(); c.ellipse(0, -66, 16, 3.5, 0, 0, Math.PI * 2); c.fillStyle = '#111'; c.fill();
      break;
  }
}

// Ein kleines Porträt (Kopf + Schultern), z. B. für die Kundenliste
function portraet(look, laune = 'froh', groesse = 28) {
  // nur 28 × 28 Pixel groß — im Amiga-Look wird es mit dicken Pixeln vergrößert
  const bild = document.createElement('canvas');
  bild.width = groesse; bild.height = groesse;
  const c = bild.getContext('2d');
  c.scale(groesse / 56, groesse / 56);
  c.fillStyle = '#6cf'; c.fillRect(0, 0, 56, 56);
  zeichneFigur(c, 28, 86, look, null, laune, 1);
  c.setTransform(1, 0, 0, 1, 0, 0);
  amigaFarben(c, groesse, groesse);
  return bild.toDataURL();
}

// Ganzer Körper, für den Gäste-Baukasten
function ganzkoerper(look) {
  const bild = document.createElement('canvas');
  bild.width = 40; bild.height = 52;
  const c = bild.getContext('2d');
  c.scale(0.5, 0.5);
  c.fillStyle = '#6cf'; c.fillRect(0, 0, 80, 104);
  c.fillStyle = '#edb'; c.fillRect(0, 92, 80, 12);
  zeichneFigur(c, 40, 96, look, null, 'froh', 1);
  c.setTransform(1, 0, 0, 1, 0, 0);
  amigaFarben(c, 40, 52);
  return bild.toDataURL();
}
