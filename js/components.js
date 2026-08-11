/* ══════════════════════════════════════════
   COCOCORP — Shared Components & Behavior
   ══════════════════════════════════════════ */

(function() {
'use strict';

// ── Configuration ──
const PHONE = '27847314960';
const SOCIAL = {
    instagram: 'https://instagram.com/cococorp.tech',
    facebook: 'https://www.facebook.com/cococorp.tech',
    linkedin: 'https://www.linkedin.com/company/cococorp-tech',
    google: 'https://share.google/xpEfigXyGMM6ZN8jH'
};

const NAV_ITEMS = [
    { href: 'index.html', label: 'Home' },
    { href: 'services.html', label: 'Grow Online' },
    { href: 'digital-marketing.html', label: 'Digital Marketing' },
    { href: 'ai.html', label: 'AI for Business' },
    { href: 'about.html', label: 'About Us' },
    { href: 'blog.html', label: 'Blog' },
    { href: 'partner.html', label: 'Partner Program' },
];

const FOOTER_LINKS = [
    { href: 'about.html', label: 'About' },
    { href: 'services.html', label: 'Grow Online' },
    { href: 'digital-marketing.html', label: 'Digital Marketing' },
    { href: 'ai.html', label: 'AI Solutions' },
    { href: 'blog.html', label: 'Blog' },
    { href: 'faq.html', label: 'FAQ' },
    { href: 'partner.html', label: 'Partner Program' },
    { href: 'chat.html', label: 'AI Chat' },
    { href: 'index.html#contact', label: 'Contact' },
    { href: 'privacy.html', label: 'Privacy Policy' },
];

// ── Detect current page ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ── Inject Navigation ──
function buildNav() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const links = NAV_ITEMS.map(item => {
        const isActive = (currentPage === item.href) ||
            (currentPage === '' && item.href === 'index.html') ||
            (currentPage === '/' && item.href === 'index.html') ||
            (currentPage.startsWith('blog-') && item.href === 'blog.html');
        return `<a href="${item.href}" ${isActive ? 'class="active"' : ''}>${item.label}</a>`;
    }).join('');

    nav.innerHTML = `
        <div class="nav-inner">
            <a href="index.html" class="nav-logo"><span class="coco">COCO</span><span class="corp">CORP</span></a>
            <div class="nav-links">${links}<a href="chat.html" class="nav-chat"><i class="fas fa-comments"></i> AI Chat</a><a href="index.html#contact" class="nav-cta">Contact Us</a></div>
            <button class="mobile-toggle" id="mobileToggle" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>`;
}

// ── Inject Mobile Menu ──
function buildMobileMenu() {
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.id = 'mobileMenu';
    const links = NAV_ITEMS.map(item => `<a href="${item.href}">${item.label}</a>`).join('');
    menu.innerHTML = `<button class="mobile-menu-close" id="mobileClose" aria-label="Close">×</button>${links}<a href="chat.html" style="color:#2563EB;"><i class="fas fa-comments" style="margin-right:0.5rem;"></i>AI Chat</a><a href="index.html#contact" id="mobileContactLink">Contact Us</a>`;
    document.body.appendChild(menu);
}

// ── Inject Footer ──
function buildFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const links = FOOTER_LINKS.map(l => {
        if (l.href === 'chat.html') {
            return `<a href="${l.href}" class="footer-chat-btn"><i class="fas fa-comments"></i> ${l.label}</a>`;
        }
        return `<a href="${l.href}">${l.label}</a>`;
    }).join('');
    footer.innerHTML = `
        <p>© ${new Date().getFullYear()} COCOCORP – Small Business Tech & AI Specialists.</p>
        <div class="footer-links">${links}</div>
        <div class="footer-social">
            <a href="${SOCIAL.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="${SOCIAL.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="${SOCIAL.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
            <a href="${SOCIAL.google}" target="_blank" rel="noopener" aria-label="Google Business"><i class="fab fa-google"></i></a>
        </div>`;
}

// ── Inject Floating Social ──
function buildFloatingSocial() {
    const bar = document.createElement('div');
    bar.className = 'floating-social';
    bar.innerHTML = `
        <a href="${SOCIAL.instagram}" target="_blank" rel="noopener" aria-label="Instagram" class="ig"><i class="fab fa-instagram"></i></a>
        <a href="${SOCIAL.facebook}" target="_blank" rel="noopener" aria-label="Facebook" class="fb"><i class="fab fa-facebook-f"></i></a>
        <a href="${SOCIAL.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn" class="li"><i class="fab fa-linkedin-in"></i></a>`;
    document.body.appendChild(bar);
}

// ── Inject Cursor, Grain & Global Particles ──
function buildOverlays() {
    const isMobile = window.innerWidth <= 768;

    // Global particle canvas (desktop/tablet only)
    if (!isMobile) {
        const canvas = document.createElement('canvas');
        canvas.id = 'globalCanvas';
        canvas.className = 'global-canvas';
        document.body.prepend(canvas);

        // Grain overlay (desktop only)
        const grain = document.createElement('div');
        grain.className = 'grain';
        document.body.appendChild(grain);

        // Custom cursor (desktop only)
        const dot = document.createElement('div');
        dot.className = 'cursor-dot'; dot.id = 'cursorDot';
        const ring = document.createElement('div');
        ring.className = 'cursor-ring'; ring.id = 'cursorRing';
        document.body.appendChild(dot);
        document.body.appendChild(ring);
    }
}

// ── Custom Cursor Behavior ──
function initCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    });

    function animateRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, [data-tilt], .flip-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
}

// ── Nav Scroll Effect ──
function initNavScroll() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                nav.classList.toggle('scrolled', window.scrollY > 60);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    // Check on load
    if (window.scrollY > 60) nav.classList.add('scrolled');
}

// ── Mobile Menu ──
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    const close = document.getElementById('mobileClose');
    if (!toggle || !menu || !close) return;

    toggle.addEventListener('click', () => {
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
        menu.querySelectorAll('a').forEach((a, i) => {
            a.style.transitionDelay = i * 0.06 + 's';
        });
    });
    const closeMenu = () => { menu.classList.remove('open'); document.body.style.overflow = ''; };
    close.addEventListener('click', closeMenu);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// ── Scroll Reveal ──
function initScrollEngine() {
    // Split .scroll-words headings into word spans
    document.querySelectorAll('.scroll-words').forEach(el => {
        if (el.querySelector('.sw')) return;
        const text = el.textContent.trim();
        el.innerHTML = text.split(/\s+/).map(w => `<span class="sw">${w}</span>`).join('');
    });

    // Assign stagger indices
    document.querySelectorAll('.scroll-stagger').forEach(group => {
        [...group.children].forEach((child, i) => child.style.setProperty('--si', i));
    });

    // Trigger-once observer for .reveal and .scroll-para
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .scroll-para').forEach(el => observer.observe(el));

    // Trigger-once observer for .scroll-words (stagger words in on reveal)
    const wordObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const words = entry.target.querySelectorAll('.sw');
                words.forEach((w, i) => {
                    setTimeout(() => w.classList.add('lit'), i * 60);
                });
                wordObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.scroll-words').forEach(el => wordObserver.observe(el));
}

// ── 3D Card Tilt ──
function initCardTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            if (!card.classList.contains('visible') && card.classList.contains('scroll-para')) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / (rect.height / 2) * -6;
            const rotateY = (x - rect.width / 2) / (rect.width / 2) * 6;
            card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.1s ease'; });
    });
}

// ── Particle Canvas ──
window.initParticles = function(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const isTablet = window.innerWidth <= 1024;
    const COUNT = isTablet ? 40 : 80;
    const DIST = isTablet ? 120 : 150;
    const MRAD = 200;

    function resize() {
        const dpr = Math.min(window.devicePixelRatio, 2);
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    const COLORS = [
        '236,72,153',   // pink
        '236,72,153',   // pink (weighted)
        '37,99,235',    // blue
        '37,99,235',    // blue (weighted)
        '29,78,216',    // deep blue
        '5,150,105',    // green
        '255,255,255'   // white
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.offsetWidth;
            this.y = Math.random() * canvas.offsetHeight;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.6 + 0.25;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > canvas.offsetWidth) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.offsetHeight) this.vy *= -1;
            // Gentle drift toward mouse (attract, not repel)
            if (mouse.x !== null) {
                const dx = mouse.x - this.x, dy = mouse.y - this.y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < MRAD && d > 30) {
                    this.vx += dx * 0.00015;
                    this.vy += dy * 0.00015;
                }
            }
            this.vx *= 0.99; this.vy *= 0.99;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < COUNT; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        particles.forEach(p => { p.update(); p.draw(); });

        // Ambient connections between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99,145,255,${(1 - d / DIST) * 0.18})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        // Mouse constellation: connect mouse to nearby particles + boost connections between them
        if (mouse.x !== null) {
            const nearby = [];
            particles.forEach(p => {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < MRAD) nearby.push({ p, d });
            });

            // Lines from mouse to each nearby particle
            nearby.forEach(({ p, d }) => {
                const alpha = (1 - d / MRAD) * 0.5;
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(p.x, p.y);
                ctx.strokeStyle = `rgba(236,72,153,${alpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                // Brighten particle near mouse
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r + 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(236,72,153,${alpha * 0.6})`;
                ctx.fill();
            });

            // Boost connections between nearby particles
            for (let i = 0; i < nearby.length; i++) {
                for (let j = i + 1; j < nearby.length; j++) {
                    const dx = nearby[i].p.x - nearby[j].p.x;
                    const dy = nearby[i].p.y - nearby[j].p.y;
                    const d = Math.sqrt(dx*dx + dy*dy);
                    if (d < MRAD) {
                        ctx.beginPath();
                        ctx.moveTo(nearby[i].p.x, nearby[i].p.y);
                        ctx.lineTo(nearby[j].p.x, nearby[j].p.y);
                        ctx.strokeStyle = `rgba(99,145,255,${(1 - d / MRAD) * 0.4})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        requestAnimationFrame(animate);
    }

    const isGlobal = canvasId === 'globalCanvas';
    const mouseTarget = isGlobal ? document : canvas;
    mouseTarget.addEventListener('mousemove', e => {
        if (isGlobal) {
            mouse.x = e.clientX; mouse.y = e.clientY;
        } else {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
        }
    });
    if (!isGlobal) canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    window.addEventListener('resize', resize);
    init(); animate();
};

// ── Hero Entrance Animation ──
window.initHeroEntrance = function() {
    const words = document.querySelectorAll('.hero-title .word');
    const eyebrow = document.querySelector('.hero-eyebrow');
    const sub = document.querySelector('.hero-sub');
    const buttons = document.querySelector('.hero-buttons');
    const scroll = document.querySelector('.hero-scroll');

    if (eyebrow) setTimeout(() => { eyebrow.style.transition = 'all 0.6s ease'; eyebrow.style.opacity = 1; eyebrow.style.transform = 'translateY(0)'; }, 300);
    words.forEach((word, i) => setTimeout(() => word.classList.add('visible'), 600 + i * 100));
    if (sub) setTimeout(() => { sub.style.transition = 'all 0.8s ease'; sub.style.opacity = 1; sub.style.transform = 'translateY(0)'; }, 600 + words.length * 100 + 200);
    if (buttons) setTimeout(() => { buttons.style.transition = 'all 0.8s ease'; buttons.style.opacity = 1; buttons.style.transform = 'translateY(0)'; }, 600 + words.length * 100 + 500);
    if (scroll) setTimeout(() => { scroll.style.transition = 'all 0.8s ease'; scroll.style.opacity = 0.5; }, 600 + words.length * 100 + 800);
};

// ── Currency Conversion ──
const RATES = { ZAR: 1, USD: 0.054, GBP: 0.043, EUR: 0.050 };
const SYMBOLS = { ZAR: 'R', USD: '$', GBP: '£', EUR: '€' };
let activeCurrency = 'ZAR';

window.setCurrency = function(code) {
    activeCurrency = code;
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.currency === code);
    });
    document.querySelectorAll('[data-price-zar]').forEach(el => {
        const zar = parseFloat(el.dataset.priceZar);
        const converted = Math.round(zar * RATES[code]);
        const formatted = code === 'ZAR'
            ? `R${zar.toLocaleString()}`
            : `${SYMBOLS[code]}${converted.toLocaleString()}`;
        el.textContent = formatted;
    });
};

// ── WhatsApp Form Handler ──
window.initWhatsAppForm = function(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = form.querySelector('[name="name"]')?.value;
        const email = form.querySelector('[name="email"]')?.value;
        const business = form.querySelector('[name="business"]')?.value;
        const challenge = form.querySelector('[name="challenge"]')?.value;
        const errorEl = form.querySelector('.contact-error');
        if (!name || !email || !challenge) {
            if (errorEl) errorEl.style.display = 'block';
            return;
        }
        if (errorEl) errorEl.style.display = 'none';
        const msg = encodeURIComponent(`👋 New Lead from COCOCORP Website!\n\n*Contact Name:* ${name}\n*Email:* ${email}\n*Business Name:* ${business || 'N/A'}\n\n*Message:*\n${challenge}`);
        window.open(`https://wa.me/${PHONE}?text=${msg}`, '_blank');
    });
};

// ── Auto-scroll horizontal tracks ──
window.initAutoScroll = function(trackId) {
    const track = document.getElementById(trackId);
    if (!track) return;
    let scrollAmt = 0, direction = 1, paused = false;
    track.addEventListener('mouseenter', () => paused = true);
    track.addEventListener('mouseleave', () => paused = false);
    track.addEventListener('touchstart', () => paused = true, { passive: true });
    track.addEventListener('touchend', () => setTimeout(() => paused = false, 3000));
    function scroll() {
        if (!paused) {
            scrollAmt += 0.5 * direction;
            if (scrollAmt >= track.scrollWidth - track.clientWidth) direction = -1;
            if (scrollAmt <= 0) direction = 1;
            track.scrollLeft = scrollAmt;
        } else { scrollAmt = track.scrollLeft; }
        requestAnimationFrame(scroll);
    }
    scroll();
};

// ── Analytics Event Tracking ──
function initEventTracking() {
    if (typeof gtag !== 'function') return;

    // Track WhatsApp CTA clicks
    document.querySelectorAll('a[href*="wa.me"], button[type="submit"]').forEach(el => {
        el.addEventListener('click', () => {
            gtag('event', 'whatsapp_click', { event_category: 'CTA', event_label: el.textContent.trim().substring(0, 40) });
        });
    });

    // Track outbound links (portfolio, social)
    document.querySelectorAll('a[target="_blank"]').forEach(el => {
        el.addEventListener('click', () => {
            gtag('event', 'outbound_click', { event_category: 'Outbound', event_label: el.href });
        });
    });

    // Track currency toggle
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            gtag('event', 'currency_switch', { event_category: 'Engagement', event_label: btn.dataset.currency });
        });
    });

    // Track nav clicks
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(el => {
        el.addEventListener('click', () => {
            gtag('event', 'nav_click', { event_category: 'Navigation', event_label: el.textContent.trim() });
        });
    });
}

// ── POPIA Cookie Notice ──
function buildCookieNotice() {
    if (localStorage.getItem('cc_cookies') === 'accepted') return;

    const bar = document.createElement('div');
    bar.id = 'cookieBar';
    bar.innerHTML = `
        <div style="position:fixed;bottom:0;left:0;right:0;z-index:90;background:rgba(15,23,42,0.95);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,0.08);padding:1rem 2rem;display:flex;align-items:center;justify-content:center;gap:1.5rem;flex-wrap:wrap;">
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.6);margin:0;max-width:600px;line-height:1.5;">This site uses cookies for analytics and to improve your experience. By continuing to browse, you consent to our use of cookies in accordance with POPIA. Read our <a href="privacy.html" style="color:#EC4899;text-decoration:underline;">Privacy Policy</a>.</p>
            <div style="display:flex;gap:0.75rem;flex-shrink:0;">
                <button onclick="acceptCookies()" style="padding:0.5rem 1.25rem;font-size:0.75rem;font-weight:700;color:#fff;background:#2563EB;border:none;border-radius:100px;cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;">Accept</button>
                <button onclick="declineCookies()" style="padding:0.5rem 1.25rem;font-size:0.75rem;font-weight:700;color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:100px;cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;">Decline</button>
            </div>
        </div>`;
    document.body.appendChild(bar);
}

window.acceptCookies = function() {
    localStorage.setItem('cc_cookies', 'accepted');
    document.getElementById('cookieBar')?.remove();
};
window.declineCookies = function() {
    localStorage.setItem('cc_cookies', 'declined');
    document.getElementById('cookieBar')?.remove();
    // Disable GA if declined
    window['ga-disable-G-G3QEERCYFN'] = true;
};

// ── Sticky WhatsApp CTA ──
function buildWhatsAppCTA() {
    // Don't show on chat page or portal
    if (currentPage === 'chat.html' || currentPage === 'portal.html') return;
    const btn = document.createElement('a');
    btn.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent("Hi COCOCORP! I'm interested in the free website demo.");
    btn.target = '_blank';
    btn.className = 'wa-sticky';
    btn.innerHTML = '<i class="fab fa-whatsapp"></i><span class="wa-sticky-text">Free Demo</span>';
    btn.setAttribute('aria-label', 'Get a free demo via WhatsApp');
    document.body.appendChild(btn);
    // Show after 2s delay
    setTimeout(function() { btn.classList.add('wa-sticky-show'); }, 2000);
}

// ── Exit Intent Popup ──
function buildExitIntent() {
    if (currentPage === 'chat.html' || currentPage === 'portal.html') return;
    if (sessionStorage.getItem('cc_exit_shown')) return;

    const overlay = document.createElement('div');
    overlay.id = 'exitOverlay';
    overlay.className = 'exit-overlay';
    overlay.innerHTML = `
        <div class="exit-box">
            <button class="exit-close" onclick="closeExit()" aria-label="Close">&times;</button>
            <div class="exit-icon"><i class="fas fa-gift"></i></div>
            <h2 class="exit-title">Wait — Your Free Demo Is Ready</h2>
            <p class="exit-desc">We'll build a custom landing page for your business at zero cost. If you love it, take it live. If not, no obligation.</p>
            <a href="https://wa.me/${PHONE}?text=${encodeURIComponent("Hi COCOCORP! I'd like my free website demo before I go.")}" target="_blank" class="exit-cta" onclick="closeExit()"><i class="fab fa-whatsapp" style="margin-right:0.5rem;"></i>Claim My Free Demo</a>
        </div>`;
    document.body.appendChild(overlay);

    // Desktop: mouse leaves viewport top
    document.addEventListener('mouseout', function exitHandler(e) {
        if (e.clientY <= 0 && !sessionStorage.getItem('cc_exit_shown')) {
            overlay.classList.add('exit-show');
            sessionStorage.setItem('cc_exit_shown', '1');
            document.removeEventListener('mouseout', exitHandler);
        }
    });

    // Mobile: 45s inactivity trigger
    let mobileTimer = setTimeout(function() {
        if (!sessionStorage.getItem('cc_exit_shown')) {
            overlay.classList.add('exit-show');
            sessionStorage.setItem('cc_exit_shown', '1');
        }
    }, 45000);

    // Reset timer on interaction
    ['scroll', 'touchstart', 'click'].forEach(function(evt) {
        document.addEventListener(evt, function() {
            clearTimeout(mobileTimer);
            mobileTimer = setTimeout(function() {
                if (!sessionStorage.getItem('cc_exit_shown')) {
                    overlay.classList.add('exit-show');
                    sessionStorage.setItem('cc_exit_shown', '1');
                }
            }, 45000);
        }, { passive: true });
    });
}

window.closeExit = function() {
    const ov = document.getElementById('exitOverlay');
    if (ov) ov.classList.remove('exit-show');
    sessionStorage.setItem('cc_exit_shown', '1');
};

// ── Google Rating Badge ──
window.buildRatingBadge = function(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
        <a href="https://share.google/xpEfigXyGMM6ZN8jH" target="_blank" class="rating-badge">
            <i class="fab fa-google" style="color:#4285F4;font-size:1.1rem;"></i>
            <div class="rating-stars">★★★★★</div>
            <div class="rating-text">5.0 on Google</div>
        </a>`;
};

// ── Initialize Everything ──
function init() {
    buildNav();
    buildMobileMenu();
    buildFooter();
    buildFloatingSocial();
    buildOverlays();
    initCursor();
    initNavScroll();
    initMobileMenu();
    initScrollEngine();
    initCardTilt();
    initParticles('globalCanvas');
    initEventTracking();
    buildCookieNotice();
    buildWhatsAppCTA();
    buildExitIntent();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();