// Form submission handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const formMessage = document.getElementById('formMessage');
    const submitButton = form.querySelector('.submit-button');
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        business: formData.get('business'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Simulate form submission (in production, send to backend)
    setTimeout(function() {
        // Show success message
        formMessage.textContent = 'Thanks! I'll be in touch within 24 hours.';
        formMessage.className = 'form-message show success';
        
        // Reset form
        form.reset();
        
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        
        // Hide message after 5 seconds
        setTimeout(function() {
            formMessage.className = 'form-message';
        }, 5000);
        
        // Log to console (for development)
        console.log('Form submitted:', data);
    }, 800);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll animation to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all service cards, steps, and proof items
document.querySelectorAll('.service-card, .step, .proof-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add hover animation to buttons
document.querySelectorAll('.cta-button, .submit-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Scroll indicator on header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        const scrollPosition = window.scrollY;
        heroVisual.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    }
});
