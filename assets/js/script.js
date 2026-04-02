document.addEventListener('DOMContentLoaded', () => {

    // 1. CUSTOM CURSOR
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    const glow = document.querySelector('.cursor-glow');
    
    // Only enable if it's not a touchscreen
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Snappy follower, no delay
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
            
            // Move glow element
            if (glow) {
                glow.style.left = e.clientX + 'px';
                glow.style.top = e.clientY + 'px';
            }
        });

        // Add hover effect for clickable elements
        const clickables = document.querySelectorAll('a, button, .system-card, .proof-card');
        
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // 2. STICKY NAVBAR (Hides after Hero exit)
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        // 1. NAVBAR VISIBILITY (Hides after Hero exit)
        if (window.scrollY > window.innerHeight * 0.7) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 2. ARC REACTOR BRIGHTNESS (30% dimmer on Hero, normal elsewhere)
        const arcBg = document.querySelector('.arc-bg-container');
        if (arcBg) {
            // Trigger as soon as we start scrolling or leave the main hero focus
            if (window.scrollY > 300) { 
                arcBg.classList.add('past-hero');
            } else {
                arcBg.classList.remove('past-hero');
            }
        }
    });

    // 3. INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 4. MOBILE MENU (Basic implementation)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Very simple inline toggle for now
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(5, 5, 5, 0.95)';
                navLinks.style.padding = '20px';
                navLinks.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    // 5. PARALLAX / TILT EFFECT ON SYSTEM CARDS
    const cards = document.querySelectorAll('.system-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Max rotation 4 degrees
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            
            // Disable transition for snappy following
            card.style.transition = 'none';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Restore transition for smooth reset
            card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 6. DYNAMIC HERO MICRO-TEXT
    const microText = document.querySelector('.hero-content .micro-text');
    if (microText) {
        const texts = [
            "> initializing system interface...",
            "> checking kernel status...",
            "> syncing hardware nodes...",
            "> system status: ACTIVE",
            "> all modules operational...",
            "> monitoring network flux...",
            "> architecting hardware layers...",
            "> compiling system logic..."
        ];
        let currentTextIndex = 0;
        
        setInterval(() => {
            currentTextIndex = (currentTextIndex + 1) % texts.length;
            microText.style.opacity = 0;
            
            setTimeout(() => {
                microText.textContent = texts[currentTextIndex];
                microText.style.opacity = 0.8;
            }, 500); // Fade out then swap
        }, 4000);
    }

    // 6.5 DYNAMIC SPOTLIGHT & TILT (Proof & Achievement Cards)
    const spotlightCards = document.querySelectorAll('.proof-card, .ach-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Smoothly prepare the card for tilt tracking
            card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Background spotlight position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Slightly more pronounced tilt effect (max 12 degrees for high-end HUD depth)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;
            
            // Transition is snappy but has a tiny bit of weight (0.15s)
            card.style.transition = 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.04)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
        });
    });

    // 7. INTERACTIVE HERO ORB (Jarvis TECH Core)
    const techCore = document.querySelector('.tech-core');
    const heroSection = document.querySelector('#hero');
    
    if (techCore && heroSection && window.matchMedia("(pointer: fine)").matches) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = techCore.getBoundingClientRect();
            const coreX = rect.left + rect.width / 2;
            const coreY = rect.top + rect.height / 2;
            
            const diffX = e.clientX - coreX;
            const diffY = e.clientY - coreY;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);
            
            // Magnetic tilt: move core assembly towards cursor
            const maxMove = 25;
            const moveX = (diffX / window.innerWidth) * maxMove;
            const moveY = (diffY / window.innerHeight) * maxMove;
            
            techCore.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${-moveY * 0.4}deg) rotateY(${moveX * 0.4}deg)`;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            techCore.style.transform = `translate(0, 0) rotateX(0) rotateY(0)`;
        });
    }

    // 8. ZERO-GRAVITY BUILD MATRIX
    const stackTags = document.querySelectorAll('.stack-tag');
    const tagsData = [];

    stackTags.forEach(tag => {
        tagsData.push({
            el: tag,
            x: 0, y: 0,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            originX: 0,
            originY: 0
        });
    });

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updatePhysics() {
        tagsData.forEach(data => {
            const rect = data.el.getBoundingClientRect();
            const tagCenterX = rect.left + rect.width / 2;
            const tagCenterY = rect.top + rect.height / 2;

            const dx = mouseX - tagCenterX;
            const dy = mouseY - tagCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Mouse Repulsion (Reduced sensitivity)
            if (dist < 150) {
                const force = (150 - dist) / 150;
                data.vx -= dx * force * 0.01; // Reduced from 0.03
                data.vy -= dy * force * 0.01;
            }

            // Return to origin (Spring)
            data.vx += (0 - data.x) * 0.008; // Softer spring
            data.vy += (0 - data.y) * 0.008;

            // Friction (Higher for smoother settling)
            data.vx *= 0.94;
            data.vy *= 0.94;

            // Ambient Drift (Removed random noise per frame to fix vibration)
            // Only adding very small velocity to keep things moving slowly
            data.vx += (Math.random() - 0.5) * 0.002;
            data.vy += (Math.random() - 0.5) * 0.002;

            data.x += data.vx;
            data.y += data.vy;

            // Limit displacement
            const limit = 30;
            data.x = Math.max(-limit, Math.min(limit, data.x));
            data.y = Math.max(-limit, Math.min(limit, data.y));

            data.el.style.transform = `translate3d(${data.x}px, ${data.y}px, 0)`;
        });
        requestAnimationFrame(updatePhysics);
    }

    if (stackTags.length > 0 && window.matchMedia("(pointer: fine)").matches) {
        requestAnimationFrame(updatePhysics);
    }
});
