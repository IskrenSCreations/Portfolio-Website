document.addEventListener('DOMContentLoaded', () => {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      console.log(`Element: ${entry.target.id || entry.target.className}`);
      console.log(`Is intersecting: ${entry.isIntersecting}`);
      console.log(`Delay: ${entry.target.dataset.delay || 'none'}`);

      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay;
        if (delay) {
          entry.target.style.transitionDelay = `${delay}s`;
          console.log(`Applying delay: ${delay}s`);
        }

        entry.target.classList.add('appear');
        console.log('Added "appear" class');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const fadeElements = document.querySelectorAll('.fade-in');
  console.log(`Found ${fadeElements.length} fade-in elements`);

  fadeElements.forEach(element => {
    observer.observe(element);
  });



  let timeout;
  window.addEventListener('scroll', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
          });
        });
      });
    }, 100);
  });

  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  if (btn) {
    const saved = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (systemPrefersDark ? '' : 'neon');

    root.setAttribute('data-theme', initial);
    if (initial === 'neon') btn.setAttribute('aria-pressed', 'true');

    btn.addEventListener('click', () => {
      const isNeon = root.getAttribute('data-theme') === 'neon';
      const next = isNeon ? '' : 'neon';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next === 'neon' ? 'neon' : 'dark');
      btn.setAttribute('aria-pressed', next === 'neon');
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.scrolling-text-container');
  const textElement = document.querySelector('.scrolling-text');
  const SCROLL_SPEED = 70;


  const originalItems = Array.from(textElement.children);
  const itemCount = originalItems.length;

 
  let animationId = null;
  let startTime = null;
  let currentPosition = 0;
  let setWidth = 0;

 
  function initAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    textElement.innerHTML = '';
    originalItems.forEach(item => {
      textElement.appendChild(item.cloneNode(true));
    });

    const firstSet = Array.from(textElement.children).slice(0, itemCount / 4);
    setWidth = firstSet.reduce((total, item) => {
      return total + item.offsetWidth + parseInt(getComputedStyle(item).marginRight);
    }, 0);

    startTime = null;
    currentPosition = 0;
    animationId = requestAnimationFrame(animateScroll);
  }

  function animateScroll(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = (timestamp - startTime) / 1000;

    currentPosition = elapsed * SCROLL_SPEED;


    if (currentPosition >= setWidth) {
      startTime = timestamp;
      currentPosition = 0;
    }

    textElement.style.transform = `translateX(-${currentPosition}px)`;

    animationId = requestAnimationFrame(animateScroll);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initAnimation, 100);
  });

  initAnimation();
});