import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './base';

const Models = ({models, onClick}) => {
  return (
    <>
      <MenuItem icon="folder-open" label="Models" />
      {Object.keys(models).map((model, i) => (
        <MenuItem
          icon="cube"
          inner
          label={models[model].title}
          onClick={() => onClick({itemPath: {model}})}
          key={i}
        />
      ))}
    </>
  );
};

Models.propTypes = {
  models: PropTypes.object,
  onClick: PropTypes.func,
};

export default Models;
