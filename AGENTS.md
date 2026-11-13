# AGENTS.md

Base instructions for explain-me repos. See `README.md` and `src/README.md` for workflow.

Template itself has no run command. Each lesson must define one primary run command for its `src/` demo and document it in `README.md` under `How demo works` and in `src/README.md` under `## Run`.

Stay in build mode for the whole lesson; small decisions in conversation, no plan/build ping-pong.

Append `SESSION.md` per prompt/response round. Keep the one-row `LOG-ENTRY.md` summary separate — transcript and pointer stay separate.

Verify by execution before calling it done: build, serve + curl, typecheck — on a clean checkout, not just the dev server.

## README conformance (every lesson)

- Title: `# explain-me-<topic>` + 1-line topic description. Web lessons add `**Live demo:** <url>` under the title; CLI lessons omit it.
- Elaboration formats (pick fit, don't force all): overall explanation, usage examples, code walkthrough, interactive examples and graphs — plus mandatory gotchas.
- `How demo works`: `sh` fence with run + verify commands, env line (runtime version, deps, `.env` or none), build-output (servable) or no-build (CLI) statement.
- `Gotchas`: dash bullets with `file:line` refs answering the `TOPIC.md` confusions explicitly.
- `Sources` order: (1) `src/<demo>` (this repo), (2) origin link, (3) docs consulted.
- Audience: technical outsider. Never explain general programming; always explain stack-local context.

## Per-topic overrides

- Run: `npm run dev` (dev server), `npm run build` → `dist/` (upload artifact), `npm run preview -- --port 3131` (serve the build); verify `curl -s http://localhost:3131/ | Select-String "form-group"`
- Deps: `vite@7.1.7` + `@tailwindcss/vite@4.1.12` + `tailwindcss@4.1.12` (devDeps: dev server, build, compiled page styling — no browser CDN), `highlight.js@11.9.0` (dep: bundled highlighting, core + javascript + both theme CSS via `?url`)
- Env: `VITE_SITE_URL` (`.env.example` documents it; Pages dashboard holds the real value; unset → `http://localhost:3131` fallback); build output `dist/` (self-contained, zero CDN requests) — Cloudflare Pages: build command `npm run build`, output directory `dist`
- Social: OG + Twitter tags injected at build time via `transformIndexHtml` in `vite.config.js` (scrapers don't run JS, so no runtime injection); `src/public/og-image.jpg` (1200×630) → `dist/og-image.jpg`
- Delivery: interactive — submit/typing/tab/reset try-it form bound to the `invalid`/`input`/`focusout`/`reset` paths, plus accordion with full source
- Method for this tech: overall + usage examples + code walkthrough (original-vs-reworked table + 3 load-bearing snippets) + interactive + gotchas
- Gotchas anchor: `TOPIC.md` confusions 1–6, answered in `README.md` with `src/form-group.js:line` refs
- Note: `@custom-variant dark` in `src/styles.css` keeps the class-based light/dark toggle working (Tailwind v4 defaults `dark:` to `prefers-color-scheme`)
- Gitignore: appended `node_modules/ dist/ *.log` (Vite stack)
