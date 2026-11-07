// =====================================================
//  EINSTELLUNGEN — Ton, Look, Schwierigkeit und
//  eure eigenen Gäste (Freunde & Familie)
// =====================================================
//
//  Die Einstellungen werden extra gespeichert. Wenn ihr das
//  Spiel neu startet, bleiben eure Freunde trotzdem da.
// =====================================================

const SCHWIERIGKEIT = {
  entspannt: { name: '😌 Entspannt', geduld: 1.5,  vip: 1,   tipps: true,
               text: 'Gäste warten 50 % länger. Was der Gast noch braucht, leuchtet orange.' },
  normal:    { name: '🙂 Normal',    geduld: 1,    vip: 1,   tipps: false,
               text: 'So wie gedacht.' },
  profi:     { name: '😎 Profi',     geduld: 0.75, vip: 1.7, tipps: false,
               text: 'Gäste sind ungeduldig, VIPs kommen öfter.' },
};

const FREUNDE_OFT = {
  selten:   { name: 'selten',   chance: 0.15 },
  manchmal: { name: 'manchmal', chance: 0.35 },
  oft:      { name: 'oft',      chance: 0.6 },
};

const MAX_FREUNDE = 12;

let einstellungen = ladeEinstellungen();
wendeEinstellungenAn();

function ladeEinstellungen() {
  const standard = { ton: true, musik: true, retro: true, schwierigkeit: 'normal', freundeOft: 'manchmal', freunde: [] };
  try {
    const gespeichert = JSON.parse(localStorage.getItem('doenerbude-einstellungen'));
    return { ...standard, ...(gespeichert || {}) };
  } catch (e) { return standard; }
}

function speichereEinstellungen() {
  try { localStorage.setItem('doenerbude-einstellungen', JSON.stringify(einstellungen)); } catch (e) {}
  wendeEinstellungenAn();
}

function wendeEinstellungenAn() {
  document.body.classList.toggle('glatt', !einstellungen.retro);
}

function schwierigkeit() { return SCHWIERIGKEIT[einstellungen.schwierigkeit] || SCHWIERIGKEIT.normal; }

// ---------- Das Fenster ----------

function zeigeEinstellungen(reiter = 'freunde') {
  const knopf = (id, text) =>
    `<button class="reiter ${reiter === id ? 'aktiv' : ''}" onclick="zeigeEinstellungen('${id}')">${text}</button>`;
  const inhalt = reiter === 'freunde' ? freundeSeite() : spielSeite();
  zeigeFenster(`
    <h2>⚙️ Einstellungen</h2>
    <div class="reihe">${knopf('freunde', '💛 Freunde & Familie')}${knopf('spiel', '🔧 Spiel')}</div>
    ${inhalt}
    <p><button onclick="fensterZu()">↩ Zurück <kbd>Esc</kbd></button></p>`, 'breit', 'einstellungen');
}

function wahl(gruppe, werte, aktuell, aufruf) {
  return `<div class="wahl">` + Object.entries(werte).map(([id, w]) =>
    `<button class="${id === aktuell ? 'aktiv' : ''}" onclick="${aufruf}('${id}')">${w.name}</button>`).join('') + `</div>`;
}

function spielSeite() {
  return `
    <div class="einstellung"><b>Schwierigkeit</b>
      ${wahl('schwierigkeit', SCHWIERIGKEIT, einstellungen.schwierigkeit, 'setzeSchwierigkeit')}
      <small>${schwierigkeit().text}</small></div>
    <div class="einstellung"><b>Ton</b>
      ${wahl('ton', { an: { name: '🔊 an' }, aus: { name: '🔇 aus' } }, einstellungen.ton ? 'an' : 'aus', 'setzeTon')}</div>
    <div class="einstellung"><b>Musik im Startmenü</b>
      ${wahl('musik', { an: { name: '🎵 an' }, aus: { name: '🔇 aus' } }, einstellungen.musik !== false ? 'an' : 'aus', 'setzeMusik')}</div>
    <div class="einstellung"><b>Look</b>
      ${wahl('look', { amiga: { name: '👾 Amiga (32 Farben)' }, glatt: { name: '🖥️ Glatt' } }, einstellungen.retro ? 'amiga' : 'glatt', 'setzeLook')}</div>
    <div class="einstellung nur-tastatur"><b>Tasten</b>
      <small><kbd>D</kbd> Döner · <kbd>Y</kbd> Yufka · <kbd>1</kbd>–<kbd>0</kbd> Zutaten · <kbd>Leertaste</kbd> Servieren ·
      <kbd>X</kbd> Wegwerfen · <kbd>Esc</kbd> Fenster zu · <kbd>Enter</kbd> nächster Tag</small></div>
    <div class="einstellung"><b>Spielstand</b>
      <button onclick="neuStarten()">🔄 Ganz von vorne anfangen</button>
      <small>Geld, Deko und Skills sind dann weg. Eure Freunde bleiben.</small></div>`;
}

function setzeSchwierigkeit(id) { einstellungen.schwierigkeit = id; speichereEinstellungen(); zeichne(); zeigeEinstellungen('spiel'); }
function setzeTon(id) { einstellungen.ton = id === 'an'; speichereEinstellungen(); TON.klick(); zeigeEinstellungen('spiel'); }
function setzeMusik(id) {
  einstellungen.musik = id === 'an';
  speichereEinstellungen();
  if (einstellungen.musik && startmenueOffen()) starteMusik(); else if (!einstellungen.musik) stoppeMusik();
  zeigeEinstellungen('spiel');
}
function setzeLook(id) { einstellungen.retro = id === 'amiga'; speichereEinstellungen(); zeigeEinstellungen('spiel'); }
function setzeFreundeOft(id) { einstellungen.freundeOft = id; speichereEinstellungen(); zeigeEinstellungen('freunde'); }

// ---------- Gäste-Baukasten ----------

function farbFeld(wert) {
  return wert && wert.startsWith('#') ? `<span class="farbe" style="background:${wert}"></span>` : (TEIL_NAMEN[wert] ?? wert);
}

function freundeSeite() {
  const karten = einstellungen.freunde.map((f, i) => {
    const zeilen = Object.entries(BAUKASTEN).map(([teil, info]) => `
      <div class="bau-zeile">
        <span>${info.name}</span>
        <button onclick="aendereTeil(${i}, '${teil}', -1)">◀</button>
        <span class="wert">${farbFeld(f[teil] ?? '')}</span>
        <button onclick="aendereTeil(${i}, '${teil}', 1)">▶</button>
      </div>`).join('');
    const mag = `<select onchange="setzeMag(${i}, this.value)">
        <option value="">— nichts Besonderes —</option>
        ${DEKO.map(d => `<option value="${d.id}" ${f.mag === d.id ? 'selected' : ''}>${d.emoji} ${d.name}</option>`).join('')}
      </select>`;
    return `<div class="freund">
      <img class="vorschau" src="${ganzkoerper(f)}" alt="">
      <div class="freund-daten">
        <input value="${schuetze(f.name)}" maxlength="20" placeholder="Name" oninput="setzeName(${i}, this.value)">
        ${zeilen}
        <div class="bau-zeile"><span>Kind</span>
          <button onclick="aendereKind(${i})">${f.kind ? '✅ ja' : '⬜ nein'}</button></div>
        <div class="bau-zeile"><span>❤ mag</span>${mag}</div>
        <div class="reihe">
          <button onclick="wuerfleFreund(${i})">🎲 Würfeln</button>
          <button class="rot" onclick="loescheFreund(${i})">🗑️ Löschen</button>
        </div>
      </div>
    </div>`;
  }).join('');

  return `
    <p>Baut eure Freunde und eure Familie als Gäste! Sie kommen dann in die Bude und bestellen.
      Mit ❤ sucht ihr aus, welche Deko sie lieben — steht die in der Bude, warten sie viel länger.</p>
    <div class="einstellung"><b>Wie oft kommen sie?</b>
      ${wahl('oft', FREUNDE_OFT, einstellungen.freundeOft, 'setzeFreundeOft')}</div>
    <div class="freunde-liste">${karten || '<p class="grau">Noch niemand da. Klick auf ➕!</p>'}</div>
    ${einstellungen.freunde.length < MAX_FREUNDE ? '<p><button class="gruen" onclick="neuerFreund()">➕ Neuen Gast bauen</button></p>' : ''}`;
}

function neuerFreund() {
  const f = baueFigur({ name: '', haare: wuerfel(BAUKASTEN.haare.werte), extra: '', kind: false, mag: '' });
  delete f.kappenfarbe;
  einstellungen.freunde.push(f);
  speichereEinstellungen();
  zeigeEinstellungen('freunde');
  // gleich ins Namensfeld springen
  const felder = document.querySelectorAll('.freund input');
  if (felder.length) felder[felder.length - 1].focus();
}

function setzeName(i, wert) {
  einstellungen.freunde[i].name = wert.trim();
  speichereEinstellungen();   // kein Neuzeichnen, sonst springt der Cursor raus
}

function aendereTeil(i, teil, richtung) {
  const werte = BAUKASTEN[teil].werte;
  const f = einstellungen.freunde[i];
  const jetzt = Math.max(0, werte.indexOf(f[teil] ?? ''));
  f[teil] = werte[(jetzt + richtung + werte.length) % werte.length];
  TON.klick();
  speichereEinstellungen();
  zeigeEinstellungen('freunde');
}

function aendereKind(i) {
  einstellungen.freunde[i].kind = !einstellungen.freunde[i].kind;
  speichereEinstellungen();
  zeigeEinstellungen('freunde');
}

function setzeMag(i, wert) {
  einstellungen.freunde[i].mag = wert;
  speichereEinstellungen();
}

function wuerfleFreund(i) {
  const alt = einstellungen.freunde[i];
  const neu = {};
  for (const [teil, info] of Object.entries(BAUKASTEN)) neu[teil] = wuerfel(info.werte);
  einstellungen.freunde[i] = { ...neu, name: alt.name, kind: alt.kind, mag: alt.mag };
  TON.klick();
  speichereEinstellungen();
  zeigeEinstellungen('freunde');
}

function loescheFreund(i) {
  const n = einstellungen.freunde[i].name || 'diesen Gast';
  frage(`${schuetze(n)} wirklich löschen?`, '🗑️ Ja, löschen', () => {
    einstellungen.freunde.splice(i, 1);
    speichereEinstellungen();
    zeigeEinstellungen('freunde');
  }, () => zeigeEinstellungen('freunde'));
}
