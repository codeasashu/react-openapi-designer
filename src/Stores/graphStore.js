import {join} from 'lodash';
import Graph from './graph';
import {initGraph} from './graph/addNode';
import {exampleDoc} from '../model';

import {NodeCategories, eventTypes, taskTypes} from '../utils/tree';

class GraphStore {
  rootNode = undefined;
  eventEmitter = {};

  constructor(e) {
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
      console.log('emitting event');
      this.eventEmitter.emit(eventTypes.GraphNodeAdd, {
        task: taskTypes.ReadSourceNode,
        node: this.rootNode,
      });
    }
  }

  registerEventListeners() {
    this.eventEmitter.on(eventTypes.GraphNodeAdd, ({task, node}) => {
      if (task === taskTypes.ReadSourceNode && node.parent == null) {
        this.graph.setSourceNodeProp(
          node.id,
          'data.original',
          JSON.stringify(exampleDoc),
        );
        this.graph.setSourceNodeProp(node.id, 'data.parsed', exampleDoc);

        initGraph(node, this.graph);
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
