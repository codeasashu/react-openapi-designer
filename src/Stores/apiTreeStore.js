import {reaction} from 'mobx';
import Node from '../Tree/Node';
import ParentNode from '../Tree/ParentNode';
import {isParentNode, assertUniqueName, generateUUID} from '../utils/tree';
import {eventTypes} from '../datasets/tree';

class ApiTreeStore {
  constructor(e) {
    this.stores = e;
    this.newNodeId = undefined;
    this.initialScrollOffset = 0;

    this.loadStorage = () => {
      const nodeTree = {};

      const parsedObject = localStorage[this.storageKey]
        ? JSON.parse(localStorage[this.storageKey])
        : null;

      for (const [nodeUri, path] of Object.entries(parsedObject || {})) {
        const nodeId = this.stores.graphStore.getNodeIdByUri(nodeUri);

        if (nodeId) {
          nodeTree[nodeId] = path;
        }
      }

      this.treeStore.state.setExpanded(nodeTree);
    };

    this.saveStorage = () => {
      const nodeTree = {};

      for (const [nodeId, path] of Object.entries(
        this.treeStore.state.expanded,
      )) {
        const nodeUri = this.stores.graphStore.getNodeUriById(nodeId); // r

        if (nodeUri) {
          nodeTree[nodeUri] = path;
        }
      }

      localStorage[this.storageKey] = JSON.stringify(nodeTree);
    };

    this.handleScroll = ({scrollOffset: e}) => {
      this.initialScrollOffset = e;
    };

    this.handleNodeClick = (e, node) => {
      // e, t
      if (isParentNode(node)) {
        this.treeStore.toggleExpand(node);
      } else {
        const _node = this.stores.graphStore.getNodeById(node.id);
        this.stores.uiStore.setActiveNode(_node, true);
      }
    };

    //this.registerTreeEvents();

    this.createNewNode = (node, parent, n) => {
      try {
        let newNode = Object.assign(
          {
            id: generateUUID(),
            name: '',
            parent,
          },
          node,
        );

        this.newNodeId = newNode.id;
        const treeNode = this.treeStore.create(
          isParentNode(newNode) ? new ParentNode(newNode) : new Node(newNode),
          parent,
          n,
        );
        this.tree.removeNode(treeNode);
        return treeNode;
      } finally {
        this.newNodeId = undefined;
      }
    };
  }

  registerTreeEvents() {
    this.treeStore.events.on(eventTypes.NodeClick, this.handleNodeClick);
  }

  toggleTreeListNodes(expand) {
    if (expand === true) {
      this.treeStore.expandAll();
    } else {
      this.treeStore.collapseAll();
    }
  }

  assertUniqueName(node) {
    assertUniqueName(node);
  }

  setActiveTreeNode(node = '') {
    this.treeStore.setActiveNode(node);
  }

  registerReactions() {
    reaction(
      () => {
        return this.activeGraphNode && this.activeGraphNode.id;
      },
      (nodeId) => {
        this.setActiveTreeNode(nodeId);
      },
      {
        fireImmediately: true,
      },
    );

    reaction(
      () => this.treeStore.state.activeNodeId,
      (nodeId) => {
        if (nodeId === null) {
          return;
        }

        const node = this.tree.findById(nodeId);

        if (isParentNode(node)) {
          this.treeStore.toggleExpand(node, true);
        }
      },
      {
        delay: 50,
      },
    );
  }
}

export default ApiTreeStore;
