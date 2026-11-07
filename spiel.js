// =====================================================
//  DÖNER TYCOON 2026 — von Mathis Roth
// =====================================================
//
//  ⭐ HIER OBEN KANNST DU DAS SPIEL ÄNDERN! ⭐
//  Preise, Zutaten, Upgrades — einfach die Zahl ändern,
//  speichern und im Browser neu laden (Cmd + R).
// =====================================================

// Was ein Gericht kostet (Mathis: Yufka 8$, Döner 8$)
const PREIS = { doener: 8, yufka: 8 };

// Alle Zutaten.
//  einkauf  = was 1 Portion am Computer kostet
//  art      = brot / fleisch / gemuese / sosse / extra
//  aufpreis = nur bei Extras: so viel zahlt der Kunde mehr
//  gesperrt = erst im Skilltree freischalten
const ZUTATEN = {
  doenerbrot:     { name: 'Dönerbrot',      emoji: '🥖', einkauf: 0.5, art: 'brot' },
  yufkabrot:      { name: 'Yufkabrot',      emoji: '🫓', einkauf: 0.5, art: 'brot' },
  rind:           { name: 'Rind',           emoji: '🥩', einkauf: 1.5, art: 'fleisch' },
  haehnchen:      { name: 'Hähnchen',       emoji: '🍗', einkauf: 1.0, art: 'fleisch' },
  tomaten:        { name: 'Tomaten',        emoji: '🍅', einkauf: 0.3, art: 'gemuese' },
  salat:          { name: 'Salat',          emoji: '🥬', einkauf: 0.3, art: 'gemuese' },
  rotkraut:       { name: 'Rotkraut',       emoji: '🟣', einkauf: 0.3, art: 'gemuese' },
  zwiebel:        { name: 'Zwiebel',        emoji: '🧅', einkauf: 0.3, art: 'gemuese' },
  joghurtsosse:   { name: 'Joghurtsoße',    emoji: '🥛', einkauf: 0.4, art: 'sosse' },
  knoblauchsosse: { name: 'Knoblauchsoße',  emoji: '🧄', einkauf: 0.4, art: 'sosse', gesperrt: true },
  scharfesosse:   { name: 'Scharfe Soße',   emoji: '🌶️', einkauf: 0.3, art: 'extra', aufpreis: 1 },
  feta:           { name: 'Feta',           emoji: '🧀', einkauf: 0.6, art: 'extra', aufpreis: 1, gesperrt: true },
};

// Wie viele Portionen in einer Packung am Computer sind
const PACKUNG = 10;

// Der Skilltree. "braucht" = dieses Upgrade muss man vorher haben.
const SKILLS = [
  // Ast 1: Geld
  { id: 'kasse1',    ast: 'Geld',    name: 'Goldene Kasse I',    text: '+10% Geld pro Gericht', kosten: 25 },
  { id: 'kasse2',    ast: 'Geld',    name: 'Goldene Kasse II',   text: 'nochmal +10% Geld',     kosten: 60, braucht: 'kasse1' },
  { id: 'trinkgeld', ast: 'Geld',    name: 'Charmanter Koch',    text: 'Doppeltes Trinkgeld',   kosten: 80, braucht: 'kasse2' },
  // Ast 2: Neue Zutaten
  { id: 'knoblauch', ast: 'Zutaten', name: 'Knoblauchsoße',      text: 'Neue Soße! Kunden wollen sie', kosten: 30, frei: 'knoblauchsosse' },
  { id: 'feta',      ast: 'Zutaten', name: 'Feta',               text: 'Neues Extra (+1 $)',    kosten: 50, braucht: 'knoblauch', frei: 'feta' },
  // Ast 3: Laden
  { id: 'gemuetlich',ast: 'Laden',   name: 'Gemütliche Bude',    text: 'Kunden warten 10 Sek. länger', kosten: 35 },
  { id: 'grosshandel',ast: 'Laden',  name: 'Großhändler',        text: 'Einkauf 20% billiger',  kosten: 70, braucht: 'gemuetlich' },
];

const TAG_LAENGE = 60;    // Sekunden pro Tag (Mathis: 120 war zu anstrengend)
const GEDULD = 35;        // Sekunden, die ein Kunde wartet
const MAX_SCHLANGE = 4;   // so viele Kunden passen in die Schlange
const START_GELD = 30;
const START_LAGER = 10;   // Portionen von jeder Zutat am Anfang

// Combo: so viele richtige hintereinander → so viel mal Geld
const COMBO_STUFEN = [ { ab: 3, mal: 1.5 }, { ab: 5, mal: 2 }, { ab: 8, mal: 3 } ];

// Tagesziel: Tag 1 = 20 $, jeden Tag 6 $ mehr. ⭐ = Ziel, ⭐⭐ = 1,5 × Ziel, ⭐⭐⭐ = 2 × Ziel
const ZIEL_START = 20;
const ZIEL_PLUS = 6;
const STERNE_STUFEN = [1, 1.5, 2];
const STERN_BONUS = 5;    // $ pro Stern am Tagesende

// VIPs
const VIP_AB_TAG = 2;
const VIP_CHANCE = 0.12;
const VIP_TRINKGELD = 8;

// Wenn ein Gast seine Lieblings-Deko sieht (Mathis' Idee)
const MAG_GEDULD = 20;    // so viele Sekunden länger
const MAG_TRINKGELD = 1;

// Am Tisch sitzen
const SITZ_ZEIT = 7;      // Sekunden zum Essen
const SATT_TRINKGELD = 2;

// Deko für die Bude. Kaufen am Computer → Menü "Deko".
// gemuetlich = so viele Sekunden länger warten ALLE Kunden
// spruch = was ein Gast sagt, der genau diese Deko liebt
const DEKO = [
  { id: 'pflanze',      name: 'Große Pflanze',         emoji: '🪴', preis: 15,  gemuetlich: 1, spruch: 'Wie schön grün es hier ist!' },
  { id: 'uhr',          name: 'Wanduhr',               emoji: '🕒', preis: 20,  gemuetlich: 1, spruch: 'Endlich weiß ich, wie spät es ist.' },
  { id: 'poster',       name: 'Döner-Poster',          emoji: '🖼️', preis: 20,  gemuetlich: 1, spruch: 'Was für ein tolles Döner-Poster!' },
  { id: 'lichterkette', name: 'Lichterkette',          emoji: '💡', preis: 25,  gemuetlich: 2, spruch: 'Ooh, die bunten Lichter!' },
  { id: 'teppich',      name: 'Teppich',               emoji: '🟥', preis: 30,  gemuetlich: 1, spruch: 'So ein gemütlicher Teppich.' },
  { id: 'neon',         name: 'Neon-Schild „OPEN“',    emoji: '🔆', preis: 35,  gemuetlich: 2, spruch: 'Krass, ein Neon-Schild!' },
  { id: 'kuehlschrank', name: 'Getränkekühlschrank',   emoji: '🧊', preis: 40,  gemuetlich: 2, spruch: 'Ein kühles Getränk beim Warten — super!' },
  { id: 'tisch',        name: 'Tisch mit Hockern',     emoji: '🪑', preis: 50,  gemuetlich: 3, spruch: 'Ich kann mich zum Essen hinsetzen!' },
  { id: 'fernseher',    name: 'Fernseher mit Fußball', emoji: '📺', preis: 60,  gemuetlich: 3, spruch: 'Fußball im Fernsehen! Da warte ich gern.' },
  { id: 'aquarium',     name: 'Aquarium',              emoji: '🐠', preis: 80,  gemuetlich: 4, spruch: 'Fische! Ich guck den Fischen zu.' },
  { id: 'statue',       name: 'Goldene Dönerstatue',   emoji: '🏆', preis: 150, gemuetlich: 6, spruch: 'Eine goldene Dönerstatue?! Wahnsinn!' },
];

// Tasten: 1, 2, 3 … für die Zutaten (in der Reihenfolge der Knöpfe)
const TASTEN = '1234567890qwertzuiop';

// =====================================================
//  AB HIER: wie das Spiel funktioniert
// =====================================================

let spiel = ladeSpielstand() || neuesSpiel();
let kunden = [];             // die Schlange
let gericht = null;          // was gerade auf dem Brett liegt
let zeitRest = TAG_LAENGE;
let naechsterKunde = 2;      // Sekunden bis der nächste Kunde kommt
let pausiert = false;
let tagLaeuft = true;
let combo = 0;
let heute = neuerTagesZaehler();
let letzterTag = null;       // für die Abrechnung
let fensterArt = null;       // welches Fenster gerade offen ist
let vorneVorher = null;

function neuesSpiel() {
  const lager = {};
  for (const id in ZUTATEN) lager[id] = ZUTATEN[id].gesperrt ? 0 : START_LAGER;
  return { geld: START_GELD, tag: 1, lager, skills: [], deko: [], sterne: 0, zeitung: null, morgenZeitung: null };
}

function neuerTagesZaehler() { return { verdient: 0, bedient: 0, sauer: 0, vip: 0, besteCombo: 0 }; }

function hatSkill(id) { return spiel.skills.includes(id); }

function istFrei(id) {
  if (!ZUTATEN[id].gesperrt) return true;
  return SKILLS.some(s => s.frei === id && hatSkill(s.id));
}

// die Zutaten-Knöpfe, in Reihenfolge (ohne Brot)
function zutatenListe() {
  return Object.keys(ZUTATEN).filter(id => ZUTATEN[id].art !== 'brot' && istFrei(id));
}

function geldFaktor() {
  let f = 1;
  if (hatSkill('kasse1')) f += 0.1;
  if (hatSkill('kasse2')) f += 0.1;
  return f;
}

function comboFaktor() {
  let mal = 1;
  for (const s of COMBO_STUFEN) if (combo >= s.ab) mal = s.mal;
  return mal;
}

function zeitungFaktor() { return spiel.zeitung === 'gut' ? 1.2 : spiel.zeitung === 'schlecht' ? 0.8 : 1; }

function tagesZiel(tag = spiel.tag) { return ZIEL_START + (tag - 1) * ZIEL_PLUS; }

function einkaufsPreis(id) {
  let p = ZUTATEN[id].einkauf * PACKUNG;
  if (hatSkill('grosshandel')) p *= 0.8;
  return Math.round(p * 100) / 100;
}

function hatDeko(id) { return spiel.deko.includes(id); }

// Jede Deko macht die Bude gemütlicher
function gemuetlichkeit() {
  return DEKO.filter(d => hatDeko(d.id)).reduce((summe, d) => summe + d.gemuetlich, 0);
}

function grundGeduld() {
  return (GEDULD + (hatSkill('gemuetlich') ? 10 : 0) + gemuetlichkeit()) * schwierigkeit().geduld;
}

function zufall(liste) { return liste[Math.floor(Math.random() * liste.length)]; }

function dollar(x) {
  return x.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $';
}

function runde(x) { return Math.round(x * 100) / 100; }

function schuetze(text) {
  return String(text).replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[z]));
}

// ---------- Kunden ----------

function neueBestellung(vip) {
  const freie = Object.keys(ZUTATEN).filter(istFrei);
  const von = art => freie.filter(id => ZUTATEN[id].art === art);

  const typ = Math.random() < 0.5 ? 'doener' : 'yufka';
  const zutaten = [zufall(von('fleisch'))];
  for (const g of von('gemuese')) if (Math.random() < (vip ? 0.85 : 0.6)) zutaten.push(g);
  if (vip || Math.random() < 0.9) zutaten.push(zufall(von('sosse')));
  for (const e of von('extra')) if (Math.random() < (vip ? 0.6 : 0.25)) zutaten.push(e);
  return { typ, zutaten };
}

function neuerKunde() {
  const schonDa = kunden.map(k => k.name);
  let look, vip = false;

  const vipChance = spiel.tag >= VIP_AB_TAG ? VIP_CHANCE * schwierigkeit().vip : 0;
  const freunde = einstellungen.freunde.filter(f => f.name && !schonDa.includes(f.name));

  if (!kunden.some(k => k.vip) && Math.random() < vipChance) {
    look = neueFigur(schonDa, VIP_TYPEN);
    vip = true;
  } else if (freunde.length && Math.random() < FREUNDE_OFT[einstellungen.freundeOft].chance) {
    look = baueFigur({ ...zufall(freunde), freund: true });
  } else {
    look = neueFigur(schonDa);   // aus figuren.js
  }

  const mag = look.mag && hatDeko(look.mag) ? DEKO.find(d => d.id === look.mag) : null;
  const geduldMax = grundGeduld() * (vip ? 0.85 : 1) + (mag ? MAG_GEDULD : 0);

  kunden.push({
    look, vip, mag,
    name: look.name,
    bilder: { froh: portraet(look, 'froh'), normal: portraet(look, 'normal'), sauer: portraet(look, 'sauer') },
    bestellung: neueBestellung(vip),
    geduld: geduldMax, geduldMax,
    herz: mag ? 4 : 0,            // so lange zeigt der Gast ein Herz über dem Kopf
    x: EINGANG.x, y: EINGANG.y,   // wo der Kunde in der Bude steht (siehe bude.js)
  });

  if (vip) {
    TON.vip();
    sag(`🌟 VIP! ${look.name} ist da! Schwere Bestellung, aber dickes Trinkgeld.`);
  } else if (mag) {
    TON.herz();
    sag(`😍 ${look.name}: "${mag.spruch}"`);
  } else {
    TON.kundeKommt();
  }
}

function preisFuer(bestellung) {
  let p = PREIS[bestellung.typ];
  for (const z of bestellung.zutaten) p += ZUTATEN[z].aufpreis || 0;
  return p;
}

// ---------- Theke ----------

function waehleTyp(typ) {
  if (!tagLaeuft) return;
  if (gericht) return sag('Da liegt schon was auf dem Brett!');
  const brot = typ === 'doener' ? 'doenerbrot' : 'yufkabrot';
  if (spiel.lager[brot] <= 0) return sag(`Kein ${ZUTATEN[brot].name} mehr! Ab zum Computer 💻`);
  spiel.lager[brot]--;
  gericht = { typ, zutaten: [] };
  TON.brot();
  zeichne();
}

function tuRein(id) {
  if (!tagLaeuft || !id) return;
  if (!gericht) return sag('Erst Döner oder Yufka wählen! (Taste D oder Y)');
  if (gericht.zutaten.includes(id)) return sag(`${ZUTATEN[id].name} ist schon drin.`);
  if (spiel.lager[id] <= 0) return sag(`${ZUTATEN[id].name} ist leer! Ab zum Computer 💻`);
  spiel.lager[id]--;
  gericht.zutaten.push(id);
  TON.zutat(zutatenListe().indexOf(id));
  zeichne();
}

function wegwerfen() {
  if (!gericht) return;
  gericht = null;
  TON.wegwerfen();
  sag('Weg damit. 🗑️');
  zeichne();
}

function comboVerloren() {
  if (combo >= COMBO_STUFEN[0].ab) { TON.comboWeg(); comboEffekt('Combo weg!', '#ee3333'); }
  combo = 0;
}

function servieren() {
  if (!tagLaeuft) return;
  if (!gericht) return sag('Da ist noch nichts zum Servieren.');
  if (kunden.length === 0) return sag('Gerade ist kein Kunde da.');

  const k = kunden.shift();
  const b = k.bestellung;
  const richtig = gericht.typ === b.typ &&
    gericht.zutaten.length === b.zutaten.length &&
    b.zutaten.every(z => gericht.zutaten.includes(z));
  gericht = null;

  if (!richtig) {
    heute.sauer++;
    comboVerloren();
    TON.falsch();
    if (k.look.kritiker) spiel.morgenZeitung = 'schlecht';
    kundeGeht(k, '😡');
    sag(`😡 ${k.name}: "Das hab ich nicht bestellt!"` + (k.look.kritiker ? ' Das kommt morgen in die Zeitung …' : ''));
  } else {
    combo++;
    heute.besteCombo = Math.max(heute.besteCombo, combo);
    const mal = comboFaktor();
    let geld = preisFuer(b) * geldFaktor() * mal * zeitungFaktor();
    let trinkgeld = 0;
    if (k.geduld > k.geduldMax / 2) trinkgeld += hatSkill('trinkgeld') ? 2 : 1;
    if (k.mag) trinkgeld += MAG_TRINKGELD;
    if (k.vip) trinkgeld += VIP_TRINKGELD;
    geld = runde(geld + trinkgeld);
    spiel.geld = runde(spiel.geld + geld);
    heute.verdient = runde(heute.verdient + geld);
    heute.bedient++;
    if (k.vip) heute.vip++;
    if (k.look.kritiker) spiel.morgenZeitung = 'gut';

    TON.kasse();
    if (mal > 1) { TON.combo(combo); comboEffekt(`COMBO ${combo}! x${String(mal).replace('.', ',')}`, '#ff8800'); }
    kundeGeht(k, '😋', '+' + dollar(geld));
    sag(`😋 ${k.name}: "Lecker!" +${dollar(geld)}` +
        (trinkgeld ? ` (${trinkgeld} $ Trinkgeld)` : '') +
        (k.look.kritiker ? ' — das kommt morgen in die Zeitung!' : ''));
  }
  zeichne();
}

// Ein Gast hat am Tisch fertig gegessen (wird von bude.js aufgerufen)
function sattBezahlt(g) {
  spiel.geld = runde(spiel.geld + SATT_TRINKGELD);
  heute.verdient = runde(heute.verdient + SATT_TRINKGELD);
  TON.herz();
  zeichne();
  return SATT_TRINKGELD;
}

// ---------- Die Uhr ----------

function tick() {
  if (pausiert || !tagLaeuft) return;
  const dt = 0.1;

  zeitRest -= dt;
  naechsterKunde -= dt;
  if (zeitRest > 0 && naechsterKunde <= 0) {
    if (kunden.length < MAX_SCHLANGE) neuerKunde();
    naechsterKunde = 5 + Math.random() * 4;
  }

  // Wer vorne steht, verliert Geduld. Wer dahinter steht, nur halb so schnell.
  kunden.forEach((k, i) => {
    k.geduld -= dt * (i === 0 ? 1 : 0.5);
    if (k.herz > 0) k.herz -= dt;
  });
  const weg = kunden.filter(k => k.geduld <= 0);
  if (weg.length) {
    heute.sauer += weg.length;
    comboVerloren();
    TON.sauer();
    if (weg.some(k => k.look.kritiker)) spiel.morgenZeitung = 'schlecht';
    sag(`😤 ${weg[0].name} hatte keine Lust mehr zu warten.`);
    weg.forEach(k => kundeGeht(k, '😤'));
    kunden = kunden.filter(k => k.geduld > 0);
  }

  if (zeitRest <= 0 && kunden.length === 0 && !jemandSitzt()) tagEnde();

  const vorne = kunden[0] ? kunden[0].name : null;
  if (vorne !== vorneVorher) { vorneVorher = vorne; zeichne(); }
  else { zeichneKunden(); zeichneUhr(); }
}

function sterneFuer(verdient, ziel) {
  return STERNE_STUFEN.filter(f => verdient >= ziel * f).length;
}

function tagEnde() {
  tagLaeuft = false;
  gericht = null;
  const ziel = tagesZiel();
  const sterne = sterneFuer(heute.verdient, ziel);
  const bonus = sterne * STERN_BONUS;
  spiel.geld = runde(spiel.geld + bonus);
  spiel.sterne += sterne;
  letzterTag = { tag: spiel.tag, ziel, sterne, bonus, zeitung: spiel.morgenZeitung, ...heute };
  spiel.zeitung = spiel.morgenZeitung;
  spiel.morgenZeitung = null;
  spiel.tag++;
  speichere();
  TON.tagEnde();
  for (let i = 0; i < sterne; i++) setTimeout(() => TON.stern(i), 900 + i * 350);
  zeichne();
  zeigeAbschluss();
}

const ZEITUNG = {
  gut: '📰 Zeitung: „Der beste Döner der Stadt!“ — morgen +20 % Geld',
  schlecht: '📰 Zeitung: „Der Döner war nicht so toll …“ — morgen −20 % Geld',
};

// Die Abrechnung. Eigene Funktion, damit "Zurück" den Tag nicht nochmal beendet.
function zeigeAbschluss() {
  const t = letzterTag;
  if (!t) return;
  const sterneHtml = [0, 1, 2].map(i =>
    `<span class="gross-stern ${i < t.sterne ? 'an' : ''}">${i < t.sterne ? '⭐' : '☆'}</span>`).join('');
  zeigeFenster(`
    <h2>Tag ${t.tag} ist vorbei!</h2>
    <div class="sterne-zeile">${sterneHtml}</div>
    <p>Verdient: <b>${dollar(t.verdient)}</b> · Ziel war ${dollar(t.ziel)}
      ${t.bonus ? `· Sterne-Bonus: <b>+${dollar(t.bonus)}</b>` : ''}</p>
    <p>😋 ${t.bedient} zufrieden · 😤 ${t.sauer} sauer · 🔥 beste Combo: ${t.besteCombo}
      ${t.vip ? `· 🌟 ${t.vip} VIP` : ''}</p>
    ${t.zeitung ? `<p class="zeitung">${ZEITUNG[t.zeitung]}</p>` : ''}
    <p>In der Kasse: <b>${dollar(spiel.geld)}</b> · Morgen ist das Ziel ${dollar(tagesZiel())}</p>
    <div class="reihe">
      <button onclick="zeigeComputer(true)">💻 Einkaufen</button>
      <button onclick="zeigeSkills(true)">🌳 Skilltree</button>
      <button class="gruen" onclick="neuerTag()">☀️ Nächster Tag <kbd>Enter</kbd></button>
    </div>`, '', 'abschluss');
}

function neuerTag() {
  heute = neuerTagesZaehler();
  zeitRest = TAG_LAENGE;
  naechsterKunde = 2;
  kunden = [];
  combo = 0;
  tagLaeuft = true;
  schliesseFenster();
  sag(spiel.zeitung ? ZEITUNG[spiel.zeitung].replace('morgen', 'heute')
                    : `Tag ${spiel.tag}! Ziel: ${dollar(tagesZiel())}. Auf geht's!`);
  zeichne();
}

// ---------- Computer (Einkaufen) ----------

function zurueckKnopf(ausTagEnde) {
  return `<p><button onclick="${ausTagEnde ? 'zeigeAbschluss()' : 'schliesseFenster()'}">↩ Zurück <kbd>Esc</kbd></button></p>`;
}

function wer(dekoId) {
  const namen = [...KUNDEN_TYPEN, ...VIP_TYPEN, ...einstellungen.freunde]
    .filter(t => t.mag === dekoId).map(t => t.name);
  return namen.length ? `<small class="mag">❤ ${schuetze(namen.join(', '))}</small>` : '';
}

function zeigeComputer(ausTagEnde, reiter = 'zutaten') {
  const knopf = (id, text) =>
    `<button class="reiter ${reiter === id ? 'aktiv' : ''}" onclick="zeigeComputer(${ausTagEnde}, '${id}')">${text}</button>`;

  let zeilen = '';
  if (reiter === 'zutaten') {
    for (const id in ZUTATEN) {
      if (!istFrei(id)) continue;
      const z = ZUTATEN[id];
      const p = einkaufsPreis(id);
      zeilen += `<div class="shop-zeile">
        <span>${z.emoji} ${z.name} — im Lager: <b>${spiel.lager[id]}</b></span>
        <button onclick="kaufe('${id}', ${ausTagEnde})" ${spiel.geld < p ? 'disabled' : ''}>
          ${PACKUNG} Stück für ${dollar(p)}</button>
      </div>`;
    }
  } else {
    zeilen += `<p>Jede 🛋️ macht <b>alle</b> Gäste 1 Sek. geduldiger. Und wer seine Lieblings-Deko (❤) sieht,
      wartet ${MAG_GEDULD} Sek. länger und gibt Trinkgeld. Jetzt: 🛋️ ${gemuetlichkeit()}</p>`;
    for (const d of DEKO) {
      zeilen += `<div class="shop-zeile">
        <span>${d.emoji} ${d.name} ${'🛋️'.repeat(d.gemuetlich)}<br>${wer(d.id)}</span>
        ${hatDeko(d.id) ? '<span class="steht">✅ steht in der Bude</span>'
          : `<button onclick="kaufeDeko('${d.id}', ${ausTagEnde})" ${spiel.geld < d.preis ? 'disabled' : ''}>Kaufen: ${dollar(d.preis)}</button>`}
      </div>`;
    }
  }

  zeigeFenster(`
    <h2>💻 Döner-Großmarkt Online</h2>
    <div class="reihe">${knopf('zutaten', '🥬 Zutaten')}${knopf('deko', '🪴 Deko')}</div>
    <p>Kontostand: <b>${dollar(spiel.geld)}</b></p>
    ${zeilen}
    ${zurueckKnopf(ausTagEnde)}`, '', 'computer');
}

function kaufeDeko(id, ausTagEnde) {
  const d = DEKO.find(x => x.id === id);
  if (hatDeko(id) || spiel.geld < d.preis) return;
  spiel.geld -= d.preis;
  spiel.deko.push(id);
  TON.kaufen();
  speichere();
  zeichne();
  sag(`${d.emoji} ${d.name} steht jetzt in der Bude!`);
  zeigeComputer(ausTagEnde, 'deko');
}

function kaufe(id, ausTagEnde) {
  const p = einkaufsPreis(id);
  if (spiel.geld < p) return;
  spiel.geld = runde(spiel.geld - p);
  spiel.lager[id] += PACKUNG;
  TON.kaufen();
  speichere();
  zeichne();
  zeigeComputer(ausTagEnde);
}

// ---------- Skilltree ----------

function zeigeSkills(ausTagEnde) {
  const aeste = [...new Set(SKILLS.map(s => s.ast))];
  let html = '<div class="baum">';
  for (const ast of aeste) {
    html += `<div class="ast"><h3>${ast}</h3>`;
    for (const s of SKILLS.filter(s => s.ast === ast)) {
      const gekauft = hatSkill(s.id);
      const gesperrt = s.braucht && !hatSkill(s.braucht);
      const vorher = s.braucht ? SKILLS.find(x => x.id === s.braucht).name : '';
      html += `<div class="skill ${gekauft ? 'gekauft' : ''} ${gesperrt ? 'gesperrt' : ''}">
        <b>${s.name}</b><small>${s.text}</small>
        ${gekauft ? '✅ Gekauft'
          : gesperrt ? `🔒 Erst: ${vorher}`
          : `<button onclick="kaufeSkill('${s.id}', ${ausTagEnde})" ${spiel.geld < s.kosten ? 'disabled' : ''}>Kaufen: ${dollar(s.kosten)}</button>`}
      </div>`;
    }
    html += '</div>';
  }
  html += '</div>';
  zeigeFenster(`
    <h2>🌳 Skilltree</h2>
    <p>Kontostand: <b>${dollar(spiel.geld)}</b></p>
    ${html}
    ${zurueckKnopf(ausTagEnde)}`, '', 'skills');
}

function kaufeSkill(id, ausTagEnde) {
  const s = SKILLS.find(x => x.id === id);
  if (hatSkill(id) || spiel.geld < s.kosten) return;
  spiel.geld -= s.kosten;
  spiel.skills.push(id);
  if (s.frei) spiel.lager[s.frei] += PACKUNG;  // Geschenk: erste Packung gratis
  TON.kaufen();
  speichere();
  zeichne();
  zeigeSkills(ausTagEnde);
}

// ---------- Fenster ----------

function zeigeFenster(html, extraKlasse = '', art = null) {
  pausiert = true;
  fensterArt = art;
  const inhalt = document.getElementById('fenster-inhalt');
  inhalt.className = extraKlasse;
  inhalt.innerHTML = html;
  document.getElementById('fenster').classList.remove('versteckt');
}

function schliesseFenster() {
  // im Startmenü bleibt das Spiel angehalten
  pausiert = typeof startmenueOffen === 'function' && startmenueOffen();
  fensterArt = null;
  document.getElementById('fenster').classList.add('versteckt');
}

function fensterZu() {
  if (tagLaeuft || (typeof startmenueOffen === 'function' && startmenueOffen())) schliesseFenster();
  else zeigeAbschluss();
}

// ---------- Zeichnen ----------

function sag(text) { document.getElementById('sprechblase').textContent = text; }

function name(id) { return ZUTATEN[id].emoji + ' ' + ZUTATEN[id].name; }

function typName(typ) { return typ === 'doener' ? '🥙 Döner' : '🌯 Yufka'; }

function zeichneKunden() {
  const html = kunden.map((k, i) => {
    const b = k.bestellung;
    const anteil = Math.max(0, k.geduld / k.geduldMax * 100);
    const farbe = anteil < 25 ? 'wuetend' : anteil < 50 ? 'knapp' : '';
    const laune = anteil < 25 ? 'sauer' : anteil < 50 ? 'normal' : 'froh';
    return `<div class="kunde ${i === 0 ? 'vorne' : ''} ${k.vip ? 'vip' : ''}">
      <img class="gesicht" src="${k.bilder[laune]}" alt="">
      <div class="bestellung">
        <div class="kname">${k.vip ? '🌟 ' : k.look.freund ? '💛 ' : ''}${schuetze(k.name)}${k.mag ? ' ❤' + k.mag.emoji : ''}</div>
        <div class="icons" title="${b.zutaten.map(z => ZUTATEN[z].name).join(', ')}">${b.typ === 'doener' ? '🥙' : '🌯'} ${b.zutaten.map(z => ZUTATEN[z].emoji).join('')}</div>
        <div class="geduld"><div class="${farbe}" style="width:${anteil}%"></div></div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('schlange').innerHTML =
    html || `<p class="leer-text">${tagLaeuft && zeitRest > 0 ? 'Noch keiner da …' : 'Laden zu!'}</p>`;
}

function zeichneUhr() {
  document.getElementById('uhr').textContent = Math.max(0, Math.ceil(zeitRest));
}

function zeichneZiel() {
  const ziel = tagesZiel();
  const max = ziel * STERNE_STUFEN[2];
  const anteil = Math.min(100, heute.verdient / max * 100);
  const sterne = sterneFuer(heute.verdient, ziel);
  const marken = STERNE_STUFEN.map((f, i) =>
    `<span class="marke ${i < sterne ? 'an' : ''}" style="left:${f / STERNE_STUFEN[2] * 100}%">${'⭐'.repeat(i + 1)}</span>`).join('');
  document.getElementById('ziel').innerHTML = `
    <div class="ziel-text">🎯 Ziel: ${dollar(ziel)} <span>· verdient: <b>${dollar(heute.verdient)}</b></span></div>
    <div class="ziel-balken"><div style="width:${anteil}%"></div>${marken}</div>`;

  const mal = comboFaktor();
  const naechste = COMBO_STUFEN.find(s => combo < s.ab);
  document.getElementById('combo').innerHTML = combo > 0
    ? `<span class="${mal > 1 ? 'feuer' : ''}">🔥 Combo ${combo}${mal > 1 ? ` · x${String(mal).replace('.', ',')}` : ''}</span>` +
      (naechste ? ` <small>noch ${naechste.ab - combo} bis x${String(naechste.mal).replace('.', ',')}</small>` : '')
    : `<small>Combo: ${COMBO_STUFEN[0].ab} richtige hintereinander = x${String(COMBO_STUFEN[0].mal).replace('.', ',')} Geld</small>`;
}

function zeichne() {
  document.getElementById('geld').textContent = dollar(spiel.geld);
  document.getElementById('tag').textContent = spiel.tag;
  document.getElementById('sterne').textContent = spiel.sterne;
  document.getElementById('gemuetlich').textContent = gemuetlichkeit();
  zeichneUhr();
  zeichneZiel();

  // Bestellung des vorderen Gastes + was schon auf dem Brett liegt
  const vorne = kunden[0];
  let bestellt = '<span class="grau">Kein Gast an der Theke.</span>';
  if (vorne) {
    const b = vorne.bestellung;
    const typOk = gericht && gericht.typ === b.typ;
    bestellt = `<b>${schuetze(vorne.name)}</b> will: <span class="${typOk ? 'drin' : ''}">${typName(b.typ)}</span> mit ` +
      b.zutaten.map(z => `<span class="${gericht && gericht.zutaten.includes(z) ? 'drin' : ''}">${name(z)}</span>`).join(', ');
  }
  const brett = gericht
    ? `${typName(gericht.typ)}` + (gericht.zutaten.length ? ' mit ' + gericht.zutaten.map(z => ZUTATEN[z].emoji).join(' ') : '')
    : '<span class="grau">leer</span>';
  document.getElementById('gericht').innerHTML =
    `<div class="bestellt">${bestellt}</div><div class="brett">🍽️ Brett: ${brett}</div>`;

  // Entspannt-Modus: was der Gast noch braucht, leuchtet
  const tipp = new Set();
  if (vorne && schwierigkeit().tipps) {
    if (!gericht) tipp.add(vorne.bestellung.typ);
    else if (gericht.typ === vorne.bestellung.typ)
      vorne.bestellung.zutaten.filter(z => !gericht.zutaten.includes(z)).forEach(z => tipp.add(z));
  }

  let knoepfe = '';
  zutatenListe().forEach((id, i) => {
    const z = ZUTATEN[id];
    const n = spiel.lager[id];
    knoepfe += `<button class="zutat ${n <= 0 ? 'leer' : ''} ${tipp.has(id) ? 'tipp' : ''}" onclick="tuRein('${id}')">
      <kbd>${TASTEN[i] || ''}</kbd>${z.emoji} ${z.name}${z.aufpreis ? ` +${z.aufpreis}$` : ''} <span class="anzahl">${n}</span></button>`;
  });
  document.getElementById('zutaten-knoepfe').innerHTML = knoepfe;

  const dk = document.querySelector('[data-typ=doener]'), yk = document.querySelector('[data-typ=yufka]');
  dk.innerHTML = `<kbd>D</kbd>🥙 Döner <small>(${spiel.lager.doenerbrot})</small>`;
  yk.innerHTML = `<kbd>Y</kbd>🌯 Yufka <small>(${spiel.lager.yufkabrot})</small>`;
  dk.classList.toggle('tipp', tipp.has('doener'));
  yk.classList.toggle('tipp', tipp.has('yufka'));

  zeichneKunden();
}

// ---------- Tastatur ----------

document.addEventListener('keydown', e => {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const taste = e.key.toLowerCase();

  if (fensterArt !== null) {
    if (taste === 'escape') { fensterZu(); e.preventDefault(); }
    else if (taste === 'enter' && fensterArt === 'abschluss') { neuerTag(); e.preventDefault(); }
    return;
  }
  if (typeof startmenueOffen === 'function' && startmenueOffen()) return;   // das Startmenü hat eigene Tasten
  let genutzt = true;
  if (taste === 'd') waehleTyp('doener');
  else if (taste === 'y') waehleTyp('yufka');
  else if (taste === ' ' || taste === 'enter') servieren();
  else if (taste === 'x' || taste === 'backspace') wegwerfen();
  else if (TASTEN.includes(taste)) tuRein(zutatenListe()[TASTEN.indexOf(taste)]);
  else genutzt = false;
  if (genutzt) e.preventDefault();
});

// Nach einem Klick den Knopf "loslassen", damit die Leertaste nicht nochmal klickt
document.addEventListener('click', e => {
  const knopf = e.target.closest('button');
  if (knopf) knopf.blur();
});

// ---------- Speichern ----------

function speichere() {
  try { localStorage.setItem('doenerbude', JSON.stringify(spiel)); } catch (e) {}
}

function ladeSpielstand() {
  try {
    const s = JSON.parse(localStorage.getItem('doenerbude'));
    if (!s) return null;
    for (const id in ZUTATEN) if (s.lager[id] === undefined) s.lager[id] = 0;  // neue Zutaten
    if (!s.deko) s.deko = [];          // alte Spielstände hatten noch keine Deko
    if (!s.sterne) s.sterne = 0;       // … und noch keine Sterne
    return s;
  } catch (e) { return null; }
}

function neuStarten() {
  frage('Wirklich ganz von vorne anfangen? Geld, Deko und Skills sind dann weg. Deine Freunde in den Einstellungen bleiben.',
    '🔄 Ja, von vorne',
    () => { spiel = neuesSpiel(); speichere(); neuerTag(); if (startmenueOffen()) { pausiert = true; zeichneStartMenue(); } },
    () => zeigeEinstellungen('spiel'));
}

// "Bist du sicher?" — im Spiel selbst, weil Browser-Popups online nicht gehen
let frageJa = null, frageNein = null;
function frage(text, jaText, ja, nein) {
  frageJa = () => { frageJa = null; ja(); };
  frageNein = () => { frageNein = null; if (nein) nein(); else fensterZu(); };
  zeigeFenster(`
    <h2>Bist du sicher?</h2>
    <p>${text}</p>
    <div class="reihe">
      <button class="rot" onclick="frageJa()">${jaText}</button>
      <button onclick="frageNein()">Nein, doch nicht</button>
    </div>`, '', 'frage');
}

// ---------- Los geht's ----------

document.querySelectorAll('.typ').forEach(b => b.onclick = () => waehleTyp(b.dataset.typ));
document.getElementById('btn-servieren').onclick = servieren;
document.getElementById('btn-wegwerfen').onclick = wegwerfen;
document.getElementById('btn-computer').onclick = () => tagLaeuft && zeigeComputer(false);
document.getElementById('btn-skills').onclick = () => tagLaeuft && zeigeSkills(false);
document.getElementById('btn-einstellungen').onclick = () => zeigeEinstellungen();

zeichne();
setInterval(tick, 100);
