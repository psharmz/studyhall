import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Which file to write. Prod builds claim index.html -- the entry GitHub Pages
// serves -- and dev builds land beside it as index.dev.html, so both bundles
// can sit in the tree at once.
const OUT = process.argv[2] ?? 'index.html';

const DIST = 'dist';
const htmlName = readdirSync(DIST).find((f) => f.endsWith('.html'));
let html = readFileSync(join(DIST, htmlName), 'utf8');

html = html.replace(
  /<link rel="stylesheet"[^>]*href="\.\/([^"]+\.css)"[^>]*>/,
  (_, href) => `<style>\n${readFileSync(join(DIST, href), 'utf8')}\n</style>`
);

html = html.replace(
  /<script[^>]*src="\.\/([^"]+\.js)"[^>]*><\/script>/,
  (_, src) => {
    const js = readFileSync(join(DIST, src), 'utf8').replace(/<\/script/gi, '<\\/script');
    return `<script type="module">\n${js}\n</script>`;
  }
);

writeFileSync(OUT, html);
console.log(`Wrote ${OUT} (${(html.length / 1024).toFixed(0)} kB)`);
