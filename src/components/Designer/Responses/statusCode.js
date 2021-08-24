import React from 'react';
import PropTypes from 'prop-types';
import {ButtonGroup, Button, Icon} from '@blueprintjs/core';
import StatusCodePicker from '../../Pickers/StatusCode';

const StatusCode = ({statuses, onSelect}) => {
  return (
    <div className="flex items-center">
      <ButtonGroup className="flex-1 flex-no-wrap overflow-x-auto pb-4 -mb-4">
        <Button icon="plus" text="Response" />
        {statuses.map((code) => {
          return (
            <Button
              key={code}
              icon={<Icon icon="full-circle" color="green" iconSize={10} />}
              text={code}
              onClick={() => onSelect(code)}
            />
          );
        })}
      </ButtonGroup>
      <div className="ml-3">
        <StatusCodePicker />
      </div>
    </div>
  );
};

StatusCode.propTypes = {
  statuses: PropTypes.array,
  onSelect: PropTypes.func,
};

export default StatusCode;
