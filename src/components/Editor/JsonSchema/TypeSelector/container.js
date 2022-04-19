import React from 'react';
import {isArray, isString} from 'lodash';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Popover2} from '@blueprintjs/popover2';
import Selector from './selector';

const hs = {
  text: {
    object: 'text-blue-6 dark:text-blue-4',
    any: 'text-blue-5',
    array: 'text-green-6 dark:text-green-4',
    allOf: 'text-orange-5',
    oneOf: 'text-orange-5',
    anyOf: 'text-orange-5',
    null: 'text-orange-5',
    integer: 'text-red-7 dark:text-red-6',
    number: 'text-red-7 dark:text-red-6',
    boolean: 'text-red-4',
    binary: 'text-green-4',
    string: 'text-green-7 dark:text-green-5',
    $ref: 'text-purple-6 dark:text-purple-4',
  },

  bg: {
    object: 'bg-blue-6',
    any: 'bg-blue-5',
    array: 'bg-green-6',
    allOf: 'bg-orange-5',
    oneOf: 'bg-orange-5',
    anyOf: 'bg-orange-5',
    null: 'bg-orange-5',
    integer: 'bg-red-7',
    number: 'bg-red-7',
    boolean: 'bg-red-4',
    binary: 'bg-green-4',
    string: 'bg-green-7',
    $ref: 'bg-purple-6',
  },
};

const Ref = (props) => {
  const store = props.store;
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = (state) => {
    if (!store.refLoading) {
      setIsOpen(state);
    }
  };

  const {
    id,
    type: a,
    refSelector,
    handleSaveDetails,
    rowState,
    whitelistTypes,
    isCombinerChild,
    level,
    rootName,
    getRefLabel,
    onRefClick,
    shouldRenderGoToRef,
  } = props;

  if (level === 0 && rootName) {
    return null;
  }
  const {type, subtype, refPath, extraProps, subtypeExtraProps} = rowState;

  const _types = (isArray(a) ? a : [a]).filter(isString);
  let refLink;
  let types = [];

  for (const index in _types) {
    if (!Object.prototype.hasOwnProperty.call(_types, index)) {
      continue;
    }

    let _type = _types[index];
    let _subtype = (subtype !== _type && subtype) || '';
    let ref = '';
    const refLabel = getRefLabel ? getRefLabel(refPath) : refPath;

    if (!_type) {
      _type = 'any';
    }

    if (refLabel && _type === '$ref') {
      ref = ` [${refLabel}]`;

      if (
        !(!onRefClick || (shouldRenderGoToRef && !shouldRenderGoToRef(refPath)))
      ) {
        refLink = (
          <a
            role="button"
            data-test="go-to-ref-btn"
            className="text-blue-4 ml-2 whitespace-no-wrap"
            onClick={onRefClick}>
            (go to ref)
          </a>
        );
      }
    }

    if (_type === 'array') {
      if (refPath) {
        _subtype = `[$ref( ${refLabel} )]`;

        if (
          !(
            !onRefClick ||
            (shouldRenderGoToRef && !shouldRenderGoToRef(refPath))
          )
        ) {
          refLink = (
            <a
              role="button"
              data-test="go-to-ref-btn"
              className="text-blue-4 ml-2 whitespace-no-wrap"
              onClick={onRefClick}>
              (go to ref)
            </a>
          );
        }
      } else {
        if (_subtype) {
          _subtype = `[${_subtype}${refLabel || ''}]`;
        }
      }

      ref = '';
    } else {
      _subtype = '';
    }

    types.push(
      <div
        key={types.length}
        className={classnames(
          'flex items-center flex-no-wrap truncate',
          hs.text[_type] && hs.text[_type],
        )}>
        {_type && <div>{_type}</div>}
        {subtype && <div>{subtype}</div>}
        {ref && <div>{ref}</div>}
      </div>,
    );

    if (parseInt(index) + 1 < _types.length) {
      types.push(
        <span
          key={types.length}
          className="mx-2 opacity-75 text-darken-7 dark:text-lighten-9">
          or
        </span>,
      );
    }
  }

  return (
    <div className="flex items-center overflow-hidden">
      {!isCombinerChild && (level > 0 || rootName) && (
        <span className="mr-2">:</span>
      )}
      <Popover2
        interactionKind="click"
        className="TypeSelector"
        content={
          <Selector
            id={id}
            refSelector={refSelector}
            whitelistTypes={whitelistTypes}
            type={type}
            subtype={subtype}
            refPath={refPath}
            extraProps={extraProps}
            subtypeExtraProps={subtypeExtraProps}
            handleSave={handleSaveDetails}
          />
        }
        usePortal={true}>
        <div
          tabIndex={0}
          className="flex items-center cursor-pointer hover:underline truncate">
          {types.length ? types : 'noType'}
        </div>
      </Popover2>
      {refLink}
    </div>
  );
};

Ref.propTypes = {
  isCombinerChild: PropTypes.bool,
  level: PropTypes.number,
  type: PropTypes.any,
  rootName: PropTypes.string,
  rowState: PropTypes.object,
  handleSaveDetails: PropTypes.func,
  refSelector: PropTypes.func,
  whitelistTypes: PropTypes.array,
  id: PropTypes.string,
  name: PropTypes.string,
  store: PropTypes.object,
  getRefLabel: PropTypes.func,
  onRefClick: PropTypes.func,
  shouldRenderGoToRef: PropTypes.func,
};

export default Ref;
