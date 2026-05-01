// ═══════════════════════════════════════════════
//  PORTE PHOTO → VIDÉO OISEAUX
// ═══════════════════════════════════════════════

// ─── METTEZ ICI L'ID DE VOTRE VIDÉO YOUTUBE ────
// Exemple : pour https://www.youtube.com/watch?v=abc123XYZ
// → mettez  'abc123XYZ'
// Donnez le lien YouTube à l'assistant pour qu'il le mette automatiquement
const BIRDS_VIDEO_ID = 'REMPLACEZ_PAR_VOTRE_VIDEO_ID';
// ────────────────────────────────────────────────

let doorOpened = false;

function openDoor() {
  if (doorOpened) return;
  doorOpened = true;

  const doorScene    = document.getElementById('doorScene');
  const videoScene   = document.getElementById('videoScene');
  const birdsIframe  = document.getElementById('birdsIframe');

  // Transition : porte → vidéo
  doorScene.classList.add('fade-out');

  setTimeout(() => {
    doorScene.style.display = 'none';
    videoScene.classList.add('active');

    // Charger la vidéo YouTube (autoplay + muet + sans contrôles)
    if (BIRDS_VIDEO_ID && BIRDS_VIDEO_ID !== 'REMPLACEZ_PAR_VOTRE_VIDEO_ID') {
      birdsIframe.src =
        `https://www.youtube.com/embed/${BIRDS_VIDEO_ID}` +
        `?autoplay=1&mute=1&loop=1&playlist=${BIRDS_VIDEO_ID}` +
        `&controls=0&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3`;
    } else {
      // Pas de vidéo configurée → fond sombre avec message
      videoScene.style.background =
        'linear-gradient(180deg,#0d1f35 0%,#1a4060 20%,#5ab0d0 50%,#f0a830 80%,#3a6018 100%)';
    }

    // Lancer le compte à rebours 10 secondes
    startVideoTimer(10);
  }, 800);
}

function startVideoTimer(seconds) {
  const fill = document.getElementById('videoProgressFill');
  let elapsed = 0;

  const tick = setInterval(() => {
    elapsed++;
    const pct = (elapsed / seconds) * 100;
    if (fill) fill.style.width = pct + '%';
    if (elapsed >= seconds) {
      clearInterval(tick);
      closeOpening();
    }
  }, 1000);
}

function closeOpening() {
  // Stopper la vidéo YouTube
  const iframe = document.getElementById('birdsIframe');
  if (iframe) iframe.src = 'about:blank';

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
