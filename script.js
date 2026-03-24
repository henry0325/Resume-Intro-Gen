(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const progressBars = Array.from(document.querySelectorAll('.progress > span'));
  const indicators = Array.from(document.querySelectorAll('.page-indicator'));
  const zhBtns = Array.from(document.querySelectorAll('[data-lang-btn="zh"]'));
  const enBtns = Array.from(document.querySelectorAll('[data-lang-btn="en"]'));
  let index = 0;
  let lang = 'zh';

  const isMobileMode = () =>
    window.matchMedia('(max-width: 980px)').matches ||
    window.matchMedia('(pointer: coarse)').matches;

  function applyLang() {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
      el.innerHTML = el.dataset[lang];
    });
    zhBtns.forEach(b => b.classList.toggle('active', lang === 'zh'));
    enBtns.forEach(b => b.classList.toggle('active', lang === 'en'));
  }

  function render() {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    const ratio = ((index + 1) / slides.length) * 100;
    progressBars.forEach(p => p.style.width = `${ratio}%`);
    indicators.forEach(p => p.textContent = `${index + 1} / ${slides.length}`);
    const activeMain = slides[index]?.querySelector('.main');
    if (activeMain) activeMain.scrollTop = 0;
  }

  function next() {
    if (index < slides.length - 1) {
      index++;
      render();
    }
  }

  function prev() {
    if (index > 0) {
      index--;
      render();
    }
  }

  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('[data-lang-btn]');
    if (langBtn) {
      lang = langBtn.dataset.langBtn;
      applyLang();
      return;
    }

    const nextBtn = e.target.closest('[data-next]');
    if (nextBtn) {
      e.preventDefault();
      next();
      return;
    }

    const prevBtn = e.target.closest('[data-prev]');
    if (prevBtn) {
      e.preventDefault();
      prev();
      return;
    }

    const activeSlide = slides[index];
    if (!activeSlide) return;

    if (!isMobileMode()) {
      const clickedInteractive = e.target.closest('button,a,input,textarea,select,label,[role="button"],[data-lang-btn],[data-prev],[data-next]');
      const selectedText = window.getSelection && String(window.getSelection()).trim().length > 0;
      if (!clickedInteractive && !selectedText) {
        next();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault();
      next();
    }
    if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) {
      e.preventDefault();
      prev();
    }
    if (e.key.toLowerCase() === 'h') {
      lang = 'zh';
      applyLang();
    }
    if (e.key.toLowerCase() === 'e') {
      lang = 'en';
      applyLang();
    }
  });

  let touchStartX = null;
  let touchStartY = null;

  document.addEventListener('touchstart', e => {
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (touchStartX === null || touchStartY === null) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (isMobileMode()) {
      if (absX > 72 && absX > absY * 1.35) {
        dx < 0 ? next() : prev();
      }
    } else {
      if (absX > 48 && absX > absY) dx < 0 ? next() : prev();
      if (absY > 54 && absY > absX) dy < 0 ? next() : prev();
    }

    touchStartX = null;
    touchStartY = null;
  }, { passive: true });

  applyLang();
  render();
})();



