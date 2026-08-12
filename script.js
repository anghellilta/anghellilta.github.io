/* ============================================================
   PORTFOLIO — Global JavaScript
   Page transitions, lightbox, scroll reveal, progress scroll, mobile nav, pop-up modal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== CLEAN SITE PRELOADER / LOADING STATE =====
  const siteLoader = document.getElementById('siteLoader');
  const loaderBarFill = document.getElementById('loaderBarFill');

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 12;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);

      if (loaderBarFill) loaderBarFill.style.width = '100%';

      setTimeout(() => {
        if (siteLoader) siteLoader.classList.add('hidden');
        document.body.classList.add('page-loaded');
        if (transition) transition.classList.remove('active');
      }, 350);
    } else {
      if (loaderBarFill) loaderBarFill.style.width = `${progress}%`;
    }
  }, 40);

  // Hide loader fallback on window load
  window.addEventListener('load', () => {
    progress = 100;
    if (loaderBarFill) loaderBarFill.style.width = '100%';
    setTimeout(() => {
      if (siteLoader) siteLoader.classList.add('hidden');
      document.body.classList.add('page-loaded');
    }, 400);
  });

  // ===== PAGE TRANSITION SYSTEM =====
  const transition = document.getElementById('pageTransition');

  // Intercept nav link clicks for smooth page transitions
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip anchor links, external links, mailto, and same-page
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('http') || href.startsWith('javascript:')) return;

      // Skip if modifier keys held (open in new tab)
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;

      e.preventDefault();

      // Trigger exit transition
      if (transition) {
        transition.classList.add('active');
        setTimeout(() => {
          window.location.href = href;
        }, 350);
      } else {
        window.location.href = href;
      }
    });
  });

  // ===== ACTIVE NAV LINK =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ===== NAVBAR & SCROLL PROGRESS BAR =====
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scrollProgressBar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);

    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0 && progressBar) {
      const progress = (scrollY / totalScroll) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // ===== MOBILE NAV =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function closeMobileNav() {
    if (navToggle) navToggle.classList.remove('open');
    if (navLinks) navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    if (navToggle) navToggle.classList.add('open');
    if (navLinks) navLinks.classList.add('open');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (navLinks && navLinks.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (navOverlay) navOverlay.addEventListener('click', closeMobileNav);

  // Close mobile nav on link click
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.gallery-item, .specialist-section, .spec-block, .specialist-img, .tech-specialist-2, .figma-edu-block, .figma-lang-block, .figma-toolkit-wrap, .explore-card').forEach(item => {
    revealObserver.observe(item);
  });

  // ===== INTERACTIVE POP-UP MODAL SYSTEM FOR CREDENTIALS & SKILLS =====
  const infoPopupModal = document.getElementById('infoPopupModal');
  const infoPopupClose = document.getElementById('infoPopupClose');
  const infoPopupBadge = document.getElementById('infoPopupBadge');
  const infoPopupTitle = document.getElementById('infoPopupTitle');
  const infoPopupSubtitle = document.getElementById('infoPopupSubtitle');
  const infoPopupBody = document.getElementById('infoPopupBody');

  function openInfoPopup(badge, title, subtitle, body) {
    if (!infoPopupModal) return;
    if (infoPopupBadge) infoPopupBadge.textContent = badge;
    if (infoPopupTitle) infoPopupTitle.textContent = title;
    if (infoPopupSubtitle) infoPopupSubtitle.textContent = subtitle;
    if (infoPopupBody) infoPopupBody.innerHTML = body;
    infoPopupModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeInfoPopup() {
    if (!infoPopupModal) return;
    infoPopupModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (infoPopupClose) infoPopupClose.addEventListener('click', closeInfoPopup);
  if (infoPopupModal) {
    infoPopupModal.addEventListener('click', (e) => {
      if (e.target === infoPopupModal) closeInfoPopup();
    });
  }

  // Attach pop-up triggers for Education Items
  document.querySelectorAll('.figma-edu-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index === 0) {
        openInfoPopup(
          'Education • High School',
          'Marcelo H. Del Pilar National High School',
          '2020 — 2022 | STEM Strand (With Honors)',
          'High School Academic Track focusing on Science, Technology, Engineering, and Mathematics with academic honors and STEM projects.'
        );
      } else {
        openInfoPopup(
          'Education • University Degree',
          'Systems Technology Institute (Malolos)',
          '2022 — 2026 | BS Information Technology (Cum Laude)',
          'Graduating with Cum Laude honors in BS Information Technology. Specialized in Full-Stack Web Development, Mobile Application Engineering, Software Architecture, and User Interface Design.'
        );
      }
    });
  });

  // Attach pop-up triggers for Languages & Frameworks
  document.querySelectorAll('.center-lang-grid div').forEach(item => {
    item.addEventListener('click', () => {
      const techName = item.textContent.trim();
      const techDetails = {
        'TypeScript': 'Type-safe JavaScript development used for scalable web application development.',
        'CSS': 'Modern styling using CSS Grid, Flexbox, glassmorphic UI design, and responsive design systems.',
        'JavaScript': 'Core language for frontend interactivity, full-stack web applications, and dynamic DOM manipulation.',
        'Python': 'Backend API development, data processing scripts, and machine learning utilities.',
        'Java': 'Object-oriented programming, data structures, and enterprise software engineering.',
        'C#': 'Application logic development, desktop tools, and .NET framework integration.',
        'SQL': 'Relational database schema modeling, queries, indexing, and data management.',
        'Dart': 'Cross-platform mobile application development framework powering Flutter apps.',
        'Swift & Kotlin': 'Native iOS (Swift) and Android (Kotlin) mobile app engineering.',
        'React': 'Component-driven frontend web UI development with state management and hook ecosystems.',
        'Next.js 14': 'Full-stack React framework with App Router, SSR, Server Actions, and SEO optimization.',
        'Flutter': 'Google UI toolkit for crafting natively compiled mobile apps from a single codebase.',
        'Tailwind CSS': 'Utility-first CSS styling for rapid UI component development.',
        'Supabase': 'Open-source Firebase alternative with PostgreSQL database, auth, and real-time APIs.',
        'Firebase': 'Google cloud platform for real-time databases, authentication, and cloud storage hosting.'
      };

      const description = techDetails[techName] || `Expert proficiency and hands-on production experience in ${techName}.`;

      openInfoPopup(
        'Language & Framework',
        techName,
        'Tech Skill Highlight',
        description
      );
    });
  });

  // Attach pop-up trigger for Toolkit Image
  const toolkitImg = document.querySelector('.figma-toolkit-img');
  if (toolkitImg) {
    toolkitImg.addEventListener('click', () => {
      openInfoPopup(
        'Toolkit & Software',
        'Design & Development Suite',
        'Professional Software Tools',
        'Includes Photoshop, Krita, Canva, VS Code, GitHub, Blender 3D, Flutter SDK, Supabase, and Procreate for end-to-end design and software delivery.'
      );
    });
  }

  // ===== 3D FLIPPABLE FOOTER CARD SYSTEM =====
  const footerFlipCard = document.getElementById('footerFlipCard');
  if (footerFlipCard) {
    footerFlipCard.addEventListener('click', (e) => {
      // Allow social links inside card back to be clicked directly without toggling flip
      if (e.target.closest('.contact-card-link')) return;
      footerFlipCard.classList.toggle('flipped');
    });
  }

  // ===== LIGHTBOX SYSTEM =====
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return; // No lightbox on pages without galleries

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxScrollHint = document.getElementById('lightboxScrollHint');

  const galleryImages = [];
  document.querySelectorAll('.gallery-item img').forEach(img => {
    galleryImages.push(img.src);
  });

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const src = galleryImages[currentIndex];
    lightboxImg.src = src;
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;

    lightboxContent.classList.remove('scrollable');
    lightboxContent.scrollTop = 0;
    if (lightboxScrollHint) lightboxScrollHint.style.display = 'none';

    lightboxImg.onload = () => {
      const ratio = lightboxImg.naturalHeight / lightboxImg.naturalWidth;
      if (ratio > 1.5) {
        lightboxContent.classList.add('scrollable');
        if (lightboxScrollHint) lightboxScrollHint.style.display = 'block';
      } else {
        lightboxContent.classList.remove('scrollable');
        if (lightboxScrollHint) lightboxScrollHint.style.display = 'none';
      }
    };

    lightboxImg.style.animation = 'none';
    lightboxImg.offsetHeight;
    lightboxImg.style.animation = 'lightboxZoomIn 0.35s ease-out';
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevImage();
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      nextImage();
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  }, { passive: true });
});
