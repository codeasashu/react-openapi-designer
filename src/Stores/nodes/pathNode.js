//import PathNodeData from './pathNodeData';
import {NodeCategories, nodeOperations} from '../../datasets/tree';
import {trim, set} from 'lodash';
import {generateOperationId, pathToPointer} from '../../utils';

import {getPathParametersFromUri} from '../../utils/schema';

class PathNode {
  constructor(e) {
    this.data = Object.assign(
      {
        parentNodeId: null,
        path: '',
        tags: [],
        methods: {
          get: 'Your GET endpoint',
        },
      },
      e,
    );

    this.create = (graphStore) => {
      const sourceNode = graphStore.rootNode;

      if (
        sourceNode === undefined ||
        NodeCategories.Source !== sourceNode.category
      ) {
        return;
      }

      const {tags} = this.data;

      const path = '/' + trim(this.data.path).replace(/^\//, '');

      const graphOperations = ((path) =>
        getPathParametersFromUri(path).map((param, index) => ({
          op: nodeOperations.Add,
          path: ['paths', path, 'parameters', index],
          value: Object.assign(
            Object.assign({}, set({}, ['schema', 'type'], 'string')),
            {
              name: param,
              in: 'path',
              required: true,
            },
          ),
        })))(path);

      let nodeUri = '';

      Object.entries(this.data.methods).forEach(([method, summary]) => {
        //e,a
        if (!method || !summary) {
          return;
        }

        const methodLocation = ['paths', path, method]; // s

        if (!nodeUri) {
          nodeUri = sourceNode.uri + pathToPointer(methodLocation).slice(1);
        }

        graphOperations.push({
          op: nodeOperations.Add,
          path: methodLocation,

          value: {
            summary,
            tags: tags.slice(),
            responses: {},
            operationId: generateOperationId(path, method),
          },
        });
      });

      graphStore.graph.patchSourceNodeProp(
        sourceNode.id,
        'data.parsed',
        graphOperations,
      );
      //e.waitUntilIdle();
      const _node = graphStore.getNodeIdByUri(nodeUri);

      return [sourceNode.id, _node];
    };
  }
}

export default PathNode;
