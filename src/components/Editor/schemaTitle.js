import React from 'react';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';

const SchemaTitle = (props) => {
  return (
    <span>
      <div style={{display: 'inline-block'}}>
        <AutosizeInput
          inputClassName="bg-transparent hover:bg-darken-1 focus:bg-darken-2"
          minWidth={30}
          value={props.value}
          style={{
            fontSize: '11px',
            fontWeight: 400,
          }}
          onChange={(e) => {
            props.onChange && props.onChange(e.target.value);
          }}
          onBlur={(e) => {
            props.onBlur && props.onBlur(e.target.value);
          }}
          onFocus={(e) => {
            props.onFocus && props.onFocus(e.target.value);
          }}
        />
      </div>
    </span>
  );
};

SchemaTitle.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
};

export default SchemaTitle;
