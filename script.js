// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Dark mode toggle
const themeToggle = document.getElementById('themeToggle');

function getPreferredTheme() {
  return localStorage.getItem('theme');
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = getPreferredTheme() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// Lead capture forms: this is a static site with no backend, so "submitting"
// means handing the details to the visitor's own email client via mailto.
const CONTACT_EMAIL = 'hello@aitrellis.sa';

function buildMailtoUrl(subject, lines) {
  const body = lines.filter(Boolean).join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function handleFormSubmit(form, buildMailto) {
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('input[name="company_website"]');
    if (honeypot && honeypot.value) {
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const mailtoUrl = buildMailto(new FormData(form));
    const successLink = form.querySelector('.form-success a');
    if (successLink) successLink.href = mailtoUrl;

    form.classList.add('submitted');
    form.querySelector('.form-success').classList.add('visible');

    window.location.href = mailtoUrl;
  });
}

handleFormSubmit(document.getElementById('requestForm'), (data) => buildMailtoUrl(
  'Request a place on the 2026 list',
  [`Work email: ${data.get('email')}`]
));

handleFormSubmit(document.getElementById('profileForm'), (data) => buildMailtoUrl(
  'Company profile request',
  [
    `Full name: ${data.get('name')}`,
    `Work email: ${data.get('email')}`,
    `Company: ${data.get('company')}`,
    data.get('role') ? `Role: ${data.get('role')}` : '',
    data.get('phone') ? `Phone: ${data.get('phone')}` : '',
  ]
));

// Footer copyright year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
