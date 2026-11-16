// connpassのグループの新着フィードから、これからの集まりを返す。
const FEED = 'https://yonago-dev.connpass.com/ja.atom';

const decode = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

// 日時は「2026/12/13 14:00 ～ 17:00」か「2026/12/13 14:00 ～ 2026/12/14 17:00」の形で、日本時間
function parseRange(text) {
  const m = text.match(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}) [～〜~] (?:(\d{4})\/(\d{2})\/(\d{2}) )?(\d{2}):(\d{2})/);
  if (!m) return null;
  const [, y, mo, d, h, mi, y2 = y, mo2 = mo, d2 = d, h2, mi2] = m;
  return {
    start: `${y}-${mo}-${d}T${h}:${mi}:00+09:00`,
    end: `${y2}-${mo2}-${d2}T${h2}:${mi2}:00+09:00`,
  };
}

export function parseFeed(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
    const title = entry.match(/<title>([\s\S]*?)<\/title>/);
    const link = entry.match(/<link href="([^"]+)"/);
    const summary = decode((entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/) || [])[1] || '');
    const range = parseRange(summary);
    if (!title || !link || !range) return [];
    const place = (summary.match(/開催場所: ([^<]*)/) || [])[1] || '';
    return [{ title: decode(title[1]).trim(), url: decode(link[1]).split('?')[0], place: place.trim(), ...range }];
  });
}

export default async function handler(req, res) {
  try {
    const r = await fetch(FEED);
    if (!r.ok) throw new Error(`connpass ${r.status}`);
    const now = Date.now();
    const events = parseFeed(await r.text())
      .filter((e) => Date.parse(e.end) > now)
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
    res.status(200).json({ events });
  } catch (e) {
    res.setHeader('Cache-Control', 's-maxage=60');
    res.status(502).json({ events: [], error: e.message });
  }
}
