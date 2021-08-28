import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  ControlGroup,
  Button,
  InputGroup,
  Icon,
  Intent,
} from '@blueprintjs/core';
import {Tooltip2} from '@blueprintjs/popover2';

const ErrorElement = ({errors}) => {
  return errors && errors.length ? (
    <Tooltip2
      role={'error'}
      content={<span>{errors.join('\n')}</span>}
      intent={Intent.DANGER}>
      <div
        className="mr-2"
        style={{height: '30px', display: 'flex', alignItems: 'center'}}>
        <Icon icon="issue" intent={Intent.DANGER} />
      </div>
    </Tooltip2>
  ) : null;
};

ErrorElement.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
};

const Url = (props) => {
  const [value, setValue] = useState(props.value);

  return (
    <ControlGroup className="flex">
      <Button text="http://localhost" />
      <InputGroup
        className="flex-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => props.onChange(value)}
        rightElement={<ErrorElement errors={props.errors} />}
      />
      <Button text="path params" />
    </ControlGroup>
  );
};

Url.propTypes = {
  value: PropTypes.any,
  placeholder: PropTypes.any,
  errors: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};

export default Url;
