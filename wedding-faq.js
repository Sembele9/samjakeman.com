// Live countdown to the wedding date shown under the page heading.
(function () {
  const weddingDate = new Date('2027-02-12T00:00:00');

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value).padStart(2, '0');
  }

  function updateCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;

    const diffMs = weddingDate - new Date();
    if (diffMs <= 0) {
      countdown.textContent = "It's the big day! See you in Helsinki!";
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    setValue('countdownDays', days);
    setValue('countdownHours', hours);
    setValue('countdownMinutes', minutes);
    setValue('countdownSeconds', seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// Shows the "back to top" button once the page has scrolled down a bit.
(function () {
  const button = document.getElementById('backToTop');
  if (!button) return;

  function toggleVisibility() {
    button.classList.toggle('visible', window.scrollY > 400);
  }

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
})();

(function () {
  const faqSections = document.querySelectorAll('main > details.faq-section');

  faqSections.forEach((section) => {
    section.querySelector(':scope > summary').addEventListener('click', () => {
      faqSections.forEach((otherSection) => {
        if (otherSection !== section && otherSection.open) {
          otherSection.open = false;
        }
      });
    });
  });
})();
