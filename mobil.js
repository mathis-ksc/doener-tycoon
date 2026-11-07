// =====================================================
//  MOBIL — Handy und iPad
// =====================================================
//
//  - Im Hochformat erscheint "Bitte dreh dein Handy quer"
//    (das macht style.css). Solange pausiert das Spiel.
//  - Zoomen mit zwei Fingern ist aus.
//  - Tasten-Hinweise verschwinden auf Geräten ohne Maus (style.css).
// =====================================================

const HOCHKANT = window.matchMedia('(orientation: portrait) and (pointer: coarse)');
let wegenDrehenPausiert = false;

function pruefeDrehung() {
  if (HOCHKANT.matches) {
    // Handy steht hochkant: Spiel anhalten, wenn es gerade läuft
    if (!pausiert) { pausiert = true; wegenDrehenPausiert = true; }
  } else if (wegenDrehenPausiert) {
    wegenDrehenPausiert = false;
    if (fensterArt === null && !startmenueOffen()) pausiert = false;
  }
}
HOCHKANT.addEventListener('change', pruefeDrehung);
pruefeDrehung();

// Zwei-Finger-Zoom auf iPhone und iPad abschalten
['gesturestart', 'gesturechange', 'gestureend'].forEach(art =>
  document.addEventListener(art, e => e.preventDefault(), { passive: false }));
document.addEventListener('touchmove', e => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

// ---------- Vollbild ----------
// Holt das Spiel auf den ganzen Bildschirm — ohne Browser-Leisten.
// Klappt am Computer und auf dem iPad. iPhones können es meistens nicht,
// dann bleiben die Vollbild-Knöpfe unsichtbar.

function vollbildMoeglich() {
  return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
}

function istVollbild() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function vollbildUmschalten(nurAn = false) {
  try {
    if (istVollbild()) {
      if (nurAn) return;
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      const el = document.documentElement;
      const ergebnis = (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
      if (ergebnis && ergebnis.catch) ergebnis.catch(() => {});
    }
  } catch (e) { /* Gerät kann kein Vollbild — egal, dann eben ohne */ }
}

document.body.classList.toggle('kein-vollbild', !vollbildMoeglich());
['fullscreenchange', 'webkitfullscreenchange'].forEach(art =>
  document.addEventListener(art, () => document.body.classList.toggle('vollbild', istVollbild())));

// ---------- Hinweis für iPhone/iPad: als App starten ----------
// Auf dem iPhone kann Safari seine Leisten nicht ausblenden (kein Vollbild).
// Ohne Leisten geht es nur, wenn man das Spiel vom Home-Bildschirm startet.
const IST_APPLE_MOBIL = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);   // neuere iPads melden sich als Mac
const ALS_APP = window.navigator.standalone === true ||
  window.matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches;
const IM_RAHMEN = window.self !== window.top;   // z. B. auf claude.ai — da hilft der Home-Bildschirm nicht

document.body.classList.toggle('app-tipp-zeigen', IST_APPLE_MOBIL && !ALS_APP && !IM_RAHMEN);
