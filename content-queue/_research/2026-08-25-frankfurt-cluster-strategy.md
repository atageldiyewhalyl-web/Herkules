# Frankfurt Cluster Strategy — Herkules Umzüge
Date: 2026-08-25
Target: rank for "umzug frankfurt" / "umzugsunternehmen frankfurt" + build corridor relevance

## 1. Where the site stands on Frankfurt today
- `umzug-frankfurt.html` exists and is prerendered (`route: umzug-frankfurt`). **2,105 words.**
- Schema is genuinely good: MovingCompany + Service + FAQPage (13 Q) + BreadcrumbList,
  `areaServed` already includes Frankfurt am Main + Rhein-Main-Gebiet.
- Existing Frankfurt support: exactly **one** blog post (`blog/umzug-mannheim-frankfurt`).
- Frankfurt Stadtteile are named in the FAQ schema (Sachsenhausen, Bockenheim, Bornheim,
  Nordend, Westend, Gallus, Innenstadt, Ostend) but **no page exists for any of them**.

## 2. The real Frankfurt-presence position (CORRECTED 2026-08-25)

> **Correction.** An earlier version of this file claimed the Frankfurt number
> `069 66554358` appeared in no HTML file. **That was wrong** — it was produced by a
> shell command that failed to run, whose error was misread as a zero result.

Verified state:

| Signal | Present? | Where |
|---|---|---|
| Frankfurt phone `069 - 66 554 358` | ✅ **yes** | `index.html`, `umzug-frankfurt.html`, `impressum.html`, `leistungen.html`, `bueroumzuege.html`, `privatumzuege.html`, `seniorenumzuege.html`, `auslandsumzuege.html`, `aussenaufzug.html`, `umzugskartons.html`, `ueber-uns.html`, `umzug-lindenhof.html`, `stundenpreise.html` |
| Frankfurt street address | ❌ **no** | Impressum lists one address only: Relaisstraße 192, 68219 Mannheim |
| `areaServed` includes Frankfurt | ✅ yes | schema on `umzug-frankfurt.html` |
| Footer positioning names Frankfurt | ✅ yes | "Professionelle Umzüge … in Mannheim, Frankfurt und Umgebung." |

**What this means.** Herkules already presents a real Frankfurt-facing identity — a
local dial-in number, Frankfurt in the footer positioning, Frankfurt in `areaServed`.
That is more than a Mannheim firm merely claiming a service radius.

What is still missing is the one thing a Google Business Profile requires: **a
verifiable Frankfurt address.** A phone number alone cannot be verified into a GBP
listing, and the local pack ranks on proximity to a verified location.

→ Therefore: **the Frankfurt map pack remains out of reach**, and Frankfurt-based
competitors (Möbeltransport24 in Gallus, UltraGS, Sorglosumzüge,
frankfurterumzugsunternehmen.de) hold those slots regardless of content quality.

→ **Winnable:** the organic blue links beneath the pack, plus long-tail where
proximity weighs less — Stadtteil queries, cost queries, process queries, route
queries. That is what this cluster targets, and the existing Frankfurt phone makes
those pages more credible than a pure service-radius claim would.

→ Recommendation to client unchanged in substance: if Frankfurt is a real revenue
target, a Frankfurt address + GBP is the step that unlocks the pack. The cluster
works without it.

## 3. The doorway-page constraint (from our own audit)
`ACTION-PLAN.md` item 18 already flags **71.8% textual overlap between Schwetzingen and
Viernheim** — an existing doorway-page risk. Adding five more templated city pages would
multiply that risk, not the traffic.

**Hard rule for every package in this cluster:** each page must carry a minimum of
**four locally-specific, verifiable facts** that cannot be find-and-replaced —
named streets/quarters, the actual competent authority, local access constraints,
real route/topography detail. Boilerplate service blocks stay, but they must be the
minority of the page. Packages below each name their four facts explicitly.

## 4. Cluster architecture (hub and spoke)

```
                    umzug-frankfurt.html  (HUB — needs expansion, see #11)
                              |
        +---------------------+---------------------+
        |                     |                     |
   STADTTEIL SPOKES      PROCESS SPOKES        ROUTE SPOKES
   3 new city pages      2 new blog posts      3 new blog posts
        |                     |                     |
   Sachsenhausen         Umzugskosten FFM      Heidelberg -> FFM
   Westend/Bockenheim    Halteverbot FFM       Weinheim/Bergstr -> FFM
   Nordend/Bornheim                            Darmstadt -> FFM
                              |
                    CORRIDOR CITY PAGES (feed the routes)
                    Weinheim · Bensheim/Heppenheim · Darmstadt
```

Why this shape: the head term "umzug frankfurt" is won by **topical depth on Frankfurt**,
not by one page repeating the phrase. Each Stadtteil page earns its own long-tail
("umzug sachsenhausen", "umzugsfirma bockenheim") while passing internal relevance up to
the hub. The corridor cities are the honest version of the Frankfurt claim: Herkules is a
Mannheim firm that serves the A5/A67 corridor, and Weinheim → Bensheim → Darmstadt →
Frankfurt is that corridor, geographically true and commercially real.

## 5. The ten packages

| # | Slug | Type | Primary keyword | Tier |
|---|---|---|---|---|
| 1 | `umzugskosten-frankfurt` | blog | umzugskosten frankfurt | FFM core |
| 2 | `halteverbotszone-frankfurt-beantragen` | blog | halteverbotszone frankfurt | FFM core |
| 3 | `umzug-frankfurt-sachsenhausen` | city page | umzug sachsenhausen | FFM Stadtteil |
| 4 | `umzug-frankfurt-westend-bockenheim` | city page | umzugsfirma bockenheim / büroumzug westend | FFM Stadtteil |
| 5 | `umzug-frankfurt-nordend-bornheim` | city page | umzug bornheim frankfurt | FFM Stadtteil |
| 6 | `umzugsfirma-weinheim` | city page | umzugsunternehmen weinheim | Corridor |
| 7 | `umzugsfirma-bergstrasse-bensheim-heppenheim` | city page | umzugsunternehmen bensheim | Corridor |
| 8 | `umzugsfirma-darmstadt` | city page | umzugsunternehmen darmstadt | Corridor |
| 9 | `umzug-heidelberg-frankfurt` | blog | umzug heidelberg frankfurt | Route |
| 10 | `umzug-weinheim-frankfurt-pendler` | blog | umzug weinheim frankfurt | Route |

Plus **#11 (not a package, a task):** expand `umzug-frankfurt.html` from 2,105 words with
a Stadtteil-Übersicht section linking to packages 3–5, and a "Kosten" section linking to
package 1. The hub must link down to the spokes or the cluster does not compound.

## 6. Competitive notes gathered 2026-08-25
- **Halteverbotszone Frankfurt** is the strongest single opening. `frankfurt.de` ranks,
  and the differentiating fact is real: **the City of Frankfurt does not lend out
  Halteverbot signs** (unlike Mannheim) — applicants must source them. Admin fee ~30–50 €,
  total typically 100–150 €, application ~2 weeks ahead, signs up 3 full calendar days
  before. Herkules already ranks this pattern for Mannheim, so the template is proven.
- **Weinheim** is already claimed by **Starke Arme** (starkearme.de/umzugsfirma/weinheim/)
  — the same competitor sitting at #3 for "umzugsunternehmen mannheim". Confirms the
  corridor is commercially real and that Herkules is ceding it by default.
- Frankfurt SERP is heavy with Festpreis-led national/portal players
  (moebeltransport24, moveyourhome, umzugsportal, guenstig-umzugsunternehmen) → the
  differentiator is genuine local specificity, which portals structurally cannot produce.

## 7. Facts to verify with the client before publishing
- Does Herkules have (or want) a Frankfurt address/GBP? Changes packages 1–5 materially.
- Frankfurt phone `069 66554358` — real line or stale note? If real, put it on every
  Frankfurt page. If not, remove it from `visibility-map.md`.
- Review count/rating: `ACTION-PLAN.md` item 5 flags "48" vs "100" vs "400+" conflict
  sitewide. All ten packages leave rating figures as `[RATING]`/`[COUNT]` placeholders
  rather than propagating the inconsistency into ten new pages.
- Confirm Halteverbotszone service is actually offered in Frankfurt (not just Mannheim)
  before package 2 promises it.
