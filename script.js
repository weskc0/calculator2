document.addEventListener('DOMContentLoaded', () => {
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    const header = document.querySelector('.header');
    const heroVisual = document.querySelector('.hero-visual');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 10) {
                    header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.boxShadow = 'none';
                }

                if (window.innerWidth > 768 && heroVisual) {
                    const scrollPosition = window.scrollY;
                    heroVisual.style.transform = `translateY(${scrollPosition * 0.15}px)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    });

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

    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            const formData = new FormData(this);
            
            const data = {
                id: Date.now(),
                name: formData.get('name'),
                email: formData.get('email'),
                business: formData.get('business'),
                message: formData.get('message'),
                timestamp: new Date().toLocaleString()
            };

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formMessage.className = 'form-message';

            setTimeout(() => {
                saveToLocalStorage(data);
                
                showMessage('Thanks! We\'ll put you in contact with our head of quality, Ryker.', 'success');
                
                this.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                console.log('New Lead Captured:', data);

            }, 1000);
        });
    }

    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message show ${type}`;
        
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }

    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.getElementById('closeModal');
    const requestsList = document.getElementById('requestsList');

    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            renderRequests();
            adminModal.classList.add('open');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            adminModal.classList.remove('open');
        });
    }

    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                adminModal.classList.remove('open');
            }
        });
    }

    function saveToLocalStorage(data) {
        const requests = getStoredRequests();
        requests.unshift(data);
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

    window.clearRequests = function() {
        if(confirm('Are you sure you want to delete all requests? This cannot be undone.')) {
            localStorage.removeItem('localMatter_requests');
            renderRequests();
        }
    };

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
