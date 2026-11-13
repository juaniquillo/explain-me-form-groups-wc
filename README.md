# explain-me-form-groups-wc
A `<form-group>` Web Component that replaces the native validation bubble with per-field shadow-DOM messages.

## What
`<form-group>` is a custom element wrapping every control of one form field (light DOM via `<slot>`) plus its error message (shadow DOM `span.error-message[aria-live="polite"][part="error-message"]`, styled by one shared constructed stylesheet). It keeps native Constraint Validation as the source of truth (`input.validity`, `validationMessage`, `invalid` events) and replaces only the UI: `invalid` → `preventDefault()` + write message below the field; `input` → clear while typing; `focusout` → validate on leave; form `reset` → scrub script-written state. Message choice follows a fixed `VALIDITY_ORDER` (missing beats short, type beats pattern…), custom `*-message` attributes override defaults, and `aria-invalid` mirrors each control's live validity.

## Why
The native bubble shows one modal-ish popup on one control and vanishes — no per-field persistent messages, no radio-group-aware field errors, no theming hook, no screen-reader-stable live region. The component gives each field a persistent, styleable (`::part`, `--error-message-color`), announced (`aria-live="polite"`, always-in-tree span) message slot, while changing nothing about what counts as invalid. The rework over Kevin Powell's 109-line original exists because real fields are multi-control (radio groups, selects): hence `#inputs[]`, group-level `focusout` with a `relatedTarget` guard, `VALIDITY_ORDER` precedence instead of `for...in` enumeration order, manual re-focus of `:invalid` after killing the popup, and `AbortController` listener lifecycle.

## How demo works
`src/index.html` is the lesson: a styled write-up plus a try-it form with seven groups (required+minlength text, email, pattern, number range, textarea, radio group, select). Submit it untouched to watch `invalid` validate pristine fields; type/tab/reset to exercise the `input`/`focusout`/`reset` paths; open the accordion for the full 180-line `src/form-group.js` (true source; the listing is a copy).

```sh
npm install
npm run build        # emits dist/ (upload this folder to Cloudflare Pages)
npm run preview      # serves dist/ at http://localhost:3131
curl -s http://localhost:3131/ | Select-String "form-group"
```

Env: `VITE_SITE_URL` (absolute site URL baked into `og:url`/`og:image` at build time; see `.env.example`). Local default when unset: `http://localhost:3131`. Production: set it in the Cloudflare Pages dashboard (Settings → Environment variables), not by committing `.env`. Runtime: node v26 + npm 11 for install/build; any modern browser for the demo. Deps (npm, pinned in `package.json`): `vite@7.1.7` + `@tailwindcss/vite@4.1.12` + `tailwindcss@4.1.12` (dev server, build, compiled page styling — replaces the old browser CDN), `highlight.js@11.9.0` (bundled syntax highlighting, core + javascript only). Build output: `dist/` (servable, self-contained — no CDN requests; `src/form-group.js` is the true source, its bundled copy in `dist/assets/` is a build artifact). Deploy: Cloudflare Pages with build command `npm run build` and output directory `dist`.

### Gotchas
- `invalid` fires on every invalid control when submit is blocked (and on `checkValidity()`), doesn't bubble — so listeners sit on each input, and `preventDefault()` kills both the popup and the auto-focus; the component re-focuses `form.querySelector(':invalid')` in a `queueMicrotask` after the cancelled submit settles (`src/form-group.js:55-72`).
- An empty-but-short field reports `valueMissing`, not `tooShort`: `VALIDITY_ORDER` fixes precedence that `for...in validity` enumeration order can't promise (`src/form-group.js:9-20`, `src/form-group.js:148-156`).
- Tabbing between radios of one group must not flash errors: group-level `focusout` (bubbles) + `relatedTarget` guard ignores intra-group moves; per-input `blur` can't do this (`src/form-group.js:80-88`).
- Typing clears the message but `aria-invalid` follows each control's live validity, not the message text (`src/form-group.js:74-78`, `src/form-group.js:134-142`).
- `reset` fires before values restore, so cleanup waits a tick; otherwise messages/markers go stale (`src/form-group.js:90-101`).
- The empty message span stays in the shadow tree as `display:block` (zero-height when empty) so the `aria-live` region's return is announced; `:empty{display:none}` would drop it (`src/form-group.js:1-7`, `src/form-group.js:36-39`).
- Re-connect aborts and re-wires via `AbortController`+`{signal}` instead of doubling listeners; `customElements.get` guard stops double-`define` throws; handlers are bound in the constructor because they run as input listeners (`src/form-group.js:103-124`, `src/form-group.js:178-180`).
- `adoptedStyleSheets` scopes the shared sheet to shadow trees only; page theming flows in via `::part(error-message)` and the `--error-message-color` variable (purple toggle in the demo).

### Sources
1. `src/form-group.js` + `src/index.html` (this repo — the thing being explained; accordion listing is a copy, true source is `src/form-group.js`).
2. Origin: https://github.com/juaniquillo/components-kitchen-sink/blob/main/resources/js/form-group.js and upstream https://github.com/kevin-powell/form-groups-wc/blob/main/form-group.js.
3. Docs consulted: MDN `ValidityState` (`valueMissing`, `typeMismatch`, `patternMismatch`, `tooShort`), `HTMLInputElement invalid event` / `HTMLFormElement checkValidity()`, `ShadowRoot.adoptedStyleSheets` / constructable stylesheets (via Context7 `/mdn/content`).

### Template friction
`src/README.md` demands Tailwind + highlighting + theme toggle even for a lesson whose subject (`form-group.js`) is deliberately dependency-free — CDN pins keep it servable but make "dependency-free demo" claims need a page-vs-subject split. Also, the "generating script committed" rule fits generated listings awkwardly when the honest approach is hand-maintained copy + "true source marked"; a blessed pattern (fetch-and-render at runtime vs checked-in copy) would remove the guesswork.

## Files

- `prompt.md` — universal first prompt (does not change per-topic)
- `TOPIC.md` — variable part: what you worked on, origin link, what you think, what confuses you
- `AGENTS.md` — base instructions, plus tech-specific notes in each lesson
- `SESSION.md` — running session log, appended per round
- `LOG-ENTRY.md` — table row snippet for central log (the pointer; transcript stays in `SESSION.md`)
- `src/README.md` — demo rules
