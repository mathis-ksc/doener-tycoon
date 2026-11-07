// =====================================================
//  MUSIK — der Soundtrack fürs Startmenü
// =====================================================
//
//  Wie ein Amiga-Tracker (ProTracker): 4 Spuren —
//  Bass, Akkord-Arpeggio, Melodie und Schlagzeug.
//  Jede Zeile in den Mustern ist ein Takt mit 16 Schritten.
//  Zahlen sind Töne (69 = A, 72 = C, 76 = E …), 0 = nichts.
//
//  ⭐ Probier mal: TEMPO ändern oder eine Zahl in der MELODIE!
// =====================================================

const TEMPO = 125;   // Schläge pro Minute

// Akkorde pro Takt: Grundton und ob Moll (m) oder Dur
const AKKORDE = {
  Am: [57, 60, 64, 69], F: [53, 57, 60, 65], C: [48, 52, 55, 60],
  G: [55, 59, 62, 67], E: [52, 56, 59, 64],
};

// Die Melodie: Teil A und Teil B, je 4 Takte
const MELODIE = {
  A: [
    [76, 0, 0, 74, 72, 0, 74, 0, 76, 0, 0, 0, 81, 0, 79, 0],
    [77, 0, 0, 76, 74, 0, 72, 0, 69, 0, 0, 0, 72, 0, 74, 0],
    [76, 0, 0, 79, 76, 0, 74, 0, 72, 0, 0, 0, 67, 0, 72, 0],
    [74, 0, 0, 0, 71, 0, 74, 0, 79, 0, 77, 0, 76, 0, 74, 0],
  ],
  B: [
    [81, 0, 81, 0, 79, 0, 76, 0, 81, 0, 0, 84, 81, 0, 79, 0],
    [77, 0, 77, 0, 76, 0, 72, 0, 77, 0, 0, 81, 77, 0, 76, 0],
    [79, 0, 79, 0, 77, 0, 74, 0, 79, 0, 83, 0, 86, 0, 83, 0],
    [83, 0, 0, 0, 80, 0, 0, 0, 76, 0, 80, 0, 83, 0, 0, 0],
  ],
};
const AKKORD_FOLGE = { A: ['Am', 'F', 'C', 'G'], B: ['Am', 'F', 'G', 'E'] };

// Reihenfolge der Teile. "intro" = ohne Melodie.
const LIEDFOLGE = ['intro', 'A', 'B', 'A', 'B'];

// --- ab hier: der kleine Tracker ---

let musikLaeuft = false;
let musikLautstaerke = null;
let musikUhr = null;
let naechsteZeit = 0;
let position = { teil: 0, takt: 0, schritt: 0 };

function hz(note) { return 440 * Math.pow(2, (note - 69) / 12); }

function musikAn() {
  return typeof einstellungen === 'undefined' || (einstellungen.ton && einstellungen.musik !== false);
}

function instrument(a, art, note, t, dauer) {
  const vol = a.createGain();
  vol.connect(musikLautstaerke);
  const osz = a.createOscillator();

  if (art === 'bass') {
    osz.type = 'triangle';
    osz.frequency.value = hz(note - 12);
    vol.gain.setValueAtTime(0.32, t);
    vol.gain.exponentialRampToValueAtTime(0.01, t + dauer);
    const knurr = a.createOscillator();            // etwas Kratzen dazu, wie ein Amiga-Sample
    const knurrVol = a.createGain();
    knurr.type = 'square'; knurr.frequency.value = hz(note - 12);
    knurrVol.gain.setValueAtTime(0.04, t); knurrVol.gain.exponentialRampToValueAtTime(0.001, t + dauer);
    knurr.connect(knurrVol).connect(musikLautstaerke);
    knurr.start(t); knurr.stop(t + dauer);
  } else if (art === 'arp') {
    osz.type = 'square';
    osz.frequency.value = hz(note + 12);
    vol.gain.setValueAtTime(0.035, t);
    vol.gain.exponentialRampToValueAtTime(0.001, t + dauer);
  } else if (art === 'melodie') {
    osz.type = 'square';
    osz.frequency.value = hz(note);
    const vibrato = a.createOscillator();           // das typische "Wabern"
    const tiefe = a.createGain();
    vibrato.frequency.value = 5.5; tiefe.gain.value = hz(note) * 0.012;
    vibrato.connect(tiefe).connect(osz.frequency);
    vibrato.start(t); vibrato.stop(t + dauer);
    vol.gain.setValueAtTime(0.0001, t);
    vol.gain.linearRampToValueAtTime(0.08, t + 0.01);
    vol.gain.setValueAtTime(0.07, t + dauer * 0.7);
    vol.gain.exponentialRampToValueAtTime(0.001, t + dauer);
  }
  osz.connect(vol);
  osz.start(t);
  osz.stop(t + dauer + 0.02);
}

function trommel(a, art, t) {
  if (art === 'kick') {
    const osz = a.createOscillator(), vol = a.createGain();
    osz.type = 'sine';
    osz.frequency.setValueAtTime(150, t); osz.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    vol.gain.setValueAtTime(0.55, t); vol.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osz.connect(vol).connect(musikLautstaerke); osz.start(t); osz.stop(t + 0.2);
    return;
  }
  const dauer = art === 'snare' ? 0.14 : 0.035;
  const puffer = a.createBuffer(1, Math.ceil(a.sampleRate * dauer), a.sampleRate);
  const d = puffer.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const quelle = a.createBufferSource(), filter = a.createBiquadFilter(), vol = a.createGain();
  quelle.buffer = puffer;
  filter.type = 'highpass'; filter.frequency.value = art === 'snare' ? 1500 : 7000;
  vol.gain.setValueAtTime(art === 'snare' ? 0.22 : 0.07, t);
  vol.gain.exponentialRampToValueAtTime(0.001, t + dauer);
  quelle.connect(filter).connect(vol).connect(musikLautstaerke);
  quelle.start(t);
}

function spieleSchritt(a, t) {
  const teil = LIEDFOLGE[position.teil];
  const muster = teil === 'intro' ? 'A' : teil;
  const akkord = AKKORDE[AKKORD_FOLGE[muster][position.takt]];
  const s = position.schritt;
  const sechzehntel = 60 / TEMPO / 4;

  // Bass: Achtel, Grundton und Oktave abwechselnd
  if (s % 2 === 0) instrument(a, 'bass', akkord[0] + (s % 4 === 2 ? 12 : 0), t, sechzehntel * 1.8);
  // Arpeggio: jeden Schritt der nächste Akkordton — superschnell, typisch Amiga
  instrument(a, 'arp', akkord[s % 4], t, sechzehntel * 0.9);
  // Melodie
  if (teil !== 'intro') {
    const zeile = MELODIE[muster][position.takt];
    if (zeile[s]) {
      let laenge = 1;
      while (s + laenge < 16 && !zeile[s + laenge] && laenge < 4) laenge++;
      instrument(a, 'melodie', zeile[s], t, sechzehntel * laenge * 0.95);
    }
  }
  // Schlagzeug
  const kick = s === 0 || s === 8 || (muster === 'B' && s === 10);
  if (kick) trommel(a, 'kick', t);
  if (s === 4 || s === 12) trommel(a, 'snare', t);
  if (s % 2 === 1 || teil !== 'intro') trommel(a, 'hihat', t);

  // weiterzählen
  position.schritt++;
  if (position.schritt === 16) { position.schritt = 0; position.takt++; }
  if (position.takt === 4) { position.takt = 0; position.teil++; }
  if (position.teil === LIEDFOLGE.length) position.teil = 1;   // Intro nur einmal
}

function starteMusik() {
  if (musikLaeuft || !musikAn()) return;
  const a = audioKontext();
  if (!a) return;
  musikLautstaerke = a.createGain();
  musikLautstaerke.gain.value = 0.55;
  musikLautstaerke.connect(a.destination);
  musikLaeuft = true;
  position = { teil: 0, takt: 0, schritt: 0 };
  naechsteZeit = a.currentTime + 0.1;
  // Planer: schaut immer ein Stück voraus und plant die nächsten Töne ein
  musikUhr = setInterval(() => {
    while (naechsteZeit < a.currentTime + 0.15) {
      spieleSchritt(a, naechsteZeit);
      naechsteZeit += 60 / TEMPO / 4;
    }
  }, 25);
}

function stoppeMusik() {
  if (!musikLaeuft) return;
  musikLaeuft = false;
  clearInterval(musikUhr);
  const a = audioKontext();
  const vol = musikLautstaerke;
  vol.gain.setValueAtTime(vol.gain.value, a.currentTime);
  vol.gain.linearRampToValueAtTime(0.0001, a.currentTime + 0.6);   // sanft ausblenden
  setTimeout(() => vol.disconnect(), 800);
}

// Das Laufwerk-Geräusch beim Diskette-Einlegen: klack … klack-klack … rrrrt
function laufwerkGeraeusch() {
  if (!tonAn()) return;
  const a = audioKontext();
  if (!a) return;
  const klack = (start, laut) => {
    const puffer = a.createBuffer(1, Math.ceil(a.sampleRate * 0.03), a.sampleRate);
    const d = puffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const q = a.createBufferSource(), f = a.createBiquadFilter(), v = a.createGain();
    q.buffer = puffer; f.type = 'bandpass'; f.frequency.value = 900; v.gain.value = laut;
    q.connect(f).connect(v).connect(a.destination);
    q.start(a.currentTime + start);
  };
  klack(0, 0.5);
  [0.35, 0.47, 0.59, 0.71, 0.83, 0.95, 1.07].forEach((t, i) => klack(t, 0.25 + (i % 2) * 0.1));
  piep(70, 0.5, 0.3, 'sawtooth', 0.03, 60);   // Motor
}
