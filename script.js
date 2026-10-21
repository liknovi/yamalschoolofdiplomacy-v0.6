const target = new Date('2027-02-01T00:00:00+05:00').getTime();
function updateCountdown(){
 const diff=Math.max(0,target-Date.now());
 const values={days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),minutes:Math.floor(diff%3600000/60000),seconds:Math.floor(diff%60000/1000)};
 for(const [id,val] of Object.entries(values)){const el=document.getElementById(id);if(el)el.textContent=id==='days'?String(val).padStart(3,'0'):String(val).padStart(2,'0');}
}
updateCountdown();setInterval(updateCountdown,1000);

// ЛОГОТИП ПРОЕКТА ПОКАЗЫВАЕТСЯ В ЗАГРУЗОЧНОМ ОКНЕ РОВНО 3 СЕКУНДЫ.
const preloader = document.getElementById('preloader');
if (preloader) {
  const hidePreloader = () => window.setTimeout(() => preloader.classList.add('is-hidden'), 3000);
  if (document.readyState === 'complete') hidePreloader();
  else window.addEventListener('load', hidePreloader, { once: true });
}

// ПЛАВНОЕ ПОЯВЛЕНИЕ БЛОКОВ ПРИ ПРОКРУТКЕ.
const revealTargets = document.querySelectorAll('.about-layout, .stat, .project-details, .step, .who-layout, .quote-band, .finale h2, .finale > p, .sponsor, .social-button');
revealTargets.forEach((el, index) => {
  el.classList.add('js-reveal');
  el.style.transitionDelay = `${(index % 4) * 70}ms`;
});
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}
