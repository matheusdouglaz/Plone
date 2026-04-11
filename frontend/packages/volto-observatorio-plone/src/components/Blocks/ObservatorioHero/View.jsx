import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';

import { ObservatorioCtaButtonRow } from '../ObservatorioCta/ctaShared.jsx';

function buildBackgroundStyle(data) {
  const mode = data?.backgroundMode || 'theme-default';
  if (mode === 'gradient-custom') {
    const a = data.colorStart || '#1351b4';
    const b = data.colorEnd || '#071d41';
    return { background: `linear-gradient(160deg, ${a} 0%, ${b} 100%)` };
  }
  if (mode === 'solid') {
    return { background: data.solidColor || '#1351b4' };
  }
  if (mode === 'custom-css' && data.customBackground?.trim()) {
    return { background: data.customBackground.trim() };
  }
  return undefined;
}

/** String vazia no JSON não é “nullish”; normaliza para evitar divergência SSR/cliente no estilo. */
function nonEmptyOr(value, fallback) {
  if (value == null) return fallback;
  const s = String(value).trim();
  return s || fallback;
}

/** Conteúdo antigo: um único `textAlign` / `textColor` */
function resolveLegacy(data) {
  const legacyAlign = data?.textAlign;
  const legacyColor = data?.textColor;
  return {
    titleAlign: nonEmptyOr(data?.titleAlign ?? legacyAlign, 'left'),
    bodyAlign: nonEmptyOr(data?.bodyAlign ?? legacyAlign, 'left'),
    buttonsAlign: nonEmptyOr(data?.buttonsAlign ?? legacyAlign, 'left'),
    titleColor: nonEmptyOr(data?.titleColor ?? legacyColor, '#ffffff'),
    descriptionColor: nonEmptyOr(
      data?.descriptionColor ?? legacyColor,
      '#ffffff',
    ),
  };
}

function buildTitleStyle(titleAlign, titleColor) {
  const style = { textAlign: titleAlign };
  const c = titleColor != null && String(titleColor).trim();
  if (c) {
    style.color = c;
  }
  if (titleAlign === 'center') {
    style.marginLeft = 'auto';
    style.marginRight = 'auto';
  } else if (titleAlign === 'right') {
    style.marginLeft = 'auto';
    style.marginRight = 0;
  }
  return style;
}

function buildDescriptionStyle(bodyAlign, descriptionColor) {
  const style = { textAlign: bodyAlign, opacity: 1 };
  const c = descriptionColor != null && String(descriptionColor).trim();
  if (c) {
    style.color = c;
  }
  if (bodyAlign === 'center') {
    style.marginLeft = 'auto';
    style.marginRight = 'auto';
  } else if (bodyAlign === 'right') {
    style.marginLeft = 'auto';
    style.marginRight = 0;
  }
  return style;
}

const ObservatorioHeroView = ({ data, className, style }) => {
  const {
    showHeadline = true,
    headline,
    description,
    titleSize = 'lg',
    bodySize = 'md',
    paddingY = 'normal',
    backgroundMode = 'theme-default',
  } = data || {};

  const legacy = useMemo(() => resolveLegacy(data || {}), [data]);

  const { titleAlign, bodyAlign, titleColor, descriptionColor } = legacy;

  const titleStyle = useMemo(
    () => buildTitleStyle(titleAlign, titleColor),
    [titleAlign, titleColor],
  );

  const descriptionStyle = useMemo(
    () => buildDescriptionStyle(bodyAlign, descriptionColor),
    [bodyAlign, descriptionColor],
  );

  const bgStyle = useMemo(() => buildBackgroundStyle(data), [data]);

  const isThemeDefault = backgroundMode === 'theme-default';

  return (
    <section
      className={cx(
        'observatorio-hero',
        `observatorio-hero--py-${paddingY}`,
        {
          'observatorio-hero--bg-theme': isThemeDefault,
          'observatorio-hero--bg-custom': !isThemeDefault,
        },
        className,
      )}
      style={{ ...style, ...bgStyle }}
      aria-label={headline || 'Banner'}
    >
      <div className="observatorio-hero-inner">
        {showHeadline && headline ? (
          <h2
            className={cx(
              'observatorio-hero-title',
              `observatorio-hero-title--${titleSize}`,
            )}
            style={titleStyle}
          >
            {headline}
          </h2>
        ) : null}

        {description ? (
          <p
            className={cx(
              'observatorio-hero-description',
              `observatorio-hero-description--${bodySize}`,
            )}
            style={descriptionStyle}
          >
            {description}
          </p>
        ) : null}

        <ObservatorioCtaButtonRow
          data={data}
          classNamePrefix="observatorio-hero"
        />
      </div>
    </section>
  );
};

ObservatorioHeroView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default withBlockExtensions(ObservatorioHeroView);
