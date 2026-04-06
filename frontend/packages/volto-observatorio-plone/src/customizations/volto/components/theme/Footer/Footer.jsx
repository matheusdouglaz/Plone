/**
 * Rodapé — layout em colunas (referência IDG). Conteúdo: src/config/footerColumns.ts
 */
import React from 'react';
import { Container, Segment } from 'semantic-ui-react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { useSelector, shallowEqual } from 'react-redux';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { flattenToAppURL, addAppURL } from '@plone/volto/helpers/Url/Url';
import map from 'lodash/map';

import { footerColumns } from 'volto-observatorio-plone/config/footerColumns';

const messages = defineMessages({
  brandFallback: {
    id: 'observatorio.footer.brand',
    defaultMessage: 'Observatório Plone',
  },
  siteActions: {
    id: 'observatorio.footer.siteActions',
    defaultMessage: 'Links do site',
  },
  backToTop: {
    id: 'observatorio.footer.backToTop',
    defaultMessage: 'Voltar ao topo',
  },
  footerAria: {
    id: 'observatorio.footer.aria',
    defaultMessage: 'Rodapé do site',
  },
});

const isExternal = (href) => /^https?:\/\//i.test(href);

const FooterLink = ({ title, href }) =>
  isExternal(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {title}
    </a>
  ) : (
    <UniversalLink href={href}>{title}</UniversalLink>
  );

const Footer = ({ intl }) => {
  const { siteActions = [], siteTitle } = useSelector(
    (state) => ({
      siteActions: state.actions?.actions?.site_actions,
      siteTitle: state.site?.data?.['plone.site_title'],
    }),
    shallowEqual,
  );

  const footerBrand =
    siteTitle || intl.formatMessage(messages.brandFallback);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Segment
      role="contentinfo"
      vertical
      id="footer"
      className="observatorio-footer"
      aria-label={intl.formatMessage(messages.footerAria)}
      tabIndex="-1"
    >
      <Container>
        <div className="observatorio-footer-top">
          <span className="observatorio-footer-brand">{footerBrand}</span>
        </div>

        <div className="observatorio-footer-grid">
          {footerColumns.map((col) => (
            <div className="observatorio-footer-col" key={col.id}>
              <h3 className="observatorio-footer-heading">{col.title}</h3>
              <ul>
                {col.links.map((item) => (
                  <li key={`${col.id}-${item.href}-${item.title}`}>
                    <FooterLink title={item.title} href={item.href} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {siteActions?.length ? (
          <div className="observatorio-footer-site-actions">
            <h3 className="observatorio-footer-heading">
              {intl.formatMessage(messages.siteActions)}
            </h3>
            <ul>
              {map(siteActions, (item) => (
                <li key={item.id}>
                  <UniversalLink
                    href={
                      item.url ? flattenToAppURL(item.url) : addAppURL(item.id)
                    }
                  >
                    {item?.title}
                  </UniversalLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="observatorio-footer-meta">
          <FormattedMessage
            id="observatorio.footer.credits"
            defaultMessage="Observatório Plone — {plone} é {copyright} 2000–{year} pela {foundation}."
            values={{
              plone: (
                <FormattedMessage
                  id="Plone Open Source CMS"
                  defaultMessage="Plone Open Source CMS"
                />
              ),
              copyright: (
                <abbr
                  title={intl.formatMessage({
                    id: 'Copyright',
                    defaultMessage: 'Copyright',
                  })}
                >
                  ©
                </abbr>
              ),
              year: new Date().getFullYear(),
              foundation: (
                <a href="https://plone.org/foundation">
                  <FormattedMessage
                    id="Plone Foundation"
                    defaultMessage="Plone Foundation"
                  />
                </a>
              ),
            }}
          />
        </div>
      </Container>

      <button
        type="button"
        className="observatorio-footer-backtotop"
        onClick={scrollToTop}
        aria-label={intl.formatMessage(messages.backToTop)}
        title={intl.formatMessage(messages.backToTop)}
      >
        <span aria-hidden="true">↑</span>
      </button>
    </Segment>
  );
};

Footer.propTypes = {};

export default injectIntl(Footer);
