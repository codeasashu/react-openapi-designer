// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {ControlGroup, HTMLSelect, ButtonGroup, Button} from '@blueprintjs/core';
import {Popover2, Tooltip2} from '@blueprintjs/popover2';
import {
  getValueFromStore,
  usePatchOperation,
  usePatchOperationAt,
} from '../../../utils/selectors';
import {nodeOperations} from '../../../datasets/tree';
import LocaleProvider from '../../../utils/locale';
import AdvancedProperties from '../../Pickers/advanced-properties';
import {isEmpty} from 'lodash';
import StoreInput from '../../Common/StoreInput';

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
    const handleAdvancedSchema = React.useCallback(
      (schema) => {
        if (!schema || isEmpty(schema)) {
          //handleUpdate(nodeOperations.Remove, schema);
          handleUpdate(
            nodeOperations.Replace,
            parameterPath.concat(['schema']),
            parameterValue.schema.type,
          );
        } else {
          handleUpdate(
            nodeOperations.Replace,
            parameterPath.concat(['schema']),
            schema,
          );
        }
      },
      [handleUpdate],
    );
    return (
      <ControlGroup className={className} role="listitem">
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
          <Popover2
            content={
              <AdvancedProperties
                data={JSON.stringify(parameterValue?.schema, null, 2)}
                onChange={(schema) => {
                  handleAdvancedSchema(schema);
                }}
              />
            }
            placement="right">
            <Tooltip2 content={<span>{LocaleProvider('adv_setting')}</span>}>
              <Button icon="property" title="advanced properties" />
            </Tooltip2>
          </Popover2>
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
