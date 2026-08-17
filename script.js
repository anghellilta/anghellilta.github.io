/* ============================================================
   PORTFOLIO — Global JavaScript
   Preloader, mobile nav, page transitions, interactive carousels:
   1. Uniform Infinite Carousel (Website & App)
   2. 3D Curved Arc Infinite Carousel (Digital & Traditional Art)
   Lightbox, accordions, 3D flip card, pop-up modal, and scroll reveal
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
    document.querySelectorAll('.hero-bg-section, .specialist-section, .explore-section, .page-header, .gallery-section, .footer, .gallery-carousel-section')
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

  // ===== 3. SMOOTH SCROLL ANCHOR NAVIGATION =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMobileNav();
        const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // Handle non-anchor links (external, emails, downloads)
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip hash anchor links, external links, email, pdf downloads
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('http') || href.startsWith('javascript:') ||
        href.endsWith('.pdf') || link.hasAttribute('download') || link.target === '_blank') {
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

  // ===== 4. ACTIVE NAV LINK HIGHLIGHT (Scroll-Spy) =====
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [];
  navAnchors.forEach(link => {
    const id = link.getAttribute('href');
    const section = document.querySelector(id);
    if (section) sections.push({ el: section, link: link });
  });

  function updateActiveNav() {
    const scrollY = window.scrollY;
    const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
    let current = null;

    for (const s of sections) {
      const top = s.el.offsetTop - navHeight - 120;
      if (scrollY >= top) {
        current = s;
      }
    }

    navAnchors.forEach(a => a.classList.remove('active'));
    if (current) current.link.classList.add('active');
  }

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

    updateActiveNav();
  }, { passive: true });

  // ===== 6. SECTION 2 AUTO-REVEAL & AUTO-HIDE ACCORDION OBSERVER =====
  const specialistSection = document.getElementById('about');
  if (specialistSection && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            specialistSection.classList.add('section-active', 'revealed');
          } else {
            specialistSection.classList.remove('section-active');
          }
        });
      },
      {
        threshold: 0.20,
        rootMargin: '-40px 0px -40px 0px'
      }
    );
    sectionObserver.observe(specialistSection);
  }

  // General reveal observer for gallery carousels & hero
  if ('IntersectionObserver' in window) {
    const generalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    document.querySelectorAll('.gallery-carousel-section, .hero-bg-section').forEach(item => {
      generalObserver.observe(item);
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

  // ============================================================
  // 10. UNIFORM CONSTANT INFINITE CAROUSEL (Website & App)
  // - Clean uniform rectangular cards with brand RED bottom gradient
  // - Constant smooth continuous gliding marquee loop
  // - Pauses on hover, draggable, responsive
  // ============================================================
  function initUniformCarousel() {
    const container = document.getElementById('uniformCarousel');
    if (!container) return;

    const track = document.getElementById('uniformTrack');
    const prevBtn = document.getElementById('uniformPrevBtn');
    const nextBtn = document.getElementById('uniformNextBtn');
    const dotsWrap = document.getElementById('uniformDots');
    if (!track) return;

    const originalCards = Array.from(track.children);
    const totalOriginal = originalCards.length;
    if (totalOriginal === 0) return;

    // Clone 2 sets to make 3 continuous sets total [Set 0, Set 1, Set 2]
    originalCards.forEach(card => {
      const clone1 = card.cloneNode(true);
      const clone2 = card.cloneNode(true);
      clone1.classList.add('is-clone');
      clone2.classList.add('is-clone');
      track.appendChild(clone1);
      track.appendChild(clone2);
    });

    let cardStep = 280;
    let singleCycleWidth = totalOriginal * cardStep;

    function measure() {
      const firstCard = track.children[0];
      if (firstCard) {
        cardStep = firstCard.offsetWidth + 20; // 20px gap
        singleCycleWidth = totalOriginal * cardStep;
      }
    }

    let currentPos = 0;
    let targetVelocity = 0.8;
    let velocity = 0.8;
    let isHovered = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartPos = 0;
    let animationFrameId = null;

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (let i = 0; i < totalOriginal; i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Project ${i + 1}`);
        dot.addEventListener('click', () => {
          currentPos = i * cardStep;
          updateDots();
        });
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      const activeIdx = Math.floor(((currentPos % singleCycleWidth) + singleCycleWidth) % singleCycleWidth / cardStep) % totalOriginal;
      const dots = dotsWrap.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIdx);
      });
    }

    // Continuous 60fps RAF loop
    function animate() {
      if (!isDragging) {
        const targetV = isHovered ? 0 : targetVelocity;
        velocity += (targetV - velocity) * 0.1; // Smooth easing to pause/play
        currentPos += velocity;

        // Seamless wrap across the single cycle boundary
        if (currentPos >= singleCycleWidth) {
          currentPos -= singleCycleWidth;
        } else if (currentPos < 0) {
          currentPos += singleCycleWidth;
        }
      }

      track.style.transform = `translateX(-${currentPos}px)`;
      updateDots();
      animationFrameId = requestAnimationFrame(animate);
    }

    // Controls
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentPos += cardStep;
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentPos -= cardStep;
      });
    }

    container.addEventListener('mouseenter', () => { isHovered = true; });
    container.addEventListener('mouseleave', () => { isHovered = false; });

    // Drag / Touch support
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartPos = currentPos;
      track.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      currentPos = dragStartPos - dx;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        track.style.cursor = 'grab';
      }
    });

    // Touch
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartPos = currentPos;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - dragStartX;
      currentPos = dragStartPos - dx;
    }, { passive: true });

    container.addEventListener('touchend', () => {
      isDragging = false;
    }, { passive: true });

    window.addEventListener('resize', () => {
      measure();
    });

    measure();
    buildDots();
    animationFrameId = requestAnimationFrame(animate);
  }

  initUniformCarousel();

  // ============================================================
  // 11. 3D CURVED SHAPE CAROUSEL (Digital & Trad Art)
  // - Matches Image 1, Image 2, and Image 3 attached by user
  // - Removed constant movement: smooth step-based navigation
  // - Top & bottom arch masks create the perfect silhouette
  // ============================================================
  function initCurved3DCarousel(containerId, stageId, prevBtnId, nextBtnId, dotsWrapId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const stage = document.getElementById(stageId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsWrap = document.getElementById(dotsWrapId);
    if (!stage) return;

    const cards = Array.from(stage.children);
    const total = cards.length;
    if (total === 0) return;

    let centerIndex = 2; // Default start with 3rd artwork centered so 5 cards are visible

    function getCardStep() {
      const isMobile = window.innerWidth <= 768;
      const cardWidth = isMobile ? 165 : 240;
      const gap = 16;
      return cardWidth + gap;
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === centerIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Artwork ${i + 1}`);
        dot.addEventListener('click', () => {
          centerIndex = i;
          render3DArch();
        });
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      const dots = dotsWrap.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === centerIndex);
      });
    }

    function render3DArch() {
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;
      const step = getCardStep();
      const cardWidth = isMobile ? 165 : 240;
      const viewport = container.querySelector('.curved-carousel-viewport');
      const viewportWidth = viewport ? viewport.offsetWidth : 1200;
      const stageCenterX = (viewportWidth / 2) - (cardWidth / 2);

      // Translate stage so active center card is at the center of viewport
      const targetTranslateX = stageCenterX - (centerIndex * step);
      stage.style.transform = `translateX(${targetTranslateX}px)`;

      // Apply discrete 3D perspective rotation matching Image 2 & 3
      cards.forEach((card, idx) => {
        let dist = idx - centerIndex;
        if (dist > total / 2) dist -= total;
        if (dist < -total / 2) dist += total;

        card.classList.remove('slot-far-left', 'slot-mid-left', 'slot-center', 'slot-mid-right', 'slot-far-right');

        if (dist === 0) {
          card.classList.add('slot-center');
          card.style.transform = `perspective(1200px) rotateY(0deg) scale(1.0)`;
          card.style.opacity = '1';
          card.style.zIndex = '15';
        } else if (dist === -1) {
          card.classList.add('slot-mid-left');
          const angle = isMobile ? 12 : 13;
          card.style.transform = `perspective(1200px) rotateY(${angle}deg) scale(1.0)`;
          card.style.opacity = '0.95';
          card.style.zIndex = '12';
        } else if (dist === 1) {
          card.classList.add('slot-mid-right');
          const angle = isMobile ? -12 : -13;
          card.style.transform = `perspective(1200px) rotateY(${angle}deg) scale(1.0)`;
          card.style.opacity = '0.95';
          card.style.zIndex = '12';
        } else if (dist === -2) {
          card.classList.add('slot-far-left');
          const angle = isMobile ? 22 : 25;
          card.style.transform = `perspective(1200px) rotateY(${angle}deg) scale(1.0)`;
          card.style.opacity = isSmallMobile ? '0.35' : '0.95';
          card.style.zIndex = '10';
        } else if (dist === 2) {
          card.classList.add('slot-far-right');
          const angle = isMobile ? -22 : -25;
          card.style.transform = `perspective(1200px) rotateY(${angle}deg) scale(1.0)`;
          card.style.opacity = isSmallMobile ? '0.35' : '0.95';
          card.style.zIndex = '10';
        } else {
          // Offscreen cards
          const sign = dist > 0 ? -1 : 1;
          card.style.transform = `perspective(1200px) rotateY(${sign * 30}deg) scale(0.9)`;
          card.style.opacity = '0.12';
          card.style.zIndex = '1';
        }
      });

      updateDots();
    }

    function nextSlide() {
      centerIndex = (centerIndex + 1) % total;
      render3DArch();
    }

    function prevSlide() {
      centerIndex = (centerIndex - 1 + total) % total;
      render3DArch();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
      });
    }

    // Touch / Swipe
    let touchStartX = 0;
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });

    window.addEventListener('resize', render3DArch);

    buildDots();
    render3DArch();
  }

  // Initialize both curved artwork carousels
  initCurved3DCarousel('digitalCurvedCarousel', 'digitalCurvedStage', 'digitalPrevBtn', 'digitalNextBtn', 'digitalDots');
  initCurved3DCarousel('tradCurvedCarousel', 'tradCurvedStage', 'tradPrevBtn', 'tradNextBtn', 'tradDots');

  // ============================================================
  // 12. UNIFIED LIGHTBOX SYSTEM (ALL GALLERIES & ARTWORKS)
  // - Supports tall / full-page mockups with vertical scrolling & readable width
  // - High-resolution view with zoom, pan, counter, prev/next, touch swipe
  // ============================================================
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

    // Collect unique images for lightbox
    const uniqueImages = [];
    document.querySelectorAll('.uniform-carousel-card:not(.is-clone), .curved-carousel-card, .gallery-item').forEach(card => {
      const img = card.querySelector('img');
      if (img && !uniqueImages.includes(img.src)) {
        uniqueImages.push(img.src);
      }
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
      if (uniqueImages.length === 0) return;
      currentIndex = (index + uniqueImages.length) % uniqueImages.length;
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
      const src = uniqueImages[currentIndex];
      if (!src) return;
      lightboxImg.src = src;
      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${uniqueImages.length}`;
      }

      // Check aspect ratio to apply tall scrollable mode vs standard mode
      const tempImg = new Image();
      tempImg.src = src;
      tempImg.onload = () => {
        const ratio = tempImg.naturalHeight / (tempImg.naturalWidth || 1);
        const wrapper = lightbox.querySelector('.lightbox-img-wrapper');

        if (ratio > 1.35) {
          // Tall / Long image (Mockup / Case Study) -> Full width & vertically scrollable without distortion
          lightboxImg.className = 'lightbox-img tall-image';
          lightboxImg.style.width = '100%';
          lightboxImg.style.maxWidth = 'min(92vw, 1000px)';
          lightboxImg.style.height = 'auto';
          lightboxImg.style.maxHeight = 'none';
          lightboxImg.style.objectFit = 'contain';

          if (lightboxContent) {
            lightboxContent.classList.add('tall-mode');
            lightboxContent.scrollTop = 0;
          }
          if (wrapper) wrapper.classList.add('tall-mode');

          if (lightboxScrollHint) {
            lightboxScrollHint.innerHTML = '<i class="fas fa-arrows-alt-v"></i> Scroll to view full case study';
            lightboxScrollHint.style.display = 'block';
          }
        } else {
          // Standard Artwork -> Uniform proportionate contain
          lightboxImg.className = 'lightbox-img standard-image';
          lightboxImg.style.width = '';
          lightboxImg.style.maxWidth = '';
          lightboxImg.style.height = '';
          lightboxImg.style.maxHeight = '';
          lightboxImg.style.objectFit = 'contain';

          if (lightboxContent) {
            lightboxContent.classList.remove('tall-mode');
          }
          if (wrapper) wrapper.classList.remove('tall-mode');

          if (lightboxScrollHint) {
            lightboxScrollHint.innerHTML = '<i class="fas fa-search-plus"></i> Click or Pinch to Zoom';
            lightboxScrollHint.style.display = 'block';
          }
        }
      };
    }

    function prevImage() {
      if (uniqueImages.length === 0) return;
      currentIndex = (currentIndex - 1 + uniqueImages.length) % uniqueImages.length;
      updateLightboxImage();
    }

    function nextImage() {
      if (uniqueImages.length === 0) return;
      currentIndex = (currentIndex + 1) % uniqueImages.length;
      updateLightboxImage();
    }

    // Attach click listeners to all cards (including clones)
    document.querySelectorAll('.uniform-carousel-card, .curved-carousel-card, .gallery-item').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img) {
          const idx = uniqueImages.indexOf(img.src);
          openLightbox(idx !== -1 ? idx : 0);
        }
      });
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

  // ===== 13. ANTI-PIRACY & ARTWORK PROTECTION =====
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.uniform-carousel-card') || e.target.closest('.curved-carousel-card') || e.target.closest('.gallery-item') || e.target.closest('.lightbox-img')) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.uniform-carousel-card') || e.target.closest('.curved-carousel-card') || e.target.closest('.gallery-item')) {
      e.preventDefault();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U' || e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
    }
  });

});
