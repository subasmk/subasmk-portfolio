// Initialize interactive elements after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  // Custom cursor logic
  const cursor = document.getElementById('cursor');
  const hoverElements = document.querySelectorAll('.cursor-hover, a, button, input, textarea');
  
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.transform = 'translate(-50%, -50%)';
    });
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '60px';
        cursor.style.height = '60px';
        cursor.style.backgroundColor = '#FBFF48';
        cursor.style.mixBlendMode = 'normal';
        cursor.style.border = '2px solid black';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursor.style.backgroundColor = '#fff';
        cursor.style.mixBlendMode = 'difference';
        cursor.style.border = 'none';
      });
    });
  }

  // GitHub API Integration
  async function fetchGitHubStats() {
    try {
      const res = await fetch('https://api.github.com/users/subasmk');
      if (!res.ok) throw new Error('GitHub API request failed');
      const data = await res.json();
      
      const reposEl = document.getElementById('repos-count');
      if (reposEl) reposEl.textContent = data.public_repos || '0';
      
      const followersEl = document.getElementById('followers-count');
      if (followersEl) followersEl.textContent = data.followers || '0';
      
      if (data.created_at) {
        const date = new Date(data.created_at);
        const createdAtEl = document.getElementById('created-at');
        if (createdAtEl) createdAtEl.textContent = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      }
      
      const repoCount = data.public_repos || '0';
      const contribEl = document.getElementById('total-contributions');
      if (contribEl) contribEl.textContent = repoCount;
      
      const contribGridEl = document.getElementById('total-contributions-grid');
      if (contribGridEl) contribGridEl.textContent = repoCount;
    } catch (e) {
      console.error(e);
    }
  }
  fetchGitHubStats();

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  
  revealElements.forEach(el => observer.observe(el));

  // Progress Bar
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
      progressBar.style.width = ((winScroll / height) * 100) + "%";
    }
  });

  // Scroll To Top Button
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.remove('hidden');
      } else {
        scrollBtn.classList.add('hidden');
      }
    });
    
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
