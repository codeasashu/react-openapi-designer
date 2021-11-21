import {observable, action, makeObservable, runInAction} from 'mobx';
import {join} from 'lodash';
import Graph from './graph';
import {recomputeGraphNodes} from './graph/addNode';
import {spec as defaultSpec} from '../datasets/openapi';
import {
  NodeCategories,
  taskTypes,
  nodeOperations,
  eventTypes,
} from '../datasets/tree';

class GraphStore {
  rootNode = undefined;
  eventEmitter = {};
  graph;

  constructor(e) {
    makeObservable(this, {
      rootNode: observable.ref,
      graph: observable,
      setRootNode: action,
    });
    this.props = e;

    this._parserOptions = {
      lineWidth: -1,
    };

    this.eventEmitter = this.props.eventEmitter;

    this.getNodeIdByUri = (uri) => {
      const node = this.graph.dom.nodesByUri[uri];
      return node === null || node === undefined ? null : node.id;
    };

    this.getNodeUriById = (nodeId) => {
      const node = this.graph.getNodeById(nodeId);
      return node === null || node === undefined ? null : node.uri;
    };

    this.getNodeByUri = (uri, ...additional) => {
      const node = this.getNodeIdByUri(
        additional.length === 0 ? uri : join(uri, ...additional),
      );
      return node !== undefined ? this.getNodeById(node) : null;
    };

    this.getNodeIdByFilename = (e) => this.getNodeIdByUri(this.cwd + '/' + e);
    this.getNodeByFilename = (e) => this.getNodeByUri(this.cwd + '/' + e);
    this.getFilename = (e) => e.uri.replace(this.cwd + '/', '');
    this.getNodeById = (e) => this.graph.getNodeById(e);

    this.renameNode = async (nodeId, name) => {
      //e,t
      const node = this.getNodeById(nodeId); // n

      //if (NodeCategories.Source === node.category) {
      //await this.queueTask({
      //op: be.a.MoveSourceNode,
      //nodeId: e,
      //newPath: t,
      //});
      //} else {
      if (NodeCategories.SourceMap !== node.category) {
        throw new Error('Node must be sourceMap Node');
      }

      if (node.relativeJsonPath.length === 0) {
        throw new Error('relativeJsonPath cannot be empty');
      }

      this.graph.patchSourceNodeProp(node.parentSourceNode.id, 'data.parsed', [
        {
          op: nodeOperations.Move,
          from: node.relativeJsonPath,
          path: [
            ...node.relativeJsonPath.slice(0, node.relativeJsonPath.length - 1),
            name,
          ],
        },
      ]);
    };

    this.removeNode = (nodeId) => {
      //e
      const node = this.getNodeById(nodeId); //t

      //if (NodeCategories.Source === node.category) {
      //return this.queueTask({
      //op: be.a.DeleteSourceNode,
      //nodeId: node.id,
      //});
      //}

      if (NodeCategories.SourceMap === node.category) {
        const sourceNode = node.parentSourceNode; // n
        if (!sourceNode) {
          return;
        }

        return this.graph.patchSourceNodeProp(sourceNode.id, 'data.parsed', [
          {
            op: nodeOperations.Remove,
            path: node.relativeJsonPath,
          },
        ]);
      }
    };
  }

  activate() {
    this.graph = new Graph({id: 'main-graph', notifier: this.eventEmitter});
    // resolve oas document
    this.setRootNode(
      this.graph.addNode({
        category: NodeCategories.Source,
        type: 'file',
        path: '/p/reference.yaml',
      }),
    );

    if (this.rootNode) {
      this.eventEmitter.emit(eventTypes.GraphNodeAdd, {
        task: taskTypes.ReadSourceNode,
        node: this.rootNode,
      });
    }
  }

  registerEventListeners() {
    //this.eventEmitter.on(eventTypes.DidAddSourceMapNode, ({node}) => {
    //if (isOperationLike(node)) {
    ////@TODO - Transformations should be added
    //const transformNode = {
    //method: node.path,
    //};

    //const virtualNode = {
    //category: NodeCategories.Virtual,
    //path: node.path + '-virtual',
    //type: NodeTypes.Operation,
    //data: transformNode,
    //parentId: node.id,
    //};
    //this.graph.addNode(virtualNode);
    //}
    //});

    this.eventEmitter.on(eventTypes.DidPatchSourceNodeProp, (operation) => {
      let task = {};
      runInAction(() => {
        const nodeId = operation.id;
        const node = this.graph.getNodeById(nodeId);
        if (operation.prop === 'data.parsed') {
          task = {
            op: eventTypes.ComputeSourceMap,
            nodeId,
            patch: operation.value,
          };
        }
        recomputeGraphNodes(node, this.graph, task);

        this.eventEmitter.emit(eventTypes.DidChangeSourceNode, {
          node,
          change: operation,
        });
      });

      this.eventEmitter.emit(eventTypes.DidPatchSourceNodePropComplete);
    });

    this.eventEmitter.on(eventTypes.GraphNodeAdd, ({task, node}) => {
      if (task === taskTypes.ReadSourceNode && node.parent == null) {
        runInAction(() => {
          this.graph.setSourceNodeProp(
            node.id,
            'data.original',
            JSON.stringify(defaultSpec),
          );
          this.graph.setSourceNodeProp(node.id, 'data.parsed', defaultSpec);

          recomputeGraphNodes(node, this.graph);
          this.props.uiStore.setActiveNode(node);
        });
      }
    });
  }

  setRootNode(node) {
    if (node.category !== NodeCategories.Source) {
      throw new Error('Only source nodes can be set as root node');
    }
    this.rootNode = node;
  }

  async getLocationForJsonPath(nodeId, jsonPath, closest = true) {
    const node = this.graph.getNodeById(nodeId);

    if (node && NodeCategories.Source === node.category) {
      const languageProvider = node.data.languageProvider;
      return (
        languageProvider &&
        languageProvider.getLocationForJsonPath(node.id, jsonPath, closest)
      );
    }
    return null;
  }

  async getJsonPathForPosition(nodeId, position) {
    const node = this.getNodeById(nodeId); // r

    if (node && NodeCategories.Source === node.category) {
      const languageProvider = node.data.languageProvider;
      return (
        languageProvider &&
        languageProvider.getJsonPathForPosition(node.id, position)
      );
    }
  }

  get isDirty() {
    return this.getDirtyNodes().length > 0;
  }

  getDirtyNodes() {
    const dirtyNodes = [];

    if (this.rootNode) {
      (function collectDirtyNodes(node, dirtyNodes) {
        if ('file' === node.type) {
          if (node.data.isDirty) {
            dirtyNodes.push(node);
          }
        } else if (node.children !== undefined && node.children.length > 0) {
          for (const child of node.children) {
            collectDirtyNodes(child, dirtyNodes);
          }
        }
      })(this.rootNode, dirtyNodes);
    }

    return dirtyNodes;
  }

  updateParserOptions(e) {
    Object.assign(this._parserOptions, e);
  }
}

export default GraphStore;
