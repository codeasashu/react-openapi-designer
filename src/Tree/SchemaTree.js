import Tree from './Tree';
import {isParentNode, generateUUID} from '../utils/tree';

const levelSymbol = Symbol('LEVEL');
const dropZoneIdSymbol = Symbol('DROP_ZONE_ID');

class SchemaTree extends Tree {
  constructor(
    iterOptions = null,
    root = Tree.createArtificialRoot(),
    size = 200,
  ) {
    super(iterOptions, root, size);
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
        //node.parent = parentNode;
        parentNode.children.push(node);
      }
    }
  }

	static toTree(node) {
    const rootNode = {
      id: generateUUID(),
      name: '',
      parent: null,
      children: [],
    };

    SchemaTree._toTree(rootNode, node.slice());
    return rootNode;
  }
}

SchemaTree.level = {
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

SchemaTree.dropZoneId = {
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

SchemaTree.boundaries = {
  offset: 0,
  length: 0,
};

export default SchemaTree;
