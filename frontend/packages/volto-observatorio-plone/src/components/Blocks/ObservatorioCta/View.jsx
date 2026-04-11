import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';

import { ObservatorioCtaButtonRow } from './ctaShared.jsx';

const ObservatorioCtaView = ({ data, className, style }) => {
  return (
    <div
      className={cx('observatorio-cta', className)}
      style={style}
      aria-label="Botões"
    >
      <div className="observatorio-cta-inner">
        <ObservatorioCtaButtonRow
          data={data}
          classNamePrefix="observatorio-hero"
        />
      </div>
    </div>
  );
};

ObservatorioCtaView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default withBlockExtensions(ObservatorioCtaView);
