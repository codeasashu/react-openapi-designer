import {makeObservable, action} from 'mobx';
import {nodeOperations} from '../datasets/tree';

class ImportStore {
  constructor(stores) {
    makeObservable(this, {
      handleWorkerMessage: action.bound,
      activate: action,
    });

    this.stores = stores;
    this.worker = new Worker(
      new URL('../worker/import.worker', import.meta.url),
    );
  }

  activate() {
    this.worker.onmessage = this.handleWorkerMessage;
  }

  convert(file) {
    this.worker.postMessage({msg: 'importfile', file});
  }

  handleWorkerMessage({data}) {
    if (data.schema) {
      const node = this.stores.graphStore.rootNode;
      this.stores.graphStore.graph.patchSourceNodeProp(node.id, 'data.parsed', [
        {
          op: nodeOperations.Replace,
          value: data.schema,
          path: [],
        },
      ]);
    }
  }
}

export default ImportStore;