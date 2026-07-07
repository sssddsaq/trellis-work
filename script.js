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

// Lead capture forms (static site: no backend, so submissions are handled client-side only)
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

    form.classList.add('submitted');
    form.querySelector('.form-success').classList.add('visible');
  });
}

handleFormSubmit(document.getElementById('requestForm'));
handleFormSubmit(document.getElementById('profileForm'));

// Footer copyright year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
