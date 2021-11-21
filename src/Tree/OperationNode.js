import {pathMethods} from '../datasets/http';

function sortOperations(nodes, path) {
  return [...nodes].sort((a, b) => methodOrder(a[path], b[path]));
}

function methodOrder(method, newMethod) {
  const oldIndex = Object.keys(pathMethods).indexOf(method);
  const newIndex = Object.keys(pathMethods).indexOf(newMethod);

  if (newIndex === -1 && oldIndex !== -1) {
    return 1;
  } else {
    if (oldIndex !== -1 && newIndex === -1) {
      return -1;
    } else {
      return oldIndex - newIndex;
    }
  }
}

class OperationNode {
  constructor(e) {
    this.items = e;
  }

  add(node) {
    for (let i = 0; i < this.items.length; i++) {
      if (methodOrder(this.items[i].method, node.method) > 0) {
        this.items.splice(i, 0, node);
        return;
      }
    }

    this.items.push(node);
  }

  remove(nodeId) {
    const nodeIndex = this.items.findIndex((t) => nodeId === t.id);

    if (nodeIndex !== -1) {
      this.items.splice(nodeIndex, 1);
    }
  }
}

export {sortOperations};

export default OperationNode;
