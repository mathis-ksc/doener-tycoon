// =====================================================
//  STARTMENÜ — Diskette, Titelbild, Credits
// =====================================================
//
//  Wie bei einem echten Amiga-Spiel von 1988:
//  1. Diskette einlegen (Klick) → das Laufwerk rattert
//  2. Titelbild mit Musik, Copper-Balken, Sternen und Laufschrift
//  3. Credits laufen von unten nach oben durch
//
//  ⭐ Probier mal: den Text in LAUFSCHRIFT ändern!
// =====================================================

const LAUFSCHRIFT =
  '*** MATHIS ROTH PRESENTS: DÖNER TYCOON 2026 ***  DER HEISSESTE DÖNER-SIMULATOR DER WELT  ' +
  '***  LEAD DESIGN: MATHIS ROTH  ***  CREATIVE ADVICE: CHARLOTTE ROTH  ' +
  '***  IMPLEMENTATION: CLAUDE ROTH  ***  GRÜSSE AN ALLE DÖNER-FANS DA DRAUSSEN!  ***  DRÜCKE ENTER ZUM SPIELEN  ***      ';

const TITEL_FARBEN = ['#ffffff', '#ffdd33', '#ff8800', '#ee3333', '#bb3311'];
const JAHR_FARBEN  = ['#ffffff', '#66ccff', '#4477bb', '#8822aa'];
const REGENBOGEN   = ['#ee3333', '#ff8800', '#ffdd33', '#99ee66', '#66ccff', '#ff44ee'];

const B = 384, H = 240;   // so groß ist das Titelbild (wie ein Amiga-Bildschirm)

const startEl = document.getElementById('start');
const startBild = document.getElementById('start-bild');
const startPinsel = startBild.getContext('2d');
const startMenueEl = document.getElementById('start-menue');

let startModus = 'diskette';   // diskette · einlegen · titel · credits
let modusSeit = 0;
let auswahl = 0;
let startZeit = 0;

// Sterne für den Hintergrund
const STERNE = Array.from({ length: 90 }, () => ({
  x: Math.random() * B, y: Math.random() * H, tempo: 10 + Math.random() * 50,
}));

// Mathis' Logo: der Koch MIT rotem Kreis und Dönerspieß
const logoBild = new Image();
logoBild.src = 'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(new XMLSerializer().serializeToString(document.getElementById('koch')));

// die Pixel-Schrift laden, bevor wir sie benutzen
if (document.fonts) document.fonts.load('20px "Press Start 2P"');

function startmenueOffen() { return !startEl.classList.contains('versteckt'); }

function wechsleModus(modus) {
  startModus = modus;
  modusSeit = startZeit;
  startEl.dataset.modus = modus;
  zeichneStartMenue();
}

// ---------- Die Menü-Knöpfe ----------

function menuePunkte() {
  const gespielt = spiel.tag > 1 || spiel.geld !== START_GELD;
  return [
    { id: 'spielen', text: gespielt ? `▶ WEITERSPIELEN · TAG ${spiel.tag}` : '▶ NEUES SPIEL', gross: true },
    { id: 'einstellungen', text: '⚙ EINSTELLUNGEN' },
    { id: 'credits', text: '★ CREDITS' },
    { id: 'musik', text: einstellungen.musik !== false && einstellungen.ton ? '♪ MUSIK: AN' : '♪ MUSIK: AUS' },
  ];
}

function zeichneStartMenue() {
  startMenueEl.innerHTML = menuePunkte().map((p, i) =>
    `<button class="${p.gross ? 'gross-knopf' : ''} ${i === auswahl ? 'gewaehlt' : ''}"
      onmouseenter="waehleMenue(${i})" onclick="menueAktion('${p.id}')">${p.text}</button>`).join('');
}

function waehleMenue(i) {
  if (i === auswahl) return;
  auswahl = i;
  TON.klick();
  zeichneStartMenue();
}

function menueAktion(id) {
  TON.kasse();
  if (id === 'spielen') losSpielen();
  else if (id === 'einstellungen') zeigeEinstellungen();
  else if (id === 'credits') wechsleModus('credits');
  else if (id === 'musik') {
    einstellungen.musik = !(einstellungen.musik !== false && einstellungen.ton);
    if (einstellungen.musik) einstellungen.ton = true;
    speichereEinstellungen();
    if (einstellungen.musik) starteMusik(); else stoppeMusik();
    zeichneStartMenue();
  }
}

// ---------- Öffnen und Schließen ----------

function zeigeStart(modus = 'titel') {
  pausiert = true;
  startEl.classList.remove('versteckt');
  wechsleModus(modus);
  if (modus === 'titel') starteMusik();
  requestAnimationFrame(startMalen);
}

function losSpielen() {
  stoppeMusik();
  startEl.classList.add('versteckt');
  if (tagLaeuft) {
    pausiert = false;
    sag(`Tag ${spiel.tag}! Ziel: ${dollar(tagesZiel())}. Auf geht's!`);
  } else {
    zeigeAbschluss();
  }
}

function zeigeAenderungen() {
  TON.klick();
  zeigeFenster(`
    <h2>Was ist neu?</h2>
    <p>Du spielst <b>Döner Tycoon 2026 · Version ${VERSION}</b></p>
    ${AENDERUNGEN.map(a => `<div class="shop-zeile"><span><b>v${a.version}</b> · ${a.datum}<br>${a.was}</span></div>`).join('')}
    <p><button onclick="fensterZu()">↩ Zurück <kbd>Esc</kbd></button></p>`, '', 'neu');
}

// Klicks auf das Titelbild
startEl.addEventListener('click', e => {
  if (e.target.closest('button') || e.target.closest('a')) return;
  if (startModus === 'diskette') diskeEinlegen();
  else if (startModus === 'credits') wechsleModus('titel');
});

function diskeEinlegen() {
  if (startModus !== 'diskette') return;
  audioKontext();          // jetzt darf der Browser Töne machen
  // auf Handy und iPad gleich ins Vollbild (ohne Browser-Leisten), wenn das Gerät es kann
  if (window.matchMedia('(pointer: coarse)').matches && typeof vollbildUmschalten === 'function') vollbildUmschalten(true);
  laufwerkGeraeusch();
  wechsleModus('einlegen');
}

// Tasten im Startmenü
document.addEventListener('keydown', e => {
  if (!startmenueOffen() || fensterArt !== null) return;
  const taste = e.key;
  if (startModus === 'diskette') { diskeEinlegen(); e.preventDefault(); return; }
  if (startModus === 'credits') {
    if (taste === 'Escape' || taste === 'Enter' || taste === ' ') { wechsleModus('titel'); e.preventDefault(); }
    return;
  }
  if (startModus !== 'titel') return;
  const n = menuePunkte().length;
  if (taste === 'ArrowDown' || taste === 'ArrowRight') { waehleMenue((auswahl + 1) % n); e.preventDefault(); }
  else if (taste === 'ArrowUp' || taste === 'ArrowLeft') { waehleMenue((auswahl + n - 1) % n); e.preventDefault(); }
  else if (taste === 'Enter' || taste === ' ') { menueAktion(menuePunkte()[auswahl].id); e.preventDefault(); }
});

// ---------- Malen ----------

// Ein Wort in Glanz-Schrift: jeder Buchstabe hüpft auf einer Welle
function glanzText(c, text, x, y, groesse, zeit, farben, welle = 4, zentriert = true) {
  c.font = `${groesse}px "Press Start 2P", monospace`;
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  const zeichen = [...text];
  const breiten = zeichen.map(z => c.measureText(z).width);
  let px = zentriert ? x - breiten.reduce((a, b) => a + b, 0) / 2 : x;
  zeichen.forEach((z, i) => {
    const gy = y + Math.sin(zeit * 3 + i * 0.55) * welle;
    // Die Pixel-Schrift malt Ö/Ü/Ä klein. Wir malen lieber den großen Buchstaben + zwei Punkte drüber.
    const umlaut = { 'Ö': 'O', 'Ü': 'U', 'Ä': 'A' }[z];
    const buchstabe = umlaut || z;
    const punkte = (farbe, dx = 0, dy = 0) => {
      if (!umlaut) return;
      const p = Math.max(2, Math.round(groesse / 6));
      c.fillStyle = farbe;
      c.fillRect(px + groesse * 0.18 + dx, gy - groesse * 1.12 + dy, p, p);
      c.fillRect(px + groesse * 0.62 + dx, gy - groesse * 1.12 + dy, p, p);
    };
    c.fillStyle = '#000'; c.fillText(buchstabe, px + 3, gy + 3); punkte('#000', 3, 3);   // Schatten
    c.lineWidth = Math.max(2, groesse / 8); c.strokeStyle = '#331100';
    c.strokeText(buchstabe, px, gy);                                                     // Umriss
    const verlauf = c.createLinearGradient(0, gy - groesse, 0, gy);
    farben.forEach((f, j) => verlauf.addColorStop(j / (farben.length - 1), f));
    c.fillStyle = verlauf; c.fillText(buchstabe, px, gy);                                // Glanz
    punkte(farben[0]);
    px += breiten[i];
  });
}

function malSterne(c, zeit, dt) {
  for (const s of STERNE) {
    s.x -= s.tempo * dt;
    if (s.x < 0) { s.x += B; s.y = Math.random() * H; }
    c.fillStyle = s.tempo > 40 ? '#ffffff' : s.tempo > 25 ? '#aaaaaa' : '#777777';
    c.fillRect(Math.floor(s.x), Math.floor(s.y), s.tempo > 40 ? 2 : 1, 1);
  }
}

function malCopperBalken(c, zeit) {
  const balken = [
    ['#bb3311', '#ee3333', '#ff99aa', '#ffffff', '#ff99aa', '#ee3333', '#bb3311'],
    ['#003377', '#4477bb', '#66ccff', '#ffffff', '#66ccff', '#4477bb', '#003377'],
    ['#cc9900', '#ff8800', '#ffdd33', '#ffffff', '#ffdd33', '#ff8800', '#cc9900'],
  ];
  balken.forEach((farben, k) => {
    const y = Math.floor(118 + Math.sin(zeit * 1.4 + k * 2.1) * 75);
    farben.forEach((f, i) => { c.fillStyle = f; c.fillRect(0, y + i * 2, B, 2); });
  });
}

function malLaufschrift(c, zeit) {
  c.font = '10px "Press Start 2P", monospace';
  c.textBaseline = 'alphabetic';
  const zeichen = [...LAUFSCHRIFT];
  const breite = 10;
  const start = B - ((zeit * 55) % (zeichen.length * breite + B));
  zeichen.forEach((z, i) => {
    const x = start + i * breite;
    if (x < -breite || x > B) return;
    const y = 232 + Math.sin(zeit * 5 + x * 0.045) * 5;
    c.fillStyle = '#000'; c.fillText(z, x + 1, y + 1);
    c.fillStyle = REGENBOGEN[(i + Math.floor(zeit * 8)) % REGENBOGEN.length];
    c.fillText(z, x, y);
  });
}

function malDiskette(c, x, y) {
  c.fillStyle = '#0055aa'; c.fillRect(x, y, 80, 80);                       // Hülle
  c.fillStyle = '#ffffff'; c.fillRect(x + 72, y, 8, 6);                     // Ecke
  c.fillStyle = '#aaaaaa'; c.fillRect(x + 20, y, 40, 26);                   // Metallschieber
  c.fillStyle = '#444444'; c.fillRect(x + 44, y + 4, 8, 18);
  c.fillStyle = '#ffffff'; c.fillRect(x + 8, y + 34, 64, 42);               // Etikett
  c.fillStyle = '#ccc'; for (let i = 0; i < 4; i++) c.fillRect(x + 12, y + 60 + i * 4, 56, 1);
  c.font = '7px "Press Start 2P", monospace'; c.textAlign = 'center';
  c.fillStyle = '#ee3333'; c.fillText('DÖNER', x + 40, y + 45);
  c.fillStyle = '#0055aa'; c.fillText('TYCOON', x + 40, y + 54);
  c.fillStyle = '#ff8800'; c.fillText('2026', x + 40, y + 63 + 8);
  c.textAlign = 'left';
}

function malDiskettenBild(c, zeit) {
  c.fillStyle = '#ffffff'; c.fillRect(0, 0, B, H);
  const seit = zeit - modusSeit;
  let dy = Math.sin(zeit * 2) * 3;
  if (startModus === 'einlegen') dy = seit * seit * 260;                    // Diskette rutscht ins Laufwerk
  // Laufwerk-Schlitz
  c.fillStyle = '#aaaaaa'; c.fillRect(132, 196, 120, 14);
  c.fillStyle = '#000000'; c.fillRect(140, 201, 104, 4);
  c.save();
  c.beginPath(); c.rect(0, 0, B, 203); c.clip();
  malDiskette(c, 152, 60 + dy);
  c.restore();
  c.font = '8px "Press Start 2P", monospace'; c.textAlign = 'center';
  c.fillStyle = '#0055aa'; c.fillText('BITTE DISKETTE EINLEGEN', B / 2, 32);
  if (startModus === 'diskette' && Math.floor(zeit * 2) % 2 === 0) {
    c.fillStyle = '#ff8800'; c.fillText('KLICK ODER TASTE DRÜCKEN', B / 2, 228);
  }
  c.textAlign = 'left';
  if (startModus === 'einlegen' && seit > 1.3) {
    wechsleModus('titel');
    starteMusik();
  }
}

function malTitel(c, zeit, dt) {
  c.fillStyle = '#000000'; c.fillRect(0, 0, B, H);
  malSterne(c, zeit, dt);
  malCopperBalken(c, zeit);

  // Mathis' Logo, leicht schwebend
  if (logoBild.complete) c.drawImage(logoBild, 12, 34 + Math.sin(zeit * 2) * 3, 112, 123);

  glanzText(c, 'DÖNER', 254, 64, 30, zeit, TITEL_FARBEN, 4);
  glanzText(c, 'TYCOON', 254, 102, 30, zeit + 1, TITEL_FARBEN, 4);
  // 2026 pulsiert
  const puls = 1 + Math.sin(zeit * 4) * 0.08;
  c.save(); c.translate(254, 128); c.scale(puls, puls);
  glanzText(c, '2026', 0, 10, 22, zeit, JAHR_FARBEN, 0);
  c.restore();

  c.font = '7px "Press Start 2P", monospace'; c.textAlign = 'center';
  c.fillStyle = '#ff8800'; c.fillText('LEAD DESIGNER & ENTWICKLER', 254, 156);
  glanzText(c, 'MATHIS ROTH', 254, 170, 10, zeit * 1.5, ['#ffffff', '#ffdd33', '#ff8800'], 2);

  malLaufschrift(c, zeit);
}

function malCredits(c, zeit, dt) {
  c.fillStyle = '#000000'; c.fillRect(0, 0, B, H);
  malSterne(c, zeit, dt);
  malCopperBalken(c, zeit * 0.7);
  const seit = zeit - modusSeit;
  let y = H + 20 - seit * 22;

  glanzText(c, 'DÖNER TYCOON 2026', B / 2, y, 14, zeit, TITEL_FARBEN, 3);
  y += 50;
  for (const m of MACHER) {
    c.font = '8px "Press Start 2P", monospace'; c.textAlign = 'center';
    c.fillStyle = '#ff8800'; c.fillText(m.rolle.toUpperCase(), B / 2, y);
    glanzText(c, m.name.toUpperCase(), B / 2, y + 22, 16, zeit + y * 0.01, ['#ffffff', '#66ccff', '#4477bb'], 3);
    y += 62;
  }
  c.font = '8px "Press Start 2P", monospace'; c.textAlign = 'center';
  c.fillStyle = '#aaaaaa'; c.fillText('VERSION ' + VERSION, B / 2, y + 10);
  glanzText(c, 'DANKE FÜRS SPIELEN!', B / 2, y + 50, 14, zeit, TITEL_FARBEN, 4);
  c.textAlign = 'left';

  if (y + 50 < -10) wechsleModus('titel');   // alles durchgelaufen → zurück
}

let letzteStartZeit = 0;
function startMalen(jetzt) {
  if (!startmenueOffen()) return;
  startZeit = jetzt / 1000;
  const dt = Math.min(0.1, startZeit - letzteStartZeit);
  letzteStartZeit = startZeit;

  const c = startPinsel;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.imageSmoothingEnabled = false;
  if (startModus === 'diskette' || startModus === 'einlegen') malDiskettenBild(c, startZeit);
  else if (startModus === 'credits') malCredits(c, startZeit, dt);
  else malTitel(c, startZeit, dt);
  amigaFarben(c, B, H);

  requestAnimationFrame(startMalen);
}

// ---------- Beim Laden: Startmenü zeigen ----------
document.getElementById('start-version').textContent = `v${VERSION} · NEU?`;
document.getElementById('btn-menue').onclick = () => { if (fensterArt === null) { zeigeStart('titel'); } };
zeigeStart('diskette');
