import React from 'react';
import PropTypes from 'prop-types';
import {StoreContext} from '../Context';
import {isParentNode} from '../../utils/tree';
import {Icon} from '@blueprintjs/core';

const ExpandIcon = ({expanded, node, icons}) => {
  const store = React.useContext(StoreContext);
  let iconDiv = null;

  if (isParentNode(node)) {
    const icon = expanded ? icons.Down : icons.Right;
    const _icon = typeof icon == 'function' ? icon.call(store, node) : icon;

    if (_icon != null && _icon.default !== null) {
      iconDiv = (
        <Icon size="sm" icon={icon.default} style={{color: icon.color}} />
      );
    }
  }

  return <span className="treelistitem__caret">{iconDiv}</span>;
};

ExpandIcon.propTypes = {
  expanded: PropTypes.bool,
  node: PropTypes.object,
  icons: PropTypes.object,
};

export default ExpandIcon;
