/* ---------- Mobile menu overlay (reuse pattern) ---------- */
(() => {
  const toggle   = document.querySelector('.nav-toggle');
  const menu     = document.getElementById('mobileMenu');
  const closeBtn = menu?.querySelector('.menu-close');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  });
  closeBtn?.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  });
})();

/* ---------- FAQ accordion (collapsed by default) ---------- */
(() => {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.acc-btn');
    const panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;

    // ensure collapsed by default
    btn.setAttribute('aria-expanded', 'false');
    panel.hidden = true;

    const toggle = () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
      // maintain hash when opening (nice for sharing)
      if (!open) history.replaceState(null, '', `#${item.id}`);
    };

    btn.addEventListener('click', toggle);
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  // Deep-link: open the panel if the hash matches an item id
  const openFromHash = () => {
    const id = (location.hash || '').replace('#','');
    if (!id) return;
    const item  = document.getElementById(id);
    const btn   = item?.querySelector('.acc-btn');
    const panel = item?.querySelector('.faq-a');
    if (btn && panel) {
      btn.setAttribute('aria-expanded','true');
      panel.hidden = false;
      // scroll into view with header offset
      const y = item.getBoundingClientRect().top + window.scrollY -  (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 134) - 24;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
