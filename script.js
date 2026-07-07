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
// stores submissions server-side — no custom backend needed).
function encodeFormData(data) {
  return new URLSearchParams(data).toString();
}

function handleFormSubmit(form) {
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
        form.classList.add('errored');
        form.querySelector('.form-error').classList.add('visible');
      });
  });
}

handleFormSubmit(document.getElementById('requestForm'));
handleFormSubmit(document.getElementById('profileForm'));

// Footer copyright year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
