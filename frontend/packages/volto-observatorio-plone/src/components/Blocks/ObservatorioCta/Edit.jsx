import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';

import { withBlockExtensions } from '@plone/volto/helpers/Extensions';

import ObservatorioCtaSchema from './schema';
import View from './View';

const Edit = (props) => {
  const intl = useIntl();
  const {
    data,
    block,
    onChangeBlock,
    selected,
    navRoot,
    contentType,
    blocksErrors,
  } = props;

  const schema = useMemo(() => ObservatorioCtaSchema({ intl }), [intl]);

  return (
    <>
      <View {...props} />

      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
          block={block}
          onChangeBlock={onChangeBlock}
          navRoot={navRoot}
          contentType={contentType}
          errors={blocksErrors}
        />
      </SidebarPortal>
    </>
  );
};

Edit.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string.isRequired,
  onChangeBlock: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  navRoot: PropTypes.any,
  contentType: PropTypes.string,
  blocksErrors: PropTypes.any,
};

export default withBlockExtensions(Edit);
