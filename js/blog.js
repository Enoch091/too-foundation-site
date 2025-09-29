/* Header shadow on scroll (same behavior as Impact) */
const header = document.getElementById('siteHeader');
addEventListener('scroll', () => {
  header.style.boxShadow = scrollY > 8 ? '0 10px 28px rgba(0,0,0,.10)' : 'none';
});

/* Mobile menu toggle */
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
  const closeMenuFn = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  };
  toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenuFn);
}

/* Progressive “Load More”: reveals .row.is-hidden (2 at a time) */
(() => {
  const btn = document.getElementById('loadMoreBtn');
  if (!btn) return;

  const hidden = () => Array.from(document.querySelectorAll('.blog-list .row.is-hidden'));
  const reveal = () => {
    const list = hidden().slice(0, 2);
    list.forEach(li => li.classList.remove('is-hidden'));
    if (!hidden().length) btn.remove(); // no more rows
  };

  btn.addEventListener('click', reveal);
})();
