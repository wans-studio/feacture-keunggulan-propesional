// ===================================
// Intersection Observer for Scroll Animations
// ===================================

class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.init();
    }
    
    init() {
        // Create observer for AOS animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    
                    // Optional: Unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        // Observe all elements with data-aos attribute
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => observer.observe(el));
    }
}

// ===================================
// Carousel Functionality
// ===================================

class Carousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = Array.from(this.track.children);
        this.nextButton = container.querySelector('.carousel-btn-next');
        this.prevButton = container.querySelector('.carousel-btn-prev');
        this.indicators = Array.from(container.querySelectorAll('.carousel-indicator'));
        
        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        
        this.init();
    }
    
    init() {
        // Set initial position
        this.updateCarousel(0, false);
        
        // Event listeners
        this.nextButton.addEventListener('click', () => this.next());
        this.prevButton.addEventListener('click', () => this.prev());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Touch support
        this.addTouchSupport();
        
        // Autoplay
        this.startAutoplay();
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    updateCarousel(index, animate = true) {
        if (this.isAnimating && animate) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        
        // Update track position
        const offset = -index * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
            indicator.setAttribute('aria-selected', i === index);
        });
        
        // Update button states
        this.updateButtonStates();
        
        // Reset animation lock
        if (animate) {
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        } else {
            this.isAnimating = false;
        }
    }
    
    updateButtonStates() {
        // Enable/disable buttons based on position
        this.prevButton.disabled = this.currentIndex === 0;
        this.nextButton.disabled = this.currentIndex === this.slides.length - 1;
        
        // Update ARIA labels
        this.prevButton.setAttribute('aria-disabled', this.currentIndex === 0);
        this.nextButton.setAttribute('aria-disabled', this.currentIndex === this.slides.length - 1);
    }
    
    next() {
        if (this.currentIndex < this.slides.length - 1) {
            this.updateCarousel(this.currentIndex + 1);
            this.resetAutoplay();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.updateCarousel(this.currentIndex - 1);
            this.resetAutoplay();
        }
    }
    
    goToSlide(index) {
        this.updateCarousel(index);
        this.resetAutoplay();
    }
    
    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diff = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            isDragging = false;
        });
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            if (this.currentIndex < this.slides.length - 1) {
                this.next();
            } else {
                this.updateCarousel(0);
            }
        }, this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// ===================================
// Ripple Effect for Buttons
// ===================================

class RippleEffect {
    constructor() {
        this.init();
    }
    
    init() {
        const buttons = document.querySelectorAll('.cta-button, .feature-cta');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }
    
    createRipple(event, button) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// ===================================
// Smooth Scroll Enhancement
// ===================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===================================
// Performance Optimization
// ===================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images if any
        this.lazyLoadImages();
        
        // Add will-change on hover for better performance
        this.optimizeHoverEffects();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    optimizeHoverEffects() {
        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.willChange = 'transform';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.willChange = 'auto';
            });
        });
    }
}

// ===================================
// Accessibility Enhancements
// ===================================

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        // Skip to main content link
        this.addSkipLink();
        
        // Announce dynamic content changes
        this.setupAriaLive();
        
        // Keyboard trap prevention
        this.preventKeyboardTraps();
    }
    
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#features';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    setupAriaLive() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0,0,0,0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(liveRegion);
        
        // Store reference for announcements
        window.announceToScreenReader = (message) => {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        };
    }
    
    preventKeyboardTraps() {
        // Ensure Tab key works properly in all interactive elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = document.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select'
                );
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// ===================================
// Parallax Effect (Optional)
// ===================================

class ParallaxEffect {
    constructor() {
        this.init();
    }
    
    init() {
        const parallaxElements = document.querySelectorAll('.feature-icon-wrapper');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrolled;
                const speed = 0.05 * (index + 1);
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = -(scrolled - elementTop) * speed;
                    element.style.transform = `translateY(${yPos}px)`;
                }
            });
        });
    }
}

// ===================================
// Initialize All Components
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    new ScrollAnimator();
    
    // Initialize carousel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        new Carousel(carouselContainer);
    }
    
    // Initialize ripple effects
    new RippleEffect();
    
    // Initialize smooth scroll
    new SmoothScroll();
    
    // Initialize performance optimizations
    new PerformanceOptimizer();
    
    // Initialize accessibility enhancements
    new AccessibilityEnhancer();
    
    // Initialize parallax effect (optional)
    new ParallaxEffect();
    
    // Log initialization
    console.log('✨ Features section initialized successfully!');
});

// ===================================
// Handle Window Resize
// ===================================

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate carousel positions
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            const carousel = carouselContainer.carouselInstance;
            if (carousel) {
                carousel.updateCarousel(carousel.currentIndex, false);
            }
        }
    }, 250);
});

// ===================================
// Export for potential module usage
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ScrollAnimator,
        Carousel,
        RippleEffect,
        SmoothScroll,
        PerformanceOptimizer,
        AccessibilityEnhancer,
        ParallaxEffect
    };
}