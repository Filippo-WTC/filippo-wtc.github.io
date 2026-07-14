# WTC Design System

A self-contained reference for replicating the WTC visual language on a new project. It captures the philosophy, the exact tokens, the component recipes, and the motion system so you can rebuild the look without the original repo.

**One-line summary:** dark-first, near-black canvas with layered surfaces, a single orange accent used sparingly, geometric display type over neutral body type, subtle "telemetry" grid textures, and scroll-triggered motion that reveals structure rather than performs.

---

## 1. Design Philosophy

Three words drive every decision: **Calm. Sharp. Reliable.**

- **Calm** — never rushed, loud, or noisy. No flashing alerts, no aggressive CTAs, no visual clutter. One clear next action per section.
- **Sharp** — precise language, tight spacing, deliberate typography. Every element earns its place.
- **Reliable** — consistent patterns, predictable navigation, nothing that surprises negatively. The design itself is the proof of competence.

**Emotional goal:** quiet confidence — "these people know what they're doing."

### Five principles
1. **Calm is the product** — if a page creates anxiety, it's broken. Reduce cognitive load.
2. **Earn every pixel** — if removing an element doesn't hurt comprehension, remove it. Decoration is only OK when it reinforces structure.
3. **Orange is punctuation, not paint** — the accent is a period at the end of a sentence: rare, deliberate. **One orange element per visual unit, maximum.**
4. **Competence is shown, not claimed** — precision instead of adjectives: tight grid alignment, consistent tokens, no placeholder text.
5. **Plain language wins** — labels and nav must be instantly understandable to a non-technical reader. Technical depth lives in body copy, never in navigation.

### Anti-references (explicitly avoid)
Purple/cyan gradients, glassmorphism overload, floating 3D icons, "10x your productivity" copy, hero sections with 40 feature tiles, modal popups on load, countdown timers, badge stacking ("SOC2 ✓ ISO27001 ✓ GDPR ✓"), oversized emoji bullets, alternating colored words. **The reference feel is clean ops tooling (Linear, Vercel dashboard) meets a premium services firm — not a generic SaaS landing page.**

---

## 2. Color System

Colors are stored as **space-separated RGB channels** in CSS custom properties, then consumed through `rgb(var(--token) / <alpha-value>)`. This is what lets a single token support arbitrary opacity in Tailwind (`bg-surface-01/50`) while still being themeable.

### Tokens (dark theme = default)

```css
:root {
  /* Backgrounds & surfaces — layered from darkest up */
  --c-bg:          10 11 15;    /* #0A0B0F — page background, near-black */
  --c-surface-01:  15 16 22;    /* cards, footer, raised panels */
  --c-surface-02:  20 21 28;    /* nested surfaces, timeline nodes */
  --c-surface-03:  26 27 37;    /* highest elevation */

  /* Text */
  --c-white:       255 255 255; /* primary text / headings */
  --c-ice:         228 228 231; /* near-white body accent (ice grey) */
  --c-text-muted:  107 114 128; /* secondary / caption text */

  /* Lines */
  --c-border:      42 43 53;    /* subtle divider */

  /* Brand — FIXED, never theme-adapt */
  --color-orange:  #F26522;     /* the one accent */
  --color-neon:    #FF7029;     /* brighter orange for hover / gradient stop */

  /* Layout */
  --navbar-h:      72px;
  --local-nav-h:   52px;
  --section-px:    clamp(1.5rem, 6vw, 6rem);   /* horizontal page padding */
  --section-py:    clamp(6rem, 12vw, 10rem);   /* vertical section rhythm */

  /* Branch accent — overridable per sub-brand (see §9) */
  --branch-accent:      #F26522;
  --branch-accent-glow: rgba(242, 101, 34, 0.12);
}
```

### Usage rules
- **Orange is the only chromatic color.** Green/red exist solely for status badges (success/error), never for decoration.
- Text hierarchy is built almost entirely from **white at varying opacity**: `text-white` (headings), `text-ice-grey/70` (body), `text-text-muted` (captions), `text-ice-grey/20` (fine print). Prefer opacity steps over new color tokens.
- Borders are white at very low alpha: `border-white/[0.05]` to `border-white/[0.12]`. This reads as a hairline, not a box.
- `::selection` and `:focus-visible` both use orange — the accent shows up exactly where interaction happens.

### Semantic status colors
Only used inside badges:
- Green: `bg-green-500/10 text-green-400 border-green-500/20`
- Red: `bg-red-500/10 text-red-400 border-red-500/20`

---

## 3. Typography

Two typefaces, strict roles.

| Role | Font | Where | Notes |
|---|---|---|---|
| Display / headings | **Clash Display** (Fontshare) | all `h1`–`h6`, stat numbers, big labels | geometric, authoritative. `font-weight: 600`, `line-height: 1.05`, `letter-spacing: -0.02em` |
| Body / UI | **Inter** (Google Fonts) | paragraphs, nav, buttons, captions | `font-weight: 400`, `line-height: 1.65` |

```html
<!-- Load in <head>, preconnect first -->
<link rel="preconnect" href="https://api.fontshare.com" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet"
  href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" />
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />
```

### Fluid display scale
Headings use `clamp()` so they scale with the viewport without breakpoints:

```js
fontSize: {
  'display-xl': ['clamp(2.5rem, 6vw, 6rem)',   { lineHeight: '1.0',  letterSpacing: '-0.02em' }],
  'display-lg': ['clamp(2rem, 4.5vw, 4.5rem)', { lineHeight: '1.0',  letterSpacing: '-0.02em' }],
  'display-md': ['clamp(1.5rem, 3vw, 3rem)',   { lineHeight: '1.05', letterSpacing: '-0.01em' }],
  'display-sm': ['clamp(1.25rem, 2vw, 2rem)',  { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
}
```

### Type conventions
- **Uppercase is opt-in per component**, never forced globally. Headings, eyebrows, buttons, and badges use it; body copy does not.
- **Tracking scales with size, inversely:** big display type is tight (`-0.02em`); small uppercase labels are wide (`tracking-widest` / `tracking-[0.2em]`).
- Small meta labels are tiny + wide + muted: `text-xs`/`text-[10px]`, `tracking-widest`, `uppercase`, `text-text-muted`.
- Use `text-wrap: balance` (`.text-balance`) on headings and short intros so lines break evenly.
- Body paragraphs: `line-height: 1.75`.

---

## 4. Layout & Spacing

- **Content max width:** `max-w-[1600px] mx-auto` on every full-bleed section's inner wrapper.
- **Horizontal padding:** `.section-px` → `clamp(1.5rem, 6vw, 6rem)`. Applied to every section wrapper and the navbars, so everything shares one gutter.
- **Vertical rhythm:** `.section-py` → `clamp(6rem, 12vw, 10rem)` for major sections. Denser sections use explicit `py-12 md:py-16` (stats) or `py-24 md:py-36` (CTA).
- **Fixed-nav offsets:** `.pt-navbar` (72px) and `.pt-nav-full` (72px + 52px = 124px) push page content below the fixed header stack.
- **Extra spacing tokens:** `spacing: { '18': '4.5rem', '22': '5.5rem', '128': '32rem' }`.
- **Bento radius:** one card radius token — `borderRadius: { bento: '1.5rem' }`. Cards use `rounded-bento`; buttons/badges use a plain small `rounded`.

Sections are separated by hairline top borders (`border-t border-white/[0.05]`) rather than large gaps or background color changes — the whole page stays near-black and depth comes from surfaces and borders, not blocks of color.

---

## 5. Texture & Atmosphere

The "technical but calm" feel comes from a handful of near-invisible background layers. All are `pointer-events-none` and `aria-hidden`.

### Telemetry grid
A faint graph-paper grid, ~2% white lines:

```css
.bg-telemetry {           /* 80px cells */
  background-image:
    linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
  background-size: 80px 80px;
}
.bg-telemetry-sm { /* same, 48px cells, 0.018 alpha */ }
```
Also exposed as Tailwind utilities `.telemetry-bg` (72px) and `.telemetry-bg-sm` (40px). Layer at low opacity (`opacity-20` behind heroes, `opacity-60` for a stronger technical block).

### Ambient orb
A single slow-drifting radial glow fixed behind all content — the only ambient motion on the page:

```css
.ambient-orb {
  position: absolute; top: -20%; right: -15%;
  width: 75vw; height: 70vh; border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(242,101,34,0.040) 0%, transparent 70%);
  filter: blur(72px);
  animation: ambient-drift 50s ease-in-out infinite;
}
@keyframes ambient-drift {
  0%,100% { transform: translate(0,0)      scale(1);    }
  33%     { transform: translate(-3%,2%)   scale(1.02); }
  66%     { transform: translate(2%,-1.5%) scale(0.98); }
}
```
Mount it once in the root layout: `<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden"><div class="ambient-orb"></div></div>`.

### Radial hero wash
Orange glow bleeding down from the top of a hero:
```css
.hero-radial-bg {
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(242,101,34,0.16) 0%, transparent 65%);
}
```

### Other atmosphere tokens (Tailwind `backgroundImage`)
- `orange-glow` — `radial-gradient(ellipse at center, rgba(242,101,34,0.18) 0%, transparent 65%)`
- `card-gradient` — `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)`
- `stripe-dark` — 45° hairline stripes at 1.2% white, 8px pitch
- `cta-radial-glow` — upward orange wash behind CTA blocks

**Golden rule:** every atmospheric layer sits between 1%–16% alpha. If you can clearly "see" the effect, it's too strong.

---

## 6. Elevation, Borders & Glass

### Surfaces
Depth is layered, not shadowed. `surface-01 → 02 → 03` step up in lightness. The reusable card base:

```css
.surface-card { background-color: rgb(var(--c-surface-01)); border: 1px solid rgba(255,255,255,0.05); }
.border-subtle { border: 1px solid rgba(255,255,255,0.06); }
.border-glow   { border: 1px solid rgba(242,101,34,0.3); box-shadow: 0 0 20px rgba(242,101,34,0.1); }
```

### Shadows (used sparingly — glow, not drop-shadow)
```js
boxShadow: {
  'orange-glow':  '0 0 50px rgba(242,101,34,0.15), 0 0 100px rgba(242,101,34,0.05)',
  'orange-sm':    '0 0 20px rgba(242,101,34,0.12)',
  'card':         '0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.04)',
  'card-hover':   '0 24px 64px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)',
  'inset-orange': 'inset 0 0 0 1px rgba(242,101,34,0.2)',
}
```

### Glass (backdrop blur) — reserved for fixed navigation only
```css
.navbar-glass      { background: rgba(10,11,15,0.88); backdrop-filter: blur(16px) saturate(180%); }
.local-nav-glass   { background: rgba(10,11,15,0.85); backdrop-filter: blur(12px); }
.mobile-menu-glass { background: rgba(10,11,15,0.97); backdrop-filter: blur(20px); }
```

### Card hover pattern
Cards lift their border, not their whole selves: `border-white/[0.06] hover:border-white/[0.12] transition duration-300`. Keep it subtle.

---

## 7. Core Components

Recipes are given as the actual class strings so you can port them to plain HTML/JSX/Astro/anything.

### Button
Variants `primary | ghost | outline | danger`, sizes `sm | md | lg`. Always uppercase, wide tracking, small text, subtle press (`active:scale-[0.98]`).

```
base:    inline-flex items-center gap-2.5 font-inter font-medium tracking-wider uppercase
         transition duration-200 rounded cursor-pointer
sizes:   sm: px-4 py-2 text-xs | md: px-6 py-3 text-xs | lg: px-8 py-4 text-sm
primary: bg-wtc-orange text-white hover:bg-wtc-neon
         hover:shadow-[0_0_18px_rgba(242,101,34,0.22)] active:scale-[0.98]
ghost:   text-ice-grey/70 hover:text-white hover:bg-white/[0.05] active:scale-[0.98]
outline: border border-wtc-orange/50 text-wtc-orange
         hover:bg-wtc-orange hover:text-white hover:shadow-[0_0_14px_rgba(242,101,34,0.18)]
danger:  bg-red-600/90 text-white hover:bg-red-500
```
Renders `<a>` when given an `href`, otherwise `<button>`.

### Badge
Small status pill, optional leading dot. Variants `orange | green | red | neutral | outline`.
```
inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px]
font-inter font-medium tracking-widest uppercase
orange:  bg-wtc-orange/15 text-wtc-orange border border-wtc-orange/30
neutral: bg-white/[0.05] text-ice-grey border border-white/[0.08]
dot:     <span class="w-1.5 h-1.5 rounded-full bg-{variant}"></span>
```

### SectionLabel (eyebrow)
The signature "numbered section" marker that opens most sections: `01 —— LABEL`.
```html
<div class="flex items-center gap-3">
  <span class="font-clash text-xs font-semibold text-wtc-orange/70 tracking-widest">01</span>
  <span class="w-6 h-[1px] bg-wtc-orange/40"></span>
  <span class="font-inter text-xs font-medium tracking-[0.2em] uppercase text-text-muted">Label</span>
</div>
```

### GlowText (display heading)
Wrapper for headings with optional orange drop-shadow glow or gradient fill.
```
font-clash font-semibold uppercase [display-size]
default:  text-white  +  drop-shadow-[0_0_40px_rgba(242,101,34,0.35)]   (glow)
gradient: .text-orange-gradient  (linear-gradient(135deg,#F26522,#FF7029) clipped to text)
```

### Accent text within headings
Highlight one or two words in orange inside an otherwise-white heading (never a whole heading). Done by wrapping matched words: `<span class="text-wtc-orange">word</span>`. This is the primary way orange appears in typography.

### Card / logo tile
```
rounded-bento bg-surface-01 border border-white/[0.06]
hover:border-white/[0.12] transition duration-300
```
Logos inside use `.logo-adaptive` (`filter: brightness(0) invert(1)` → forces any logo to white) at `opacity-55 group-hover:opacity-80`.

### Dividers
```css
.rule-subtle { height:1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent); }
.rule-orange { height:1px; background: linear-gradient(90deg, transparent, rgba(242,101,34,0.35), transparent); }
```

### ImagePlaceholder
Photo slots that aren't filled yet render as a bordered `surface-02` box with a faint grid, a camera icon (`text-white/20`), and an uppercase label — never a broken image or an empty gap. Aspect ratios: `16/9 · 4/3 · 1/1 · 3/2 · 21/9`.

---

## 8. Section Patterns

Composable full-width sections, each with a `max-w-[1600px]` inner wrapper and `.section-px`.

- **HeroSection** — `100svh` min height, eyebrow + accented `h1` + subtitle + CTA row. Optional background (`radial` telemetry+wash, or plain `telemetry`) and an optional right-side `<canvas>` masked with `linear-gradient(to left, black 30%, transparent 65%)` so it fades into the page. Content starts invisible (`.hero-anim-start`) and is revealed by GSAP (see §10).
- **StatsRow** — 3/4-up grid of big Clash numbers with an orange suffix; numbers **count up** from 0 on scroll into view. Bordered top+bottom, sits on `bg-surface-01/50`.
- **Timeline** — vertical process steps alternating left/right on desktop around a center line (`gradient from-transparent via-wtc-orange/30 to-transparent`), numbered circular nodes (`bg-surface-02 border border-wtc-orange/30`). Steps slide in from their side on scroll.
- **LogoGrid** — responsive 2→6 column grid of logo tiles with a SectionLabel + accented headline + intro. Tiles stagger-fade on scroll; broken logo srcs fall back to a text name via inline `onerror`.
- **CTASection** — centered, `max-w-2xl`, upward orange radial glow, headline + subtext + centered buttons. Top hairline border. The single "next action" closer for a page.

---

## 9. Multi-Brand / Sub-Brand Theming

The system is built for a parent brand with several sub-brands ("branches"). Each branch carries its own accent via a config object and injects it as a CSS variable at the layout level:

```ts
interface BranchConfig {
  id: string;
  name: string;
  tagline: string;
  accentColor: string;      // e.g. '#F26522'
  glowColor: string;        // e.g. 'rgba(242,101,34,0.25)'
  localNav: NavItem[];      // section-level nav for that branch
  rootHref: string;
}
```

```html
<!-- Layout injects the branch accent, overriding the root default -->
<style define:vars={{ branchAccent: branch.accentColor, branchGlow: branch.glowColor }}>
  :root { --branch-accent: var(--branchAccent); --branch-accent-glow: var(--branchGlow); }
</style>
<div data-branch={branch.id}> … </div>
```

To reuse: keep components referencing `--branch-accent` where a per-brand accent is wanted, and `--color-orange` where the parent accent must stay fixed. (In the current site every branch happens to share the same orange, but the plumbing supports divergence.)

Navigation is two-tier: a **global navbar** (fixed, 72px, glass) listing the sub-brands, plus an optional **local nav** (fixed, 52px, sits directly under the navbar) listing sections within the active branch. Active items are marked in orange with a small dot (global) or a 2px underline (local).

---

## 10. Motion System

Motion **reveals structure; it never performs.** Powered by GSAP + ScrollTrigger, with Lenis for smooth scroll.

### Setup (singletons)
- GSAP + ScrollTrigger registered once in a shared module; imported everywhere.
- Lenis config: `duration: 1.15`, easing `t => Math.min(1, 1.001 - 2^(-10t))`, `touchMultiplier: 1.5`.
- Wire them together in the root layout:
  ```js
  lenis.on('scroll', () => ScrollTrigger.update());
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
- Kill stale triggers before SPA navigation (`astro:before-swap`), refresh after (`astro:after-swap`).

### Signature animations
- **Hero reveal** — title/eyebrow/subtitle/CTAs fade + lift (`y: 28–60`) + de-blur (`filter: blur(10px)→0`), staggered by `delay` 0 → 0.58, `ease: power3.out`. Elements start at `opacity: 0` via `.hero-anim-start` so there's no flash of unstyled motion.
- **Reveal on scroll** — cards/sections fade up with a slight scale: `{ y: 36, opacity: 0, scale: 0.97 } → { y:0, opacity:1, scale:1 }`, `stagger 0.12`, `duration 0.8`, `ease power3.out`, `start: 'top 88%'`, `once: true`.
- **Heading char reveal** ("racing brake") — split heading into chars in `overflow:hidden` masks, animate each `y: 110% → 0%`, `stagger 0.03`, `ease power4.out`.
- **Count-up stats** — tween a number from 0 to target over `2.2s`, `ease power2.out`, triggered once at `top 88%`.
- **Page transition** — full-screen `bg-wtc-black` overlay fades in with the centered logo before navigation, out after.

### Motion rules
- Everything triggers **`once: true`** — no re-animating on scroll-back.
- Triggers fire at `top 88%` (element 12% into viewport).
- Eases are always `power3.out` / `power4.out` — decelerating, never bouncy.
- Initial hidden states live in CSS utility classes (`.js-reveal`, `.js-slide-up`, `.js-scale-in`, `.hero-anim-start`) so content is styled before JS runs.

---

## 11. Accessibility

Target **WCAG 2.1 AA**, non-negotiable.

- **Contrast:** ≥4.5:1 body text, ≥3:1 large text and UI components.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` clamps all animation/transition to `0.01ms` **and** force-resets the JS initial-state classes to `opacity:1; transform:none` so nothing stays invisible:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *,*::before,*::after { animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; }
    .js-reveal,.js-slide-up,.js-scale-in,.hero-anim-start { opacity:1!important; transform:none!important; }
  }
  ```
- **Focus:** `:focus-visible { outline: 2px solid var(--color-orange); outline-offset: 3px; }`.
- **Skip link:** a visually-hidden "skip to content" that appears on focus (`sr-only focus:not-sr-only …`).
- **Semantic HTML first**, ARIA only to fill gaps. Decorative layers are `aria-hidden` + `pointer-events-none`.
- **Mobile menu** implements a full focus trap, `Escape` to close, `aria-expanded`/`aria-controls`, and returns focus to the trigger.
- **Custom scrollbar** is a thin 3px dark track (`::-webkit-scrollbar`), never hides content.

---

## 12. Tech Stack (as built)

- **Framework:** Astro 4, static output (any static/SSR framework works — nothing here is Astro-specific except the `astro:*` lifecycle hooks).
- **Styling:** Tailwind CSS v3. All theme colors via the `rgb(var(--c-XXX) / <alpha-value>)` pattern so opacity utilities stay alive.
- **Animation:** GSAP 3 + ScrollTrigger + Lenis.
- **Fonts:** Clash Display (Fontshare CDN) + Inter (Google Fonts).
- **Typography plugin:** `@tailwindcss/typography` for long-form legal/content pages.

### Minimal Tailwind config to reproduce
```js
theme: { extend: {
  colors: {
    'wtc-black':  'rgb(var(--c-bg) / <alpha-value>)',
    'wtc-white':  'rgb(var(--c-white) / <alpha-value>)',
    'ice-grey':   'rgb(var(--c-ice) / <alpha-value>)',
    'surface-01': 'rgb(var(--c-surface-01) / <alpha-value>)',
    'surface-02': 'rgb(var(--c-surface-02) / <alpha-value>)',
    'surface-03': 'rgb(var(--c-surface-03) / <alpha-value>)',
    'border-dim': 'rgb(var(--c-border) / <alpha-value>)',
    'text-muted': 'rgb(var(--c-text-muted) / <alpha-value>)',
    'wtc-orange': '#F26522',   // fixed
    'wtc-neon':   '#FF7029',   // fixed
  },
  fontFamily: { clash: ['"Clash Display"', ...sans], inter: ['Inter', ...sans] },
  borderRadius: { bento: '1.5rem' },
  // + display-xl/lg/md/sm sizes and shadow/backgroundImage tokens from §3, §5, §6
}}
```

---

## Quick-start checklist for a new project

1. Drop the `:root` token block (§2) into your global CSS; add the reduced-motion + focus + scrollbar + selection rules (§11).
2. Wire Tailwind to consume the tokens via `rgb(var(--c-XX) / <alpha-value>)` (§12); add the `display-*` type scale, `bento` radius, and shadow/atmosphere tokens.
3. Load Clash Display + Inter with preconnect (§3). Set `body` to `bg-wtc-black text-white font-inter`, headings to `font-clash`.
4. Mount the ambient orb once, page-level (§5). Add telemetry-grid utilities.
5. Build the primitives — Button, Badge, SectionLabel, GlowText, Card (§7).
6. Assemble sections from the patterns in §8; open each with a numbered SectionLabel and give it a `border-t border-white/[0.05]`.
7. Add GSAP + Lenis, wire the ticker, and use only the five signature animations from §10 (all `once: true`, `power3.out`, trigger `top 88%`).
8. Audit against the five principles (§1) — especially: **is there more than one orange element in any single visual unit?** If so, remove until there's one.
