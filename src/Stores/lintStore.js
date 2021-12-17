import {makeObservable, observable, action} from 'mobx';
import {DiagnosticSeverity} from '@stoplight/types';

class LintStore {
  errors = [];
  warning = [];
  info = [];
  hints = [];

  constructor(stores) {
    makeObservable(this, {
      errors: observable,
      warning: observable,
      info: observable,
      hints: observable,
      handleWorkerMessage: action.bound,
      activate: action,
    });

    this.stores = stores;
    this.info = [];
    this.worker = new Worker(new URL('../worker/lint.worker', import.meta.url));
  }

  activate() {
    this.worker.onmessage = this.handleWorkerMessage;
  }

  get spec() {
    return this.stores.graphStore.rootNode.data.parsed;
  }

  lint(doc) {
    const spec = doc || this.spec;
    this.worker.postMessage({msg: 'abc', spec});
  }

  handleWorkerMessage({data}) {
    const results = data.results;
    this.errors = results.filter(
      (r) => r.severity === DiagnosticSeverity.Error,
    );
    this.warning = results.filter(
      (r) => r.severity === DiagnosticSeverity.Warning,
    );
    this.hints = results.filter((r) => r.severity === DiagnosticSeverity.Hint);
    this.info = results.filter((r) => r.severity === DiagnosticSeverity.Info);
  }
}

export default LintStore;
