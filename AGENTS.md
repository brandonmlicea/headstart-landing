# Headstart landing: agent guide

This repo is a template. Every word on the site is a blank in `blanks.json`, and the site will not build until every blank holds a real answer. Never type copy into a component: fill the blank.

## The loop

1. `./fill list` shows the blanks still REQUIRED: key, what to write (`ask`), a hint, the kind and the length limit. MCP tool: `blanks`.
2. Write every answer into one JSON file of `{"key": "value"}` and run `./fill --from answers.json`. MCP tool: `fill`. One blank: `./fill hero.cta="Book a visit"`.
3. Rejected answers come back with the reason. Generic filler (Lorem ipsum, John Doe, Acme, example.com, TBD, TODO, "optional", "REQUIRED:", `{{...}}`) and overlong answers are refused. Write the real thing.
4. `./fill check` until it prints `ready`. `pnpm build` runs the same check first and stops if anything is missing.
5. `pnpm dev`, open http://localhost:4321 and look at every section.

If you do not know an answer, ask the person. Do not invent facts: every stat needs its real source in `stat.N.source`.

## Writing rules

- `*word*` sets a word in italics (headlines, titles, the mission). One or two italic words per line.
- Icons are a choice: home, doctor, video, heart, leaf, chat, shield, chart, pill, family.
- Respect each blank's `max`. The layout was drawn for those lengths.

## The pair

The product app (`headstart-product`) is meant to sit beside this folder (`../product` or any sibling with a `blanks.json` whose `site` is `product`). Filling any `brand.*` or `link.*` blank here fills it there too, and rewrites both sites' color tokens. `./fill sync` pulls them from the pair, `./fill sync --push` sends them. The MCP tools take `site: "this" | "pair" | "both"`.

## Colors

- `brand.color` takes any CSS color: hex, `rgb()`, `hsl()`, `oklch()`, `oklab()`, `lab()`, `lch()`, `color(srgb ...)`, `color(display-p3 ...)`.
- `brand.format` picks how tokens are written: hex, rgb, srgb, hsl, oklch, oklab, lab, lch, p3.
- `src/styles/tokens.css` is generated (light and dark). Never edit it; run `./fill tokens`.
- Every text pair passes AA in both schemes: WCAG 4.5:1 and APCA Lc 60. `./fill contrast "<text>" "<bg>"` measures any pair and gives the nearest passing fix; `./fill convert "<color>"` prints every format.
- Tailwind names: `bg-canvas`, `bg-surface`, `bg-raised`, `border-line`, `text-ink`, `text-muted`, `text-accent-ink` (accent as text), `bg-accent-fill` with `text-on-accent`, `bg-tone-1` to `bg-tone-5` with `text-ink`. Never add a raw color.
- Type: `font-display` (Fraunces, headings at weight 400) and `font-sans` (DM Sans); sizes `text-h1`, `text-h2`, `text-h3`, `text-lead`.

## Map

`./fill map` (MCP `map`) lists the routes and which file reads which blank.

| Route | File | Sections |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Hero, Pillars (pinned carousel), Intro, Services, Approach, Stats, Mission, Cta |
| `/partners` | `src/pages/partners.astro` | hero, benefits, why partner, Stats, Cta |

Nav and footer live in `src/components/Nav.astro` and `Footer.astro`; the page shell in `src/layouts/Base.astro`.

## Motion (GSAP)

`src/scripts/motion.ts` animates by data attribute, and every effect is skipped under reduced motion:

- `data-split` words rise in (`data-now` on load instead of on scroll); build the html with `words()`.
- `data-reveal` fades one element up; `data-stagger` fades its children up in turn.
- `data-draw` draws an SVG's strokes (paths need `pathLength="1"`; `Icon` does this).
- `data-count` counts a stat up from 0, keeping `$` and `%`.
- `data-mission` lights a paragraph word by word as it scrolls.
- `data-pillars` pins the carousel and steps through `data-pillar` cards while scrolling.

## Adding a section

1. Add its blanks to `blanks.json`: `{"ask": "...", "hint": "...", "kind": "text", "max": 60, "value": ""}`. Kinds: text, color, format, choice (with `options`), email, url, phone.
2. Read them with `b("key")` from `src/blanks.ts`; `em()` and `words()` render `*italics*`.
3. `./fill check` fails on any `b("key")` that is not in `blanks.json`.
