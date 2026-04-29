/* =========================================================
   MSquare — script.js
   - No build step. Loads GSAP + ScrollTrigger + Lenis from CDN.
   - All motion gated behind prefers-reduced-motion.
   ========================================================= */

// TODO: replace with real Formspree/Getform endpoint URL once provisioned.
const FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_ME';
// TODO: replace with real Calendly URL once provisioned.
const CALENDLY_URL = '';
// TODO: replace with real LinkedIn URL once provisioned.
const LINKEDIN_URL = '';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

document.addEventListener('DOMContentLoaded', init);

function init() {
  setYear();
  setupNavScrollState();
  setupMobileNav();
  setupSmoothAnchors();
  splitHeroTitle();
  runHeroEntrance();
  setupServicesTabs();
  setupServicesAccordion();
  setupForm();
  wireTodoLinks();
  setupLightbox();

  // Observers (use IntersectionObserver, available everywhere modern)
  setupRevealObservers();
  setupCountUpObserver();

  // Optional vendor enhancements
  if (!prefersReducedMotion) {
    loadVendor().then(() => {
      enableMagneticCTAs();
      enableHeroParallax();
    }).catch(() => { /* non-fatal */ });
  }
}

/* ---------- helpers ---------- */
function setYear() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

function setupNavScrollState() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const apply = () => {
    header.dataset.state = window.scrollY > 80 ? 'scrolled' : 'top';
  };
  apply();
  window.addEventListener('scroll', apply, { passive: true });
}

function setupSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      // Close mobile nav if open
      closeMobileNav();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      // Update focus for a11y
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}

/* ---------- mobile nav ---------- */
function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.getElementById('mobile-nav');
  if (!toggle || !overlay) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    open ? closeMobileNav() : openMobileNav();
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });
}

function openMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.getElementById('mobile-nav');
  if (!toggle || !overlay) return;
  overlay.hidden = false;
  // Allow a frame so transition runs
  requestAnimationFrame(() => {
    overlay.dataset.open = 'true';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    // Stagger reveal
    overlay.querySelectorAll('.mobile-nav-links a').forEach((a, i) => {
      a.style.setProperty('--stagger', `${80 + i * 60}ms`);
    });
  });
}

function closeMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.getElementById('mobile-nav');
  if (!toggle || !overlay) return;
  overlay.dataset.open = 'false';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
  document.body.style.overflow = '';
  setTimeout(() => { if (overlay.dataset.open !== 'true') overlay.hidden = true; }, 300);
}

/* ---------- hero entrance ---------- */
function splitHeroTitle() {
  // Word-splitting was causing the .hero-emph + SVG underline to break onto
  // its own line and stretch the headline. We now animate the title as a
  // single block fade-up via the [data-anim="hero-title"] selector. This
  // function is intentionally a no-op kept for call-site compatibility.
  return;
}

function runHeroEntrance() {
  const eyebrow = document.querySelector('[data-anim="hero-eyebrow"]');
  const title = document.querySelector('[data-anim="hero-title"]');
  const sub = document.querySelector('[data-anim="hero-sub"]');
  const ctas = document.querySelector('[data-anim="hero-ctas"]');
  const emph = document.querySelector('.hero-emph');

  const start = (el, delay) => setTimeout(() => el && el.classList.add('in'), delay);

  if (prefersReducedMotion) {
    [eyebrow, title, sub, ctas].forEach((el) => el && el.classList.add('in'));
    emph && emph.classList.add('is-drawn');
    return;
  }

  start(eyebrow, 150);
  start(title, 300);
  start(sub, 700);
  start(ctas, 900);
  // Underline 300ms after the title fade-up finishes (~700ms total)
  setTimeout(() => emph && emph.classList.add('is-drawn'), 1000);
}

/* ---------- reveal-on-scroll ---------- */
function setupRevealObservers() {
  const targets = document.querySelectorAll(
    '[data-anim="eyebrow"], .timeline, .why-grid, .portrait-frame'
  );
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  targets.forEach((el) => io.observe(el));
}

/* ---------- count up ---------- */
function setupCountUpObserver() {
  const nums = document.querySelectorAll('.trust-number[data-count]');
  if (!nums.length) return;
  if (!('IntersectionObserver' in window)) { nums.forEach(animateNumber); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  nums.forEach((n) => io.observe(n));
}

function animateNumber(el) {
  const target = parseInt(el.dataset.count, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (prefersReducedMotion) {
    el.textContent = `${prefix}${target}${suffix}`;
    return;
  }
  const duration = 1200;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- services (desktop tabs) ---------- */
function setupServicesTabs() {
  const tabs = document.querySelectorAll('.service-tab');
  const panels = document.querySelectorAll('.services-panels .service-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault(); focusSiblingTab(tab, 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault(); focusSiblingTab(tab, -1);
      }
    });
  });

  function focusSiblingTab(current, dir) {
    const list = Array.from(tabs);
    const idx = list.indexOf(current);
    const next = list[(idx + dir + list.length) % list.length];
    next.focus();
    activateTab(next.dataset.tab);
  }

  function activateTab(id) {
    tabs.forEach((t) => {
      const active = t.dataset.tab === id;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    const current = document.querySelector('.service-panel.is-active');
    const next = document.querySelector(`.service-panel[data-panel="${id}"]`);
    if (!next || current === next) return;

    if (prefersReducedMotion) {
      panels.forEach((p) => { p.hidden = p !== next; p.classList.remove('is-active'); });
      next.classList.add('is-active');
      return;
    }

    if (current) {
      current.classList.add('is-leaving');
      setTimeout(() => {
        current.hidden = true;
        current.classList.remove('is-active', 'is-leaving');
      }, 200);
    }
    setTimeout(() => {
      next.hidden = false;
      next.classList.add('is-entering');
      requestAnimationFrame(() => {
        next.classList.remove('is-entering');
        next.classList.add('is-active');
      });
    }, 200);
  }
}

/* ---------- services (mobile accordion) ---------- */
function setupServicesAccordion() {
  const items = document.querySelectorAll('.services-tabs > li');
  items.forEach((li, i) => {
    const tab = li.querySelector('.service-tab');
    const acc = li.querySelector('.service-accordion');
    if (!tab || !acc) return;
    if (i === 0) { li.classList.add('is-open'); acc.hidden = false; }
    tab.addEventListener('click', () => {
      // On desktop the right panel handles state; on mobile we toggle the accordion.
      if (window.innerWidth > 1024) return;
      const open = li.classList.toggle('is-open');
      acc.hidden = !open;
    });
  });
}

/* ---------- form ---------- */
function setupForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = ['cf-name', 'cf-email', 'cf-message'].map((id) => document.getElementById(id));

  fields.forEach((f) => {
    if (!f) return;
    f.addEventListener('blur', () => validateField(f));
    f.addEventListener('input', () => clearError(f));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const valid = fields.every(validateField);
    if (!valid) return;

    const submitBtn = form.querySelector('.form-submit');
    const status = form.querySelector('.form-status');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    status.textContent = '';

    try {
      // If endpoint is a placeholder, simulate success so demos work.
      const isPlaceholder = !FORM_ENDPOINT || FORM_ENDPOINT.includes('REPLACE_ME');
      if (!isPlaceholder) {
        const formData = new FormData(form);
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST', body: formData, headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('Network');
      }
      renderSuccess(form);
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send it';
      status.textContent = 'Something went wrong. Please email yakirahoz@gmail.com.';
      status.style.color = '#FCA5A5';
    }
  });
}

function validateField(input) {
  const errEl = document.querySelector(`.field-error[data-for="${input.id}"]`);
  let msg = '';
  if (input.required && !input.value.trim()) {
    msg = 'This field is required.';
  } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    msg = 'Please enter a valid email.';
  }
  if (errEl) errEl.textContent = msg;
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  return !msg;
}
function clearError(input) {
  const errEl = document.querySelector(`.field-error[data-for="${input.id}"]`);
  if (errEl) errEl.textContent = '';
  input.setAttribute('aria-invalid', 'false');
}

function renderSuccess(form) {
  form.innerHTML = `
    <div class="form-success" role="status" aria-live="polite">
      <span class="form-success-check" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <p style="color:#fff;font-size:1.125rem;margin:0">Thanks — we got it.</p>
      <p style="color:rgba(248,250,252,0.75);margin:0">Yakira will reply within one business day.</p>
    </div>
  `;
}

/* ---------- TODO links ---------- */
function wireTodoLinks() {
  document.querySelectorAll('[data-todo="calendly"]').forEach((el) => {
    if (CALENDLY_URL) { el.href = CALENDLY_URL; el.removeAttribute('data-todo'); }
    else el.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); });
  });
  document.querySelectorAll('[data-todo="linkedin"]').forEach((el) => {
    if (LINKEDIN_URL) { el.href = LINKEDIN_URL; el.target = '_blank'; el.rel = 'noopener'; el.removeAttribute('data-todo'); }
    else el.addEventListener('click', (e) => e.preventDefault());
  });
}

/* ---------- lightbox (shared by .work-tile and .gallery-item) ---------- */
function setupLightbox() {
  const items = Array.from(document.querySelectorAll('.work-tile, .gallery-item'));
  const box = document.getElementById('gallery-lightbox');
  if (!items.length || !box) return;

  const imgEl = box.querySelector('img');
  const capEl = box.querySelector('.lightbox-caption');
  const closeBtn = box.querySelector('.lightbox-close');
  const prevBtn = box.querySelector('.lightbox-prev');
  const nextBtn = box.querySelector('.lightbox-next');

  let current = 0;
  let lastFocus = null;

  function show(i) {
    current = (i + items.length) % items.length;
    const item = items[current];
    const img = item.querySelector('img');
    if (!img) return;
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    capEl.textContent = item.dataset.caption || '';
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.dataset.open = 'true';
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    delete box.dataset.open;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  items.forEach((it, i) => {
    it.addEventListener('click', () => open(i));
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (box.dataset.open !== 'true') return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
}

/* ---------- vendor (GSAP, ScrollTrigger) ---------- */
function loadVendor() {
  return Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js'),
    loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js'),
  ]).then(() => {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

function enableMagneticCTAs() {
  if (isTouch) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    let raf = null;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > 80) { el.style.transform = ''; return; }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx * 0.1}px, ${dy * 0.1}px, 0)`;
      });
    };
    const onLeave = () => { el.style.transform = ''; };
    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
}

function enableHeroParallax() {
  if (isTouch) return;
  const dots = document.querySelector('[data-parallax]');
  if (!dots) return;
  let raf = null;
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 16;
    const y = (e.clientY / window.innerHeight - 0.5) * 16;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      dots.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }, { passive: true });
}
