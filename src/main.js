import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import lightUrl from 'highlight.js/styles/github.css?url';
import darkUrl from 'highlight.js/styles/github-dark.css?url';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml); // 'html' is an alias — covers language-html blocks

// Bundled highlight.js themes, toggled like stylesheets (same behavior the
// CDN <link> pair had; the ?url imports make Vite emit both CSS files).
const lightLink = document.createElement('link');
lightLink.rel = 'stylesheet';
lightLink.href = lightUrl;
lightLink.id = 'hljs-light';
const darkLink = document.createElement('link');
darkLink.rel = 'stylesheet';
darkLink.href = darkUrl;
darkLink.id = 'hljs-dark';
darkLink.disabled = true;
document.head.append(lightLink, darkLink);

// Theme: follow system by default, toggle overrides via .dark class.
const root = document.documentElement;
const mq = window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme(mode) {
  const dark = mode === 'dark' ? true : mode === 'light' ? false : mq.matches;
  root.classList.toggle('dark', dark);
  lightLink.disabled = dark;
  darkLink.disabled = !dark;
}
let override = null;
document.getElementById('theme-toggle').addEventListener('click', () => {
  override = (override ?? (mq.matches ? 'dark' : 'light')) === 'dark' ? 'light' : 'dark';
  applyTheme(override);
});
mq.addEventListener?.('change', () => {
  if (!override) applyTheme(null);
});
applyTheme(null);

document.getElementById('error-color-toggle').addEventListener('click', () => {
  document.getElementById('demo-form').classList.toggle('alt-error');
});

// Demo-only status line: real validation UI lives inside each form-group.
document.getElementById('demo-form').addEventListener('submit', (e) => {
  const status = document.getElementById('form-status');
  if (!e.target.checkValidity()) {
    status.textContent = 'Blocked: see per-field messages (this is the invalid path).';
  } else {
    e.preventDefault();
    status.textContent = 'Valid — nothing to submit in a demo, so submission was intercepted.';
  }
});
document.getElementById('demo-form').addEventListener('reset', () => {
  document.getElementById('form-status').textContent = '';
});

hljs.highlightAll();
