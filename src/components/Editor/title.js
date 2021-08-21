import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const noop = () => {};

const Title = (props) => {
  const classes = classnames(
    'px-2 py-1 font-medium bg-transparent hover:bg-darken-2 focus:bg-darken-2 rounded-lg w-full flex-shrink',
    {
      'text-2xl': props.xl,
      'text-xl': props.large,
      'text-sm': props.small,
      'text-xs': props.xs,
    },
  );
  return (
    <input
      className={classes}
      value={props.value}
      placeholder={props.placeholder || ''}
      onChange={props.onChange || noop}
    />
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
