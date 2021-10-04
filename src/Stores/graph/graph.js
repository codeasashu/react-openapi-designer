import {action, computed, makeObservable} from 'mobx';
import {
  formatUri,
  nodeOperations,
  NodeCategories,
  generateGraphId,
  NodeTypes,
  eventTypes,
} from '../../utils/tree';
import {handleOperation} from './operation';

class Graph {
  constructor(e) {
    makeObservable(this, {
      nodeValues: computed,
      sourceNodes: computed,
      virtualNodes: computed,
      rootNodes: computed,
      applyPatch: action.bound,
    });
    this.dom = {
      nodes: {},
      nodesByUri: {},
      nodesByType: {},
    };
    this.notifier = e.notifier;

    this.getNodeById = (e) => this.dom.nodes[e];
    this.getNodeByUri = (e) => this.dom.nodesByUri[e];
    this.getNodesByType = (e) => this.dom.nodesByType[e] || [];

    this.addNode = (node, trace, indexOnly = false) => {
      const existingNode = this.getNodeByPathWithParent(
        node.path,
        node.parentId,
      );

      if (existingNode) {
        return existingNode;
      }

      const nodeid = node.id || this._idGenerator(node); // i
      const duplicateNode = this.dom.nodes[nodeid]; //o

      if (duplicateNode) {
        console.warn(
          `Warning: addNode() node with id ${nodeid} already exists. It has uri '${duplicateNode.uri}'.`,
        );
      }

      const _node = Object.assign(Object.assign({}, node), {
        id: nodeid,
      });

      this.applyPatch({
        operations: [
          {
            op: nodeOperations.AddNode,

            node: _node,

            indexOnly,
          },
        ],

        trace: trace || {
          instanceId: this.id,
        },
      });

      const newNode = this.dom.nodes[nodeid];

      if (newNode.category === NodeCategories.SourceMap) {
        this.notifier.emit(eventTypes.DidAddSourceMapNode, {
          node: newNode,
        });
      }

      return newNode;
    };

    this.indexNode = (node, trace) => this.addNode(node, trace, true);

    this.processIndexedTree = (nodeTree, parentId) => {
      for (const node of nodeTree) {
        const _node = this.indexNode({
          category: 'source',
          type: node.type,
          path: node.path,
          parentId,
        });

        if (node.children && node.children.length) {
          this.processIndexedTree(node.children, _node.id);
        }
      }
    };

    this.setSourceNodeProp = (id, prop, value, trace) => {
      this.applyPatch({
        operations: [
          {
            op: nodeOperations.SetSourceNodeProp,
            id,
            prop,
            value,
          },
        ],

        trace: trace || {
          instanceId: this.id,
        },
      });
    };

    this.patchSourceNodeProp = (id, prop, value, trace) => {
      this.applyPatch({
        operations: [
          {
            op: nodeOperations.PatchSourceNodeProp,
            id,
            prop,
            value,
          },
        ],

        trace: trace || {
          instanceId: this.id,
        },
      });
    };

    this.moveNode = (id, newParentId, newPath, trace = {}) => {
      this.applyPatch({
        operations: [
          {
            op: nodeOperations.MoveNode,
            id,
            newParentId,
            newPath,
          },
        ],

        trace,
      });
    };

    this.removeNode = (id, trace) => {
      this.applyPatch({
        operations: [
          {
            op: nodeOperations.RemoveNode,
            id,
          },
        ],

        trace: trace || {
          instanceId: this.id,
        },
      });
    };

    this.id = e.id || this._idGenerator(e);

    this._idGenerator = (node) => {
      const parentNode = node.parentId
        ? this.getNodeById(node.parentId)
        : undefined;
      const idGenerator = node.idGenerator || this._handleIdGeneration;
      return idGenerator(
        node,
        formatUri(node.path, parentNode ? parentNode.uri : undefined),
      );
    };
  }

  _handleIdGeneration() {
    return generateGraphId();
  }

  get nodeValues() {
    return Object.values(this.dom.nodes);
  }

  get sourceNodes() {
    return this.nodeValues.filter((e) => e.category === NodeCategories.Source);
  }

  get virtualNodes() {
    return this.nodeValues.filter((e) => e.category === NodeCategories.Virtual);
  }

  get rootNodes() {
    return this.sourceNodes.filter((e) => !e.parent);
  }

  applyPatch(patch) {
    const _patch = Object.assign(Object.assign({}, patch), {
      trace: Object.assign(
        {
          instanceId: this.id,
        },
        patch.trace,
      ),
    });

    return {
      operations: _patch.operations.map(
        handleOperation(this.dom, _patch, this.notifier),
      ),
      trace: _patch.trace || null,
    };
  }

  dehydrate() {
    return (function (e) {
      const t = {
        nodes: {},
      };

      for (const n in e.nodes) {
        if ({}.hasOwnProperty.call(e.nodes, n)) {
          t.nodes[n] = e.nodes[n].dehydrate();
        }
      }

      return t;
    })(this.dom);
  }

  getNodeByPathWithParent(uri, parentId) {
    const parentNode = parentId && this.getNodeById(parentId);
    const nodeUriWithParentUri = formatUri(
      uri,
      parentNode ? parentNode.uri : '',
    );
    return this.getNodeByUri(nodeUriWithParentUri);
  }
}

export default Graph;
