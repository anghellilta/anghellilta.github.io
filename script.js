/* ============================================================
   PORTFOLIO — Global JavaScript
   Preloader, mobile nav, page transitions, Pinterest Masonry Board,
   interactive filter pills, unified lightbox, accordions, 3D flip card,
   pop-up modals, and scroll reveal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. ASSET PRELOADER (GUARANTEES 100% OF IMAGES & ASSETS LOADED) =====
  const siteLoader = document.getElementById('siteLoader');
  const loaderBarFill = document.getElementById('loaderBarFill');
  const transition = document.getElementById('pageTransition');

  function completePageLoad() {
    if (loaderBarFill) loaderBarFill.style.width = '100%';
    setTimeout(() => {
      if (siteLoader) siteLoader.classList.add('hidden');
      document.body.classList.add('page-loaded');
      document.querySelectorAll('.hero-bg-section, .specialist-section, .explore-section, .page-header, .gallery-section, .footer, .pinterest-section, .certifications-section, .web-app-section')
        .forEach(el => el.classList.add('revealed'));
      if (transition) transition.classList.remove('active');
    }, 180);
  }

  // Preload all document images into cache before opening website
  const allImages = Array.from(document.querySelectorAll('img'));
  let loadedCount = 0;
  const totalCount = allImages.length;

  if (totalCount === 0) {
    completePageLoad();
  } else {
    allImages.forEach(img => {
      const src = img.getAttribute('src');
      if (!src) {
        loadedCount++;
        return;
      }
      const preloadImg = new Image();
      preloadImg.onload = preloadImg.onerror = () => {
        loadedCount++;
        const percent = Math.min(Math.floor((loadedCount / totalCount) * 100), 100);
        if (loaderBarFill) loaderBarFill.style.width = `${percent}%`;
        if (loadedCount >= totalCount) {
          setTimeout(completePageLoad, 200);
        }
      };
      preloadImg.src = src;
    });

    // Safety fallback: guaranteed open within 2500ms max
    setTimeout(completePageLoad, 2500);
  }

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

  // General reveal observer for Pinterest board, cards & hero
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

    document.querySelectorAll('.pinterest-section, .hero-bg-section, .pin-card').forEach(item => {
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

  // Attach pop-up triggers for Certifications & Credentials
  const certDetails = {
    'asean-ai': {
      badge: 'Credential • AI Readiness',
      title: 'AI Ready ASEAN Certificate',
      subtitle: 'ASEAN Foundation • May 2026',
      body: 'Issued by the ASEAN Foundation. Demonstrates validated proficiency in artificial intelligence fundamentals, generative AI tools, prompt engineering, data analytics, and ethical AI implementation across modern digital workflows.'
    },
    'ibm-uiux': {
      badge: 'Credential • Design & UX',
      title: 'IBM UI/UX Designer Professional Certificate',
      subtitle: 'IBM • January 2026',
      body: 'Issued by IBM. Professional multi-course certification in user research, wireframing, high-fidelity interactive prototyping, design systems in Figma, accessibility (WCAG), and responsive digital product architecture.'
    },
    'google-pm': {
      badge: 'Credential • Project Management',
      title: 'Google Project Management Certificate',
      subtitle: 'Google • January 2026',
      body: 'Issued by Google. Comprehensive credential covering Agile, Scrum, Kanban, project planning, documentation, risk mitigation, sprint lifecycle tracking, and stakeholder communication.'
    },
    'google-sec': {
      badge: 'Credential • Security & Risk',
      title: 'Google Security Risk Management Certificate',
      subtitle: 'Google • December 2025',
      body: 'Issued by Google. In-depth training on vulnerability assessment, risk management frameworks (NIST/ISO), security auditing, threat detection, incident response, and cybersecurity governance.'
    },
    'cisco-os': {
      badge: 'Credential • Systems & Network',
      title: 'Cisco Operating Systems Support Certificate',
      subtitle: 'Cisco • December 2025',
      body: 'Issued by Cisco. Core competencies in operating systems architecture, Linux command-line utilities, Windows Server administration, network connectivity, process scheduling, and enterprise systems troubleshooting.'
    },
    'alison-cyber': {
      badge: 'Credential • Cybersecurity',
      title: 'Alison Cybersecurity Fundamentals Certificate',
      subtitle: 'Alison • May 2025',
      body: 'Issued by Alison. Covers information security principles, threat modeling, network defense architectures, cryptography standards, malware defense, and security policy enforcement.'
    },
    'sap-hana': {
      badge: 'Credential • Enterprise ERP',
      title: 'SAP S/4HANA Certificate',
      subtitle: 'SAP • December 2024',
      body: 'Issued by SAP. Validation of enterprise resource planning (ERP) workflows, real-time in-memory database management, business transaction integration, financial/operational module coordination, and analytics in SAP S/4HANA.'
    },
    'oracle-java': {
      badge: 'Credential • Software Engineering',
      title: 'Oracle Java Fundamentals Certificate',
      subtitle: 'Oracle • September 2023',
      body: 'Issued by Oracle. Foundational mastery of object-oriented programming (OOP) paradigms, classes, inheritance, interfaces, exception handling, data structures, and Java SE core development.'
    }
  };

  // Detailed Case Study Data for Web & App Projects
  const projectDetails = {
    'convinced-ai': {
      badge: 'B2B Tech & Outsourcing • Case Study',
      title: 'Convinced AI: B2B Technology & Outsourcing Platform',
      subtitle: 'S.P. Madrid & Associates (Internship) • Front-End Developer & UI/UX Designer',
      body: '<strong>Tech Stack & Tools:</strong> Figma, React, Next.js 14, Tailwind CSS, Visual Studio Code, Vercel<br><br>' +
        '<strong>Project Overview:</strong> I designed and developed the complete landing page for Convinced AI, an IT outsourcing and staff augmentation platform highlighting Philippines-based tech solutions. My goal was to create a high-converting, professional B2B interface that communicates scale, technical expertise, and operational excellence.<br><br>' +
        '<strong>Key Features & Implementation:</strong><br>' +
        '• <strong>Modern Tech Aesthetic:</strong> Sleek dark-mode foundation with vibrant neon-green brand accents and crisp white content blocks.<br>' +
        '• <strong>Trust-Building Metrics & Grids:</strong> High-impact hero section with statistical counters ("200+", "3000+", "18 Years") and structured service grids.<br>' +
        '• <strong>Dynamic Visual Hierarchy:</strong> Contrasting dark feature cards alongside workspace galleries to humanize offshore teams.<br>' +
        '• <strong>Interactive Components:</strong> Scrolling ticker tapes, accordion menus for the Culture section, and a numbered How it Works timeline.'
    },
    'workmojo': {
      badge: 'Gamified App • Case Study',
      title: 'WorkMojo: Gamified Employee Engagement App',
      subtitle: 'S.P. Madrid & Associates (Internship) • UI/UX Designer & Frontend Developer',
      body: '<strong>Tech Stack & Tools:</strong> Figma, Visual Studio Code, Next.js, React, Tailwind CSS<br><br>' +
        '<strong>Project Overview:</strong> I led the UI/UX design and frontend development for WorkMojo, an internal application built to boost employee engagement and track performance metrics into an interactive, visually appealing, and highly rewarding digital experience.<br><br>' +
        '<strong>Key Features & Implementation:</strong><br>' +
        '• <strong>Gamified Interface:</strong> Achievement badges, progress trackers, leaderboards, and an avatar system to incentivize performance.<br>' +
        '• <strong>User-Centric Workflows:</strong> Seamless navigation between performance dashboards, peer recognition feeds, and reward claiming.<br>' +
        '• <strong>Prototyping & Visual Hierarchy:</strong> High-fidelity wireframes and interactive prototypes in Figma aligning with corporate goals.<br>' +
        '• <strong>Mobile-First Approach:</strong> Highly responsive screens and clean, maintainable frontend components.'
    },
    'chromaskin': {
      badge: 'AI Mobile Platform • Capstone',
      title: 'Chromaskin: AI-Powered Personal Color Analysis',
      subtitle: 'College Capstone Project • Full Stack Developer & UI/UX Designer / Technical Lead',
      body: '<strong>Tech Stack & Tools:</strong> Flutter, Dart, Visual Studio Code, Supabase, REST APIs, Google ML Kit<br><br>' +
        '<strong>Project Overview:</strong> I served as the lead designer and developer for Chromaskin, an AI-powered mobile platform designed to make personal color analysis accessible and affordable. Architected a machine learning-driven solution optimized for diverse complexions, particularly within the Philippine market.<br><br>' +
        '<strong>Key Features & Implementation:</strong><br>' +
        '• <strong>End-to-End Architecture:</strong> Designed UX in Figma and built cross-platform application in Flutter/Dart with Supabase backend.<br>' +
        '• <strong>AI/ML Integration:</strong> Google ML Kit and an AR virtual try-on layer to analyze facial features accurately via smartphone cameras.<br>' +
        '• <strong>Cohesive User Journey:</strong> Seamless onboarding flow and intuitive "Color Academy" dashboard tracking user color analysis progress.'
    },
    'sp-madrid-dubai': {
      badge: 'Corporate Web • Case Study',
      title: 'S.P. Madrid Dubai Hub: Corporate Landing Page',
      subtitle: 'S.P. Madrid & Associates (Internship) • UI/UX Designer & Frontend Developer',
      body: '<strong>Tech Stack & Tools:</strong> Figma, Visual Studio Code, Next.js, Tailwind CSS, Vercel<br><br>' +
        '<strong>Project Overview:</strong> I spearheaded the UI/UX design and frontend development for the S.P. Madrid Dubai Hub web presence. Digital front door for GCC debt recovery solutions requiring a highly professional, trustworthy, and internationally accessible design.<br><br>' +
        '<strong>Key Features & Implementation:</strong><br>' +
        '• <strong>Corporate Branding & Trust:</strong> Authoritative visual design featuring partner institution logos and team profiles.<br>' +
        '• <strong>Responsive Frontend Build:</strong> Clean, responsive code translated from Figma mockups and deployed to Vercel with custom domain.<br>' +
        '• <strong>Multi-Language Accessibility:</strong> Multi-language interface supporting Arabic, English, Hindi, and Filipino for GCC demographics.'
    },
    'lean-it': {
      badge: 'Client-Based CRM • Case Study',
      title: 'Lean IT Solutions: Client-Based CRM System',
      subtitle: 'Academic Project (2024) • UI/UX Designer & Frontend Developer',
      body: '<strong>Tech Stack & Tools:</strong> Figma, HTML, CSS, JavaScript, Visual Studio Code<br><br>' +
        '<strong>Project Overview:</strong> I was tasked with simplifying dense data workflows and multi-step reporting processes for a real-world client. Designed and developed a clean, modern CRM interface focused on data clarity and ease of use.<br><br>' +
        '<strong>Key Features & Implementation:</strong><br>' +
        '• <strong>Data Visualization & Layout:</strong> Minimalist design aesthetic with fluid visual accents making dense tabular data easy to read.<br>' +
        '• <strong>Frictionless Navigation:</strong> Intuitive prototypes across 5+ reporting modules improving task completion speed.'
    },
    'quizard': {
      badge: 'Educational 2D Game • Case Study',
      title: 'Quizard: Educational 2D Adventure Game',
      subtitle: '1st Year College Project • Game UI Designer & Frontend Developer',
      body: '<strong>Tech Stack & Tools:</strong> Figma, Krita, NetBeans (Java)<br><br>' +
        '<strong>Project Overview:</strong> I designed and developed the frontend for Quizard, an engaging educational 2D game centered around testing players on random facts and general knowledge.<br><br>' +
        '<strong>Key Features & Implementation:</strong><br>' +
        '• <strong>Art Direction & Asset Creation:</strong> Visual direction in Krita creating original character designs, magical UI elements, and 2D world assets.<br>' +
        '• <strong>Game UI Integration:</strong> Menus, leaderboards, and game HUDs prototyped in Figma before implementing in Java/NetBeans.'
    },
    'prismport': {
      badge: 'Editorial Platform • Case Study',
      title: 'Prismport: Editorial Art History Platform',
      subtitle: 'UI/UX Design & Layout Concept • UI/UX Designer',
      body: '<strong>Tech Stack & Tools:</strong> Figma, UI/UX, Classical Typography, Layout Design<br><br>' +
        '<strong>Project Overview:</strong> I designed an immersive, editorial-style web experience celebrating historical achievements of 20 international and national artists, prominently featuring expansive profiles on figures like Gustave Doré.<br><br>' +
        '<strong>Key Features & Implementation:</strong><br>' +
        '• <strong>Typographic Hierarchy:</strong> Bold classical serif typography paired with striking red accents creating a magazine-like reading experience.<br>' +
        '• <strong>Historical Timeline Design:</strong> Structured layout guiding users through chronological milestones and iconic pieces, balancing dense text with high-impact imagery.'
    }
  };

  // Bind Web Project Case Study buttons
  document.querySelectorAll('.web-project-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.web-project-card');
      const projectKey = card ? card.getAttribute('data-project-key') : null;
      const data = projectKey ? projectDetails[projectKey] : null;
      if (data) {
        openInfoPopup(data.badge, data.title, data.subtitle, data.body);
      }
    });
  });

  // Attach accordion toggle behavior for Certifications Timeline
  document.querySelectorAll('.cert-timeline-card').forEach(card => {
    card.addEventListener('click', () => {
      const item = card.closest('.cert-timeline-item');
      if (item) {
        const wasActive = item.classList.contains('active');
        item.classList.toggle('active', !wasActive);
      }
    });
  });

  // Update Certifications Timeline Scroll Progress & Node Illumination
  function updateCertTimelineProgress() {
    const certSection = document.getElementById('certifications');
    const progressFill = document.getElementById('certTimelineProgress');
    if (!certSection || !progressFill) return;

    const rect = certSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight && rect.bottom >= 0) {
      const sectionHeight = rect.height;
      const scrollPos = (windowHeight * 0.65) - rect.top;
      const progressPercent = Math.min(Math.max((scrollPos / sectionHeight) * 100, 0), 100);
      progressFill.style.height = `${progressPercent}%`;

      // Auto-illuminate timeline star nodes & cards based on scroll progress
      const items = Array.from(certSection.querySelectorAll('.cert-timeline-item'));
      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const node = item.querySelector('.cert-timeline-node');
        const triggerThreshold = windowHeight * 0.68;

        if (itemRect.top <= triggerThreshold) {
          item.classList.add('illuminated');
          if (node) node.classList.add('illuminated');
        } else {
          item.classList.remove('illuminated');
          if (node) node.classList.remove('illuminated');
        }
      });
    }
  }

  window.addEventListener('scroll', updateCertTimelineProgress, { passive: true });
  updateCertTimelineProgress();

  // Attach pop-up trigger for Location Block & Text
  document.querySelectorAll('.figma-location-item, .footer-location-text, .figma-location-pill, .footer-location-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      openInfoPopup(
        'Location & Availability',
        'Plaridel, Bulacan',
        'Philippines • Work Availability',
        'Primary location based in Plaridel, Bulacan. Available and actively open for Remote opportunities worldwide as well as on-site / hybrid positions and nearby relocation.'
      );
    });
  });

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
  // 10. PINTEREST-STYLE MASONRY BOARD & FILTER SYSTEM (ARTWORKS)
  // - Category filtering for 34 Creative Artworks
  // - Smooth stagger animations and active counts
  // ============================================================
  function initPinterestBoard() {
    const filterBar = document.getElementById('pinterestFilterBar');
    const grid = document.getElementById('pinterestGrid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.pin-card'));
    const filterPills = filterBar ? Array.from(filterBar.querySelectorAll('.filter-pill')) : [];

    function applyFilter(category) {
      // Update filter pills active state
      filterPills.forEach(pill => {
        const isMatch = pill.getAttribute('data-filter') === category;
        pill.classList.toggle('active', isMatch);
        pill.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      // Switch single title image smoothly (one title at a time)
      const singleTitleImg = document.getElementById('artSingleTitleImg');
      if (singleTitleImg) {
        const isTrad = (category === 'traditional-art');
        const targetSrc = isTrad ? 'asset/title_traditional_art.png' : 'asset/title_digital_art.png';
        const targetAlt = isTrad ? 'Traditional Art' : 'Digital Art';

        if (!singleTitleImg.src.endsWith(targetSrc)) {
          singleTitleImg.style.opacity = '0';
          singleTitleImg.style.transform = 'scale(0.92)';
          setTimeout(() => {
            singleTitleImg.src = targetSrc;
            singleTitleImg.alt = targetAlt;
            singleTitleImg.style.opacity = '1';
            singleTitleImg.style.transform = 'scale(1)';
          }, 180);
        }
      }

      // Filter cards
      let delay = 0;
      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = (category === 'all' || cardCategory === category);

        card.classList.remove('pin-animating');

        if (shouldShow) {
          card.classList.remove('pin-hidden');
          setTimeout(() => {
            card.classList.add('pin-animating');
          }, delay);
          delay += 20;
        } else {
          card.classList.add('pin-hidden');
        }
      });
    }

    // Filter pill click listeners
    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = pill.getAttribute('data-filter');
        applyFilter(filter);
      });
    });

    // Navbar link trigger hooks
    document.querySelectorAll('[data-filter-trigger]').forEach(navLink => {
      navLink.addEventListener('click', () => {
        const targetCategory = navLink.getAttribute('data-filter-trigger');
        if (targetCategory) {
          applyFilter(targetCategory);
        }
      });
    });

    // Initial default preview: All Art (or hash if deep-linked)
    let initialCategory = 'all';
    const initialHash = window.location.hash;
    if (initialHash === '#digital-art') {
      initialCategory = 'digital-art';
    } else if (initialHash === '#traditional-art') {
      initialCategory = 'traditional-art';
    }
    applyFilter(initialCategory);
  }

  initPinterestBoard();

  // ============================================================
  // 11. UNIFIED LIGHTBOX SYSTEM (WEB APPS & 34 ARTWORKS)
  // - High-resolution view with zoom controls (in, out, reset, click to zoom)
  // - Dynamic tall-mode vertical scrolling for full-page UI/UX mockups
  // - Counter, prev/next navigation, keyboard shortcuts, swipe support
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

    // Collect all project and pin card images
    const allGalleryItems = Array.from(document.querySelectorAll('.web-project-card, .pin-card'));
    const uniqueImages = [];
    allGalleryItems.forEach(card => {
      const img = card.querySelector('img');
      if (img && !uniqueImages.includes(img.src)) {
        uniqueImages.push(img.src);
      }
    });

    // Bind click events on Web Project cards to open Lightbox
    document.querySelectorAll('.web-project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.web-project-details-btn')) return;
        const img = card.querySelector('img');
        if (img) {
          const idx = uniqueImages.indexOf(img.src);
          openLightbox(idx >= 0 ? idx : 0);
        }
      });
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
          // Tall / Long image (Website case study mockup) -> Full width & vertically scrollable
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
            lightboxScrollHint.innerHTML = 'Scroll to view full case study';
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
            lightboxScrollHint.innerHTML = 'Click or Pinch to Zoom';
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

    // Attach click listeners to all pin cards (Artworks)
    document.querySelectorAll('.pin-card').forEach(card => {
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

  // ===== 12. ANTI-PIRACY & ARTWORK PROTECTION =====
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.pin-card') || e.target.closest('.lightbox-img')) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('.pin-card')) {
      e.preventDefault();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U' || e.key === 'p' || e.key === 'P')) {
      e.preventDefault();
    }
  });

});
