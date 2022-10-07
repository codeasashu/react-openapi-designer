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

class Stores {
  constructor(options) {
    const {uiOptions, importOptions} = this.fetchOptions(options);

    this.eventEmitter = new EventEmitter();
    this.browserStore = new BrowserStore(this);
    this.storageStore = new StorageStore(this);
    this.graphStore = new GraphStore(this);
    this.uiStore = new UiStore(this, uiOptions);
    this.oasStore = new OasStore(this);
    this.designTreeStore = new DesignTreeStore(this);
    this.jsonSchemaCollection = this.generateJsonSchemaCollection(this);
    this.oasSchemaCollection = this.generateOasSchemaCollection(this);
    this.editorStore = new EditorStore(this);
    this.lintStore = new LintStore(this);
    this.importStore = new ImportStore(this, importOptions);

    this.registerEventListeners();
    this.activate();
  }

  fetchOptions(options) {
    // @TODO allow only valid options
    const uiOptions = {
      view: options?.view,
      readOnly: options?.readOnly,
    };

    const importOptions = {
      specUrl: options?.specUrl,
    };
    return {uiOptions, importOptions};
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
  }
}

export default Stores;
