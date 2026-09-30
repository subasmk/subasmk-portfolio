/* SUBASH.MK portfolio - interactions */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- custom cursor (desktop only) ---------- */
  if (window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) {
    document.body.classList.add('has-cursor');
    const dot = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
      if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .cursor-hover, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => ring && ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring && ring.classList.remove('grow'));
    });
  }

  /* ---------- hero particles ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];
    const COUNT = window.innerWidth < 720 ? 34 : 70;
    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < COUNT; i++) {
      pts.push({
        x: Math.random() * 2000, y: Math.random() * 1200,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      });
    }
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,211,238,0.55)';
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = 'rgba(34,211,238,' + (0.14 * (1 - d / 130)) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- typing effect ---------- */
  const typer = document.getElementById('typer');
  if (typer) {
    const roles = [
      'AI & Data Science student',
      'full stack builder',
      'GenAI explorer',
      'app developer',
      'cybersecurity learner',
      'hackathon shipper'
    ];
    let ri = 0, ci = 0, deleting = false;
    (function tick() {
      const word = roles[ri];
      if (!deleting) {
        ci++;
        typer.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; return setTimeout(tick, 1600); }
        return setTimeout(tick, 55 + Math.random() * 45);
      }
      ci--;
      typer.textContent = word.slice(0, ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; return setTimeout(tick, 350); }
      setTimeout(tick, 28);
    })();
  }

  /* ---------- live GitHub stats ---------- */
  fetch('https://api.github.com/users/subasmk')
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => {
      const repos = document.getElementById('st-repos');
      const followers = document.getElementById('st-followers');
      if (repos) repos.textContent = d.public_repos ?? '10+';
      if (followers) followers.textContent = d.followers ?? '0';
    })
    .catch(() => {
      const repos = document.getElementById('st-repos');
      const followers = document.getElementById('st-followers');
      if (repos) repos.textContent = '10+';
      if (followers) followers.textContent = '0';
    });

  /* ---------- reveal on scroll ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  /* ---------- progress bar + scroll-top ---------- */
  const progressBar = document.getElementById('progressBar');
  const scrollBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (progressBar) progressBar.style.width = pct + '%';
    if (scrollBtn) scrollBtn.classList.toggle('show', h.scrollTop > 400);
  }, { passive: true });
  if (scrollBtn) scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- mobile menu ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ---------- active nav link ---------- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const linkMap = {};
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) linkMap[href.slice(1)] = a;
  });
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && linkMap[e.target.id]) {
        document.querySelectorAll('.nav-links a').forEach((a) => a.classList.remove('active'));
        linkMap[e.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => navObserver.observe(s));

  /* ---------- project card tilt (desktop) ---------- */
  if (window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'translateY(-6px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- contact form -> mailto ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const msg = document.getElementById('cf-msg').value.trim();
      const subject = encodeURIComponent('Portfolio contact from ' + name);
      const body = encodeURIComponent(msg + '\n\n- ' + name + ' (' + email + ')');
      window.location.href = 'mailto:mksubash2809@gmail.com?subject=' + subject + '&body=' + body;
    });
  }
});
