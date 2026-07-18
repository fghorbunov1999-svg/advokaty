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

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + cards.length) % cards.length;
    render();
  });

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % cards.length;
    render();
  });

  render();
}

// Scroll-reveal for feature cards
const featureCards = document.querySelectorAll('.feature');

if (featureCards.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  featureCards.forEach((card) => observer.observe(card));
}

// Заявка modal
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');
const modalForm = document.getElementById('modal-form');

if (modalOverlay && modalForm) {
  const modalDefaultHTML = modalBody.innerHTML;

  const openModal = () => {
    modalBody.innerHTML = modalDefaultHTML;
    bindModalForm();
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  function bindModalForm() {
    const form = document.getElementById('modal-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      modalBody.innerHTML = `
        <div class="modal-success">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <h3>Заявка отправлена</h3>
          <p>Мы свяжемся с вами в ближайшее время.</p>
        </div>`;
    });
  }

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
}
