/* ============================================================
   LANA CARTER — PORTFOLIO
   main.js — hero / nav foundation
   ============================================================ */

/* ── DARK MODE ── */
const html       = document.documentElement;
const darkToggle = document.getElementById('darkToggle');

// Restore saved preference
const saved = localStorage.getItem('theme');
if (saved) html.setAttribute('data-theme', saved);

darkToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ── NAV SCROLL STATE ── */
const nav = document.getElementById('nav');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── MOBILE NAV TOGGLE ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ── ACTIVE NAV HIGHLIGHTING ── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? '' : '';
        a.classList.toggle('nav-active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── PORTFOLIO FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards  = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    workCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ── CONTACT FORM ── */
const form        = document.getElementById('inquiryForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    formSuccess.hidden = false;
  });
}

/* ── MODAL ── */
const overlay    = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalTag   = overlay.querySelector('.modal-tag');
const modalByline = overlay.querySelector('.modal-byline');
const modalBody  = overlay.querySelector('.modal-body');
const modalClose = document.getElementById('modalClose');
let   lastFocused = null;

function openModal(card) {
  const storeId = card.dataset.modal;
  const store   = document.getElementById(storeId);
  if (!store) return;

  // Populate tag — copy class from card tag for colour-coding
  const cardTag = card.querySelector('.card-tag');
  modalTag.textContent = cardTag ? cardTag.textContent : '';
  modalTag.className   = 'modal-tag ' +
    (cardTag ? (Array.from(cardTag.classList).find(c => c.startsWith('tag-')) || '') : '');

  // Populate title and byline
  modalTitle.textContent  = card.querySelector('.card-title').textContent.trim();
  modalByline.textContent = card.dataset.byline || '';

  // Populate body from store
  modalBody.innerHTML = store.innerHTML;

  // Show overlay, lock scroll
  lastFocused = document.activeElement;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  overlay.hidden = true;
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

// Wire up all clickable cards
document.querySelectorAll('.work-card[data-modal]').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openModal(card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card);
    }
  });
});

// Close handlers
modalClose.addEventListener('click', closeModal);

overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !overlay.hidden) closeModal();
});
