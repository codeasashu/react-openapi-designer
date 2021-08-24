import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Title = ({xl, large, small, xs, placeholder, ...props}) => {
  const classes = classnames(
    'px-2 py-1 font-medium bg-transparent hover:bg-darken-2 focus:bg-darken-2 rounded-lg w-full flex-shrink',
    {
      'text-2xl': xl,
      'text-xl': large,
      'text-sm': small,
      'text-xs': xs,
    },
  );
  return (
    <input className={classes} placeholder={placeholder || ''} {...props} />
  );
};

Title.propTypes = {
  value: PropTypes.any,
  placeholder: PropTypes.any,
  xl: PropTypes.bool,
  large: PropTypes.bool,
  small: PropTypes.bool,
  xs: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Title;
