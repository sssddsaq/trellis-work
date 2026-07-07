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

// Lead capture forms: submitted to Netlify Forms (the site is hosted on
// Netlify, which parses forms with data-netlify="true" at deploy time and
// stores submissions server-side — no custom backend needed). If that POST
// fails for any reason (offline, opened as a local file, network hiccup),
// fall back to a pre-filled email so the submission still reaches us.
const CONTACT_EMAIL = 'hello@aitrellis.sa';

function encodeFormData(data) {
  return new URLSearchParams(data).toString();
}

function buildMailtoFallback(subject, data, fieldNames) {
  const lines = fieldNames
    .map((name) => [name, data.get(name)])
    .filter(([, value]) => value)
    .map(([name, value]) => `${name}: ${value}`);
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

function handleFormSubmit(form, subject, fieldNames) {
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

    const data = new FormData(form);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData(data),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
        form.classList.add('submitted');
        form.querySelector('.form-success').classList.add('visible');
      })
      .catch(() => {
        const mailtoUrl = buildMailtoFallback(subject, data, fieldNames);
        const fallbackLink = form.querySelector('.form-error a');
        if (fallbackLink) fallbackLink.href = mailtoUrl;

        form.classList.add('errored');
        form.querySelector('.form-error').classList.add('visible');
        window.location.href = mailtoUrl;
      });
  });
}

handleFormSubmit(document.getElementById('requestForm'), 'Request a place on the 2026 list', ['email']);
handleFormSubmit(document.getElementById('profileForm'), 'Company profile request', ['name', 'email', 'company', 'role', 'phone']);

// Footer copyright year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
