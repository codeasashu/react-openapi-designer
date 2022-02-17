import {hasIn, escapeRegExp} from 'lodash';
import {toFSPath, resolve, isURL} from '@stoplight/path';
import {cloneDeep} from 'lodash';
import {schemaWalk} from '@cloudflare/json-schema-walker';
import Path from './oas/path';
import Service from './oas/service';
import {eventTypes, nodeOperations} from '../datasets/tree';
import jsf from 'json-schema-faker';

jsf.define('fixedValue', (value, schema) => {
  switch (schema?.type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 0;
    case 'boolean':
      return true;
    default:
      return value;
  }
});

class OasStore {
  constructor(e) {
    this.stores = e;
    this.path = new Path(e);
    this.service = new Service(e);
    this.eventEmitter = e.eventEmitter;
    //this.operation = new ld(e)
    //this.service = new hd(e)
  }

  activate() {
    this.path.activate();
    this.service.activate();
  }

  registerEventListeners() {
    this.eventEmitter.on(eventTypes.GoToRef, (refPath) => {
      const sourceNode = this.stores.uiStore.activeSourceNode;
      if (!sourceNode || !refPath) {
        return;
      }

      if (isURL(refPath)) {
        this.stores.browserStore.openUrlInBrowser(refPath);
        return;
      }
      let nodeUri;
      let resolvedRefPath = toFSPath(
        resolve(
          sourceNode.uri.replace(
            new RegExp(escapeRegExp(sourceNode.path) + '$'),
            '',
          ),
          refPath,
        ),
      );

      const hashLoc = resolvedRefPath.indexOf('#');

      if (hashLoc !== -1) {
        nodeUri =
          resolvedRefPath.length < hashLoc + 2
            ? undefined
            : resolvedRefPath.slice(hashLoc + 1);
      }

      const node = this.stores.graphStore.getNodeByUri(
        `/p/reference.yaml${nodeUri}`,
      );
      if (node) {
        this.stores.uiStore.setActiveNode(node);
      }
    });
  }

  generateExampleFromSchema(schema) {
    schema = cloneDeep(schema);
    schemaWalk(
      schema,
      (_schema) => {
        if (Object.prototype.hasOwnProperty.call(_schema, 'type')) {
          switch (_schema.type) {
            case 'string':
            case 'integer':
            case 'boolean':
            case 'number':
              _schema['fixedValue'] = true;
          }
        }
      },
      null,
    );
    const value = jsf.generate(
      cloneDeep({...schema, additionalProperties: false}),
    );

    return value;
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
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {},
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
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {},
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
