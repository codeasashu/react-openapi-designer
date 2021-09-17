import React from 'react';
import PropTypes from 'prop-types';
import {ContextMenu, Menu, MenuDivider, MenuItem} from '@blueprintjs/core';
import SortableTree from '../../../react-sortable-tree/src/react-sortable-tree';
import TreeRow from './TreeRow';
import TreeRowContent from './TreeRowContent';

const icons = {
  overview: {
    default: 'star',
    color: 'var(--icon-color)',
  },
  paths: {
    color: '#eba439',
    default: 'folder-close',
    expanded: 'folder-open',
  },
  model: {
    default: 'cube',
    color: '#ef932b',
  },
  response: {
    color: '#0f79c5',
    default: 'exchange',
  },
  parameter: {
    default: 'paragraph',
    color: '#1a4f75',
  },
  example: {
    default: 'credit-card',
    color: '#e53e3e',
  },
  requestBody: {
    color: '#6e44b1',
    default: 'dot',
  },
};

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

const SidebarContextMenu = ({items}) => {
  return <Menu>{getItems(items)}</Menu>;
};

SidebarContextMenu.propTypes = {
  items: PropTypes.array,
};

const Tree = ({treeData, onChange, onClick, generateContextMenu}) => {
  const generateNodeProps = ({node}) => {
    const handleContextMenu = (e) => {
      if (!generateContextMenu) {
        return;
      }

      const menuItems = generateContextMenu(node);

      if (menuItems !== undefined) {
        e.preventDefault();
        e.stopPropagation();

        if (menuItems.length > 0) {
          ContextMenu.show(
            <SidebarContextMenu items={menuItems} />,
            {
              left: e.clientX,
              top: e.clientY,
            },
            () => {},
          );
        }
      }
    };
    return {contextMenu: handleContextMenu, onClick};
  };

  return (
    <div style={{height: '100%', width: 289}}>
      <SortableTree
        treeData={treeData}
        onChange={(treeData) => onChange({treeData})}
        generateNodeProps={generateNodeProps}
        randomProp={1}
        theme={{
          icons,
          randomProp2: 2,
          nodeContentRenderer: TreeRowContent,
          treeNodeRenderer: TreeRow,
          scaffoldBlockPxWidth: 25,
          rowHeight: 25,
          slideRegionSize: 50,
        }}
      />
    </div>
  );
};

Tree.propTypes = {
  treeData: PropTypes.any,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  generateContextMenu: PropTypes.func,
};

export default Tree;
