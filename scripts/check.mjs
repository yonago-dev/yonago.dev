// 公開前の確認。壊れやすい所だけを見る。
import { readFileSync, existsSync } from 'node:fs';

const errors = [];
const html = readFileSync('index.html', 'utf8');

const need = (ok, message) => { if (!ok) errors.push(message); };

need(/<title>[^<]+<\/title>/.test(html), 'titleがありません');
need(/<link rel="canonical" href="https:\/\/yonago\.dev\/">/.test(html), 'canonicalがありません');
need((html.match(/<h1[\s>]/g) || []).length === 1, 'h1は1つにしてください');

const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
need(ld, '構造化データがありません');
if (ld) {
  try {
    JSON.parse(ld[1]);
  } catch (e) {
    errors.push(`構造化データがJSONとして読めません：${e.message}`);
  }
}

for (const file of ['og.png', 'icon.png', 'favicon.svg', 'robots.txt', 'sitemap.xml']) {
  need(existsSync(file), `${file}がありません`);
}

// ページから参照しているルートのファイルが実在するか
for (const [, path] of html.matchAll(/(?:href|src)="\/([^"#?]+)"/g)) {
  need(existsSync(path), `参照先の${path}がありません`);
}

if (errors.length) {
  console.error(errors.map((e) => `NG: ${e}`).join('\n'));
  process.exit(1);
}
console.log('OK');
