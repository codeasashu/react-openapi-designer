import Node from './node';
import {NodeCategories} from '../../datasets/tree';

class VirtualNode extends Node {
  constructor(e, t) {
    super(e, t);
    this.category = NodeCategories.Virtual;
    this.data = e.data || {};
  }

  get parentId() {
    return this.parent.id;
  }

  dehydrate() {
    return {
      id: this.id,
      category: this.category,
      type: this.type,
      path: this.path,
      uri: this.uri,
      parentId: this.parentId,
      data: this.data,
    };
  }
}

export default VirtualNode;
