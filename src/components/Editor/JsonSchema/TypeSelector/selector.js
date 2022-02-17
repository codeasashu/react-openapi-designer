import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {InputGroup} from '@blueprintjs/core';
import {intersection, difference, flattenDeep, compact, pull} from 'lodash';
import {
  isInside,
  validCombinerTypes,
  validTypes,
} from '../../../../utils/schema';

const hs = {
  text: {
    object: 'text-blue-600 dark:text-blue-400',
    any: 'text-blue-500',
    array: 'text-green-600 dark:text-green-400',
    allOf: 'text-orange-500',
    oneOf: 'text-orange-500',
    anyOf: 'text-orange-500',
    null: 'text-orange-500',
    integer: 'text-red-700 dark:text-red-600',
    number: 'text-red-700 dark:text-red-600',
    boolean: 'text-red-400',
    binary: 'text-green-400',
    string: 'text-green-700 dark:text-green-500',
    $ref: 'text-purple-600 dark:text-purple-400',
  },

  bg: {
    object: 'bg-blue-600',
    any: 'bg-blue-500',
    array: 'bg-green-600',
    allOf: 'bg-green-500',
    oneOf: 'bg-green-500',
    anyOf: 'bg-green-500',
    null: 'bg-green-500',
    integer: 'bg-red-700',
    number: 'bg-red-700',
    boolean: 'bg-red-400',
    binary: 'bg-green-400',
    string: 'bg-green-700',
    $ref: 'bg-purple-600',
  },
};

const cleanData = (
  callback,
  {type, subtype, ref, extraProps, subtypeExtraProps},
) => {
  let _type = compact(flattenDeep([type]));
  let _subtype = compact(flattenDeep([subtype]));

  if (_type.length === 0) {
    _type = null;
  } else {
    if (_type.length === 1) {
      _type = _type[0];
    }
  }

  if (_subtype.length === 0) {
    _subtype = null;
  } else {
    if (_subtype.length === 1) {
      _subtype = _subtype[0];
    }
  }

  let _ref = ref;

  if (!(isInside('$ref', type) || isInside('$ref', subtype))) {
    _ref = null;
  }

  callback(_type, _subtype, _ref, extraProps, subtypeExtraProps);
};

const TypeList = ({
  whitelistTypes,
  sectionName,
  type,
  types,
  clickHandler,
  className: a,
  ...props
}) => {
  const typeItems = [];
  let initialTypes = types;

  if (
    whitelistTypes &&
    ((initialTypes = intersection(types, whitelistTypes)),
    sectionName === 'isInTypeGroup')
  ) {
    const blacklistTypes = difference(whitelistTypes, validTypes);
    initialTypes = initialTypes.concat(blacklistTypes);
  }

  if (!initialTypes.length) {
    return null;
  }

  for (const initialType of initialTypes) {
    const isSelected =
      isInside(initialType, type) ||
      (initialType === 'none' && type.length === 0);

    typeItems.push(
      <div
        className={classnames(
          'flex items-center justify-center mr-2 px-2 py-1 rounded cursor-pointer',
          isSelected && hs.bg[initialType]
            ? hs.bg[initialType] + ' text-white'
            : 'hover:bg-darken-3',
        )}
        key={'t-' + initialType}
        role="checkbox"
        aria-checked={isSelected}
        onClick={() => {
          clickHandler(initialType === 'none' ? null : initialType);
        }}>
        {initialType}
      </div>,
    );
  }

  return (
    <div className={classnames(a, 'flex flex-wrap')} {...props}>
      {sectionName && (
        <div className="w-full uppercase font-semibold mb-2">{sectionName}</div>
      )}
      <div className="flex flex-wrap">{typeItems}</div>
    </div>
  );
};

TypeList.propTypes = {
  whitelistTypes: PropTypes.array,
  sectionName: PropTypes.string,
  type: PropTypes.array,
  types: PropTypes.array,
  clickHandler: PropTypes.func,
  className: PropTypes.string,
};

const Selector = ({
  id,
  refSelector,
  whitelistTypes,
  type,
  subtype,
  refPath,
  extraProps,
  subtypeExtraProps,
  handleSave,
}) => {
  const noCombinerTypes = difference(validTypes, validCombinerTypes);
  let subtypes;
  let reference;

  if (isInside('array', type)) {
    subtypes = (
      <TypeList
        data-testid="property-type-selector-subtype-section"
        className="mt-4"
        sectionName="SUBTYPE"
        whitelistTypes={whitelistTypes}
        type={subtype}
        types={['none'].concat(validTypes)}
        clickHandler={(event) => {
          let _subtype = [];

          if (event) {
            if (!isInside(event, validCombinerTypes)) {
              _subtype = difference(subtype, validCombinerTypes);
            }

            if (event === '$ref') {
              _subtype = ['$ref'];
            } else {
              pull(_subtype, '$ref');

              if (isInside(event, _subtype)) {
                pull(_subtype, event);
              } else {
                _subtype.push(event);
              }
            }
          }

          cleanData(handleSave, {
            type,
            subtype: _subtype,
            extraProps,
            subtypeExtraProps,
          });
        }}
      />
    );
  }

  if (isInside('$ref', type) || isInside('$ref', subtype)) {
    const refSelected =
      refSelector == null
        ? undefined
        : refSelector({
            id,
            refPath,

            onChange: (e) => {
              cleanData(handleSave, {
                type,
                subtype,
                ref: e,
                extraProps,
                subtypeExtraProps,
              });
            },
          });

    reference = refSelected ? (
      refSelected
    ) : (
      <InputGroup
        data-testid="property-type-selector-reference-section"
        className="text-sm w-full"
        value={refPath}
        onChange={(e) => {
          cleanData(handleSave, {
            type,
            subtype,
            ref: String(e.target.value),
            extraProps,
            subtypeExtraProps,
          });
        }}
      />
    );
  }

  const combinerTypes = (
    <TypeList
      data-testid="property-type-selector-combine-section"
      whitelistTypes={whitelistTypes}
      sectionName={'TYPE'}
      type={type}
      types={validCombinerTypes}
      clickHandler={(e) => {
        cleanData(handleSave, {
          type: e,
          subtype: [],
          extraProps,
          subtypeExtraProps,
        });
      }}
    />
  );

  const basicTypes = (
    <TypeList
      data-testid="property-type-selector-basic-section"
      className="mt-2"
      whitelistTypes={whitelistTypes}
      type={type}
      types={noCombinerTypes}
      clickHandler={(e) => {
        let _type = difference(type, validCombinerTypes);

        if (e) {
          if (e === '$ref') {
            _type = ['$ref'];
          } else {
            pull(_type, '$ref');

            if (isInside(e, type)) {
              pull(_type, e);
            } else {
              _type.push(e);
            }
          }
        } else {
          _type = [];
        }

        let _subtype = subtype;

        if (!isInside('array', _type)) {
          _subtype = [];
        }

        if (e === 'array') {
          pull(_type, 'object');
        } else {
          if (e === 'object') {
            pull(_type, 'array');
          }
        }

        cleanData(handleSave, {
          type: _type,
          subtype: _subtype,
          extraProps,
          subtypeExtraProps,
        });
      }}
    />
  );

  return (
    <div className="flex flex-col text-sm p-3">
      {combinerTypes}
      {basicTypes}
      {subtypes}
      {reference}
    </div>
  );
};

Selector.propTypes = {
  id: PropTypes.string,
  refSelector: PropTypes.func,
  whitelistTypes: PropTypes.array,
  type: PropTypes.array,
  subtype: PropTypes.array,
  refPath: PropTypes.string,
  extraProps: PropTypes.object,
  subtypeExtraProps: PropTypes.object,
  handleSave: PropTypes.func,
};

export default Selector;
