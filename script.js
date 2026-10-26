(() => {
  const preloader = document.getElementById('preloader');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loaderStartedAt = Date.now();
  let loaderHidden = false;
  const hideLoader = () => {
    if (preloader && !loaderHidden) {
      loaderHidden = true;
      preloader.classList.add('is-hidden');
    }
  };
  const revealAfterMinimumTime = () => {
    const minimumVisibleMs = reduceMotion ? 900 : 2800;
    const remaining = Math.max(0, minimumVisibleMs - (Date.now() - loaderStartedAt));
    window.setTimeout(hideLoader, remaining);
  };
  window.addEventListener('load', revealAfterMinimumTime, { once: true });
  // Fallback for slow or interrupted resource loading.
  window.setTimeout(hideLoader, 6500);

  // Countdown to 1 February 2027, midnight in Yamal (UTC+5).
  const target = Date.parse('2027-01-31T19:00:00Z');
  const ids = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };
  const pad = (n, len = 2) => String(n).padStart(len, '0');
  function updateTimer() {
    const diff = Math.max(0, target - Date.now());
    const total = Math.floor(diff / 1000);
    if (ids.days) ids.days.textContent = pad(Math.floor(total / 86400), 3);
    if (ids.hours) ids.hours.textContent = pad(Math.floor(total % 86400 / 3600));
    if (ids.minutes) ids.minutes.textContent = pad(Math.floor(total % 3600 / 60));
    if (ids.seconds) ids.seconds.textContent = pad(total % 60);
  }
  updateTimer();
  window.setInterval(updateTimer, 1000);

  // Scroll reveals and the route progress line.
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
    const line = document.querySelector('.route-line');
    if (line) {
      const lineObserver = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          line.classList.add('is-visible');
          lineObserver.disconnect();
        }
      }, { threshold: 0.25 });
      lineObserver.observe(line);
    }
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
    document.querySelector('.route-line')?.classList.add('is-visible');
  }

  // Gentle pointer parallax on decorative objects, disabled for touch and reduced motion.
  if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    const floats = document.querySelectorAll('[data-float]');
    window.addEventListener('pointermove', e => {
      const x = (e.clientX / window.innerWidth - .5);
      const y = (e.clientY / window.innerHeight - .5);
      floats.forEach((el, i) => {
        const factor = (i % 2 ? -1 : 1) * 8;
        el.style.translate = `${x * factor}px ${y * factor}px`;
      });
    }, { passive: true });
  }

  // Compact mobile navigation.
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.main-nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  }
})();
