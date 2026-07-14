# WTC Web — Claude Design Context

## Design Context

### Users

Each of WTC's five business units serves a distinct audience:

- **WTC Services** — IT managers, CTOs, and SME owners who need reliable tech infrastructure without drama. They arrive stressed and want to feel like someone competent is already handling it.
- **WTC Team** — Talent, candidates, and partners evaluating the company culture and professionalism.
- **Global Portal** — B2B contacts and international trade partners who expect precision and authority.
- **Pitter Italy** — Industrial buyers, procurement managers, and operations directors evaluating machinery.
- **WTC Food** — Buyers, distributors, and restaurateurs interested in direct-source agricultural products.

**Core insight**: The audience is variable by BU. Every page must communicate competence and calm confidence immediately — before the user has read a single word.

### Brand Personality

**Three words: Calm. Sharp. Reliable.**

- **Calm**: The site should never feel rushed, loud, or chaotic. No flashing alerts, no aggressive CTAs, no visual noise. Users arrive with problems; the site should make them feel those problems are already solved.
- **Sharp**: Precise language, tight spacing, deliberate typography. Every element earns its place. No decoration for decoration's sake.
- **Reliable**: Consistent patterns, predictable navigation, nothing that surprises negatively. The design itself is a proof of competence.

**Emotional goal**: A visitor should feel quiet confidence — "these people know what they're doing."

**Voice**: Plain Italian. Direct, specific, never jargon-heavy. Descriptions over labels. Human-first.

### Aesthetic Direction

**Visual tone**: Dark-first, minimal, technical without being cold. Think high-end infrastructure tooling meets editorial precision — not a startup landing page, not an enterprise brochure.

**What it IS**:
- Near-black backgrounds with carefully layered surfaces
- Orange (#F26522) as a rare, meaningful accent — not decoration
- Clash Display for display headings (geometric, authoritative), Inter for body (readable, neutral)
- Subtle environmental details: telemetry grids, ambient orbs, grain texture at near-zero opacity
- Motion that reveals structure, not motion that performs

**Anti-reference — Generic SaaS**:
Explicitly avoid: purple/cyan gradients, glassmorphism overload, floating 3D icons, "10x your productivity" copy, hero sections with a grid of 40 feature tiles, modal popups on load, countdown timers, excessive badge stacking ("SOC2 ✓ ISO27001 ✓ GDPR ✓"), AI slop typography (oversized emoji bullets, alternating colored words).

**Theme**: Dark mode primary. Light mode available via toggle — both must be polished, not an afterthought.

**Reference feel**: Clean ops tooling (Linear, Vercel dashboard) meets a premium Italian services firm. Quiet confidence, not loud ambition.

### Design Principles

1. **Calm is the product** — If a page creates anxiety, it's broken. Every layout decision should reduce cognitive load, not add to it. One clear next action per section.

2. **Earn every pixel** — No element should exist without a reason. If removing it doesn't hurt comprehension, remove it. Decoration is only acceptable when it reinforces structure.

3. **Orange is punctuation, not paint** — The brand accent is used like a period at the end of a sentence: rare, deliberate, meaningful. One orange element per visual unit maximum.

4. **Competence is shown, not claimed** — Avoid stating "we are experts." Show it through precision: tight grid alignment, consistent token use, no typos, no placeholder text, no unfinished states.

5. **Plain language wins** — Every label, CTA, and nav item must pass the "drunk gramma test": immediately understandable to a non-technical Italian speaker. Technical depth lives in body copy, never in navigation.

---

## Tech Stack

- **Framework**: Astro 4 (static output)
- **Styling**: Tailwind CSS v3 — all colors via `rgb(var(--c-XXX) / alpha)` pattern
- **Animation**: GSAP 3 + ScrollTrigger (singleton in `src/lib/gsap.ts`) + Lenis smooth scroll
- **Fonts**: Clash Display (Fontshare CDN) for headings, Inter (Google Fonts) for body
- **Theme**: `[data-theme="light"]` on `<html>`, persisted in `localStorage('wtc-theme')`

## Design Tokens (quick reference)

| Token | Dark | Light role |
|---|---|---|
| `--c-bg` | `10 11 15` | near-white |
| `--c-surface-01/02/03` | layered dark | layered light |
| `--c-border` | `42 43 53` | subtle divider |
| `--c-text-muted` | `107 114 128` | secondary text |
| `wtc-orange` | `#F26522` | fixed |
| `wtc-neon` | `#FF7029` | fixed |

## Accessibility Target

**WCAG 2.1 AA** — enforced across:
- Contrast ratios: ≥4.5:1 for body text, ≥3:1 for large text and UI components
- Keyboard navigation: all interactive elements reachable and operable
- ARIA: semantic HTML first, ARIA only to fill gaps
- Reduced motion: `prefers-reduced-motion` fully respected (all GSAP animations have static fallbacks via `.js-reveal` opacity:1 override)
- Focus indicators: `outline: 2px solid var(--color-orange)` on `:focus-visible`
