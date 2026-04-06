import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';
import cx from 'classnames';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';

import { defaultMinistryCards } from './schemaCardItem.js';

const messages = defineMessages({
  searchLabel: {
    id: 'observatorio.ministry.toolbar.searchLabel',
    defaultMessage: 'Buscar órgãos',
  },
  searchPlaceholder: {
    id: 'observatorio.ministry.toolbar.searchPlaceholder',
    defaultMessage: 'Nome, siglas (ex.: mds), temas ou descrição…',
  },
  themeAll: {
    id: 'observatorio.ministry.toolbar.themeAll',
    defaultMessage: 'Todos os temas',
  },
  themeLabel: {
    id: 'observatorio.ministry.toolbar.themeLabel',
    defaultMessage: 'Filtrar por tema',
  },
  sortLabel: {
    id: 'observatorio.ministry.toolbar.sortLabel',
    defaultMessage: 'Ordenar',
  },
  sortDefault: {
    id: 'observatorio.ministry.toolbar.sortDefault',
    defaultMessage: 'Ordem da lista',
  },
  sortTitleAsc: {
    id: 'observatorio.ministry.toolbar.sortTitleAsc',
    defaultMessage: 'Nome (A–Z)',
  },
  sortTitleDesc: {
    id: 'observatorio.ministry.toolbar.sortTitleDesc',
    defaultMessage: 'Nome (Z–A)',
  },
  clear: {
    id: 'observatorio.ministry.toolbar.clear',
    defaultMessage: 'Limpar',
  },
  resultsCount: {
    id: 'observatorio.ministry.toolbar.resultsCount',
    defaultMessage:
      '{shown, plural, one {# órgão encontrado} other {# órgãos encontrados}} (de {total})',
  },
  noResults: {
    id: 'observatorio.ministry.toolbar.noResults',
    defaultMessage:
      'Nenhum órgão corresponde à busca ou ao tema. Ajuste os termos ou escolha outro tema.',
  },
});

function parseHighlights(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
}

/** Remove acentos para busca insensível a maiúsculas/minúsculas */
function normalizeText(s) {
  if (s == null || s === '') return '';
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Categoria legada / fallback quando não há temas explícitos no cartão.
 */
function deriveMinistryCategory(card) {
  const manual = (card?.category || '').trim();
  if (manual) return manual;
  const t = (card?.title || '').trim();
  if (/^ministério/i.test(t)) return 'Ministérios';
  if (/^secretaria/i.test(t)) return 'Secretarias e órgãos centrais';
  if (
    /^(advocacia|casa civil|controladoria|gabinete de segurança)/i.test(t)
  ) {
    return 'Órgãos de apoio à Presidência';
  }
  return 'Demais órgãos';
}

/** Lista de temas do cartão: campo `themes` ou categoria derivada. */
function parseThemeList(raw) {
  if (!raw || typeof raw !== 'string') return [];
  return raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Tags para o filtro: sempre inclui a categoria derivada do título (ex.: Ministérios)
 * e soma os temas explícitos do campo `themes`, sem duplicar (por texto normalizado).
 */
function getCardFilterTags(card) {
  const derived = deriveMinistryCategory(card);
  const fromField = parseThemeList(card?.themes);
  const byNorm = new Map();
  const add = (label) => {
    const s = (label || '').trim();
    if (!s) return;
    const n = normalizeText(s);
    if (n && !byNorm.has(n)) byNorm.set(n, s);
  };
  add(derived);
  fromField.forEach(add);
  return Array.from(byNorm.values());
}

function tagMatchesFilter(card, selectedNorm) {
  if (!selectedNorm) return true;
  return getCardFilterTags(card).some(
    (tag) => normalizeText(tag) === selectedNorm,
  );
}

function cardMatchesQuery(card, qNorm) {
  if (!qNorm) return true;
  const blob = [
    card.title,
    card.description,
    card.highlights,
    card.buttonLabel,
    card.searchKeywords,
    card.themes,
    ...getCardFilterTags(card),
  ]
    .filter(Boolean)
    .join(' ');
  return normalizeText(blob).includes(qNorm);
}

/** Evita cartões repetidos (mesmo título/link) vindos do CMS ou da lista. */
function dedupeMinistryCards(list) {
  if (!Array.isArray(list) || list.length < 2) return list;
  const seen = new Set();
  const out = [];
  for (let i = 0; i < list.length; i += 1) {
    const c = list[i];
    const k = `${normalizeText(c?.href || '')}::${normalizeText(c?.title || '')}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
  }
  return out;
}

function MinistryCard({ card }) {
  const {
    emoji = '🏛️',
    iconBgColor = '#f1f5f9',
    accentColor = '#1351b4',
    title = '',
    description = '',
    highlightsLabel = 'Destaques',
    highlights = '',
    buttonLabel = 'Acessar Portal',
    href = '/',
  } = card || {};

  const bullets = useMemo(() => parseHighlights(highlights), [highlights]);

  return (
    <article
      className="obs-ministry-card"
      style={{ '--obs-ministry-accent': accentColor }}
    >
      <header className="obs-ministry-card__head">
        <span
          className="obs-ministry-card__emoji-wrap"
          style={{ background: iconBgColor }}
          aria-hidden
        >
          <span className="obs-ministry-card__emoji">{emoji}</span>
        </span>
        <h3 className="obs-ministry-card__title">{title}</h3>
      </header>
      {description ? (
        <p className="obs-ministry-card__desc">{description}</p>
      ) : null}
      {bullets.length > 0 ? (
        <div className="obs-ministry-card__highlights">
          <p className="obs-ministry-card__highlights-label">{highlightsLabel}</p>
          <ul className="obs-ministry-card__list">
            {bullets.map((line, idx) => (
              <li key={`destaque-${idx}-${line.slice(0, 40)}`}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="obs-ministry-card__actions">
        <UniversalLink className="obs-ministry-card__btn" href={href || '/'}>
          {buttonLabel}
        </UniversalLink>
      </div>
    </article>
  );
}

MinistryCard.propTypes = {
  card: PropTypes.object.isRequired,
};

function MinistryFiltersToolbar({
  searchQuery,
  onSearchChange,
  themeFilter,
  onThemeChange,
  sortOrder,
  onSortChange,
  themeOptions,
  onClear,
  resultShown,
  resultTotal,
  intl,
}) {
  const hasFilters =
    searchQuery.trim() !== '' ||
    themeFilter !== '' ||
    sortOrder !== 'default';

  return (
    <div
      className="obs-ministry-toolbar obs-ministry-toolbar--listing"
      role="search"
      aria-label={intl.formatMessage(messages.searchLabel)}
    >
      <div className="obs-ministry-toolbar__row">
        <label className="obs-ministry-toolbar__field">
          <span className="obs-ministry-toolbar__label">
            {intl.formatMessage(messages.searchLabel)}
          </span>
          <input
            type="search"
            className="obs-ministry-toolbar__input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
            autoComplete="off"
          />
        </label>
        <label className="obs-ministry-toolbar__field obs-ministry-toolbar__field--narrow">
          <span className="obs-ministry-toolbar__label">
            {intl.formatMessage(messages.themeLabel)}
          </span>
          <select
            className="obs-ministry-toolbar__select"
            value={themeFilter}
            onChange={(e) => onThemeChange(e.target.value)}
            aria-label={intl.formatMessage(messages.themeAll)}
          >
            <option value="">
              {intl.formatMessage(messages.themeAll)}
            </option>
            {themeOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="obs-ministry-toolbar__field obs-ministry-toolbar__field--narrow">
          <span className="obs-ministry-toolbar__label">
            {intl.formatMessage(messages.sortLabel)}
          </span>
          <select
            className="obs-ministry-toolbar__select"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label={intl.formatMessage(messages.sortLabel)}
          >
            <option value="default">
              {intl.formatMessage(messages.sortDefault)}
            </option>
            <option value="title-asc">
              {intl.formatMessage(messages.sortTitleAsc)}
            </option>
            <option value="title-desc">
              {intl.formatMessage(messages.sortTitleDesc)}
            </option>
          </select>
        </label>
        {hasFilters ? (
          <button
            type="button"
            className="obs-ministry-toolbar__clear"
            onClick={onClear}
          >
            {intl.formatMessage(messages.clear)}
          </button>
        ) : null}
      </div>
      <p className="obs-ministry-toolbar__meta" aria-live="polite">
        {intl.formatMessage(messages.resultsCount, {
          shown: resultShown,
          total: resultTotal,
        })}
      </p>
    </div>
  );
}

MinistryFiltersToolbar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  themeFilter: PropTypes.string.isRequired,
  onThemeChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  themeOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClear: PropTypes.func.isRequired,
  resultShown: PropTypes.number.isRequired,
  resultTotal: PropTypes.number.isRequired,
  intl: PropTypes.object.isRequired,
};

const ObservatorioMinistryCardsView = ({ data, className, style }) => {
  const intl = useIntl();
  const {
    sectionTitle = '',
    columns = '3',
    cards: cardsRaw,
    cardsSource = 'local',
    maxCards: maxCardsRaw,
    showSearchAndFilters = false,
  } = data || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const ministryCardsSiteList = useSelector(
    (state) => state.config?.settings?.observatorioMinistryCardsSiteList,
  );

  const cards = useMemo(() => {
    const maxN = Math.max(0, parseInt(String(maxCardsRaw ?? 0), 10) || 0);

    if (cardsSource === 'global') {
      const site = Array.isArray(ministryCardsSiteList)
        ? ministryCardsSiteList
        : [];
      const list = site.length ? site.map((c) => ({ ...c })) : [];
      if (maxN > 0) return dedupeMinistryCards(list).slice(0, maxN);
      return dedupeMinistryCards(list);
    }

    let local;
    if (cardsRaw === undefined || cardsRaw === null) {
      local = defaultMinistryCards();
    } else if (Array.isArray(cardsRaw) && cardsRaw.length === 0) {
      local = [];
    } else {
      local = Array.isArray(cardsRaw) ? cardsRaw : defaultMinistryCards();
    }
    local = dedupeMinistryCards(local);
    if (maxN > 0) return local.slice(0, maxN);
    return local;
  }, [cardsRaw, cardsSource, ministryCardsSiteList, maxCardsRaw]);

  const themeOptions = useMemo(() => {
    const byNorm = new Map();
    cards.forEach((c) => {
      getCardFilterTags(c).forEach((t) => {
        const n = normalizeText(t);
        if (n && !byNorm.has(n)) byNorm.set(n, t.trim());
      });
    });
    return Array.from(byNorm.values()).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }),
    );
  }, [cards]);

  const filteredAndSorted = useMemo(() => {
    const qNorm = normalizeText(searchQuery.trim());
    const themeNorm = normalizeText(themeFilter.trim());
    let list = cards.filter((c) => {
      if (!tagMatchesFilter(c, themeNorm)) return false;
      return cardMatchesQuery(c, qNorm);
    });

    if (sortOrder === 'title-asc') {
      list = [...list].sort((a, b) =>
        (a.title || '').localeCompare(b.title || '', 'pt-BR', {
          sensitivity: 'base',
        }),
      );
    } else if (sortOrder === 'title-desc') {
      list = [...list].sort((a, b) =>
        (b.title || '').localeCompare(a.title || '', 'pt-BR', {
          sensitivity: 'base',
        }),
      );
    }

    return list;
  }, [cards, searchQuery, themeFilter, sortOrder]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setThemeFilter('');
    setSortOrder('default');
  }, []);

  const gridMod =
    columns === '2'
      ? 'obs-ministry-grid--cols-2'
      : columns === 'auto'
        ? 'obs-ministry-grid--auto'
        : 'obs-ministry-grid--cols-3';

  const toolbarFirst = showSearchAndFilters && cards.length > 0 && !sectionTitle;

  return (
    <section
      className={cx(
        'obs-ministry-section',
        toolbarFirst && 'obs-ministry-section--toolbar-below-page-title',
        className,
      )}
      style={style}
      aria-label={sectionTitle || 'Órgãos e ministérios'}
    >
      <div className="obs-ministry-section__inner">
        {sectionTitle ? (
          <h2 className="obs-ministry-section__heading">{sectionTitle}</h2>
        ) : null}

        {showSearchAndFilters && cards.length > 0 ? (
          <MinistryFiltersToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            themeFilter={themeFilter}
            onThemeChange={setThemeFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            themeOptions={themeOptions}
            onClear={handleClear}
            resultShown={filteredAndSorted.length}
            resultTotal={cards.length}
            intl={intl}
          />
        ) : null}

        {cards.length === 0 ? (
          <p className="obs-ministry-section__empty">
            {cardsSource === 'global'
              ? 'Lista central vazia. Edite o arquivo src/config/ministryCardsSite.js no projeto (ou defina observatorioMinistryCardsSiteList em applyConfig).'
              : 'Nenhum cartão adicionado. Use a barra lateral para incluir órgãos.'}
          </p>
        ) : filteredAndSorted.length === 0 ? (
          <p className="obs-ministry-section__empty obs-ministry-section__empty--filter">
            {intl.formatMessage(messages.noResults)}
          </p>
        ) : (
          <div className={cx('obs-ministry-grid', gridMod)}>
            {filteredAndSorted.map((card, i) => (
              <MinistryCard
                key={`card-${normalizeText(card.href || '')}-${normalizeText(card.title || '')}-${i}`}
                card={card}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

ObservatorioMinistryCardsView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default withBlockExtensions(ObservatorioMinistryCardsView);
