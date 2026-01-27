/* ====== BANK ACCOUNTS (edit these) ====== */
const BANKS = {
  NG: {
    name:  'The Olanike Omopariola Foundation',   // Nigeria account name
    number:'4011552272',                           // Nigeria account number
    bank:  'Fidelity Bank',                      // Nigeria bank name
    currency: 'NGN'
  },
  UK: {
    name:  'The Olanike Omopariola Foundation UK', // UK account name
    number:'00-00-00 / 00000000',                  // Sort code / Account number (placeholder)
    bank:  'Sample UK Bank',                       // UK bank name
    currency: 'GBP'
  }
};

/* ===== Header shadow + mobile menu ===== */
(() => {
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 8 ? '0 10px 28px rgba(0,0,0,.10)' : 'none';
    });
  }

  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('mobileMenu');
  const close  = document.querySelector('.menu-close');

  if (toggle && menu){
    const open = () => {
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded','true');
      menu.setAttribute('aria-hidden','false');
      document.body.classList.add('menu-open');
    };
    const shut = () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-hidden','true');
      document.body.classList.remove('menu-open');
    };
    toggle.addEventListener('click', open);
    close?.addEventListener('click', shut);
  }
})();

/* ===== Smooth, exact-height accordions (no footer jump) ===== */
function openWithMeasure(el){
  el.removeAttribute('hidden');
  el.style.transition = 'none';
  el.style.maxHeight = '0px';
  el.getBoundingClientRect(); // reflow
  el.style.transition = 'max-height .24s ease';
  el.style.maxHeight = el.scrollHeight + 'px';
}
function closeWithMeasure(el){
  el.style.transition = 'none';
  el.style.maxHeight = el.scrollHeight + 'px';
  el.getBoundingClientRect(); // reflow
  el.style.transition = 'max-height .24s ease';
  el.style.maxHeight = '0px';
}
function lockToContentAfterTransition(el, hiddenWhenClosed = false){
  const done = (e) => {
    if (e.propertyName !== 'max-height') return;
    const isClosed = parseFloat(getComputedStyle(el).maxHeight) === 0;
    if (isClosed){
      if (hiddenWhenClosed) el.setAttribute('hidden','');
      el.style.removeProperty('max-height');
    } else {
      el.style.maxHeight = 'none'; // let it grow naturally
    }
    el.style.removeProperty('transition');
    el.removeEventListener('transitionend', done);
  };
  el.addEventListener('transitionend', done);
}

/* ===== Donation accordion panels (Donation / Location / Payment) ===== */
(() => {
  document.querySelectorAll('.donate-form .panel').forEach(panel => {
    const head = panel.querySelector('.panel-head');
    const list = panel.querySelector('.tick-list');
    if (!head || !list) return;

    // Start collapsed
    head.setAttribute('aria-expanded', 'false');
    list.setAttribute('hidden','');
    list.style.maxHeight = '0px';
    list.style.overflow = 'hidden';

    const toggle = () => {
      const isOpen = head.getAttribute('aria-expanded') === 'true';
      if (isOpen){
        head.setAttribute('aria-expanded','false');
        closeWithMeasure(list);
        lockToContentAfterTransition(list, true);
      } else {
        head.setAttribute('aria-expanded','true');
        openWithMeasure(list);
        lockToContentAfterTransition(list);

        // Auto-select helpers on first open
        const hasPayment  = !!panel.querySelector('input[name="payment"]');
        const hasLocation = !!panel.querySelector('input[name="location"]');

        if (hasPayment){
          const already = !!document.querySelector('input[name="payment"]:checked');
          if (!already){
            const bank = panel.querySelector('input[name="payment"][value="Bank Transfer"]');
            if (bank && !bank.disabled){
              bank.checked = true;
              bank.dispatchEvent(new Event('change', { bubbles:true }));
            }
          }
        }
        if (hasLocation){
          const alreadyLoc = !!document.querySelector('input[name="location"]:checked');
          if (!alreadyLoc){
            const ng = panel.querySelector('input[name="location"][value="Nigeria"]');
            if (ng){
              ng.checked = true;
              ng.dispatchEvent(new Event('change', { bubbles:true }));
            }
          }
        }
      }
    };

    head.addEventListener('click', toggle);
    head.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
})();

/* ===== Sponsor sub-list: only the row-toggle opens/closes ===== */
(() => {
  const sponsorToggle = document.querySelector('.row-toggle');
  const subList = document.getElementById('sponsorSubList');
  if (!sponsorToggle || !subList) return;

  sponsorToggle.setAttribute('aria-expanded','false');
  subList.setAttribute('hidden','');
  subList.style.maxHeight = '0px';
  subList.style.overflow = 'hidden';

  const toggleSub = () => {
    const isOpen = sponsorToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen){
      sponsorToggle.setAttribute('aria-expanded','false');
      closeWithMeasure(subList); lockToContentAfterTransition(subList, true);
    } else {
      sponsorToggle.setAttribute('aria-expanded','true');
      openWithMeasure(subList); lockToContentAfterTransition(subList);
    }
  };

  sponsorToggle.addEventListener('click', (e) => { e.stopPropagation(); toggleSub(); });
  sponsorToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSub(); }
  });
  subList.addEventListener('click', (e) => e.stopPropagation());
})();

/* ===== Row selection: only labels toggle radios (prevents bubbling) ===== */
(() => {
  document.querySelectorAll('label.tick-row').forEach(label => {
    label.addEventListener('click', (e) => {
      if (label.closest('.is-disabled')) return;
      const input = label.querySelector('input[type="radio"]');
      if (input){
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles:true })); // keep button state in sync
      }
      e.stopPropagation();
    });
  });
})();

/* ===== Enable Donate only when donation + location + Bank Transfer chosen ===== */
(() => {
  const btn = document.getElementById('donateBtn');
  if (!btn) return;

  const updateButton = () => {
    const donationChosen = !!document.querySelector('input[name="donation"]:checked');
    const locationChosen = !!document.querySelector('input[name="location"]:checked');
    const bankChosen     = !!document.querySelector('input[name="payment"][value="Bank Transfer"]:checked');
    const ready = donationChosen && locationChosen && bankChosen;
    btn.disabled = !ready;
    btn.classList.toggle('is-enabled', ready);
  };

  document.addEventListener('change', e => {
    const t = e.target;
    if (t && (t.name === 'donation' || t.name === 'payment' || t.name === 'location')) updateButton();
  });

  // Initial state
  updateButton();
})();

/* ===== Hook Donate to Bank overlay + populate per Location ===== */
(() => {
  const btn      = document.getElementById('donateBtn');
  const overlay  = document.getElementById('bankOverlay');
  const closeBtn = overlay?.querySelector('.pop-close');

  // Popup fields
  const nameEl          = document.getElementById('acctName');
  const numEl           = document.getElementById('acctNumber');
  const bankEl          = document.getElementById('acctBank');
  const descStrong      = document.getElementById('bankDescription'); // bold line
  const transferDescEl  = document.getElementById('transferDesc');    // instruction line

  const getSelected = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || '';

  const pickBank = () => {
    const loc = getSelected('location').toLowerCase();
    return loc === 'uk' ? BANKS.UK : BANKS.NG; // default NG
  };

  const buildDesc = () => {
    const type = getSelected('donation') || 'Donation';
    const loc  = getSelected('location') || 'Nigeria';
    return `${type} — ${loc}`;
  };

  if (btn && overlay){
    btn.addEventListener('click', () => {
      if (btn.disabled) return;

      const bank = pickBank();
      if (nameEl) nameEl.textContent = bank.name || '—';
      if (numEl)  numEl.textContent  = bank.number || '—';
      if (bankEl) bankEl.textContent = bank.bank || '—';

      const desc = buildDesc();
      if (descStrong)     descStrong.textContent = desc;
      if (transferDescEl) transferDescEl.textContent = `Donation — ${desc}`;

      overlay.removeAttribute('hidden');
    });

    overlay.addEventListener('click', (e) => {
      // click outside closes
      if (e.target === overlay) overlay.setAttribute('hidden','');

      // copy buttons
      const c = e.target.closest('.copy');
      if (c){
        const sel = c.getAttribute('data-copy');
        const el  = sel ? overlay.querySelector(sel) : null;
        if (el){
          const text = el.textContent.trim();
          navigator.clipboard?.writeText(text).then(()=>{
            c.textContent = 'Copied';
            setTimeout(()=> (c.textContent = 'Copy'), 1200);
          });
        }
      }
    });

    closeBtn?.addEventListener('click', () => overlay.setAttribute('hidden',''));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) {
        overlay.setAttribute('hidden','');
      }
    });
  }
})();
