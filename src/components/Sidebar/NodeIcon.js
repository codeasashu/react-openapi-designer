import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from '@blueprintjs/core';

const NodeIcon = ({expanded, icons, node}) => {
  const iconObj = node.type !== undefined ? icons[node.type] : undefined;

  if (iconObj === undefined) {
    return null;
  }

  const icon = (function (icon, expanded) {
    if (icon === null) {
      return icon;
    } else {
      if (expanded && icon.expanded !== undefined) {
        return icon.expanded;
      } else {
        return icon.default;
      }
    }
  })(iconObj, !!expanded);

  return (
    <span className="TreeListItem__icon">
      {icon != null ? (
        <Icon
          icon={icon}
          style={{
            color: iconObj == null ? undefined : iconObj.color,
          }}
        />
      ) : null}
    </span>
  );
};

NodeIcon.propTypes = {
  expanded: PropTypes.bool,
  node: PropTypes.object,
  icons: PropTypes.object,
};

export default NodeIcon;
