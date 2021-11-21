import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {Button, Intent} from '@blueprintjs/core';
import Operation from '../Content/operation/operation';

const Method = observer(
  ({relativeJsonPath, operation, methodName, onAddOperation}) => {
    return (
      <div className="relative" role={`operation-${methodName.toLowerCase()}`}>
        {operation ? (
          <Operation
            operation={operation}
            relativeJsonPath={relativeJsonPath}
            onChange={() => {}}
          />
        ) : (
          <div className="pt-24 text-center">
            <Button
              large
              intent={Intent.PRIMARY}
              icon="plus"
              onClick={onAddOperation}
              text={`${methodName.toUpperCase()} Operation`}
            />
          </div>
        )}
      </div>
    );
  },
);

Method.propTypes = {
  relativeJsonPath: PropTypes.array,
  methodName: PropTypes.string,
  operation: PropTypes.object,
  onAddOperation: PropTypes.func,
};

export default Method;
