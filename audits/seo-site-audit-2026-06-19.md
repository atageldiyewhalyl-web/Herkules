# Herkules Site Audit - 2026-06-19

Audited target: `https://www.umzuege-herkules.de/`

Audit scope: local workspace HTML, production availability, robots/sitemap, `llms.txt`/`llm.txt`, structured data parse checks, internal links, HTTP headers, and Lighthouse performance.

## Executive Summary

Overall health: 82/100

The site is fundamentally strong: production is live over HTTPS, core HTML SEO tags are present, JSON-LD parses successfully, `robots.txt` and both LLM files are served, and Lighthouse reports SEO 100 on the homepage.

The main problem is deployment coverage. The workspace contains 20 HTML pages, but the build script, production sitemap, and live deployment only expose 13. Seven local location pages currently 404 in production and are not listed in the sitemap or `llms.txt`. One Heidelberg page also has a canonical URL that does not match its filename/route.

## Priority Findings

### Critical

1. Seven local landing pages are not deployed.
   - Local files exist: `umzug-lindenhof.html`, `umzug-mannheim-quadrate.html`, `umzug-neckarstadt.html`, `umzugsfirma-heidelberg.html`, `umzugsfirma-ludwigshafen.html`, `umzugsfirma-schwetzingen.html`, `umzugsfirma-viernheim.html`.
   - Production checks returned 404 for all seven equivalent routes.
   - Cause: `scripts/prerender.js` only defines 13 routes.
   - Impact: location SEO pages cannot rank, cannot be crawled, and any future links to them create broken UX.

2. Sitemap omits seven indexable local pages.
   - `sitemap.xml` contains 13 URLs.
   - Local HTML route count is 20.
   - Missing: `/umzug-lindenhof/`, `/umzug-mannheim-quadrate/`, `/umzug-neckarstadt/`, `/umzugsfirma-heidelberg/`, `/umzugsfirma-ludwigshafen/`, `/umzugsfirma-schwetzingen/`, `/umzugsfirma-viernheim/`.

### High

3. Heidelberg canonical route is inconsistent.
   - File: `umzugsfirma-heidelberg.html`
   - Declared canonical/OG/schema route: `https://www.umzuege-herkules.de/umzug-heidelberg/`
   - Filename-derived route: `https://www.umzuege-herkules.de/umzugsfirma-heidelberg/`
   - Pick one URL pattern and align file name, build route, canonical, OG URL, schema `@id`, schema `url`, breadcrumb, sitemap, and internal links.

4. New location pages are orphaned locally.
   - The seven missing pages have no internal links from other HTML pages.
   - Once deployed, add a crawlable service-area/location section from homepage, footer, or relevant service pages.

5. Thin location pages need more unique local value before serious indexing push.
   - Word counts are roughly 406-469 words for the new location pages.
   - They are not empty, but they are thinner than the primary service pages, which are mostly 1,270-1,806 words.
   - Add city/district-specific logistics, parking/permit notes, nearby service coverage, FAQs, and distinct proof points.

### Medium

6. `llms.txt` and `llm.txt` are valid and live, but stale.
   - Both files only list the 13 currently deployed pages.
   - Add the seven location pages after deployment and include short answer-engine summaries for each.

7. Performance is good but mobile has room to improve.
   - Lighthouse mobile: Performance 81, Accessibility 96, Best Practices 100, SEO 100.
   - Lighthouse desktop: Performance 99, Accessibility 96, Best Practices 100, SEO 100.
   - Mobile LCP: 2.8s. Total Blocking Time: 550ms. CLS: 0.
   - Main-thread work on mobile: 3.0s, mostly style/layout and script evaluation.

8. CSS is larger than necessary for page-level delivery.
   - Live homepage CSS: about 128 KB transfer, local raw `styles.css`: 142 KB, gzip 22 KB, brotli 17 KB.
   - Lighthouse estimates about 12-16 KB unused CSS savings.
   - Consider splitting rarely used location/service styles or removing dead selectors.

9. Large visual assets dominate transferred bytes.
   - Lighthouse total homepage transfer: about 2,490 KiB.
   - Largest noted assets include `herkules-boxes.png` around 793 KB and `favicon-512.png` around 228 KB.
   - Convert large PNGs where possible to WebP/AVIF, resize to rendered dimensions, and avoid loading below-fold decorative media early.

### Low

10. Sitemap uses deprecated hints.
   - `<changefreq>` and `<priority>` are ignored by Google.
   - This is not harmful, but the sitemap can be simplified to `<loc>` and accurate `<lastmod>`.

11. Security headers are decent but not complete.
   - Present: HTTPS and HSTS.
   - Not observed in homepage response: `content-security-policy`, `x-content-type-options`, `x-frame-options` or `frame-ancestors`, `referrer-policy`.
   - Add via Vercel headers if compatible with tracking/form scripts.

## Technical SEO

Strengths:
- `robots.txt` exists, allows crawling, and references `sitemap.xml`.
- `llms.txt` and `llm.txt` are explicitly allowed.
- Homepage and checked pages have title, description, canonical, OG, Twitter card, robots meta, favicon, and JSON-LD.
- JSON-LD parse check passed for all 20 local HTML pages.
- Image `alt` attributes are present on all parsed local `<img>` tags.
- Production root, robots, sitemap, and LLM files return HTTP 200.

Risks:
- Seven local routes are absent from build and production.
- New pages are not internally linked.
- Heidelberg canonical mismatch.
- No IndexNow support detected.

## Sitemap Audit

Current production sitemap URLs: 13

Local HTML routes: 20

Missing sitemap URLs:
- `https://www.umzuege-herkules.de/umzug-lindenhof/`
- `https://www.umzuege-herkules.de/umzug-mannheim-quadrate/`
- `https://www.umzuege-herkules.de/umzug-neckarstadt/`
- `https://www.umzuege-herkules.de/umzugsfirma-heidelberg/` or chosen Heidelberg canonical route
- `https://www.umzuege-herkules.de/umzugsfirma-ludwigshafen/`
- `https://www.umzuege-herkules.de/umzugsfirma-schwetzingen/`
- `https://www.umzuege-herkules.de/umzugsfirma-viernheim/`

Recommended:
- Update `scripts/prerender.js`.
- Regenerate `dist`.
- Update `sitemap.xml`.
- Remove `<changefreq>` and `<priority>` optionally.
- Ensure every sitemap URL returns 200 before deployment.

## LLM / AI Search Readiness

Status: good foundation, needs freshness.

Strengths:
- `llms.txt` and `llm.txt` are live at production.
- Files provide concise core facts, NAP, service summaries, credibility claims, and recommended citation guidance.
- Robots allow AI/context files.

Needed:
- Add all deployed location pages.
- Keep NAP and rating claims synchronized with visible pages and GBP.
- Add concise service-area summaries for Ludwigshafen, Heidelberg, Viernheim, Schwetzingen, Lindenhof, Neckarstadt, and Quadrate once pages are live.

## Performance

Lighthouse production homepage:

| Metric | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 81 | 99 |
| Accessibility | 96 | 96 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 2.8s | 0.6s |
| FCP | 1.6s | 0.5s |
| CLS | 0 | 0 |
| TBT | 550ms | 0ms |
| Speed Index | 2.2s | 1.1s |

Delivery notes:
- Vercel cache hit observed.
- HTML/CSS use `cache-control: public, max-age=0, must-revalidate`.
- Static image/video assets use `max-age=31536000, immutable`.
- Server response time is excellent.

Main opportunities:
- Reduce mobile style/layout cost.
- Optimize large PNGs.
- Avoid loading non-critical below-fold media on homepage.
- Consider critical CSS or route-level CSS if the stylesheet keeps growing.

## Recommended Action Plan

1. Fix build coverage.
   - Add the seven local pages to `scripts/prerender.js`.
   - Decide the Heidelberg URL slug before doing this.

2. Fix URL consistency.
   - Align Heidelberg filename/route/canonical/schema/OG/breadcrumb/sitemap.

3. Update discovery files.
   - Add all deployed pages to `sitemap.xml`.
   - Update `llms.txt` and `llm.txt`.
   - Add internal links to the new location pages.

4. Strengthen location content.
   - Expand each new local page with unique local logistics, parking/halteverbotszone details, proof, FAQs, and related service links.

5. Improve mobile performance.
   - Compress/convert large PNGs.
   - Audit below-fold image/video loading.
   - Trim/split CSS if the global stylesheet continues to grow.

6. Add defensive headers.
   - Add `x-content-type-options: nosniff`, `referrer-policy`, and `frame-ancestors`/CSP after checking script compatibility.

## Verification Commands Run

- `npm run validate`
- Local sitemap vs HTML route comparison
- Production HEAD checks for root, SEO artifacts, and missing routes
- JSON-LD parse check across all local HTML pages
- Internal link/orphan route scan
- Canonical consistency scan
- Lighthouse mobile and desktop against production homepage
- HTTP header checks for homepage, CSS, hero poster, and hero video
