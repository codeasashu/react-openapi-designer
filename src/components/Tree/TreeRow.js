import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {observer} from 'mobx-react-lite';
import {Menu, MenuDivider, MenuItem} from '@blueprintjs/core';
import {ContextMenu2} from '@blueprintjs/popover2';
import Tree from '../../Tree/Tree';
import {DesignContext, StoreContext} from '../Context';
import {isParentNode} from '../../utils/tree';
import {eventTypes} from '../../datasets/tree';

const getItems = (items) =>
  items.map((item, index) => {
    if (item.divider) {
      return <MenuDivider key={index} />;
    }
    {
      const {children, ...e} = item;
      return React.createElement(
        MenuItem,
        Object.assign({key: index}, e),
        children && children.length ? getItems(children) : null,
      );
    }
  });

const SidebarContextMenu = ({items, ...props}) => {
  return <Menu {...props}>{getItems(items)}</Menu>;
};

SidebarContextMenu.propTypes = {
  items: PropTypes.array,
};

const TreeRow = observer((props) => {
  const {data, index, style} = props;
  const {innerPadding, rowRenderer, generateContextMenu, striped} = data;

  const store = React.useContext(StoreContext);
  const tree = store.tree;
  const getFromDesignContext = (item) => React.useContext(DesignContext)[item];

  const handleEvent = (eventType, node) => {
    return (e) => {
      if (node !== null) {
        store.events.emit(eventType, e, node);
      }
    };
  };

  const itemClassName = getFromDesignContext('itemClassName');
  const nodeIndex = innerPadding ? index - 1 : index;
  const node = nodeIndex === -1 ? null : tree.itemAt(nodeIndex);

  if (node === undefined) {
    throw new Error('Could not find node.');
  }

  const handleClick = handleEvent(eventTypes.NodeClick, node);

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
      <div
        key={node.id}
        className={nodeClasses}
        style={rowStyles}
        aria-label={node.type}
        role="edititem">
        {renderer}
      </div>
    );
  } else {
    const menuItems = node ? generateContextMenu(node) : undefined;
    if (menuItems !== undefined && menuItems.length > 0) {
      return (
        <ContextMenu2
          content={
            <SidebarContextMenu
              items={menuItems}
              data-testid={`tree-ctxmenu-${node.name}`}
            />
          }>
          <div
            key={node.id}
            data-testid={`tree-row-${node.id}`}
            role="menuitem"
            aria-label={node.type}
            className={nodeClasses}
            style={rowStyles}
            onClick={handleClick}>
            {renderer}
          </div>
        </ContextMenu2>
      );
    } else {
      return (
        <div
          key={node.id}
          data-testid={`tree-row-${node.id}`}
          role="menuitem"
          aria-label={node.type}
          className={nodeClasses}
          style={rowStyles}
          onClick={handleClick}>
          {renderer}
        </div>
      );
    }
  }
});

TreeRow.propTypes = {
  data: PropTypes.object,
  index: PropTypes.any,
  style: PropTypes.object,
};

export default TreeRow;
