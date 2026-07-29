import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

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

writeFileSync('index.html', html);
console.log(`Wrote index.html (${(html.length / 1024).toFixed(0)} kB)`);
