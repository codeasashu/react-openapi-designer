import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from '@blueprintjs/core';

const MenuItem = (props) => {
  const styles = props.inner ? {paddingLeft: '15px'} : {};
  return (
    <div className="TreeListItem TreeListItem--0 DesignTreeListItem">
      <div className="relative flex items-stretch w-full h-full DesignTreeListItem--hover group">
        <div
          className="flex-1 flex items-center truncate DesignTreeListItem__row"
          style={styles}>
          {props.icon && (
            <span className="TreeListItem__icon relative pl-0">
              <Icon icon={props.icon} />
            </span>
          )}
          <span className="TreeListItem__label pl-2">{props.label}</span>
        </div>
        <div className="flex items-center flex-no-wrap mr-2"></div>
      </div>
    </div>
  );
};

MenuItem.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  inner: PropTypes.bool,
};

export default MenuItem;
