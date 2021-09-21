import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react-lite';
import TreeList from '../Tree/List';
import ComputableTree from '../../Tree/ComputedTree';
import TreeStore from '../../Tree/Store';
import TreeState from '../../Tree/State';
import {Resolve} from '../../Tree/Resolver';
import TreeOrder from '../../Tree/Order';
import {icons} from '../../model';
import Item from './Item';
import {eventTypes, isParentNode} from '../../utils/tree';

const Sidebar = observer((props) => {
  const rowHeight = (e) =>
    'path' === e.type &&
    e.metadata !== undefined &&
    'operations' in e.metadata &&
    e.metadata.operations.items.length > 0
      ? 50
      : 30;

  const tree = new ComputableTree(Resolve(props.openapi), {order: TreeOrder});
  const treeStore = new TreeStore(tree, new TreeState(), {
    defaultExpandedDepth: 1,
    icons,
  });

  //const treeStore = getTreeStore(props.openapi);
  treeStore.tree.invalidate();
  const generateContextMenu = () => {};
  const handleScroll = () => {};
  // eslint-disable-next-line no-unused-vars
  treeStore.events.on(eventTypes.NodeClick, (node, event) => {
    if (isParentNode(node)) {
      treeStore.toggleExpand(node);
    }
  });
  console.log('ttreeStor', treeStore);

  const rowRenderer = (node, rowOptions) => {
    return (
      <div className="relative flex items-stretch w-full h-full DesignTreeListItem--hover group">
        <Item placeholder="" className="truncate" node={node} {...rowOptions} />
      </div>
    );
  };

  return (
    //<StoreContext.Provider value={treeStore}>
    //<DesignContext.Provider
    //value={{
    //itemClassName: 'DesignTreeListItem',
    //innerClassName: '',
    //className: 'SidebarTreeList flex-1',
    //}}>
    <TreeList
      store={treeStore}
      draggable={false}
      rowHeight={rowHeight}
      rowRenderer={rowRenderer}
      itemClassName="DesignTreeListItem"
      className="SidebarTreeList"
      innerPadding={15}
      generateContextMenu={generateContextMenu}
      initialScrollOffset={0}
      onScroll={handleScroll}
      autoSize={true}
      style={props.style}
    />
    //</DesignContext.Provider>
    //</StoreContext.Provider>
  );
});

Sidebar.propTypes = {
  style: PropTypes.object,
  //onClick: PropTypes.func,
  openapi: PropTypes.object,
};

export default Sidebar;
