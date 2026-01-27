// Header shadow on scroll
const header = document.getElementById('siteHeader');
addEventListener('scroll', () => {
  header.style.boxShadow = scrollY > 8 ? '0 10px 28px rgba(0,0,0,.10)' : 'none';
});

// Mobile menu overlay
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.mobile-menu');
const closeBtn = document.querySelector('.menu-close');
if (toggle){
  toggle.addEventListener('click', () => {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  });
}
if (closeBtn){
  closeBtn.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  });
}

// Hero slideshow (5s)
const slides = document.querySelectorAll('.slide');
let idx = 0;
function show(n){ slides.forEach((s,i)=> s.classList.toggle('active', i===n)); }
if (slides.length){ show(idx); setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 5000); }

// Count-up stats when visible
const nums = document.querySelectorAll('.stat .num');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const el = entry.target;
      const target = +el.dataset.count;
      const hadPlus = el.querySelector('.plus') !== null || el.textContent.trim().endsWith('+');
      let current = 0;
      const step = Math.max(1, Math.round(target / 60));
      const render = (value) => {
        if (hadPlus) {
          el.innerHTML = value + '<span class="plus">+</span>';
        } else {
          el.textContent = value;
        }
      };
      const tick = () => {
        current += step;
        if (current >= target){
          render(target);
        } else {
          render(current);
          requestAnimationFrame(tick);
        }
      };
      tick();
      obs.unobserve(el);
    }
  });
},{threshold:0.4});
nums.forEach(n => observer.observe(n));

// “More Events” inline reveal (adds one row)
const moreBtn = document.querySelector('.more-events');
if (moreBtn){
  const target = document.querySelector(moreBtn.getAttribute('data-more-target'));
  moreBtn.addEventListener('click', ()=>{
    target.classList.toggle('hidden');
    moreBtn.textContent = target.classList.contains('hidden') ? 'More Events' : 'Hide Events';
  });
}

// Optional: subtle reveal for team cards
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.member');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform='translateY(0)'; io.unobserve(e.target); } });
  }, { threshold:0.12 });
  cards.forEach(c => {
    c.style.opacity = 0; c.style.transform = 'translateY(12px)'; c.style.transition = 'opacity .4s ease, transform .4s ease';
    io.observe(c);
  });
});


