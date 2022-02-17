// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {ControlGroup, HTMLSelect, ButtonGroup, Button} from '@blueprintjs/core';
import {Tooltip2} from '@blueprintjs/popover2';
import {
  getValueFromStore,
  usePatchOperation,
  usePatchOperationAt,
} from '../../../utils/selectors';
import {nodeOperations} from '../../../datasets/tree';
import LocaleProvider from '../../../utils/locale';
import {isEmpty, isObjectLike} from 'lodash';
import StoreInput from '../../Common/StoreInput';
import OtherProperties from '../../Editor/JsonSchema/OtherProperties/parameters';

const Parameter = observer(
  ({
    nameInPath,
    className,
    parameterPath,
    typePath,
    extraOptions = [],
    autoFocus,
    disableRequired,
    handleRemove,
    handleUpdateName,
    dataTestid,
  }) => {
    const schemaOptions = [
      {
        label: 'any',
        value: '',
      },
      {
        value: 'string',
      },
      {
        value: 'number',
      },
      {
        value: 'integer',
      },
      {
        value: 'boolean',
      },
      {
        value: 'array',
      },
      ...extraOptions,
    ];

    const handleUpdate = usePatchOperation();
    const parameterValue = getValueFromStore(parameterPath);
    const schema = getValueFromStore(typePath);
    const handleSelect = usePatchOperationAt(typePath);
    const handleRequired = usePatchOperationAt(
      parameterPath.concat(['required']),
    );
    const handleAdvancedSchema =
      (basepath) => (propKey, validationName, value) => {
        if (!value || (isObjectLike(value) && isEmpty(value))) {
          handleUpdate(nodeOperations.Remove, basepath.concat(validationName));
        } else {
          handleUpdate(
            nodeOperations.Replace,
            basepath.concat(validationName),
            value,
          );
        }
      };

    return (
      <ControlGroup
        className={className}
        role="listitem"
        data-testid={dataTestid}>
        {nameInPath ? (
          <StoreInput
            valueInPath={true}
            jsonOp={nodeOperations.Move}
            className="flex-auto"
            autoFocus={autoFocus}
            aria-label="name"
            relativeJsonPath={
              nameInPath ? parameterPath : parameterPath.concat(['name'])
            }
            placeholder="Name..."
            handleUpdate={handleUpdateName}
          />
        ) : (
          <StoreInput
            className="flex-auto"
            aria-label="name"
            autoFocus={autoFocus}
            relativeJsonPath={
              nameInPath ? parameterPath : parameterPath.concat(['name'])
            }
            placeholder="Name..."
            handleUpdate={handleUpdateName}
          />
        )}
        <HTMLSelect
          className="flex-shrink"
          aria-label="schema"
          value={schema}
          options={schemaOptions}
          onChange={(e) => {
            const val = e.target.value;
            handleSelect(
              val ? nodeOperations.Replace : nodeOperations.Remove,
              val,
            );
          }}
        />
        <StoreInput
          className="flex-auto"
          autoFocus={autoFocus}
          relativeJsonPath={parameterPath.concat(['description'])}
          placeholder="Description..."
        />
        <ButtonGroup>
          <Tooltip2
            disabled={disableRequired || false}
            content={LocaleProvider('required')}>
            <Button
              disabled={disableRequired || false}
              icon="issue"
              title="required"
              active={parameterValue.required}
              intent={parameterValue.required ? 'warning' : undefined}
              onClick={() => {
                if (parameterValue.required) {
                  handleRequired(nodeOperations.Remove);
                } else {
                  handleRequired(nodeOperations.Replace, true);
                }
              }}
            />
          </Tooltip2>
          <OtherProperties
            relativeJsonPath={parameterPath}
            handleUpdate={handleAdvancedSchema}
            spec="oas_3.1"
          />
          <Tooltip2 content="Delete field">
            <Button
              onClick={() => {
                if (handleRemove) {
                  handleRemove(parameterPath);
                } else {
                  handleUpdate(nodeOperations.Remove, parameterPath);
                }
              }}
              aria-label="delete"
              icon="trash"
            />
          </Tooltip2>
        </ButtonGroup>
      </ControlGroup>
    );
  },
);

Parameter.propTypes = {
  className: PropTypes.any,
  parameterPath: PropTypes.array,
  typePath: PropTypes.array,
  extraOptions: PropTypes.array,
  autoFocus: PropTypes.bool,
  disableRequired: PropTypes.bool,
  handleRemove: PropTypes.func,
  handleUpdateName: PropTypes.func,
  nameInPath: PropTypes.bool,
};

export default Parameter;
