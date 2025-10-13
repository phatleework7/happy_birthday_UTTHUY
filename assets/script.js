(function () {
  'use strict';

  // Tuổi/năm sinh không còn hiển thị -> bỏ tính toán

  function applyURLCustomizations() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const from = params.get('from');
    if (name) {
      const honorific = document.getElementById('honorific');
      if (honorific) honorific.textContent = name;
      document.title = `Chúc mừng sinh nhật ${name}`;
    }
    if (from) {
      const fromEl = document.getElementById('fromName');
      if (fromEl) fromEl.textContent = from;
    }
  }

  function setupReveal() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createConfettiBurst(originX) {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = prefersReduce ? 40 : 120;
    const colors = ['#f3d68a', '#c6a132', '#ffffff', '#c9ccd3', '#a8adb7'];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = rand(6, 10);
      piece.style.width = `${size}px`;
      piece.style.height = `${size * 1.6}px`;
      piece.style.left = `${originX + rand(-120, 120)}px`;
      piece.style.background = colors[Math.floor(rand(0, colors.length))];
      const duration = rand(2.6, 4.2);
      piece.style.setProperty('--x', `${rand(-40, 40)}vw`);
      // Ghi đè animation để hoạt động ngay cả khi Reduce Motion bật
      piece.style.animation = `confetti-fall ${duration}s linear forwards`;
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 4500);
    }
  }

  function setupConfetti() {
    // Bắn pháo giấy tự động khi vào trang
    window.requestAnimationFrame(() => {
      setTimeout(() => createConfettiBurst(window.innerWidth / 2), 350);
      setTimeout(() => createConfettiBurst(window.innerWidth * 0.25), 600);
      setTimeout(() => createConfettiBurst(window.innerWidth * 0.75), 900);
    });
  }

  function setupImagesFallback() {
    const figures = document.querySelectorAll('.gallery .shot');
    figures.forEach(fig => {
      const img = fig.querySelector('img');
      if (!img) return;
      img.addEventListener('error', () => {
        fig.classList.add('placeholder');
        img.style.display = 'none';
      }, { once: true });
    });
  }

  function setupHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    if (!slides.length) return;
    let index = 0;
    const apply = () => {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
    };
    apply();
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    if (prevBtn) prevBtn.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; apply(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { index = (index + 1) % slides.length; apply(); });
  }

  function setupGalleryToggle() {
    const container = document.querySelector('#gallery');
    if (!container) return;
    const buttons = container.querySelectorAll('.seg-btn');
    const sets = container.querySelectorAll('.gallery-set');
    const activate = (target) => {
      sets.forEach(s => s.classList.toggle('active', s.getAttribute('data-set') === target));
      buttons.forEach(b => b.classList.toggle('is-active', b.getAttribute('data-target') === target));
      buttons.forEach(b => b.setAttribute('aria-selected', b.classList.contains('is-active') ? 'true' : 'false'));
    };
    buttons.forEach(btn => {
      btn.addEventListener('click', () => activate(btn.getAttribute('data-target')));
    });
    // mặc định chọn gia đình
    activate('family');
  }

  function setupAudio() {
    const audio = document.getElementById('bgm');
    const btn = document.getElementById('audioBtn');
    if (!audio || !btn) return;
    let available = false;
    audio.addEventListener('canplay', () => {
      available = true; btn.hidden = false;
    });
    audio.addEventListener('error', () => { btn.hidden = true; });
    btn.addEventListener('click', () => {
      if (!available) return;
      if (audio.paused) { audio.play(); btn.textContent = '❚❚'; }
      else { audio.pause(); btn.textContent = '♪'; }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyURLCustomizations();
    setupReveal();
    setupConfetti();
    setupImagesFallback();
    setupHeroSlider();
    setupGalleryToggle();
    setupAudio();
  });
})();


