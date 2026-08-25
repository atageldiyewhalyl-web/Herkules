# Why /umzug-heidelberg/ Is Not Ranking — Diagnosis
Date: 2026-08-25 · Page: umzugsfirma-heidelberg.html → /umzug-heidelberg/

## 1. What is NOT the problem (all checked, all clean)
| Check | Result |
|---|---|
| Live and serving real content | ✅ confirmed by live fetch |
| `robots` meta | ✅ `index, follow, max-image-preview:large` |
| Canonical | ✅ self-referencing `/umzug-heidelberg/` |
| Prerender route present | ✅ in `scripts/prerender.js`, `dist/umzug-heidelberg/` exists |
| In sitemap.xml | ✅ |
| Internal inbound links | ✅ 20 source files link to it — well linked, not orphaned |
| Title / OG / description | ✅ present, keyword-bearing, correct length |
| Pricing figures | ✅ 350–550 / 600–1.000 / 1.000–1.800 / 1.500–2.500 € live on page — **ACTION-PLAN item 14 is already fixed** |

There is no technical blocker. Do not spend more time on tech SEO here.

## 2. What IS the problem: the page is a template with a Heidelberg skin

### 2a. Content overlap with its own sibling city pages
6-gram shingle comparison against the other eight city pages:

| Sibling page | Overlap |
|---|---|
| umzugsfirma-ludwigshafen.html | **55.6 %** |
| umzug-mannheim.html | 54.2 % |
| umzug-neckarstadt.html | 51.5 % |
| umzug-mannheim-quadrate.html | 44.9 % |
| umzug-frankfurt.html | 43.9 % |
| umzugsfirma-viernheim.html | 30.0 % |
| umzugsfirma-schwetzingen.html | 29.8 % |
| umzug-lindenhof.html | 21.8 % |

**Only 42.4 % of the page's 6-grams appear on no other city page.**
`ACTION-PLAN.md` item 18 flagged a 71.8 % pair overlap between Schwetzingen and
Viernheim. Heidelberg's problem is different and arguably worse: not one bad twin,
but ~50 % overlap spread across **five** siblings. To a search engine this reads as
one template deployed nine times, not nine local pages.

### 2b. How little of the page is actually about Heidelberg
| Measure | Value |
|---|---|
| Total words | 2.427 |
| Reviews-marquee block | 694 words (**29 % of the page**) |
| Non-review words | 1.733 |
| Sentences (>4 words) on page | 164 |
| Sentences naming Heidelberg or a Heidelberg place | 52 (**32 %**) |

Realistically that leaves roughly **600–700 words of genuinely Heidelberg-specific
text** carrying a city head term against entrenched local incumbents.

Note on the reviews block: the testimonials appear twice in the DOM
(`<div class="reviews-track">` plus an `aria-hidden="true"` clone). That is the
standard infinite-marquee pattern, **not a bug** — accessibility is handled correctly.
But it does mean ~29 % of the page is review text that is byte-identical on every
city page, and half of it is a visual duplicate.

### 2c. The districts are named, not covered
Mentions in body text: Altstadt 15, Weststadt 6, Neuenheim 4, Handschuhsheim 4,
Bergheim 3, Kirchheim 3, Ziegelhausen 3, Rohrbach 3, Wieblingen 2, Boxberg 1.
These are list items, not content. Compare with what a Heidelberg mover would
actually need to say: Altstadt Zufahrtsgenehmigung and Kopfsteinpflaster,
Neuenheim/Handschuhsheim villa quarter, Bergheim density, Boxberg/Emmertsgrund
hillside access, Neckar bridges as the through-route.

### 2d. The single biggest missed signal
**"Universität" appears 0 times on the page. "Studenten" appears 5 times.**

Heidelberg is Germany's oldest university city. Student and academic moves are a
defining share of that market, and the site *already has* a
`blog/studentenumzug-heidelberg` post — but the city page never connects to the
topic. That is a free, on-brand relevance gain being left on the table.

## 3. External reality check (SERP, 2026-08-25)
Ranking for "umzugsunternehmen heidelberg": **Abendland Umzüge** (family firm,
~150 years in Heidelberg), **Dollenbacher** (50+ years — and already the #2
competitor on "umzugsunternehmen mannheim"), **John und Martin** (the #1 on the
Mannheim SERP), plus Nordwind, DELTA, Huber, and the umzugsfirmen-check directory.

These are Heidelberg-**based** firms with decades of local entity signals.

## 4. The structural ceiling

**Correction to an earlier draft:** that draft asserted the site carries no Frankfurt
phone number. That was wrong (a failed shell command misread as a zero result) — see
the corrected §2 of `2026-08-25-frankfurt-cluster-strategy.md`. The Frankfurt number
`069 - 66 554 358` is on many pages.

For **Heidelberg**, though, the point does hold, and it is stronger:

| Signal | Mannheim | Frankfurt | **Heidelberg** |
|---|---|---|---|
| Local phone number on site | ✅ 0621-899 59 69 | ✅ 069 - 66 554 358 | ❌ **none** |
| Street address | ✅ Relaisstraße 192 | ❌ none | ❌ **none** |
| Named in footer positioning | ✅ | ✅ | ❌ **no** |

Heidelberg has the weakest local-entity footprint of the three cities the site
actively targets — no local number, no address, and it is absent from the footer
positioning line ("Professionelle Umzüge für Privat und Gewerbe in Mannheim,
Frankfurt und Umgebung"). Herkules is ~20 km away in Mannheim.

→ The Heidelberg **map pack is not winnable** without a Heidelberg address and GBP.
Proximity decides it; content cannot. Organic below the pack is winnable — but not
with a page that is 58 % shared with its own siblings.

→ Cheap partial win available now: add Heidelberg to the footer positioning line, and
consider a Heidelberg dial-in number, mirroring what already exists for Frankfurt.

## 5. What to do, in priority order
1. **Rewrite the Heidelberg body for genuine local depth.** Target 4+ verifiable,
   non-templatable facts — the same `unique_local_facts` rule applied to the 22
   new packages. Altstadt access permits, the Neuenheim/Handschuhsheim villa stock,
   Boxberg/Emmertsgrund hillside access, Neckar bridge routing.
2. **Add the university/student dimension** and link it to the existing
   `blog/studentenumzug-heidelberg` post in both directions.
3. **Cut the shared boilerplate share.** Either shorten the reviews marquee on city
   pages or grow the unique body so 694 words of identical testimonials stop being
   29 % of the page. Growing the body is the better fix.
4. **Differentiate from Ludwigshafen specifically** — at 55.6 % these two are the
   nearest thing to a duplicate pair on the site after Schwetzingen/Viernheim.
5. **Decide on a Heidelberg GBP.** Business decision, not an SEO one — but it is
   the difference between competing for organic only and competing for the pack.

## 6. Read-across to the rest of the site
Heidelberg is not a special case. It is the template problem showing up on the
page where competition is stiffest. Ludwigshafen, Neckarstadt and Quadrate sit in
the same 45–55 % overlap band and will underperform for the same reason.

This is exactly the failure mode the 2026-08-25 content packages are built to
avoid — which is why every city package in that batch carries a mandatory
`unique_local_facts` block and an instruction not to copy it between pages.
