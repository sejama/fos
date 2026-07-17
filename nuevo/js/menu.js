document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.setAttribute('aria-controls', 'siteNav');

  const updateMenuState = (isOpen) => {
    navLinks.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    updateMenuState(!isOpen);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      updateMenuState(false);
    }
  });

  updateMenuState(false);
});
