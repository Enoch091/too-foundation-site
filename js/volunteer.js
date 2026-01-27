/* ===== Header shadow + mobile menu ===== */
(() => {
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (header) header.style.boxShadow = window.scrollY > 8 ? '0 10px 28px rgba(0,0,0,.10)' : 'none';
  });

  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('mobileMenu');
  const close  = document.querySelector('.menu-close');
  if (toggle && menu){
    const open = () => { menu.classList.add('open'); toggle.setAttribute('aria-expanded','true'); menu.setAttribute('aria-hidden','false'); document.body.classList.add('menu-open'); };
    const shut = () => { menu.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); menu.setAttribute('aria-hidden','true'); document.body.classList.remove('menu-open'); };
    toggle.addEventListener('click', open);
    close?.addEventListener('click', shut);
  }
})();

/* ===== Testimonials (unchanged logic) ===== */
(() => {
  const quotes = [
    { q: "I thought I was invisible. This Foundation saw me.", a: "Survivor, 2023" },
    { q: "Volunteering turned free time into purpose for me.", a: "Volunteer, 2024" },
    { q: "Workshops helped me mentor girls with confidence.", a: "Facilitator, 2024" },
    { q: "I stayed because I found where I belong.", a: "Volunteer, 2024" },
    { q: "Our school culture changed after their outreach.", a: "Head Teacher, 2023" }
  ];
  const quoteEl = document.querySelector('.testi-quote');
  const authorEl = document.querySelector('.testi-author');
  const prevBtn  = document.querySelector('.testi-nav.prev');
  const nextBtn  = document.querySelector('.testi-nav.next');
  if (!quoteEl || !authorEl || !prevBtn || !nextBtn) return;

  let i = 0;
  const render = () => { const t = quotes[i]; quoteEl.textContent = `“${t.q}”`; authorEl.textContent = t.a; };
  const step   = dir => { i = (i + dir + quotes.length) % quotes.length; render(); };

  render();
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  prevBtn.addEventListener('keydown', e => { if (e.key==='Enter' || e.key===' ') step(-1); });
  nextBtn.addEventListener('keydown', e => { if (e.key==='Enter' || e.key===' ') step(1); });
})();

/* ===== Volunteer form — single, final handler (strict overlay control) ===== */
(() => {
  const form    = document.getElementById('volunteerForm');
  const overlay = document.getElementById('thanksOverlay');
  const btn     = document.getElementById('submitBtn');
  if (!form || !btn) return;

  // Overlay must start hidden and only show on success
  overlay?.setAttribute('hidden','');
  overlay?.addEventListener('click', e => { if (e.target === overlay) overlay.setAttribute('hidden',''); });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay && !overlay.hasAttribute('hidden')) overlay.setAttribute('hidden','');
  });

  // Custom rules not covered by native validity
  const hasInterests    = () => form.querySelectorAll('input[name="interests"]:checked').length > 0;
  const hasAvailability = () => !!form.querySelector('input[name="availability"]:checked');
  const consentEl       = form.querySelector('#consent');

  const interestsHelp    = document.getElementById('interestsHelp');
  const availabilityHelp = document.getElementById('availabilityHelp');
  const formHelp         = document.getElementById('formHelp');

  // Enable button only when ALL requirements pass
  const syncBtn = () => {
    const nativeOK = form.checkValidity(); // fullName, email, phone pattern, why, consent
    btn.disabled = !(nativeOK && hasInterests() && hasAvailability());
  };
  form.addEventListener('input',  syncBtn);
  form.addEventListener('change', syncBtn);
  syncBtn(); // initial

  // Submit → Netlify (no page reload)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear inline messages
    if (interestsHelp)    interestsHelp.textContent = '';
    if (availabilityHelp) availabilityHelp.textContent = '';
    if (formHelp)         formHelp.textContent = '';

    // Custom guards
    let bad = false;
    if (!hasInterests())    { if (interestsHelp)    interestsHelp.textContent    = 'Select at least one area of interest.'; bad = true; }
    if (!hasAvailability()) { if (availabilityHelp) availabilityHelp.textContent = 'Select your availability.';             bad = true; }
    if (!consentEl?.checked){ if (formHelp)         formHelp.textContent         = 'Please agree to be contacted.';         bad = true; }

    // Native validity (names, email, phone pattern, why, consent attr)
    if (!form.checkValidity()) { form.reportValidity?.(); bad = true; }

    syncBtn();
    if (bad || btn.disabled) return; // do not show overlay or submit

    btn.disabled = true;

    // Netlify needs hidden 'form-name'
    const fd = new FormData(form);
    if (!fd.get('form-name')) fd.append('form-name', form.getAttribute('name') || 'volunteer');

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fd).toString()
      });

      form.reset();
      syncBtn();

      // Show thank-you overlay ONLY after success
      overlay?.removeAttribute('hidden');
      setTimeout(() => overlay?.setAttribute('hidden',''), 2600);
    } catch (err) {
      alert('Sorry—something went wrong. Please try again.');
    } finally {
      btn.disabled = false;
    }
  });
})();
