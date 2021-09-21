import {override, makeObservable, observable} from 'mobx';
import Tree from './Tree';
import SwappableWeakSet from './weakset';

class ComputableTree extends Tree {
  visited = null;

  constructor(
    callback,
    iterOptions = null,
    root = Tree.createArtificialRoot(),
    size = 200,
  ) {
    super(iterOptions, root, size);
    makeObservable(this, {
      visited: observable,
      unwrap: override,
    });
    this.visited = new SwappableWeakSet();
    this.computeRows = callback;
  }

  static mapById(node) {
    return node.id;
  }

  compute(node, filters) {
    if (!this.visited.has(node)) {
      node.children = this.computeRows(node);

      if (filters !== undefined) {
        node.children = node.children.filter((e) => !filters.includes(e.id));
      }

      for (const child of node.children) {
        this.decorateNode(child);
      }

      this.visited.add(node);
    }
  }

  processTreeFragment(node) {
    this.compute(node);
    return super.processTreeFragment(node);
  }

  unwrap(node) {
    this.compute(node);
    return super.unwrap(node);
  }

  insertTreeFragment(fragments, node) {
    this.compute(node, fragments.map(ComputableTree.mapById));
    return super.insertTreeFragment(fragments, node);
  }

  insertNode(node, parentNode) {
    this.compute(parentNode, [node.id]);
    return super.insertNode(node, parentNode);
  }

  invalidate() {
    if (this.computeRows) {
      this.visited.swap();
      return super.invalidate();
    }
  }
}

export default ComputableTree;
