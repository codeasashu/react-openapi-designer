import React from 'react';
import classnames from 'classnames';
import {observer} from 'mobx-react-lite';
import {StoreContext, DesignContext} from '../Context';
//import VariableSizeList from './VariableSizeList';
import {VariableSizeList, FixedSizeList} from 'react-window';
//import FixedSizeList from './FixedSizeList';
import TreeRow from './TreeRow';

const TreeContainer = observer((props) => {
  const getFromDesignContext = (item) => React.useContext(DesignContext)[item];

  const {
    autoExpandDelay,
    rowHeight,
    rowRenderer,
    canDrag,
    canDrop,
    style,
    striped,
    innerPadding,
    generateContextMenu,
    maxRows,
    interactive = true,
    initialScrollOffset,
    onScroll,
    draggable,
  } = props;

  const store = React.useContext(StoreContext);
  const innerClassName = getFromDesignContext('innerClassName');
  const className = getFromDesignContext('className');
  //const instanceRef = store.instanceRef;
  const instanceRef = React.useRef({});
  const tree = store.tree;

  if (typeof innerPadding == 'boolean' && typeof rowHeight == 'function') {
    throw new Error(
      'You need to provide an absolute value for padding in case of VariableSizeList',
    );
  }
  const _innerPadding =
    typeof innerPadding === 'boolean' ? rowHeight / 2 : innerPadding;
  const totalItems = tree.count + (_innerPadding ? 1 : 0);

  React.useEffect(() => {
    store.innerPadding = _innerPadding !== null ? _innerPadding : null;
  }, [_innerPadding, store]);

  React.useEffect(() => {
    if (
      instanceRef.current !== null &&
      'resetAfterIndex' in instanceRef.current
    ) {
      instanceRef.current.resetAfterIndex(0, true);
    }
  }, [instanceRef, tree.versionCounter]);

  const itemData = {
    canDrag,
    canDrop,
    autoExpandDelay,
    rowRenderer,
    rowHeight,
    innerPadding: _innerPadding,
    tree,
    generateContextMenu,
    striped,
    draggable: draggable !== false,
  };

  const getItemKey = React.useCallback(
    (nodeIndex) => {
      if (_innerPadding && nodeIndex === 0) {
        return store.placeholderId;
      }

      const node = tree.itemAt(_innerPadding ? nodeIndex - 1 : nodeIndex);

      if (node) {
        return `${node.id}-${node.type}`;
      } else {
        return '';
      }
    },
    [tree, store.placeHolderId, _innerPadding],
  );

  const getItemSize = React.useCallback(
    (nodeIndex) => {
      if (nodeIndex === 0 && _innerPadding) {
        return _innerPadding * 2;
      }

      const itemIndex = _innerPadding ? nodeIndex - 1 : nodeIndex;
      const node = tree.itemAt(itemIndex);

      if (typeof rowHeight == 'function' && node !== undefined) {
        return rowHeight(node);
      } else {
        return 30;
      }
    },
    [_innerPadding, tree, rowHeight],
  );

  const listProps = {
    className: innerClassName,
    itemData,
    itemKey: getItemKey,
    itemCount: totalItems,
    maxRows,
    initialScrollOffset,
    onScroll,
  };

  if (totalItems === 0) {
    return null;
  } else {
    return (
      <div
        style={style}
        //onContextMenu={onContextMenu}
        className={classnames('TreeList', className, {
          'TreeList--interactive': interactive,
        })}>
        {typeof rowHeight != 'function' ? (
          <FixedSizeList
            {...listProps}
            autoSize={props.autoSize}
            instanceRef={instanceRef}
            height={50}
            itemSize={50}>
            {TreeRow}
          </FixedSizeList>
        ) : (
          <VariableSizeList
            {...listProps}
            height={500}
            ref={instanceRef}
            instanceRef={instanceRef}
            itemSize={getItemSize}>
            {TreeRow}
          </VariableSizeList>
        )}
      </div>
    );
  }
});

export default TreeContainer;
