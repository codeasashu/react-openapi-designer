export const defaultSchema = {
  string: {type: 'string'},
  boolean: {type: 'boolean'},
  number: {type: 'number'},
  integer: {type: 'integer'},
  array: {type: 'array', items: {type: 'string'}},
  object: {type: 'object', properties: {}, required: [], examples: {}},
};

export const defaultOperation = {
  summary: '',
  responses: {
    default: {
      description: '',
    },
  },
};

export const exampleDoc = {
  openapi: '3.0.0',
  info: {
    title: 'app1',
    version: 'version2',
  },
  paths: {
    '/users/id': {
      get: {...defaultOperation, summary: 'abcd', operationId: 'get-users-id'},
    },
    '/users/abc': {
      get: {...defaultOperation, summary: 'pqr', operationId: 'get-users-abc'},
    },
  },
  components: {
    schemas: {},
    responses: {},
    parameters: {},
    examples: {},
    requestBodies: {},
    headers: {},
    securitySchemes: {},
    links: {},
    callbacks: {},
  },
  tags: [],
  servers: [],
};
