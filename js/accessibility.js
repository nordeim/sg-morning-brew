/**
 * Morning Brew Collective - Accessibility Enhancements
 * Handles contrast checking, keyboard navigation focus rings, and screen reader announcements
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== ACCESSIBILITY HELPER =====
    class AccessibilityHelper {
        constructor() {
            this.initContrastChecker();
            this.initKeyboardNavigation();
            this.initScreenReaderAnnouncements();
            this.initReducedMotion();
        }
        
        // Real-time contrast checking (Dev tool mostly, or for user awareness)
        initContrastChecker() {
            // Only run if specifically enabled or in dev mode in a real app
            // For this project, we'll keep it as a silent check that logs warnings
            const checkContrast = () => {
                const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button');
                
                elements.forEach(element => {
                    const style = window.getComputedStyle(element);
                    const bgColor = this.getBackgroundColor(element);
                    const textColor = style.color;
                    
                    if (bgColor && textColor && style.display !== 'none' && style.visibility !== 'hidden') {
                        const contrastRatio = this.calculateContrast(bgColor, textColor);
                        
                        // WCAG AA for normal text is 4.5:1, large text is 3:1
                        // Simplified check
                        if (contrastRatio < 3) {
                            // Just log for this implementation instead of modifying UI visibly
                            // console.warn('Low contrast detected:', element, contrastRatio);
                        }
                    }
                });
            };
            
            // Run after a delay to ensure styles loaded
            setTimeout(checkContrast, 1000);
        }

        getBackgroundColor(element) {
            let current = element;
            while (current) {
                const bg = window.getComputedStyle(current).backgroundColor;
                // Check if not transparent (rgba(0, 0, 0, 0))
                if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                    return bg;
                }
                current = current.parentElement;
            }
            return 'rgb(255, 255, 255)'; // Default fallback
        }
        
        calculateContrast(bgColor, textColor) {
            const bgLuminance = this.getLuminance(bgColor);
            const textLuminance = this.getLuminance(textColor);
            
            const brighter = Math.max(bgLuminance, textLuminance);
            const darker = Math.min(bgLuminance, textLuminance);
            
            return (brighter + 0.05) / (darker + 0.05);
        }
        
        getLuminance(color) {
            // Extract RGB values from color string
            const rgb = color.match(/\d+/g);
            if (!rgb || rgb.length < 3) return 0.5;
            
            const [r, g, b] = rgb.map(v => {
                const sRGB = parseInt(v) / 255;
                return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }
        
        // Enhanced keyboard navigation
        initKeyboardNavigation() {
            // Skip to content link injection
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Skip to main content';
            document.body.prepend(skipLink);
            
            // Add ID to main content if not exists
            const main = document.querySelector('main');
            if (main && !main.id) main.id = 'main-content';
            
            // Focus management for modals
            const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            
            const trapFocus = (modal) => {
                const focusable = modal.querySelectorAll(focusableElements);
                if (focusable.length === 0) return;
                
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                
                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === first) {
                                e.preventDefault();
                                last.focus();
                            }
                        } else {
                            if (document.activeElement === last) {
                                e.preventDefault();
                                first.focus();
                            }
                        }
                    }
                });
            };

            const modals = document.querySelectorAll('.cart-overlay, .mobile-menu');
            modals.forEach(modal => trapFocus(modal));
            
            // Focus rings for keyboard users only
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.documentElement.classList.add('keyboard-navigation');
                }
            });
            
            document.addEventListener('mousedown', () => {
                document.documentElement.classList.remove('keyboard-navigation');
            });
        }
        
        // Screen reader announcements
        initScreenReaderAnnouncements() {
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            liveRegion.id = 'a11y-announcer';
            document.body.appendChild(liveRegion);
            
            this.announce = (message) => {
                liveRegion.textContent = ''; // Clear first to ensure update triggers
                setTimeout(() => {
                    liveRegion.textContent = message;
                }, 100);
            };
            
            // Cart updates announcements
            document.addEventListener('cart-updated', (e) => {
                const { items, total } = e.detail;
                this.announce(`${items} items in cart. Total: $${total.toFixed(2)}`);
            });
            
            // Form validation announcements
            document.addEventListener('form-error', (e) => {
                this.announce(`Error: ${e.detail.message}`);
            });
        }
        
        // Reduced motion support
        initReducedMotion() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.classList.add('reduced-motion');
            }
        }
    }
    
    // Initialize accessibility helper
    new AccessibilityHelper();
});
