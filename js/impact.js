/* Header shadow on scroll + mobile menu body lock */
const header = document.getElementById('siteHeader');
addEventListener('scroll', () => {
  header.style.boxShadow = scrollY > 8 ? '0 10px 28px rgba(0,0,0,.10)' : 'none';
});

// Mobile menu
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#mobileMenu');
const closeBtn = document.querySelector('.menu-close');
if (toggle && menu){
  const openMenu = () => {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  };
  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };
  toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
}

/* Stats count-up (supports data-count with optional '+') */
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nums = document.querySelectorAll('.stat .num');
  if (!nums.length) return;

  const animate = (el) => {
    const raw = (el.getAttribute('data-count') || '0').trim();
    const plus = raw.endsWith('+');
    const target = parseInt(raw.replace(/\D+/g, ''), 10) || 0;

    if (prefersReduced || target === 0){
      el.textContent = raw; // respect reduced motion or zero
      return;
    }

    let cur = 0;
    const steps = Math.max(40, Math.min(90, Math.round(target / 3))); // smooth ramp
    const tick = () => {
      cur += Math.ceil(target / steps);
      if (cur >= target){
        el.textContent = target + (plus ? '+' : '');
      } else {
        el.textContent = cur;
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        animate(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });

  nums.forEach(n => io.observe(n));
})();

/* Testimonials: one at a time, 7 total, loops 7→1 */
(function(){
  const quotes = [
    { q: "I thought I was invisible. This Foundation saw me.", a: "Survivor, 2023" },
    { q: "They didn’t just teach; they listened—I found my voice.", a: "Student, 2024" },
    { q: "Volunteering here turned my free time into purpose.", a: "Volunteer, 2024" },
    { q: "Our clinic day changed how girls talk about health.", a: "Community Nurse, 2023" },
    { q: "My daughter reads to her brothers every night now.", a: "Parent, 2024" },
    { q: "The workshops helped me start a business with confidence.", a: "Beneficiary, 2024" },
    { q: "Partnering with the Foundation transformed our school culture.", a: "Head Teacher, 2023" }
  ];

  const viewport = document.querySelector('.testi-viewport');
  const quoteEl = document.querySelector('.testi-quote');
  const authorEl = document.querySelector('.testi-author');
  const prevBtn = document.querySelector('.testi-nav.prev');
  const nextBtn = document.querySelector('.testi-nav.next');
  if (!viewport || !quoteEl || !authorEl || !prevBtn || !nextBtn) return;

  let i = 0;
  const render = () => {
    const item = quotes[i];
    quoteEl.textContent = `“${item.q}”`;
    authorEl.textContent = item.a;
  };
  const step = (dir) => {
    i = (i + dir + quotes.length) % quotes.length;
    render();
  };

  render();
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));

  // keyboard support
  prevBtn.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' ') step(-1); });
  nextBtn.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' ') step(1); });
})();

/* Optional: smooth-scroll offset is handled by CSS scroll-margin-top */




// Equalize both CTA buttons to the green button's rendered width (desktop)
(function equalizeCTAWidths(){
  const group = document.querySelector('.cta-buttons[data-equalize="cta"]');
  if (!group) return;

  const setWidth = () => {
    // if we're on mobile (stacked), just let CSS use 100% width
    if (window.matchMedia('(max-width: 480px)').matches){
      group.style.removeProperty('--cta-w');
      return;
    }
    const green = group.querySelector('.cta-pill.btn-green');
    if (!green) return;
    const w = Math.ceil(green.getBoundingClientRect().width);
    group.style.setProperty('--cta-w', w + 'px');
  };

  window.addEventListener('load', setWidth);
  window.addEventListener('resize', setWidth);
})();
