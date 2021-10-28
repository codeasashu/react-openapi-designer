import {
  makeObservable,
  runInAction,
  action,
  observable,
  reaction,
  computed,
} from 'mobx';
import {
  eventTypes,
  raiseErrorIfNotParentNode,
  NodeTypes,
  isOperationNode,
  isParentNode,
  generateUUID,
  nodeOperations,
} from '../utils/tree';
import ComputedTree from '../Tree/ComputedTree';
//import Tree from '../Tree/Tree';
import {ContextResolver, getChildNode} from '../Tree/Resolver';
import TreeOrder from '../Tree/Order';
import TreeStore from '../Tree/Store';
import TreeState from '../Tree/State';
import ApiTreeStore from './apiTreeStore';
import {icons} from '../model';
import Node from '../Tree/Node';
import PathNode from './nodes/pathNode';
import ModelNode from './nodes/modelNode';
import ParentNode from '../Tree/ParentNode';
import {isValidPathMethod, decodeUriFragment} from '../utils';

class DesignTreeStore extends ApiTreeStore {
  activeTreeNode;

  constructor(e) {
    super(e);
    makeObservable(this, {
      //tree: observable,
      //treeState: observable,
      activeTreeNode: observable.ref,
      activeGraphNode: computed,
      deleteNode: action,
    });
    this.stores = e;
    this.graphRootNode = undefined;
    this.sidebarTreeId = 'design';
    this.menuModuleId = 'design';
    this.menuItems = [];

    this.generateContextMenu = (node) => {
      const menuItems = [];
      if (node.type === 'paths') {
        menuItems.push({
          text: 'New Path',
          onClick: () => {
            this.treeStore.events.emit(eventTypes.CreatePath, node);
          },
        });
      } else if (node.type === 'models') {
        menuItems.push({
          text: 'New Model',
          onClick: () => {
            this.treeStore.events.emit(eventTypes.CreateModel, node);
          },
        });
      } else if (node.type === 'responses') {
        menuItems.push({
          text: 'New Response',
          onClick: () => {
            this.treeStore.events.emit(eventTypes.CreateResponse, node);
          },
        });
      } else if (node.type === 'examples') {
        menuItems.push({
          text: 'New Example',
          onClick: () => {
            this.treeStore.events.emit(eventTypes.CreateExample, node);
          },
        });
      } else if (node.type === 'parameters') {
        ['query', 'path', 'header', 'cookie'].forEach((param) => {
          const parameterType = param[0].toUpperCase() + param.slice(1);
          menuItems.push({
            text: `New ${parameterType} parameter`,
            onClick: () => {
              this.treeStore.events.emit(eventTypes.CreateParameter, {
                node,
                parameterType,
              });
            },
          });
        });
      } else if (node.type === 'requestBodies') {
        menuItems.push({
          text: 'New Request Body',
          onClick: () => {
            this.treeStore.events.emit(eventTypes.CreateRequestBody, node);
          },
        });
      }

      if (
        [
          'path',
          'model',
          'response',
          'example',
          'parameter',
          'requestBody',
        ].indexOf(node.type) >= 0
      ) {
        if (menuItems.length) {
          menuItems.push({
            divider: true,
          });
        }

        menuItems.push(
          {
            text: 'Rename',

            onClick: () => {
              this.treeStore.events.emit(eventTypes.RenameNode, node);
            },
          },
          {
            text: 'Delete ' + node.type,

            onClick: () => {
              this.treeStore.events.emit(eventTypes.DeleteNode, node.id);
            },
          },
        );
      }

      if (node.type === 'path' && 'operations' in node.metadata) {
        menuItems.push({
          text: 'Delete Operation',
          children: node.metadata.operations.items.map((item) => ({
            text: '' + item.method.toUpperCase(),
            onClick: () => {
              const _node = this.stores.graphStore.getNodeById(item.id);
              this.stores.graphStore.graph.patchSourceNodeProp(
                _node.parentSourceNode.id,
                'data.parsed',
                [
                  {
                    op: nodeOperations.Remove,
                    path: _node.relativeJsonPath,
                  },
                ],
              );
              this.invalidateTree();
              //this.treeStore.events.emit(eventTypes.DeleteHttpMethod, {
              //nodeid: node.id,
              //method: item.id,
              //});
            },
          })),
        });
      }

      return menuItems;
    };

    this.rowHeight = (e) => {
      return NodeTypes.Path === e.type &&
        e.metadata !== undefined &&
        'operations' in e.metadata &&
        e.metadata.operations.items.length > 0
        ? 50
        : 30;
    };

    this.handleNodeClick = (e, node) => {
      switch (node.type) {
        case NodeTypes.Models:
        case NodeTypes.Paths:
        case NodeTypes.Responses:
        case NodeTypes.Parameters:
        case NodeTypes.RequestBodies:
        case NodeTypes.Examples:
          raiseErrorIfNotParentNode(node);
          this.treeStore.toggleExpand(node);
          //this.setActiveNode(this.stores.graphStore.getNodeById(node.id));
          break;
        case NodeTypes.Overview:
          this.setActiveNode(this.stores.graphStore.getNodeById(node.id));
          //this.stores.uiStore.unsetActiveSymbolNode();
          break;
        case NodeTypes.Path:
          if (node.metadata.operations.items.length > 0) {
            const activeMethodNode = node.metadata.operations.items[0].id;
            this.setActiveNode(
              this.stores.graphStore.getNodeById(activeMethodNode),
            );
          } else {
            this.setActiveNode(this.stores.graphStore.getNodeById(node.id));
          }

          break;
        default:
          console.log('ncc', node);
          this.setActiveNode(this.stores.graphStore.getNodeById(node.id));
      }
    };

    this.createNewNode = async (node, parent, validator) => {
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
        const _newNode = await this.treeStore.create(
          isParentNode(newNode) ? new ParentNode(newNode) : new Node(newNode),
          parent,
          validator,
        );

        this.tree.removeNode(_newNode);

        return _newNode;
      } finally {
        this.newNodeId = undefined;
      }
    };

    this.storageKey = 'oasDesigner-designTreeExpanded';

    this.tree = new ComputedTree(ContextResolver.bind(this), {
      order: TreeOrder,
    });

    this.treeStore = new TreeStore(this.tree, new TreeState(), {
      defaultExpandedDepth: 1,
      icons,
    });

    this.registerTreeEvents();
  }

  @action
  activate() {
    this.tree.invalidate();
  }

  get activeGraphNode() {
    const activeNode = this.stores.uiStore.activeNode;

    if (isOperationNode(activeNode)) {
      return activeNode.parent;
    } else {
      return activeNode;
    }
  }

  registerReactions() {
    super.registerReactions();

    reaction(
      () => this.stores.oasStore.service.activeHttpNode,
      () => {
        this.invalidateTree();
      },
      {
        fireImmediately: true,
      },
    );

    reaction(
      () => ({
        activeGraphNode: this.activeGraphNode,
        versionCounter: this.tree.versionCounter,
      }),
      ({activeGraphNode}) => {
        this.activeTreeNode =
          activeGraphNode && this.tree.findById(activeGraphNode.id);
      },
      {
        fireImmediately: true,
      },
    );
  }

  setActiveNode(node) {
    this.stores.uiStore.setActiveNode(node);

    //if (NodeCategories.SourceMap === node.category) {
    //if (
    //!(
    //(t = this.stores.editorStore.activeEditor) === null || t === undefined
    //)
    //) {
    //t.scrollToSymbol(e);
    //}
    //}
  }

  invalidateTree() {
    this.tree.invalidate();
    //this.tree.setRoot(Tree.createArtificialRoot());
  }

  registerEventListeners() {
    this.registerGraphEventListeners();
    this.registerTreeEventListeners();
  }

  async createRequestBody(parentNode) {
    const sourceNode = this.stores.graphStore.rootNode;
    if (!isParentNode(parentNode)) {
      throw new Error(`Provided node is not a parent node ${parentNode.id}`);
    }
    const {name} = await this.createNewNode(
      {type: NodeTypes.RequestBody},
      parentNode,
    );
    this.stores.oasStore.addSharedRequestBody({
      sourceNodeId: sourceNode.id,
      name,
    });
  }

  async createExample(parentNode) {
    const sourceNode = this.stores.graphStore.rootNode;
    if (!isParentNode(parentNode)) {
      throw new Error(`Provided node is not a parent node ${parentNode.id}`);
    }
    const {name} = await this.createNewNode(
      {type: NodeTypes.Example},
      parentNode,
    );

    this.stores.oasStore.addSharedExample({
      sourceNodeId: sourceNode.id,
      name,
    });
  }

  async createResponse(parentNode) {
    const sourceNode = this.stores.graphStore.rootNode;
    if (!isParentNode(parentNode)) {
      throw new Error(`Provided node is not a parent node ${parentNode.id}`);
    }
    const {name} = await this.createNewNode(
      {type: NodeTypes.Response},
      parentNode,
    );

    this.stores.oasStore.addSharedResponse({
      sourceNodeId: sourceNode.id,
      name,
    });
  }

  async createParameter({node: parentNode, parameterType}) {
    const sourceNode = this.stores.graphStore.rootNode;
    if (!isParentNode(parentNode)) {
      throw new Error(`Provided node is not a parent node ${parentNode.id}`);
    }
    const {name} = await this.createNewNode(
      {type: NodeTypes.Parameter},
      parentNode,
    );

    this.stores.oasStore.addSharedParameter({
      sourceNodeId: sourceNode.id,
      name,
      parameterType,
    });
  }

  async createPath(parentNode) {
    if (!isParentNode(parentNode)) {
      throw new Error(`Provided node is not a parent node ${parentNode.id}`);
    }

    const {name} = await this.createNewNode(
      {
        type: NodeTypes.Path,
      },
      parentNode,
    );

    const pathNode = new PathNode({path: name, parentNodeId: parentNode.id});
    pathNode.create(this.stores.graphStore);
  }

  async createModel(parentNode) {
    if (!isParentNode(parentNode)) {
      throw new Error(`Provided node is not a parent node ${parentNode.id}`);
    }

    const {name} = await this.createNewNode(
      {
        type: NodeTypes.Model,
      },
      parentNode,
    );

    const modelNode = new ModelNode({name, parentNodeId: parentNode.id});
    modelNode.create(this.stores.graphStore);
  }

  async deleteNode(nodeId) {
    await this.stores.graphStore.removeNode(nodeId);
    runInAction(() => {
      this.invalidateTree();
    });
  }

  async renameNode(node) {
    if (node === null) {
      throw new TypeError('Called DesignTreeCommands.Rename on root');
    }

    const isComponentNode =
      NodeTypes.Model === node.type ||
      NodeTypes.Response === node.type ||
      NodeTypes.Parameter === node.type ||
      NodeTypes.Example === node.type ||
      NodeTypes.RequestBody === node.type;

    const {name} = await this.treeStore.rename(node);

    if (isComponentNode) {
      this.stores.graphStore.renameNode(node.id, name);
    } else {
      if (NodeTypes.Path === node.type) {
        this.stores.oasStore.path.updatePath(name, node.id);
      }
    }

    runInAction(() => {
      node.name = name;
    });
  }

  registerTreeEventListeners() {
    this.treeStore.events.on(
      eventTypes.CreateRequestBody,
      this.createRequestBody.bind(this),
    );

    this.treeStore.events.on(
      eventTypes.CreateExample,
      this.createExample.bind(this),
    );

    this.treeStore.events.on(
      eventTypes.CreateResponse,
      this.createResponse.bind(this),
    );

    this.treeStore.events.on(
      eventTypes.CreateParameter,
      this.createParameter.bind(this),
    );

    this.treeStore.events.on(eventTypes.CreatePath, this.createPath.bind(this));
    this.treeStore.events.on(
      eventTypes.CreateModel,
      this.createModel.bind(this),
    );

    this.treeStore.events.on(eventTypes.DeleteNode, this.deleteNode.bind(this));
    this.treeStore.events.on(eventTypes.RenameNode, this.renameNode.bind(this));
  }

  registerGraphEventListeners() {
    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidAddSourceMapNode,
      //eventTypes.DidPatchSourceNodePropComplete,
      action(({node: {id}}) => {
        const node = this.stores.graphStore.getNodeById(id); // t
        if (node === undefined || node.parentId === undefined) {
          return;
        }

        if (
          node.type === NodeTypes.Paths ||
          node.type === NodeTypes.Models ||
          node.type === NodeTypes.Responses ||
          node.type === NodeTypes.Parameters ||
          node.type === NodeTypes.Examples ||
          node.type === NodeTypes.RequestBodies
        ) {
          //this.invalidateTree();
          this.treeStore.tree.invalidate();
          return;
        }

        const parentNode = this.tree.findById(node.parentId); // n
        if (parentNode !== undefined) {
          if (node.type === NodeTypes.Operation) {
            const {operations} = parentNode.metadata;

            operations.add({
              id: node.id,
              method: node.path,
            });

            //if (operations.items.length === 0) {
            //this.treeStore.instanceRef.current.resetAfterIndex(Math.max(0, this.tree.indexOf(n) - 1))
            //}
          } else {
            if (isParentNode(parentNode)) {
              this.tree.insertNode(getChildNode(node, parentNode), parentNode);
            }
          }
          this.treeStore.tree.invalidate();
          //this.invalidateTree();
        }
      }),
    );

    //this.stores.graphStore.eventEmitter.on(
    //eventTypes.DidPatch,
    //({operations}) => {
    //if (
    //operations.length !== 1 ||
    //eventTypes.RemoveNode !== operations[0].op
    //) {
    //return;
    //}

    //const treeNode = this.tree.findById(operations[0].id);

    //if (treeNode !== undefined) {
    //this.tree.removeNode(treeNode);
    //}
    //},
    //);
    //

    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidUpdateNodeUri,
      action(() => {
        this.invalidateTree();
      }),
    );

    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidMoveNode,
      action(({id, newPath, newParentId}) => {
        const node = this.stores.graphStore.getNodeById(id);

        if (node === undefined) {
          return;
        }

        if (NodeTypes.Operation === node.type) {
          const parentNode = this.tree.findById(node.parent.id);

          if (parentNode === undefined) {
            return;
          }

          const {operations} = parentNode.metadata;

          operations.remove(node.id);

          if (isValidPathMethod(node.path)) {
            operations.add({
              id: node.id,
              method: node.path,
            });
          }

          return;
        }

        const treeNode = this.tree.findById(id);

        if (treeNode !== undefined && treeNode.parent !== null) {
          if (treeNode.parent.id !== newParentId) {
            this.tree.removeNode(treeNode);
            this.tree.insertNode(treeNode, treeNode.parent);
          }

          if (newPath !== undefined && treeNode.name !== newPath) {
            treeNode.name =
              NodeTypes.Path === treeNode.type
                ? decodeUriFragment(newPath)
                : newPath;
          }
        }
      }),
    );

    //this.stores.graphStore.eventEmitter.on(
    //eventTypes.DidChangeSourceNode,
    //action(({change: {prop: e, id: t}}) => {
    //if (e !== 'spec') {
    //return;
    //}

    //const n = this.stores.graphStore.getNodeById(t);

    //if (NodeTypes.Source !== (n == null ? undefined : n.category)) {
    //return;
    //}

    //const r = this.tree.treeMap.get(n.id);

    //if (r !== undefined && r.parent !== null) {
    //r.metadata.spec = n.spec;
    //this.tree.recompute(r.parent);
    //} else {
    //if (this.matchesFilter(t)) {
    //this.tree.insertGraphNode(n);
    //}
    //}
    //}),
    //);

    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidRemoveNode,
      action(({id, node: {parentId}}) => {
        let node = this.tree.findById(id); //r

        if (node !== undefined) {
          if (
            NodeTypes.Models === node.type ||
            NodeTypes.Paths === node.type ||
            NodeTypes.Responses === node.type ||
            NodeTypes.Parameters === node.type ||
            NodeTypes.Examples === node.type ||
            NodeTypes.RequestBodies === node.type
          ) {
            this.invalidateTree();
            return;
          } else {
            if (
              NodeTypes.Model === node.type ||
              NodeTypes.Path === node.type ||
              NodeTypes.Response === node.type ||
              NodeTypes.Parameter === node.type ||
              NodeTypes.Example === node.type ||
              NodeTypes.RequestBody === node.type
            ) {
              this.tree.removeNode(node);
              this.invalidateTree();
              return;
            } else {
              return;
            }
          }
        }

        const parent =
          parentId !== undefined
            ? this.stores.graphStore.getNodeById(parentId)
            : undefined;

        if (parent.category === NodeTypes.Path) {
          const treeParent = this.tree.findById(parent.id);
          if (treeParent) {
            treeParent.metadata.operations.remove(id);
          }
        }
      }),
    );
  }
  //registerGraphEvents() {
  //this.activeDisposables.pushAll([
  //this.stores.graphStore.notifier.on(
  //vt.a.DidMoveNode,
  //Object(p.action)(({id: e, newParentId: t, newPath: n}) => {
  //const r = this.stores.graphStore.getNodeById(e);

  //if (r === undefined || !this.isInterestingNode(r)) {
  //return;
  //}

  //if (Bi(r)) {
  //const e = this.tree.findById(r.parent.id);

  //if (e === undefined) {
  //return;
  //}

  //const {operations: t} = e.metadata;

  //t.remove(r.id);

  //if (
  //((e) => {
  //for (const t of hc) {
  //if (e === t) {
  //return true;
  //}
  //}

  //return false;
  //})(r.path)
  //) {
  //t.add({
  //id: r.id,
  //method: r.path,
  //});
  //}

  //return;
  //}

  //const i = this.tree.findById(e);

  //if (i !== undefined && i.parent !== null) {
  //if (i.parent.id !== t) {
  //this.tree.removeNode(i);
  //this.tree.insertNode(i, i.parent);
  //}

  //if (n !== undefined && i.name !== n) {
  //i.name =
  //cl.Path === i.type ? Object(te.decodePointerFragment)(n) : n;
  //}
  //}
  //}),
  //),
  //this.stores.graphStore.notifier.on(
  //vt.a.DidAddSourceMapNode,
  //Object(p.action)(({node: {id: e}}) => {
  //const t = this.stores.graphStore.getNodeById(e);

  //if (t === undefined || t.parentId === undefined) {
  //return;
  //}

  //if (Wi(t) || Vi(t) || Gi(t) || Ji(t) || Zi(t) || $i(t)) {
  //this.invalidateTree();
  //return;
  //}

  //if (!this.isInterestingNode(t)) {
  //return;
  //}

  //const n = this.tree.findById(t.parentId);

  //if (n !== undefined) {
  //if (Bi(t)) {
  //const {operations: e} = n.metadata;

  //const r = e.items.length === 0;
  //e.add(kl(t));

  //if (r) {
  //this.treeStore.instanceRef.current.resetAfterIndex(
  //Math.max(0, this.tree.indexOf(n) - 1),
  //);
  //}
  //} else {
  //if (Object(Ka.isParentNode)(n)) {
  //this.tree.insertNode(wl(t, n), n);
  //this.invalidateTree();
  //}
  //}
  //}
  //}),
  //),
}

export default DesignTreeStore;
