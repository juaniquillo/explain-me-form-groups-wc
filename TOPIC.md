# Topic

## Tech

Web Components + Constraint Validation API — the `<form-group>` custom element wrapper.

## Delivery

interactive

## What I worked on

Ported and reworked Kevin Powell's `form-groups-wc` demo (`form-group.js`, single-input) into `components-kitchen-sink/resources/js/form-group.js` (multi-input: `input, textarea, select`, radio-group aware, ARIA + focus + reset handling).

## Origin link

- Reworked (this lesson's subject): https://github.com/juaniquillo/components-kitchen-sink/blob/main/resources/js/form-group.js
- Upstream original for comparison: https://github.com/kevin-powell/form-groups-wc/blob/main/form-group.js

## What I think happens

`<form-group>` wraps one field's controls in light DOM via `<slot>`, renders the error in shadow DOM (`span.error-message[aria-live=polite][part=error-message]`, styled by a shared constructed stylesheet). On `invalid` it calls `preventDefault()` to kill the native bubble popup and writes its own message below the field; on `input` it clears the message while typing; on leaving the group (`focusout`) or submit it recomputes from `input.validity`.

## What confuses me / what I need

1. `invalid` timing: when does it fire (submit-blocked on every invalid control, `checkValidity()`/`reportValidity()`), does it bubble, and why must the component re-focus `:invalid` itself after `preventDefault()` (plus why `queueMicrotask`)?
2. Message precedence: why is `for...in validity` enumeration order wrong, and why does an empty-but-too-short field report `valueMissing` ("required") instead of `tooShort`? What is `VALIDITY_ORDER` for?
3. `blur` vs `focusout`: why does the original's per-input `blur` listener break radio groups, and how does the `focusout` + `relatedTarget` guard fix it?
4. Message element lifecycle: why keep the empty `<span>` in the tree (`display:block` empty takes no room) instead of `:empty { display:none }` toggling, and what does that have to do with `aria-live` announcements?
5. Listener lifecycle: why `AbortController` + `{ signal }` + re-`abort()` in `connectedCallback`, why `closest('form')` + `reset` handling needs `queueMicrotask`, and why guard `customElements.define` with `customElements.get`?
6. Shadow styling: how does `adoptedStyleSheets` scope styles, and how can page CSS still theme the message via `::part(error-message)` and `--error-message-color`?
