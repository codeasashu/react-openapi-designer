import {makeObservable, action, observable, reaction, computed} from 'mobx';
import {
  eventTypes,
  raiseErrorIfNotParentNode,
  NodeTypes,
  isOperationNode,
  isParentNode,
} from '../utils/tree';
import ComputedTree from '../Tree/ComputedTree';
import Tree from '../Tree/Tree';
import {ContextResolver, getChildNode} from '../Tree/Resolver';
import TreeOrder from '../Tree/Order';
import TreeStore from '../Tree/Store';
import TreeState from '../Tree/State';
import ApiTreeStore from './apiTreeStore';
import {icons} from '../model';

class DesignTreeStore extends ApiTreeStore {
  activeTreeNode;

  constructor(e) {
    super(e);
    makeObservable(this, {
      //tree: observable,
      //treeState: observable,
      activeTreeNode: observable.ref,
      activeGraphNode: computed,
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
            console.log('add new path');
            this.treeStore.events.emit(eventTypes.CreatePath, node.id);
          },
        });
      } else if (node.type === 'models') {
        menuItems.push({
          text: 'New Model',
          onClick: () => {
            this.treeStore.events.emit(eventTypes.CreateModel, node.id);
          },
        });
      } else if (node.type === 'responses') {
        menuItems.push({
          text: 'New Response',
          onClick: () => {
            console.log('add new response');
            this.treeStore.events.emit(eventTypes.CreateResponse, node.id);
          },
        });
      } else if (node.type === 'examples') {
        menuItems.push({
          text: 'New Example',
          onClick: () => {
            console.log('add new example');
            this.treeStore.events.emit(eventTypes.CreateExample, node.id);
          },
        });
      } else if (node.type === 'parameters') {
        ['query', 'path', 'header', 'cookie'].forEach((param) => {
          const paramName = param[0].toUpperCase() + param.slice(1);
          menuItems.push({
            text: `New ${paramName} parameter`,
            onClick: () => {
              console.log(`add new ${param} parameter`);
              this.treeStore.events.emit(eventTypes.CreateParameter, {
                nodeid: node.id,
                parameter: paramName,
              });
            },
          });
        });
      } else if (node.type === 'requestBodies') {
        menuItems.push({
          text: 'New Request Body',
          onClick: () => {
            console.log('add new requestBody');
            this.treeStore.events.emit(eventTypes.CreateRequestBody, node.id);
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
              this.treeStore.events.emit(eventTypes.RenameNode, node.id);
            },
          },
          {
            text: 'Delete ' + node.type,

            onClick: () => {
              console.log('Deleteing ', node.type);
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
              console.log('deleting operation for', item, node);
              this.treeStore.events.emit(eventTypes.DeleteHttpMethod, {
                nodeid: node.id,
                method: item.id,
              });
            },
          })),
        });
      }

      return menuItems;
    };

    this.rowHeight = (e) =>
      'path' === e.type &&
      e.metadata !== undefined &&
      'operations' in e.metadata &&
      e.metadata.operations.items.length > 0
        ? 50
        : 30;

    this.handleNodeClick = (e, node) => {
      console.log('clicked node', node, e);
      switch (node.type) {
        case NodeTypes.Models:
        case NodeTypes.Paths:
        case NodeTypes.Responses:
        case NodeTypes.Parameters:
        case NodeTypes.RequestBodies:
        case NodeTypes.Examples:
          console.log('clicked nod2', node);
          raiseErrorIfNotParentNode(node);
          this.treeStore.toggleExpand(node);
          break;
        case NodeTypes.Overview:
          this.setActiveNode(this.stores.graphStore.getNodeById(node.id));
          this.stores.uiStore.unsetActiveSymbolNode();
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
          this.setActiveNode(this.stores.graphStore.getNodeById(node.id));
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
    this.tree.setRoot(Tree.createArtificialRoot());
  }

  registerEventListeners() {
    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidAddSourceMapNode,
      action(({node: {id}}) => {
        const node = this.stores.graphStore.getNodeById(id); // t

        console.log('AAdded SourceMapNode', node);
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
          console.log('invaalid tree');
          //this.invalidateTree();
          this.treeStore.tree.invalidate();
          return;
        }

        const parentNode = this.tree.findById(node.parentId); // n

        if (parentNode !== undefined) {
          if (node.category === NodeTypes.Operation) {
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
              this.invalidateTree();
            }
          }
        }
      }),
    );
  }

  //_getActiveHttpServiceParentId() {
  //const e = Je(
  //this.stores.oasStore.service.activeHttpNode,
  //undefined,
  //undefined,
  //);

  //if (e.parentId === undefined) {
  //throw new TypeError('activeHttpNode.parentId is undefined');
  //}

  //return e.parentId;
  //}

  //_getAssociatedOperationNode(node) {
  //const {metadata} = node;

  //const {activeOperationNode: n} = this.stores.oasStore.service;

  //if (n !== undefined && t !== undefined && 'operations' in t) {
  //if (t.operations.items.some((e) => n.id === e.id)) {
  //return n;
  //} else {
  //0;
  //return;
  //}
  //}
  //}

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
  //this.stores.graphStore.notifier.on(
  //vt.a.DidRemoveNode,
  //Object(p.action)(
  //({
  //id: e,

  //node: {parentId: t},
  //}) => {
  //var n;
  //let r = this.tree.findById(e);

  //if (r !== undefined) {
  //if (
  //cl.Models === r.type ||
  //cl.Paths === r.type ||
  //cl.Responses === r.type ||
  //cl.Parameters === r.type ||
  //cl.Examples === r.type ||
  //cl.RequestBodies === r.type
  //) {
  //this.invalidateTree();
  //return;
  //} else {
  //if (
  //cl.Model === r.type ||
  //cl.Path === r.type ||
  //cl.Response === r.type ||
  //cl.Parameter === r.type ||
  //cl.Example === r.type ||
  //cl.RequestBody === r.type
  //) {
  //this.tree.removeNode(r);
  //return;
  //} else {
  //0;
  //return;
  //}
  //}
  //}

  //const i =
  //t !== undefined
  //? this.stores.graphStore.getNodeById(t)
  //: undefined;

  //if (Hi(i)) {
  //if (
  //!((n = this.tree.findById(i.id)) === null || n === undefined)
  //) {
  //n.metadata.operations.remove(e);
  //}
  //}
  //},
  //),
  //),
  //]);
  //}

  //registerCommands() {
  //this.registerTreeHandler(ve.CreateModel, async (e) => {
  //if (e === null) {
  //throw new TypeError('Called DesignTreeCommands.CreateModel on root');
  //}

  //Object(Ka.assertParentNode)(e);
  //const t = cl.Model;

  //const {name: n} = await this.createNewNode(
  //{
  //type: t,
  //},
  //e,
  //bl(pl[cl.Model], {
  //lower: false,
  //}),
  //);

  //const r = new Gu();
  //r.data.type = 'embedded';
  //r.data.name = n;
  //r.data.parentNodeId = this._getActiveHttpServiceParentId();
  //await this.stores.createNodeStore.create(r);
  //});

  //this.registerTreeHandler(ve.CreateResponse, async (e) => {
  //if (e === null) {
  //throw new TypeError('Called DesignTreeCommands.CreateResponse on root');
  //}

  //Object(Ka.assertParentNode)(e);

  //const {id: t} = Xe(
  //this.stores.uiStore.activeSourceNode,
  //undefined,
  //this.stores.graphStore,
  //);

  //const {name: n} = await this.createNewNode(
  //{
  //type: cl.Response,
  //},
  //e,
  //bl(pl[cl.Response], {
  //lower: false,
  //}),
  //);

  //const r = await this.stores.oasStore.service.addSharedResponse({
  //sourceNodeId: t,
  //name: n,
  //});

  //this.setActiveNode(r);
  //});

  //this.registerTreeHandler(ve.CreateParameter, async (e, t) => {
  //if (e === null) {
  //throw new TypeError(
  //'Called DesignTreeCommands.CreateParameter on root',
  //);
  //}

  //Object(Ka.assertParentNode)(e);

  //const {id: n} = Xe(
  //this.stores.uiStore.activeSourceNode,
  //undefined,
  //this.stores.graphStore,
  //);

  //const {name: r} = await this.createNewNode(
  //{
  //type: cl.Parameter,
  //},
  //e,
  //bl(pl[cl.Parameter], {
  //lower: false,
  //}),
  //);

  //const i = await this.stores.oasStore.service.addSharedParameter({
  //sourceNodeId: n,
  //name: r,
  //parameterType: t,
  //});

  //this.setActiveNode(i);
  //});

  //this.registerTreeHandler(ve.CreateExample, async (e) => {
  //if (e === null) {
  //throw new TypeError('Called DesignTreeCommands.CreateExample on root');
  //}

  //Object(Ka.assertParentNode)(e);

  //const {id: t} = Xe(
  //this.stores.uiStore.activeSourceNode,
  //undefined,
  //this.stores.graphStore,
  //);

  //const {name: n} = await this.createNewNode(
  //{
  //type: cl.Example,
  //},
  //e,
  //bl(pl[cl.Example], {
  //lower: false,
  //}),
  //);

  //const r = await this.stores.oasStore.service.addSharedExample({
  //sourceNodeId: t,
  //name: n,
  //});

  //this.setActiveNode(r);
  //});

  //this.registerTreeHandler(ve.CreateRequestBody, async (e) => {
  //if (e === null) {
  //throw new TypeError(
  //'Called DesignTreeCommands.CreateRequestBody on root',
  //);
  //}

  //Object(Ka.assertParentNode)(e);

  //const {id: t} = Xe(
  //this.stores.uiStore.activeSourceNode,
  //undefined,
  //this.stores.graphStore,
  //);

  //const {name: n} = await this.createNewNode(
  //{
  //type: cl.RequestBody,
  //},
  //e,
  //bl(pl[cl.RequestBody], {
  //lower: false,
  //}),
  //);

  //const r = await this.stores.oasStore.service.addSharedRequestBody({
  //sourceNodeId: t,
  //name: n,
  //});

  //this.setActiveNode(r);
  //});

  //this.registerTreeHandler(ve.CreatePath, async (e) => {
  //Object(Ka.assertParentNode)(e);

  //const {name: t} = await this.createNewNode(
  //{
  //type: cl.Path,
  //},
  //e,
  //bl(pl[cl.Path]),
  //);

  //const n = new zu(this.stores);
  //n.data.parentNodeId = this._getActiveHttpServiceParentId();
  //n.data.path = t;
  //n.data.tags = [];

  //n.data.methods = {
  //get: 'Your GET endpoint',
  //};

  //await this.stores.createNodeStore.create(n);
  //});

  //this.registerTreeHandler(ve.Rename, async (e) => {
  //if (e === null) {
  //throw new TypeError('Called DesignTreeCommands.Rename on root');
  //}

  //const t =
  //cl.Model === e.type ||
  //cl.Response === e.type ||
  //cl.Parameter === e.type ||
  //cl.Example === e.type ||
  //cl.RequestBody === e.type;

  //const {name: n} = await this.treeStore.rename(
  //e,
  //e.type === undefined
  //? undefined
  //: bl(pl[e.type], {
  //prettify: cl.Path !== e.type ? N.a : undefined,
  //lower: !t,
  //}),
  //);

  //if (t) {
  //this.stores.graphStore.renameNode(e.id, n);
  //} else {
  //if (cl.Path === e.type) {
  //this.stores.oasStore.path.updatePath(n, e.id);
  //}
  //}

  //Object(p.runInAction)(() => {
  //e.name = n;
  //});
  //});

  //this.registerTreeHandler(nodeOperations.DeleteOperation, async (node) => {
  //if (node === null) {
  //throw new TypeError(
  //'Called DesignTreeCommands.DeleteOperation on root',
  //);
  //}

  //const t = this._getAssociatedOperationNode(e);

  //if (t === undefined) {
  //throw new Error('Could not link operation node with tree node');
  //}

  //await this.stores.commandRegistry.execute(he.Delete, t.id);
  //});
  //}

  //isInterestingNode(e) {
  //if (!(Hi(e) || Qi(e) || qi(e) || Xi(e) || Ki(e) || Bi(e))) {
  //return Yi(e);
  //}
  //}
}

export default DesignTreeStore;
