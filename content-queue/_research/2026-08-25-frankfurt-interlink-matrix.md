# Interlink Matrix — Frankfurt Cluster
Date: 2026-08-25. Applies to the 10 packages dated 2026-08-25 plus existing pages.

## Rule
Every link must be **bidirectional**. A spoke linking up to the hub without the hub
linking back down does not build a cluster — it builds an orphan. The implementer must
edit the existing pages listed in "INBOUND" below, not only create the new ones.

## Hub
`/umzug-frankfurt/` — receives from all 10, links out to packages 1–5 minimum.

## OUTBOUND (links each new page must contain)

| New page | Links to |
|---|---|
| 1 umzugskosten-frankfurt | /umzug-frankfurt/ · /stundenpreise/ · /blog/umzugskosten-mannheim/ · /blog/umzug-mannheim-frankfurt/ · pkg 2 · pkg 3 · /halteverbotszone/ |
| 2 halteverbotszone-frankfurt-beantragen | /umzug-frankfurt/ · /halteverbotszone/ · /blog/halteverbotszone-beantragen-mannheim/ · pkg 1 · pkg 3 · pkg 5 · /aussenaufzug/ |
| 3 umzug-frankfurt-sachsenhausen | /umzug-frankfurt/ · pkg 1 · pkg 2 · /privatumzuege/ · /aussenaufzug/ · /umzugskartons/ · pkg 4 · pkg 5 |
| 4 umzug-frankfurt-westend-bockenheim | /umzug-frankfurt/ · /bueroumzuege/ · pkg 1 · pkg 2 · pkg 3 · pkg 5 · /stundenpreise/ |
| 5 umzug-frankfurt-nordend-bornheim | /umzug-frankfurt/ · /aussenaufzug/ · pkg 1 · pkg 2 · pkg 3 · pkg 4 · /privatumzuege/ |
| 6 umzugsfirma-weinheim | /umzug-mannheim/ · /umzug-heidelberg/ · pkg 7 · pkg 10 · /privatumzuege/ · /halteverbotszone/ · /stundenpreise/ |
| 7 umzugsfirma-bergstrasse-bensheim-heppenheim | pkg 6 · pkg 8 · /umzug-mannheim/ · pkg 10 · /privatumzuege/ · /aussenaufzug/ |
| 8 umzugsfirma-darmstadt | /umzug-frankfurt/ · pkg 7 · pkg 9 · /bueroumzuege/ · /umzug-mannheim/ · /stundenpreise/ |
| 9 umzug-heidelberg-frankfurt | /umzug-heidelberg/ · /umzug-frankfurt/ · pkg 1 · pkg 8 · /blog/umzug-mannheim-frankfurt/ · /blog/umzugskosten-heidelberg/ |
| 10 umzug-weinheim-frankfurt-pendler | pkg 6 · /umzug-frankfurt/ · pkg 7 · pkg 8 · pkg 1 · /blog/umzug-checkliste/ |

## INBOUND (edits to EXISTING pages — do not skip)

| Existing page | Add link to | Where |
|---|---|---|
| `umzug-frankfurt.html` | pkg 1, 2, 3, 4, 5 | New "Frankfurter Stadtteile" section (expand the existing H3 stub) + Kosten section |
| `umzug-mannheim.html` | pkg 6, 8 | Regional service area / Umgebung block |
| `umzugsfirma-heidelberg.html` | pkg 6, 9 | Umgebung block |
| `umzugsfirma-viernheim.html` | pkg 6 | Nachbarorte — also helps break the 71.8% Schwetzingen overlap |
| `umzugsfirma-schwetzingen.html` | pkg 6 | Nachbarorte — same reason |
| `blog/umzug-mannheim-frankfurt/` | pkg 1, 2, 9, 10 | Related-posts block + inline in Kosten section |
| `blog/umzugskosten-mannheim/` | pkg 1 | Vergleich anderer Städte |
| `blog/halteverbotszone-beantragen-mannheim/` | pkg 2 | "In anderen Städten" — note the Frankfurt sign difference explicitly |
| `blog/umzug-mannheim-heidelberg/` | pkg 9 | Weiterführend |
| `blog/umzugskosten-heidelberg/` | pkg 9, 1 | Vergleich |
| `blog/index.html` | pkg 1, 2, 9, 10 | Post listing |
| `leistungen.html` | pkg 3–8 | Einsatzgebiete block |

## Sitemap + prerender (required for the 6 non-blog pages)
Packages 3, 4, 5, 6, 7, 8 are `.html` pages and MUST be added to BOTH:
1. `scripts/prerender.js` → `routes` array, following the existing pattern:
   `{ source: "umzug-frankfurt-sachsenhausen.html", route: "umzug-frankfurt-sachsenhausen" }`
2. `sitemap.xml` → new `<loc>` entries

Packages 1, 2, 9, 10 are blog posts → `blog/<slug>/index.html`, covered by the
`passthroughDirs = ["assets", "blog"]` rule, so they need **sitemap only**, not prerender.

⚠️ Forgetting the prerender step is how `/umzug-mannheim/` ended up a live 404 —
see `ACTION-PLAN.md` item 1. Do not repeat it.

## Anchor text discipline
Do not use the same anchor twice sitewide. Suggested distinct anchors:
- pkg 1 → "was ein Umzug in Frankfurt kostet"
- pkg 2 → "Halteverbotszone in Frankfurt beantragen"
- pkg 3 → "Umzug in Sachsenhausen"
- pkg 4 → "Büroumzug im Westend"
- pkg 5 → "Altbau-Umzug in Bornheim"
- pkg 6 → "Umzugsunternehmen in Weinheim"
- pkg 7 → "Umzüge an der Bergstraße"
- pkg 8 → "Umzugsfirma in Darmstadt"
- pkg 9 → "Umzug Heidelberg–Frankfurt"
- pkg 10 → "Pendlerumzug Weinheim–Frankfurt"
