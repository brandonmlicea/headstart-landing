import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];
const onView = (el: Element, start = "top 85%") => ({ trigger: el, start, once: true });

if (!reduce) {
  for (const el of $$("[data-split]")) {
    gsap.fromTo($$(".wi", el), { yPercent: 110, y: 0 }, {
      yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.05,
      delay: el.hasAttribute("data-now") ? 0.15 : 0,
      scrollTrigger: el.hasAttribute("data-now") ? undefined : onView(el),
    });
  }
  for (const svg of $$("[data-draw]"))
    gsap.to($$("path", svg), { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.12, scrollTrigger: onView(svg, "top 92%") });
  for (const el of $$("[data-reveal]"))
    gsap.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: onView(el) });
  for (const el of $$("[data-stagger]"))
    gsap.fromTo(el.children, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, scrollTrigger: onView(el) });
  for (const el of $$("[data-mission]"))
    gsap.to($$(".w", el), { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 45%", scrub: true } });
  for (const el of $$("[data-arrow]"))
    gsap.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, delay: 0.9, ease: "power2.out" });
}

for (const el of $$("[data-count]")) {
  const m = (el.dataset.count ?? "").match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m || reduce) continue;
  const [, pre, num, post] = m;
  const target = parseFloat(num.replace(/,/g, "")), places = (num.split(".")[1] ?? "").length;
  const n = { v: 0 };
  el.textContent = `${pre}0${post}`;
  gsap.to(n, {
    v: target, duration: 1.8, ease: "power2.out", scrollTrigger: onView(el, "top 90%"),
    onUpdate: () => { el.textContent = `${pre}${n.v.toLocaleString("en-US", { minimumFractionDigits: places, maximumFractionDigits: places })}${post}`; },
  });
}

for (const root of $$("[data-pillars]")) {
  const cards = $$("[data-pillar]", root), bgs = $$("[data-pillar-bg]", root), dots = $$("[data-dot]", root);
  let at = -1;
  const show = (i: number) => {
    if (i === at) return;
    at = i;
    cards.forEach((c, j) => { c.inert = j !== i; c.setAttribute("aria-hidden", String(j !== i)); });
    dots.forEach((d, j) => d.setAttribute("aria-current", String(j === i)));
    const t = reduce ? 0 : 0.6;
    gsap.to(cards, { autoAlpha: (j: number) => (j === i ? 1 : 0), y: (j: number) => (j === i ? 0 : j < i ? -24 : 24), duration: t, ease: "power3.out" });
    gsap.to(bgs, { opacity: (j: number) => (j === i ? 1 : 0), duration: t * 1.4, ease: "power2.out" });
  };
  root.classList.add("is-live");
  show(0);
  const st = reduce ? null : ScrollTrigger.create({
    trigger: root, start: "top top", end: () => `+=${innerHeight * (cards.length - 0.5)}`, pin: $$("[data-stage]", root)[0], pinSpacing: true,
    onUpdate: (s) => show(Math.min(cards.length - 1, Math.floor(s.progress * cards.length))),
  });
  const go = (i: number) => {
    const n = (i + cards.length) % cards.length;
    if (st) scrollTo({ top: st.start + ((st.end - st.start) * (n + 0.5)) / cards.length, behavior: "smooth" }); else show(n);
  };
  $$("[data-prev]", root).forEach((b) => b.addEventListener("click", () => go(at - 1)));
  $$("[data-next]", root).forEach((b) => b.addEventListener("click", () => go(at + 1)));
  dots.forEach((d, j) => d.addEventListener("click", () => go(j)));
}
