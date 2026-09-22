(function () {
  if (!window.gsap) {
    return;
  }

  const hero = document.querySelector('.hero');
  if (!hero) {
    return;
  }

  window.gsap.from('.hero-visual', {
    opacity: 0,
    scale: 0.92,
    duration: 1,
    ease: 'power2.out'
  });
})();
