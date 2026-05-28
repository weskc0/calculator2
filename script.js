/* Existing script contents placeholder */

// Admin authentication and lead capture management
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const closeModal = document.getElementById('closeModal');

adminBtn.addEventListener('click', () => {
  const username = prompt('Enter admin username:');
  if (!username) return;
  const password = prompt('Enter admin password:');
  if (username === 'admin' && password === '183017') {
    adminModal.style.display = 'block';
  } else {
    alert('Invalid credentials');
  }
});

closeModal.addEventListener('click', () => {
  adminModal.style.display = 'none';
});

// Placeholder for server‑side lead capture handling
// In production, this would POST to a protected endpoint that updates settings.json
function submitLead(name, email, business, message) {
  const payload = { name, email, business, message, date: new Date().toISOString() };
  // Example: POST to /api/leads (to be implemented as a cloud worker)
  fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(data => {
      document.getElementById('formMessage').textContent = data.ok ? 'Thanks for reaching out!' : 'Error saving lead.';
    })
    .catch(() => {
      document.getElementById('formMessage').textContent = 'Network error.';
    });
}

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  submitLead(form.name.value, form.email.value, form.business.value, form.message.value);
});
