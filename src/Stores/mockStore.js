import {makeObservable, observable} from 'mobx';

class MockStore {
  url = null;

  constructor(stores, options) {
    makeObservable(this, {
      url: observable,
    });
    this.stores = stores;
    this.url = options?.url;
  }

  activate() {}
}

export default MockStore;
