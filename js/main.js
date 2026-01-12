/**
 * Morning Brew Collective - Core Application Logic
 * Handles navigation, scroll effects, and global UI state
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;
    
    if (menuToggle && mobileMenu) {
        const toggleMobileMenu = () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            const newState = !isExpanded;
            
            menuToggle.setAttribute('aria-expanded', newState);
            mobileMenu.setAttribute('aria-hidden', !newState);
            mobileMenu.classList.toggle('active', newState);
            
            // Prevent body scroll when menu is open
            body.style.overflow = newState ? 'hidden' : 'auto';
            
            // Focus first link when menu opens
            if (newState) {
                setTimeout(() => {
                    if (mobileNavLinks.length > 0) mobileNavLinks[0].focus();
                }, 300);
            }
        };
        
        menuToggle.addEventListener('click', toggleMobileMenu);
        if (mobileMenuClose) mobileMenuClose.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on nav links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle.getAttribute('aria-expanded') === 'true') {
                    toggleMobileMenu();
                }
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                toggleMobileMenu();
            }
        });
        
        // Close menu when clicking outside
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                toggleMobileMenu();
            }
        });
    }
    
    // ===== SCROLL-TRIGGERED ANIMATIONS =====
    const scrollAnimatedElements = document.querySelectorAll('.scroll-animated, .hero-content');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        scrollAnimatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        scrollAnimatedElements.forEach(element => {
            element.classList.add('visible');
        });
    }
    
    // ===== HEADER SCROLL EFFECTS =====
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.hero');
    
    if (header && heroSection) {
        const heroHeight = heroSection.offsetHeight;
        
        const updateHeader = () => {
            const scrollY = window.pageYOffset;
            
            if (scrollY > heroHeight * 0.3) {
                header.style.background = 'var(--nav-bg-mobile)';
            } else {
                header.style.background = 'var(--nav-bg-desktop)';
            }
        };

        window.addEventListener('scroll', updateHeader);
        
        // Initial check
        updateHeader();
    }
    
    // ===== SECTION BACKGROUND TRANSITIONS =====
    const sections = document.querySelectorAll('section');
    
    const updateBodyBackground = () => {
        const windowHeight = window.innerHeight;
        
        // Find which section is most visible
        let mostVisibleSection = null;
        let maxVisibility = 0;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Calculate how much of the section is visible in the viewport
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const visibility = Math.max(0, visibleHeight / windowHeight);
            
            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                mostVisibleSection = section;
            }
        });
        
        // Update body background based on active section
        if (mostVisibleSection) {
            if (mostVisibleSection.classList.contains('featured-menu')) {
                body.style.background = 'var(--bg-menu)';
            } else if (mostVisibleSection.classList.contains('heritage-story')) {
                body.style.background = 'var(--bg-heritage)';
            } else if (mostVisibleSection.classList.contains('location-section')) {
                body.style.background = 'var(--bg-location)';
            } else if (mostVisibleSection.classList.contains('footer')) {
                body.style.background = 'var(--bg-footer)';
            } else {
                body.style.background = 'var(--bg-hero)';
            }
        }
    };
    
    // Initialize and listen for scroll events
    updateBodyBackground();
    window.addEventListener('scroll', updateBodyBackground);
    window.addEventListener('resize', updateBodyBackground);
    
    // ===== INITIAL ANIMATION DELAY =====
    // Add slight delay to hero content for better entrance
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 300);
    }
});
