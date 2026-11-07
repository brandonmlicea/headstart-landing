# Headstart landing

**Speed up your AI startup.** A healthcare landing page you fill in like a form, from the terminal or through MCP, instead of hunting for placeholder text in components.

- Astro 7, Tailwind 4 and GSAP, in a calm warm-neutral style: two-tone headlines, glass nav pills over a full-bleed pixel-art hero, product pictures built in HTML, numbered steps with accordion rows, chapter cards, a word search and a pixel-art footer. The pixel scenes are painted in code (`kit/pixel.mjs`), so there are no stock images to replace. Every effect respects reduced motion.
- Every word is a blank in `blanks.json`. An empty blank renders as `REQUIRED: Brand name`, and `pnpm build` refuses to run until every blank holds a real answer. Filler like Lorem ipsum, John Doe, Acme or TBD is rejected.
- One brand color in any CSS format (hex, rgb, hsl, oklch, oklab, lab, lch, srgb, display-p3) becomes the accent of a light and dark palette where every text pair passes WCAG 4.5:1 and APCA Lc 60.
- Pairs with [headstart-product](https://github.com/brandonmlicea/headstart-product), the signed-in app with a voice, photo and text care assistant. Brand and links fill both at once.

## Start

```bash
mkdir my-startup && cd my-startup
git clone --depth 1 https://github.com/brandonmlicea/headstart-landing landing
git clone --depth 1 https://github.com/brandonmlicea/headstart-product product
cd landing && pnpm install
./fill list                  # every blank still REQUIRED
./fill --from answers.json   # fill them all at once (agents)
./fill                       # or walk the form by hand (people, in a terminal)
pnpm dev                     # http://localhost:4321
```

Or press **Use this template** on GitHub for your own copy.

## The form

```bash
./fill list                    # what is still REQUIRED, with hints and limits
./fill brand.name="Tendwell"   # fill one or more blanks
./fill --from answers.json     # fill many at once
./fill check                   # ready to build?
./fill tokens --format oklch   # rewrite color tokens in another format
./fill contrast "#999" "#fff"  # WCAG + APCA, with the nearest passing fix
./fill convert "oklch(0.62 0.11 190)"
./fill sync                    # pull brand and links from the product beside it
./fill export answers.json     # save your answers (before pulling template updates)
./fill map                     # which file uses which blank
```

`./fill` is a bash wrapper around `node kit/cli.mjs`; `pnpm fill ...` does the same.

## MCP

`.mcp.json` registers the server for Claude Code when you open the folder. For any other client:

```json
{ "mcpServers": { "headstart": { "command": "node", "args": ["/path/to/landing/kit/mcp.mjs"] } } }
```

Tools: `blanks`, `fill`, `check`, `map`, `sync`, `palette`, `convert`, `contrast`. They reach the paired product too, so one server keeps both sites in step.

## For agents

Read [AGENTS.md](AGENTS.md).

## License

MIT
