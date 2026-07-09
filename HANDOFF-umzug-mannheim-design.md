# Handoff: /umzug-mannheim/ Page — Design & Visual Polish

**For:** Design/frontend agent  
**Date:** 2026-07-07  
**Project:** umzuege-herkules.de — static HTML site, deployed on Vercel  
**Local preview:** `python3 .claude/serve.py 3001` → http://localhost:3001/umzug-mannheim/

---

## What Was Built

A new SEO city page targeting "Umzug Mannheim" — the #1 keyword for the business. The page was built by copying the structural pattern of `umzug-frankfurt.html` (the best-performing existing page) and adding Mannheim-specific content, a price table section, and a Google Maps embed.

**File:** `umzug-mannheim.html`  
**Live URL (production):** `https://www.umzuege-herkules.de/umzug-mannheim/`  
**Vercel routing:** `vercel.json` rewrite `/umzug-mannheim/` → `umzug-mannheim.html` ✅  
**Internal links pointing here:**
- Homepage (`index.html`) Standorte nav → "Umzug Mannheim"
- Homepage services section body → "Ihr Umzug in Mannheim →"

---

## Page Structure (Top to Bottom)

| Section | Class(es) | Notes |
|---|---|---|
| Hero | `.hero` | H1: "Umzugsfirma Mannheim / Festpreis. Versichert. Seit 2004." — dual CTAs (Angebot + Jetzt anrufen) |
| Trust ribbon | `.trust-ribbon` | Scrolling marquee, 4 badges × 2 (duplicate for infinite scroll) |
| Mannheim local | `.frankfurt-local-section` | 2 body paragraphs + 3-col feature grid |
| Proof / use cases | `.frankfurt-proof-section` | 3 Mannheim scenarios in case grid |
| **Price table** ← NEW | `.pricing-section--table` | 4 cards (1–4 Zimmer), price range + bullets + CTA each. Not on Frankfurt page. |
| Services grid | `.services-section` | 7 service cards, identical to rest of site |
| Process | `.process-section` | 4-step process, ol.process-steps |
| Reviews | `.reviews-section` | Dual marquee rows (same reviews as all other pages) |
| Pricing options | `.pricing-section` | Two cards: Festpreis + Stundenpreis (Frankfurt only has Festpreis) |
| FAQ | `.faq-section.is-open` | 12 questions, always visible (no mobile toggle), accordion per item |
| Contact + Maps | `.final-cta` | Form + Google Maps iframe embedded |
| Footer | `.site-footer` | Standard sitewide footer |

---

## Design Issues That Need Attention

### 1. Price Table Cards — No Existing Styles
**Critical.** The price table section uses `.service-card--price` and `.price-range` classes that **do not exist in `styles.css`**. Right now the 4 price cards render as plain `.service-card` elements (same as the services grid), which looks wrong — the price range (`350 – 550 €`) is just a paragraph with no visual emphasis.

**What's needed:**
- `.service-card--price` modifier: different background or border to visually distinguish from service cards (e.g. a subtle highlight on the "recommended" size)
- `.price-range` style: large, bold, prominent — this is the key data point users look for. Competitors use 24–32px bold text in a contrasting color for this
- The 4 cards need visual hierarchy: all 4 are equal right now, but the 2-Zimmer and 3-Zimmer options are most common — could subtly emphasize them
- The `<ul>` inside each card needs list styling (checkmarks or bullets) consistent with `.pricing-option ul` elsewhere on the page

**Reference:** Look at `.pricing-option` in `styles.css` — similar card pattern with `pricing-label`, `h3`, `ul`, and a summary div. The price cards should feel related but distinct.

---

### 2. `mannheim-page` Body Class — No CSS Rules
**Minor visual.** The body has `class="private-page location-page mannheim-page"`. The `frankfurt-page` class likely sets hero background tinting or section accent colors specific to Frankfurt. There are no `.mannheim-page` rules in `styles.css`, so the Mannheim page inherits whatever the generic `location-page` styles are.

**What's needed:**
- Check what `.frankfurt-page` overrides in `styles.css`
- Add `.mannheim-page` with the same or adapted rules so the page doesn't accidentally inherit Frankfurt-specific styling

---

### 3. Local Section — Reuses Frankfurt CSS Classes
The Mannheim local section uses `.frankfurt-local-section`, `.frankfurt-local-grid`, `.frankfurt-proof-section`, `.frankfurt-case-grid`. This works visually since the CSS applies, but it's semantically wrong.

**Options:**
- A) Rename to `.city-local-section`, `.city-local-grid` etc. in CSS (generic reusable pattern) and update both Frankfurt and Mannheim pages
- B) Leave as-is (no visual problem, just naming debt)

Option A is cleaner if you're building more city pages.

---

### 4. Google Maps Iframe — Needs Sizing Check
The Maps embed is inside the contact `<address>` block with `max-width: 420px` inline style. On desktop it sits awkwardly inside the address column next to the contact form. It may need to be:
- Moved to its own row below the contact columns
- Or given a proper full-width treatment within the `.final-cta` layout

**Current markup location:** inside `<address class="contact-info">`, after the WhatsApp link.  
**Suggested position:** between the `<address>` block and the form's `<div class="final-cta__layout">`, spanning full width.

---

### 5. Pricing Section — Two Options vs One
The Frankfurt page only shows Festpreis (`.pricing-options--single` modifier, single card centered). The Mannheim page shows both Festpreis + Stundenpreis (two cards side by side, no `--single` modifier).

Check that two cards render correctly at all breakpoints — the `.pricing-options` grid may assume 1 card (Frankfurt) and need a 2-column variant for Mannheim.

---

### 6. Hero Headline — Line Break on Mobile
The H1 `"Umzugsfirma Mannheim / Festpreis. Versichert. Seit 2004."` has a `<br />` after "Mannheim" and another inside the `<span>`. On mobile this may stack awkwardly. Compare against the Frankfurt hero ("Umzugsfirma Frankfurt / stressfrei umziehen") which is 2 lines. The Mannheim version has more words in the span — may need a shorter variant or responsive font-size check.

---

## Site Tech Reference

| Item | Detail |
|---|---|
| CSS file | `/styles.css?v=20260702` (single file, no framework) |
| Secondary CSS | `/blog.css` — blog pages only, not relevant here |
| JS | `request-form.js`, `cookie-consent.js`, `google-tracking.js` — all deferred |
| Font | Loaded via CSS (likely Google Fonts or system stack — check `styles.css` top) |
| Images | `/assets/` directory, WebP format, some PNG |
| Brand color | `#f8bf1c` (yellow) — `theme-color` meta tag |
| Hero image | `/assets/hero-new-logo-desktop.webp` — preloaded with `fetchpriority="high"` |
| No build step | Pure HTML/CSS/JS, `npm run build` just copies to `dist/` for Vercel |

---

## Existing Design Patterns to Match

The Frankfurt page (`umzug-frankfurt.html`) is the gold standard for layout. When in doubt, make the Mannheim page look identical to Frankfurt except where noted above.

Key reused patterns from Frankfurt that are already in place on the Mannheim page:
- `.hero` with dual hero images (desktop/mobile)
- `.trust-ribbon` infinite marquee
- `.service-grid` with `.service-card` articles
- `.process-steps` ordered list with icons
- `.reviews-section` with dual `.reviews-marquee` + `.reviews-track`
- `.faq-section` with `.faq-item` accordion items
- `.final-cta` with side-by-side address + form layout

---

## Assets Available

All assets referenced on the page already exist in `/assets/`:
- `hero-new-logo-desktop.webp` ✅
- `google-favicon.webp` ✅
- `herkules-price-icon.webp` ✅
- `herkules-insurance-icon.webp` ✅
- `herkules-speed-icon.webp` ✅
- `private-service-real.webp` ✅ (used as placeholder — ideally replace with Mannheim-specific photo)
- `office-service-real.webp` ✅ (placeholder)
- All 7 service card images ✅
- `process-anfrage/angebot/planung/durchfuhrung.webp` ✅
- `cta-background.webm` + `cta-background-poster.jpg` ✅
- `services-truck-new-logo-transparent.webp` ✅
- `new-footer-2-transparent.webp` ✅

**Missing / ideal to add:**
- A real photo of a Mannheim street or move in the city (for `.frankfurt-local-section__visual` and `.frankfurt-proof-section__visual`). Currently shows generic team photos.

---

## What NOT to Change

- All copy (German text) — SEO-optimised, do not rewrite
- All schema JSON-LD in `<head>` — structured data, leave untouched
- All internal links and hrefs
- The FAQ `is-open` class on the section — intentional (removes mobile toggle)
- The `price-range` text values (350–550 €, etc.) — competitive research data
