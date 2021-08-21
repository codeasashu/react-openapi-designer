import React from 'react';
import PropTypes from 'prop-types';
import {Button, ButtonGroup} from '@blueprintjs/core';

const Options = (props) => {
  return (
    <div className="border-b border-transparent PanelActionBar w-full flex items-center px-5 py-2">
      <div className="flex items-center">
        <Button small icon="trash" text="delete" />
      </div>
      <div className="flex-1" />
      <div>
        <ButtonGroup>
          <Button small text="Form" onClick={props.onToggleView} />
          <Button small text="Code" onClick={props.onToggleView} />
        </ButtonGroup>
      </div>
      <div className="ml-3">
        <Button small text="Preview" icon="eye-on" />
      </div>
    </div>
  );
};

Options.propTypes = {
  onToggleView: PropTypes.func,
};

export default Options;
