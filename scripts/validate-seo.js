const fs = require("fs");
const path = require("path");

const pages = fs.readdirSync(process.cwd()).filter((file) => file.endsWith(".html"));
const required = [
  ["title", /<title>.+?<\/title>/s],
  ["description", /<meta\s+name="description"\s+content="[^"]+"\s*\/>/s],
  ["canonical", /<link rel="canonical" href="https:\/\/umzuege-herkules\.de\/[^"]*"\s*\/>/s],
  ["favicon", /<link rel="icon" href="\/assets\/Favicon\.png" type="image\/png"\s*\/>/s],
  ["open graph title", /<meta property="og:title" content="[^"]+"\s*\/>/s],
  ["twitter card", /<meta name="twitter:card" content="summary_large_image"\s*\/>/s],
  ["json-ld", /<script type="application\/ld\+json">.+?<\/script>/s],
];

let failed = false;
for (const page of pages) {
  const html = fs.readFileSync(path.join(process.cwd(), page), "utf8");
  for (const [label, pattern] of required) {
    if (!pattern.test(html)) {
      failed = true;
      console.error(`${page}: missing ${label}`);
    }
  }
}

for (const file of ["robots.txt", "sitemap.xml", "llms.txt", "llm.txt", "assets/Favicon.png"]) {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    failed = true;
    console.error(`missing ${file}`);
  }
}

if (failed) process.exit(1);
console.log(`SEO validation passed for ${pages.length} HTML pages.`);
