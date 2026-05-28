/* =========================================
   REYCHEL FALLAS — PORTFOLIO SCRIPT
   ========================================= */

// ─── STATE ────────────────────────────────
let lang  = 'es';
let darkMode = false;
let menuOpen = false;

// ─── THEME ────────────────────────────────
function toggleTheme() {
  darkMode = !darkMode;
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : '');
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = darkMode ? '☀️ Claro' : '🌙 Oscuro';
}

// ─── LANGUAGE ─────────────────────────────
function toggleLang() {
  lang = lang === 'es' ? 'en' : 'es';
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = lang === 'es' ? '🌐 EN' : '🌐 ES';

  // Actualiza todos los elementos con atributos data-es / data-en
  document.querySelectorAll('[data-es]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text !== null) el.innerHTML = text;
  });
}

// ─── MOBILE MENU ──────────────────────────
function toggleMenu() {
  menuOpen = !menuOpen;
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger');
  if (!menu) return;
  menu.classList.toggle('open', menuOpen);
  if (btn) btn.textContent = menuOpen ? '✕' : '☰';
}

function closeMenu() {
  menuOpen = false;
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (btn) btn.textContent = '☰';
}

// ─── NAVBAR SCROLL SHADOW ─────────────────
function handleNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    nav.style.boxShadow = 'none';
  }
}

// ─── SMOOTH NAV LINKS ─────────────────────
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navH = document.getElementById('navbar')?.offsetHeight || 70;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ─── SCROLL REVEAL ────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Agrega la clase 'reveal' a los elementos que quieres animar
  const targets = document.querySelectorAll(
    '.skill-card, .project-card, .tl-item, .contact-card, .section-head'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.07 + 's';
    observer.observe(el);
  });
}

// ─── ACTIVE NAV LINK ──────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(sec => observer.observe(sec));
}

// ─── INIT ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSmoothLinks();
  initScrollReveal();
  initActiveNav();
  window.addEventListener('scroll', handleNavScroll, { passive: true });
});
