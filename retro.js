// =====================================================
//  RETRO — der 80er-Jahre-Amiga-Look
// =====================================================
//
//  Der Amiga 500 konnte nur 32 Farben gleichzeitig zeigen.
//  Wir malen alles normal und rechnen danach jedes Pixel
//  auf die nächste der 32 Farben um. Dazu ist das Bild nur
//  halb so groß und wird mit dicken Pixeln vergrößert.
//
//  ⭐ Probier mal: eine Farbe in PALETTE ändern — dann sieht
//     die ganze Bude anders aus.
// =====================================================

const PALETTE = [
  '#000', '#fff', '#05a', '#f80',            // Workbench: schwarz, weiß, blau, orange
  '#124', '#037', '#47b', '#6cf',            // Himmel und Blau
  '#321', '#963', '#d95', '#fec', '#edb',    // Braun, Döner, Boden
  '#444', '#777', '#aaa', '#ccc',            // Grau (Straße)
  '#b31', '#d54', '#e33', '#f9a',            // Rot und Rosa
  '#fdb', '#eb7', '#c84', '#853',            // Haut
  '#2a4', '#174', '#9e6',                    // Grün
  '#fd3', '#c90',                            // Gelb und Gold
  '#82a', '#f4e',                            // Lila und Neon-Pink
];

// Copper-Balken: der berühmte Amiga-Himmel in Streifen
const COPPER = ['#124', '#124', '#037', '#037', '#05a', '#05a', '#47b', '#47b', '#6cf', '#f9a', '#f80', '#f80'];

const RETRO_AN = true;   // auf false setzen = wieder der glatte Look

// --- ab hier: Rechnerei ---

const PALETTE_RGB = PALETTE.map(hex => {
  const h = hex.replace('#', '');
  return [0, 1, 2].map(i => parseInt(h[i] + h[i], 16));
});

// Nachschlage-Tabelle: für jede von 4096 Farben die nächste Palettenfarbe
const NAECHSTE = new Uint8Array(4096);
for (let i = 0; i < 4096; i++) {
  const r = (i >> 8) * 17, g = ((i >> 4) & 15) * 17, b = (i & 15) * 17;
  let beste = 0, abstand = Infinity;
  PALETTE_RGB.forEach(([pr, pg, pb], j) => {
    const d = 3 * (r - pr) ** 2 + 4 * (g - pg) ** 2 + 2 * (b - pb) ** 2;
    if (d < abstand) { abstand = d; beste = j; }
  });
  NAECHSTE[i] = beste;
}

// Ein ganzes Bild auf 32 Farben umrechnen
function amigaFarben(c, breite, hoehe) {
  if (!RETRO_AN || (typeof einstellungen !== 'undefined' && !einstellungen.retro)) return;
  let bild;
  try { bild = c.getImageData(0, 0, breite, hoehe); } catch (e) { return; }
  const d = bild.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) continue;   // durchsichtig bleibt durchsichtig
    const farbe = PALETTE_RGB[NAECHSTE[((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4)]];
    d[i] = farbe[0]; d[i + 1] = farbe[1]; d[i + 2] = farbe[2]; d[i + 3] = 255;
  }
  c.putImageData(bild, 0, 0);
}

function zeichneCopper(c, breite, hoehe, farben = COPPER) {
  const streifen = hoehe / farben.length;
  farben.forEach((farbe, i) => {
    c.fillStyle = farbe;
    c.fillRect(0, Math.floor(i * streifen), breite, Math.ceil(streifen) + 1);
  });
}
