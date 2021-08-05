import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './base';

const Parameters = (props) => {
  return (
    <>
      <MenuItem icon="folder-open" label="Parameters" />
      {Object.keys(props.parameters).map((parameter, i) => (
        <MenuItem
          icon="clean"
          inner
          label={props.parameters[parameter].title}
          key={i}
          onClick={() =>
            props.onClick({itemPath: `#/components/parameters/${parameter}`})
          }
        />
      ))}
    </>
  );
};

Parameters.propTypes = {
  parameters: PropTypes.object,
  onClick: PropTypes.func,
};

export default Parameters;
