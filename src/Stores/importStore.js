import {makeObservable, action, observable} from 'mobx';
import {nodeOperations} from '../datasets/tree';
import {isValidUrl} from '../utils';

export const ImportState = {
  not_started: 'not_started',
  progress: 'progress',
  complete: 'complete',
};

class ImportStore {
  importState = ImportState.not_started;

  constructor(stores, options) {
    makeObservable(this, {
      importState: observable,
      handleWorkerMessage: action.bound,
      activate: action,
      convert_url: action,
      convert_file: action,
    });

    this.options = options;
    this.stores = stores;
    this.importCompleteCallback = null;
    this.worker = new Worker(
      new URL('../worker/import.worker', import.meta.url),
    );
  }

  activate() {
    this.worker.onmessage = this.handleWorkerMessage;

    if (this.options.specUrl) {
      this.convert_openapi_url(this.options.specUrl);
    }
  }

  convert_file(file, kind = 'postman') {
    this.importState = ImportState.progress;
    const params = {kind, file};
    this.worker.postMessage({msg: 'import_file', params});
  }

  convert_url(url, kind = 'openapi') {
    if (!url || !isValidUrl(url)) {
      return;
    }
    this.importState = ImportState.progress;
    const params = {kind, url};
    this.worker.postMessage({msg: 'import_url', params});
  }

  convert_postman_file(file) {
    this.convert_file(file, 'postman');
  }

  convert_openapi_url(url) {
    this.convert_url(url, 'openapi');
  }

  handleWorkerMessage({data}) {
    this.importState = ImportState.complete;
    if (data.error) {
      throw Error(data.error);
    }
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
