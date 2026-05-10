// ═══════════════════════════════════════════════
//  ENVELOPPE → CACHET → VIDÉO → INVITATION
// ═══════════════════════════════════════════════
let envelopeOpened = false;

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  // 1. Lancer la musique au clic (interaction = autoplay autorisé)
  const audio = document.getElementById('weddingMusic');
  if (audio) { audio.volume = 0.4; audio.play().then(() => setPlaying(true)).catch(() => {}); }

  // 2. Briser le cachet de cire
  const seal = document.getElementById('waxSeal');
  if (seal) seal.classList.add('broken');

  // 3. Ouvrir le rabat supérieur (0.5s après le cachet)
  setTimeout(() => {
    const flap = document.getElementById('envFlapTop');
    if (flap) flap.classList.add('open');
  }, 500);

  // 4. Lancer la vidéo + faire disparaître l'enveloppe (2.2s)
  setTimeout(() => {
    const video = document.getElementById('doorVideo');
    if (video) video.play().catch(() => {});
    const scene = document.getElementById('envelopeScene');
    if (scene) scene.classList.add('fading');
  }, 2200);

  // 5. Afficher noms + bouton sur la vidéo (4s)
  setTimeout(() => {
    const behindText = document.getElementById('behindText');
    if (behindText) behindText.classList.add('visible');
  }, 4000);

  // 6. Fermeture automatique après 15s
  setTimeout(closeOpening, 15000);
}

function closeOpening() {
  const video = document.getElementById('doorVideo');
  if (video) { video.pause(); video.src = ''; }
  document.getElementById('opening-overlay').classList.add('hidden');
  startPetals();
  tryAutoPlay();
}

// ═══════════════════════════════════════════════
//  MUSIQUE
// ═══════════════════════════════════════════════
let isPlaying = false;

function tryAutoPlay() {
  const audio = document.getElementById('weddingMusic');
  audio.volume = 0.35;
  audio.play()
    .then(() => setPlaying(true))
    .catch(() => { /* autoplay bloqué par le navigateur, l'utilisateur clique */ });
}

function toggleMusic() {
  const audio = document.getElementById('weddingMusic');
  if (isPlaying) {
    audio.pause();
    setPlaying(false);
  } else {
    audio.play();
    setPlaying(true);
  }
}

function setPlaying(state) {
  isPlaying = state;
  const btn = document.getElementById('musicBtn');
  const label = document.getElementById('musicLabel');
  if (state) {
    btn.classList.add('playing');
    label.textContent = 'En cours ♪';
  } else {
    btn.classList.remove('playing');
    label.textContent = 'Musique';
  }
}

// ═══════════════════════════════════════════════
//  COMPTE À REBOURS  — 22 Juin 2026 à 14h00
// ═══════════════════════════════════════════════
const WEDDING_DATE = new Date('2026-06-22T14:00:00');

function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    document.getElementById('countdown').innerHTML =
      '<p style="font-family:var(--script);font-size:2.5rem;color:var(--gold);">C\'est aujourd\'hui ! 🎊</p>';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  setText('days',    pad(d));
  setText('hours',   pad(h));
  setText('minutes', pad(m));
  setText('seconds', pad(s));
}

function pad(n) { return String(n).padStart(2, '0'); }
function setText(id, val) {
  const el = document.getElementById(id);
  if (el && el.textContent !== val) el.textContent = val;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ═══════════════════════════════════════════════
//  PÉTALES FLOTTANTS
// ═══════════════════════════════════════════════
const PETALS = ['🦢', '🦢', '🦢', '✦', '🤍'];

function startPetals() {
  const container = document.getElementById('petals-container');
  function spawnPetal() {
    const el = document.createElement('div');
    el.classList.add('petal');
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    el.style.left     = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 1.2 + 0.6) + 'rem';
    const dur = Math.random() * 7 + 6;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay   = (Math.random() * 2) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 3) * 1000);
  }
  // Lancer plusieurs pétales tout de suite, puis en continu
  for (let i = 0; i < 5; i++) spawnPetal();
  setInterval(spawnPetal, 700);
}

// ═══════════════════════════════════════════════
//  SCROLL REVEAL
// ═══════════════════════════════════════════════
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ═══════════════════════════════════════════════
//  FORMULAIRE RSVP — Web3Forms
// ═══════════════════════════════════════════════
document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn = this.querySelector('.rsvp-btn');
  btn.textContent = 'Envoi en cours...';
  btn.disabled = true;

  const formData = new FormData(this);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (json.success) {
      this.style.display = 'none';
      const success = document.getElementById('rsvpSuccess');
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      btn.textContent = 'Réessayer 💌';
      btn.disabled = false;
      alert('Une erreur est survenue. Merci de réessayer.');
    }
  } catch {
    btn.textContent = 'Réessayer 💌';
    btn.disabled = false;
    alert('Problème de connexion. Merci de réessayer.');
  }
});

// ═══════════════════════════════════════════════
//  SMOOTH SCROLL POUR LES ANCRES
// ═══════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
