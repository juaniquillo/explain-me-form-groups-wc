# src demo rules

- One concept only. If you need two concepts, make two repos.
- One primary run command (e.g. `npm run dev`, `python -m http.server`, `cargo run`). Secondary commands (build/preview/typecheck) are fine but one must be primary and servable. One serving story per lesson, not two.
- Prefer small, dependency-free tech. If dependencies exist, list them with versions and why each is needed. Record the exact run command and any env requirements (runtime, `.env` location and required vars).
- Demo must directly illustrate the confusion in `TOPIC.md`.
- Interactive webpages must be well-styled: Tailwind (or equivalent), syntax highlighting for all code blocks, light/dark toggle defaulting to system. Styling serves the concept — keep the demo itself visually quiet.
- Delivery vehicles: `static site` (default) is a styled write-up page following the webpage rules above; `interactive` adds try-it elements bound to the concept (sliders, toggles, live inputs); `cli` ships a command transcript + captured output instead of a page.
- Generated artifacts must be reproducible: if the demo embeds generated output (e.g. highlighted code), the generating script is committed and documented, with the true source clearly marked.
- Verify by execution before calling it done — on a clean checkout, not just the dev server. Pick your runtime's line as primary and record it in `## Run`: node (`npm run build` + serve/`preview` + `curl`, `tsc`), python (`python -m http.server` + `curl`, `compileall`), php (`php -l` + `php src/demo.php`), static (`npx serve` + `curl`).
- Document the run command in the per-lesson `README.md` under `How demo works`, and append a `## Run` section here with the exact commands + env setup.
- Credit the lineage: every lesson notes where it came from — the lesson repo and the template repo (`https://github.com/juaniquillo/explain-me-template`). A small footer works for webpages; a closing line in CLI output or a Sources link works for anything else. Quiet, same style as the output.

## Run

Primary (Vite build, uploadable artifact):

```sh
npm install
npm run dev          # dev server with HMR (default http://localhost:5173)
npm run build        # emits dist/ — upload this folder to Cloudflare Pages
npm run preview      # serves dist/ at http://localhost:3131, then verify:
curl -s http://localhost:3131/ | Select-String "form-group"
```

- Runtime: node v26 + npm 11 (install/build/serve) + any modern browser (needs `adoptedStyleSheets`, `customElements`, `queueMicrotask`).
- Deps (npm, pinned in `package.json` + why each is needed):
  - `vite@7.1.7` (devDep: dev server + production build + preview server).
  - `tailwindcss@4.1.12` + `@tailwindcss/vite@4.1.12` (devDeps: compile page styling at build time — the component itself stays dependency-free).
  - `highlight.js@11.9.0` (dep: bundled syntax highlighting; core + `javascript` language only, both theme CSS files emitted as assets via `?url` imports in `src/main.js`).
- Env: none (no `.env`). Build output: `dist/` (self-contained — zero CDN requests; the only `https://` in the output is the footer lineage link text). True source is `src/form-group.js`; its bundled/minified copy in `dist/assets/` is a build artifact, as is the accordion listing in `index.html`.
- Deploy (Cloudflare Pages): build command `npm run build`, output directory `dist`, framework preset Vite (or None).
