/* ===== Header shadow + mobile menu (same pattern as your other pages) ===== */
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

/* ===== Donate interactions: only Bank Transfer is active; popup on Donate ===== */
(() => {
  // ⬇️ FILL THESE WITH YOUR REAL DETAILS
  const BANK = {
    name:  'The Olanike Omopariola Foundation',
    number:'0000000000',
    bank:  'Sample Bank PLC'
  };

  const form      = document.getElementById('donateForm');
  const donateBtn = document.getElementById('donateBtn');

  const overlay   = document.getElementById('bankOverlay');
  const closeBtn  = overlay?.querySelector('.pop-close');

  const nameEl    = document.getElementById('acctName');
  const numEl     = document.getElementById('acctNumber');
  const bankEl    = document.getElementById('acctBank');
  const descEl    = document.getElementById('transferDesc');

  // Ensure overlay is hidden and lives under <body>
  document.addEventListener('DOMContentLoaded', () => {
    if (overlay){
      overlay.setAttribute('hidden','');
      if (overlay.parentElement !== document.body) document.body.appendChild(overlay);
    }
  });

  const selected = (name) => form.querySelector(`input[name="${name}"]:checked`);
  const selectedAll = (name) => Array.from(form.querySelectorAll(`input[name="${name}"]:checked`));

  const updateDonateState = () => {
    const type = selected('donationType');
    const pay  = selected('paymentType');
    const ok = !!type && !!pay && pay.value === 'Bank Transfer';
    donateBtn.disabled = !ok;
  };

  form.addEventListener('change', updateDonateState);
  updateDonateState();

  // Prevent clicks on disabled chips from toggling anything (safety)
  form.querySelectorAll('.chip.disabled').forEach(c => {
    c.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); }, true);
  });

  // Copy buttons in popup
  overlay?.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy');
    if (!btn) return;
    const sel = btn.getAttribute('data-copy');
    const el = sel ? overlay.querySelector(sel) : null;
    if (!el) return;
    const text = el.textContent.trim();
    navigator.clipboard?.writeText(text).then(()=> {
      btn.textContent = 'Copied';
      setTimeout(()=> btn.textContent = 'Copy', 1200);
    }).catch(()=>{ /* ignore */ });
  });

  const openPopup = (desc) => {
    nameEl.textContent = BANK.name;
    numEl.textContent  = BANK.number;
    bankEl.textContent = BANK.bank;
    descEl.textContent = desc;
    overlay.removeAttribute('hidden');
  };
  const closePopup = () => overlay.setAttribute('hidden','');

  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });
  closeBtn?.addEventListener('click', closePopup);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closePopup(); });

  // Build description string from selections
  const buildDescription = () => {
    const type = selected('donationType')?.value || 'One-time';
    const projs = selectedAll('projects').map(p => p.value);
    // Examples: "One-time — Sponsor a Student" or "Monthly — Sponsor a Student, Provide Learning Materials"
    const tail = projs.length ? ` — ${projs.join(', ')}` : '';
    return `${type}${tail}`;
  };

  donateBtn.addEventListener('click', () => {
    // Guard: only proceed when enabled (should already be enforced by disabled state)
    if (donateBtn.disabled) return;

    const desc = buildDescription();
    openPopup(desc);
  });
})();

// donate-accordion-and-cta.js
(() => {
  const btn = document.getElementById('donateBtn');

  /* --- Panel accordions start collapsed --- */
  document.querySelectorAll('.panel-head').forEach(head => {
    // ensure collapsed on load
    head.setAttribute('aria-expanded','false');

    const toggle = () => {
      const open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', open ? 'false' : 'true');
    };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* --- Sponsor sub-list toggle --- */
  const sponsorToggle = document.querySelector('.row-toggle');
  const subList = document.getElementById('sponsorSubList');
  if (sponsorToggle && subList){
    const toggleSub = () => {
      const open = sponsorToggle.getAttribute('aria-expanded') === 'true';
      sponsorToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      subList.classList.toggle('show', !open);
    };
    // keep semantic hidden for AT but allow animation
    const syncHidden = () => subList.toggleAttribute('hidden', !subList.classList.contains('show'));
    sponsorToggle.addEventListener('click', () => { toggleSub(); syncHidden(); });
    sponsorToggle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSub(); syncHidden(); }
    });
    // start closed
    sponsorToggle.setAttribute('aria-expanded','false');
    subList.classList.remove('show'); subList.setAttribute('hidden','');
  }

  /* --- Row click selects its radio (unless disabled) --- */
  document.querySelectorAll('.tick-row').forEach(row => {
    row.addEventListener('click', () => {
      if (row.closest('.is-disabled')) return;
      const input = row.querySelector('input[type="radio"]');
      if (input){ input.checked = true; updateButton(); }
    });
  });

  /* --- Enable Donate only when donation + Bank Transfer chosen --- */
  const updateButton = () => {
    const donationChosen = !!document.querySelector('input[name="donation"]:checked');
    const bankChosen = !!document.querySelector('input[name="payment"][value="Bank Transfer"]:checked');
    const ready = donationChosen && bankChosen;
    btn.disabled = !ready;
    btn.classList.toggle('is-enabled', ready);
  };
  document.addEventListener('change', e => {
    if (e.target && (e.target.name === 'donation' || e.target.name === 'payment')) updateButton();
  });
  updateButton();

  /* --- Hook Donate to your existing popup --- */
  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    const chosen = document.querySelector('input[name="donation"]:checked')?.value || 'Donation';
    // If your popup uses these IDs, set the description; otherwise it’s a no-op.
    const overlay = document.getElementById('bankOverlay');
    const desc    = document.getElementById('bankDescription');
    if (desc) desc.textContent = chosen;
    overlay?.removeAttribute('hidden');
  });
})();
