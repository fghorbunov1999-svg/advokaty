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

if (reviewTrack && prevBtn && nextBtn) {
  const cards = Array.from(reviewTrack.querySelectorAll('.review-card'));
  let index = 0;

  const render = () => {
    cards.forEach((card, i) => card.classList.toggle('active', i === index));
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
