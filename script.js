// ========================================
// DOM Elements
// ========================================
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const themeToggle = document.getElementById('theme-toggle');
const scrollToTopBtn = document.getElementById('scroll-to-top');
const loadingScreen = document.getElementById('loading-screen');
const contactForm = document.getElementById('contact-form');

// ========================================
// Theme Toggle
// ========================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
}

themeToggle.addEventListener('click', toggleTheme);

// ========================================
// Mobile Menu Toggle
// ========================================
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

hamburger.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// ========================================
// Smooth Scroll Navigation
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

initSmoothScroll();

// ========================================
// Active Navigation Link
// ========================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// ========================================
// Scroll Effects
// ========================================
function handleScroll() {
    const scrollPosition = window.scrollY;

    // Navbar shadow on scroll
    if (scrollPosition > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (scrollPosition > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }

    // Update active nav link
    updateActiveNavLink();
}

window.addEventListener('scroll', handleScroll);

// ========================================
// Scroll to Top Button
// ========================================
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// Intersection Observer for Animations
// ========================================
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements that should fade in
    const animateElements = document.querySelectorAll(
        '.feature-card, .pricing-card, .about-content, .contact-content'
    );
    
    animateElements.forEach(el => {
        el.classList.add('fade-in-view');
        observer.observe(el);
    });
}

// ========================================
// Testimonials Carousel
// ========================================
class TestimonialsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.testimonial-card');
        this.prevBtn = document.querySelector('.slider-btn-prev');
        this.nextBtn = document.querySelector('.slider-btn-next');
        this.dotsContainer = document.getElementById('slider-dots');
        this.autoPlayInterval = null;
        
        this.init();
    }

    init() {
        this.createDots();
        this.showSlide(this.currentSlide);
        this.attachEventListeners();
        this.startAutoPlay();
    }

    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = document.querySelectorAll('.dot');
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.showSlide(this.currentSlide);
        this.resetAutoPlay();
    }

    attachEventListeners() {
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoPlay();
        });

        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.resetAutoPlay();
        });

        // Pause auto-play on hover
        const sliderContainer = document.querySelector('.testimonials-slider');
        sliderContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
        sliderContainer.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// ========================================
// Form Validation
// ========================================
class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.messageInput = document.getElementById('message');
        this.formMessage = document.getElementById('form-message');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.nameInput.addEventListener('blur', () => this.validateName());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.messageInput.addEventListener('blur', () => this.validateMessage());
    }

    validateName() {
        const name = this.nameInput.value.trim();
        const errorElement = document.getElementById('name-error');
        
        if (name === '') {
            this.showError(this.nameInput, errorElement, 'Name is required');
            return false;
        } else if (name.length < 2) {
            this.showError(this.nameInput, errorElement, 'Name must be at least 2 characters');
            return false;
        } else {
            this.clearError(this.nameInput, errorElement);
            return true;
        }
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            this.showError(this.emailInput, errorElement, 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            this.showError(this.emailInput, errorElement, 'Please enter a valid email');
            return false;
        } else {
            this.clearError(this.emailInput, errorElement);
            return true;
        }
    }

    validateMessage() {
        const message = this.messageInput.value.trim();
        const errorElement = document.getElementById('message-error');
        
        if (message === '') {
            this.showError(this.messageInput, errorElement, 'Message is required');
            return false;
        } else if (message.length < 10) {
            this.showError(this.messageInput, errorElement, 'Message must be at least 10 characters');
            return false;
        } else {
            this.clearError(this.messageInput, errorElement);
            return true;
        }
    }

    showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
    }

    clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
    }

    showFormMessage(message, type) {
        this.formMessage.textContent = message;
        this.formMessage.className = `form-message ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.formMessage.className = 'form-message';
        }, 5000);
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isMessageValid = this.validateMessage();
        
        if (isNameValid && isEmailValid && isMessageValid) {
            // Simulate form submission
            this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');
            this.form.reset();
        } else {
            this.showFormMessage('Please fix the errors above.', 'error');
        }
    }
}

// ========================================
// Loading Screen
// ========================================
function hideLoadingScreen() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1000);
}

// ========================================
// Initialize Everything
// ========================================
function init() {
    // Initialize theme
    initTheme();
    
    // Hide loading screen
    hideLoadingScreen();
    
    // Initialize intersection observer for animations
    initIntersectionObserver();
    
    // Initialize testimonials carousel
    new TestimonialsCarousel();
    
    // Initialize form validator
    new FormValidator(contactForm);
    
    // Initial scroll check
    handleScroll();
}

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// ========================================
// Smooth Hover Effects for Cards
// ========================================
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

addCardHoverEffects();
