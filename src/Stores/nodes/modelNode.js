import {pathToPointer} from '../../utils';
import {nodeOperations} from '../../utils/tree';

const getSchema = (title, tags) => {
  const schema = {
    title,
    type: 'object',
  };

  if (tags.length) {
    schema['x-tags'] = tags;
  }

  schema.properties = {
    id: {
      type: 'string',
    },
  };

  return schema;
};

class ModelNode {
  constructor(e) {
    this.data = Object.assign(
      {
        parentNodeId: null,
        format: '',
        name: '',
        type: '',
        tags: [],
      },
      e,
    );

    this.create = (graphStore) => {
      const {
        tags, //n
      } = this.data;

      if (this.data.parentNodeId === undefined) {
        throw new Error('parentNodeId is missing');
      }

      const sourceNode = graphStore.rootNode;

      if (sourceNode.spec === undefined) {
        throw new TypeError('graphNode does not have spec defined');
      }

      const path = ['components', 'schemas'].concat(this.data.name); // r
      const node = sourceNode.uri + pathToPointer(path).slice(1); //i
      const operations = getSchema(this.data.name, tags);
      graphStore.graph.patchSourceNodeProp(sourceNode.id, 'data.parsed', [
        {
          op: nodeOperations.Add,
          path,
          value: operations,
        },
      ]);
      const _node = graphStore.graph.getNodeByUri(node).id;
      return [sourceNode.id, _node];
    };
  }
}

export default ModelNode;
