import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** True when the user asked the OS to minimize non-essential motion.
 *  Every GSAP entrance/scroll animation must check this (the CSS
 *  `prefers-reduced-motion` block only covers CSS animations). */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ─── Reusable animation helpers ─────────────────────────────── */

export interface HeadingWordsOptions {
  /** Delay between each word (seconds) */
  stagger?: number;
  /** Per-word duration (seconds) */
  duration?: number;
  ease?: string;
  /** Add the reveal into an existing timeline (at `position`) instead of
   *  creating a standalone ScrollTrigger — used by SectionHeader to
   *  choreograph label → heading → lead under ONE trigger. */
  timeline?: gsap.core.Timeline;
  position?: gsap.Position;
}

/**
 * Split a node's text into masked word spans, PRESERVING inline markup.
 * Text nodes are tokenized with /(\s+)/ so whitespace survives as plain
 * text nodes (natural word spacing, outside the overflow masks). Element
 * nodes (e.g. <span class="text-wtc-orange">) are recursed into so their
 * words are wrapped INSIDE them and keep the element's styling; void
 * elements like <br> are left untouched. Returns inner spans in document
 * order.
 */
function splitIntoWords(root: HTMLElement): HTMLElement[] {
  const inners: HTMLElement[] = [];

  const processNode = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (!text.trim()) return; // keep pure-whitespace nodes as-is
      const frag = document.createDocumentFragment();
      for (const token of text.split(/(\s+)/)) {
        if (!token) continue;
        if (/^\s+$/.test(token)) {
          frag.appendChild(document.createTextNode(' '));
        } else {
          const mask = document.createElement('span');
          mask.style.cssText =
            'display:inline-block;overflow:hidden;vertical-align:bottom;';
          const word = document.createElement('span');
          word.style.display = 'inline-block';
          word.textContent = token;
          mask.appendChild(word);
          frag.appendChild(mask);
          inners.push(word);
        }
      }
      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.tagName === 'BR' || !el.childNodes.length) return;
      // Recurse so wrappers land inside the element (class/color preserved)
      Array.from(el.childNodes).forEach(processNode);
    }
  };

  Array.from(root.childNodes).forEach(processNode);
  return inners;
}

/**
 * Premium masked word reveal for headings. Safe with nested accent spans
 * and <br/>. Idempotent per element; under reduced motion the DOM is left
 * completely untouched (fully visible). The element gets an `aria-label`
 * with its plain text so screen readers announce the heading as one
 * phrase, not word-by-word.
 */
export function animateHeadingWords(
  el: HTMLElement,
  opts: HeadingWordsOptions = {}
): gsap.core.Tween | null {
  if (prefersReducedMotion()) return null;
  if (el.dataset.wordsSplit === 'true') return null;
  el.dataset.wordsSplit = 'true';

  const plain = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  if (plain) el.setAttribute('aria-label', plain);

  const words = splitIntoWords(el);
  if (!words.length) return null;

  // Hide in the same tick as the split — no flash of unstyled words while
  // the element waits for its trigger.
  gsap.set(words, { yPercent: 110 });

  const {
    stagger = 0.045,
    duration = 0.8,
    ease = 'power4.out',
    timeline,
    position = 0,
  } = opts;

  if (timeline) {
    const tween = gsap.to(words, { yPercent: 0, stagger, duration, ease });
    timeline.add(tween, position);
    return tween;
  }

  return gsap.to(words, {
    yPercent: 0,
    stagger,
    duration,
    ease,
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      once: true,
    },
  });
}

/** Scroll-triggered fade-up for cards / sections */
export function revealOnScroll(selector: string, stagger = 0.12) {
  if (prefersReducedMotion()) return;
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  gsap.fromTo(els,
    {
      y: 36,
      opacity: 0,
      scale: 0.97,
    },
    {
      scrollTrigger: {
        trigger: els[0],
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true,
      },
      y: 0,
      opacity: 1,
      scale: 1,
      stagger,
      duration: 0.8,
      ease: 'power3.out',
    }
  );
}

