import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './base';

const Models = (props) => {
  return (
    <>
      <MenuItem icon="folder-open" label="Models" />
      {Object.keys(props.models).map((model, i) => (
        <MenuItem icon="cube" inner label={props.models[model].title} key={i} />
      ))}
    </>
  );
};

Models.propTypes = {
  models: PropTypes.object,
};

export default Models;
