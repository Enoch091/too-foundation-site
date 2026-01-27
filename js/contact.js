/* ===== Mobile menu ===== */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.mobile-menu');
  const close  = document.querySelector('.menu-close');
  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
    menu.setAttribute('aria-hidden','false');
  };
  const shut = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-hidden','true');
  };

  toggle.addEventListener('click', open);
  close?.addEventListener('click', shut);
})();

/* ===== Contact form — single, final handler ===== */
(() => {
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('sendBtn');
  const note = document.getElementById('formNote');
  if (!form || !btn) return;

  // Field decoration helpers (optional visual feedback)
  const fields = Array.from(form.querySelectorAll('input, textarea'));
  const email  = form.querySelector('#email');
  const emailOK = (v) => /\S+@\S+\.\S+/.test(v);

  const setError = (el, msg) => {
    const w = el.closest('.field');
    w?.classList.add('is-error');
    w?.classList.remove('is-valid');
    el.setAttribute('aria-invalid','true');
    const err = w?.querySelector('.err'); if (err) err.textContent = msg || '';
  };
  const setValid = (el) => {
    const w = el.closest('.field');
    w?.classList.remove('is-error');
    w?.classList.add('is-valid');
    el.removeAttribute('aria-invalid');
    const err = w?.querySelector('.err'); if (err) err.textContent = '';
  };
  const clearDecor = (el) => {
    const w = el.closest('.field');
    w?.classList.remove('is-error','is-valid');
    el.removeAttribute('aria-invalid');
    const err = w?.querySelector('.err'); if (err) err.textContent = '';
  };

  // Enable button only when native validity passes
  const syncBtn = () => { btn.disabled = !form.checkValidity(); };

  // Live decoration (green when ok, red only for bad email while typing)
  form.addEventListener('input', () => {
    fields.forEach(el => {
      const v = (el.value || '').trim();
      if (!v) { clearDecor(el); return; }
      if (el === email && !emailOK(v)) { setError(el, 'Please enter a valid email address.'); return; }
      setValid(el);
    });
    syncBtn();
  });

  // Initial state
  fields.forEach(clearDecor);
  syncBtn();

  // Submit → Netlify (no page reload)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) { form.reportValidity?.(); return; }
    btn.disabled = true;
    if (note) note.textContent = 'Sending…';

    // Netlify requires the hidden 'form-name'
    const fd = new FormData(form);
    if (!fd.get('form-name')) fd.append('form-name', form.getAttribute('name') || 'contact');

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fd).toString()
      });

      form.reset();
      fields.forEach(clearDecor);
      syncBtn();
      if (note) note.textContent = 'Thanks! Your message has been sent.';
      else alert('Thanks! Your message has been sent.');
    } catch (err) {
      if (note) note.textContent = 'Sorry—something went wrong. Please try again.';
      else alert('Sorry—something went wrong. Please try again.');
    } finally {
      btn.disabled = false;
    }
  });
})();
