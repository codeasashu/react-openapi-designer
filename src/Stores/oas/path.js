import {
  makeObservable,
  observable,
  computed,
  reaction,
  action,
  when,
} from 'mobx';
import {last, get, filter} from 'lodash';
import {
  isOperationNode,
  isPathNode,
  NodeCategories,
  nodeOperations,
} from '../../utils/tree';
import {
  decodeUriFragment,
  getParametersFromPath,
  createPathParamSchema,
  updatePathFromParameters,
} from '../../utils/schema';
import {timer} from '../../utils';

class Path {
  pathParamsVisible;
  _activePathNodeId;
  existingPaths;
  //activeOperationNode;

  constructor(e) {
    makeObservable(this, {
      pathParamsVisible: observable,
      _activePathNodeId: observable,
      //activeOperationNode: observable,
      activePathNode: computed,
      parameters: computed,
      existingPaths: observable.shallow,
      togglePathParams: action,
    });

    this.stores = e;
    this.pathParamsVisible = false;
    this.existingPaths = [];
  }

  activate() {
    reaction(
      () => this.stores.uiStore.activeNode,
      (e) => {
        if (isOperationNode(e)) {
          this._activePathNodeId = e.parentId;
        } else {
          if (isPathNode(e)) {
            this._activePathNodeId = e.id;
          } else {
            this._activePathNodeId = undefined;
          }
        }
      },
      {
        fireImmediately: true,
      },
    );

    //reaction(
    //() => ({
    //activeSymbolNode: this.stores.uiStore.activeSymbolNode,
    //activePathNode: this.activePathNode,
    //}),
    //action(() => {
    //this.setActiveOperationNode();
    //}),
    //{
    //fireImmediately: true,
    //},
    //);

    reaction(
      () =>
        this.activePathNode
          ? {
              parsed: this.activePathNode.parent.data.parsed,
              key: last(this.activePathNode.relativeJsonPath),
            }
          : {
              parsed: undefined,
              key: null,
            },
      action(({parsed: e, key: t}) => {
        if (t == null || e === undefined) {
          this.existingPaths = [];
        } else {
          if (t in e) {
            this.existingPaths = Object.keys(e);
          }
        }
      }),
    );
  }

  get activePathNode() {
    return (
      this._activePathNodeId &&
      this.stores.graphStore.getNodeById(this._activePathNodeId)
    );
  }

  get parameters() {
    return get(this.activePathNode, 'data.parsed.parameters') || [];
  }

  togglePathParams() {
    this.pathParamsVisible = !this.pathParamsVisible;
  }

  async addPathParam() {
    if (this.activePathNode) {
      await when(() => this.activePathNode && this.activePathNode.data.parsed, {
        timeout: 2000,
      });

      let activeNode = this.activePathNode;
      let pathData = activeNode.data.parsed || {};
      const existingParameters =
        pathData.parameters && pathData.parameters.length
          ? pathData.parameters
          : [];

      if (existingParameters.length === 0) {
        const pathUri = decodeUriFragment(activeNode.path);
        this.stores.graphStore.graph.patchSourceNodeProp(
          activeNode.parentSourceNode.id,
          'data.parsed',
          [
            {
              op: nodeOperations.Replace,
              value: [],
              path: ['paths', pathUri, 'parameters'],
            },
          ],
        );
      }

      this.stores.graphStore.graph.patchSourceNodeProp(
        this.activePathNode.parentSourceNode.id,
        'data.parsed',
        [
          {
            op: nodeOperations.Add,

            value: createPathParamSchema('', ['schema', 'type']),

            path: this.activePathNode.relativeJsonPath.concat([
              'parameters',
              this.parameters.length,
            ]),
          },
        ],
      );
    }
  }

  async updatePathParamName(path, name) {
    // e,t
    if (!this.activePathNode) {
      return;
    }

    //path: ["paths", "/users/{userId}", "parameters", 0, "name"]
    const parametersPath = path.slice(0, path.length - 1); // n
    const index = last(parametersPath); // r

    const parameters = this.parameters.map((e, i) =>
      String(index) === String(i)
        ? Object.assign(Object.assign({}, e), {
            name,
          })
        : e,
    );

    const activePathUri = String(last(this.activePathNode.relativeJsonPath));
    const updatedPathUri = updatePathFromParameters(activePathUri, parameters);

    if (
      updatedPathUri === activePathUri ||
      this.existingPaths.includes(updatedPathUri)
    ) {
      //this.stores.notificationStore.addError(
      console.error(
        `Cannot update path parameter. Resulting path "${updatedPathUri}" is already defined in this API.`,
      );
    } else {
      this.stores.graphStore.graph.patchSourceNodeProp(
        this.activePathNode.parentSourceNode.id,
        'data.parsed',
        [
          {
            op: nodeOperations.Replace,
            path,
            value: name,
          },
        ],
      );

      //await this.stores.graphStore.waitUntilIdle();

      if (updatedPathUri !== activePathUri) {
        this.stores.graphStore.graph.patchSourceNodeProp(
          this.activePathNode.parentSourceNode.id,
          'data.parsed',
          [
            {
              op: nodeOperations.Move,
              from: this.activePathNode.relativeJsonPath,
              path: ['paths', updatedPathUri],
            },
          ],
        );
      }
    }
  }

  async removePathParam(e) {
    if (!this.activePathNode) {
      return;
    }

    await timer(0);
    const t = last(e);
    const n = filter(this.parameters, (e, n) => String(t) !== String(n));
    const r = last(this.activePathNode.relativeJsonPath);
    const i = updatePathFromParameters(r, n);

    if (i !== r && this.existingPaths.includes(i)) {
      this.stores.notificationStore.addError(
        `Cannot remove path parameter. Resulting path "${i}" is already defined in this API.`,
      );
    } else {
      this.stores.graphStore.graph.patchSourceNodeProp(
        this.activePathNode.parentSourceNode.id,
        'data.parsed',
        [
          {
            op: nodeOperations.Remove,
            path: e,
          },
        ],
      );

      //await this.stores.graphStore.waitUntilIdle();

      if (i !== r) {
        this.stores.graphStore.graph.patchSourceNodeProp(
          this.activePathNode.parentSourceNode.id,
          'data.parsed',
          [
            {
              op: nodeOperations.Move,
              from: this.activePathNode.relativeJsonPath,
              path: ['paths', i],
            },
          ],
        );
      }
    }
  }

  //setActiveOperationNode(e) {
  //const {activeSymbolNode} = this.stores.uiStore;

  //if (isOperationNode(activeSymbolNode)) {
  //this.activeOperationNode = activeSymbolNode;
  //} else {
  //if (this.activePathNode) {
  //this.activeOperationNode = this.activePathNode.children.find(
  //e ? (c) => isOperationNode(c) && e === c.path : isOperationNode,
  //);
  //}
  //}
  //}

  updatePath(e, t) {
    var n;
    //var r

    if (this.existingPaths.includes(e)) {
      return;
    }

    let i = this.activePathNode;

    if (t) {
      i = this.stores.graphStore.getNodeById(t);
    }

    if (NodeCategories.SourceMap !== (i == null ? undefined : i.category)) {
      return;
    }

    n = i.data.parsed || {};
    const o = n.parameters && n.parameters.length ? n.parameters : [];

    //const a = te.resolveInlineRef.bind(
    //null,
    //((r = i.parentSourceNode.data.resolved) !== null) && (r !== undefined) ? r : i.parentSourceNode.data.parsed
    //)

    const s = getParametersFromPath(Array.isArray(o) ? o : [], e);

    this.stores.graphStore.graph.patchSourceNodeProp(
      i.parentSourceNode.id,
      'data.parsed',
      [
        {
          op: nodeOperations.Move,
          from: i.relativeJsonPath,
          path: ['paths', e],
        },
      ],
    );

    this.stores.graphStore.graph.patchSourceNodeProp(
      i.parentSourceNode.id,
      'data.parsed',
      [
        {
          op: nodeOperations.Replace,
          value: s,
          path: ['paths', e, 'parameters'],
        },
      ],
    );
  }
}

export default Path;
