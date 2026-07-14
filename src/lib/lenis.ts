import Lenis from 'lenis';

let instance: Lenis | null = null;

export function initLenis(): Lenis {
  instance = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 1.5,
    infinite: false,
  });
  return instance;
}

export function getLenis(): Lenis | null {
  return instance;
}
