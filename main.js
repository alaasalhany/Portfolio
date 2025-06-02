// Configuration
const config = {
    typingSpeed: 120,
    pauseDuration: 800,
    particleCount: {
        mobile: 25,
        desktop: 50
    }
};

// DOM Elements
const elements = {
    menuBtn: document.getElementById('menuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    particles: document.getElementById('particles'),
    typingText: document.querySelector('.typing-text'),
    typingCursor: document.querySelector('.typing-cursor'),
    contactForm: document.getElementById('contactForm'),
    backToTop: document.getElementById('backToTop')
};

// Initialize AOS
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            offset: 120,
            once: true,
            disable: false // Enable on all devices
        });
        console.log('AOS initialized successfully');
    } else {
        console.error('AOS library not loaded');
    }
}

// Mobile Menu - Working Version
function initMobileMenu() {
    // Get elements directly to ensure they exist
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        // Add click event to menu button
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Toggle menu visibility
            const isActive = mobileMenu.classList.contains('active');

            if (isActive) {
                // Close menu
                mobileMenu.classList.remove('active');
            } else {
                // Open menu
                mobileMenu.classList.add('active');
            }

            // Toggle icon
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Add hover/touch effects and close menu when clicking navigation links
        const navLinks = mobileMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            // Add touch/tap effects for mobile
            link.addEventListener('touchstart', function() {
                this.classList.add('mobile-hover');
            });

            link.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('mobile-hover');
                }, 150);
            });

            // Close menu when clicking
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

    }
}

// Global function for inline onclick (backup method)
function toggleMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        // Toggle menu
        mobileMenu.classList.toggle('active');

        // Toggle icon
        const icon = menuBtn.querySelector('i');
        if (icon) {
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }


    }
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSelector = this.getAttribute('href');
            const target = document.querySelector(targetSelector);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Performance-Optimized Particle Background
function createParticles() {
    if (elements.particles) {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            // Create minimal static particles for reduced motion
            const staticParticleCount = 5;
            elements.particles.innerHTML = '';

            for (let i = 0; i < staticParticleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.opacity = '0.2';
                particle.style.animation = 'none';
                elements.particles.appendChild(particle);
            }
            return;
        }

        // Performance-optimized particle count
        const isMobile = window.innerWidth < 768;
        const isLowPowerDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
        const particleCount = isMobile ? (isLowPowerDevice ? 10 : 15) : (isLowPowerDevice ? 20 : 30);

        // Clear existing particles
        elements.particles.innerHTML = '';

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random positioning
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            // Staggered animation delays for natural movement
            particle.style.animationDelay = `${Math.random() * 20}s`;

            // Varied sizes for depth effect
            const size = Math.random() * 2 + 2; // 2-4px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Add variety with different animation durations
            const duration = 15 + Math.random() * 10; // 15-25s
            particle.style.animationDuration = `${duration}s`;

            // Some particles with secondary color for variety
            if (Math.random() > 0.7) {
                particle.classList.add('particle-secondary');
            }

            elements.particles.appendChild(particle);
        }
    }
}

// Typing Animation
function initTypingAnimation() {
    if (elements.typingText && elements.typingCursor) {
        const text = "Alaa Salhani"; // Text to type
        let charIndex = 0;
        let isTyping = false;

        function typeWriter() {
            if (!isTyping) {
                isTyping = true;
                elements.typingText.style.width = '0';
                elements.typingText.textContent = '';
                charIndex = 0;
                elements.typingCursor.style.opacity = '0.8';

                setTimeout(() => {
                    const type = () => {
                        if (charIndex < text.length) {
                            elements.typingText.textContent += text.charAt(charIndex);
                            // Ensure width calculation is correct if text content affects layout significantly
                            elements.typingText.style.width = 'auto'; // Let it naturally take width
                            charIndex++;
                            setTimeout(type, config.typingSpeed);
                        } else {
                            isTyping = false;
                            elements.typingCursor.style.animation = 'none'; // Stop blinking to keep it visible
                            setTimeout(() => {
                                elements.typingCursor.style.animation = 'blink 0.7s step-end infinite'; // Resume blinking
                            }, 10);
                        }
                    };
                    type();
                }, config.pauseDuration);
            }
        }

        const homeSection = document.querySelector('#home');

        if (homeSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typeWriter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(homeSection);
        } else {
            // Fallback: start typing immediately if home section not found
            setTimeout(typeWriter, 1000);
        }
    }
}

// Form Handling - Optimized version
function initFormHandling() {
    const form = elements.contactForm;
    if (!form) return;

    // Cache form elements for better performance
    const formElements = {
        name: form.querySelector('#name'),
        email: form.querySelector('#email'),
        message: form.querySelector('#message'),
        loadingState: form.querySelector('#loadingState'),
        submitButton: form.querySelector('#submitButton'),
        successMessage: form.querySelector('#successMessage'),
        errorMessage: form.querySelector('#errorMessage')
    };

    // Optimized validation patterns
    const validators = {
        name: /^[A-Za-z\s]{2,50}$/,
        email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
        message: (value) => value.length >= 10 && value.length <= 1000
    };

    // Debounced validation for better performance
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Real-time validation with debouncing
    const validateField = debounce((field, errorId) => {
        const errorElement = document.getElementById(errorId);
        if (!errorElement) return;

        let isValid = false;
        if (field.id === 'message') {
            isValid = validators.message(field.value);
        } else {
            isValid = validators[field.id]?.test(field.value);
        }

        errorElement.classList.toggle('visible', !isValid && field.value.length > 0);
    }, 300);

    // Add optimized event listeners
    Object.values(formElements).forEach(element => {
        if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
            element.addEventListener('input', () => {
                validateField(element, element.id + 'Error');
            });
        }
    });

    // Optimized form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        formElements.loadingState?.classList.remove('hidden');
        formElements.submitButton?.classList.add('hidden');

        // Validate all fields
        const isValid = validateAllFields();

        if (!isValid) {
            resetFormState();
            return;
        }

        try {
            const response = await fetch('https://formspree.io/f/xblyjgkz', {
                method: 'POST',
                body: new FormData(this),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showSuccess();
                this.reset();
                setTimeout(() => {
                    window.location.href = './success.html';
                }, 2000);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            showError();
            console.error('Form submission error:', error);
        }
    });

    function validateAllFields() {
        let isValid = true;

        // Validate name
        if (!validators.name.test(formElements.name?.value || '')) {
            document.getElementById('nameError')?.classList.add('visible');
            isValid = false;
        }

        // Validate email
        if (!validators.email.test(formElements.email?.value || '')) {
            document.getElementById('emailError')?.classList.add('visible');
            isValid = false;
        }

        // Validate message
        if (!validators.message(formElements.message?.value || '')) {
            document.getElementById('messageError')?.classList.add('visible');
            isValid = false;
        }

        return isValid;
    }

    function resetFormState() {
        formElements.loadingState?.classList.add('hidden');
        formElements.submitButton?.classList.remove('hidden');
    }

    function showSuccess() {
        formElements.loadingState?.classList.add('hidden');
        formElements.successMessage?.classList.remove('hidden');
    }

    function showError() {
        formElements.loadingState?.classList.add('hidden');
        formElements.errorMessage?.classList.remove('hidden');
        formElements.submitButton?.classList.remove('hidden');
    }
}


// Back to Top Button
function initBackToTop() {
    if (elements.backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                elements.backToTop.classList.add('visible');
            } else {
                elements.backToTop.classList.remove('visible');
            }
        });

        elements.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize all functions when DOM is loaded
function initializeApp() {
    initAOS();
    initMobileMenu();
    initSmoothScroll();
    createParticles();
    initTypingAnimation();
    initFormHandling();
    initBackToTop();
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle window resize for particles
window.addEventListener('resize', createParticles);

