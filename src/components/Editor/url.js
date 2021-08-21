import React from 'react';
import PropTypes from 'prop-types';
import {ControlGroup, Button, InputGroup} from '@blueprintjs/core';

const Url = (props) => {
  return (
    <ControlGroup className="flex">
      <Button text="http://localhost" />
      <InputGroup
        className="flex-1"
        value={props.value}
        onChange={props.onChange}
      />
      <Button text="path params" />
    </ControlGroup>
  );
};

Url.propTypes = {
  value: PropTypes.any,
  placeholder: PropTypes.any,
  onChange: PropTypes.func,
};

export default Url;
