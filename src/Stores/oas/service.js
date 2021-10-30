import {reaction, action, computed, makeObservable, observable} from 'mobx';
import {generateOperationId} from '../../utils';
import {sortOperations} from '../../utils/schema';
import {
  NodeCategories,
  NodeTypes,
  eventTypes,
  nodeOperations,
  isOperationNode,
} from '../../utils/tree';

class Service {
  httpServices = [];
  activeOperationNodes = [];
  activeOperationNode;

  constructor(e) {
    makeObservable(this, {
      httpServices: observable,
      populateHttpServices: action,
      hasAnyHttpServices: computed,
      activeGraphNode: computed,
      activePathNode: computed,
      activeOperationNodes: observable,
      populateActiveOperationNodes: action,
      setActiveOperationNode: action,
      activeOperationNode: observable.ref,
      activeHttpNode: computed,
    });
    this.stores = e;

    this.httpServices = [];
    this.activeOperationNodes = [];

    this.addOperation = (
      operation,
      value = {
        // t
        summary: '',
        operationId: generateOperationId(operation.path, operation.method),

        responses: {
          200: {
            description: 'OK',
          },
        },
      },
    ) => {
      const {
        sourceNodeId, //n
        path, //r
        method, //i
        setActive, //o
      } = operation;

      //Xe(this.stores.graphStore.getNodeById(n), n, this.stores.graphStore)
      const jsonPath = ['paths', path, method]; // a

      this.stores.graphStore.graph.patchSourceNodeProp(
        sourceNodeId,
        'data.parsed',
        [
          {
            op: nodeOperations.Add,
            path: jsonPath,
            value,
          },
        ],
      );

      if (setActive) {
        //this.stores.graphStore.waitUntilIdle()
        this.populateActiveOperationNodes();
        this.setActiveOperationNode(method);

        if (this.activeOperationNode) {
          this.stores.uiStore.setActiveNode(this.activeOperationNode);
        }
      }
    };
  }

  get currentSpec() {
    const activeNode = this.stores.uiStore.activeSourceNode;
    return activeNode && activeNode.spec;
  }

  registerGraphEvents() {
    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidMoveNode,
      action(({id: e}) => {
        var t;
        const n = this.stores.graphStore.getNodeById(e);

        if (
          !(
            NodeCategories.SourceMap !== (n == null ? undefined : n.category) ||
            n.parentId !=
              ((t = this.activePathNode) === null || t === undefined
                ? undefined
                : t.id) ||
            NodeCategories.Operation !== n.type
          )
        ) {
          this.populateActiveOperationNodes();
        }
      }),
    );

    //this.stores.graphStore.eventEmitter.on(
    //eventTypes.DidAddNode,
    //({node: e}) => {
    //if (
    //NodeCategories.Virtual === e.category &&
    //NodeTypes.HttpService === e.type
    //) {
    //this.populateHttpServices();
    //}
    //},
    //);

    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidAddSourceMapNode,
      ({node: e}) => {
        var t;

        if (
          !(
            e.parentId !=
              ((t = this.activePathNode) === null || t === undefined
                ? undefined
                : t.id) || NodeTypes.Operation !== e.type
          )
        ) {
          this.populateActiveOperationNodes();
        }
      },
    );

    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidRemoveNode,
      ({node}) => {
        if (node && NodeCategories.Source !== node.category) {
          if (NodeCategories.SourceMap === node.category) {
            this.populateActiveOperationNodes();
          }
        } else {
          this.populateHttpServices();
        }
      },
    );
  }

  registerReactions() {
    reaction(
      () => {
        var e;

        if ((e = this.activePathNode) === null || e === undefined) {
          0;
          return;
        } else {
          return e.id;
        }
      },
      () => {
        this.populateActiveOperationNodes();
      },
      {
        fireImmediately: true,
      },
    );

    reaction(
      () => ({
        activeSymbolNode: this.stores.uiStore.activeSymbolNode,
        activePathNode: this.activePathNode,
        activeOperationNodes: this.activeOperationNodes,
      }),
      () => {
        this.setActiveOperationNode();
      },
      {
        fireImmediately: true,
      },
    );
  }

  activate() {
    this.populateHttpServices();
    this.registerGraphEvents();
    this.registerReactions();
  }

  populateHttpServices() {
    this.httpServices =
      this.stores.graphStore.graph.getNodesByType('http_service');
  }

  get hasAnyHttpServices() {
    return this.httpServices.length > 0;
  }

  get activeGraphNode() {
    let activeNode = this.stores.uiStore.activeNode;
    return activeNode && activeNode.type === NodeTypes.Operation
      ? activeNode.parent
      : activeNode;
  }

  get activePathNode() {
    return this.stores.oasStore.path.activePathNode;
  }

  populateActiveOperationNodes() {
    this.activeOperationNodes = this.activePathNode
      ? sortOperations(
          this.activePathNode.children.filter(isOperationNode),
          'path',
        )
      : [];
  }

  setActiveOperationNode(e) {
    const {activeSymbolNode: t} = this.stores.uiStore;

    if (isOperationNode(t)) {
      this.activeOperationNode = t;
    } else {
      if (this.activePathNode) {
        this.activeOperationNode = this.activeOperationNodes.find(
          e ? (t) => isOperationNode(t) && e === t.path : isOperationNode,
        );
      }
    }
  }

  //async addSharedResponse({sourceNodeId: e, name: t}) {
  //const n = this.stores.graphStore.getNodeById(e);
  //const r = ['components', 'responses'];

  //const i = [
  //...r,
  //I(t, {
  //lower: false,
  //}),
  //];

  //const o = n.uri + Object(te.pathToPointer)(i).slice(1);

  //this.stores.graphStore.graph.patchSourceNodeProp(e, 'data.parsed', [
  //...(Object(S.hasIn)(n.data.parsed, r)
  //? []
  //: [
  //{
  //op: _t.b.Add,
  //path: r,
  //value: {},
  //},
  //]),
  //{
  //op: _t.b.Add,
  //path: i,

  //value: {
  //description: 'Example response',

  //content: {
  //'application/json': {
  //schema: {
  //properties: {
  //id: {
  //type: 'string',
  //},
  //},
  //},
  //},
  //},
  //},
  //},
  //]);

  //await this.stores.graphStore.waitUntilIdle();
  //return Je(
  //this.stores.graphStore.getNodeByUri(o),
  //o,
  //this.stores.graphStore,
  //);
  //}

  //async addSharedExample({sourceNodeId: e, name: t}) {
  //const n = Xe(
  //this.stores.graphStore.getNodeById(e),
  //e,
  //this.stores.graphStore,
  //);
  //const r = ['components', 'examples'];

  //const i = [
  //...r,
  //I(t, {
  //lower: false,
  //}),
  //];

  //const o = n.uri + Object(te.pathToPointer)(i).slice(1);

  //this.stores.graphStore.graph.patchSourceNodeProp(e, 'data.parsed', [
  //...(Object(S.hasIn)(n.data.parsed, r)
  //? []
  //: [
  //{
  //op: _t.b.Add,
  //path: r,
  //value: {},
  //},
  //]),
  //{
  //op: _t.b.Add,
  //path: i,

  //value: {
  //value: {
  //description: 'Example shared example',
  //type: 'object',

  //properties: {
  //id: {
  //type: 'string',
  //},
  //},

  //required: ['id'],
  //},
  //},
  //},
  //]);

  //await this.stores.graphStore.waitUntilIdle();
  //return Je(
  //this.stores.graphStore.getNodeByUri(o),
  //o,
  //this.stores.graphStore,
  //);
  //}

  //async addSharedRequestBody({sourceNodeId: e, name: t}) {
  //const n = Xe(
  //this.stores.graphStore.getNodeById(e),
  //e,
  //this.stores.graphStore,
  //);
  //const r = ['components', 'requestBodies'];

  //const i = [
  //...r,
  //I(t, {
  //lower: false,
  //}),
  //];

  //const o = n.uri + Object(te.pathToPointer)(i).slice(1);

  //this.stores.graphStore.graph.patchSourceNodeProp(e, 'data.parsed', [
  //...(Object(S.hasIn)(n.data.parsed, r)
  //? []
  //: [
  //{
  //op: _t.b.Add,
  //path: r,
  //value: {},
  //},
  //]),
  //{
  //op: _t.b.Add,
  //path: i,

  //value: {
  //content: {
  //'application/json': {
  //schema: {
  //type: 'object',
  //},
  //},
  //},
  //},
  //},
  //]);

  //await this.stores.graphStore.waitUntilIdle();
  //return Je(
  //this.stores.graphStore.getNodeByUri(o),
  //o,
  //this.stores.graphStore,
  //);
  //}

  //async addSharedParameter({sourceNodeId: e, name: t, parameterType: n}) {
  //const r = Xe(
  //this.stores.graphStore.getNodeById(e),
  //e,
  //this.stores.graphStore,
  //);
  //const i =
  //b.d.OAS2 === r.spec ? ['parameters'] : ['components', 'parameters'];

  //const o = [
  //...i,
  //I(t, {
  //lower: false,
  //}),
  //];

  //const a = r.uri + Object(te.pathToPointer)(o).slice(1);

  //this.stores.graphStore.graph.patchSourceNodeProp(e, 'data.parsed', [
  //...(Object(S.hasIn)(r.data.parsed, i)
  //? []
  //: [
  //{
  //op: _t.b.Add,
  //path: i,
  //value: {},
  //},
  //]),
  //{
  //op: _t.b.Add,
  //path: o,

  //value: {
  //name: t,
  //in: n,
  //required: n === 'path',

  //schema: {
  //type: 'string',
  //},
  //},
  //},
  //]);

  //await this.stores.graphStore.waitUntilIdle();
  //return Je(
  //this.stores.graphStore.getNodeByUri(a),
  //a,
  //this.stores.graphStore,
  //);
  //}

  get activeHttpNode() {
    if (this.stores.uiStore.activeSourceNodeId !== undefined) {
      return this.httpServices.find(
        (e) => this.stores.uiStore.activeSourceNodeId === e.parentId,
      );
    } else {
      return null;
    }
  }
}

export default Service;
