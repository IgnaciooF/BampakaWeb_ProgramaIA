/* ===========================================
   BAMPAKA — MAIN SCRIPT
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // =========================================
    // LOADER
    // =========================================
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loader-bar');
    const loaderPct = document.getElementById('loader-pct');
    let loadProgress = 0;

    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 15 + 5;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 700);
                initAnimations();
            }, 400);
        }
        loaderBar.style.width = loadProgress + '%';
        loaderPct.textContent = Math.floor(loadProgress) + '%';
    }, 100);

    // =========================================
    // CUSTOM CURSOR
    // =========================================
    const cursor = document.getElementById('cursor-dot');
    let cursorX = 0, cursorY = 0;
    let currentCursorX = 0, currentCursorY = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function updateCursor() {
            currentCursorX += (cursorX - currentCursorX) * 1.0;
            currentCursorY += (cursorY - currentCursorY) * 1.0;
            cursor.style.left = currentCursorX + 'px';
            cursor.style.top = currentCursorY + 'px';
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // Change cursor color based on section theme
        const sectionThemes = document.querySelectorAll('[data-theme]');
        const themeColors = {
            cyan: '#00FFE5',
            magenta: '#FF00FF',
            red: '#FF0000',
            purple: '#7B2FBE'
        };

        const themeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const theme = entry.target.dataset.theme;
                    cursor.style.backgroundColor = themeColors[theme] || '#FF00FF';
                }
            });
        }, { threshold: 0.3 });

        sectionThemes.forEach(section => themeObserver.observe(section));
    }

    // =========================================
    // SCROLL PROGRESS BAR
    // =========================================
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });

    // =========================================
    // NAV SCROLL BEHAVIOR
    // =========================================
    const nav = document.getElementById('nav');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // =========================================
    // SECTION REVEAL ON SCROLL
    // =========================================
    function initAnimations() {
        const revealElements = document.querySelectorAll('.section-reveal');
        const staggerTexts = document.querySelectorAll('.stagger-text');

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => sectionObserver.observe(el));

        // Stagger text animation
        staggerTexts.forEach(container => {
            const children = container.children;
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Array.from(children).forEach((child, i) => {
                            child.style.opacity = '0';
                            child.style.transform = 'translateY(30px)';
                            child.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
                            requestAnimationFrame(() => {
                                child.style.opacity = '1';
                                child.style.transform = 'translateY(0)';
                            });
                        });
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(container);
        });
    }

    // Start animations if loader already gone
    if (!loader || loader.classList.contains('hidden')) {
        initAnimations();
    }

    // =========================================
    // PARALLAX EFFECT
    // =========================================
    const parallaxElements = document.querySelectorAll('.paint-splash, .hero-vertical-text');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        parallaxElements.forEach((el, i) => {
            const speed = (i % 3 + 1) * 0.03;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // =========================================
    // KINETIC TEXT - Split words for animation
    // =========================================
    function createKineticText() {
        const targets = document.querySelectorAll('.kinetic-target');
        targets.forEach(el => {
            const text = el.textContent;
            el.innerHTML = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.className = 'kinetic-word';
                span.textContent = char === ' ' ? '\u00A0' : char;
                el.appendChild(span);
            });
        });
    }
    createKineticText();

    // =========================================
    // MANGA PANEL HOVER DISTORTION
    // =========================================
    document.querySelectorAll('.manga-panel').forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            panel.style.transform = `perspective(800px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
        });
        panel.addEventListener('mouseleave', () => {
            panel.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
            panel.style.transition = 'transform 0.5s ease-out';
        });
        panel.addEventListener('mouseenter', () => {
            panel.style.transition = 'transform 0.1s ease-out';
        });
    });

    // =========================================
    // VEHICLE CARD 3D TILT
    // =========================================
    document.querySelectorAll('.vehicle-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease-out';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease-out';
        });
    });

    // =========================================
    // GLITCH EFFECT INTENSIFIER ON SCROLL
    // =========================================
    const glitchElements = document.querySelectorAll('.glitch, .glitch-mini');
    let lastScrollTime = 0;

    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime < 50) return;
        lastScrollTime = now;

        const scrollSpeed = Math.abs(window.scrollY - (window._lastScroll || 0));
        window._lastScroll = window.scrollY;

        if (scrollSpeed > 30) {
            glitchElements.forEach(el => {
                el.style.animationDuration = '0.3s';
                setTimeout(() => {
                    el.style.animationDuration = '';
                }, 500);
            });
        }
    });

    // =========================================
    // DISTRICT CARD EFFECTS
    // =========================================
    document.querySelectorAll('.district-card').forEach(card => {
        const img = card.querySelector('img');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        });
    });

    // =========================================
    // CHROMATIC ABERRATION ON HOVER
    // =========================================
    document.querySelectorAll('.chromatic-hover').forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.textShadow = '-2px 0 #FF00FF, 2px 0 #00FFE5';
        });
        el.addEventListener('mouseleave', () => {
            el.style.textShadow = '';
        });
    });

    // =========================================
    // RANDOM GLITCH FLASH EFFECT
    // =========================================
    function randomGlitch() {
        const body = document.body;
        const glitchOverlay = document.createElement('div');
        glitchOverlay.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 9999;
            pointer-events: none;
            background: repeating-linear-gradient(
                0deg,
                transparent 0px,
                transparent 2px,
                rgba(0, 255, 229, 0.02) 2px,
                rgba(0, 255, 229, 0.02) 4px
            );
            animation: glitch-flash 0.15s ease-out forwards;
        `;
        body.appendChild(glitchOverlay);
        setTimeout(() => glitchOverlay.remove(), 200);
    }

    // Random glitch every 8-15 seconds
    setInterval(() => {
        if (Math.random() > 0.5) randomGlitch();
    }, 8000 + Math.random() * 7000);

    // =========================================
    // CANVAS NOISE (Subtle background grain)
    // =========================================
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 128;
    noiseCanvas.height = 128;
    const noiseCtx = noiseCanvas.getContext('2d');

    function generateNoise() {
        const imageData = noiseCtx.createImageData(128, 128);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 8; // very subtle
        }
        noiseCtx.putImageData(imageData, 0, 0);
        document.querySelector('.noise-overlay').style.backgroundImage = `url(${noiseCanvas.toDataURL()})`;
    }
    generateNoise();

    // Regenerate noise periodically for animation effect
    setInterval(generateNoise, 100);

    // =========================================
    // SMOOTH SCROLL FOR NAV LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // =========================================
    // HERO PARALLAX ON SCROLL
    // =========================================
    const hero = document.getElementById('hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const layers = hero.querySelectorAll('.hero-gradient, .speed-lines, .radial-burst');
                layers.forEach((layer, i) => {
                    const speed = (i + 1) * 0.1;
                    layer.style.transform = `translateY(${scrolled * speed}px)`;
                });
                // Fade out hero content
                const heroContent = hero.querySelector('.relative.z-10');
                if (heroContent) {
                    heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.6));
                    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
            }
        });
    }

    // =========================================
    // TRAILER PLAY BUTTON CLICK EFFECT
    // =========================================
    document.querySelectorAll('.group.cursor-pointer').forEach(btn => {
        btn.addEventListener('click', () => {
            // Create expanding ring effect
            const ring = document.createElement('div');
            ring.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 0;
                height: 0;
                border: 2px solid #FF00FF;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: ring-expand 0.8s ease-out forwards;
            `;
            document.body.appendChild(ring);
            setTimeout(() => ring.remove(), 900);
        });
    });

    // Add ring expand animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ring-expand {
            0% { width: 0; height: 0; opacity: 1; }
            100% { width: 200px; height: 200px; opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // =========================================
    // IMAGE LAZY LOAD WITH FADE IN
    // =========================================
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '';
        });
        // If already loaded
        if (img.complete) {
            img.style.opacity = '';
        }
    });

    // =========================================
    // PREVENT CONTEXT MENU ON IMAGES
    // =========================================
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    console.log('%c BAMPAKA ', 'background: #FF00FF; color: #000; font-size: 24px; font-weight: bold; padding: 10px 20px;');
    console.log('%c Enter The Race — 爆速 ', 'color: #00FFE5; font-size: 14px;');
});