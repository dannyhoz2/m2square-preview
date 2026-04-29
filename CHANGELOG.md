# MSquare site — redesign changelog

## 2026-04-27 — Editorial Trust redesign

Full rewrite of `index.html`, `styles.css`, `script.js`. Existing copy preserved as
source of truth and tightened. Static-site / GitHub Pages architecture unchanged.

### What changed
- New visual system: warm off-white palette, navy ink, royal-blue accents, single
  warm-orange CTA color. Removed the `#667eea → #764ba2` purple/pink gradient
  everywhere.
- Typography pair: Calistoga (display, h1/h2 only), Inter (body, 400/500/600/700),
  JetBrains Mono 500 (small uppercase eyebrows). Loaded via Google Fonts with
  `font-display: swap`.
- Design tokens: spacing (4pt grid), radius, shadow, color, type scale exposed as
  CSS custom properties. Dark-mode token set wired through `prefers-color-scheme`.
- Sticky glass nav with logo + wordmark (fixes the "Square"-only bug), anchor
  links, primary orange CTA, and a full-screen mobile overlay (replaces the old
  `display:none` hamburger gap).
- Hero rewrite: editorial centered layout, no image background, hand-drawn SVG
  underline on the word "breaks", subtle drifting orange blob + dot grid with
  cursor parallax. Two CTAs above the fold. Slow marquee logo strip placeholder.
- New Trust strip with 4 stat cards that count up on scroll-into-view.
- Services section: desktop tabs / mobile accordion replacing the 5-card grid;
  each service has tightened benefit-led copy + 4–6 bullets + a "Recent work"
  example block.
- New Approach section: 3-step horizontal timeline ("Discover → Embed → Deliver")
  with an animated SVG connecting line and staggered card reveals.
- About section rewrite: Yakira-led portrait + bio + pull-quote, with the
  existing event-setup photo clearly labeled as a placeholder.
- Why-Us reformatted as 4 sharper claims using inline Lucide icons.
- New Testimonials section with 3 placeholder cards (clearly labeled, no
  fabricated quotes).
- Contact section rebuilt as a dark band with inline 3-field form (Name / Email /
  "What do you need?") with inline validation, success state, mailto fallback,
  and a Calendly-button placeholder.
- Three-column footer.
- All emojis removed; replaced with inline Lucide SVG icons.
- GSAP + ScrollTrigger + Lenis loaded conditionally from CDN; everything gated
  behind `prefers-reduced-motion`.
- Added Open Graph / Twitter meta, JSON-LD `Organization` schema, theme-color,
  and updated `<title>`.
- Skip-link, focus rings, ARIA labels, `role="alert"` errors, `aria-live` form
  status, 44px+ touch targets.

### TODO — assets / copy from Yakira
- **Portrait of Yakira** (replace `images/yakira-event-setup.jpeg` placeholder
  in About section). Round-cornered, ideally 4:5 aspect ratio.
- **Real client logos** for the hero marquee strip (currently shows
  "Logos coming soon — ask about our client list" placeholder).
- **Real testimonials** with names, titles, companies, and explicit permission
  to publish (currently 3 "Quote pending" placeholder cards).
- **Pull-quote attribution** — confirm the quote in the About section is
  acceptable to publish under Yakira's name.
- **Stat numbers** — verify the 200+ events / 12 offices / $8M+ budget /
  10+ years figures, or supply real ones.

### TODO — integrations / placeholders in code
- `FORM_ENDPOINT` constant in `script.js` — replace with real Formspree or
  Getform.io endpoint URL. Until then the form simulates a success response so
  the UX can be demoed.
- `CALENDLY_URL` constant in `script.js` — set to Yakira's Calendly link; the
  "Or grab a 20-min slot" button currently scrolls to the form.
- `LINKEDIN_URL` constant in `script.js` — set to MSquare's LinkedIn URL; the
  footer LinkedIn link is otherwise inert.
- **Favicon files** — currently re-using `/images/m2square-logo.png`. Add a
  proper `favicon.ico`, `apple-touch-icon.png`, and themed PNGs when produced.
- ~~**`/images/og-image.png`** — referenced by the meta tags but not yet present
  in the repo.~~ ✓ Generated 2026-04-27 (1200×630 PNG, Calistoga + Inter,
  warm orange accent on "nothing breaks").
- Update `Organization` JSON-LD `sameAs` array once social URLs are confirmed.

### Post-handoff fixes (2026-04-27)
- Added inline `<script>document.documentElement.classList.add('js')</script>`
  in `<head>` and a CSS guard at the top of `styles.css` so all `opacity:0`
  reveal-staged content renders immediately if JS fails to load (ad-blocker,
  JS disabled, slow network). Without this, the entire hero was invisible
  in no-JS environments.
- Generated and committed `/images/og-image.png` (1200×630).
- **Removed Lenis smooth-scroll** — was causing the page to feel stuck
  and then jump several sections at once. Native browser scroll (especially
  on macOS with momentum) is buttery without Lenis on a one-page site.
- **Fixed broken hero headline layout** — the JS word-splitter was wrapping
  the `.hero-emph` element in a `.word` span, which forced "breaks" + the
  SVG underline onto its own line with a large vertical gap. Replaced the
  word-by-word stagger with a single-block fade-up on the whole `<h1>`.
  `splitHeroTitle()` is now a no-op (left in place for call-site
  compatibility); the title animates via the new
  `[data-anim="hero-title"]` rule in `styles.css`.

### Hard rules verified
- No emoji icons.
- No purple/pink gradient.
- No build step.
- No custom cursor / cursor trail / autoplay video / audio.
- Animations limited to `transform` and `opacity`.
- `prefers-reduced-motion: reduce` short-circuits all motion.
- GitHub Pages structure (`index.html`, `CNAME`) unchanged.
