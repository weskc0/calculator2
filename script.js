document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       MODULE 1: SCROLL ANIMATIONS (Intersection Observer)
       Using CSS classes instead of inline styles for better performance
       ========================================= */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.service-card, .step, .proof-item, .hero-content');
    
    // Apply reveal class initially (defined in CSS) so they start hidden
    animatedElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    /* =========================================
       MODULE 2: UI INTERACTIONS & SCROLL EFFECTS
       Using requestAnimationFrame for smooth 60fps performance
       ========================================= */
    const header = document.querySelector('.header');
    const heroVisual = document.querySelector('.hero-visual');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Header Shadow Logic
                if (window.scrollY > 10) {
                    header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.boxShadow = 'none';
                }

                // Parallax Logic (Only on desktop to save mobile battery)
                if (window.innerWidth > 768 && heroVisual) {
                    const scrollPosition = window.scrollY;
                    heroVisual.style.transform = `translateY(${scrollPosition * 0.15}px)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =========================================
       MODULE 3: CONTACT FORM & DATA HANDLING
       Handles submission, loading states, and LocalStorage
       ========================================= */
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            const formData = new FormData(this);
            
            // 1. Gather Data
            const data = {
                id: Date.now(),
                name: formData.get('name'),
                email: formData.get('email'),
                business: formData.get('business'),
                message: formData.get('message'),
                timestamp: new Date().toLocaleString()
            };

            // 2. UI Feedback (Loading State)
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formMessage.className = 'form-message'; // Reset message

            // 3. Simulate Network Delay & Save
            setTimeout(() => {
                saveToLocalStorage(data); // Save to Admin Dashboard
                
                // 4. Success State
                showMessage('Thanks! We\'ll put you in contact with our head of quality, Ryker.', 'success');
                
                this.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                console.log('New Lead Captured:', data);

            }, 1000); // 1 second simulated delay
        });
    }

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message show ${type}`;
        
        // Auto-hide
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }

    /* =========================================
       MODULE 4: ADMIN DASHBOARD LOGIC
       Handles the "Settings" modal and data viewing
       ========================================= */
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.getElementById('closeModal');
    const requestsList = document.getElementById('requestsList');

    // Open Modal
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            renderRequests();
            adminModal.classList.add('open');
        });
    }

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            adminModal.classList.remove('open');
        });
    }

    // Close on background click
    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                adminModal.classList.remove('open');
            }
        });
    }

    // --- Data Functions ---

    function saveToLocalStorage(data) {
        const requests = getStoredRequests();
        requests.unshift(data); // Add to top
        localStorage.setItem('localMatter_requests', JSON.stringify(requests));
    }

    function getStoredRequests() {
        const stored = localStorage.getItem('localMatter_requests');
        return stored ? JSON.parse(stored) : [];
    }

    function renderRequests() {
        const requests = getStoredRequests();
        requestsList.innerHTML = '';

        if (requests.length === 0) {
            requestsList.innerHTML = '<div class="empty-state">No requests found yet.</div>';
            return;
        }

        requests.forEach(req => {
            const card = document.createElement('div');
            card.className = 'request-item';
            
            // Security: Escape HTML to prevent XSS attacks
            card.innerHTML = `
                <h5>${escapeHtml(req.name)} <small style="color:#64748b; font-weight:400;">${req.business ? '• ' + escapeHtml(req.business) : ''}</small></h5>
                <p style="font-size:0.9rem; color:#334155; margin-bottom:5px;">
                    <a href="mailto:${escapeHtml(req.email)}" style="color:var(--color-accent);">${escapeHtml(req.email)}</a>
                </p>
                <p style="font-style:italic; color:#64748b;">"${escapeHtml(req.message)}"</p>
                <div style="margin-top:8px; font-size:0.75rem; color:#94a3b8;">${req.timestamp}</div>
            `;
            requestsList.appendChild(card);
        });
    }

    // Global function for the "Clear" button inside the modal
    window.clearRequests = function() {
        if(confirm('Are you sure you want to delete all requests? This cannot be undone.')) {
            localStorage.removeItem('localMatter_requests');
            renderRequests();
        }
    };

    // Basic XSS Protection Helper
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
