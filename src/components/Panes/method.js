import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import {Button, Intent} from '@blueprintjs/core';
import Operation from '../Content/operation/operation';

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

const Method = observer(
  ({relativeJsonPath, operation, methodName, onAddOperation}) => {
    return operation ? (
      <Operation
        operation={operation}
        relativeJsonPath={relativeJsonPath}
        onChange={() => {}}
      />
    ) : (
      <AddOperation method={methodName} onAdd={onAddOperation} />
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
