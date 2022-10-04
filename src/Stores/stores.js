import GraphStore from './graphStore';
import UiStore from './uiStore';
import OasStore from './oasStore';
import EditorStore from './editorStore';
import DesignTreeStore from './designTreeStore';
import JsonSchemaStore from './jsonSchemaStore';
import OasSchemaStore from './oasSchemaStore';
import BrowserStore from './browserStore';
import EventEmitter from '../EventEmitter';
import LintStore from './lintStore';
import ImportStore from './importStore';
import StorageStore from './storageStore';
import MockStore from './mockStore';

class Stores {
  constructor(options) {
    const {uiOptions, importOptions, mockOptions, coreOptions, storageOptions} =
      this.fetchOptions(options);

    this.eventEmitter = new EventEmitter();
    this.browserStore = new BrowserStore(this);
    this.storageStore = new StorageStore(this, storageOptions);
    this.graphStore = new GraphStore(this, coreOptions);
    this.uiStore = new UiStore(this, uiOptions);
    this.oasStore = new OasStore(this);
    this.designTreeStore = new DesignTreeStore(this);
    this.jsonSchemaCollection = this.generateJsonSchemaCollection(this);
    this.oasSchemaCollection = this.generateOasSchemaCollection(this);
    this.editorStore = new EditorStore(this);
    this.lintStore = new LintStore(this);
    this.importStore = new ImportStore(this, importOptions);
    this.mockStore = new MockStore(this, mockOptions);

    this.registerEventListeners();
    this.activate();
  }

  fetchOptions(options) {
    const coreOptions = {
      element: options?.element,
    };

    // @TODO allow only valid options
    const uiOptions = {
      view: options?.view,
      readOnly: options?.readOnly,
    };

    const importOptions = {
      specUrl: options?.specUrl,
    };

    const mockOptions = {
      url: options?.mockUrl,
    };

    const storageOptions = {
      storage: options?.storage,
    };
    return {coreOptions, uiOptions, importOptions, mockOptions, storageOptions};
  }

  generateOasSchemaCollection(currentInstance) {
    const collection = {};
    const options = {stores: currentInstance};

    const r = {
      get instances() {
        return Object.values(collection);
      },

      add(node) {
        if (collection[node.id]) {
          return collection[node.id];
        }

        const store = new OasSchemaStore(node, options);
        collection[node.id] = store;
        return store;
      },

      lookup(path, newNode) {
        let instance = collection[path];

        if (!instance && newNode) {
          instance = r.add(newNode);
        }

        return instance;
      },

      dispose() {
        for (const instance in collection) {
          const store = collection[instance];
          if (store) {
            store.dispose();
          }
        }
      },
    };
    return r;
  }

  generateJsonSchemaCollection(currentInstance) {
    const collection = {};
    const options = {stores: currentInstance};

    const r = {
      get instances() {
        return Object.values(collection);
      },

      add(node) {
        if (collection[node.id]) {
          return collection[node.id];
        }

        const store = new JsonSchemaStore(node, options);
        collection[node.id] = store;
        return store;
      },

      lookup(path, newNode) {
        let instance = collection[path];

        if (!instance && newNode) {
          instance = r.add(newNode);
        }

        return instance;
      },

      dispose() {
        for (const instance in collection) {
          const store = collection[instance];
          if (store) {
            store.dispose();
          }
        }
      },
    };
    return r;
  }

  registerEventListeners() {
    this.graphStore.registerEventListeners();
    this.uiStore.registerEventListeners();
    this.designTreeStore.registerEventListeners();
    this.oasStore.registerEventListeners();
    //this.editorStore.registerEventListeners();
  }

  activate() {
    this.storageStore.activate();
    this.graphStore.activate();
    this.uiStore.activate();
    this.oasStore.activate();
    this.designTreeStore.activate();
    this.editorStore.doActivate();
    this.lintStore.activate();
    this.importStore.activate();
    this.mockStore.activate();
  }
}

export default Stores;
