import {Tooltip, Button} from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

const TooltipButton = ({className, disabled, tooltip, ...props}) => {
  return (
    <Tooltip
      boundary="window"
      content={tooltip}
      position="top"
      disabled={disabled}>
      <Button
        className={classNames(className, {'opacity-25': disabled})}
        disabled={disabled}
        small={true}
        minimal={true}
        {...props}
      />
    </Tooltip>
  );
};

TooltipButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
};

export default TooltipButton;
