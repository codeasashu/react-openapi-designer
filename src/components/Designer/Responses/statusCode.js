import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {ButtonGroup, Button, Icon} from '@blueprintjs/core';
import StatusCodePicker from '../../Pickers/StatusCode';

const StatusCode = ({statuses, onSelect, onAdd, onDelete}) => {
  const firstCode = statuses.map((e) => parseInt(e))[0];
  const [addCode, setAddCode] = useState(false);
  const [selectedCode, setSelectedCode] = useState(firstCode || null);

  const handleCodeSelect = (code) => {
    setSelectedCode(code);
    if (statuses.indexOf(code) >= 0) {
      onSelect(code);
    } else {
      onAdd(code);
    }
  };

  return (
    <div className="flex items-center">
      <ButtonGroup className="flex-1 flex-no-wrap overflow-x-auto pb-4 -mb-4">
        <Button icon="plus" text="Response" onClick={() => setAddCode(true)} />
        {statuses.map((code) => {
          return (
            <Button
              key={code}
              active={code === selectedCode}
              icon={<Icon icon="full-circle" color="green" iconSize={10} />}
              text={code}
              onClick={() => handleCodeSelect(code)}
            />
          );
        })}
      </ButtonGroup>
      <div className="ml-3">
        <StatusCodePicker
          addCode={addCode}
          selectedItem={selectedCode}
          onOpen={() => setAddCode(false)}
          onSelect={(e) => handleCodeSelect(e)}
          onDelete={(e) => {
            onDelete(e);
            handleCodeSelect(firstCode);
          }}
        />
      </div>
    </div>
  );
};

StatusCode.propTypes = {
  statuses: PropTypes.array,
  onSelect: PropTypes.func,
};

export default StatusCode;
