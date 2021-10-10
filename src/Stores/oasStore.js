import {hasIn} from 'lodash';
import Path from './oas/path';
import Service from './oas/service';
import {nodeOperations} from '../utils/tree';

class OasStore {
  constructor(e) {
    this.stores = e;
    this.path = new Path(e);
    this.service = new Service(e);
    //this.operation = new ld(e)
    //this.service = new hd(e)
  }

  activate() {
    this.path.activate();
    this.service.activate();
  }

  addSharedParameter({sourceNodeId, name, parameterType}) {
    const sourceNode = this.stores.graphStore.getNodeById(sourceNodeId);
    const destination = ['components', 'parameters'];
    const itemPath = [...destination, name];
    this.stores.graphStore.graph.patchSourceNodeProp(
      sourceNodeId,
      'data.parsed',
      [
        ...(hasIn(sourceNode.data.parsed, destination)
          ? []
          : [
              {
                op: nodeOperations.Add,
                path: destination,
                value: {},
              },
            ]),
        {
          op: nodeOperations.Add,
          path: itemPath,

          value: {
            name,
            in: parameterType,
            required: parameterType === 'path',

            schema: {
              type: 'string',
            },
          },
        },
      ],
    );
  }

  addSharedResponse({sourceNodeId, name}) {
    const sourceNode = this.stores.graphStore.getNodeById(sourceNodeId);
    const destination = ['components', 'responses'];
    const itemPath = [...destination, name];
    this.stores.graphStore.graph.patchSourceNodeProp(
      sourceNodeId,
      'data.parsed',
      [
        ...(hasIn(sourceNode.data.parsed, destination)
          ? []
          : [
              {
                op: nodeOperations.Add,
                path: destination,
                value: {},
              },
            ]),
        {
          op: nodeOperations.Add,
          path: itemPath,

          value: {
            description: 'Example response',

            content: {
              'application/json': {
                schema: {
                  properties: {
                    id: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      ],
    );
  }

  addSharedExample({sourceNodeId, name}) {
    const sourceNode = this.stores.graphStore.getNodeById(sourceNodeId);
    const destination = ['components', 'examples'];
    const itemPath = [...destination, name];
    this.stores.graphStore.graph.patchSourceNodeProp(
      sourceNodeId,
      'data.parsed',
      [
        ...(hasIn(sourceNode.data.parsed, destination)
          ? []
          : [
              {
                op: nodeOperations.Add,
                path: destination,
                value: {},
              },
            ]),
        {
          op: nodeOperations.Add,
          path: itemPath,

          value: {
            description: 'Example shared example',
            type: 'object',

            properties: {
              id: {
                type: 'string',
              },
            },

            required: ['id'],
          },
        },
      ],
    );
  }

  addSharedRequestBody({sourceNodeId, name}) {
    const sourceNode = this.stores.graphStore.getNodeById(sourceNodeId);
    const destination = ['components', 'requestBodies'];
    const itemPath = [...destination, name];
    this.stores.graphStore.graph.patchSourceNodeProp(
      sourceNodeId,
      'data.parsed',
      [
        ...(hasIn(sourceNode.data.parsed, destination)
          ? []
          : [
              {
                op: nodeOperations.Add,
                path: destination,
                value: {},
              },
            ]),
        {
          op: nodeOperations.Add,
          path: itemPath,

          value: {
            description: 'Example response',

            content: {
              'application/json': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      ],
    );
  }
}

export default OasStore;
