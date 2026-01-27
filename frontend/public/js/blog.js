// Blog page JavaScript
(function() {
  'use strict';

  // Mobile menu toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.querySelector('.menu-close');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.setAttribute('aria-hidden', isExpanded);
      mobileMenu.classList.toggle('open');
    });
  }

  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', function() {
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenu.classList.remove('open');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Close mobile menu when clicking outside
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function(e) {
      if (e.target === mobileMenu) {
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.classList.remove('open');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Sticky header on scroll
  const siteHeader = document.getElementById('siteHeader');
  let lastScrollY = window.scrollY;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    
    if (siteHeader) {
      if (currentScrollY > 100) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
    
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Run once on load
  handleScroll();

})();
