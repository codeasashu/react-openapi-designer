import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {Switch} from '@blueprintjs/core';
import {MarkdownEditor as Markdown} from '../../Editor';
import {
  getValueFromStore,
  usePatchOperation,
  usePatchOperationAt,
} from '../../../utils/selectors';
import {nodeOperations} from '../../../datasets/tree';

const Description = observer(({relativeJsonPath}) => {
  const handlePatch = usePatchOperation();
  const handleDeprecated = usePatchOperationAt(
    relativeJsonPath.concat(['deprecated']),
  );
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div>
          <div className="text-xs uppercase p-2">Operation ID</div>
          <div
            className="px-2 py-1 font-medium bg-transparent hover:bg-darken-2 focus:bg-darken-2 rounded-lg text-sm mb-8"
            data-testid="operation-id">
            {getValueFromStore([...relativeJsonPath, 'operationId'])}
          </div>
        </div>
        <div className="flex items-baseline">
          <div className="text-xs uppercase">Deprecated</div>
          <Switch
            className="ml-2 py-1"
            checked={Boolean(
              getValueFromStore([...relativeJsonPath, 'deprecated']),
            )}
            onChange={(e) => {
              if (e.target.checked) {
                handleDeprecated(nodeOperations.Replace, e.target.checked);
              } else {
                handleDeprecated(nodeOperations.Remove, e.target.checked);
              }
            }}
          />
        </div>
      </div>
      <div className="text-xs uppercase px-2 pt-2">Description</div>
      <Markdown
        placeholder="Endpoint description..."
        value={
          getValueFromStore(relativeJsonPath.concat(['description'])) || ''
        }
        onChange={(e) => {
          handlePatch(
            nodeOperations.Replace,
            relativeJsonPath.concat(['description']),
            e,
          );
        }}
      />
    </div>
  );
});

Description.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default Description;
