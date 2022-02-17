import React from 'react';
import PropTypes from 'prop-types';
import {
  clone,
  includes,
  pull,
  keys,
  values,
  isEmpty,
  get,
  intersection,
  uniq,
  compact,
} from 'lodash';
import {
  FormGroup,
  Switch,
  HTMLSelect,
  InputGroup,
  TagInput,
} from '@blueprintjs/core';
import classNames from 'classnames';
import {
  isInside,
  isTypesInsideTypes,
  validCombinerTypes,
} from '../../../../utils/schema';
import SuggestionSelector from './Suggestions';

const isChecked = (name, value) => {
  return name === 'additionalProperties'
    ? value === undefined || value !== false
    : !!value;
};

const Selector = (e) => {
  const {
    propKey,
    type,
    subtype,
    props,
    isArrayChild,
    handleUpdateProp,
    validations,
    commonValidationName,
  } = e;

  const _type = clone(type);

  if (
    isTypesInsideTypes(validCombinerTypes, type) ||
    (isInside('null', type) && type.length === 1)
  ) {
    return null;
  }

  if (includes(_type, 'number')) {
    pull(_type, 'integer');
  }

  const validationRows = [];

  for (let property in validations) {
    if (isEmpty(validations[property])) {
      continue;
    }

    const validationRow = [];

    for (let validators of validations[property]) {
      const validationRowElements = validators.map((validator, index) => {
        const validationName = keys(validator)[0];
        const validatorElement = values(validator)[0];

        const elemProps = validatorElement.elemProps;
        const elemData = validatorElement.elemData || {};
        let validationRowElement;
        const value = get(props, validationName);

        switch (validatorElement.elemType) {
          case 'checkbox':
            validationRowElement = (
              <Switch
                {...elemProps}
                data-testid={`${propKey}-${validationName}`}
                id={`${propKey}-${validationName}`}
                defaultChecked={isChecked(validationName, value)}
                onChange={(e) => {
                  handleUpdateProp(
                    propKey,
                    validationName,
                    e.currentTarget.checked,
                  );
                }}
              />
            );

            break;
          case 'text':
            validationRowElement = (
              <InputGroup
                {...elemProps}
                data-testid={`${propKey}-${validationName}`}
                value={value !== undefined ? value : ''}
                onChange={(e) => {
                  const _value =
                    ['example', 'default'].includes(validationName) &&
                    intersection(type, ['number', 'integer']).length > 0 &&
                    !Number.isNaN(Number(e.target.value)) &&
                    !e.target.value.endsWith('.')
                      ? Number(e.target.value)
                      : e.target.value;
                  handleUpdateProp(propKey, validationName, _value);
                }}
              />
            );
            break;
          case 'tag':
            validationRowElement = (
              <TagInput
                {...elemProps}
                values={Array.isArray(value) ? value.map(String) : []}
                inputProps={{
                  'data-testid': `${propKey}-${validationName}`,
                }}
                onChange={(e) => {
                  handleUpdateProp(
                    propKey,
                    validationName,
                    intersection(type, ['number', 'integer']).length > 0
                      ? e.map((e) => (Number.isNaN(Number(e)) ? e : Number(e)))
                      : e,
                  );
                }}
              />
            );
            break;
          case 'select': {
            const {validations = {}, noEmptyOption} = elemData;

            let clonedType = clone(type);

            if (includes(clonedType, 'array') && typeof subtype == 'string') {
              clonedType = clonedType.concat(subtype);
            }

            let options = noEmptyOption ? [] : ['none'];

            for (const _type of clonedType) {
              options = options.concat(
                (
                  (validations == null ? undefined : validations[_type]) || []
                ).map((e) => e.value),
              );
            }

            validationRowElement = (
              <HTMLSelect
                {...elemProps}
                fill
                options={uniq(compact(options))}
                data-testid={`${propKey}-${validationName}`}
                value={value !== 'none' ? value : 'none'}
                onChange={(e) => {
                  const val = e.target.value;
                  handleUpdateProp(
                    propKey,
                    validationName,
                    val && val !== 'none' ? val : '',
                  );
                }}
              />
            );

            break;
          }
          case 'suggestSelect': {
            const {validations = {}, noEmptyOption} = elemData;

            let clonedType = clone(type);

            if (includes(clonedType, 'array') && typeof subtype == 'string') {
              clonedType = clonedType.concat(subtype);
            }

            let options = noEmptyOption ? [] : ['none'];

            for (const _type of clonedType) {
              options = options.concat(
                (
                  (validations == null ? undefined : validations[_type]) || []
                ).map((e) => e.value),
              );
            }

            validationRowElement = (
              <SuggestionSelector
                data-testid={`${propKey}-${validationName}`}
                items={uniq(compact(options))}
                selectedItem={value && value !== 'none' ? value : 'none'}
                onItemSelect={(e) => {
                  handleUpdateProp(
                    propKey,
                    validationName,
                    e && e !== 'none' ? e : '',
                  );
                }}
                allowCreate={true}
              />
            );

            break;
          }
        }

        return (
          <FormGroup
            key={index}
            inline={validatorElement.inline}
            className={classNames(
              'mb-0',
              validatorElement.elemType !== 'checkbox' && 'flex-1',
              index && 'ml-3',
            )}
            label={
              <div className="text-sm font-normal">
                {validatorElement.label || validationName}
              </div>
            }
            contentClassName="text-center">
            {validationRowElement}
          </FormGroup>
        );
      });

      if (validationRowElements.length) {
        validationRow.push(
          <div className="flex pb-2">{validationRowElements}</div>,
        );
      }
    }

    if (validationRow.length) {
      const properties = Object.keys(validations);
      validationRows.push(
        <div
          key={property}
          className={classNames(
            property !== properties[properties.length - 1] && 'pb-6',
          )}>
          <div className="uppercase font-semibold pb-3">
            {isArrayChild
              ? `Subtype ${property === 'common' ? '' : property} properties`
              : property === 'common'
              ? commonValidationName
                ? commonValidationName + ' properties'
                : 'other properties'
              : property + ' properties'}
          </div>
          {validationRow}
        </div>,
      );
    }
  }

  return (
    <div
      className="text-sm overflow-auto p-1"
      style={{
        width: 360,
        maxHeight: 500,
      }}>
      {validationRows.length ? validationRows : 'No validations for this type'}
    </div>
  );
};

Selector.propTypes = {
  propKey: PropTypes.any,
  subtype: PropTypes.any,
  props: PropTypes.any,
  isArrayChild: PropTypes.bool,
  handleUpdateProp: PropTypes.func,
  commonValidationName: PropTypes.string,
  type: PropTypes.any,
  validations: PropTypes.any,
  onChange: PropTypes.func,
};

export default Selector;
