import Tree from './Tree';

const TreeOrder = (currentNode, nextNode) => {
  if (Tree.getLevel(currentNode) < 1) {
    return 0;
  }

  const n = currentNode.metadata;
  const r = nextNode.metadata;

  if ((n == null ? undefined : n.order) !== undefined) {
    return n.order - ((r == null ? undefined : r.order) || 0);
  } else {
    if (
      'path' === currentNode.type &&
      currentNode.name.length > 1 &&
      nextNode.name.length > 1
    ) {
      return currentNode.name[1].localeCompare(nextNode.name[1]);
    } else {
      return currentNode.name.localeCompare(nextNode.name);
    }
  }
};

export default TreeOrder;
