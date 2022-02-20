import {observable, action, computed, makeObservable} from 'mobx';
import SwappableWeakMap from './weakmap';
import SwappableWeakSet from './weakset';
import TreeCache from './TreeCache';
import {
  raiseErrorIfNotParentNode,
  isParentNode,
  generateUUID,
} from '../utils/tree';

const levelSymbol = Symbol('LEVEL');
const dropZoneIdSymbol = Symbol('DROP_ZONE_ID');
const countSymbol = Symbol('COUNT');

class Tree {
  _versionCounter;
  @observable _root = null;
  _count = 0;
  unwrapped = null;

  constructor(
    iterOptions = null,
    root = Tree.createArtificialRoot(),
    size = 200,
  ) {
    makeObservable(this, {
      _versionCounter: observable,
      versionCounter: computed,
      _count: observable,
      count: computed,
      unwrapped: observable,
      unwrap: action,
      wrap: action,
      _root: observable,
      invalidateLevel: action,
      processTreeFragment: action,
    });
    this.iterationOptions = iterOptions;
    this.unwrapped = new SwappableWeakSet();
    this.sorted = new SwappableWeakSet();
    this.filtered = new SwappableWeakMap();
    this._versionCounter = 0;
    this._count = 0;
    this.indexLookup = new TreeCache(size);
    this.setRoot(root);
  }

  get root() {
    return this._root;
  }

  get versionCounter() {
    return this._versionCounter;
  }

  set versionCounter(count) {
    this._versionCounter = count;
  }

  get count() {
    return this._count;
  }

  set count(counter) {
    this._count = counter;
    this.versionCounter++;
  }

  setRoot(node) {
    this._root = node;
    this.invalidate();
  }

  static getLevel(node) {
    return node[levelSymbol];
  }

  static getDropZoneId(e) {
    return e[dropZoneIdSymbol];
  }

  clearCache() {
    this.indexLookup.clear(-1);
  }

  getFilteredChildren(node) {
    if (!this.unwrapped.has(node)) {
      return [];
    }

    const filter = this.iterationOptions?.filter;

    if (node.children.length === 0) {
      return node.children;
    }

    // Try in cache first
    const filtered = this.filtered.get(node);

    if (filtered !== undefined) {
      return filtered;
    }

    if (!filter) {
      return node.children;
    }

    // Set filtered results in cache
    const filteredChildren = node.children.filter(filter);
    this.filtered.set(node, filteredChildren);
    return filteredChildren;
  }

  getChildren(node) {
    const children = this.getFilteredChildren(node);

    if (
      this.iterationOptions !== null &&
      children.length !== 0 &&
      this.iterationOptions.order !== null &&
      this.sorted.has(node)
    ) {
      children.sort(this.iterationOptions.order);
      this.sorted.add(node);
    }

    return children;
  }

  static _toTree(rootNode, childNodes) {
    const nodes = [rootNode];

    for (const _node of childNodes) {
      const parentNode = nodes[_node.level];
      const node = Tree.transformDeprecatedNode(_node, null);
      if (isParentNode(node)) {
        if (nodes.length <= _node.level) {
          nodes.push(node);
        } else {
          nodes[_node.level + 1] = node;
        }
      }

      if (parentNode) {
        node.parent = parentNode;
        parentNode.children.push(node);
      }
    }
  }

  static createArtificialRoot() {
    return {
      id: generateUUID(),
      name: '',
      parent: null,
      children: [],
    };
  }

  static toTree(node) {
    const rootNode = {
      id: generateUUID(),
      name: '',
      parent: null,
      children: [],
    };

    Tree._toTree(rootNode, node.slice());
    return rootNode;
  }

  *[Symbol.iterator]() {
    yield* this.getIteratorForNode(this.root);
  }

  *getIteratorForNode(node) {
    for (const childNode of this.getChildren(node)) {
      yield childNode;

      if (isParentNode(childNode)) {
        yield* this.getIteratorForNode(childNode);
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  static getOffsetForNode(node) {
    return -1;
  }

  binaryItemAt(node, index, boundaries) {
    if (index < 0) {
      return;
    }

    const _node = this.indexLookup.get(index);

    if (_node !== undefined) {
      return _node;
    }

    const {length} = boundaries;

    for (const childNode of this.getChildren(node)) {
      boundaries.offset++;

      if (boundaries.offset - 1 === index) {
        this.indexLookup.set(index, childNode);
        return childNode;
      }

      if (
        isParentNode(childNode) &&
        index >= boundaries.offset - 1 &&
        boundaries.offset - 1 + length >= index
      ) {
        boundaries.length = childNode[countSymbol];
        const __node = this.binaryItemAt(childNode, index, boundaries);

        if (__node !== undefined) {
          return __node;
        }
      } else {
        if (countSymbol in childNode) {
          boundaries.offset += childNode[countSymbol];
        }
      }
    }
  }

  linerItemAt(index) {
    let count = 0;

    for (const node of this) {
      if (index === count) {
        this.indexLookup.set(index, node);
        return node;
      }

      count++;
    }
  }

  getLastItem(node) {
    if (!isParentNode(node)) {
      return node;
    }

    const childNodes = this.getChildren(node);

    if (childNodes.length === 0) {
      return node;
    } else {
      return this.getLastItem(childNodes[childNodes.length - 1]);
    }
  }

  _nextItem(node) {
    if (node.parent === null) {
      return;
    }

    const siblingNodes = this.getChildren(node.parent);
    const index = siblingNodes.length === 0 ? -1 : siblingNodes.indexOf(node);

    if (siblingNodes.length - 1 > index) {
      return siblingNodes[index + 1];
    } else if (node.parent) {
      return this._nextItem(node.parent);
    }
  }

  nextItem(node) {
    if (isParentNode(node)) {
      const childNodes = this.getChildren(node);

      if (childNodes.length > 0) {
        return childNodes[0];
      }
    }

    return this._nextItem(node);
  }

  prevItem(node) {
    if (!isParentNode(node) || node.parent === null) {
      return;
    }

    const childNodes = this.getChildren(node);
    const index = childNodes.length === 0 ? -1 : childNodes.indexOf(node);

    if (index > 0 && childNodes.length > 0) {
      return this.getLastItem(childNodes[index - 1]);
    } else {
      return;
    }
  }

  itemAt(index) {
    if (index >= 0) {
      if (this.count > index && index === this.indexLookup.tail + 1) {
        const node = this.indexLookup.get(this.indexLookup.tail);

        if (node) {
          const nextNode = this.nextItem(node);

          if (nextNode) {
            this.indexLookup.set(index, nextNode);
            return nextNode;
          }
        }
      } else if (index > 1 && index === this.indexLookup.head - 1) {
        const node = this.indexLookup.get(this.indexLookup.head);

        if (node) {
          const prevNode = this.prevItem(node);

          if (prevNode) {
            this.indexLookup.set(index, prevNode);
            return prevNode;
          }
        }
      }

      Tree.boundaries.offset = 0;
      Tree.boundaries.length = this.count;
      return this.binaryItemAt(this.root, index, Tree.boundaries);
    }
  }

  indexOf(givenNode) {
    let index = 0;

    for (const node of this) {
      if (node === givenNode) {
        return index;
      }

      index++;
    }

    return -1;
  }

  every(node, callback) {
    let counter = 0;

    for (const _node of this) {
      if (!node.call(callback, _node, counter++, [])) {
        return false;
      }
    }

    return true;
  }

  findById(nodeId) {
    for (const node of this) {
      if (nodeId === node.id) {
        return node;
      }
    }
  }

  invalidate() {
    this.unwrapped.swap();
    this.clearCache();
    this.invalidateOrder();
    this.invalidateNode(this.root);
    this.count = this.processTreeFragment(this.root);
  }

  @action forceUpdate() {
    this.versionCounter++;
  }

  invalidateCounter(node, condition) {
    let currentNode = node;

    do {
      this.resetCounter(currentNode);
      currentNode = currentNode.parent;
    } while (condition && currentNode != null);
  }

  invalidateLevel(node) {
    Tree.resetLevel(node);

    if (isParentNode(node)) {
      for (const childNode of node.children) {
        this.invalidateLevel(childNode);
      }
    }
  }

  invalidateNode(node) {
    this.invalidateLevel(node);

    if (isParentNode(node)) {
      this.filtered.delete(node);
      this.sorted.delete(node);
      this.invalidateCounter(node, true);
    }
  }

  invalidateOrder() {
    this.sorted.swap();
    this.filtered.swap();
  }

  wrap(node) {
    if (this.unwrapped.has(node)) {
      this.clearCache();

      if (this.getFilteredChildren(node).length > 0) {
        this.count -= node[countSymbol];
      }

      this.unwrapped.delete(node);
      this.invalidateCounter(
        node,
        node.parent !== null && this.unwrapped.has(node.parent),
      );
    }
  }

  unwrap(node) {
    if (!this.unwrapped.has(node)) {
      this.unwrapped.add(node);

      if (node.parent !== null && !this.unwrapped.has(node.parent)) {
        this.invalidateCounter(node, false);
        return;
      }

      this.clearCache();
      const _count = this.count;
      const children = this.getFilteredChildren(node);

      if (children.length > 0) {
        const expanded =
          this.iterationOptions && this.iterationOptions.expanded;
        for (const childNode of children) {
          if (
            isParentNode(childNode) &&
            this.unwrapped.has(childNode) &&
            expanded &&
            !expanded(childNode)
          ) {
            this.unwrap(childNode);
          }
        }
      }

      this.invalidateCounter(node, true);
      this.count = _count + node[countSymbol];
    }
  }

  moveNode(node, parentNode) {
    this.removeNode(node);
    this.insertNode(node, parentNode);
  }

  prepareNode(node, parentNode) {
    node.parent = parentNode;
    parentNode.children.push(node);
    this.decorateNode(node);
    this.invalidateLevel(node);

    if (isParentNode(node)) {
      this.processTreeFragment(node);
    }
  }

  insertNode(node, parentNode) {
    const parentcount = parentNode[countSymbol];
    this.prepareNode(node, parentNode);

    if (parentcount !== undefined) {
      this.clearCache();
      this.invalidateNode(parentNode);
      this.count += parentNode[countSymbol] - parentcount;
    }
  }

  insertTreeFragment(nodeFragments, parentNode) {
    const parentcount = parentNode[countSymbol];

    for (const node of nodeFragments) {
      this.prepareNode(node, parentNode);
    }

    if (parentcount !== undefined) {
      this.clearCache();
      this.invalidateNode(parentNode);
      this.count += parentNode[countSymbol] - parentcount;
    }
  }

  removeNode(node) {
    if (node.parent === null) {
      throw new Error('Cannot remove root node');
    }

    const {parent} = node;

    const parentcount = parent[countSymbol];
    parent.children.splice(parent.children.indexOf(node), 1);

    if (parentcount !== undefined) {
      this.clearCache();
      this.invalidateNode(parent);
      this.count += parent[countSymbol] - parentcount;
    }
  }

  replaceNode(node, newNode) {
    if (node.parent === null) {
      raiseErrorIfNotParentNode(newNode);
      this.setRoot(newNode);
      return;
    }

    const {parent} = node;

    const siblingCount = parent[countSymbol];
    parent.children[parent.children.indexOf(node)] = newNode;

    if (siblingCount !== undefined) {
      this.clearCache();
      this.invalidateNode(parent);
      this.count += parent[countSymbol] - siblingCount;
    }
  }

  getCount(node) {
    return node[countSymbol];
  }

  setCount(node, count) {
    node[countSymbol] = Math.max(0, count);
  }

  resetCounter(node) {
    let counter = 0;

    for (const childNode of this.getFilteredChildren(node)) {
      if (countSymbol in childNode) {
        counter += childNode[countSymbol];
      }

      counter += 1;
    }

    node[countSymbol] = counter;
  }

  processTreeFragment(node) {
    let counter = 0;
    this.decorateNode(node);

    if (isParentNode(node)) {
      const expanded = this.iterationOptions?.expanded;
      if (!expanded || expanded(node)) {
        this.unwrapped.add(node);

        for (const childNode of this.getFilteredChildren(node)) {
          if (isParentNode(childNode)) {
            counter += this.processTreeFragment(childNode);
          } else {
            this.decorateNode(childNode);
          }

          counter += 1;
        }
      }

      node[countSymbol] = counter;
    }

    return counter;
  }

  @action
  static resetLevel(node) {
    Object.defineProperty(node, levelSymbol, Tree.level);
  }

  static resetDropZoneId(node) {
    Object.defineProperty(node, dropZoneIdSymbol, Tree.dropZoneId);
  }

  decorateNode(node) {
    if (!(levelSymbol in node)) {
      Tree.resetLevel(node);
    }

    if (!(dropZoneIdSymbol in node)) {
      Tree.resetDropZoneId(node);
    }
  }

  static isDecoratedNode(node) {
    if (typeof node == 'object' && node !== null && levelSymbol in node) {
      return dropZoneIdSymbol in node;
    }
  }

  static transformDeprecatedNode(node, parentNode) {
    const transformednode = {
      ...node,

      ...(node.canHaveChildren && {
        children: [],
      }),

      parent: parentNode,
    };

    delete transformednode.level;
    delete transformednode.canHaveChildren;
    return transformednode;
  }
}

Tree.level = {
  configurable: true,

  get() {
    const {parent} = this;

    const _level =
      parent === null
        ? -1
        : (levelSymbol in parent ? parent[levelSymbol] : 0) + 1;

    if (isParentNode(this)) {
      Object.defineProperty(this, levelSymbol, {
        configurable: true,
        value: _level,
      });
    }

    return _level;
  },
};

Tree.dropZoneId = {
  configurable: true,

  get() {
    const {parent} = this;

    const _dropzoneId =
      (parent !== null && dropZoneIdSymbol in parent
        ? `${parent[dropZoneIdSymbol]}${this.id}`
        : this.id) + '-';

    if (isParentNode(this)) {
      Object.defineProperty(this, dropZoneIdSymbol, {
        configurable: true,
        value: _dropzoneId,
      });
    }

    return _dropzoneId;
  },
};

Tree.boundaries = {
  offset: 0,
  length: 0,
};

export default Tree;
