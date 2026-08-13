/* ============================================================
   PORTFOLIO — Global JavaScript
   Preloader, mobile nav, page transitions, lightbox, accordions,
   3D flip card, pop-up modal, and scroll reveal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. SITE PRELOADER & HERO REVEAL =====
  const siteLoader = document.getElementById('siteLoader');
  const loaderBarFill = document.getElementById('loaderBarFill');
  const transition = document.getElementById('pageTransition');

  function completePageLoad() {
    if (loaderBarFill) loaderBarFill.style.width = '100%';
    if (siteLoader) siteLoader.classList.add('hidden');
    document.body.classList.add('page-loaded');
    document.querySelectorAll('.hero-bg-section, .specialist-section, .explore-section, .page-header, .gallery-section, .footer')
      .forEach(el => el.classList.add('revealed'));
    if (transition) transition.classList.remove('active');
  }

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      setTimeout(completePageLoad, 200);
    } else {
      if (loaderBarFill) loaderBarFill.style.width = `${progress}%`;
    }
  }, 25);

  // Safety fallback: guaranteed load within 450ms
  window.addEventListener('load', () => {
    clearInterval(loadInterval);
    completePageLoad();
  });
  setTimeout(() => {
    clearInterval(loadInterval);
    completePageLoad();
  }, 450);

  // ===== 2. MOBILE BURGER NAVIGATION & PAGE LINKS =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  function closeMobileNav() {
    if (navToggle) {
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    if (navLinks) navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    if (navToggle) {
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
    }
    if (navLinks) navLinks.classList.add('open');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks && navLinks.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
  }

  // ===== 3. PAGE TRANSITION & NAVIGATION CLICKS =====
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip hash anchor links, external links, email, pdf downloads
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('http') || href.startsWith('javascript:') ||
        href.endsWith('.pdf') || link.hasAttribute('download') || link.target === '_blank') {
        if (href && href.startsWith('#')) {
          closeMobileNav();
        }
        return;
      }

      // Skip if modifier key held (open in new tab)
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;

      e.preventDefault();
      closeMobileNav();

      if (transition) {
        transition.classList.add('active');
        setTimeout(() => {
          window.location.href = href;
        }, 220);
      } else {
        window.location.href = href;
      }
    });
  });

  // Close mobile drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // ===== 4. ACTIVE NAV LINK HIGHLIGHT =====
  const currentPath = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    const linkPath = (href || '').split('#')[0].replace(/\/$/, '').split('/').pop();
    if (linkPath === currentPath || (currentPath === '' && (linkPath === 'index.html' || linkPath === ''))) {
      link.classList.add('active');
    }
  });

  // ===== 5. NAVBAR SCROLL EFFECT & PROGRESS BAR =====
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scrollProgressBar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 25);

    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0 && progressBar) {
      const progress = (scrollY / totalScroll) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // ===== 6. SCROLL REVEAL (INTERSECTION OBSERVER) =====
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    document.querySelectorAll('.gallery-item, .specialist-section, .spec-block, .specialist-img, .tech-specialist-2, .figma-edu-block, .figma-lang-block, .figma-toolkit-wrap, .explore-card, .hero-bg-section').forEach(item => {
      revealObserver.observe(item);
    });
  }

  // ===== 7. ACCORDION SYSTEM =====
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const block = trigger.closest('.accordion-block');
      if (!content || !block) return;

      const isOpen = block.classList.contains('open');

      if (isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        requestAnimationFrame(() => {
          content.style.maxHeight = '0px';
        });
        block.classList.remove('open');
      } else {
        block.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';

        content.addEventListener('transitionend', function handler() {
          if (block.classList.contains('open')) {
            content.style.maxHeight = 'none';
          }
          content.removeEventListener('transitionend', handler);
        });
      }
    });
  });

  // ===== 8. INTERACTIVE POP-UP MODAL SYSTEM =====
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

  // Attach pop-up triggers for Education items
  document.querySelectorAll('.figma-edu-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index === 0) {
        openInfoPopup(
          'Education • Junior High School',
          'Marcelo H. Del Pilar National High School',
          '2016 — 2020 | Special Program in the Arts (With Honors)',
          'Junior High School specializing in Special Program in the Arts (SPA) with academic honors.'
        );
      } else if (index === 1) {
        openInfoPopup(
          'Education • Senior High School',
          'Marcelo H. Del Pilar National High School',
          '2020 — 2022 | STEM Strand (With Honors)',
          'Senior High School Academic Track focusing on Science, Technology, Engineering, and Mathematics with academic honors and STEM projects.'
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

  // ===== 9. 3D FLIPPABLE FOOTER CARD SYSTEM =====
  const footerFlipCard = document.getElementById('footerFlipCard');
  if (footerFlipCard) {
    footerFlipCard.addEventListener('click', (e) => {
      // Don't flip back when clicking the CV download button
      if (e.target.closest('.contact-card-cv-btn')) return;
      footerFlipCard.classList.toggle('flipped');
    });
  }

  // Automatically flip card to contact.png when "Contact" nav link is clicked
  document.querySelectorAll('a[href="#contact"]').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
      if (footerFlipCard) {
        setTimeout(() => {
          footerFlipCard.classList.add('flipped');
        }, 350);
      }
    });
  });

  // ===== 10. LIGHTBOX SYSTEM (ISOLATED & TOUCH-FRIENDLY) =====
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxScrollHint = document.getElementById('lightboxScrollHint');
    const lightboxZoomIn = document.getElementById('lightboxZoomIn');
    const lightboxZoomOut = document.getElementById('lightboxZoomOut');
    const lightboxZoomReset = document.getElementById('lightboxZoomReset');

    const galleryImages = [];
    document.querySelectorAll('.gallery-item img').forEach(img => {
      galleryImages.push(img.src);
    });

    let currentIndex = 0;
    let zoomScale = 1;

    function applyZoom() {
      if (!lightboxImg) return;
      lightboxImg.style.transform = `scale(${zoomScale})`;
      if (zoomScale > 1) {
        lightboxImg.classList.add('is-zoomed');
      } else {
        lightboxImg.classList.remove('is-zoomed');
      }
    }

    function setZoom(scale) {
      zoomScale = Math.min(Math.max(scale, 1), 3.5);
      applyZoom();
    }

    function resetZoom() {
      zoomScale = 1;
      applyZoom();
    }

    if (lightboxZoomIn) {
      lightboxZoomIn.addEventListener('click', (e) => {
        e.stopPropagation();
        setZoom(zoomScale + 0.5);
      });
    }

    if (lightboxZoomOut) {
      lightboxZoomOut.addEventListener('click', (e) => {
        e.stopPropagation();
        setZoom(zoomScale - 0.5);
      });
    }

    if (lightboxZoomReset) {
      lightboxZoomReset.addEventListener('click', (e) => {
        e.stopPropagation();
        resetZoom();
      });
    }

    if (lightboxImg) {
      lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        if (zoomScale > 1) {
          resetZoom();
        } else {
          setZoom(2.0);
        }
      });

      lightboxImg.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (zoomScale > 1) {
          resetZoom();
        } else {
          setZoom(3.0);
        }
      });
    }

    function openLightbox(index) {
      if (galleryImages.length === 0) return;
      currentIndex = index;
      resetZoom();
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      resetZoom();
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightboxImage() {
      resetZoom();
      const src = galleryImages[currentIndex];
      if (!src) return;
      lightboxImg.src = src;
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
      }

      if (lightboxContent) {
        lightboxContent.classList.remove('scrollable');
        lightboxContent.scrollTop = 0;
      }
      if (lightboxScrollHint) lightboxScrollHint.style.display = 'block';

      lightboxImg.onload = () => {
        if (lightboxContent && lightboxImg.naturalHeight && lightboxImg.naturalWidth) {
          const ratio = lightboxImg.naturalHeight / lightboxImg.naturalWidth;
          if (ratio > 1.5) {
            lightboxContent.classList.add('scrollable');
          }
        }
      };
    }

    function prevImage() {
      if (galleryImages.length === 0) return;
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImage();
    }

    function nextImage() {
      if (galleryImages.length === 0) return;
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
      if (e.target === lightbox || e.target === lightboxContent) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextImage();
        else prevImage();
      }
    }, { passive: true });
  }

  // ===== 11. ANTI-PIRACY & ARTWORK PROTECTION =====
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.gallery-item') || e.target.closest('.explore-card') || e.target.closest('.lightbox-img')) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.gallery-item') || e.target.closest('.explore-card')) {
      e.preventDefault();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U' || e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
    }
  });

});
