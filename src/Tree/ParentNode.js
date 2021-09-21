import Node from './Node';

class ParentNode extends Node {
  constructor(e) {
    super(e);
    this.children = e.children;
  }
}

export default ParentNode;
