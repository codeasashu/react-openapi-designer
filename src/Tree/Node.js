import {makeAutoObservable} from 'mobx';
class Node {
  constructor(node) {
    makeAutoObservable(this);
    this._name = '';
    this.id = node.id;
    this.type = node.type;
    this.parent = node.parent;
    this.name = node.name;

    if (node.metadata) {
      this.metadata = node.metadata;
    }
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }
}

export default Node;
