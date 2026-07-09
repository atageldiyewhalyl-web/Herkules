# SEO Audit Report — umzuege-herkules.de
**Date:** 2026-07-09
**Business type:** Local moving company (Umzugsfirma), Mannheim/Rhein-Neckar-Region
**Language/Geo:** German (de-DE), DE-BW primary
**Platform:** Static HTML, Vercel CDN
**Scope:** 7 of 8 specialists run (Technical, Content/E-E-A-T, Schema, GEO, Local SEO, SXO, Sitemap). Backlinks was skipped at the client's request this pass — score below is **carried over unchanged from the 2026-07-08 audit** (11/100) and not re-verified.

---

## Overall SEO Health Score: 64 / 100 (previous: 59 / 100, +5)

| Category | Weight | Raw Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 68 | 15.0 |
| Content Quality / E-E-A-T | 23% | 74 | 17.0 |
| Schema / Structured Data | 10% | 68 | 6.8 |
| GEO / AI Search Readiness | 10% | 68 | 6.8 |
| Local SEO | 10% | 60 | 6.0 |
| SXO (Search Experience) | 5% | 51 | 2.6 |
| Sitemap | 10% | 87 | 8.7 |
| Backlinks *(carried over, not re-audited)* | 10% | 11 | 1.1 |
| **TOTAL** | **100%** | | **63.9 → 64** |

**What moved the needle since 2026-07-08:** Sitemap jumped from 74→87 — every city/location page now returns a live 200 (the single largest issue from the last audit is resolved for 8 of 9 city pages). Content improved 64→74 on the strength of genuinely non-generic local copy. Technical held flat at 68-71 because a *new* deploy gap appeared (`/umzug-mannheim/` — see below) even as the old city-page 404s got fixed elsewhere.

---

## Executive Summary

### Top 5 Critical Issues

1. **`/umzug-mannheim/` still 404s in production.** The single highest-value keyword page (homepage title is literally "Umzugsunternehmen Mannheim") exists as a complete, well-written source file (`umzug-mannheim.html`) but was never added to `scripts/prerender.js`'s `routes` array, so it never reaches `dist/`. Confirmed independently by the Technical, Local, and SXO agents. **This is the same root-cause class of bug flagged in the previous audit, just on a different page** — the fix pattern is known (every other city page follows the same route-registration pattern), it just hasn't been applied to this one file yet.
2. **Broken JSON-LD on `umzug-mannheim-quadrate.html`** — an unescaped `"` inside a FAQ answer (`„B6, 12"?`) breaks the entire structured-data block for that page. Currently only in the local uncommitted copy (the live version is still valid), so this is a **pre-deploy blocker**, not yet a live bug — but it will nullify all schema on that page the moment it ships as-is.
3. **`umzug-neckarstadt.html` has a broken canonical tag** pointing to `/umzug-mannheim/` instead of itself, plus duplicate `og:title`/`twitter:title` reading "Umzug Mannheim" and a visible FAQ heading that still says "...in Mannheim" instead of "...in der Neckarstadt." This tells Google the page is a duplicate of the Mannheim page and risks it being dropped from the index or misattributed. The page's own JSON-LD is correctly Neckarstadt-specific — only the meta tags and one heading were missed in what looks like an incomplete find-and-replace pass.
4. **Security headers configured but not live.** `vercel.json` defines `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` for all routes, but none of them are actually present in live response headers — only the platform-default HSTS shows up. The site currently has no clickjacking or MIME-sniffing protection in production despite the config existing.
5. **Review-count and rating data don't reconcile across the site — or against reality.** Schema `ratingCount` is "48" on most pages but "100" on `umzug-neckarstadt.html`; visible copy separately claims "100+ zufriedene Kunden" (homepage ribbon) and "400+ zufriedene Kunden pro Jahr" (About page) — three different, unreconciled numbers. Worse, the live third-party citation on 11880.com shows **3.0★ from 8 reviews**, sharply at odds with the site's claimed 4.8★. This is exactly the kind of inconsistency search engines' quality systems flag as a fabricated-data signal, independent of whether the underlying 4.8★ is genuine.

### Top 5 Quick Wins (high impact, low effort)

1. **Add `umzug-mannheim.html` to `scripts/prerender.js`'s `routes` array**, rebuild, redeploy, add to sitemap. One-line-pattern fix for the top critical issue above.
2. **Fix the one unescaped quote in `umzug-mannheim-quadrate.html`'s FAQ JSON-LD** before it ships. Single-character fix, prevents a full schema-block failure.
3. **Fix `umzug-neckarstadt.html`'s canonical, og:title, twitter:title, and FAQ H2** to reference Neckarstadt instead of Mannheim. Four small text edits.
4. **Remove the two deprecated `HowTo` schema blocks** (`aussenaufzug.html`, `halteverbotszone.html`) — Google stopped supporting HowTo rich results in Sept 2023; these blocks are dead weight with zero SERP benefit today.
5. **Replace self-referential `sameAs` values** (`["https://www.umzuege-herkules.de/"]`) on the 10+ pages still using them with the correct Google Maps CID + Yelp URLs already used correctly on `index.html`, `umzugsfirma-heidelberg.html`, and `umzug-mannheim.html` — copy-paste the working pattern. (Also fix the underlying Yelp URL, which currently 404s.)

---

## 1. Technical SEO (weight: 22%) — Raw score: 68/100

**Status:** PASS with 1 critical routing bug | FAIL on security headers | FAIL on redirect consistency

- **Critical:** `/umzug-mannheim/` confirmed 404 live (308 redirect to trailing slash succeeds, then 404s). Root cause: missing entry in `scripts/prerender.js` `routes` array (lines 7-29) — every other city page is listed, this one isn't. `dist/` has no `umzug-mannheim/` directory. Not currently linked internally or in the sitemap, so it isn't actively bleeding crawl budget today, but it's an orphaned dead-end for anyone following old links/citations to what should be the flagship city page. A stray empty `umzug-mannheim/` directory also exists at repo root (cleanup candidate, not the cause).
- **Critical:** Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) defined in `vercel.json` (lines 249-270) but **absent from live responses** — only `strict-transport-security` appears. Suggests the live deployment predates the current config, or the static-deploy path isn't honoring the `headers` block. No CSP at all either.
- **High:** Redirect chain inconsistency — `http://umzuege-herkules.de/` → 308 → `https://umzuege-herkules.de/` → **307** → `https://www.umzuege-herkules.de/`. Mixing 307 (temporary) into what should be a permanent canonicalization wastes a hop and is semantically wrong.
- **Medium:** `umzugsfirma-heidelberg` is a legacy slug that correctly 308-redirects to canonical `/umzug-heidelberg/` — not a bug, but confirms a naming-convention divergence from the other `umzug-*`/`umzugsfirma-*` pages worth being aware of.
- **Medium:** Same 111KB hero image served to both desktop and mobile `<img>` tags (both present in DOM, CSS toggles visibility) — avoidable mobile LCP weight.
- **Medium:** Dead JS in the homepage inline script references a `.hero-video--mobile` element and `.webm`/`.mp4` assets that don't exist in the current DOM/build (both 404) — stale code, not currently harmful but should be cleaned up.
- **Medium:** No IndexNow implementation — low-effort win given sitemap.xml is already regenerated on every build.
- **Low:** HSTS missing `includeSubDomains`/`preload`. Mobile nav toggle is 42×42px (just under the 44×44px touch-target guideline). No `<link rel="preload">` for the hero image/video; the referenced `hero-video.webm` is 4.57MB — worth confirming it isn't on the LCP critical path. A 2.5GB unrelated `.mov` file sits in the repo root (housekeeping only, not shipped).
- **What's working well:** robots.txt clean, sitemap.xml valid with 23 accurate 200-status URLs, all 11 checked canonicals self-reference correctly (absolute, HTTPS, www, trailing-slash consistent), no accidental noindex anywhere checked, fully static/SSR with real `<a href>` navigation (no JS-dependent routing), HTTPS+HSTS enforced, CLS well-controlled via explicit hero sizing, correct mobile viewport meta.

## 2. Content Quality & E-E-A-T (weight: 23%) — Raw score: 74/100

**Weighted E-E-A-T sub-score: ≈69/100** (Experience 72, Expertise 68, Authoritativeness 60, Trustworthiness 74)

- **Critical:** `umzug-neckarstadt.html` canonical/meta/heading bug (see Executive Summary #3).
- **High:** Review/customer-count inconsistency across schema and visible copy (see Executive Summary #5).
- **Medium:** All 3 blog posts have a broken in-page table of contents — every sidebar link points to `#article-top` instead of a real section anchor (only the last "FAQ" link is correct). Reduces both UX and AI/LLM section-level citability.
- **Medium:** `umzugsfirma-schwetzingen.html` (1,712 words) and `umzugsfirma-viernheim.html` (1,741 words) have noticeably shallower section coverage (5 H2s) than their 7 sibling city pages (7-9 H2s) — missing the "typische Umzüge" and standalone "Leistungen" sections the others have.
- **Medium:** No formal industry-credential signals anywhere (AMÖ/BSM membership, specific liability-insurance figures) beyond the generic word "versichert" repeated ~15+ times sitewide — a real but modest trust-building gap for a business that physically handles customers' possessions.
- **Low:** `leistungen.html` hub page is thin (~205 words) — acceptable for a navigational hub type, but a 2-3 sentence intro would help.
- **Low:** Footer/nav links to `/umzug-heidelberg/` while the source file is `umzugsfirma-heidelberg.html` — resolves correctly via redirect/canonical today, worth a routing sanity check periodically.
- **Strength — AI content quality passes cleanly.** Specific local street/district names, real price ranges, concrete operational detail (Viertelstunden-Abrechnung, named owner with bio, tax-deduction specifics), no detectable factual errors. Reads as competently human-written, not mass-produced filler.
- **Strength — Impressum is fully §5 TMG-compliant**, insurance/trust messaging is consistent, content depth clears QRG minimums on effectively every page except the intentionally-thin `leistungen.html` hub.

## 3. Schema & Structured Data (weight: 10%) — Raw score: 68/100

- **Critical:** `umzug-mannheim-quadrate.html` — entire JSON-LD block fails to parse due to an unescaped quote (see Executive Summary #2).
- **Critical:** Deprecated `HowTo` schema still present on `aussenaufzug.html` and `halteverbotszone.html` (Google removed HowTo rich results Sept 2023 — pure dead weight now).
- **Critical:** Self-referential `sameAs` on 10+ pages, vs. the correct GBP-CID + Yelp pattern already used correctly on 3 pages (see Executive Summary #5/Quick Win #5). The referenced Yelp URL itself also 404s and needs fixing at the source.
- **High:** Three pages (`aussenaufzug.html`, `halteverbotszone.html`, `umzugskartons.html`) redeclare the same `@id: .../#organization` node but with only `name`/`telephone`/`email`/`address` — no logo, rating, geo, hours, sameAs. Since Google merges nodes by `@id`, this risks an impoverished Organization entity being indexed if crawled from these URLs. Better fix: reference `{"@id": ".../#organization"}` via `provider` inside each page's `Service` node, matching the pattern already used correctly elsewhere.
- **High:** `logo` property is a bare string on 7 pages vs. the recommended `ImageObject` (with width/height) used on the other 6 — standardize on the richer form.
- **High:** `ratingCount` mismatch, "48" vs "100" (ties to Executive Summary #5).
- **High:** `umzug-neckarstadt.html` missing `BreadcrumbList` (every sibling city page has one).
- **Medium:** `FAQPage` schema present sitewide but Google restricts FAQ rich results to gov/health sites since Aug 2023 — no Google SERP benefit, though it still helps AI/LLM citation (GEO value), so keep if GEO matters, understand it won't earn rich results.
- **Medium:** `/blog/` page's `Blog` schema declares an inline `Organization` instead of referencing the main `@id` — fragments the entity graph.
- **Low/Info:** No non-schema issue, but flagging since it touches metadata: `blog/halteverbotszone-beantragen-mannheim/index.html` has a malformed `<title>` tag with a stray duplicate closing tag leaking visible text. `www`/protocol usage is 100% consistent across every schema block checked — no leakage found.
- **Missed opportunity:** No individual `Review` objects despite 15+ real, named testimonials already in the homepage HTML — converting even 3-5 into schema `Review` items would strengthen the `AggregateRating`'s credibility.

## 4. GEO / AI Search Readiness (weight: 10%) — Raw score: 68/100

| Dimension | Score |
|---|---|
| Citability | 58/100 |
| Structural Readability | 78/100 |
| Multi-Modal Content | 45/100 |
| Authority & Brand Signals | 42/100 |
| Technical Accessibility | 98/100 |

- **Strength — technical accessibility is excellent.** Fully static/SSR HTML confirmed via raw curl (no JS dependency), `robots.txt` has zero crawler-specific blocks (GPTBot/ClaudeBot/PerplexityBot all confirmed 200 via UA-spoofed live test), `/llms.txt` and `/llm.txt` both present and well-built (company facts, page directory, per-service summaries, named owner).
- **Weakness — Citability.** Every FAQ answer checked across the entire site (40+ sampled) falls under 50 words; the AI-citation sweet spot is 134-167 words. The one standout page, `/blog/umzugskosten-mannheim/`, still tops out under 50 words per answer despite being the strongest page overall (1,611 words, full Article schema, question-format headers). Recommendation: expand FAQ answers site-wide to 120-170 words using that blog post's structure as the template, prioritizing "was kostet ein Umzug" variants first.
- **Weakness — Authority & Brand Signals is the lowest-scoring GEO dimension.** A live Bing search for the exact domain and for `"Herkules Umzüge" Mannheim` returned **zero third-party citations** — no directory listings, no Wikipedia/Reddit/YouTube/LinkedIn presence. Org-level schema `areaServed` also omits Heidelberg/Ludwigshafen/Schwetzingen/Viernheim even though dedicated pages exist for all four (page-level `Service.areaServed` is correctly scoped; only the top-level Organization node is incomplete). Named owner (Döndü Akbaba) appears in Impressum and llms.txt but not on the About page itself, where an AI system is most likely to look for "who runs this."
- **Weakness — Multi-Modal Content.** No `VideoObject` schema despite a hero video asset existing, no HTML `<table>` for the Stundenpreise rate card (currently prose — a missed extraction target for AI price-comparison answers), no infographics/checklists found.
- **Structural note:** FAQ H3s are correctly phrased as real questions; non-FAQ H2s are marketing-style ("Kosten realistisch einschätzen") rather than query-matched ("Was kostet ein Umzug in Heidelberg?") — cheap rewrite, reinforces the exact target query pattern.
- Blog content is not contextually cross-linked from the city pages it's topically related to (e.g., the strong Umzugskosten article isn't linked from the Heidelberg/Frankfurt pages) — a missed internal topical-authority signal.

## 5. Local SEO (weight: 10%) — Raw score: 60/100

| Dimension | Weight | Score |
|---|---|---|
| GBP Signals | 25% | 55 |
| Reviews & Reputation | 20% | 50 |
| Local On-Page SEO | 20% | 78 |
| NAP Consistency & Citations | 15% | 70 |
| Local Schema Markup | 10% | 55 |
| Local Link & Authority Signals | 10% | 45 |

- **Critical — GBP signals are the largest score suppressor.** Live production site has **zero Maps embed** and a self-referencing-only `sameAs` (no GBP URL at all live). A better version exists in the local/uncommitted build (real CID + Yelp link) but hasn't shipped.
- **High:** The 48-vs-100 `ratingCount` conflict, plus the 4.8★/48 claimed vs. 3.0★/8 actually shown on 11880.com — needs reconciliation against the real GBP dashboard before more schema changes go out.
- **NAP consistency is otherwise genuinely good:** footer, Impressum, JSON-LD, Gelbe Seiten, and 11880.com all agree on name/address; only cosmetic phone-format variance (spacing/dashes) exists, which is low severity since the underlying `tel:` links and schema values are consistent.
- **Medium:** Absent from Das Örtliche's Mannheim moving-company category (39 competitors listed, Herkules isn't one of them).
- **Medium:** Every location page reuses the exact same Mannheim HQ lat/long in `geo`, including for Heidelberg, Ludwigshafen, Schwetzingen, and Viernheim — none reflect that town's actual geography, which risks misrepresenting service radius to Google.
- **Medium:** `umzugsfirma-schwetzingen.html` and `umzugsfirma-viernheim.html` show 71.8% textual overlap — real doorway-page risk if the city-page count grows further; the Neckarstadt/Quadrate pages show how to do city-specific differentiation well and should be the template.
- **Low:** Zero LocalBusiness/organization schema on blog posts despite two being hyper-local topics; Impressum is complete and TMG §5-compliant (missing only an optional §18 MStV "verantwortlich für den Inhalt" line, low risk).
- **Confirmed fixed:** the previously-flagged broken city pages are resolved for 8 of 9 pages; only `umzug-mannheim.html` itself remains undeployed (tracked as the #1 critical issue above).

## 6. Search Experience (SXO) (weight: 5%) — Raw score: 51/100

Gap-scored across Homepage (74/100), Heidelberg (50/100), Mannheim-Quadrate (50/100), and Leistungen hub (49/100) — the homepage's conversion infrastructure has not been propagated to the city/service pages that actually carry the site's named commercial queries.

- **Critical:** **No phone number or click-to-call anywhere in the site header** — zero `tel:` links in the nav on any page; all 4 sitewide `tel:` links are buried mid-page/footer. For a business explicitly advertising "kurzfristige Termine möglich," this is a direct conversion leak, especially on mobile.
- **Critical:** URL/keyword mismatch — the page targeting "Umzugsfirma Heidelberg" now lives at `/umzug-heidelberg/` (the word "firma" was dropped at some point); worth confirming this was intentional and that no backlink equity is stranded on the old slug.
- **High:** No sticky/fixed mobile CTA bar anywhere on the site — the only `position: fixed` element sitewide is the cookie-consent banner.
- **High:** Heidelberg and Quadrate pages have H2s that explicitly promise cost information ("Kosten realistisch einschätzen") and then deliver **zero numbers** in the body text — a heading/content mismatch that will actively frustrate price-comparison visitors, directly undercutting the site's own "Festpreis" positioning.
- **High:** City pages are visually thin — 5 images each vs. 35 on the homepage, no trust strip (rating/years-in-business badges) above the fold, ~450-475 words vs. a competitor benchmark of 2,500+.
- **Medium:** `/leistungen/` hub has zero forms/CTAs — a pure directory dead-end for anyone landing there with commercial intent.
- **Medium:** Internal link equity to the Heidelberg page is thin (only 2 sitewide links) despite it targeting a named priority query.
- **Reputational flag (Medium):** live web search surfaced a parked/legacy `umzuege-herkules.de` (non-www) variant serving unrelated spam content under the brand's domain name — worth checking DNS/hosting ownership and requesting de-indexing if it's a separate, abandoned install.
- **Persona scoring (weakest first):** Price-conscious mover 49/100, Office relocation 51/100 (directional), Senior/family 55/100 (directional), Urgent/last-minute mover 56/100, Halteverbotszone self-service searcher 63/100 (strongest content, held back by a transactional-dominated SERP rather than content quality).
- **Strength:** schema implementation (14-15/15 across pages) and correct page-type/format matching against SERP winners are both genuine strengths — the gap is content depth and conversion UX, not structure.

## 7. Sitemap (weight: 10%) — Raw score: 87/100

- **Confirmed resolved:** the previously-flagged city-page-404 issue is fully fixed for sitemap purposes — all 23 sitemap URLs return clean 200s, zero 404s, zero redirect loops, no chains beyond a single clean 308 hop on legacy slugs.
- **High:** `/umzug-mannheim/` correctly excluded from the sitemap for now (since it's not live) — but will need adding the moment it's deployed (see Executive Summary #1).
- **Medium:** `impressum` and `datenschutz` are live (200) but absent from the sitemap — likely intentional (legal pages, `noindex` per the Content audit) but undocumented; confirm and either add deliberately or note the exclusion is intentional.
- **Low:** `lastmod` values are stale/inaccurate for ~19 of 23 URLs (some off by weeks) versus the actual last-edit date — low ranking impact since Google mostly ignores lastmod, but undermines it as a genuine freshness signal.
- **Info:** XML is valid, well under URL-count limits, no priority/changefreq clutter, 8 location pages pose no doorway-page risk at current count.

## 8. Backlinks (weight: 10%) — NOT AUDITED THIS PASS

Score carried over unchanged from the 2026-07-08 audit: **11/100**. This was previously the lowest-scoring category and the client asked to skip re-running it this pass. Recommend re-running the backlinks specialist on the next full audit, particularly once the Local SEO directory-citation gaps above (Das Örtliche, GBP) are addressed, since those double as backlink-building opportunities.
