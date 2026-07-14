import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/* ─── Reusable animation helpers ─────────────────────────────── */

/** Animate heading characters in with a racing "brake" effect */
export function animateHeading(selector: string, delay = 0) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;

  const text = el.textContent ?? '';
  el.innerHTML = text
    .split('')
    .map((c) =>
      c === ' '
        ? '<span style="display:inline-block">&nbsp;</span>'
        : `<span style="display:inline-block;overflow:hidden"><span class="char" style="display:inline-block">${c}</span></span>`
    )
    .join('');

  const chars = el.querySelectorAll<HTMLElement>('.char');
  gsap.fromTo(chars,
    {
      y: '110%',
      opacity: 0,
    },
    {
      y: '0%',
      opacity: 1,
      stagger: 0.03,
      duration: 0.9,
      ease: 'power4.out',
      delay,
    }
  );
}

/** Scroll-triggered fade-up for cards / sections */
export function revealOnScroll(selector: string, stagger = 0.12) {
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

