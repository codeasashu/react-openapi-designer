import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {observer} from 'mobx-react-lite';
import Tree from '../../Tree/Tree';
import {DesignContext, StoreContext} from './context';
import {eventTypes, isParentNode} from '../../utils/tree';

const TreeRow = observer((props) => {
  const {data, index, style} = props;
  const {innerPadding, rowRenderer, generateContextMenu, striped} = data;

  const store = React.useContext(StoreContext);
  const tree = store.tree;
  const getFromDesignContext = (item) => React.useContext(DesignContext)[item];

  const handleEvent = (eventType, node) => {
    return React.useCallback(
      (e) => {
        if (node !== null) {
          console.log('On Event', eventType, node, e);
          store.events.emit(eventType, e, node);
        }
      },
      [store, eventType, node],
    );
  };

  const handleContextMenu = (node, generateContextMenu) => {
    return React.useCallback(
      (e) => {
        console.log('context menu', e);
      },
      [generateContextMenu, node],
    );
  };

  const itemClassName = getFromDesignContext('itemClassName');
  const nodeIndex = innerPadding ? index - 1 : index;
  const node = nodeIndex === -1 ? null : tree.itemAt(nodeIndex);

  if (node === undefined) {
    throw new Error('Could not find node.');
  }

  const handleClick = handleEvent(eventTypes.NodeClick, node);
  //const handleMouseEnter = handleEvent(eventTypes.NodeMouseEnter, node);
  //const handleMouseLeave = handleEvent(eventTypes.NodeMouseLeave, node);
  const contextMenu = handleContextMenu(node, generateContextMenu);

  if (node === null) {
    return <div style={style} />;
  }

  const isEdited = node.id === store.state.editedNodeId;
  const isActive = node.id === store.state.activeNodeId;
  const isExpanded = isParentNode(node) && store.isNodeExpanded(node);

  const nodeClasses = classnames(
    'TreeListItem TreeListItem--' + Tree.getLevel(node),
    node.className,
    itemClassName,
    {
      'TreeListItem--active': isActive,
      'TreeListItem--striped': striped && nodeIndex % 2 != 0,
    },
  );

  let renderer;

  renderer = rowRenderer(node, {
    isEdited,
    isExpanded,
  });

  const rowStyles = {
    ...style,

    ...(innerPadding &&
      style &&
      style.top && {
        top: Number(style.top) - innerPadding,
      }),
  };

  if (node.id === store.state.editedNodeId) {
    return (
      <div key={node.id} className={nodeClasses} style={rowStyles}>
        {renderer}
      </div>
    );
  } else {
    return (
      <div
        key={node.id}
        className={nodeClasses}
        style={rowStyles}
        onClick={handleClick}
        //onMouseEnter={handleMouseEnter}
        //onMouseLeave={handleMouseLeave}
        onContextMenu={contextMenu}>
        {renderer}
      </div>
    );
  }
});

TreeRow.propTypes = {
  data: PropTypes.object,
  index: PropTypes.any,
  style: PropTypes.object,
};

export default TreeRow;
