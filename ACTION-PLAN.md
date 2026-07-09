# Action Plan — umzuege-herkules.de
**Generated:** 2026-07-09
**Overall SEO Health:** 64/100 (previous: 59/100)
**Compiled from:** 7 specialist agents this pass (Technical, Content/E-E-A-T, Schema, GEO/AI, Local SEO, SXO, Sitemap). Backlinks skipped at client request — see `FULL-AUDIT-REPORT.md` §8.

---

## 🔴 CRITICAL — Fix Immediately

1. **Deploy `/umzug-mannheim/`** — Add `umzug-mannheim.html` to the `routes` array in `scripts/prerender.js` (follow the exact pattern used for `umzug-frankfurt`, `umzug-lindenhof`, etc.), rebuild, redeploy, then add the URL to `sitemap.xml`. Delete the stray empty `umzug-mannheim/` directory at repo root while you're in there.
   *Impact: unlocks the site's single highest-value keyword page ("Umzugsunternehmen Mannheim"), currently a dead 404.*

2. **Fix broken JSON-LD in `umzug-mannheim-quadrate.html`** — Escape or rephrase the raw `"` in the FAQ answer `„B6, 12"?` (use `\"`, a real typographic close-quote, or reword to avoid the inch-mark entirely) before this file is next deployed.
   *Impact: prevents total schema-block failure (MovingCompany + Service + FAQPage + BreadcrumbList all currently at risk) on this page.*

3. **Fix `umzug-neckarstadt.html` metadata** — Correct the canonical tag to self-reference (`https://www.umzuege-herkules.de/umzug-neckarstadt/`, not `/umzug-mannheim/`), fix `og:title`/`twitter:title` to Neckarstadt-specific copy, and fix the visible FAQ `<h2>` that still reads "...in Mannheim" instead of "...in der Neckarstadt."
   *Impact: stops Google from treating this page as a duplicate of the Mannheim page / misattributing its content.*

4. **Get the security headers live** — Confirm the deployed build actually matches current `vercel.json` (lines 249-270); trigger a fresh production deploy and re-verify with `curl -I` that `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` are present. Add a CSP header if none exists.
   *Impact: closes a live clickjacking/MIME-sniffing exposure that the config was already written to prevent.*

5. **Reconcile review/rating numbers sitewide** — Pick one true, current Google review count and rating; use it consistently in every page's JSON-LD `ratingCount`/`ratingValue` (currently "48" vs "100") AND in visible copy (currently "48," "100+," and "400+" all appear as different claims). Cross-check against the actual GBP dashboard and against the 3.0★/8-review figure showing on 11880.com — investigate whether that's a different/unclaimed listing.
   *Impact: removes a fabricated-data-appearing inconsistency that undermines trust signals across Content, Schema, and Local SEO simultaneously.*

6. **Add click-to-call to the site header** — Put a visible, tappable phone number (`tel:` link) in the persistent nav, not just buried in the footer/contact section.
   *Impact: SXO audit's single highest-leverage fix — closes the biggest conversion leak for the "urgent mover" persona, especially on mobile.*

---

## 🟠 HIGH — Fix Within 1 Week

7. **Replace self-referential `sameAs` on 10+ pages** (`auslandsumzuege`, `bueroumzuege`, `datenschutz`, `impressum`, `leistungen`, `privatumzuege`, `seniorenumzuege`, `stundenpreise`, `ueber-uns`, `umzug-frankfurt`, `umzug-neckarstadt`) with the correct pattern already used on `index.html`/`umzugsfirma-heidelberg.html`/`umzug-mannheim.html`: real Google Maps CID + Yelp URL. Fix the Yelp URL itself first — it currently 404s.

8. **Add the GBP Maps embed and correct `sameAs` to the live homepage** — a better version already exists in the local/uncommitted build; ship it.

9. **Remove deprecated `HowTo` schema** from `aussenaufzug.html` and `halteverbotszone.html` (Google dropped HowTo rich results Sept 2023 — pure dead weight now). Keep the visible step-by-step HTML content as-is.

10. **Fix the impoverished duplicate Organization node** on `aussenaufzug.html`, `halteverbotszone.html`, `umzugskartons.html` — either give it the full property set (logo, geo, hours, rating, sameAs) or better, replace it with a `provider: {"@id": ".../#organization"}` reference inside each page's `Service` node, matching the pattern already used correctly on the other service pages.

11. **Add `BreadcrumbList` to `umzug-neckarstadt.html`** (every sibling city page has one; this is the only one missing it).

12. **Add a sticky/fixed mobile CTA bar** (call + "Angebot erhalten") — currently the only fixed-position element on the entire site is the cookie-consent banner.

13. **Fix the redirect chain** — consolidate `http://umzuege-herkules.de/` → `https://www.umzuege-herkules.de/` into a single 301/308 hop instead of the current 308→307→landing chain.

14. **Add real numbers to Heidelberg/Quadrate "Kosten realistisch einschätzen" sections** — the heading promises pricing info and the body currently delivers none, directly undercutting the site's own "Festpreis" positioning. Reuse the price ranges already shown correctly on the homepage.

15. **Investigate the parked/legacy `umzuege-herkules.de` (non-www) domain** surfaced in live search, serving unrelated spam content under the brand name — confirm ownership, force a proper redirect to `https://www.`, or request removal via Search Console if it's an abandoned separate install.

---

## 🟡 MEDIUM — Fix Within 1 Month

16. **Standardize `logo` schema property** to the `ImageObject` form (with width/height) on the 7 pages still using a bare string.

17. **Fix broken blog table-of-contents links** — all 3 posts have sidebar TOC links pointing to `#article-top` instead of real section anchors; add `id`s to each `<h2>` and point the links at them.

18. **Bring Schwetzingen and Viernheim location pages up to the same section depth** as their 7 sibling city pages (add the "typische Umzüge" and standalone "Leistungen" sections currently missing) — also reduces the 71.8% textual-overlap doorway-page risk flagged between these two specifically.

19. **Give city pages a trust strip and more imagery above the fold** — port the homepage's rating badge/years-in-business/Festpreis strip onto Heidelberg, Quadrate, and other city pages (currently only 5 images each vs. 35 on the homepage).

20. **Add a CTA/mini-form to `/leistungen/`** — currently a pure directory dead-end with zero forms or CTA-styled elements.

21. **Strengthen internal links to `/umzug-heidelberg/`** from thematically related pages (Quadrate, the Halteverbotszone blog post) — currently only 2 sitewide links point to a page targeting a named priority query.

22. **Get listed on Das Örtliche** (confirmed absent from the Mannheim moving-company category; 39 competitors are listed there).

23. **Add per-city `geo` coordinates** (or at minimum locality-specific `areaServed` precision) instead of reusing the single Mannheim HQ lat/long on every location page, including Heidelberg/Ludwigshafen/Schwetzingen/Viernheim.

24. **Backfill missing `geo`/`openingHoursSpecification`/`aggregateRating`** on the ~12 pages that lack them (aussenaufzug, auslandsumzuege, bueroumzuege, datenschutz, halteverbotszone, impressum, leistungen, privatumzuege, seniorenumzuege, stundenpreise, ueber-uns, umzug-frankfurt, umzugskartons).

25. **Expand FAQ answers site-wide to 120-170 words** (currently 10-47 words everywhere, including the site's best page) — use `/blog/umzugskosten-mannheim/`'s structure as the template. Start with "was kostet ein Umzug" variants on the homepage, stundenpreise, and each city page.

26. **Add Heidelberg/Ludwigshafen/Schwetzingen/Viernheim to the org-level schema `areaServed`** (page-level `Service.areaServed` is already correct; only the top-level Organization node is missing these four cities).

27. **Name the owner and any industry-association membership directly on `/ueber-uns/`** visible copy, not just in the Impressum/llms.txt — this is the page most likely to be cited by an AI system answering "who runs this company."

28. **Convert the Stundenpreise rate card into a real HTML `<table>`** instead of prose — a much stronger extraction target for AI price-comparison answers.

29. **Fix the malformed `<title>` tag** on `blog/halteverbotszone-beantragen-mannheim/index.html` (stray duplicate closing tag leaking visible `</title>` text).

30. **Rewrite templated H2s to question-format** across city pages ("Kosten realistisch einschätzen" → "Was kostet ein Umzug in [Stadt]?") to match direct-query phrasing for GEO/AI Overview eligibility.

31. **Cross-link the `umzugskosten-mannheim` blog post from relevant city/service pages** (Heidelberg, Frankfurt, stundenpreise) — currently only reachable via the generic `/blog/` nav link, missing an easy topical-authority signal.

32. **Clean up dead JS** referencing the non-existent `.hero-video--mobile` element/assets in the homepage inline script.

---

## 🟢 LOW — Backlog

33. Add `IndexNow` protocol support (single key file + ping on deploy) — cheap win given `sitemap.xml` is already regenerated on every build.
34. Fix HSTS header to include `includeSubDomains` and `preload`.
35. Bump the mobile nav toggle from 42×42px to the 44×44px touch-target guideline.
36. Add `<link rel="preload">` for the hero image; verify `hero-video.webm` (4.57MB) isn't on the LCP critical path.
37. Serve a mobile-specific (smaller) hero image instead of reusing the 111KB desktop asset for both breakpoints.
38. Add `id="verantwortlich für den Inhalt"`-style §18 MStV line to Impressum, covering the blog's editorial content (low legal risk, cheap to add).
39. Add a short intro paragraph to `leistungen.html` (currently ~205 words, thin for a hub page).
40. Convert 3-5 existing named testimonials into individual schema `Review` objects to strengthen `AggregateRating` credibility.
41. Link `/blog/` posts' `Blog` schema `publisher` to the main Organization `@id` instead of declaring an inline duplicate.
42. Add `VideoObject` schema for the hero video asset, if it's meant to remain part of the page.
43. Remove the 2.5GB unrelated `.mov` file sitting in the repo root (housekeeping, not shipped to production, but bloats the repo).
44. Standardize visible phone-number formatting across pages (currently mixes `0621 - 899 59 69` / `0621 8995969` / `0621-899 59 69` — cosmetic only, underlying `tel:`/schema values are already consistent).
45. Add a B2B-specific proof point (client logos, case study, or an uptime/no-downtime guarantee) and a dedicated commercial-inquiry CTA to `bueroumzuege.html` for the office-relocation persona.

---

## Deferred

- **Backlinks audit** — not run this pass at client request. Last measured 2026-07-08 at 11/100 (lowest category site-wide). Recommend prioritizing for the next full audit, especially once directory citations (#22, #8) are underway, since those build backlinks as a side effect.
