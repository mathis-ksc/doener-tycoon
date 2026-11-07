// =====================================================
//  TÖNE — Piepsen wie ein Amiga-Spiel
// =====================================================
//
//  Alle Töne werden live erzeugt (kein MP3 nötig).
//  piep(Tonhöhe, Dauer) — Tonhöhe in Hertz: 440 = Kammerton A.
//  ⭐ Probier mal: andere Zahlen bei "kasse" eintragen!
// =====================================================

let audio = null;

function tonAn() {
  return typeof einstellungen === 'undefined' || einstellungen.ton;
}

function audioKontext() {
  if (!audio) {
    try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  if (audio.state === 'suspended') audio.resume();
  return audio;
}

// Ein einzelner Ton. welle: 'square' (Amiga-Piepsen), 'triangle' (weich), 'sawtooth' (kratzig)
function piep(hz, dauer, start = 0, welle = 'square', laut = 0.06, zielHz = null) {
  if (!tonAn()) return;
  const a = audioKontext();
  if (!a) return;
  const t = a.currentTime + start;
  const osz = a.createOscillator();
  const vol = a.createGain();
  osz.type = welle;
  osz.frequency.setValueAtTime(hz, t);
  if (zielHz) osz.frequency.exponentialRampToValueAtTime(zielHz, t + dauer);
  vol.gain.setValueAtTime(laut, t);
  vol.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
  osz.connect(vol).connect(a.destination);
  osz.start(t);
  osz.stop(t + dauer + 0.02);
}

// Rauschen (für das "Tsching" der Kasse)
function rauschen(dauer, start = 0, laut = 0.05) {
  if (!tonAn()) return;
  const a = audioKontext();
  if (!a) return;
  const puffer = a.createBuffer(1, a.sampleRate * dauer, a.sampleRate);
  const d = puffer.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const quelle = a.createBufferSource();
  const vol = a.createGain();
  vol.gain.value = laut;
  quelle.buffer = puffer;
  quelle.connect(vol).connect(a.destination);
  quelle.start(a.currentTime + start);
}

const TON = {
  klick()      { piep(660, 0.04); },
  zutat(nr)    { piep(400 + nr * 45, 0.06); },
  brot()       { piep(300, 0.08, 0, 'triangle', 0.1); },
  kasse()      { piep(1318, 0.07); piep(1760, 0.18, 0.07); rauschen(0.12, 0.05); },
  falsch()     { piep(160, 0.35, 0, 'sawtooth', 0.06, 80); },
  sauer()      { piep(260, 0.18, 0, 'triangle', 0.12, 180); piep(180, 0.3, 0.18, 'triangle', 0.12, 110); },
  wegwerfen()  { piep(500, 0.2, 0, 'square', 0.05, 120); },
  combo(n)     { for (let i = 0; i < Math.min(n, 6); i++) piep(523 * Math.pow(1.122, i), 0.07, i * 0.05); },
  comboWeg()   { piep(330, 0.12, 0, 'square', 0.05); piep(247, 0.25, 0.12, 'square', 0.05); },
  vip()        { [523, 659, 784, 1046, 784, 1046].forEach((hz, i) => piep(hz, 0.12, i * 0.1, 'square', 0.05)); },
  herz()       { piep(880, 0.08, 0, 'triangle', 0.1); piep(1175, 0.15, 0.08, 'triangle', 0.1); },
  stern(nr)    { piep(784 * Math.pow(1.26, nr), 0.25, 0, 'square', 0.05); },
  kaufen()     { TON.kasse(); },
  tagEnde()    { [784, 659, 523, 659, 784, 1046].forEach((hz, i) => piep(hz, 0.15, i * 0.13, 'triangle', 0.1)); },
  kundeKommt() { piep(1046, 0.05, 0, 'triangle', 0.06); piep(1318, 0.08, 0.06, 'triangle', 0.06); },
};
