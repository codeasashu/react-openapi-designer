import {spec as defaultSpec} from '../datasets/openapi';

export const LOCALSTORAGE_KEY = 'SourceNode';

export const StorageKind = {
  local: 'local',
};

class StorageStore {
  constructor(e, options) {
    this.props = e;
    this.options = options;
  }

  activate() {
    this.setExpiry(24); // Initialise with 24 hours ttl
  }

  setExpiry(ttl = 1) {
    // ttl in hours
    window.localStorage.setItem('__expiry', Date.now() + ttl * 60 * 1000);
  }

  get expiry() {
    return window.localStorage.getItem('__expiry') || null;
  }

  hasExpired() {
    return this.expiry && this.expiry < new Date().getTime();
  }

  clear() {
    this.save(defaultSpec);
    this.setExpiry(24);
    this.props.browserStore.reloadWindow();
  }

  save(spec) {
    if (this.options?.storage === StorageKind.local) {
      window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(spec));
    }
  }

  getFromLocalStore() {
    //if (this.hasExpired()) {
    //return defaultSpec;
    //}
    const localSpec = window.localStorage.getItem(LOCALSTORAGE_KEY);
    if (localSpec) {
      try {
        return JSON.parse(localSpec);
      } catch (err) {
        return defaultSpec;
      }
    }
    return defaultSpec;
  }

  get() {
    if (this.options?.storage === StorageKind.local) {
      return this.getFromLocalStore();
    }
  }

  get spec() {
    return this.get();
  }
}

export default StorageStore;
