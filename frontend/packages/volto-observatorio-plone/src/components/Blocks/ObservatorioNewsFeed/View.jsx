import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { Dropdown, Loader } from 'semantic-ui-react';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';

import ministryRssFeeds from '../../../config/ministryRssFeeds';
import {
  buildPloneRssServiceUrl,
  clearRssNewsCache,
  fetchMergedMinistryNews,
  pickHomeHighlightItems,
  sortItemsByPubDate,
} from '../../../helpers/rssNews';

function useMinistryFeeds() {
  const fromConfig = useSelector(
    (state) => state.config?.settings?.observatorioMinistryRssFeeds,
  );
  return Array.isArray(fromConfig) && fromConfig.length > 0
    ? fromConfig
    : ministryRssFeeds;
}

function usePloneRssServiceUrl() {
  const apiPath = useSelector((state) => state.config?.settings?.apiPath);
  const legacyTraverse = useSelector(
    (state) => Boolean(state.config?.settings?.legacyTraverse),
  );
  const serviceName = useSelector(
    (state) =>
      state.config?.settings?.observatorioPloneRssService ||
      '@observatorio-rss-feed',
  );
  return useMemo(
    () => buildPloneRssServiceUrl(apiPath, serviceName, legacyTraverse),
    [apiPath, serviceName, legacyTraverse],
  );
}

/** Debug: settings, ?rssDebug=1 na URL ou localStorage observatorioRssDebug=1 */
function useRssDebugEnabled() {
  const fromSettings = useSelector(
    (state) => state.config?.settings?.observatorioRssDebug,
  );
  return useMemo(() => {
    if (fromSettings) return true;
    if (typeof window === 'undefined') return false;
    try {
      if (new URLSearchParams(window.location.search).get('rssDebug') === '1') {
        return true;
      }
      if (window.localStorage?.getItem('observatorioRssDebug') === '1') {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, [fromSettings]);
}

function FeaturedStory({ item }) {
  const hasImg = Boolean(item.image);
  return (
    <a
      className="obs-news-featured__link"
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="obs-news-featured__media">
        {hasImg ? (
          <img src={item.image} alt={item.title} loading="lazy" />
        ) : (
          <div className="obs-news-card__placeholder" aria-hidden />
        )}
      </div>
      <div className="obs-news-featured__content">
        <span className="obs-news-tag">{item.sourceLabel}</span>
        <h3 className="obs-news-featured__title">{item.title}</h3>
        {item.descriptionText ? (
          <p className="obs-news-featured__lead">{item.descriptionText}</p>
        ) : null}
        {item.pubDate ? (
          <time className="obs-news-featured__date" dateTime={item.pubDate}>
            {new Date(item.pubDate).toLocaleDateString('pt-BR')}
          </time>
        ) : null}
      </div>
    </a>
  );
}

FeaturedStory.propTypes = {
  item: PropTypes.object.isRequired,
};

function NewsCard({ item }) {
  const hasImg = Boolean(item.image);
  return (
    <a className="obs-news-card" href={item.link} target="_blank" rel="noopener noreferrer">
      <div className="obs-news-card__media">
        {hasImg ? (
          <img src={item.image} alt={item.title} loading="lazy" />
        ) : (
          <div className="obs-news-card__placeholder" aria-hidden />
        )}
      </div>
      <div className="obs-news-card__body">
        <span className="obs-news-tag">{item.sourceLabel}</span>
        <h3 className="obs-news-card__title">{item.title}</h3>
        {item.pubDate ? (
          <time className="obs-news-card__date" dateTime={item.pubDate}>
            {new Date(item.pubDate).toLocaleDateString('pt-BR')}
          </time>
        ) : null}
      </div>
    </a>
  );
}

NewsCard.propTypes = {
  item: PropTypes.object.isRequired,
};

const ObservatorioNewsFeedView = ({ data, className, style }) => {
  const feeds = useMinistryFeeds();
  const newsFeedEnabled = useSelector(
    (state) => state.config?.settings?.observatorioNewsFeedEnabled === true,
  );
  const ploneRssProxyUrl = usePloneRssServiceUrl();
  const rssDebug = useRssDebugEnabled();
  const apiPathRaw = useSelector((state) => state.config?.settings?.apiPath);

  const {
    variant = 'highlight',
    sectionTitle = 'Notícias',
    sectionIntro = '',
    moreLinkPath = '/noticias',
    moreLinkLabel = 'Ver todas as notícias',
    maxHighlight = 5,
    maxListing = 24,
  } = data || {};

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(newsFeedEnabled);
  const [error, setError] = useState(null);
  const [filterOrg, setFilterOrg] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!newsFeedEnabled) {
      setItems([]);
      setError(null);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    setError(null);
    fetchMergedMinistryNews(feeds, {
      ploneRssProxyUrl:
        typeof ploneRssProxyUrl === 'string' && ploneRssProxyUrl
          ? ploneRssProxyUrl
          : undefined,
      rssDebug,
    })
      .then((merged) => {
        if (!cancelled) setItems(merged);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e?.message || 'Erro ao carregar notícias');
          setItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [newsFeedEnabled, feeds, retryTick, ploneRssProxyUrl, rssDebug]);

  useEffect(() => {
    if (!rssDebug) return;
    // eslint-disable-next-line no-console
    console.info('[Observatorio RSS] config', {
      apiPath: apiPathRaw || '(vazio — RAZZLE_API_PATH no .env)',
      ploneRssProxyUrl: ploneRssProxyUrl || '(vazio)',
    });
  }, [rssDebug, apiPathRaw, ploneRssProxyUrl]);

  const filtered = useMemo(() => {
    if (filterOrg === 'all') return items;
    return items.filter((i) => i.sourceId === filterOrg);
  }, [items, filterOrg]);

  /* Destaque: mais recentes no geral, mas no máximo 1 card por ministério */
  const highlightSlice = useMemo(() => {
    const n = Math.max(
      1,
      Math.min(parseInt(String(maxHighlight), 10) || 5, 12),
    );
    return pickHomeHighlightItems(items, n);
  }, [items, maxHighlight]);

  const listingSlice = useMemo(() => {
    const n = Math.max(1, Math.min(Number(maxListing) || 24, 60));
    const order = sortOrder === 'oldest' ? 'asc' : 'desc';
    const sorted = sortItemsByPubDate(filtered, order);
    return sorted.slice(0, n);
  }, [filtered, maxListing, sortOrder]);

  const dropdownOptions = useMemo(
    () => [
      {
        key: 'all',
        text: 'Todos os órgãos',
        value: 'all',
      },
      ...feeds.map((f) => ({
        key: f.id,
        text: `${f.name} — ${f.shortLabel}`,
        value: f.id,
      })),
    ],
    [feeds],
  );

  const sortOptions = useMemo(
    () => [
      { key: 'newest', text: 'Mais recentes primeiro', value: 'newest' },
      { key: 'oldest', text: 'Mais antigas primeiro', value: 'oldest' },
    ],
    [],
  );

  const featured = highlightSlice[0];
  const secondary = highlightSlice.slice(1);

  if (!newsFeedEnabled) {
    return null;
  }

  return (
    <section
      className={cx('obs-news', `obs-news--${variant}`, className)}
      style={style}
      aria-labelledby="obs-news-heading"
    >
      <div className="obs-news__inner">
        <header className="obs-news__header">
          <div>
            <h2 id="obs-news-heading" className="obs-news__title">
              {sectionTitle}
            </h2>
            {sectionIntro ? (
              <p className="obs-news__intro">{sectionIntro}</p>
            ) : null}
          </div>
          {variant === 'listing' ? (
            <div className="obs-news__toolbar">
              <div className="obs-news__toolbar-field">
                <label
                  className="obs-news__filter-label"
                  htmlFor="obs-news-ministry-filter"
                >
                  Órgão
                </label>
                <Dropdown
                  id="obs-news-ministry-filter"
                  selection
                  options={dropdownOptions}
                  value={filterOrg}
                  onChange={(e, { value }) => setFilterOrg(value)}
                />
              </div>
              <div className="obs-news__toolbar-field">
                <label className="obs-news__filter-label" htmlFor="obs-news-sort">
                  Ordenar
                </label>
                <Dropdown
                  id="obs-news-sort"
                  selection
                  options={sortOptions}
                  value={sortOrder}
                  onChange={(e, { value }) => setSortOrder(value)}
                />
              </div>
            </div>
          ) : null}
        </header>

        {loading ? (
          <div className="obs-news__loading">
            <Loader active inline="centered" content="Carregando notícias…" />
          </div>
        ) : error ? (
          <p className="obs-news__error" role="alert">
            {error}
          </p>
        ) : variant === 'highlight' ? (
          <>
            {!featured ? (
              <div className="obs-news__empty obs-news__empty--block">
                <p>
                  Não há notícias. 404 no serviço Plone @observatorio-rss-feed: confira se o
                  pacote está no site que o proxy usa (ex.: :8080/Plone), RAZZLE_API_PATH e
                  CORS. Atualize a página ou tente de novo.
                </p>
                <button
                  type="button"
                  className="obs-news__retry-btn"
                  onClick={() => {
                    clearRssNewsCache();
                    setRetryTick((t) => t + 1);
                  }}
                >
                  Tentar novamente
                </button>
              </div>
            ) : (
              <>
                <div className="obs-news-featured">
                  <FeaturedStory item={featured} />
                </div>
                {secondary.length > 0 ? (
                  <div className="obs-news-grid">
                    {secondary.map((it) => (
                      <NewsCard key={it.id} item={it} />
                    ))}
                  </div>
                ) : null}
                {moreLinkPath ? (
                  <div className="obs-news__cta">
                    <UniversalLink className="obs-news__more-btn" href={moreLinkPath}>
                      {moreLinkLabel}
                    </UniversalLink>
                  </div>
                ) : null}
              </>
            )}
          </>
        ) : (
          <>
            {listingSlice.length === 0 ? (
              <div className="obs-news__empty obs-news__empty--block">
                <p>
                  {items.length === 0
                    ? 'Nenhuma notícia carregada. Verifique o Plone (serviço REST), RAZZLE_API_PATH e tente novamente.'
                    : 'Nenhuma notícia para este filtro. Tente outro órgão ou outra ordem.'}
                </p>
                {items.length === 0 ? (
                  <button
                    type="button"
                    className="obs-news__retry-btn"
                    onClick={() => {
                      clearRssNewsCache();
                      setRetryTick((t) => t + 1);
                    }}
                  >
                    Tentar novamente
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="obs-news-grid obs-news-grid--dense">
                {listingSlice.map((it) => (
                  <NewsCard key={it.id} item={it} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

ObservatorioNewsFeedView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default withBlockExtensions(ObservatorioNewsFeedView);
