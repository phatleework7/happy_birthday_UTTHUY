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
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
        // Nếu ảnh ngang trên màn hình dọc nhỏ, chuyển sang contain để không bị crop
        const img = s.querySelector('img');
        if (img) {
          const isPortraitViewport = window.innerHeight > window.innerWidth;
          const isLandscapeImage = img.naturalWidth > img.naturalHeight;
          if (isPortraitViewport && isLandscapeImage) {
            img.classList.add('fit-contain');
            img.style.objectPosition = '50% 50%';
          } else {
            img.classList.remove('fit-contain');
            img.style.objectPosition = '';
          }
        }
      });
      // sau khi thay slide, kiểm tra lại kích thước tiêu đề để vẫn giữ 1 dòng
      try { fitHeroTitleToOneLine(); } catch (_) {}
    };
    apply();
    const goPrev = () => { index = (index - 1 + slides.length) % slides.length; apply(); };
    const goNext = () => { index = (index + 1) % slides.length; apply(); };
    // hỗ trợ bàn phím
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    });

    // Tự động chuyển slide mỗi 4 giây, dừng/tái lập khi tương tác
    const AUTO_INTERVAL_MS = 4000;
    let autoAdvanceTimer = window.setInterval(goNext, AUTO_INTERVAL_MS);
    function resetAutoAdvance() {
      window.clearInterval(autoAdvanceTimer);
      autoAdvanceTimer = window.setInterval(goNext, AUTO_INTERVAL_MS);
    }
    ['keydown', 'touchstart'].forEach(evt => {
      document.addEventListener(evt, resetAutoAdvance, { passive: true });
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.clearInterval(autoAdvanceTimer);
      } else {
        resetAutoAdvance();
      }
    });

    // cập nhật chế độ contain khi xoay màn hình
    window.addEventListener('orientationchange', () => setTimeout(apply, 150));
    window.addEventListener('resize', () => setTimeout(apply, 150));
  }

  function fitHeroTitleToOneLine() {
    const container = document.querySelector('.hero-content');
    if (!container) return;
    const title = container.querySelector('.title');
    if (!title) return;
    const MAX_SIZE = 54; // px
    const MIN_SIZE = 14; // px an toàn hơn cho mobile rất nhỏ
    // đặt về cỡ tối đa trước khi đo
    title.style.fontSize = `${MAX_SIZE}px`;
    const available = Math.max(0, container.clientWidth - 16);
    // Thu nhỏ dần cho đến khi không tràn
    let current = MAX_SIZE;
    const guard = 20; // chống loop vô hạn
    let count = 0;
    while (title.scrollWidth > available && current > MIN_SIZE && count < guard) {
      current -= 2; // giảm từng nấc 2px để mượt
      title.style.fontSize = `${current}px`;
      count++;
    }
  }

  function setupTitleFitting() {
    const apply = () => fitHeroTitleToOneLine();
    apply();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(apply).catch(() => apply());
    }
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(apply, 120);
    });
    window.addEventListener('orientationchange', () => setTimeout(apply, 150));
  }

  function setupFireworks() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Vẫn chạy nhưng nhẹ hơn khi người dùng bật Reduce Motion
    const canvas = document.createElement('canvas');
    canvas.id = 'fireworksCanvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '2000';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      const devicePixelRatioSafe = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * devicePixelRatioSafe);
      canvas.height = Math.floor(window.innerHeight * devicePixelRatioSafe);
      ctx.setTransform(devicePixelRatioSafe, 0, 0, devicePixelRatioSafe, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    function spawnFirework(originX, originY) {
      const palette = prefersReducedMotion
        ? ['#ffd166', '#fff1a8', '#ffffff']
        : ['#ffd166', '#ff6b6b', '#66d9ff', '#ffffff'];
      const particleCount = prefersReducedMotion ? 28 : 60;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.3;
        const speed = 1.6 + Math.random() * 3.2;
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          life: 70 + Math.floor(Math.random() * 40),
          color: palette[Math.floor(Math.random() * palette.length)]
        });
      }
    }

    function renderFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.02;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.alpha = Math.max(0, p.life / 90);
        ctx.globalAlpha = p.alpha;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, prefersReducedMotion ? 1.8 : 3.2, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(renderFrame);
    }
    requestAnimationFrame(renderFrame);

    const launch = () => {
      const x = Math.random() * window.innerWidth * 0.9 + window.innerWidth * 0.05;
      const y = Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.15;
      spawnFirework(x, y);
    };
    // hiệu ứng rõ ràng ngay khi vào trang: bắn 2 điểm
    launch();
    setTimeout(launch, 600);
    let intervalId = window.setInterval(launch, prefersReducedMotion ? 9000 : 6000);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.clearInterval(intervalId);
      } else {
        intervalId = window.setInterval(launch, prefersReducedMotion ? 9000 : 6000);
      }
    });

    // bấm/tap để bắn ngay tại vị trí
    document.addEventListener('click', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      spawnFirework(x, y);
    }, { passive: true });
  }

  // Không cần toggle gallery nữa (đã gộp 1 lưới)

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
    setupFireworks();
    setupImagesFallback();
    setupHeroSlider();
    setupTitleFitting();
    // Thêm alt rỗng cho các ảnh không phải nội dung (ảnh do extension chèn) để tránh lỗi A11y
    (function ensureAltAttributes() {
      function apply(node) {
        const imgs = (node instanceof HTMLImageElement) ? [node] : node.querySelectorAll('img');
        imgs.forEach(img => {
          if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', '');
            img.setAttribute('aria-hidden', 'true');
          }
        });
      }
      apply(document);
      const mo = new MutationObserver((muts) => {
        muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) apply(n); }));
      });
      mo.observe(document.documentElement, { subtree: true, childList: true });
    })();
    setupAudio();
  });
})();


