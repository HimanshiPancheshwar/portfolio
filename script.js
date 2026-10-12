/**
 * Himanshi Pancheshwar Portfolio
 * Interactive Script: Theme, Filters, Modals, Nav Spy, Stats Animation
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScrollProgress();
  initNavigation();
  initProjectFilters();
  initModals();
  initStatsCounter();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('hp-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Default to dark mode or saved preference
  const currentTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'dark');
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('hp-theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. Scroll Progress Bar & Header Shadow
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    }

    if (header) {
      if (window.scrollY > 20) {
        header.style.boxShadow = 'var(--shadow-md)';
      } else {
        header.style.boxShadow = 'none';
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   3. Navigation & ScrollSpy
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // Active section tracking (ScrollSpy)
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   4. Project Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Project Modals
   ========================================================================== */
function initModals() {
  const openButtons = document.querySelectorAll('.open-modal-btn');
  const closeButtons = document.querySelectorAll('.close-modal-btn');
  const backdrops = document.querySelectorAll('.modal-backdrop');

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('open');
        targetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = (modal) => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  backdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      backdrops.forEach(modal => {
        if (modal.classList.contains('open')) {
          closeModal(modal);
        }
      });
    }
  });
}

/* ==========================================================================
   6. Hero Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          let current = 0;
          const duration = 1200;
          const stepTime = Math.abs(Math.floor(duration / target));

          const timer = setInterval(() => {
            current += 1;
            if (target === 100) {
              current += 4;
              if (current > 100) current = 100;
              stat.textContent = `${current}%`;
            } else {
              stat.textContent = `${current}+`;
            }

            if (current >= target) {
              clearInterval(timer);
              stat.textContent = target === 100 ? `${target}%` : `${target}+`;
            }
          }, Math.max(stepTime, 20));
        });
      }
    });
  }, { threshold: 0.5 });

  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    observer.observe(statsGrid);
  }
}
