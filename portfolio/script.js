document.addEventListener('DOMContentLoaded', () => {
  const yearTarget = document.querySelector('[data-year]');

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  if (window.gsap) {
    const heroTimeline = window.gsap.timeline();

    heroTimeline
      .from('.hero-label', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power2.out'
      })
      .from('.name-line', {
        opacity: 0,
        y: 32,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out'
      }, '-=0.35')
      .from('.role-line', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out'
      }, '-=0.55')
      .from('.hero-description', {
        opacity: 0,
        y: 22,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.45')
      .from('.cta-row .btn', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out'
      }, '-=0.28');
  }

  if (window.gsap && window.ScrollTrigger) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
      const journeySection = document.querySelector('#journey');
      const lineProgress = document.querySelector('.line-progress');

      if (journeySection && lineProgress) {
        const ctx = gsap.context(() => {
          const markers = document.querySelectorAll('.marker');
          const pathLength = lineProgress.getTotalLength();

          gsap.set(lineProgress, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
          });

          markers.forEach((m) => {
            const content = m.querySelector('.marker-content');

            gsap.set(content, { opacity: 0, y: 24 });

            ScrollTrigger.create({
              trigger: m,
              start: 'top 72%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
              onEnter: () => {
                m.classList.add('is-active');
                gsap.to(content, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
              },
              onLeave: () => {
                m.classList.remove('is-active');
                gsap.to(content, { opacity: 0, y: 24, duration: 0.4, ease: 'power2.in' });
              },
              onEnterBack: () => {
                m.classList.add('is-active');
                gsap.to(content, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
              },
              onLeaveBack: () => {
                m.classList.remove('is-active');
                gsap.to(content, { opacity: 0, y: 24, duration: 0.4, ease: 'power2.in' });
              }
            });
          });

          ScrollTrigger.create({
            trigger: journeySection,
            start: 'top center',
            end: () => `+=${Math.max(journeySection.offsetWidth, 800)}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const offset = pathLength * (1 - progress);
              gsap.set(lineProgress, { strokeDashoffset: offset });
            }
          });

          gsap.from('.marker-dot', {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.6)',
            stagger: 0.15,
            scrollTrigger: {
              trigger: journeySection,
              start: 'top 80%',
              end: 'top 60%',
              toggleActions: 'play none none reverse'
            }
          });
        }, journeySection);
      }
    }
  }

  const loadThreeScene = async () => {
    try {
      const { initThreeScene } = await import('./js/three-scene.js');
      initThreeScene();
    } catch (error) {
      console.warn('Three.js scene skipped because the module could not be loaded.', error);
    }
  };

  loadThreeScene();
});