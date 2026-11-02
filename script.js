/**
 * ARIES — Premium Personal Portfolio
 * Interactive Architecture & Performance Optimizations
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Theme Management (Light / Dark Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;
  const themeMetaColor = document.getElementById('theme-meta-color');

  // Detect initial theme preference
  const savedTheme = localStorage.getItem('aries-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Default to light as specified in the design philosophy, but respect saved preference
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('aries-theme', theme);
    
    // Update mobile browser status bar color
    if (themeMetaColor) {
      themeMetaColor.setAttribute('content', theme === 'dark' ? '#090D16' : '#FFFFFF');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }

  // Listen for system theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('aries-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ==========================================================================
     2. Ambient Background Canvas (Subtle Constellation Particle Mesh)
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };
    let isCanvasVisible = true;

    // Track mouse position on window
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.8;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on edges
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse gentle interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            const directionX = forceDirectionX * force * 1.5;
            const directionY = forceDirectionY * force * 1.5;

            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }

      draw(isDark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(96, 165, 250, 0.45)' : 'rgba(37, 99, 235, 0.35)';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      // Calculate responsive density
      const particleCount = Math.floor((width * height) / 22000);
      const cappedCount = Math.min(Math.max(particleCount, 25), 65);

      for (let i = 0; i < cappedCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles(isDark) {
      const maxDistance = 110;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * (isDark ? 0.16 : 0.08);
            ctx.strokeStyle = isDark 
              ? `rgba(96, 165, 250, ${opacity})` 
              : `rgba(37, 99, 235, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function renderCanvas() {
      if (!isCanvasVisible) return;

      const isDark = rootElement.getAttribute('data-theme') === 'dark';
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(isDark);
      }
      connectParticles(isDark);

      animationFrameId = requestAnimationFrame(renderCanvas);
    }

    // Optimization: Pause canvas rendering when document is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isCanvasVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isCanvasVisible = true;
        renderCanvas();
      }
    });

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    resizeCanvas();
    renderCanvas();
  }

  /* ==========================================================================
     3. Spotlight Card Mouse-Tracking Glow
     ========================================================================== */
  const spotlightCards = document.querySelectorAll('.spotlight-card');

  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     4. Navigation Bar Scroll States & Active Spy
     ========================================================================== */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header blurred shadow state
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active Section Spy
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    mobileNavLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial run

  /* ==========================================================================
     5. Mobile Drawer Menu Navigation
     ========================================================================== */
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav');

  if (mobileToggleBtn && mobileNavDrawer) {
    function toggleMobileMenu() {
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      mobileToggleBtn.setAttribute('aria-expanded', !isExpanded);
      mobileToggleBtn.classList.toggle('open');
      mobileNavDrawer.classList.toggle('active');
      mobileNavDrawer.setAttribute('aria-hidden', isExpanded);
    }

    function closeMobileMenu() {
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      mobileToggleBtn.classList.remove('open');
      mobileNavDrawer.classList.remove('active');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
    }

    mobileToggleBtn.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  /* ==========================================================================
     6. Scroll Reveal Animation via IntersectionObserver
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     7. Copy Email to Clipboard Feature
     ========================================================================== */
  const copyEmailTrigger = document.getElementById('copy-email-trigger');
  const emailAddressElement = document.getElementById('email-address-text');

  if (copyEmailTrigger && emailAddressElement) {
    copyEmailTrigger.addEventListener('click', async () => {
      const emailToCopy = emailAddressElement.textContent.trim();
      const copyTextSpan = copyEmailTrigger.querySelector('.copy-text');
      const originalText = copyTextSpan ? copyTextSpan.textContent : 'Copy';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback textarea method
          const textArea = document.createElement('textarea');
          textArea.value = emailToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        if (copyTextSpan) {
          copyTextSpan.textContent = 'Copied!';
          copyEmailTrigger.style.backgroundColor = 'var(--accent-primary)';
          copyEmailTrigger.style.color = '#FFFFFF';
        }

        setTimeout(() => {
          if (copyTextSpan) {
            copyTextSpan.textContent = originalText;
            copyEmailTrigger.style.backgroundColor = '';
            copyEmailTrigger.style.color = '';
          }
        }, 2200);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  /* ==========================================================================
     8. Interactive Contact Form with Validation & Mailto Action
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const subjectInput = document.getElementById('sender-subject');
      const messageInput = document.getElementById('sender-message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Email with regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        subjectInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (isValid) {
        const senderName = encodeURIComponent(nameInput.value.trim());
        const senderEmail = encodeURIComponent(emailInput.value.trim());
        const subject = encodeURIComponent(`[Portfolio Inquiry] ${subjectInput.value.trim()}`);
        const body = encodeURIComponent(
          `Hi ARIES,\n\n${messageInput.value.trim()}\n\nBest regards,\n${nameInput.value.trim()} (${emailInput.value.trim()})`
        );

        // Display success confirmation toast
        if (formToast) {
          formToast.className = 'form-toast toast-success';
          formToast.textContent = `Thank you, ${nameInput.value.trim()}! Preparing your direct email to ARIES...`;
          formToast.style.display = 'block';
        }

        // Trigger mailto client
        setTimeout(() => {
          window.location.href = `mailto:contact@aries.dev?subject=${subject}&body=${body}`;
          contactForm.reset();
        }, 1000);
      } else {
        if (formToast) {
          formToast.className = 'form-toast toast-error';
          formToast.textContent = 'Please fill out all required fields with valid details.';
          formToast.style.display = 'block';
        }
      }
    });

    // Real-time error clearance on input
    contactForm.querySelectorAll('input, textarea').forEach((input) => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
        if (formToast) {
          formToast.style.display = 'none';
        }
      });
    });
  }

  /* ==========================================================================
     9. Dynamic Copyright Year
     ========================================================================== */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     10. Back to Top Smooth Scroll Button
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});

