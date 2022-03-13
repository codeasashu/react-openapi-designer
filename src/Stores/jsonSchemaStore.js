import {action} from 'mobx';
import {debounce, get} from 'lodash';
import {eventTypes, nodeOperations} from '../datasets/tree';
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

    //this.goToRef = (e) => {};

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

    // this.stores.graphStore.notifier.on(eventTypes.DidRemoveNode, ({id}) => {
    //   if (this.sourceNodeId === id) {
    //     this.store.schema = undefined;
    //   }
    // });

    // this.stores.graphStore.notifier.on(
    //   eventTypes.DidChangeSourceNode,
    //   action(
    //     ({
    //       node: {id: e},

    //       change: {prop: t},
    //     }) => {
    //       if (this.sourceNodeId === e && t === 'data.parsed') {
    //         this.setSchema();
    //       }
    //     },
    //   ),
    // );

    e.stores.eventEmitter.on(eventTypes.StoreEvents.Change, (t) => {
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

    //this._disposables.push(this.store.on(Za.GoToRef, this.goToRef))
  }
}

export default JsonSchemaStore;
