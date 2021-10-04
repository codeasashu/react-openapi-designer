import GraphStore from './graphStore';
import UiStore from './uiStore';
import OasStore from './oasStore';
import DesignTreeStore from './designTreeStore';
import EventEmitter from '../EventEmitter';

class Stores {
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.graphStore = new GraphStore(this);
    this.uiStore = new UiStore(this);
    this.oasStore = new OasStore(this);
    this.designTreeStore = new DesignTreeStore(this);

    this.registerEventListeners();
    this.activate();
  }

  registerEventListeners() {
    this.graphStore.registerEventListeners();
    this.uiStore.registerEventListeners();
    this.designTreeStore.registerEventListeners();
  }

  activate() {
    this.graphStore.activate();
    this.uiStore.activate();
    this.designTreeStore.activate();
  }
}

export default Stores;
