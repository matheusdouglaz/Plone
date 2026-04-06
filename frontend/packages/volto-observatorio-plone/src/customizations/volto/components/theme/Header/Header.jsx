import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import { defineMessages, useIntl } from 'react-intl';

import Anontools from '@plone/volto/components/theme/Anontools/Anontools';
import LanguageSelector from '@plone/volto/components/theme/LanguageSelector/LanguageSelector';
import Logo from '@plone/volto/components/theme/Logo/Logo';
import Navigation from '@plone/volto/components/theme/Navigation/Navigation';
import SearchWidget from '@plone/volto/components/theme/SearchWidget/SearchWidget';
import { Container } from 'semantic-ui-react';

const GOV_LINKS = [
  {
    href: 'https://www.gov.br/pt-br/orgaos-do-governo',
    label: 'Órgãos do Governo',
  },
  {
    href: 'https://www.gov.br/acesso-a-informacao',
    label: 'Acesso à Informação',
  },
  {
    href: 'http://www4.planalto.gov.br/legislacao',
    label: 'Legislação',
  },
  {
    href: 'https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario',
    label: 'Acessibilidade',
  },
];

const messages = defineMessages({
  institutionalLinks: {
    id: 'observatorio.header.institutionalLinks',
    defaultMessage: 'Links úteis',
  },
  fontSize: {
    id: 'observatorio.header.fontSize',
    defaultMessage: 'Tamanho do texto',
  },
  decreaseFont: {
    id: 'observatorio.header.decreaseFont',
    defaultMessage: 'Diminuir fonte',
  },
  increaseFont: {
    id: 'observatorio.header.increaseFont',
    defaultMessage: 'Aumentar fonte',
  },
  focusSearch: {
    id: 'observatorio.header.focusSearch',
    defaultMessage: 'Ir para o campo de busca',
  },
});

const FONT_CLASS = {
  0: '',
  1: 'obs-a11y-font-md',
  2: 'obs-a11y-font-lg',
};

const Header = ({ pathname }) => {
  const intl = useIntl();
  const token = useSelector((state) => state.userSession.token, shallowEqual);
  const site = useSelector((state) => state.site?.data);
  const siteTitle = site?.['plone.site_title'] || 'Observatório Plone';

  const [fontLevel, setFontLevel] = useState(0);

  useEffect(() => {
    document.body.classList.remove('obs-a11y-font-md', 'obs-a11y-font-lg');
    const cls = FONT_CLASS[fontLevel];
    if (cls) document.body.classList.add(cls);
  }, [fontLevel]);

  const bumpFont = (delta) => {
    setFontLevel((prev) => Math.min(2, Math.max(0, prev + delta)));
  };

  const focusMainSearch = useCallback(() => {
    const input = document.querySelector(
      '#observatorio-header-search input[name="SearchableText"]',
    );
    input?.focus();
  }, []);

  return (
    <header className="observatorio-header" role="banner">
      <h1 className="observatorio-sr-only">{siteTitle}</h1>

      {/* Faixa superior — azul gov.br: links institucionais + nome do site + utilitários */}
      <div className="observatorio-top-bar">
        <div className="observatorio-top-bar-inner">
          <nav
            className="observatorio-top-bar-links"
            aria-label={intl.formatMessage(messages.institutionalLinks)}
          >
            {GOV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="observatorio-top-bar-util">
            <span className="observatorio-top-bar-brand">{siteTitle}</span>
            <button
              type="button"
              className="observatorio-top-bar-search-jump"
              onClick={focusMainSearch}
              aria-label={intl.formatMessage(messages.focusSearch)}
            >
              Buscar
            </button>
            <div className="observatorio-a11y observatorio-a11y--on-dark">
              <span className="observatorio-a11y-label">
                {intl.formatMessage(messages.fontSize)}
              </span>
              <button
                type="button"
                className="observatorio-a11y-btn"
                onClick={() => bumpFont(-1)}
                aria-label={intl.formatMessage(messages.decreaseFont)}
              >
                A−
              </button>
              <button
                type="button"
                className="observatorio-a11y-btn"
                onClick={() => bumpFont(1)}
                aria-label={intl.formatMessage(messages.increaseFont)}
              >
                A+
              </button>
            </div>
            <LanguageSelector />
            {!token && (
              <div className="tools">
                <Anontools />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Faixa principal — branca: logo (atual) + menu do site + busca */}
      <div className="observatorio-main-bar">
        <div className="observatorio-main-bar-inner">
          <div className="observatorio-gov-brand">
            <div className="observatorio-logo-wrap">
              <Logo />
            </div>
          </div>

          <div className="observatorio-main-nav">
            <Container>
              <Navigation pathname={pathname} />
            </Container>
          </div>

          <div
            className="observatorio-main-search"
            id="observatorio-header-search"
          >
            <SearchWidget pathname={pathname} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

Header.propTypes = {
  pathname: PropTypes.string.isRequired,
};
