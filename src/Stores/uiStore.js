import {observable, computed, reaction, action, makeObservable} from 'mobx';
import HistoryTree from '../Tree/HistoryTree';
import {NodeCategories, eventTypes} from '../datasets/tree';
import {NodeTypes} from '../datasets/tree';
import {startsWith} from '../utils';

class UiStore {
  _chosenSourceNodeUri;
  _chosenSymbolNodeUri;

  activeSourceNode;
  activeSymbolNode;
  fullscreen;

  constructor(stores) {
    makeObservable(this, {
      toggleFullscreen: action.bound,
      setActiveSidebarTree: action,
      activeSidebarTree: computed,
      //activeLayout: computed,

      _chosenSourceNodeUri: observable,
      chosenSourceNodeUri: computed,
      activeSourceNodeId: computed,
      activeSourceNode: observable.ref,
      assignMatchingSourceNode: action,
      fullscreen: observable,

      _chosenSymbolNodeUri: observable,
      chosenSymbolNodeUri: computed,
      activeSymbolNodeId: computed,
      activeSymbolNode: observable.ref,
      assignMatchingSymbolNode: action,

      activeNode: computed,
      activeNodeId: computed,
    });

    this.stores = stores;
    this._layouts = new Map();
    this.fullscreen = false;
    this._showStuckDialog = false;
    this._smallLayout = false;
    this._chosenSourceNodeUri = undefined;
    this._chosenSymbolNodeUri = undefined;
    this._preferences = observable.object(
      {
        activeSidebarTree: 'design',
        sidebarWidth: 18,
        sidebarActiveTreeHeight: 50,
        nodeHistory: [],
      },
      undefined,
      {
        deep: false,
      },
    );
    this._history = new HistoryTree(this._preferences.nodeHistory);

    reaction(
      () => this.activeNode,
      (e) => {
        if (e) {
          this._history.addItem(UiStore.getHistoryItemForNode(e));
        }
      },
    );

    reaction(
      () => this.chosenSourceNodeUri,
      action(
        (nodeUri) => {
          if (nodeUri === undefined) {
            this.chosenSymbolNodeUri = undefined;
            this.activeSourceNode = undefined;
            //delete this._preferences.activeSourceNodeUri;
          } else {
            this.chosenSymbolNodeUri =
              this._preferences['activeSymbolNodeUri.' + nodeUri];
            this.assignMatchingSourceNode();
            this._preferences.activeSourceNodeUri = nodeUri;
          }
        },
        {
          fireImmediately: true,
        },
      ),
    );

    reaction(
      () => this.chosenSymbolNodeUri,
      action((nodeUri) => {
        if (nodeUri === undefined) {
          this.activeSymbolNode = undefined;
          delete this._preferences[
            'activeSymbolNodeUri.' + this.chosenSourceNodeUri
          ];
        } else {
          this.assignMatchingSymbolNode();
          this._preferences['activeSymbolNodeUri.' + this.chosenSourceNodeUri] =
            nodeUri;
        }
      }),
    );

    this.saveStorage = () => {
      localStorage[this._storageKey] = JSON.stringify(this._preferences);
    };

    this.updateLayout = () => {
      this.smallLayout = window.innerWidth < 1400;
    };

    this.clearActiveNode = () => {
      const {activeSourceNodeId: e} = this;

      if (e !== undefined) {
        this.chosenSourceNodeUri = undefined;
        this.chosenSymbolNodeUri = undefined;
      }
    };

    this.unsetActiveSymbolNode = () => {
      this.chosenSymbolNodeUri = undefined;
    };

    this.setActiveNode = (node, dontChangeSourceNode = false) => {
      if (NodeCategories.Source === node.category) {
        if (
          !dontChangeSourceNode ||
          (node.uri !== this.chosenSourceNodeUri &&
            node.uri !== this.activeSourceNode.uri)
        ) {
          this.chosenSourceNodeUri = node.uri;
        } else {
          this.chosenSourceNodeUri = undefined;
        }

        if (this.activeSymbolNodeId) {
          if (
            !this.stores.graphStore.graph.getNodeById(this.activeSymbolNodeId)
          ) {
            this.chosenSymbolNodeUri = undefined;
          }
        }
      } else if (NodeCategories.SourceMap === node.category) {
        const parentNode = node.parentSourceNode; // n

        if (dontChangeSourceNode && node.id === this.activeSymbolNodeId) {
          this.chosenSymbolNodeUri = undefined;
        } else {
          this.chosenSourceNodeUri = parentNode.uri;
          this.chosenSymbolNodeUri = node.uri;
        }
      } else {
        const closestSourceNode = node.getAncestor(
          (_node) => NodeCategories.Source === _node.category,
        );

        if (closestSourceNode) {
          this.chosenSourceNodeUri = closestSourceNode.uri;
          this.chosenSymbolNodeUri = node.uri;
        }
      }
    };

    this.handleAddNode = ({node: _node}) => {
      const node = this.stores.graphStore.getNodeById(_node.id);

      switch (node && node.category) {
        case NodeCategories.Source:
          if (
            node.uri === this.chosenSourceNodeUri &&
            this.activeSourceNode === undefined
          ) {
            this.assignMatchingSourceNode();
          }
          break;
        case NodeCategories.SourceMap:
          if (
            node.uri === this.chosenSymbolNodeUri &&
            this.activeSymbolNodeId === undefined
          ) {
            this.assignMatchingSymbolNode();
          }
      }
    };

    this._locationParams = new URLSearchParams(window.location.search);
  }

  activate() {
    const localStorageSettings = localStorage[this._storageKey]
      ? JSON.parse(localStorage[this._storageKey])
      : null;
    this._preferences = observable.object(
      Object.assign(
        {
          activeSidebarTree: 'design',
          sidebarWidth: 18,
          sidebarActiveTreeHeight: 50,
          nodeHistory: [],
        },
        localStorageSettings || {},
      ),
      undefined,
      {
        deep: false,
      },
    );
  }

  registerEventListeners() {
    this.stores.graphStore.eventEmitter.on(
      eventTypes.GraphNodeAdd,
      ({node}) => {
        this.handleAddNode({node});
      },
    );

    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidMoveNode,
      ({id, oldUri}) => {
        this._history.removeItemsByUri(oldUri);
        const node = this.stores.graphStore.getNodeById(id);

        if (
          node !== undefined &&
          NodeCategories.Source !== node.category &&
          NodeTypes.Directory !== node.type
        ) {
          this._history.addItem(UiStore.getHistoryItemForNode(node));
        }
      },
    );
    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidRemoveNode,
      ({node}) => {
        if (NodeCategories.Virtual !== node.category) {
          if (this.chosenSymbolNodeUri === node.uri) {
            this.chosenSymbolNodeUri = undefined;
          }
        }
        const {uri} = node;
        this._history.removeItemsByUri(uri);

        const activeNodeUri = this.activeNode && this.activeNode?.uri;
        if (this._history.length === 0) {
          this.clearActiveNode();
        } else if (activeNodeUri && uri && startsWith(activeNodeUri, uri)) {
          const lastNode = this._history.items.head;
          const newNode = lastNode
            ? this.stores.graphStore.getNodeByUri(lastNode.uri)
            : undefined;

          if (newNode) {
            this.setActiveNode(newNode);
          } else {
            if (lastNode) {
              this._history.removeItemsByUri(lastNode.uri);
            }

            this.clearActiveNode();
          }
        }
      },
    );
  }

  get _storageKey() {
    return 'oasdesigner-ui';
  }

  toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
  }

  get smallLayout() {
    return this._smallLayout;
  }

  set smallLayout(e) {
    this._smallLayout = e;
  }

  setActiveSidebarTree(e) {
    this._preferences.activeSidebarTree = e;
  }

  get activeSidebarTree() {
    return this._preferences.activeSidebarTree;
  }

  @computed get chosenSourceNodeUri() {
    return this._chosenSourceNodeUri;
  }

  set chosenSourceNodeUri(e) {
    this._chosenSourceNodeUri = e;
  }

  get activeSourceNodeId() {
    return this.activeSourceNode && this.activeSourceNode.id;
  }

  assignMatchingSourceNode() {
    if (this.chosenSourceNodeUri === undefined) {
      this.activeSourceNode = undefined;
      return;
    }

    const node = this.stores.graphStore.graph.getNodeByUri(
      this.chosenSourceNodeUri,
    );

    if (node && NodeCategories.Source === node.category) {
      this.activeSourceNode = node;
    } else {
      console.error('No matching sourcenode found');
    }
  }

  @computed get chosenSymbolNodeUri() {
    return this._chosenSymbolNodeUri;
  }

  set chosenSymbolNodeUri(e) {
    this._chosenSymbolNodeUri = e;
  }

  get activeSymbolNodeId() {
    return this.activeSymbolNode && this.activeSymbolNode.id;
  }

  assignMatchingSymbolNode() {
    if (this.chosenSymbolNodeUri === undefined) {
      this.activeSymbolNode = undefined;
      return;
    }

    const node = this.stores.graphStore.graph.getNodeByUri(
      this.chosenSymbolNodeUri,
    );

    if (node && NodeCategories.SourceMap === node.category) {
      this.activeSymbolNode = node;
    } else {
      this.activeSymbolNode = undefined;
    }
  }

  get activeNodeId() {
    const activeSymbolNode = this.activeSymbolNode;
    const activeSymbolNodeId = activeSymbolNode && activeSymbolNode.id;
    if (activeSymbolNodeId) {
      return activeSymbolNodeId;
    } else {
      return this.activeSourceNode && this.activeSourceNode.id;
    }
  }

  get activeNode() {
    return this.activeSymbolNode || this.activeSourceNode;
  }

  get sidebarWidth() {
    return this._preferences.sidebarWidth;
  }

  set sidebarWidth(e) {
    this._preferences.sidebarWidth = e;
  }

  get sidebarActiveTreeHeight() {
    return this._preferences.sidebarActiveTreeHeight;
  }

  set sidebarActiveTreeHeight(e) {
    this._preferences.sidebarActiveTreeHeight = e;
  }

  async activateInitialNode() {
    const node = decodeURIComponent(this._locationParams.get('node') || '');
    if (node) {
      this._locationParams.delete('node');
      window.history.replaceState(
        {},
        '',
        `${location.pathname}?${this._locationParams}`,
      );
    }

    const sourceId = decodeURIComponent(
      this._locationParams.get('source') || '',
    ); // r
    const symbolUri = decodeURIComponent(
      this._locationParams.get('symbol') || '',
    ); // i
    const sourceNode = this.stores.graphStore.getNodeById(sourceId); // o

    const _activeSourceNodeUri = this._preferences.activeSourceNodeUri; // u
    const _activeSymbolNodeUri =
      this._preferences['activeSymbolNodeUri.' + _activeSourceNodeUri]; // c
    const symbolNode = this.stores.graphStore.getNodeByUri(
      _activeSymbolNodeUri || '',
    ); // l
    const activeSourceNode = sourceNode || symbolNode; //d
    const activeSymbolNodeUri = symbolUri || _activeSymbolNodeUri; //h

    if (
      activeSourceNode &&
      NodeCategories.Source === activeSourceNode.category &&
      (this.setActiveNode(activeSourceNode), activeSymbolNodeUri)
    ) {
      //await this.stores.contentStore.prepareNodeForWork(d);
      const activeSymbolNode =
        this.stores.graphStore.getNodeByUri(activeSymbolNodeUri);

      if (activeSymbolNode) {
        this.setActiveNode(activeSymbolNode);
      }
    }
  }

  getNodeHistory() {
    return [...this._history.items].map((e) =>
      Object.assign(Object.assign({}, e), {
        available: this.stores.graphStore.getNodeByUri(e.uri) !== undefined,
      }),
    );
  }

  static getHistoryItemForNode(e) {
    return {
      uri: e.uri,
      name: e.uri,
    };
  }
}

export default UiStore;
