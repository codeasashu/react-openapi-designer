import React from 'react';
import {makeAutoObservable} from 'mobx';
import {
  raiseErrorIfNotParentNode,
  generateUUID,
  isParentNode,
  eventTypes,
} from '../utils/tree';
import Tree from './Tree';
import EventEmitter from './EventEmitter';

class Store {
  someprop = '';
  //constructor(e, t, n) {
  constructor(tree, state, n) {
    makeAutoObservable(this);
    this.state = state;
    this.icons = {};
    this.defaultExpandedDepth = 0;
    this._innerPadding = null;
    this.instanceRef = React.createRef();
    this.events = new EventEmitter();

    this.setActiveNode = (e) => {
      this.state.activeNodeId = e;
    };

    this.setEditedNode = (e) => {
      this.state.editedNodeId = e;
    };

    //this.scrollToItem = (e) => {
    this.scrollToItem = (node) => {
      if (!this.instanceRef.current) {
        return;
      }

      if (isParentNode(node)) {
        this.toggleExpand(node, true);
      }

      let itemIndex = this.tree.indexOf(node); //t

      if (itemIndex === -1) {
        return;
      }

      const nodeProps = this.instanceRef.current.props; // n

      const {itemCount} = nodeProps; // r

      // if (!R.isFixedSizeList(n)) { // R
      if (!Store.isFixedSizeList(nodeProps)) {
        // R
        this.instanceRef.current.scrollToItem(itemIndex, 'start');
        return;
      }

      const {scrollOffset} = this.instanceRef.current.state; // o

      const scrollAt = Math.max(
        0,
        Math.min(itemIndex + (this.innerPadding ? 1 : 0), itemCount - 1),
      );
      const offset = Store.getOffsetForIndexAndAlignment(
        nodeProps,
        scrollAt,
        scrollOffset,
        this.innerPadding,
      );

      if (!(scrollOffset === offset)) {
        this.instanceRef.current.scrollTo(offset);
      }
    };

    //this.rename = async (e, t) => {
    this.rename = async (node, validator) => {
      console.log('rename', node, validator);
      this.setEditedNode(node.id);
      ////const disposableCollection = new o.DisposableCollection();

      //try {
      //return await new Promise((success, failed) => {
      //disposableCollection.pushAll([
      //this.events.on(
      //eventTypes.BeforeEditComplete,
      //async (currentNode, parentNode) => {
      //try {
      //if (validator !== undefined) {
      //await validator(currentNode, parentNode);
      //}

      //this.events.emit(
      //eventTypes.AfterEditComplete,
      //currentNode,
      //parentNode,
      //);
      //} catch (errors) {
      //this.events.emit(eventTypes.ValidationError, errors);
      //}
      //},
      //),
      //this.events.on(eventTypes.AfterEditComplete, success),
      //this.events.on(eventTypes.EditCancel, failed),
      //]);
      //});
      //} finally {
      //disposableCollection.dispose();
      //this.setEditedNode(null);
      //}
    };

    this.tree = tree;
    Object.assign(this, n);
    this.placeholderId = generateUUID();
  }

  get innerPadding() {
    return this._innerPadding;
  }

  set innerPadding(padding) {
    this._innerPadding = padding;
  }

  dispose() {
    //this.events.dispose();
  }

  static isFixedSizeList(nodeProps) {
    return typeof nodeProps.itemSize == 'number';
  }

  static getOffsetForIndexAndAlignment(
    {direction, height, itemCount, itemSize, layout, width},
    scrollIndex,
    scrollOffset,
    innerPadding,
  ) {
    const contentSize =
      Number(
        direction === 'horizontal' || layout === 'horizontal' ? width : height,
      ) - (innerPadding != null ? innerPadding : 0);
    const totalSize = Math.max(0, itemSize * itemCount - contentSize); // u
    const offset = Math.min(totalSize, itemSize * scrollIndex); // d

    if (
      Math.max(0, itemSize * scrollIndex - contentSize + itemSize) <=
        scrollOffset &&
      offset >= scrollOffset
    ) {
      return scrollOffset;
    } else {
      return offset;
    }
  }

  toggleExpand(node, expand) {
    // e, t
    // Only nodes that have children are allowed to expand
    raiseErrorIfNotParentNode(node);

    const {expanded} = this.state; // n

    if (expand === undefined || expanded[node.id] !== expand) {
      console.log('change expand', expanded, node.id);
      this.someprop = node.id;
      this.state.setExpandedKeyVal(
        node.id,
        expand != null ? expand : !this.isNodeExpanded(node),
      );
      //this.state.expanded[node.id] =
      //expand != null ? expand : !this.isNodeExpanded(node);
      this.events.emit(eventTypes.NodeExpand, node);

      if (this.state.expanded[node.id] === true) {
        this.tree.unwrap(node);
      } else {
        this.tree.wrap(node);
      }
      console.log('tree', this.tree);
    }

    if (!this.isNodeExpanded(node)) {
      return;
    }

    const parentNode = node.parent;

    if (parentNode !== null && !this.isNodeExpanded(parentNode)) {
      this.toggleExpand(parentNode, true);
    }
  }

  expandAll(condition) {
    for (const treeItem of this.tree) {
      if (
        isParentNode(treeItem) &&
        treeItem.parent !== null &&
        (condition === undefined || condition(treeItem))
      ) {
        this.toggleExpand(treeItem, true);
      }
    }
  }

  collapseAll(condition) {
    for (const treeItem of this.tree) {
      if (
        isParentNode(treeItem) &&
        treeItem.parent !== null &&
        (condition === undefined || condition(treeItem))
      ) {
        this.toggleExpand(treeItem, false);
      }
    }
  }

  //static isNodeExpanded(e,t,n) {
  static isNodeExpanded(node, expandedState, defaultExpandedDepth) {
    if (
      node.id in expandedState &&
      defaultExpandedDepth >= Tree.getLevel(node)
    ) {
      return expandedState[node.id] === true;
    }
    return false;
  }

  isNodeExpanded(node) {
    return Store.isNodeExpanded(
      node,
      this.state.expanded,
      this.defaultExpandedDepth,
    );
  }

  isAllExpanded() {
    return this.tree.every(
      (node) =>
        node.parent === null ||
        !isParentNode(node) ||
        this.isNodeExpanded(node),
    );
  }

  isAllCollapsed() {
    return this.tree.every(
      (node) =>
        node.parent === null ||
        !isParentNode(node) ||
        !this.isNodeExpanded(node),
    );
  }

  async create(nodeProps, parent, validator) {
    const node = Object.assign(nodeProps, {
      name: '',
      parent,
    });

    this.tree.invalidateNode(node);
    this.toggleExpand(parent, true);
    this.tree.insertNode(node, parent);

    try {
      await this.rename(node, validator);

      if (node.parent !== null) {
        this.tree.invalidateNode(node.parent);
      }

      return node;
    } catch (error) {
      throw (this.tree.removeNode(node), error);
    }
  }
}

export default Store;
