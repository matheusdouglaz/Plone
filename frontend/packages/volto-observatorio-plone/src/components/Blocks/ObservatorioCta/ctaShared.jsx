import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';

const isExternal = (href) =>
  typeof href === 'string' && /^https?:\/\//i.test(href.trim());

export const CtaLink = ({ href, className, style, children }) => {
  if (!href || !children) return null;
  const trimmed = href.trim();
  if (isExternal(trimmed)) {
    return (
      <a
        className={className}
        style={style}
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <UniversalLink className={className} style={style} href={trimmed}>
      {children}
    </UniversalLink>
  );
};

CtaLink.propTypes = {
  href: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

/** Conteúdo antigo do Hero: dois botões com campos separados */
/** Blocos antigos: um único `textAlign` valia para tudo, inclusive botões */
export function resolveButtonLayout(data) {
  const legacyAlign = data?.textAlign;
  return {
    ...(data || {}),
    buttonsAlign: data?.buttonsAlign ?? legacyAlign ?? 'left',
    buttonSize: data?.buttonSize ?? 'md',
    buttonRadius: data?.buttonRadius ?? 'pill',
    buttonGap: data?.buttonGap ?? 'normal',
  };
}

export function normalizeHeroButtons(data) {
  const raw = data?.buttons;
  /* `buttons: []` = lista explícita vazia; ausência da chave cai no legado */
  if (Array.isArray(raw)) {
    return raw.filter(
      (b) => b && String(b.label || '').trim() && String(b.href || '').trim(),
    );
  }

  const out = [];
  if (data?.showPrimary !== false && data?.primaryLabel && data?.primaryHref) {
    out.push({
      label: data.primaryLabel,
      href: data.primaryHref,
      variant: 'filled',
      bgColor: data.primaryBgColor || '#ffcd07',
      textColor: data.primaryTextColor || '#1a1a1a',
      borderColor: data.primaryBorderColor || '',
    });
  }
  if (
    data?.showSecondary !== false &&
    data?.secondaryLabel &&
    data?.secondaryHref
  ) {
    out.push({
      label: data.secondaryLabel,
      href: data.secondaryHref,
      variant: 'outline',
      bgColor: data.secondaryBgColor || '',
      textColor: data.secondaryTextColor || '#ffffff',
      borderColor: data.secondaryBorderColor || '#ffffff',
    });
  }
  return out;
}

export function buildButtonStyle(btn) {
  const v = btn.variant || 'filled';
  const bg = (btn.bgColor != null && String(btn.bgColor).trim()) || '';
  const fg = (btn.textColor != null && String(btn.textColor).trim()) || '';
  const br = (btn.borderColor != null && String(btn.borderColor).trim()) || '';

  if (v === 'ghost') {
    return {
      background: 'transparent',
      color: fg || 'inherit',
      border: 'none',
      boxShadow: 'none',
    };
  }
  if (v === 'outline') {
    const line = br || fg || '#ffffff';
    return {
      background: bg || 'transparent',
      color: fg || '#ffffff',
      border: `2px solid ${line}`,
      boxShadow: 'none',
    };
  }
  return {
    background: bg || '#ffcd07',
    color: fg || '#1a1a1a',
    border: br ? `2px solid ${br}` : 'none',
  };
}

export function ObservatorioCtaButtonRow({
  data,
  classNamePrefix = 'observatorio-hero',
}) {
  const layout = resolveButtonLayout(data);
  const buttons = normalizeHeroButtons(layout);
  const {
    buttonsAlign = 'left',
    buttonSize = 'md',
    buttonRadius = 'pill',
    buttonGap = 'normal',
  } = layout;

  if (!buttons.length) return null;

  const rowClass = cx(
    `${classNamePrefix}-actions`,
    `${classNamePrefix}-actions--${buttonsAlign}`,
    `${classNamePrefix}-actions--gap-${buttonGap}`,
  );

  return (
    <div className={rowClass}>
      {buttons.map((btn, i) => (
        <CtaLink
          key={`${String(btn.href)}-${i}`}
          href={btn.href}
          className={cx(
            `${classNamePrefix}-btn`,
            `${classNamePrefix}-btn--${btn.variant || 'filled'}`,
            `${classNamePrefix}-btn--size-${buttonSize}`,
            `${classNamePrefix}-btn--radius-${buttonRadius}`,
          )}
          style={buildButtonStyle(btn)}
        >
          {btn.label}
        </CtaLink>
      ))}
    </div>
  );
}

ObservatorioCtaButtonRow.propTypes = {
  data: PropTypes.object,
  classNamePrefix: PropTypes.string,
};
