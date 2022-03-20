import {action} from 'mobx';
import {debounce, get} from 'lodash';
import {eventTypes, NodeCategories, nodeOperations} from '../datasets/tree';
import Schema from './oas/schema';

class JsonSchemaStore {
  constructor(node, options) {
    this.setSchema = debounce(() => {
      const schema = this.getSchema();

      if (JSON.stringify(this.store.schema) !== JSON.stringify(schema)) {
        this.store.schema = schema;
      }
    }, 500);

    this.dispose = () => {
      this.setSchema.cancel();
    };

    this.goToRef = (e) => {
      if (!this.sourceNode) {
        return;
      }

      // if (A.isURL(e)) {
      //   this.stores.browserStore.openUrlInBrowser(e);
      //   return;
      // }

      let sourceNodeUri;
      let nodeUri;

      if (e.startsWith('#')) {
        sourceNodeUri = this.sourceNode.uri;
        nodeUri = e.slice(1);
      }

      const sourceNode = this.stores.graphStore.getNodeByUri(sourceNodeUri);

      if (
        sourceNode === undefined ||
        NodeCategories.Source !== sourceNode.category
      ) {
        console.warn(
          'Could not redirect to ref. Is the file missing? Diagnostics panel might contain more information.',
        );
      } else if (nodeUri === undefined) {
        this.stores.uiStore.setActiveNode(sourceNode);
      } else {
        const node = this.stores.graphStore.getNodeByUri(
          `${sourceNodeUri}${nodeUri}`,
        );

        if (node !== undefined && NodeCategories.SourceMap === node.category) {
          this.stores.uiStore.setActiveNode(node);
        } else {
          this.stores.uiStore.setActiveNode(sourceNode);
          console.warn(
            'We redirected you to the file, but the ref could not be found.',
          );
        }
      }
    };

    const {relativeJsonPath, sourceNodeId} = node; // n, i

    this.stores = options.stores;
    this.sourceNodeId = sourceNodeId;
    this.relativeJsonPath = relativeJsonPath;
    const oasVersion = 'oas3_1';
    this.store = new Schema(this.getSchema(), oasVersion, this.stores);
    //this._disposables.push(this.store);
    this._registerListeners();
  }

  get sourceNode() {
    return this.stores.graphStore.getNodeById(this.sourceNodeId);
  }

  getSchema() {
    const node = this.sourceNode;

    if (!node) {
      return;
    }

    const nodeData = node.data.parsed; //t

    if (this.relativeJsonPath && this.relativeJsonPath.length > 0) {
      return get(nodeData, this.relativeJsonPath);
    } else {
      return nodeData;
    }
  }

  _registerListeners() {
    const e = this;

    //this.stores.graphStore.eventEmitter.on(eventTypes.DidRemoveNode, ({id}) => {
    //if (this.sourceNodeId === id) {
    //this.store.schema = undefined;
    //}
    //});

    this.stores.graphStore.eventEmitter.on(
      eventTypes.DidChangeSourceNode,
      action(({node: {id: e}, change: {prop: t}}) => {
        if (this.sourceNodeId === e && t === 'data.parsed') {
          this.setSchema();
        }
      }),
    );

    this.store.eventEmitter.on(eventTypes.StoreEvents.Change, (t) => {
      e.stores.graphStore.graph.patchSourceNodeProp(
        e.sourceNodeId,
        'data.parsed',
        [
          {
            op: nodeOperations.Replace,
            path: e.relativeJsonPath ? e.relativeJsonPath : [],
            value: t,
          },
        ],
      );
    });

    this.store.eventEmitter.on(eventTypes.StoreEvents.GoToRef, (t) => {
      this.goToRef(t);
    });
  }
}

export default JsonSchemaStore;
