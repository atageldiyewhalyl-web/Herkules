const fs = require("fs");
const path = require("path");

const root = process.cwd();
const dist = path.join(root, "dist");

const routes = [
  { source: "index.html", route: "" },
  { source: "privatumzuege.html", route: "privatumzuege" },
  { source: "bueroumzuege.html", route: "bueroumzuege" },
  { source: "seniorenumzuege.html", route: "seniorenumzuege" },
  { source: "halteverbotszone.html", route: "halteverbotszone" },
  { source: "auslandsumzuege.html", route: "auslandsumzuege" },
  { source: "aussenaufzug.html", route: "aussenaufzug" },
  { source: "stundenpreise.html", route: "stundenpreise" },
  { source: "umzug-frankfurt.html", route: "umzug-frankfurt" },
  { source: "ueber-uns.html", route: "ueber-uns" },
  { source: "impressum.html", route: "impressum" },
  { source: "datenschutz.html", route: "datenschutz" },
];

const passthroughFiles = [
  "styles.css",
  "robots.txt",
  "robot.txt",
  "sitemap.xml",
  "llms.txt",
  "llm.txt",
  "favicon.svg",
  "herkules-truck-animation.mp4",
  "README.md",
];

const passthroughDirs = ["assets"];

function rmrf(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function mkdirp(target) {
  fs.mkdirSync(target, { recursive: true });
}

function copyFile(source, target) {
  if (!fs.existsSync(source)) return;
  mkdirp(path.dirname(target));
  fs.copyFileSync(source, target);
}

function copyDir(source, target) {
  if (!fs.existsSync(source)) return;
  mkdirp(target);
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else if (entry.isFile()) copyFile(from, to);
  }
}

function assertRequiredHead(html, source) {
  const required = [
    "<title>",
    'name="description"',
    'rel="canonical"',
    'rel="icon"',
    'property="og:title"',
    'name="twitter:card"',
    'application/ld+json',
  ];
  const missing = required.filter((needle) => !html.includes(needle));
  if (missing.length) {
    throw new Error(`${source} is missing SEO head tags: ${missing.join(", ")}`);
  }
}

rmrf(dist);
mkdirp(dist);

for (const dir of passthroughDirs) {
  copyDir(path.join(root, dir), path.join(dist, dir));
}

for (const file of passthroughFiles) {
  copyFile(path.join(root, file), path.join(dist, file));
}

for (const { source, route } of routes) {
  const sourcePath = path.join(root, source);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing route source: ${source}`);
  }

  const html = fs.readFileSync(sourcePath, "utf8");
  assertRequiredHead(html, source);

  const outputDir = route ? path.join(dist, route) : dist;
  mkdirp(outputDir);
  fs.writeFileSync(path.join(outputDir, "index.html"), html);

  if (route) {
    fs.writeFileSync(path.join(dist, source), html);
  }
}

console.log(`Pre-rendered ${routes.length} routes into ${path.relative(root, dist)}/`);
