/**
 * Inclui copiar/colar ao lado da lixeira, reutilizando Redux `blocksClipboard`
 * (o mesmo da barra inferior do editor Volto).
 */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl, defineMessages } from 'react-intl';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import {
  applyBlockDefaults,
  applyBlockInitialValue,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  blockHasValue,
  buildStyleClassNamesFromData,
  buildStyleObjectFromData,
  buildStyleClassNamesExtenders,
} from '@plone/volto/helpers/Blocks/Blocks';
import { cloneBlocks } from '@plone/volto/helpers/Blocks/cloneBlocks';
import {
  setBlocksClipboard,
  resetBlocksClipboard,
} from '@plone/volto/actions/blocksClipboard/blocksClipboard';
import dragSVG from '@plone/volto/icons/drag.svg';
import { Button } from 'semantic-ui-react';
import includes from 'lodash/includes';
import isBoolean from 'lodash/isBoolean';
import cx from 'classnames';
import config from '@plone/volto/registry';
import BlockChooserButton from '@plone/volto/components/manage/BlockChooser/BlockChooserButton';
import { v4 as uuid } from 'uuid';

import trashSVG from '@plone/volto/icons/delete.svg';
import copySVG from '@plone/volto/icons/copy.svg';
import pasteSVG from '@plone/volto/icons/paste.svg';

const messages = defineMessages({
  delete_block: {
    id: 'delete_block',
    defaultMessage: 'delete {type} block',
  },
  drag_block: {
    id: 'drag_block',
    defaultMessage: 'drag {type} block',
  },
  copy_block: {
    id: 'observatorio.block_edit.copy_block',
    defaultMessage: 'Copiar bloco',
  },
  paste_blocks: {
    id: 'observatorio.block_edit.paste_blocks',
    defaultMessage: 'Colar blocos',
  },
});

const EditBlockWrapper = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const blocksClipboard = useSelector((state) => state?.blocksClipboard || {});

  const hideHandler = (data) => {
    return (
      !!data.fixed ||
      (!config.experimental.addBlockButton.enabled &&
        !(blockHasValue(data) && props.blockProps.editable))
    );
  };

  const { blockProps, draginfo, children } = props;
  const {
    allowedBlocks,
    showRestricted,
    block,
    blocksConfig,
    selected,
    type,
    onChangeBlock,
    onDeleteBlock,
    onInsertBlock,
    onSelectBlock,
    onMutateBlock,
    data: originalData,
    editable,
    properties,
    showBlockChooser,
    navRoot,
    contentType,
  } = blockProps;

  const data = applyBlockDefaults({ data: originalData, ...blockProps, intl });

  const visible = selected && !hideHandler(data);

  const required = isBoolean(data.required)
    ? data.required
    : includes(config.blocks.requiredBlocks, type);

  let classNames = buildStyleClassNamesFromData(data.styles);
  classNames = buildStyleClassNamesExtenders({
    block,
    content: properties,
    data,
    classNames,
  });
  const style = buildStyleObjectFromData(data);

  const styleMergedWithDragProps = {
    ...draginfo.draggableProps,
    style: { ...style, ...draginfo.draggableProps.style },
  };

  const hasClipboard =
    Array.isArray(blocksClipboard?.copy) && blocksClipboard.copy.length > 0;
  const hasCut =
    Array.isArray(blocksClipboard?.cut) && blocksClipboard.cut.length > 0;

  const handleCopyBlock = useCallback(() => {
    const blocksFieldname = getBlocksFieldname(properties);
    const blockData = properties?.[blocksFieldname]?.[block];
    if (!blockData?.['@type']) return;
    dispatch(setBlocksClipboard({ copy: [[block, blockData]] }));
  }, [block, dispatch, properties]);

  const handlePasteBlocks = useCallback(
    (e) => {
      const mode = Object.keys(blocksClipboard).includes('cut')
        ? 'cut'
        : 'copy';
      const blocksData = blocksClipboard[mode] || [];
      const cloneWithIds = blocksData
        .filter(([blockId, blockData]) => blockId && !!blockData?.['@type'])
        .map(([blockId, blockData]) => {
          const blockConfig =
            config.blocks.blocksConfig[blockData['@type']] || {};
          return mode === 'copy'
            ? blockConfig.cloneData
              ? blockConfig.cloneData(blockData)
              : [uuid(), cloneBlocks(blockData)]
            : [blockId, blockData];
        })
        .filter((info) => !!info);

      if (cloneWithIds.length === 0) return;

      const blocksFieldname = getBlocksFieldname(properties);
      const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);
      if (!blocksFieldname || !blocksLayoutFieldname) return;

      const selectedIndex =
        properties[blocksLayoutFieldname].items.indexOf(block) + 1;

      const newFormData = {
        ...properties,
        [blocksFieldname]: {
          ...properties[blocksFieldname],
          ...Object.assign(
            {},
            ...cloneWithIds.map(([id, dat]) => ({ [id]: dat })),
          ),
        },
        [blocksLayoutFieldname]: {
          ...properties[blocksLayoutFieldname],
          items: [
            ...properties[blocksLayoutFieldname].items.slice(0, selectedIndex),
            ...cloneWithIds.map(([id]) => id),
            ...properties[blocksLayoutFieldname].items.slice(selectedIndex),
          ],
        },
      };

      if (!(e.ctrlKey || e.metaKey)) {
        dispatch(resetBlocksClipboard());
      }
      blockProps.onChangeFormData(newFormData);
    },
    [block, blockProps, blocksClipboard, dispatch, properties],
  );

  return (
    <div
      ref={draginfo.innerRef}
      {...styleMergedWithDragProps}
      className={cx(`block-editor-${data['@type']}`, classNames, {
        [data.align]: data.align,
      })}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            visibility: visible ? 'visible' : 'hidden',
            display: 'inline-block',
          }}
          {...draginfo.dragHandleProps}
          className="drag handle wrapper"
          aria-label={intl.formatMessage(messages.drag_block, { type })}
        >
          <Icon name={dragSVG} size="18px" />
        </div>
        <div className={`ui drag block inner ${type}`}>
          {children}
          {selected && !required && editable && (
            <div className="obs-block-edit-actions">
              <Button
                type="button"
                icon
                basic
                onClick={handleCopyBlock}
                className="copy-button"
                aria-label={intl.formatMessage(messages.copy_block)}
              >
                <Icon name={copySVG} size="18px" />
              </Button>
              {(hasClipboard || hasCut) && (
                <Button
                  type="button"
                  icon
                  basic
                  onClick={handlePasteBlocks}
                  className="paste-button"
                  aria-label={intl.formatMessage(messages.paste_blocks)}
                >
                  <Icon name={pasteSVG} size="18px" />
                </Button>
              )}
              <Button
                type="button"
                icon
                basic
                onClick={() => onDeleteBlock(block, true)}
                className="delete-button"
                aria-label={intl.formatMessage(messages.delete_block, { type })}
              >
                <Icon name={trashSVG} size="18px" />
              </Button>
            </div>
          )}
          {config.experimental.addBlockButton.enabled && showBlockChooser && (
            <BlockChooserButton
              data={data}
              block={block}
              onInsertBlock={(id, value) => {
                if (blockHasValue(data)) {
                  onSelectBlock(onInsertBlock(id, value));
                } else {
                  const blocksFieldname = getBlocksFieldname(properties);
                  const newFormData = applyBlockInitialValue({
                    id,
                    value,
                    blocksConfig,
                    formData: {
                      ...properties,
                      [blocksFieldname]: {
                        ...properties[blocksFieldname],
                        [id]: value || null,
                      },
                    },
                    intl,
                  });
                  const newValue = newFormData[blocksFieldname][id];
                  onChangeBlock(id, newValue);
                }
              }}
              onMutateBlock={onMutateBlock}
              allowedBlocks={allowedBlocks}
              showRestricted={showRestricted}
              blocksConfig={blocksConfig}
              size="24px"
              properties={properties}
              navRoot={navRoot}
              contentType={contentType}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBlockWrapper;
