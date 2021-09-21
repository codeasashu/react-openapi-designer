/* eslint no-unused-vars: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Callout, Icon, InputGroup, Intent, Position} from '@blueprintjs/core';
import {escapeUri, isValidPathMethod} from '../../../utils';
import styles from './renderer.scss';
// To remove
import {Menu, MenuItem} from '@blueprintjs/core';
import {Popover2} from '@blueprintjs/popover2';

function isDescendant(older, younger) {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      (child) => child === younger || isDescendant(child, younger),
    )
  );
}

const methodColors = {
  get: 'success',
  post: 'info',
  put: 'warning',
  patch: 'warning',
  delete: 'danger',
  copy: 'gray',
  head: 'gray',
  link: 'gray',
  unlink: 'gray',
  purge: 'gray',
  lock: 'gray',
  unlock: 'gray',
  options: 'gray',
  trace: 'gray',
};

const RowIcon = ({icons, node, expanded}) => {
  const iconProp = node.type !== undefined ? icons[node.type] : undefined;
  const getIcon = (icon, expanded) => {
    if (icon == null) {
      return icon;
    } else {
      if (expanded && icon.expanded !== undefined) {
        return icon.expanded;
      } else {
        return icon.default;
      }
    }
  };

  const icon = getIcon(iconProp, !!expanded);

  return (
    <span className="TreeListItem__icon">
      {icon !== null ? (
        <Icon
          icon={icon}
          style={{color: iconProp === null ? undefined : iconProp.color}}
        />
      ) : null}
    </span>
  );
};

RowIcon.propTypes = {
  node: PropTypes.object,
  icons: PropTypes.object,
  expanded: PropTypes.bool,
};

const EditorRow = ({node, placeholder = ''}) => {
  const inputRef = React.useRef();
  const [error, setError] = React.useState(null);

  const onBlur = React.useCallback(() => {
    node.actions.undo && node.actions.undo(node);
  }, []);

  const onKeyDown = React.useCallback(
    (e) => {
      switch (e.key) {
        case 'Enter':
          node.name = inputRef.current.value;
          node.isEdited = false;
          console.log('node changed', node);
          if (node.actions && node.actions.rename) {
            node.actions.rename(inputRef.current.value);
          }
          break;
        case 'Escape':
          onBlur();
      }
    },
    [node, onBlur],
  );

  const onFocus = React.useCallback((e) => {
    const inputValue = e.target.value;
    const stopIndex = inputValue.indexOf('.');
    e.target.setSelectionRange(
      0,
      stopIndex === -1 ? inputValue.length : stopIndex,
      'forward',
    );
  }, []);

  const onInput = React.useCallback((e) => {
    console.log('input', e.target.value);
    if (e.target.value !== '') {
      setError(null);
    }
  }, []);

  return (
    <Popover2
      isOpen={error !== null}
      minimal={true}
      usePortal={true}
      className="w-full flex-shrink"
      position={Position.BOTTOM_RIGHT}
      content={<Callout intent={Intent.DANGER}>{error}</Callout>}>
      <input
        ref={inputRef}
        autoFocus={true}
        autoComplete="off"
        className="w-full DesignTreeListItem__input"
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
        defaultValue={node.name}
        placeholder={placeholder}
        onInput={onInput}
      />
    </Popover2>
  );
};

EditorRow.propTypes = {
  node: PropTypes.object,
  placeholder: PropTypes.string,
};

const RowChildren = ({icons, node, expanded, level}) => {
  const paddingLeft = 15 * level;
  return (
    <div
      className="flex items-center h-full w-full"
      style={{paddingLeft: `${paddingLeft}px`}}>
      <RowIcon icons={icons} node={node} expanded={expanded} />
      {node.isEdited ? (
        <EditorRow node={node} />
      ) : (
        <span className="TreeListItem__label" title={node.name}>
          {node.name}
        </span>
      )}
    </div>
  );
};

RowChildren.propTypes = {
  node: PropTypes.object,
  level: PropTypes.number,
  expanded: PropTypes.bool,
  icons: PropTypes.object,
};

const icons = {
  overview: {
    default: 'star',
    color: 'var(--icon-color)',
  },
  paths: {
    default: 'folder-close',
    expanded: 'folder-open',
    color: '#eba439',
  },
  models: {
    default: 'folder-close',
    expanded: 'folder-open',
    color: '#eba439',
  },
  model: {
    default: 'cube',
    color: '#ef932b',
  },
  responses: {
    default: 'folder-close',
    expanded: 'folder-open',
    color: '#eba439',
  },
  parameters: {
    default: 'folder-close',
    expanded: 'folder-open',
    color: '#eba439',
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
  examples: {
    default: 'folder-close',
    expanded: 'folder-open',
    color: '#eba439',
  },
  requestBodies: {
    default: 'folder-close',
    expanded: 'folder-open',
    color: '#eba439',
  },
};

const PathName = ({node, handleNodeContentClick}) => {
  const parsePath = (e) => e.replace(/[{}]/g, (e) => (e === '}' ? '{' : '}'));
  const normaliseName = (e) => e.split('').reverse().join('');

  return (
    <span
      className="truncate text-left direction-rtl unicode-bidi"
      onClick={(e) =>
        handleNodeContentClick(e, {
          location: `paths/${escapeUri(node.name)}`,
        })
      }>
      {parsePath(normaliseName(node.name))
        .split('/')
        .map((name, index, items) => {
          return name.startsWith('{') && name.endsWith('}') ? (
            <React.Fragment key={index}>
              <span className="opacity-75">{name}</span>
              {items.length - 1 !== index ? '/' : ''}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>
              {name}
              {items.length - 1 !== index ? '/' : ''}
            </React.Fragment>
          );
        })}
    </span>
  );
};

PathName.propTypes = {
  node: PropTypes.object,
  handleNodeContentClick: PropTypes.func,
};

const getMethodTagColor = (methodName) => {
  if (methodName in methodColors) {
    return methodColors[methodName];
  } else {
    return 'gray';
  }
};

const PathItem = ({node, handleNodeContentClick}) => (
  <>
    <PathName node={node} handleNodeContentClick={handleNodeContentClick} />
    <div className="uppercase mt-1 mb-1 truncate">
      {node.metadata &&
        node.metadata.operations.items.map(({method, isActive}) => {
          return (
            <span
              key={method.toLowerCase()}
              onClick={(e) =>
                handleNodeContentClick(e, {
                  location: `paths/${escapeUri(
                    node.name,
                  )}/${method.toLowerCase()}`,
                })
              }
              className={classnames(
                'bp3-tag mr-2 mt-1',
                'dark:bg-' + getMethodTagColor(method.toLowerCase()),
                {
                  ['bg-' + getMethodTagColor(method.toLowerCase())]: !(
                    node.isActive || true
                  ),
                  'bg-white': node.isActive || false,
                  'opacity-75 hover:opacity-100': !isActive,
                  'opacity-100': !!isActive,
                },
              )}>
              {method}
            </span>
          );
        })}
    </div>
  </>
);

PathItem.propTypes = {
  node: PropTypes.object,
  handleNodeContentClick: PropTypes.func,
};

const TreeRowContent = (props) => {
  const {
    scaffoldBlockPxWidth,
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    isDragging,
    canDrop,
    canDrag,
    node,
    title,
    draggedNode,
    path,
    treeIndex,
    isSearchMatch,
    isSearchFocus,
    buttons,
    className,
    style,
    didDrop,
    lowerSiblingCounts,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    treeId, // Not needed, but preserved for other renderers
    isOver, // Not needed, but preserved for other renderers
    parentNode, // Needed for dndManager
    rowDirection,
    icon,
    ...otherProps
  } = props;

  const nodeTitle = title || node.name;

  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
  const isLandingPadActive = !didDrop && isDragging;
  // Construct the scaffold representing the structure of the tree
  const scaffold = [];

  const level =
    lowerSiblingCounts && lowerSiblingCounts.length > 0
      ? lowerSiblingCounts.length - 1
      : 0;

  const {meta, href, onClick, contextMenu} = otherProps;

  lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
    scaffold.push(
      <div
        key={`pre_${1 + i}`}
        style={{width: scaffoldBlockPxWidth}}
        className={styles.lineBlock}
      />,
    );

    if (treeIndex !== listIndex && i === swapDepth) {
      // This row has been shifted, and is at the depth of
      // the line pointing to the new destination
      let highlightLineClass = '';

      if (listIndex === swapFrom + swapLength - 1) {
        // This block is on the bottom (target) line
        // This block points at the target block (where the row will go when released)
        highlightLineClass = styles.highlightBottomLeftCorner;
      } else if (treeIndex === swapFrom) {
        // This block is on the top (source) line
        highlightLineClass = styles.highlightTopLeftCorner;
      } else {
        // This block is between the bottom and top
        highlightLineClass = styles.highlightLineVertical;
      }

      scaffold.push(
        <div
          key={`highlight_${1 + i}`}
          style={{
            width: scaffoldBlockPxWidth,
            left: scaffoldBlockPxWidth * i,
          }}
          className={`${styles.absoluteLineBlock} ${highlightLineClass}`}
        />,
      );
    }
  });

  const metaItems =
    meta &&
    meta.length &&
    meta.map((metaItem, index) => {
      return metaItem.type === 'icon' ? (
        <Icon key={index} className={'mx-2'} metaItem={metaItem} />
      ) : (
        <div key={index} className={'mx-2'}>
          {metaItem.title}
        </div>
      );
    });

  //const rowChildren = (
  //<div className="flex items-center h-full w-full">
  //{scaffold}
  //{icon && <Icon className="treelistitem__icon" icon={icon} size={18} />}
  //<span className="TreeListItem__label">{nodeTitle}</span>
  //{metaItems && <div className="flex justify-end">{metaItems}</div>}
  //</div>
  //);

  const handleNodeContentClick = (e, otherProps) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(e, node, Object.assign({location: undefined}, otherProps));
    }

    if (toggleChildrenVisibility) {
      toggleChildrenVisibility({
        node,
        path,
        treeIndex,
      });
    }
  };

  const getLocation = (node) => {
    let itemType = undefined;
    switch (node.type) {
      case 'model':
        itemType = `components/schemas/${node.name}`;
        break;
      case 'parameter':
        itemType = `components/parameters/${node.name}`;
        break;
      case 'response':
        itemType = `components/responses/${node.name}`;
        break;
      case 'requestBody':
        itemType = `components/requestBodies/${node.name}`;
        break;
      case 'example':
        itemType = `components/examples/${node.name}`;
        break;
      case 'overview':
        itemType = null;
        break;
    }
    return itemType;
  };

  return node.type === 'path' ? (
    <div className="flex group w-full items-center">
      <div
        className="DesignTreeListItem__path relative h-full flex flex-col justify-center w-full"
        onContextMenu={contextMenu}
        onClick={(e) =>
          handleNodeContentClick(e, {
            location: `paths/${escapeUri(node.name)}`,
          })
        }>
        {node.isEdited ? (
          <EditorRow node={node} />
        ) : (
          <PathItem
            node={node}
            handleNodeContentClick={handleNodeContentClick}
          />
        )}
      </div>
    </div>
  ) : (
    <div
      className="relative flex items-stretch w-full h-full DesignTreeListItem--hover group"
      onClick={(e) => handleNodeContentClick(e, {location: getLocation(node)})}>
      <div
        className="flex-1 flex items-center truncate DesignTreeListItem__row"
        onContextMenu={contextMenu}>
        <RowChildren
          node={node}
          icons={icons}
          expanded={node.expanded}
          level={level}
        />
        {node.metadata && node.metadata.rightLabel && (
          <span className="absolute capitalize bp3-tag right-0 mr-12 bg-gray">
            {node.metadata.rightLabel}
          </span>
        )}
      </div>
    </div>
  );
};

TreeRowContent.defaultProps = {
  buttons: [],
  canDrag: false,
  canDrop: false,
  className: '',
  draggedNode: null,
  icons: {},
  isSearchFocus: false,
  isSearchMatch: false,
  parentNode: null,
  style: {},
  swapDepth: null,
  swapFrom: null,
  swapLength: null,
  title: null,
  toggleChildrenVisibility: null,
};

TreeRowContent.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  canDrag: PropTypes.bool,
  className: PropTypes.string,
  icons: PropTypes.object,
  icon: PropTypes.string,
  isSearchFocus: PropTypes.bool,
  isSearchMatch: PropTypes.bool,
  listIndex: PropTypes.number.isRequired,
  lowerSiblingCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  node: PropTypes.object.isRequired,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  scaffoldBlockPxWidth: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  swapDepth: PropTypes.number,
  swapFrom: PropTypes.number,
  swapLength: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  toggleChildrenVisibility: PropTypes.func,
  treeIndex: PropTypes.number.isRequired,
  treeId: PropTypes.string.isRequired,
  rowDirection: PropTypes.string.isRequired,

  // Drag and drop API functions
  // Drag source
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  didDrop: PropTypes.bool.isRequired,
  draggedNode: PropTypes.shape({}),
  isDragging: PropTypes.bool.isRequired,
  parentNode: PropTypes.shape({}), // Needed for dndManager
  // Drop target
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool.isRequired,
};

export default TreeRowContent;
