import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { paintAll } from "../../kit/pixel.mjs";

gsap.registerPlugin(ScrollTrigger);
paintAll();

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];
const onView = (el: Element, start = "top 85%") => ({ trigger: el, start, once: true });

const nav = document.querySelector<HTMLElement>("[data-nav]");
const hero = document.querySelector<HTMLElement>("[data-hero]");
if (nav && !nav.hasAttribute("data-solid")) {
  const sync = () => nav.toggleAttribute("data-scrolled", scrollY > (hero ? hero.offsetHeight - 120 : 10));
  addEventListener("scroll", sync, { passive: true });
  sync();
}

for (const btn of $$<HTMLButtonElement>("[data-copy]")) {
  const label = btn.querySelector("[data-copy-label]");
  const text = label?.textContent ?? "";
  btn.addEventListener("click", async () => {
    await navigator.clipboard.writeText(btn.dataset.copy ?? "");
    if (label) { label.textContent = "Copied"; setTimeout(() => (label.textContent = text), 1600); }
  });
}

const tools = $$("[data-tool]");
if (tools.length && !reduce) {
  let at = 0;
  setInterval(() => {
    tools[at].removeAttribute("data-on");
    at = (at + 1) % tools.length;
    tools[at].setAttribute("data-on", "");
  }, 3200);
}

if (!reduce) {
  for (const el of $$("[data-split]"))
    gsap.fromTo($$(".wi", el), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.04, delay: el.hasAttribute("data-now") ? 0.1 : 0, scrollTrigger: el.hasAttribute("data-now") ? undefined : onView(el) });
  for (const el of $$("[data-reveal]"))
    gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: onView(el) });
  for (const el of $$("[data-stagger]"))
    gsap.fromTo(el.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, scrollTrigger: onView(el) });
  if (hero) gsap.to($$("canvas", hero), { yPercent: 10, scale: 1.04, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  for (const el of $$<SVGGeometryElement>("[data-line]")) {
    gsap.set(el, { strokeDasharray: el.getTotalLength?.() ?? 1, strokeDashoffset: el.getTotalLength?.() ?? 1 });
    gsap.to(el, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", scrollTrigger: onView(el, "top 90%") });
  }
  for (const el of $$("[data-grow]")) gsap.from(el, { scaleX: 0, duration: 1.4, ease: "power3.out", scrollTrigger: onView(el) });
  for (const el of $$("[data-card]")) gsap.from(el, { y: 14, opacity: 0, duration: 0.7, ease: "back.out(1.6)", scrollTrigger: onView(el, "top 92%") });
  const finds = $$("[data-find]");
  if (finds.length) gsap.from(finds, { scaleX: 0, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.18, scrollTrigger: onView(finds[0], "top 80%") });
  for (const dot of $$<SVGCircleElement>("[data-pulse]")) {
    const d = dot.dataset;
    gsap.fromTo(dot, { attr: { cx: d.x1, cy: d.y1 } }, { attr: { cx: d.x2, cy: d.y2 }, duration: 1.6 + Math.random(), repeat: -1, delay: Math.random() * 2, ease: "power1.inOut", repeatDelay: 1 + Math.random() * 2 });
  }
  for (const el of $$("[data-count]")) {
    const m = (el.dataset.count ?? "").match(/^([^\d]*)([\d.,]+)(.*)$/);
    if (!m) continue;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, "")), places = (num.split(".")[1] ?? "").length, commas = num.includes(",");
    const n = { v: 0 };
    gsap.to(n, {
      v: target, duration: 1.6, ease: "power2.out", scrollTrigger: onView(el, "top 90%"),
      onUpdate: () => { el.textContent = `${pre}${n.v.toLocaleString("en-US", { minimumFractionDigits: places, maximumFractionDigits: places, useGrouping: commas })}${post}`; },
    });
  }
}
