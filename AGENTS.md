# Headstart landing: agent guide

This repo is a template. Every word on the site is a blank in `blanks.json`, and the site will not build until every blank holds a real answer. Never type copy into a component: fill the blank.

## The loop

1. `./fill list` shows the blanks still REQUIRED: key, what to write (`ask`), a hint, the kind and the length limit. MCP tool: `blanks`.
2. Write every answer into one JSON file of `{"key": "value"}` and run `./fill --from answers.json`. MCP tool: `fill`. One blank: `./fill hero.cta="Book a visit"`.
3. Rejected answers come back with the reason. Generic filler (Lorem ipsum, John Doe, Acme, example.com, TBD, TODO, "optional", "REQUIRED:", `{{...}}`) and overlong answers are refused. Write the real thing.
4. `./fill check` until it prints `ready`. `pnpm build` runs the same check first and stops if anything is missing.
5. `pnpm dev`, open http://localhost:4321 and look at every section.

Run both sites on one computer: set `link.app` to the product's local address (`http://localhost:5173` by default, or the port you start it on) and the product's `link.landing` to the landing's (`http://localhost:4321` by default), then change them to the real domains before you deploy.

`./fill check` here covers the blanks, the color contrast and every `b("key")`; `pnpm build` compiles every page. (`astro check` is left out: it crashes on Node 24 with Astro 7.)

If you do not know an answer, ask the person. Do not invent facts or customers: `proof.*` lists only what you can truthfully name, a statistic names its source in `proof.line`, and the numbers inside product pictures (`step.2.value`, `step.3.value.N`) read as examples of the product.

## Writing rules

- Headlines are two-tone: the first half in ink, the second half in the lighter grey. Wrap the second half in `*stars*`: `Keep being family. *Let us handle the follow-up.*` In `mock.reply` the starred sentence is set in bold instead.
- Lists (`mock.tabs`, `search.words`) are comma separated, with an exact count; `search.words` takes letters and spaces only.
- `hero.prompt` is what the hero's copy button puts on the clipboard: a prompt people paste into their own AI assistant. Write `{app}` where the product URL goes; it is filled from `link.app`, so it never goes stale.
- `hero.art` picks the hero scene's props: `care` (clinic and medical bag), `learning` (school flag and books) or `plain`; they are painted in the brand color.
- Hints say "the people you serve": a clinic's patients, a school's students, a caregiver. Write for whoever your startup serves.
- Respect each blank's `max`. The layout was drawn for those lengths.

## Taking template updates

Answers live inside `blanks.json`, so keep them in an answers file too: `./fill export answers.json` (secrets stay in `.env`). To update:

```bash
./fill export answers.json
git checkout -- blanks.json && git pull
./fill --from answers.json && ./fill list    # fills what you had, then shows any new blanks
```

## The pair

The product app (`headstart-product`) is meant to sit beside this folder (`../product` or any sibling with a `blanks.json` whose `site` is `product`). Filling any `brand.*` or `link.*` blank here fills it there too, and rewrites both sites' color tokens. `./fill sync` pulls them from the pair, `./fill sync --push` sends them. The MCP tools take `site: "this" | "pair" | "both"`.

## Colors

- `brand.color` takes any CSS color: hex, `rgb()`, `hsl()`, `oklch()`, `oklab()`, `lab()`, `lch()`, `color(srgb ...)`, `color(display-p3 ...)`.
- `brand.format` picks how tokens are written: hex, rgb, srgb, hsl, oklch, oklab, lab, lch, p3.
- `src/styles/tokens.css` is generated (light and dark). Never edit it; run `./fill tokens`.
- Every text pair passes AA in both schemes: WCAG 4.5:1 and APCA Lc 60. `./fill contrast "<text>" "<bg>"` measures any pair and gives the nearest passing fix; `./fill convert "<color>"` prints every format.
- The page is warm neutral (canvas, ink and greys stay the same for every brand); the brand color is the accent.
- Tailwind names: `bg-canvas`, `bg-surface`, `bg-raised`, `border-line`; text `text-ink`, `text-body`, `text-muted`; `text-quiet` only for headings 24px and up (it meets the large-text goal, 3:1 and Lc 45); `text-accent-ink`, `bg-accent-fill` with `text-on-accent`; status tints `bg-tone-1..5` with `text-tone-1-ink..5-ink` (blue, green, amber, red, brand). Never add a raw color.
- Type: `font-sans` (Geist), `font-mono` (IBM Plex Mono, for `eyebrow` labels and numbers), `font-serif` (Instrument Serif, the wordmark only); sizes `text-hero`, `text-h2`, `text-h3`, `text-body`, `text-row`, `text-eyebrow`. Headings are weight 400.
- Ready-made pieces: `btn btn-dark`, `btn btn-light`, `btn btn-glass` (over pictures), `row` (bordered list rows), `frame` (product pictures), `dots` (dotted grid), `eyebrow`.

## Pixel art

The scenes are painted in code by `kit/pixel.mjs`, so there are no image files to replace. `<Pixel scene="meadow" w={480} h={270} seed={7} dissolve="bottom" />` draws one; scenes are meadow, sky, field, grass, dawn, noon, dusk and night, and `seed` changes the clouds, flowers and buildings. `dissolve` ("top", "bottom" or both) breaks the edge into pixels so the scene melts into the page.

## Map

`./fill map` (MCP `map`) lists the routes and which file reads which blank.

| Route | File | Sections |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Hero (pixel meadow, copy-prompt button), Proof, Platform (product picture and three features), Band, story, Step 1 with Board, Step 2 with Messages, Step 3 with Dashboard, Guide (chapter cards), Sky, WordSearch |
| `/partners` | `src/pages/partners.astro` | hero, three benefits with pixel cards, why partner, Band |

Nav and footer live in `src/components/Nav.astro` and `Footer.astro`; the page shell in `src/layouts/Base.astro`.

## Motion (GSAP)

`src/scripts/motion.ts` animates by data attribute, and every effect is skipped under reduced motion:

- `data-split` words rise in (`data-now` on load instead of on scroll); build the html with `words()`.
- `data-reveal` fades one element up; `data-stagger` fades its children up in turn.
- `data-count` counts a number up from 0, keeping `$`, `%` and commas.
- `data-line` draws an SVG line; `data-grow` grows a bar; `data-card` pops a card in; `data-find` draws the word-search rings.
- `data-pulse` sends dots along the platform picture's rays; `data-tool` lines take turns lighting up in the sky band.
- The hero scene drifts as you scroll, the nav turns solid after the hero, and `data-copy` buttons copy their text.

## Adding a section

1. Add its blanks to `blanks.json`: `{"ask": "...", "hint": "...", "kind": "text", "max": 60, "value": ""}`. Kinds: text, color, format, choice (with `options`), list (with `items` and `itemMax`), email, url, phone.
2. Read them with `b("key")` from `src/blanks.ts`; `tone()` and `words()` render the `*second tone*`, `list()` splits a list.
3. `./fill check` fails on any `b("key")` that is not in `blanks.json`.
