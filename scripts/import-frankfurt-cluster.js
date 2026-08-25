const fs = require("fs");
const path = require("path");

const root = process.cwd();
const site = "https://www.umzuege-herkules.de";
const date = "2026-08-25";
const packagesDir = path.join(root, "content-queue");

const packageDirs = [
  "2026-08-25-umzugskosten-frankfurt",
  "2026-08-25-halteverbotszone-frankfurt",
  "2026-08-25-umzug-frankfurt-sachsenhausen",
  "2026-08-25-umzug-frankfurt-westend-bockenheim",
  "2026-08-25-umzug-frankfurt-nordend-bornheim",
  "2026-08-25-umzugsfirma-weinheim",
  "2026-08-25-umzugsfirma-bergstrasse-bensheim-heppenheim",
  "2026-08-25-umzugsfirma-darmstadt",
  "2026-08-25-umzug-heidelberg-frankfurt",
  "2026-08-25-umzug-weinheim-frankfurt-pendler",
  // --- batch 2 (2026-08-25): 5 Frankfurt + 7 Mannheim ---
  "2026-08-25-bueroumzug-frankfurt",
  "2026-08-25-umzug-frankfurt-gallus-europaviertel",
  "2026-08-25-seniorenumzug-frankfurt",
  "2026-08-25-studentenumzug-frankfurt",
  "2026-08-25-umzugshelfer-frankfurt-stundenpreise",
  "2026-08-25-umzug-mannheim-kaefertal",
  "2026-08-25-umzug-mannheim-feudenheim",
  "2026-08-25-umzug-mannheim-rheinau-seckenheim",
  "2026-08-25-umzug-mannheim-waldhof-sandhofen",
  "2026-08-25-bueroumzug-mannheim",
  "2026-08-25-seniorenumzug-mannheim",
  "2026-08-25-umzugshelfer-mannheim-stundenpreise",
];

const existingRelated = {
  "umzugskosten-frankfurt": [
    ["/blog/halteverbotszone-frankfurt-beantragen/", "Halteverbotszone Frankfurt beantragen", "Lokale Services"],
    ["/blog/umzug-mannheim-frankfurt/", "Umzug Mannheim - Frankfurt", "Strecken"],
    ["/umzug-frankfurt-sachsenhausen/", "Umzug Frankfurt-Sachsenhausen", "Stadtteile"],
  ],
  "halteverbotszone-frankfurt-beantragen": [
    ["/blog/umzugskosten-frankfurt/", "Umzugskosten Frankfurt", "Kosten"],
    ["/umzug-frankfurt-sachsenhausen/", "Umzug Frankfurt-Sachsenhausen", "Stadtteile"],
    ["/umzug-frankfurt/", "Umzugsfirma Frankfurt", "Standort"],
  ],
  "umzug-heidelberg-frankfurt": [
    ["/umzug-heidelberg/", "Umzug Heidelberg", "Standort"],
    ["/umzug-frankfurt/", "Umzug Frankfurt", "Standort"],
    ["/blog/umzugskosten-frankfurt/", "Umzugskosten Frankfurt", "Kosten"],
  ],
  "umzug-weinheim-frankfurt-pendler": [
    ["/umzugsfirma-weinheim/", "Umzugsfirma Weinheim", "Standort"],
    ["/umzug-frankfurt/", "Umzug Frankfurt", "Standort"],
    ["/umzugsfirma-bergstrasse-bensheim-heppenheim/", "Umzugsfirma Bergstraße", "Standort"],
  ],
  // --- batch 2 ---
  "bueroumzug-frankfurt": [
    ["/bueroumzuege/", "Büroumzüge", "Leistung"],
    ["/umzug-frankfurt-westend-bockenheim/", "Westend & Bockenheim", "Stadtteile"],
    ["/blog/umzugskosten-frankfurt/", "Umzugskosten Frankfurt", "Kosten"],
  ],
  "umzug-frankfurt-gallus-europaviertel": [
    ["/umzug-frankfurt/", "Umzugsfirma Frankfurt", "Standort"],
    ["/umzug-frankfurt-westend-bockenheim/", "Westend & Bockenheim", "Stadtteile"],
    ["/blog/umzugskosten-frankfurt/", "Umzugskosten Frankfurt", "Kosten"],
  ],
  "seniorenumzug-frankfurt": [
    ["/seniorenumzuege/", "Seniorenumzüge", "Leistung"],
    ["/aussenaufzug/", "Außenaufzug", "Leistung"],
    ["/umzug-frankfurt-nordend-bornheim/", "Nordend & Bornheim", "Stadtteile"],
  ],
  "studentenumzug-frankfurt": [
    ["/stundenpreise/", "Stundenpreise", "Leistung"],
    ["/umzug-frankfurt-westend-bockenheim/", "Westend & Bockenheim", "Stadtteile"],
    ["/blog/umzugskosten-frankfurt/", "Umzugskosten Frankfurt", "Kosten"],
  ],
  "umzugshelfer-frankfurt-stundenpreise": [
    ["/stundenpreise/", "Stundenpreise", "Leistung"],
    ["/blog/umzugskosten-frankfurt/", "Umzugskosten Frankfurt", "Kosten"],
    ["/umzug-frankfurt/", "Umzugsfirma Frankfurt", "Standort"],
  ],
  "umzug-mannheim-kaefertal": [
    ["/umzug-mannheim/", "Umzugsfirma Mannheim", "Standort"],
    ["/umzug-mannheim-feudenheim/", "Umzug Feudenheim", "Stadtteile"],
    ["/blog/umzugskosten-mannheim/", "Umzugskosten Mannheim", "Kosten"],
  ],
  "umzug-mannheim-feudenheim": [
    ["/umzug-mannheim/", "Umzugsfirma Mannheim", "Standort"],
    ["/umzug-mannheim-kaefertal/", "Käfertal & Franklin", "Stadtteile"],
    ["/seniorenumzug-mannheim/", "Seniorenumzug Mannheim", "Leistung"],
  ],
  "umzug-mannheim-rheinau-seckenheim": [
    ["/umzug-mannheim/", "Umzugsfirma Mannheim", "Standort"],
    ["/umzug-mannheim-waldhof-sandhofen/", "Waldhof & Sandhofen", "Stadtteile"],
    ["/blog/umzugskosten-mannheim/", "Umzugskosten Mannheim", "Kosten"],
  ],
  "umzug-mannheim-waldhof-sandhofen": [
    ["/umzug-mannheim/", "Umzugsfirma Mannheim", "Standort"],
    ["/umzug-mannheim-rheinau-seckenheim/", "Rheinau & Seckenheim", "Stadtteile"],
    ["/seniorenumzug-mannheim/", "Seniorenumzug Mannheim", "Leistung"],
  ],
  "bueroumzug-mannheim": [
    ["/bueroumzuege/", "Büroumzüge", "Leistung"],
    ["/umzug-mannheim-quadrate/", "Mannheim Quadrate", "Stadtteile"],
    ["/umzug-mannheim/", "Umzugsfirma Mannheim", "Standort"],
  ],
  "seniorenumzug-mannheim": [
    ["/seniorenumzuege/", "Seniorenumzüge", "Leistung"],
    ["/aussenaufzug/", "Außenaufzug", "Leistung"],
    ["/umzug-mannheim/", "Umzugsfirma Mannheim", "Standort"],
  ],
  "umzugshelfer-mannheim-stundenpreise": [
    ["/stundenpreise/", "Stundenpreise", "Leistung"],
    ["/blog/umzugskosten-mannheim/", "Umzugskosten Mannheim", "Kosten"],
    ["/umzug-mannheim/", "Umzugsfirma Mannheim", "Standort"],
  ],
};

function readPackage(dir) {
  const file = path.join(packagesDir, dir, "package.md");
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter: ${file}`);
  const frontmatter = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    frontmatter[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { file, meta: frontmatter, body: match[2].trim() };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " und ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildKeywords(meta) {
  // secondary_keywords arrives as a raw YAML flow list: "[a, b, c]".
  // Strip the brackets so they do not leak into the meta tag.
  const secondary = String(meta.secondary_keywords || "")
    .replace(/^\s*\[/, "")
    .replace(/\]\s*$/, "")
    .trim();
  return [meta.primary_keyword, secondary].filter(Boolean).join(", ");
}

function inlineMarkdown(value) {
  let html = escapeHtml(value);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return html;
}

function extractJsonLd(markdown) {
  const schema = markdown.match(/## Schema\s+```json\s*([\s\S]*?)\s*```/);
  if (!schema) return "[]";
  JSON.parse(schema[1]);
  return schema[1].trim();
}

function contentBeforeSchema(markdown) {
  return markdown.split(/\n## Schema\n/)[0].trim();
}

function markdownToHtml(markdown) {
  const lines = markdown.split("\n");
  const html = [];
  const headings = [];
  let paragraph = [];
  let list = null;
  let table = [];
  let firstH1 = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    html.push(`<${list.type}>`);
    for (const item of list.items) html.push(`  <li>${inlineMarkdown(item)}</li>`);
    html.push(`</${list.type}>`);
    list = null;
  };
  const flushTable = () => {
    if (!table.length) return;
    const rows = table.map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => inlineMarkdown(cell.trim())));
    const header = rows[0] || [];
    const body = rows.slice(2);
    html.push("<table>");
    html.push(`  <thead><tr>${header.map((cell) => `<th>${cell}</th>`).join("")}</tr></thead>`);
    html.push("  <tbody>");
    for (const row of body) html.push(`    <tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`);
    html.push("  </tbody>");
    html.push("</table>");
    table = [];
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushAll();
      continue;
    }
    if (line.startsWith("<div ") || line.startsWith("</div>") || line.startsWith("<strong>")) {
      flushAll();
      html.push(line);
      continue;
    }
    if (line.startsWith("|")) {
      flushParagraph();
      flushList();
      table.push(line);
      continue;
    }
    if (line.startsWith("# ")) {
      flushAll();
      firstH1 = line.slice(2).trim();
      continue;
    }
    if (line.startsWith("## ")) {
      flushAll();
      const text = line.slice(3).trim();
      const id = slugify(text);
      headings.push({ id, text });
      html.push(`<h2 id="${id}">${inlineMarkdown(text)}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      flushAll();
      html.push(`<h3>${inlineMarkdown(line.slice(4).trim())}</h3>`);
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.+)/);
    const numbered = line.match(/^\d+\.\s+(.+)/);
    if (bullet || numbered) {
      flushParagraph();
      flushTable();
      const type = bullet ? "ul" : "ol";
      if (!list || list.type !== type) flushList();
      if (!list) list = { type, items: [] };
      list.items.push((bullet || numbered)[1]);
      continue;
    }
    flushList();
    flushTable();
    paragraph.push(line.trim());
  }
  flushAll();
  return { html: html.join("\n"), headings, h1: firstH1 };
}

function faqFromJsonLd(jsonLd) {
  const data = JSON.parse(jsonLd);
  const faq = Array.isArray(data) ? data.find((entry) => entry["@type"] === "FAQPage") : null;
  return faq?.mainEntity || [];
}

function pageUrl(meta) {
  return meta.type === "blog" ? `/blog/${meta.slug}/` : `/${meta.slug}/`;
}

function navHtml(currentUrl) {
  return `<header class="site-header">
      <nav class="nav" aria-label="Hauptnavigation">
        <a class="brand" href="/" aria-label="Herkules Startseite">
          <img src="/assets/herkules-logo-nav.png" alt="Herkules Umzüge &amp; Transporte e.K." />
        </a>
        <div class="nav__links" aria-label="Navigation">
          <a href="/ueber-uns/">Über uns</a>
          <div class="nav__item nav__item--dropdown">
            <button class="nav__trigger" type="button" aria-haspopup="true" aria-expanded="false">Leistungen</button>
            <div class="nav__dropdown" aria-label="Leistungen">
              <a href="/leistungen/">Alle Leistungen</a>
              <a href="/privatumzuege/">Privatumzüge</a>
              <a href="/bueroumzuege/">Büroumzüge</a>
              <a href="/seniorenumzuege/">Seniorenumzüge</a>
              <a href="/auslandsumzuege/">Auslandsumzüge</a>
              <a href="/halteverbotszone/">Halteverbotszone</a>
              <a href="/aussenaufzug/">Aussenaufzug</a>
              <a href="/umzugskartons/">Umzugskartons</a>
              <a href="/stundenpreise/">Stundenpreise</a>
            </div>
          </div>
          <div class="nav__item nav__item--dropdown">
            <button class="nav__trigger" type="button" aria-haspopup="true" aria-expanded="false">Standorte</button>
            <div class="nav__dropdown" aria-label="Standorte">
              <a href="/umzug-mannheim/">Umzug Mannheim</a>
              <a href="/umzug-mannheim-quadrate/">Mannheim Quadrate</a>
              <a href="/umzug-neckarstadt/">Neckarstadt</a>
              <a href="/umzug-lindenhof/">Lindenhof</a>
              <a href="/umzug-mannheim-kaefertal/">K&auml;fertal &amp; Franklin</a>
              <a href="/umzug-mannheim-feudenheim/">Feudenheim</a>
              <a href="/umzug-mannheim-rheinau-seckenheim/">Rheinau &amp; Seckenheim</a>
              <a href="/umzug-mannheim-waldhof-sandhofen/">Waldhof &amp; Sandhofen</a>
              <a href="/umzug-frankfurt/">Frankfurt</a>
              <a href="/umzug-frankfurt-sachsenhausen/">Sachsenhausen</a>
              <a href="/umzug-frankfurt-westend-bockenheim/">Westend &amp; Bockenheim</a>
              <a href="/umzug-frankfurt-nordend-bornheim/">Nordend &amp; Bornheim</a>
              <a href="/umzug-frankfurt-gallus-europaviertel/">Gallus &amp; Europaviertel</a>
              <a href="/umzug-heidelberg/">Heidelberg</a>
              <a href="/umzugsfirma-ludwigshafen/">Ludwigshafen</a>
              <a href="/umzugsfirma-schwetzingen/">Schwetzingen</a>
              <a href="/umzugsfirma-viernheim/">Viernheim</a>
              <a href="/umzugsfirma-weinheim/">Weinheim</a>
              <a href="/umzugsfirma-bergstrasse-bensheim-heppenheim/">Bergstra&szlig;e</a>
              <a href="/umzugsfirma-darmstadt/">Darmstadt</a>
            </div>
          </div>
          <a href="/blog/"${currentUrl === "/blog/" ? ' aria-current="page"' : ""}>Blog</a>
          <a href="/#kontakt">Kontakt</a>
        </div>
        <a class="nav__cta" href="/#kontakt">Kostenloses Angebot</a>
        <button class="nav__toggle" type="button" aria-label="Menü öffnen" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </nav>
    </header>`;
}

function footerHtml() {
  return `<footer class="site-footer" aria-labelledby="footer-title">
      <img class="site-footer__background" src="/assets/new-footer-2-transparent.webp" alt="" aria-hidden="true" decoding="async" />
      <div class="site-footer__inner">
        <div class="site-footer__brand">
          <a href="/" aria-label="Herkules Startseite">
            <img src="/assets/herkules-logo-nav.png" alt="Herkules Umzüge &amp; Transporte e.K." />
          </a>
          <p>Professionelle Umzüge für Privat und Gewerbe in Mannheim, Frankfurt, Heidelberg und Umgebung.</p>
        </div>
        <nav class="site-footer__nav" aria-label="Footer Navigation">
          <div>
            <h3>Navigation</h3>
            <a href="/leistungen/">Leistungen</a>
            <a href="/blog/">Blog &amp; Ratgeber</a>
            <a href="/umzug-frankfurt/">Umzug Frankfurt</a>
            <a href="/#faq">FAQ</a>
          </div>
          <div>
            <h3>Kontakt</h3>
            <a href="tel:+496218995969">0621 - 899 59 69</a>
            <a href="mailto:Info@herkules-umzuege24.de">Info@herkules-umzuege24.de</a>
          </div>
          <div>
            <h3>Standorte</h3>
            <span>Mannheim</span>
            <span>Frankfurt</span>
            <span>Rhein-Neckar &amp; Rhein-Main</span>
          </div>
        </nav>
      </div>
      <div class="site-footer__bottom">
        <p>© 2026 Herkules Umzüge &amp; Transporte e.K.</p>
        <a class="site-footer__credit" href="https://nüll.com" target="_blank" rel="noopener">
          <span>Site made by</span>
          <img src="/assets/null-logo.png" alt="nüll.com" />
        </a>
        <div>
          <a href="/#kontakt">Angebot anfragen</a>
          <a href="/impressum/">Impressum</a>
          <a href="/datenschutz/">Datenschutz</a>
          <button type="button" data-cookie-settings>Cookie-Einstellungen</button>
        </div>
      </div>
    </footer>`;
}

function scriptHtml() {
  return `<script>
      const nav = document.querySelector(".nav");
      const navToggle = document.querySelector(".nav__toggle");
      const navDropdownItems = document.querySelectorAll(".nav__item--dropdown");
      navToggle?.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
      });
      navDropdownItems.forEach(item => {
        item.querySelector(".nav__trigger")?.addEventListener("click", () => {
          if (!window.matchMedia("(max-width:1024px)").matches) return;
          const isExp = item.classList.toggle("is-expanded");
          item.querySelector(".nav__trigger")?.setAttribute("aria-expanded", String(isExp));
        });
      });
      const progressBar = document.getElementById("article-progress");
      const prose = document.getElementById("article-prose");
      if (progressBar && prose) {
        window.addEventListener("scroll", () => {
          const rect = prose.getBoundingClientRect();
          const total = prose.offsetHeight - window.innerHeight;
          const scrolled = Math.max(0, -rect.top);
          const pct = Math.min(100, total > 0 ? (scrolled / total) * 100 : 0);
          progressBar.style.width = pct + "%";
          progressBar.setAttribute("aria-valuenow", Math.round(pct));
        }, { passive: true });
      }
    </script>`;
}

function renderPage(pkg) {
  const meta = pkg.meta;
  const jsonLd = extractJsonLd(pkg.body);
  const content = markdownToHtml(contentBeforeSchema(pkg.body));
  const url = pageUrl(meta);
  const canonical = `${site}${url}`;
  const title = meta.title_tag || content.h1;
  const description = meta.meta_description;
  const category = meta.category || (meta.type === "blog" ? "Ratgeber" : "Standort");
  const image = meta.slug.includes("halteverbotszone") ? "/assets/halteverbotszone.png" : "/assets/intro-truck.webp";
  const imageAbs = `${site}${image}`;
  const readTime = Math.max(6, Math.round(content.html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 170));
  const faqs = faqFromJsonLd(jsonLd);
  const related = existingRelated[meta.slug] || [
    ["/umzug-frankfurt/", "Umzug Frankfurt", "Standort"],
    ["/blog/umzugskosten-frankfurt/", "Umzugskosten Frankfurt", "Kosten"],
    ["/blog/halteverbotszone-frankfurt-beantragen/", "Halteverbotszone Frankfurt", "Lokale Services"],
  ];
  const toc = content.headings.slice(0, 8).map((h) => `<li><a href="#${h.id}">${escapeHtml(h.text)}</a></li>`).join("\n              ");
  const relatedHtml = related.map(([href, label, cat]) => `<a class="related-card" href="${href}">
                <span class="related-card__category">${escapeHtml(cat)}</span>
                <h3>${escapeHtml(label)}</h3>
                <span class="related-card__link">Mehr lesen →</span>
              </a>`).join("\n              ");
  const type = meta.type === "blog" ? "article" : "website";
  const breadcrumbParent = meta.type === "blog" ? `<a href="/blog/">Blog</a>` : `<a href="/umzug-frankfurt/">Standorte</a>`;
  const cityClass = meta.type === "blog" ? "article-page" : "article-page location-article-page";

  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="keywords" content="${escapeHtml(buildKeywords(meta))}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="Herkules Umzüge &amp; Transporte e.K." />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${escapeHtml(title)} | Herkules Umzüge" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:site_name" content="Herkules Umzüge &amp; Transporte e.K." />
    <meta property="og:image" content="${imageAbs}" />
    <meta property="og:image:alt" content="${escapeHtml(content.h1)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)} | Herkules Umzüge" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageAbs}" />
    <meta property="article:published_time" content="${date}T00:00:00+00:00" />
    <meta property="article:modified_time" content="${date}T00:00:00+00:00" />
    <script type="application/ld+json">${jsonLd}</script>
    <link rel="icon" href="/assets/favicon-512.png" type="image/png" sizes="512x512" />
    <meta name="theme-color" content="#f8bf1c" />
    <link rel="stylesheet" href="/styles.css?v=20260825" />
    <link rel="stylesheet" href="/blog.css?v=20260825" />
    <script defer src="/assets/cookie-consent.js"></script>
    <script defer src="/assets/google-tracking.js"></script>
  </head>
  <body class="private-page ${cityClass}">
    <div class="article-progress" id="article-progress" role="progressbar" aria-label="Lesefortschritt" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    ${navHtml(url)}
    <main>
      <header class="article-header" id="article-top">
        <div class="article-header__inner-wrap">
          <nav class="article-breadcrumb" aria-label="Brotkrümelpfad">
            <a href="/">Startseite</a>
            <span aria-hidden="true">›</span>
            ${breadcrumbParent}
            <span aria-hidden="true">›</span>
            <span aria-current="page">${escapeHtml(content.h1)}</span>
          </nav>
          <span class="article-header__category">${escapeHtml(category)}</span>
          <h1>${escapeHtml(content.h1)}</h1>
          <p class="article-header__deck">${escapeHtml(description)}</p>
          <div class="article-header__meta">
            <span>25. August 2026</span>
            <span>${readTime} Min. Lesezeit</span>
            <span>Von <a href="/ueber-uns/">${escapeHtml(meta.author || "Döndü Akbaba")}</a></span>
          </div>
        </div>
      </header>
      <div class="article-wrap">
        <article class="article-main">
          <div class="article-prose" id="article-prose">
${content.html}
          </div>
          <section class="related-articles" aria-labelledby="related-title">
            <h2 id="related-title">Passende Seiten</h2>
            <div class="related-articles__grid">
              ${relatedHtml}
            </div>
          </section>
        </article>
        <aside class="article-sidebar" aria-label="Seitenleiste">
          <div class="sidebar-cta">
            <p class="sidebar-cta__eyebrow">Kostenloses Angebot</p>
            <h2 class="sidebar-cta__title">Umzug planen?</h2>
            <p class="sidebar-cta__text">Kostenlose Besichtigung. Verbindlicher Festpreis. Klare Planung für beide Adressen.</p>
            <a class="button button--primary" href="/#kontakt">Angebot anfordern</a>
            <a class="button button--outline" href="tel:+496218995969">☎ 0621 899 59 69</a>
          </div>
          <div class="sidebar-trust">
            <div class="sidebar-trust__item"><span class="sidebar-trust__icon">★</span><div><strong>4,8 / 5</strong><span>Google Bewertung</span></div></div>
            <div class="sidebar-trust__item"><span class="sidebar-trust__icon">✓</span><div><strong>Seit 2004</strong><span>Mannheim &amp; Region</span></div></div>
            <div class="sidebar-trust__item"><span class="sidebar-trust__icon">⊕</span><div><strong>Festpreis</strong><span>Keine Überraschungen</span></div></div>
          </div>
          <nav class="sidebar-toc" aria-label="Inhaltsverzeichnis">
            <p class="sidebar-toc__title">Inhalt</p>
            <ol>
              ${toc}
            </ol>
          </nav>
        </aside>
      </div>
      <section class="blog-cta-banner" aria-label="Angebot anfordern">
        <div class="blog-cta-banner__inner">
          <div class="blog-cta-banner__text">
            <h2>Umzug mit Herkules planen</h2>
            <p>Wir prüfen Volumen, Etagen, Laufwege, Halteverbotszone und Terminfenster vorab und erstellen daraus ein verbindliches Angebot.</p>
          </div>
          <div class="blog-cta-banner__actions">
            <a class="button button--primary" href="/#kontakt">Kostenloses Angebot anfordern</a>
            <a class="button button--ghost" href="tel:+496218995969">☎ 0621 899 59 69</a>
          </div>
        </div>
      </section>
    </main>
    ${footerHtml()}
    ${scriptHtml()}
  </body>
</html>
`;
}

function writePages(packages) {
  for (const pkg of packages) {
    const url = pageUrl(pkg.meta);
    const file = pkg.meta.type === "blog"
      ? path.join(root, "blog", pkg.meta.slug, "index.html")
      : path.join(root, `${pkg.meta.slug}.html`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, renderPage(pkg));
    console.log(`Wrote ${path.relative(root, file)} (${url})`);
  }
}

function updatePrerender(packages) {
  const file = path.join(root, "scripts", "prerender.js");
  let source = fs.readFileSync(file, "utf8");
  for (const pkg of packages.filter((p) => p.meta.type !== "blog")) {
    const line = `  { source: "${pkg.meta.slug}.html", route: "${pkg.meta.slug}" },`;
    if (source.includes(line)) continue;
    source = source.replace('  { source: "ueber-uns.html", route: "ueber-uns" },', `${line}\n  { source: "ueber-uns.html", route: "ueber-uns" },`);
  }
  fs.writeFileSync(file, source);
}

function updateSitemap(packages) {
  const file = path.join(root, "sitemap.xml");
  let xml = fs.readFileSync(file, "utf8");
  // Append only the URLs that are not already present. The previous version
  // appended the whole batch as soon as a single entry was missing, which
  // duplicated every already-listed URL on a re-run.
  const missing = packages
    .map((pkg) => `${site}${pageUrl(pkg.meta)}`)
    .filter((loc) => !xml.includes(`<loc>${loc}</loc>`));
  if (missing.length) {
    const entries = missing.map((loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${date}</lastmod>
  </url>`).join("\n");
    xml = xml.replace("</urlset>", `${entries}\n</urlset>`);
  }
  fs.writeFileSync(file, xml);
}

function card(pkg) {
  const meta = pkg.meta;
  const content = markdownToHtml(contentBeforeSchema(pkg.body));
  const image = meta.slug.includes("halteverbotszone") ? "/assets/halteverbotszone.png" : "/assets/intro-truck.webp";
  return `<article class="blog-card">
            <div class="blog-card__thumb">
              <div class="blog-card__thumb-bg" style="background-image: url('${image}'); background-color: #101522;"></div>
              <div class="blog-card__thumb-overlay"></div>
              <span class="blog-card__category">${escapeHtml(meta.category || "Ratgeber")}</span>
            </div>
            <div class="blog-card__body">
              <div class="blog-card__meta">
                <span>25. August 2026</span>
                <span class="blog-card__meta-dot"></span>
                <span>SEO Cluster</span>
              </div>
              <h3 class="blog-card__title">${escapeHtml(content.h1)}</h3>
              <p class="blog-card__excerpt">${escapeHtml(meta.meta_description)}</p>
              <a class="blog-card__link" href="${pageUrl(meta)}">
                Artikel lesen
                <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
            </div>
          </article>`;
}

function updateBlogIndex(packages) {
  const blogs = packages.filter((pkg) => pkg.meta.type === "blog");
  const file = path.join(root, "blog", "index.html");
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("/blog/umzugskosten-frankfurt/")) return;
  const cards = blogs.map(card).join("\n\n          ");
  html = html.replace('<div class="blog-grid__cards">', `<div class="blog-grid__cards">\n\n          ${cards}`);
  html = html
    .replace("Umzugstipps, Kostenratgeber und lokale Guides von Herkules Umzüge Mannheim. Alles, was Sie für einen stressfreien Umzug in Mannheim wissen müssen.", "Umzugstipps, Kostenratgeber und lokale Guides von Herkules Umzüge für Mannheim, Frankfurt und die Rhein-Neckar-Region.")
    .replace("Umzugswissen von<br>Mannheims Profis", "Umzugswissen von<br>Herkules Profis")
    .replace("Praxistipps, Kostenratgeber und lokale Guides — damit Ihr Umzug in Mannheim und der Rhein-Neckar-Region reibungslos läuft.", "Praxistipps, Kostenratgeber und lokale Guides — damit Ihr Umzug in Mannheim, Frankfurt und der Region reibungslos läuft.");
  fs.writeFileSync(file, html);
}

function updateFrankfurtHub() {
  const file = path.join(root, "umzug-frankfurt.html");
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("/umzug-frankfurt-sachsenhausen/")) return;
  const insertion = `<p>
            Vertiefende Seiten für die wichtigsten Frankfurter Lagen:
            <a href="/umzug-frankfurt-sachsenhausen/">Umzug Frankfurt-Sachsenhausen</a>,
            <a href="/umzug-frankfurt-westend-bockenheim/">Umzug Westend &amp; Bockenheim</a> und
            <a href="/umzug-frankfurt-nordend-bornheim/">Umzug Nordend &amp; Bornheim</a>.
            Für Preise und Parkraumplanung lesen Sie außerdem
            <a href="/blog/umzugskosten-frankfurt/">Umzugskosten Frankfurt</a> und
            <a href="/blog/halteverbotszone-frankfurt-beantragen/">Halteverbotszone Frankfurt beantragen</a>.
          </p>`;
  html = html.replace("</p>\n          <figure class=\"city-local-section__visual\">", `</p>\n          ${insertion}\n          <figure class="city-local-section__visual">`);
  fs.writeFileSync(file, html);
}

const packages = packageDirs.map(readPackage);
writePages(packages);
updatePrerender(packages);
updateSitemap(packages);
updateBlogIndex(packages);
updateFrankfurtHub();
