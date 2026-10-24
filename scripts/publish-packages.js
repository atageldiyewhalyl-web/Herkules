// Publishes content-queue packages as blog posts, reusing the renderer from
// import-frankfurt-cluster.js. Usage:
//   node scripts/publish-packages.js 2026-10-24-ummelden-frankfurt [...]
// Writes blog/<slug>/index.html, adds sitemap entries and prepends cards to
// blog/index.html. Re-running is safe: existing sitemap URLs and cards are skipped.
const fs = require("fs");
const path = require("path");
const { readPackage, renderPage, markdownToHtml, contentBeforeSchema, pageUrl, card, site } = require("./import-frankfurt-cluster.js");

const root = process.cwd();

const related = {
  "umzugsfirma-frankfurt-finden": [
    ["/umzug-frankfurt/", "Umzugsfirma Frankfurt", "Standort"],
    ["/blog/umzugskosten-frankfurt/", "Umzugskosten Frankfurt", "Kosten"],
    ["/blog/halteverbotszone-frankfurt-beantragen/", "Halteverbotszone Frankfurt beantragen", "Lokale Services"],
  ],
  "ummelden-frankfurt": [
    ["/blog/halteverbotszone-frankfurt-beantragen/", "Halteverbotszone Frankfurt beantragen", "Lokale Services"],
    ["/blog/sperrmuell-frankfurt-umzug/", "Sperrmüll Frankfurt vor dem Umzug", "Lokale Services"],
    ["/umzug-frankfurt/", "Umzugsfirma Frankfurt", "Standort"],
  ],
  "sperrmuell-frankfurt-umzug": [
    ["/blog/umzugskosten-frankfurt/", "Umzugskosten Frankfurt", "Kosten"],
    ["/blog/ummelden-frankfurt/", "Ummelden in Frankfurt", "Lokale Services"],
    ["/seniorenumzug-frankfurt/", "Seniorenumzug Frankfurt", "Leistung"],
  ],
  "ummelden-mannheim": [
    ["/blog/halteverbotszone-beantragen-mannheim/", "Halteverbotszone Mannheim beantragen", "Lokale Services"],
    ["/blog/umzug-checkliste/", "Umzugs-Checkliste", "Planung"],
    ["/umzug-mannheim/", "Umzugsfirma Mannheim", "Standort"],
  ],
  "umzugskosten-steuer-absetzen": [
    ["/blog/umzugskosten-mannheim/", "Umzugskosten Mannheim", "Kosten"],
    ["/blog/umzugskosten-frankfurt/", "Umzugskosten Frankfurt", "Kosten"],
    ["/stundenpreise/", "Stundenpreise", "Leistung"],
  ],
};

function readTimeLabel(pkg) {
  const text = markdownToHtml(contentBeforeSchema(pkg.body)).html.replace(/<[^>]+>/g, " ");
  return `${Math.max(6, Math.round(text.split(/\s+/).filter(Boolean).length / 170))} Min. Lesezeit`;
}

const dirs = process.argv.slice(2);
if (!dirs.length) {
  console.error("Usage: node scripts/publish-packages.js <package-dir> [...]");
  process.exit(1);
}

const packages = dirs.map((dir) => {
  const pkg = readPackage(dir);
  pkg.meta.type = pkg.meta.type || "blog";
  if (pkg.meta.type !== "blog") throw new Error(`${dir}: only blog packages are supported`);
  return pkg;
});

for (const pkg of packages) {
  const file = path.join(root, "blog", pkg.meta.slug, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, renderPage(pkg, related[pkg.meta.slug]));
  console.log(`Wrote ${path.relative(root, file)}`);
}

const sitemapFile = path.join(root, "sitemap.xml");
let xml = fs.readFileSync(sitemapFile, "utf8");
const entries = packages
  .filter((pkg) => !xml.includes(`<loc>${site}${pageUrl(pkg.meta)}</loc>`))
  .map((pkg) => `  <url>
    <loc>${site}${pageUrl(pkg.meta)}</loc>
    <lastmod>${pkg.meta.date}</lastmod>
  </url>`);
if (entries.length) xml = xml.replace("</urlset>", `${entries.join("\n")}\n</urlset>`);
fs.writeFileSync(sitemapFile, xml);

const indexFile = path.join(root, "blog", "index.html");
let index = fs.readFileSync(indexFile, "utf8");
const cards = packages
  .filter((pkg) => !index.includes(`href="${pageUrl(pkg.meta)}"`))
  .map((pkg) => card(pkg, readTimeLabel(pkg)));
if (cards.length) {
  index = index.replace('<div class="blog-grid__cards">', `<div class="blog-grid__cards">\n\n          ${cards.join("\n\n          ")}`);
}
fs.writeFileSync(indexFile, index);
console.log(`Sitemap +${entries.length}, blog index +${cards.length}`);
