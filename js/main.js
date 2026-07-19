// Keep --header-h in sync with the real header height so the hero
// section fills exactly one viewport below it (no forced scroll).
const siteHeaderEl = document.querySelector('.site-header');
if (siteHeaderEl) {
  const setHeaderHeightVar = () => {
    document.documentElement.style.setProperty('--header-h', `${siteHeaderEl.offsetHeight}px`);
  };
  setHeaderHeightVar();
  window.addEventListener('resize', setHeaderHeightVar);
}

// Vanta.js "Fog" background for the hero section
if (window.VANTA && document.getElementById('hero-fog-bg')) {
  VANTA.FOG({
    el: '#hero-fog-bg',
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200,
    minWidth: 200,
    backgroundAlpha: 1,
    baseColor: 0xffffff,
    highlightColor: 0xffffff,
    midtoneColor: 0xafc6f7,
    lowlightColor: 0x0077ff,
    blurFactor: 0.9,
    speed: 0.8,
    zoom: 0.4,
    scale: 2.0,
    scaleMobile: 4.0,
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Services "show more"
const servicesToggle = document.getElementById('services-toggle');
if (servicesToggle) {
  servicesToggle.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach((card, i) => {
      card.classList.add('js-shown');
      card.style.animationDelay = `${(i % 4) * 0.08}s`;
    });
    servicesToggle.closest('.services-more').classList.add('is-done');
  });
}

// Reviews carousel
const reviewTrack = document.getElementById('review-track');
const prevBtn = document.getElementById('review-prev');
const nextBtn = document.getElementById('review-next');
const dotsWrap = document.getElementById('review-dots');

if (reviewTrack && prevBtn && nextBtn) {
  const cards = Array.from(reviewTrack.querySelectorAll('.review-card'));
  let index = 0;
  let dots = [];

  if (dotsWrap) {
    dots = cards.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'review-dot';
      dot.setAttribute('aria-label', `Отзыв ${i + 1}`);
      dot.addEventListener('click', () => {
        index = i;
        render();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
  }

  const render = () => {
    cards.forEach((card, i) => card.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  const goTo = (delta) => {
    index = (index + delta + cards.length) % cards.length;
    render();
  };

  prevBtn.addEventListener('click', () => goTo(-1));
  nextBtn.addEventListener('click', () => goTo(1));

  // Swipe support (touch and mouse drag)
  let dragStartX = null;
  let dragActive = false;

  reviewTrack.addEventListener('pointerdown', (e) => {
    dragStartX = e.clientX;
    dragActive = true;
  });
  reviewTrack.addEventListener('pointerup', (e) => {
    if (!dragActive || dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    dragActive = false;
    dragStartX = null;
    if (Math.abs(delta) < 40) return;
    goTo(delta < 0 ? 1 : -1);
  });
  reviewTrack.addEventListener('pointercancel', () => {
    dragActive = false;
    dragStartX = null;
  });

  render();
}

// Scroll-reveal for cards across the site
const revealCards = document.querySelectorAll('.feature, .service-card, .lawyer-featured, .lawyer-mini');

if (revealCards.length) {
  if (!('IntersectionObserver' in window)) {
    revealCards.forEach((card) => card.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealCards.forEach((card) => revealObserver.observe(card));
  }
}

// Header shadow on scroll
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Count-up animation for hero stat numbers
const statValues = document.querySelectorAll('.stat-value');
if (statValues.length) {
  const parseStat = (text) => {
    const match = text.match(/^(\D*)(\d+)(\D*)$/);
    if (!match) return null;
    const [, prefix, digits, suffix] = match;
    return { prefix, target: parseInt(digits, 10), suffix, digits: digits.length };
  };

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const parsed = parseStat(el.textContent);
      countObserver.unobserve(el);
      if (!parsed || parsed.target > 5000) return;

      const duration = 900;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(parsed.target * eased);
        el.textContent = `${parsed.prefix}${value}${parsed.suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = `${parsed.prefix}${parsed.target}${parsed.suffix}`;
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  statValues.forEach((el) => countObserver.observe(el));
}

// Консультация modal (contact card). The old lead-capture form lives
// hidden in #modal-body-old, kept intact for later reuse.
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

if (modalOverlay) {
  const openModal = () => {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.js-open-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

  const legacyForm = document.getElementById('modal-form');
  if (legacyForm) {
    legacyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const legacyBody = document.getElementById('modal-body-old');
      legacyBody.innerHTML = `
        <div class="modal-success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <h3>Заявка отправлена</h3>
          <p>Мы свяжемся с вами в ближайшее время.</p>
        </div>`;
    });
  }
}
