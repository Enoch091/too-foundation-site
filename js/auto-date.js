                                                                                                                                                                                                                                                                          // Auto-update copyright year in footer
(function() {
  const currentYear = new Date().getFullYear();
  const copyrightElements = document.querySelectorAll('.foot-bottom');
  
  copyrightElements.forEach(el => {
    if (el.textContent.includes('©')) {
      el.textContent = `© ${currentYear} The Olanike Omopariola Foundation. All rights reserved.`;
    }
  });
})();
