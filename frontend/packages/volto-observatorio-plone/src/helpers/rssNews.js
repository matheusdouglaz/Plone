/**
 * Agrega feeds RSS apenas via Plone:
 * GET {apiPath}/++api++/{observatorioPloneRssService}?url=…
 * (mesmo padrão que helpers/Api formatUrl). Exige config.settings.apiPath (ex. RAZZLE_API_PATH).
 * Contrato JSON de sucesso: { raw: "<XML>" } — ver docs/rss-feed-contract.md
 */

let cache = {
  items: null,
  expires: 0,
};

const CACHE_MS = 8 * 60 * 1000;
const CACHE_EMPTY_MS = 60 * 1000;

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  if (typeof document === 'undefined') {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

function firstImageFromHtml(html) {
  if (!html || typeof html !== 'string') return '';
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : '';
}

function enclosureUrl(item) {
  const e = item.enclosure;
  if (!e) return '';
  if (typeof e === 'string') return e;
  if (e.link) return e.link;
  if (Array.isArray(e) && e[0]?.link) return e[0].link;
  return '';
}

function normalizeItem(raw, feed) {
  const thumb = raw.thumbnail || enclosureUrl(raw) || firstImageFromHtml(raw.description || '');
  return {
    id: `${feed.id}-${raw.link || raw.title || Math.random()}`,
    title: raw.title || '',
    link: raw.link || '#',
    pubDate: raw.pubDate || '',
    descriptionText: stripHtml(raw.description || '').slice(0, 280),
    image: thumb,
    sourceId: feed.id,
    sourceName: feed.name,
    sourceLabel: feed.shortLabel || feed.name,
  };
}

function getTagText(el, localName) {
  if (!el) return '';
  const nodes = el.getElementsByTagName(localName);
  const n = nodes[0];
  return n?.textContent?.trim() || '';
}

function parseAtomEntries(doc, feed) {
  const entries = doc.getElementsByTagName('entry');
  const out = [];
  for (let i = 0; i < entries.length; i += 1) {
    const node = entries[i];
    const title = getTagText(node, 'title');
    let link = '';
    const ln = node.getElementsByTagName('link');
    for (let j = 0; j < ln.length; j += 1) {
      const href = ln[j].getAttribute('href');
      if (href) {
        link = href;
        break;
      }
    }
    const pubDate =
      getTagText(node, 'updated') || getTagText(node, 'published') || getTagText(node, 'modified');
    const description =
      getTagText(node, 'summary') ||
      getTagText(node, 'content') ||
      '';
    const raw = {
      title,
      link: link || '#',
      pubDate,
      description,
      thumbnail: firstImageFromHtml(description),
    };
    if (!title && !link) continue;
    out.push(normalizeItem(raw, feed));
  }
  return out;
}

function parseRssXmlString(xmlText, feed) {
  if (!xmlText || typeof xmlText !== 'string') return [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  if (doc.querySelector('parsererror')) {
    return [];
  }
  const itemNodes = doc.getElementsByTagName('item');
  if (itemNodes.length === 0) {
    return parseAtomEntries(doc, feed);
  }
  const out = [];
  for (let i = 0; i < itemNodes.length; i += 1) {
    const node = itemNodes[i];
    const title = getTagText(node, 'title');
    let link = getTagText(node, 'link');
    if (!link) {
      const g = node.getElementsByTagName('guid')[0];
      const gt = g?.textContent?.trim() || '';
      if (/^https?:\/\//i.test(gt)) link = gt;
    }
    const pubDate = getTagText(node, 'pubDate') || getTagText(node, 'date');
    let description = getTagText(node, 'description');
    if (!description) {
      const desc = node.getElementsByTagNameNS('http://purl.org/rss/1.0/modules/content/', 'encoded')[0];
      description = desc?.textContent || '';
    }
    const enc = node.getElementsByTagName('enclosure')[0];
    const encUrl = enc?.getAttribute('url') || '';
    const raw = {
      title,
      link: link || '#',
      pubDate,
      description,
      thumbnail: encUrl || firstImageFromHtml(description),
    };
    if (!title && !link) continue;
    out.push(normalizeItem(raw, feed));
  }
  return out;
}

async function fetchWithTimeout(url, ms = 12000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal, credentials: 'omit' });
  } finally {
    clearTimeout(timer);
  }
}

function rssDebugLog(enabled, label, payload) {
  if (!enabled) return;
  const p =
    payload !== undefined && payload !== null && typeof payload === 'object'
      ? { ...payload }
      : { detail: payload };
  // eslint-disable-next-line no-console
  console.info(`[Observatorio RSS] ${label}`, p);
}

/**
 * @param {string} rssUrl
 * @param {string} serviceBaseUrl
 * @param {{ rssDebug?: boolean }} [opts]
 */
async function fetchXmlViaPloneService(rssUrl, serviceBaseUrl, opts = {}) {
  const { rssDebug = false } = opts;
  if (!serviceBaseUrl || typeof window === 'undefined') {
    rssDebugLog(rssDebug, 'Plone RSS: sem serviceBaseUrl ou SSR', {
      serviceBaseUrl: serviceBaseUrl || '(vazio)',
    });
    return null;
  }
  try {
    const base = String(serviceBaseUrl).replace(/\/$/, '');
    const u = `${base}?url=${encodeURIComponent(rssUrl)}`;
    const res = await fetchWithTimeout(u, 25000);
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    const text = await res.text();

    rssDebugLog(rssDebug, 'Plone RSS: resposta', {
      url: u,
      status: res.status,
      ok: res.ok,
      contentType: ct || '(sem header)',
      bodyPreview: text.slice(0, 220),
    });

    if (!res.ok) {
      rssDebugLog(rssDebug, 'Plone RSS: HTTP não OK', { status: res.status });
      return null;
    }

    let data = null;
    const trimmed = text.trimStart();
    if (ct.includes('json') || trimmed.startsWith('{')) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        rssDebugLog(rssDebug, 'Plone RSS: JSON inválido', { message: e?.message });
      }
    }

    if (data && typeof data === 'object') {
      /* Backend oficial: apenas raw (docs/rss-feed-contract.md) */
      const raw = data?.raw ?? data?.xml ?? data?.body;
      if (
        typeof raw === 'string' &&
        (/<item[\s>]/i.test(raw) || /<entry[\s>]/i.test(raw))
      ) {
        return raw;
      }
    }

    if (/<item[\s>]/i.test(text) || /<entry[\s>]/i.test(text)) {
      return text;
    }
  } catch (e) {
    rssDebugLog(rssDebug, 'Plone RSS: exceção', { message: e?.message || String(e) });
    return null;
  }
  return null;
}

/**
 * Igual ao formatUrl do Volto: apiPath + /++api++ + /@serviço
 * Sem apiPath definido no Redux → string vazia (nenhum fetch inventado).
 */
export function buildPloneRssServiceUrl(apiPath, serviceName, legacyTraverse) {
  if (!apiPath || typeof apiPath !== 'string' || !apiPath.trim()) {
    return '';
  }
  const base = apiPath.trim().replace(/\/$/, '');
  const sn = (serviceName || '@observatorio-rss-feed').replace(/^\//, '');
  const apiSuffix = legacyTraverse ? '' : '/++api++';
  return `${base}${apiSuffix}/${sn}`;
}

async function fetchOneFeed(feed, options = {}) {
  const { ploneRssProxyUrl, rssDebug = false } = options;

  if (!ploneRssProxyUrl) {
    return [];
  }

  const xml = await fetchXmlViaPloneService(feed.rssUrl, ploneRssProxyUrl, {
    rssDebug,
  });
  if (!xml) {
    return [];
  }

  const parsed = parseRssXmlString(xml, feed);
  if (parsed.length && rssDebug) {
    rssDebugLog(rssDebug, 'feed OK', { feedId: feed?.id, items: parsed.length });
  }
  return parsed;
}

function dedupeByLink(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    const key = (it.link || '').split('?')[0];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

function pubDateMs(pubDate) {
  if (!pubDate) return 0;
  const t = Date.parse(pubDate);
  return Number.isFinite(t) ? t : 0;
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => pubDateMs(b.pubDate) - pubDateMs(a.pubDate));
}

export function pickHomeHighlightItems(items, limit) {
  const n = Math.max(0, Math.min(Number(limit) || 0, 50));
  if (!n || !Array.isArray(items)) return [];
  const sorted = sortByDateDesc(items);
  const seenOrg = new Set();
  const seenLink = new Set();
  const out = [];

  for (const it of sorted) {
    if (out.length >= n) break;
    const sid = it.sourceId || '_';
    if (seenOrg.has(sid)) continue;
    seenOrg.add(sid);
    const lk = (it.link || '').split('?')[0];
    if (lk) seenLink.add(lk);
    out.push(it);
  }

  for (const it of sorted) {
    if (out.length >= n) break;
    const lk = (it.link || '').split('?')[0];
    if (!lk || seenLink.has(lk)) continue;
    seenLink.add(lk);
    out.push(it);
  }

  return out;
}

export function pickDiverseNewestFirst(items, limit) {
  return pickHomeHighlightItems(items, limit);
}

export function sortItemsByPubDate(items, order = 'desc') {
  const mult = order === 'asc' ? 1 : -1;
  return [...items].sort(
    (a, b) => (pubDateMs(a.pubDate) - pubDateMs(b.pubDate)) * mult,
  );
}

/**
 * @param {typeof import('../config/ministryRssFeeds.js').default} feeds
 * @param {{
 *   useCache?: boolean,
 *   ploneRssProxyUrl?: string,
 *   rssDebug?: boolean,
 * }} options
 */
export async function fetchMergedMinistryNews(feeds, options = {}) {
  const { useCache = true, ploneRssProxyUrl, rssDebug = false } = options;

  rssDebugLog(rssDebug, 'merge iniciado', {
    feeds: feeds?.length,
    ploneRssProxyUrl: ploneRssProxyUrl || '(vazio — defina RAZZLE_API_PATH)',
  });

  const now = Date.now();
  if (useCache && cache.items !== null && now < cache.expires) {
    rssDebugLog(rssDebug, 'cache', { cachedCount: cache.items.length });
    return cache.items;
  }

  const chunks = [];
  for (let i = 0; i < feeds.length; i += 1) {
    const items = await fetchOneFeed(feeds[i], {
      ploneRssProxyUrl,
      rssDebug,
    }).catch(() => []);
    chunks.push(items);
    if (i < feeds.length - 1) {
      await new Promise((r) => setTimeout(r, 50));
    }
  }
  const merged = dedupeByLink(sortByDateDesc(chunks.flat()));
  rssDebugLog(rssDebug, 'merge concluído', { totalItems: merged.length });
  cache = {
    items: merged,
    expires: now + (merged.length > 0 ? CACHE_MS : CACHE_EMPTY_MS),
  };
  return merged;
}

export function clearRssNewsCache() {
  cache = { items: null, expires: 0 };
}

export { stripHtml };
