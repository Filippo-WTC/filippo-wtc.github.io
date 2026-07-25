import Lenis from 'lenis';

export function initLenis(): Lenis {
  // Rispetta prefers-reduced-motion: chi ha chiesto meno movimento non deve
  // subire lo scroll interpolato (problema vestibolare noto). Si DISABILITA lo
  // smooth wheel, ma si restituisce comunque un'istanza Lenis valida: non
  // tornare null, perché MotionRuntime la usa in astro:after-swap (lenis.scrollTo)
  // e senza il sito resterebbe sotto l'overlay opaco di transizione.
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 1.5,
    infinite: false,
    smoothWheel: !reduce,
  });
}
