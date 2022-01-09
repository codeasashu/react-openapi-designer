// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {ControlGroup, HTMLSelect, Button} from '@blueprintjs/core';
import {
  getValueFromStore,
  usePatchOperation,
  usePatchOperationAt,
} from '../../../utils/selectors';
import {nodeOperations} from '../../../datasets/tree';

const Security = observer(({relativeJsonPath}) => {
  const globalSecurities = getValueFromStore(['components', 'securitySchemes']);
  const handleUpdate = usePatchOperation();
  const security = getValueFromStore(relativeJsonPath);
  const handleChange = usePatchOperationAt(relativeJsonPath);
  const options = Object.keys(globalSecurities);

  return (
    <ControlGroup className="mt-3">
      <HTMLSelect
        className="flex-shrink"
        aria-label="schema"
        value={Object.keys(security)[0]}
        options={options}
        onChange={(e) => {
          const val = e.target.value;
          handleChange(val ? nodeOperations.Replace : nodeOperations.Remove, {
            [val]: [],
          });
        }}
      />
      <Button
        onClick={() => {
          handleUpdate(nodeOperations.Remove, relativeJsonPath);
        }}
        aria-label="delete"
        icon="trash"
      />
    </ControlGroup>
  );
});

Security.propTypes = {
  relativeJsonPath: PropTypes.array,
};

export default Security;
