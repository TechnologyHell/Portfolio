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

    // 2. STICKY NAVBAR
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
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
});
