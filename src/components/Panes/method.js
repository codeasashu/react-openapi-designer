import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Button, Intent} from '@blueprintjs/core';
import {TitleEditor as Title, MarkdownEditor as Markdown} from '../Editor';
import RequestBody from '../Designer/RequestBody';
import Responses from '../Designer/Responses';
import ParameterGroup from '../Designer/ParameterGroup';

const AddOperation = ({method, onAdd}) => {
  return (
    <div className="pt-24 text-center">
      <Button
        large
        intent={Intent.PRIMARY}
        icon="plus"
        onClick={onAdd}
        text={`${method.toUpperCase()} Operation`}
      />
    </div>
  );
};

AddOperation.propTypes = {
  method: PropTypes.string,
  onAdd: PropTypes.func,
};

const Operation = ({operation, onChange}) => {
  return (
    <div className="relative">
      <div className="w-full p-10 pb-16 max-w-6xl">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <div>
              <div className="uppercase p-2" style={{fontSize: '9px'}}>
                Operation ID
              </div>
              <Title
                small
                value={operation['operationId']}
                onChange={(e) => onChange({title: e})}
              />
            </div>
            <div className="flex items-baseline">
              <div className="text-xs uppercase">Deprecated</div>
              <Switch
                checked={false}
                onChange={() => {}}
                className="ml-2 py-1"
              />
            </div>
          </div>
          <div className="uppercase px-2 pt-2" style={{fontSize: '9px'}}>
            Description
          </div>
          <div className="flex-1">
            <Markdown
              className="CodeEditor mb-8 relative hover:bg-darken-2 rounded-lg"
              placeholder="Description...."
              value={operation['description'] || ''}
              onChange={(e) => onChange({description: e})}
            />
          </div>
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <ParameterGroup
            parameters={operation.parameters || []}
            onChange={(parameters) => onChange({parameters})}
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <RequestBody
            requestBody={operation.requestBody || {}}
            onChange={(requestBody) => onChange({requestBody})}
          />
          <div className="my-8 -mx-1 border-t dark:border-darken-4" />
          <Responses
            responses={operation.responses}
            onChange={(responseBody) =>
              onChange({
                responses: {...operation.responses, ...responseBody},
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

Operation.propTypes = {
  operation: PropTypes.object,
  onChange: PropTypes.func,
};

const Method = ({operation, methodName, onAddOperation, onChange}) => {
  return operation ? (
    <Operation operation={operation} onChange={onChange} />
  ) : (
    <AddOperation method={methodName} onAdd={onAddOperation} />
  );
};

Method.propTypes = {
  methodName: PropTypes.string,
  operation: PropTypes.object,
  onChange: PropTypes.func,
  onAddOperation: PropTypes.func,
};

export default Method;
