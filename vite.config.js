import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Cloudflare Pages: build command `npm run build`, output directory `dist`.
// Site URL for absolute OG tags: set VITE_SITE_URL in the Pages dashboard
// (Settings → Environment variables) and in a local `.env` (see .env.example).
// Scrapers read raw HTML without running JS, so these tags are injected at
// build time via transformIndexHtml — never at runtime.
const SITE_URL = (process.env.VITE_SITE_URL || 'http://localhost:3131').replace(/\/$/, '');
const OG_TAGS = [
  '<meta property="og:type" content="website" />',
  '<meta property="og:title" content="explain-me-form-groups-wc — a &lt;form-group&gt; validation wrapper" />',
  '<meta property="og:description" content="Interactive lesson: a <form-group> Web Component that replaces the native validation bubble with per-field shadow-DOM messages." />',
  `<meta property="og:url" content="${SITE_URL}/" />`,
  `<meta property="og:image" content="${SITE_URL}/og-image.jpg" />`,
  '<meta property="og:image:width" content="1200" />',
  '<meta property="og:image:height" content="630" />',
  '<meta name="twitter:card" content="summary_large_image" />',
  '<meta name="twitter:title" content="explain-me-form-groups-wc — a <form-group> validation wrapper" />',
  '<meta name="twitter:description" content="Interactive lesson: a <form-group> Web Component that replaces the native validation bubble with per-field shadow-DOM messages." />',
  `<meta name="twitter:image" content="${SITE_URL}/og-image.jpg" />`,
];

function openGraph() {
  return {
    name: 'open-graph',
    transformIndexHtml(html) {
      return html.replace('</head>', `  ${OG_TAGS.join('\n  ')}\n  </head>`);
    },
  };
}

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [tailwindcss(), openGraph()],
});
